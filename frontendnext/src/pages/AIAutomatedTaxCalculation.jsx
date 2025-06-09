import React, { useState, useEffect } from "react";
import {
  Container,
  Table,
  Spinner,
  Alert,
  Form,
  Button,
} from "react-bootstrap";
import axios from "axios";
import Sidebar from "../components/Sidebar";

const AIAutomatedTaxCalculation = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [taxType, setTaxType] = useState("GST");

  useEffect(() => {
    fetchTaxCalculations();
  }, [taxType]);

  const fetchTaxCalculations = async () => {
    try {
      const response = await axios.get(`/api/ai-tax-calculation?taxType=${taxType}`);
      const data = response.data;

      // Ensure it is an array before setting
      if (Array.isArray(data)) {
        setTransactions(data);
      } else if (data && typeof data === "object") {
        setTransactions([data]);
      } else {
        setTransactions([]);
        setError("Invalid data format from server.");
      }

      setLoading(false);
    } catch (err) {
      setError("Failed to load tax calculations.");
      setLoading(false);
    }
  };

  return (
    <div className="ai-tax-calculation-container">
      <Sidebar />
      <Container fluid className="ai-tax-calculation-content">
        <h2 className="ai-tax-calculation-title">📊 AI Automated Tax Calculation</h2>

        <Form className="mb-4">
          <Form.Group>
            <Form.Label>Select Tax Type</Form.Label>
            <Form.Select value={taxType} onChange={(e) => setTaxType(e.target.value)}>
              <option value="GST">GST</option>
              <option value="VAT">VAT</option>
              <option value="Service Tax">Service Tax</option>
            </Form.Select>
          </Form.Group>
        </Form>

        {loading ? (
          <div className="d-flex justify-content-center align-items-center" style={{ height: "60vh" }}>
            <Spinner animation="border" />
          </div>
        ) : error ? (
          <Alert variant="danger">{error}</Alert>
        ) : transactions.length === 0 ? (
          <Alert variant="warning">No tax calculations found for {taxType}.</Alert>
        ) : (
          <Table striped bordered hover responsive className="tax-table mt-4">
            <thead>
              <tr>
                <th>Transaction ID</th>
                <th>Amount ($)</th>
                <th>Tax Type</th>
                <th>Tax (%)</th>
                <th>Calculated Tax ($)</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((data, index) => (
                <tr key={index}>
                  <td>{data.transactionId || "N/A"}</td>
                  <td>{data.amount ?? "0.00"}</td>
                  <td>{data.taxType || taxType}</td>
                  <td>{data.taxPercentage ?? 0}%</td>
                  <td>{data.calculatedTax ?? "0.00"}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Container>

      <style>
        {`
        .ai-tax-calculation-container {
          display: flex;
          height: 100vh;
          width: 100vw;
        }

        .ai-tax-calculation-content {
          width: 100%;
          height: 100%;
          padding: 8% 20px;
        }

        .ai-tax-calculation-title {
          font-size: 28px;
          font-weight: bold;
          color: #333;
          margin-bottom: 20px;
        }

        .tax-table th {
          background-color: #f39c12;
          color: white;
          text-align: center;
        }

        .tax-table td {
          text-align: center;
          padding: 10px;
        }

        @media (max-width: 767px) {
          .ai-tax-calculation-title {
            font-size: 22px;
          }

          .tax-table td,
          .tax-table th {
            font-size: 14px;
            padding: 8px;
          }
            .ai-tax-calculation-content{
            padding: 8rem 10px;
            }

        }
      `}
      </style>
    </div>
  );
};

export default AIAutomatedTaxCalculation;
