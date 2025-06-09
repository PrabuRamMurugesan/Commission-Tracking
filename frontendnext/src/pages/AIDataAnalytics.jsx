import React, { useState, useEffect } from "react";
import { Container, Table, Spinner, Alert, ProgressBar, Button } from "react-bootstrap";
import axios from "axios";
import { Line, Bar, Pie } from "react-chartjs-2";
import Sidebar from "../components/Sidebar";
import "../styles/AIDataAnalytics.css"; // Importing CSS

const AIDataAnalytics = () => {
  const [analyticsData, setAnalyticsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchAnalyticsData();
  }, []);

  const fetchAnalyticsData = async () => {
    try {
      const response = await axios.get("/api/ai-data-analytics");
      setAnalyticsData(response.data);
      setLoading(false);
    } catch (err) {
      setError("Failed to load analytics data.");
      setLoading(false);
    }
  };

  return (
    <div className="ai-data-analytics-container">
      <Sidebar />
      <Container fluid className="ai-data-analytics-content">
        <h2 className="ai-data-analytics-title">📊 AI Data Analytics</h2>

        {/* Analytics Metrics Table */}
        {loading ? (
          <Spinner animation="border" />
        ) : error ? (
          <Alert variant="danger">{error}</Alert>
        ) : (
          <>
            <Table striped bordered hover responsive className="analytics-table mt-4">
              <thead>
                <tr>
                  <th>Metric</th>
                  <th>Current Value</th>
                  <th>Trend</th>
                </tr>
              </thead>
              <tbody>
                {analyticsData.map((data, index) => (
                  <tr key={index}>
                    <td>{data.metricName}</td>
                    <td>{data.currentValue}</td>
                    <td>
                      <ProgressBar
                        now={data.trend}
                        label={`${data.trend}%`}
                        variant={data.trend > 80 ? "success" : data.trend > 50 ? "warning" : "danger"}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>

            {/* Data Visualization Charts */}
            <div className="charts">
              <div className="chart-container">
                <h4>Revenue Growth</h4>
                <Line
                  data={{
                    labels: analyticsData.map((data) => data.date),
                    datasets: [
                      {
                        label: "Revenue",
                        data: analyticsData.map((data) => data.revenue),
                        backgroundColor: "rgba(75, 192, 192, 0.5)",
                        borderColor: "rgba(75, 192, 192, 1)",
                        borderWidth: 1,
                      },
                    ],
                  }}
                />
              </div>

              <div className="chart-container">
                <h4>Customer Acquisition</h4>
                <Bar
                  data={{
                    labels: analyticsData.map((data) => data.date),
                    datasets: [
                      {
                        label: "New Customers",
                        data: analyticsData.map((data) => data.newCustomers),
                        backgroundColor: "rgba(255, 159, 64, 0.5)",
                        borderColor: "rgba(255, 159, 64, 1)",
                        borderWidth: 1,
                      },
                    ],
                  }}
                />
              </div>

              <div className="chart-container">
                <h4>Sales Performance</h4>
                <Pie
                  data={{
                    labels: ["Product A", "Product B", "Product C"],
                    datasets: [
                      {
                        label: "Sales Share",
                        data: [30, 50, 20],
                        backgroundColor: ["#3498db", "#e74c3c", "#f1c40f"],
                      },
                    ],
                  }}
                />
              </div>
            </div>
          </>
        )}
      </Container>
      <style>
        {`
        .ai-data-analytics-container {
  display: flex;
  height: 100vh;
}

.ai-data-analytics-content {
  flex-grow: 1;
  padding: 20px;
  background-color: #f8f9fa;
}

.ai-data-analytics-title {
  font-size: 24px;
  font-weight: bold;
  color: #333;
  margin-bottom: 20px;
}

.analytics-table th {
  background-color: #16a085;
  color: white;
  text-align: center;
}

.analytics-table td {
  text-align: center;
  padding: 10px;
}

.charts {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}

.chart-container {
  width: 30%;
}
`}
      </style>
    </div>
  );
};

export default AIDataAnalytics;
