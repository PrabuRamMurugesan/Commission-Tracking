# Dummy Sales Data Generator

## Overview
This document explains how to add dummy sales data to your CRM database for testing the Sales Report functionality.

## Files Created

1. **`crmnext/pages/api/reports/sales.js`** - Main sales report API endpoint
2. **`crmnext/pages/api/reports/seed-sales-data.js`** - API endpoint to seed database with sales data
3. **`crmnext/scripts/seed-sales-data.js`** - Node.js script to seed database
4. **`crmnext/dummy-sales-data.json`** - Sample JSON data structure for reference

## How to Add Sales Data to Database

### Option 1: Using the API Endpoint (Easiest - Recommended)

1. **Start your Next.js backend server** (if not already running):
   ```bash
   cd crmnext
   npm run dev
   ```

2. **Make a POST request** to seed the database:
   
   **Using curl:**
   ```bash
   curl -X POST http://localhost:3000/api/reports/seed-sales-data \
     -H "Content-Type: application/json" \
     -d '{"count": 50, "clear": false}'
   ```

   **Using Postman/Thunder Client:**
   - URL: `http://localhost:3000/api/reports/seed-sales-data`
   - Method: `POST`
   - Headers: `Content-Type: application/json`
   - Body (JSON):
     ```json
     {
       "count": 50,
       "clear": false
     }
     ```

   **Using Browser Console:**
   ```javascript
   fetch('http://localhost:3000/api/reports/seed-sales-data', {
     method: 'POST',
     headers: {
       'Content-Type': 'application/json',
     },
     body: JSON.stringify({ count: 50, clear: false })
   })
   .then(res => res.json())
   .then(data => {
     console.log('✅ Success:', data);
     alert(`Successfully added ${data.count} sales transactions!`);
   })
   .catch(err => console.error('❌ Error:', err));
   ```

   **Parameters:**
   - `count` (optional): Number of sales records to generate (default: 50)
   - `clear` (optional): Set to `true` to clear existing data before inserting (default: false)

### Option 2: Using Browser (Easiest - No Code Required)

1. **Open the seed page in your browser:**
   ```
   http://localhost:3000/seed-sales-data.html
   ```
   (Make sure your Next.js backend server is running)

2. **Fill in the form:**
   - Enter the number of records (default: 50)
   - Check "Clear existing data" if you want to replace all data
   - Click "Seed Database"

3. **Wait for confirmation** - You'll see a success message with summary

### Option 3: Using Node.js Script

1. **Run the seed script:**
   ```bash
   cd crmnext
   node scripts/seed-sales-data.js 50
   ```

   To clear existing data first:
   ```bash
   node scripts/seed-sales-data.js 50 clear
   ```

2. **The script will:**
   - Connect to MongoDB
   - Generate dummy sales data
   - Insert into the database
   - Show a summary of inserted data

### Option 2: Import JSON Data Directly

You can use the sample data from `dummy-sales-data.json` as a reference for the expected data structure.

## Data Structure

Each sales transaction includes:
- **Order Information**: orderId, transactionId, date
- **Platform**: BBSCART, Golddex, or Thiaworld
- **Seller Information**: sellerName, sellerRole (Vendor, Agent, CBAV, Franchisee)
- **Buyer Information**: buyerName, buyerPhone
- **Products**: Array of products with title, quantity, and price
- **Payment Details**: paymentStatus, paymentMethod, orderStatus
- **GST Information**: gstType, cgst, sgst, igst, totalGSTAmount
- **Financials**: finalAmount, commission percentage
- **Payout Status**: paid, pending, or on-hold

## Testing the Sales Report

1. Generate dummy data using the API endpoint above
2. Navigate to `/sales` in your frontend application
3. The sales report should display all generated transactions
4. Use the filters to test different scenarios:
   - Date range filtering
   - Platform filtering
   - Seller role filtering
   - Payment status filtering
   - Order status filtering
   - Search by Order ID or Transaction ID

## Notes

- The dummy data generator creates realistic sales transactions with random values
- Dates are randomly distributed within the last 30 days
- GST calculations are automatically computed based on GST type
- Commission percentages range from 2% to 12%
- All data is inserted into the MongoDB `Transaction` collection
