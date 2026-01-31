// crmnext/scripts/import-transactions.js
// Node.js script to import transactions from JSON file
// Usage: node scripts/import-transactions.js <path-to-json-file> [clear]

const mongoose = require("mongoose");
const { Transaction } = require("../models/Transaction");
const fs = require("fs");
const path = require("path");

// Update with your MongoDB connection string
const MONGODB_URI = process.env.MONGODB_URI || process.env.MONGO_URI || "mongodb://localhost:27017/BBSlive";

// Helper function to convert MongoDB export format
const convertMongoDBExport = (data) => {
  if (Array.isArray(data)) {
    return data.map(convertMongoDBExport);
  }
  
  if (data && typeof data === "object") {
    const converted = {};
    for (const [key, value] of Object.entries(data)) {
      if (value && typeof value === "object" && !Array.isArray(value)) {
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

async function importTransactions() {
  try {
    const filePath = process.argv[2];
    const clear = process.argv[3] === "clear";

    if (!filePath) {
      console.error("❌ Please provide the path to the JSON file");
      console.log("Usage: node scripts/import-transactions.js <path-to-json-file> [clear]");
      console.log("Example: node scripts/import-transactions.js C:\\Users\\D\\Downloads\\BBSlive.transactions.json clear");
      process.exit(1);
    }

    console.log("📂 Reading JSON file...");
    const fullPath = path.resolve(filePath);
    
    if (!fs.existsSync(fullPath)) {
      console.error(`❌ File not found: ${fullPath}`);
      process.exit(1);
    }

    const fileContent = fs.readFileSync(fullPath, "utf8");
    const jsonData = JSON.parse(fileContent);
    
    console.log(`✅ Loaded ${Array.isArray(jsonData) ? jsonData.length : 0} transactions from file`);

    console.log("🔌 Connecting to MongoDB...");
    await mongoose.connect(MONGODB_URI);
    console.log("✅ Connected to MongoDB");

    if (clear) {
      const deleted = await Transaction.deleteMany({});
      console.log(`🗑️  Cleared ${deleted.deletedCount} existing transactions`);
    }

    // Convert MongoDB export format
    console.log("🔄 Converting data format...");
    const transactions = convertMongoDBExport(jsonData);

    if (!Array.isArray(transactions) || transactions.length === 0) {
      console.error("❌ No transactions found in file");
      process.exit(1);
    }

    // Remove __v field, keep _id
    const transactionsToInsert = transactions.map((txn) => {
      const { __v, ...rest } = txn;
      return rest;
    });

    console.log(`📥 Inserting ${transactionsToInsert.length} transactions...`);
    const inserted = await Transaction.insertMany(transactionsToInsert, {
      ordered: false, // Continue even if some fail
    });

    const summary = {
      orders: inserted.length,
      revenue: inserted.reduce((sum, txn) => sum + (txn.finalAmount || txn.amount || 0), 0),
      quantity: inserted.reduce((sum, txn) => sum + (txn.totalQuantity || 1), 0),
    };

    console.log("\n✅ Successfully imported transactions!");
    console.log(`   Total Records: ${summary.orders}`);
    console.log(`   Total Revenue: ₹${summary.revenue.toFixed(2)}`);
    console.log(`   Total Quantity: ${summary.quantity}`);

    await mongoose.connection.close();
    console.log("\n✅ Database connection closed");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error importing transactions:", error.message);
    
    if (error.code === 11000) {
      console.error("\n⚠️  Some transactions already exist. Run with 'clear' argument to replace them:");
      console.error(`   node scripts/import-transactions.js "${process.argv[2]}" clear`);
    }
    
    process.exit(1);
  }
}

importTransactions();
