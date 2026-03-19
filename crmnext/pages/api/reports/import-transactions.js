// crmnext/pages/api/reports/import-transactions.js
// This endpoint imports transactions from JSON data into MongoDB
import dbConnect from "../../../lib/mongodb";
const { Transaction } = require("../../../models/Transaction");
const mongoose = require("mongoose");
import allowCors from "../../../middleware/cors";
// Helper function to convert MongoDB export format to regular format
const convertMongoDBExport = (data) => {
  if (Array.isArray(data)) {
    return data.map(convertMongoDBExport);
  }
  
  if (data && typeof data === "object") {
    const converted = {};
    for (const [key, value] of Object.entries(data)) {
      if (value && typeof value === "object" && !Array.isArray(value)) {
        // Handle MongoDB export format
        if (value.$oid) {
          // Convert to ObjectId if it's _id, otherwise keep as string
          converted[key] = key === "_id" ? new mongoose.Types.ObjectId(value.$oid) : value.$oid;
        } else if (value.$date) {
          converted[key] = new Date(value.$date);
        } else {
          converted[key] = convertMongoDBExport(value);
        }
      } else if (Array.isArray(value)) {
        converted[key] = convertMongoDBExport(value);
      } else {
        converted[key] = value;
      }
    }
    return converted;
  }
  
  return data;
};

async function handler(req, res) {
 if (req.method !== "POST") {
    res.setHeader("Allow", "POST,OPTIONS");
    return res.status(405).json({ message: "Method Not Allowed" });
  }
  try {
    await dbConnect();

    const { clear = false, transactions: transactionsData } = req.body;

    // Validate input
    if (!transactionsData || !Array.isArray(transactionsData)) {
      return res.status(400).json({
        success: false,
        message: "Please provide 'transactions' array in request body",
      });
    }

    // Clear existing transactions if requested
    if (clear === true) {
      const deleted = await Transaction.deleteMany({});
      console.log(`Cleared ${deleted.deletedCount} existing transactions`);
    }

    // Convert MongoDB export format
    const transactions = convertMongoDBExport(transactionsData);

    if (!Array.isArray(transactions) || transactions.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No transactions found to import",
      });
    }

    // Remove __v field, keep _id if it exists
    const transactionsToInsert = transactions.map((txn) => {
      const { __v, ...rest } = txn;
      // _id is already converted to ObjectId in convertMongoDBExport
      return rest;
    });

    // Insert transactions
    const inserted = await Transaction.insertMany(transactionsToInsert, {
      ordered: false, // Continue inserting even if some fail
    });

    // Calculate summary
    const summary = {
      orders: inserted.length,
      revenue: inserted.reduce((sum, txn) => sum + (txn.finalAmount || txn.amount || 0), 0),
      quantity: inserted.reduce((sum, txn) => sum + (txn.totalQuantity || 1), 0),
    };

    res.status(200).json({
      success: true,
      message: `Successfully imported ${inserted.length} transactions into the database`,
      count: inserted.length,
      summary: summary,
      sample: inserted.slice(0, 3).map((txn) => ({
        orderId: txn.orderId,
        transactionId: txn.transactionId,
        platform: txn.platform,
        sellerName: txn.sellerName,
        finalAmount: txn.finalAmount,
      })),
    });
  } catch (error) {
    console.error("Error importing transactions:", error);
    
    // Handle duplicate key errors
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Some transactions already exist. Use 'clear: true' to replace them.",
        error: error.message,
      });
    }

    res.status(500).json({
      success: false,
      message: "Error importing transactions",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
}

export default allowCors(handler);