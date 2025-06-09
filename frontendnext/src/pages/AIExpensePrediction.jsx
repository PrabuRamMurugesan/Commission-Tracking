import React, { useState, useEffect } from "react";
import { Container, Table, Spinner, Alert, Form, Button } from "react-bootstrap";
import { Line } from "react-chartjs-2";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import "../styles/AIExpensePrediction.css"; // Importing CSS

const AIExpensePrediction = () => {
  const [expenseData, setExpenseData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [timeframe, setTimeframe] = useState("Monthly");

  useEffect(() => {
    fetchExpensePredictions();
  }, [timeframe]);

  const fetchExpensePredictions = async () => {
    try {
      const response = await axios.get(`/api/ai-expense-prediction?timeframe=${timeframe}`);
      setExpenseData(response.data);
      setLoading(false);
    } catch (err) {
      setError("Failed to load expense prediction data.");
      setLoading(false);
    }
  };

  const chartData = {
    labels: expenseData.map((data) => data.date),
    datasets: [
      {
        label: "Predicted Expenses ($)",
        data: expenseData.map((data) => data.predictedExpenses),
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        borderColor: "rgba(255, 99, 132, 1)",
        borderWidth: 2,
      },
    ],
  };

  return (
    <div className="ai-expense-prediction-container">
      <Sidebar />
      <Container fluid className="ai-expense-prediction-content">
        <h2 className="ai-expense-prediction-title">💰 AI Expense Prediction</h2>

        <Form className="mb-4">
          <Form.Group>
            <Form.Label>Select Timeframe</Form.Label>
            <Form.Select value={timeframe} onChange={(e) => setTimeframe(e.target.value)}>
              <option value="Monthly">Monthly</option>
              <option value="Quarterly">Quarterly</option>
              <option value="Yearly">Yearly</option>
            </Form.Select>
          </Form.Group>
        </Form>

        {/* Expense Forecast Chart */}
        {loading ? (
          <Spinner animation="border" />
        ) : error ? (
          <Alert variant="danger">{error}</Alert>
        ) : (
          <div className="expense-chart">
            <Line data={chartData} />
          </div>
        )}

        {/* Expense Prediction Data Table */}
        {!loading && !error && (
          <Table striped bordered hover responsive className="expense-table mt-4">
            <thead>
              <tr>
                <th>Date</th>
                <th>Predicted Expenses ($)</th>
              </tr>
            </thead>
            <tbody>
              {expenseData.map((data, index) => (
                <tr key={index}>
                  <td>{data.date}</td>
                  <td>{data.predictedExpenses}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Container>
      <style>
        {`
        .ai-expense-prediction-container {
  display: flex;
  height: 100vh;
}

.ai-expense-prediction-content {
  flex-grow: 1;
  padding: 20px;
  background-color: #f8f9fa;
}

.ai-expense-prediction-title {
  font-size: 24px;
  font-weight: bold;
  color: #333;
  margin-bottom: 20px;
}

.expense-chart {
  margin-bottom: 30px;
}

.expense-table th {
  background-color: #e74c3c;
  color: white;
  text-align: center;
}

.expense-table td {
  text-align: center;
  padding: 10px;
}
`}
      </style>
    </div>
  );
};

export default AIExpensePrediction;
