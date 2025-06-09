import React from 'react';

const Dashboard = () => {
  return (
    <div style={styles.container}>
      {/* Top Cards Section */}
      <div style={styles.cardsContainer}>
        <div style={{ ...styles.card, backgroundColor: '#17a2b8' }}>
          <h3>Total Purchase Due</h3>
          <p>-17684.50 $</p>
        </div>
        <div style={{ ...styles.card, backgroundColor: '#ffc107' }}>
          <h3>Total Sales Due</h3>
          <p>-6523.00 $</p>
        </div>
        <div style={{ ...styles.card, backgroundColor: '#28a745' }}>
          <h3>Total Sales Amount</h3>
          <p>529436.00 $</p>
        </div>
        <div style={{ ...styles.card, backgroundColor: '#dc3545' }}>
          <h3>Total Expense Amount</h3>
          <p>62500.00 $</p>
        </div>
      </div>

      {/* Purchase & Sales Chart Section */}
      <div style={styles.chartContainer}>
        <h3>Purchase & Sales Bar Chart</h3>
        <div style={styles.chartPlaceholder}>[Chart Placeholder]</div>
      </div>

      {/* Recently Added Items Section */}
      <div style={styles.tableContainer}>
        <h3>Recently Added Items</h3>
        <table style={styles.table}>
          <thead>
            <tr>
              <th>Sl.No</th>
              <th>Item Name</th>
              <th>Item Sales Price</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>1</td>
              <td>test3</td>
              <td>13.20 $</td>
            </tr>
            <tr>
              <td>2</td>
              <td>test1</td>
              <td>14.16 $</td>
            </tr>
            <tr>
              <td>3</td>
              <td>test</td>
              <td>9.36 $</td>
            </tr>
            <tr>
              <td>4</td>
              <td>gfdgfhg</td>
              <td>500.00 $</td>
            </tr>
            <tr>
              <td>5</td>
              <td>gfdgfgf</td>
              <td>59025.96 $</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: '20px',
    backgroundColor: '#f4f6f9',
    minHeight: '100vh',
    boxSizing: 'border-box',
  },
  cardsContainer: {
    display: 'flex',
    justifyContent: 'space-between',
     marginBottom: '20px',
     padding: '0 20px', // Add padding to the container for side space
     gap: '20px', // Add spacing between cards
     boxSizing: 'border-box',
 },
  card: {
    color: '#fff',
    padding: '30px',
    borderRadius: '8px',
    width: '24%',
    textAlign: 'center',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  chartContainer: {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    marginBottom: '20px',
  },
  chartPlaceholder: {
    height: '250px',
    backgroundColor: '#eaeaea',
    borderRadius: '4px',
    textAlign: 'center',
    lineHeight: '250px',
    color: '#888',
  },
  tableContainer: {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  th: {
    backgroundColor: '#2c3e50',
    color: '#fff',
    padding: '10px',
    textAlign: 'left',
  },
  td: {
    border: '1px solid #ddd',
    padding: '10px',
  },
};

export default Dashboard;
