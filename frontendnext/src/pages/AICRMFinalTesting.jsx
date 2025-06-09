import React, { useState } from "react";
import { Container, Card, Button, Table, Spinner, Alert } from "react-bootstrap";
import Sidebar from "../components/Sidebar";

const AICRMFinalTesting = () => {
  const [testResults, setTestResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const startFinalTesting = async () => {
    setLoading(true);
    setError("");
    setTestResults([]);

    try {
      // 🔁 MOCK DATA FOR DEMO (Replace with axios when backend is ready)
      const mockResponse = {
        tests: [
          { id: "T001", component: "Login", status: "Passed", issues: "None" },
          { id: "T002", component: "Dashboard", status: "Failed", issues: "Chart not rendering" },
          { id: "T003", component: "Leads Module", status: "Passed", issues: "None" },
          { id: "T004", component: "Email Service", status: "Warning", issues: "Slow delivery" }
        ]
      };

      // Simulate delay
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setTestResults(mockResponse.tests);
    } catch (err) {
      setError("Failed to run final testing.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ai-crm-final-testing-container">
      <Sidebar />
      <Container fluid className="ai-crm-final-testing-content">
        <h2 className="ai-crm-final-testing-title">✅ AI CRM Final Testing</h2>

        <Card className="crm-testing-card">
          <Card.Body>
            <Button variant="success" onClick={startFinalTesting}>
              Start Final Testing
            </Button>
            {loading && <Spinner animation="border" className="testing-spinner" />}
            {error && <Alert variant="danger" className="mt-3">{error}</Alert>}
          </Card.Body>
        </Card>

        {!loading && testResults.length > 0 ? (
          <Table striped bordered hover className="testing-table mt-4">
            <thead>
              <tr>
                <th>Test ID</th>
                <th>Component</th>
                <th>Status</th>
                <th>Issues Detected</th>
              </tr>
            </thead>
            <tbody>
              {testResults.map((test, index) => (
                <tr key={index}>
                  <td>{test.id}</td>
                  <td>{test.component}</td>
                  <td>{test.status}</td>
                  <td>{test.issues}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        ) : (
          !loading && <p className="text-muted mt-3">No test results available. Click the button above to begin testing.</p>
        )}
      </Container>

      <style>{`
        .ai-crm-final-testing-container {
          display: flex;
          height: 100vh;
          width: 100vw;
        }

        .ai-crm-final-testing-content {
          flex-grow: 1;
          padding: 7% 20px;
          background-color: #f8f9fa;
          overflow-y: auto;
        }

        .ai-crm-final-testing-title {
          font-size: 24px;
          font-weight: bold;
          color: #333;
          margin-bottom: 20px;
        }

        .crm-testing-card {
          max-width: 200px;
          max-height: 100px;
          margin: 0 auto;
          text-align: center;
          background-color:green;
          border-radius: 20px;
        }

        .testing-spinner {
          margin-top: 10px;
        }

        .testing-table th {
          background-color: #3498db;
          color: white;
          text-align: center;
        }

        .testing-table td {
          text-align: center;
          padding: 10px;
        }

        @media (max-width: 768px) {
          .ai-crm-final-testing-content {
            padding: 8rem 10px;
          }
        }
      `}</style>
    </div>
  );
};

export default AICRMFinalTesting;
