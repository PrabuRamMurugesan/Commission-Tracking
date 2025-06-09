import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Table,
  Spinner,
  Badge,
  Button,
} from "react-bootstrap";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import { Doughnut, Bar } from "react-chartjs-2";

const AIAutomatedExpenseTracking = () => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchExpenseData();
  }, []);

  const fetchExpenseData = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await axios.get("/api/ai-expense-tracking");

      if (Array.isArray(response.data)) {
        setExpenses(response.data);
      } else {
        throw new Error("Invalid data format");
      }

      setLoading(false);
    } catch (err) {
      console.error("API Error:", err.message);
      setError("Failed to fetch expense data. Showing mock data.");

      // Set fallback mock data
      const mockExpenses = [
        { category: "Utilities", amount: 200, percentage: 25 },
        { category: "Transport", amount: 150, percentage: 18 },
        { category: "Rent", amount: 500, percentage: 45 },
        { category: "customer", amount: 100, percentage: 12 },
      ];

      setExpenses(mockExpenses);
      setLoading(false);
    }
  };

  const chartData = {
    labels: expenses.map((data) => data.category),
    datasets: [
      {
        label: "Expense Amount ($)",
        data: expenses.map((data) => data.amount),
        backgroundColor: [
          "#e74c3c",
          "#f1c40f",
          "#3498db",
          "#9b59b6",
          "#2ecc71",
        ],
      },
    ],
  };

  const totalExpense = expenses.reduce((sum, item) => sum + item.amount, 0);

  return (
    <div className="ai-expense-tracking-container">
      <Sidebar />
      <Container fluid className="ai-expense-tracking-content">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2 className="ai-expense-tracking-title">
            📉 AI-Powered Expense Tracking
          </h2>
          <Button variant="secondary" onClick={fetchExpenseData}>
            🔄 Refresh
          </Button>
        </div>

        {loading ? (
          <div className="d-flex justify-content-center align-items-center" style={{ height: "300px" }}>
            <Spinner animation="border" variant="primary" />
          </div>
        ) : (
          <>
            {error && <p className="text-danger">{error}</p>}

            <Row>
              <Col md={6}>
                <Card className="chart-card">
                  <Card.Body>
                    <h5>Expense Distribution</h5>
                    <Doughnut data={chartData} />
                  </Card.Body>
                </Card>
              </Col>
              <Col md={6}>
                <Card className="chart-card">
                  <Card.Body>
                    <h5>Monthly Expense Trend</h5>
                    <Bar data={chartData} className="bar-chart" />
                  </Card.Body>
                </Card>
              </Col>
            </Row>

            <Card className="mt-4">
              <Card.Body>
                <h5 className="mb-3">💵 Expense Breakdown</h5>
                <Table striped bordered hover responsive className="expense-table">
                  <thead>
                    <tr>
                      <th>Category</th>
                      <th>Amount ($)</th>
                      <th>Percentage</th>
                    </tr>
                  </thead>
                  <tbody>
                    {expenses.map((data, index) => (
                      <tr key={index}>
                        <td>{data.category}</td>
                        <td>${data.amount.toFixed(2)}</td>
                        <td>
                          <Badge bg="info">{data.percentage}%</Badge>
                        </td>
                      </tr>
                    ))}
                    <tr className="table-secondary fw-bold">
                      <td>Total</td>
                      <td>${totalExpense.toFixed(2)}</td>
                      <td>-</td>
                    </tr>
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          </>
        )}
      </Container>

      <style>
        {`
        .ai-expense-tracking-container {
          display: flex;
          height: 100vh;
          width: 100vw;
        }

        .ai-expense-tracking-content {
       
          padding: 7% 20px;
          background-color: #f8f9fa;
          overflow-y: scroll;
          width: 100%;
          height: 100vh;
        }

        .ai-expense-tracking-title {
          font-size: 24px;
          font-weight: bold;
          color: #333;
        }

        .chart-card {
          background: #fff;
          padding: 20px;
          border-radius: 10px;
          box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
          margin-bottom: 20px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          height: 100%;
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
          .bar-chart {
            height: 70%;
            width: 100%;
            padding: 20px;
            border-radius: 10px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-self: end;
          }

          @media (max-width: 768px) {
            .ai-expense-tracking-content {
              padding: 7rem 20px;
            }
             h5{
             display: flex;
             justify-content: center;
             }
          }
        `}
      </style>
    </div>
  );
};

export default AIAutomatedExpenseTracking;
