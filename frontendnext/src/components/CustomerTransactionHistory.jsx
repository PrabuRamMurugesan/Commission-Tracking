import React, { useState } from "react";

const CustomerTransactionHistory = () => {
  // Sample customer data list
  const customers = [
    {
      id: 1,
      userType: "Customer", // Added user type
      firstName: "John",
      lastName: "Doe",
      mobile: "9876543210",
      aadhaar: "1234-5678-9101",
      pan: "ABCDE1234F",
      bankDetails: "Bank of XYZ, Account: 1234567890",
      criminalHistory: "No",
      profileImage: require('./Images/a1.jpg'),
      transactionHistory: [
        {
          date: "2024-12-01",
          amount: "$200",
          status: "Completed",
          details: "Purchase of gold jewelry",
        },
        {
          date: "2024-12-10", 
          amount: "$150",
          status: "Pending",
          details: "Purchase of earrings",
        },
      ],
    },
    {
      id: 2,
      userType: "Customer", // Added user type
      firstName: "Jane",
      lastName: "Smith",
      mobile: "9876543222",
      aadhaar: "5678-9101-1234",
      pan: "FGHIJ5678K",
      bankDetails: "Bank of ABC, Account: 0987654321",
      criminalHistory: "Yes",
      profileImage: require('./Images/h1.jpg'),
      transactionHistory: [
        {
          date: "2024-11-05",
          amount: "$500",
          status: "Completed",
          details: "Purchase of diamond necklace",
        },
      ],
    },

    {
      id: 3,
      userType: "Customer", // Added user type
      firstName: "Sai",
      lastName: "Kavya",
      mobile: "9988774455",
      aadhaar: "1234-5678-9101",
      pan: "ABCDE1234F",
      bankDetails: "Bank of XYZ, Account: 1234567890",
      criminalHistory: "No",
      profileImage: require('./Images/a1.jpg'),
      transactionHistory: [
        {
          date: "2024-12-01",
          amount: "₹125000",
          status: "Completed",
          details: "Purchase of gold Ring",
        },
        {
          date: "2024-12-10", 
          amount: "₹150000",
          status: "Completed",
          details: "Purchase of Gold Chain",
        },
        {
          date: "2024-12-23", 
          amount: "₹50000",
          status: "Completed",
          details: "Purchase of Gold Chain - 3.5 grams",
        },
      ],
    },
  ];
  

  // State to track the selected customer
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Customer Transaction History</h1>
      <h2>Agent Name: <span style={{color:"red"}}>John</span></h2>

      {/* Customer List */}
      <h3 style={styles.subTitle}>Customer List</h3>
      <ul style={styles.customerList}>
        {customers.map((customer) => (
          <li
            key={customer.id}
            style={styles.customerListItem}
            onClick={() => setSelectedCustomer(customer)} // Set selected customer
          >
            {customer.firstName} {customer.lastName}
          </li>
        ))}
      </ul>

      {/* Selected Customer Details */}
      {selectedCustomer && (
        <div>
          <h2 style={styles.subTitle}>Customer Details</h2>
          <div style={styles.customerInfo}>
            <div style={styles.info}>
              {/* Profile Picture */}
              <img
                src={selectedCustomer.profileImage}
                alt={`${selectedCustomer.firstName} ${selectedCustomer.lastName}`}
                style={styles.profileImage}
              />
              <p>
                <strong>Register as:</strong> {selectedCustomer.userType}
              </p>
              <p>
                <strong>Name:</strong> {selectedCustomer.firstName}{" "}
                {selectedCustomer.lastName}
              </p>
              <p>
                <strong>Mobile:</strong> {selectedCustomer.mobile}
              </p>
              <p>
                <strong>Aadhaar:</strong> {selectedCustomer.aadhaar}
              </p>
              <p>
                <strong>PAN:</strong> {selectedCustomer.pan}
              </p>
              <p>
                <strong>Bank Details:</strong> {selectedCustomer.bankDetails}
              </p>
              <p>
                <strong>Criminal History:</strong>{" "}
                {selectedCustomer.criminalHistory}
              </p>
            </div>
          </div>

          {/* Transaction History */}
          <h2 style={styles.subTitle}>Transaction History</h2>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.tableHeader}>Date</th>
                <th style={styles.tableHeader}>Amount</th>
                <th style={styles.tableHeader}>Status</th>
                <th style={styles.tableHeader}>Details</th>
              </tr>
            </thead>
            <tbody>
              {selectedCustomer.transactionHistory.map((transaction, index) => (
                <tr key={index} style={styles.tableRow}>
                  <td style={styles.tableCell}>{transaction.date}</td>
                  <td style={styles.tableCell}>{transaction.amount}</td>
                  <td style={styles.tableCell}>{transaction.status}</td>
                  <td style={styles.tableCell}>{transaction.details}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    padding: "20px",
    fontFamily: "Arial, sans-serif",
    backgroundColor: "#f4f4f4",
    minHeight: "100vh",
  },
  title: {
    textAlign: "center",
    marginBottom: "20px",
    color: "#2c3e50",
  },
  subTitle: {
    marginBottom: "10px",
    color: "#34495e",
  },
  customerList: {
    listStyleType: "none",
    padding: 0,
    marginBottom: "20px",
  },
  customerListItem: {
    padding: "10px",
    margin: "5px 0",
    backgroundColor: "#ffffff",
    borderRadius: "5px",
    boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
    cursor: "pointer",
  },
  customerInfo: {
    backgroundColor: "#ffffff",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
    marginBottom: "20px",
  },
  info: {
    lineHeight: "1.8",
  },
  profileImage: {
    width: "150px",
    height: "200px",
    borderRadius: "3%",
    objectFit: "cover",
    marginBottom: "20px",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    backgroundColor: "#ffffff",
    borderRadius: "10px",
    overflow: "hidden",
    boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
  },
  tableHeader: {
    backgroundColor: "#2c3e50",
    color: "#ffffff",
    padding: "10px",
    textAlign: "left",
  },
  tableRow: {
    borderBottom: "1px solid #ddd",
  },
  tableCell: {
    padding: "10px",
    textAlign: "left",
  },
};

export default CustomerTransactionHistory;
