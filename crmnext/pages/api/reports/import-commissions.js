// pages/api/reports/import-commissions.js
import dbConnect from "../../../lib/mongodb";
import Commission from "../../../models/Commission";
import handleCors from "../../../lib/cors";
import mongoose from "mongoose";

// Helper function to convert MongoDB export format to Mongoose format
function convertMongoDBExport(data) {
  if (Array.isArray(data)) {
    return data.map(convertMongoDBExport);
  }

  if (data && typeof data === "object") {
    const converted = {};
    for (const [key, value] of Object.entries(data)) {
      if (key === "_id" && value && value.$oid) {
        converted[key] = new mongoose.Types.ObjectId(value.$oid);
      } else if (value && value.$date) {
        converted[key] = new Date(value.$date);
      } else if (value && typeof value === "object" && !Array.isArray(value)) {
        // Handle nested objects (like ObjectId references)
        if (value.$oid) {
          converted[key] = new mongoose.Types.ObjectId(value.$oid);
        } else {
          converted[key] = convertMongoDBExport(value);
        }
      } else if (Array.isArray(value)) {
        converted[key] = value.map(convertMongoDBExport);
      } else {
        converted[key] = value;
      }
    }
    return converted;
  }

  return data;
}

export default async function handler(req, res) {
  await handleCors(req, res);

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    await dbConnect();

    const { commissions, clear = false } = req.body;

    if (!commissions || !Array.isArray(commissions)) {
      return res.status(400).json({ 
        success: false, 
        message: "Invalid request. Expected 'commissions' array in request body." 
      });
    }

    // Clear existing data if requested
    if (clear) {
      const deleteResult = await Commission.deleteMany({});
      console.log(`🗑️ Deleted ${deleteResult.deletedCount} existing commission records`);
    }

    // Convert MongoDB export format to Mongoose format
    const convertedCommissions = convertMongoDBExport(commissions);

    // Insert commissions
    const result = await Commission.insertMany(convertedCommissions, { ordered: false });

    // Calculate summary
    const summary = {
      total: result.length,
      totalAmount: convertedCommissions.reduce((sum, comm) => sum + (comm.amount || 0), 0),
      platforms: [...new Set(convertedCommissions.map(c => c.platform))],
      roles: [...new Set(convertedCommissions.map(c => c.role))],
    };

    console.log(`✅ Successfully imported ${result.length} commission records`);

    res.status(200).json({
      success: true,
      message: `Successfully imported ${result.length} commission records`,
      inserted: result.length,
      summary: summary,
    });
  } catch (error) {
    console.error("❌ Commission Import Error:", error);

    // Handle duplicate key errors gracefully
    if (error.code === 11000) {
      const insertedCount = error.result?.insertedCount || 0;
      return res.status(200).json({
        success: true,
        message: `Imported ${insertedCount} commission records. Some duplicates were skipped.`,
        inserted: insertedCount,
        duplicatesSkipped: commissions.length - insertedCount,
      });
    }

    res.status(500).json({
      success: false,
      message: "Error importing commission data",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
}
