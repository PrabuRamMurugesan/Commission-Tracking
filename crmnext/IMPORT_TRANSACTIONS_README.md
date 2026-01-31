# Import Transactions from JSON File

## Overview
This guide explains how to import transactions from your `BBSlive.transactions.json` file into the CRM database.

## Files Created

1. **`crmnext/pages/api/reports/import-transactions.js`** - API endpoint to import transactions
2. **`crmnext/scripts/import-transactions.js`** - Node.js script to import from command line
3. **`crmnext/public/import-transactions.html`** - Browser-based import tool

## How to Import Transactions

### Option 1: Using Browser (Easiest - Recommended)

1. **Start your backend server:**
   ```bash
   cd crmnext
   npm run dev
   ```

2. **Open the import page:**
   ```
   http://localhost:3000/import-transactions.html
   ```

3. **Select your JSON file:**
   - Click "Choose File" and select `BBSlive.transactions.json`
   - The file info will be displayed

4. **Choose import options:**
   - Check "Clear existing transactions" if you want to replace all data
   - Leave unchecked to add to existing data

5. **Click "Import Transactions"**
   - Wait for the import to complete
   - You'll see a success message with summary

### Option 2: Using Node.js Script

1. **Run the import script:**
   ```bash
   cd crmnext
   node scripts/import-transactions.js "C:\Users\D\Downloads\BBSlive.transactions.json"
   ```

2. **To clear existing data first:**
   ```bash
   node scripts/import-transactions.js "C:\Users\D\Downloads\BBSlive.transactions.json" clear
   ```

### Option 3: Using API Endpoint (Postman/Thunder Client)

1. **POST Request to:**
   ```
   http://localhost:3000/api/reports/import-transactions
   ```

2. **Request Body (JSON):**
   ```json
   {
     "transactions": [/* paste your JSON array here */],
     "clear": false
   }
   ```

   **Note:** Copy the entire content of your `BBSlive.transactions.json` file and paste it as the `transactions` array value.

## Data Format

The import script automatically handles MongoDB export format:
- Converts `{"$oid": "..."}` to ObjectId
- Converts `{"$date": "..."}` to Date objects
- Removes `__v` field
- Preserves `_id` if present

## After Import

Once imported, the transactions will be available in:

1. **Sales Report** (`/sales`):
   - Shows detailed sales transactions
   - Includes filters for platform, seller role, payment status, etc.
   - Supports Excel export

2. **Transactions Page** (`/dashboard/transactions`):
   - Shows transaction list
   - Includes search and filter options

## Verify Import

Check MongoDB to verify:
```javascript
// In MongoDB shell or Compass
use BBSlive
db.transactions.count()  // Should show imported count
db.transactions.findOne()  // View a sample transaction
```

## Troubleshooting

### Error: "File not found"
- Make sure the file path is correct
- Use absolute path or relative path from project root

### Error: "Some transactions already exist"
- Use `clear: true` option to replace existing data
- Or remove duplicate `_id` fields from JSON before importing

### Error: "Invalid JSON file"
- Make sure the file is valid JSON
- Should be an array of transaction objects
- Check for syntax errors

## Notes

- The import preserves original `_id` values from the JSON file
- Dates are automatically converted from MongoDB export format
- The import continues even if some records fail (non-ordered insert)
- Large files may take a few minutes to import
