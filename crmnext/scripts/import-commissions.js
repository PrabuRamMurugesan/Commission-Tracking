// scripts/import-commissions.js
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env.local") });

const Commission = require("../models/Commission");

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

async function importCommissions() {
  try {
    // Connect to MongoDB
    const mongoUri = process.env.MONGO_URI || "mongodb://localhost:27017/BBSlive";
    await mongoose.connect(mongoUri);
    console.log("✅ Connected to MongoDB");

    // Read JSON file
    const filePath = process.argv[2] || path.join(__dirname, "../dummy-commission-data.json");
    if (!fs.existsSync(filePath)) {
      console.error(`❌ File not found: ${filePath}`);
      process.exit(1);
    }

    const fileContent = fs.readFileSync(filePath, "utf8");
    const commissions = JSON.parse(fileContent);

    if (!Array.isArray(commissions)) {
      console.error("❌ Invalid JSON format. Expected an array of commissions.");
      process.exit(1);
    }

    console.log(`📄 Read ${commissions.length} commission records from file`);

    // Check for clear flag
    const clear = process.argv.includes("--clear");

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

    console.log("\n✅ Import Summary:");
    console.log(`   Total Records: ${summary.total}`);
    console.log(`   Total Commission Amount: ₹${summary.totalAmount.toFixed(2)}`);
    console.log(`   Platforms: ${summary.platforms.join(", ")}`);
    console.log(`   Roles: ${summary.roles.join(", ")}`);

    await mongoose.disconnect();
    console.log("\n✅ Disconnected from MongoDB");
    process.exit(0);
  } catch (error) {
    console.error("❌ Import Error:", error);

    // Handle duplicate key errors gracefully
    if (error.code === 11000) {
      const insertedCount = error.result?.insertedCount || 0;
      console.log(`\n⚠️ Imported ${insertedCount} records. Some duplicates were skipped.`);
    }

    await mongoose.disconnect();
    process.exit(1);
  }
}

// Run import
importCommissions();
