# Import Commission Data

This guide explains how to import commission data into the CRM database.

## Methods

### Method 1: Browser HTML Page (Easiest)

1. Start your Next.js server:
   ```bash
   cd crmnext
   npm run dev
   ```

2. Open your browser and navigate to:
   ```
   http://localhost:3000/import-commissions.html
   ```

3. Select the JSON file (`dummy-commission-data.json` or your own file)

4. Optionally check "Clear existing commission data before importing" to delete all existing commissions

5. Click "Import Commissions"

### Method 2: Node.js Script (Command Line)

1. Navigate to the `crmnext` directory:
   ```bash
   cd crmnext
   ```

2. Run the import script:
   ```bash
   node scripts/import-commissions.js [path-to-json-file]
   ```

   Example:
   ```bash
   # Use default file (dummy-commission-data.json)
   node scripts/import-commissions.js

   # Use custom file
   node scripts/import-commissions.js /path/to/your/commissions.json

   # Clear existing data before importing
   node scripts/import-commissions.js --clear
   ```

### Method 3: API Endpoint (Programmatic)

Make a POST request to `/api/reports/import-commissions`:

```javascript
const commissions = [
  {
    "_id": { "$oid": "..." },
    "commissionId": "COMM-2026-001",
    "platform": "BBSCART",
    "role": "Agent",
    "sellerName": "Agent Name",
    "rate": 5.5,
    "amount": 275.50,
    "payoutStatus": "Pending",
    "transactionId": "TXN-001",
    "orderId": "ORD-001",
    "date": { "$date": "2026-01-15T10:30:00.000Z" }
  },
  // ... more commissions
];

fetch('/api/reports/import-commissions', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    commissions: commissions,
    clear: false // Set to true to delete existing data first
  })
})
.then(res => res.json())
.then(data => console.log(data));
```

## JSON File Format

The JSON file should be an array of commission objects. Each commission should follow the Commission model schema:

```json
[
  {
    "_id": { "$oid": "65a1b2c3d4e5f6a7b8c9d0e1" },
    "commissionId": "COMM-2026-001",
    "vendorId": null,
    "agentId": { "$oid": "697c88428b861fb4b0dec786" },
    "franchiseeId": null,
    "cbavId": null,
    "platform": "BBSCART",
    "role": "Agent",
    "sellerName": "Agent Name",
    "buyerName": "Buyer Name",
    "buyerPhone": "9876543210",
    "rate": 5.5,
    "amount": 275.50,
    "payoutStatus": "Pending",
    "transactionId": "TXN-2026-001234",
    "orderId": "ORD-2026-001234",
    "date": { "$date": "2026-01-15T10:30:00.000Z" }
  }
]
```

### Required Fields:
- `commissionId`: Unique commission identifier (string)
- `platform`: "BBSCART" or "Golddex"
- `role`: "Vendor", "Agent", "Franchisee", or "CBAV"
- `sellerName`: Name of the seller (string)
- `rate`: Commission percentage (number, e.g., 5.5 for 5.5%)
- `amount`: Commission amount (number)
- `transactionId`: Transaction ID (string)
- `orderId`: Order ID (string)

### Optional Fields:
- `vendorId`, `agentId`, `franchiseeId`, `cbavId`: ObjectId references
- `buyerName`, `buyerPhone`: Buyer information
- `payoutStatus`: "Paid" or "Pending" (default: "Pending")
- `date`: Commission date (defaults to current date)

## Sample Data

A sample JSON file with 15 commission records is available at:
```
crmnext/dummy-commission-data.json
```

## Notes

- The import script automatically converts MongoDB export format (`$oid`, `$date`) to Mongoose format
- Duplicate `commissionId` values will be skipped (not cause errors)
- Use the `--clear` flag or `clear: true` option to delete all existing commissions before importing
- The commission report API has been updated to transform data for the frontend (mapping `amount` → `commissionAmount`, `rate` → `commissionPercent`)
