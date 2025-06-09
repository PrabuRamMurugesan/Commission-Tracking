import React, { useState, useEffect } from "react";
import {
  Container,
  Table,
  Spinner,
  Alert,
  ProgressBar
} from "react-bootstrap";
import axios from "axios";
import Sidebar from "../components/Sidebar";

const AICloudCostOptimization = () => {
  const [costData, setCostData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchCostData();
  }, []);

  const fetchCostData = async () => {
    try {
      const response = await axios.get("/api/ai-cloud-cost-optimization");
      console.log("API response:", response.data);

      let extractedData = [];

      // Normalize different response formats
      if (Array.isArray(response.data)) {
        extractedData = response.data;
      } else if (Array.isArray(response.data.costs)) {
        extractedData = response.data.costs;
      } else if (response.data.data && Array.isArray(response.data.data)) {
        extractedData = response.data.data;
      }

      if (extractedData.length > 0) {
        setCostData(extractedData);
      } else {
        setError("No valid cost data found in response.");
      }
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Failed to load cost optimization data.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ai-cloud-cost-optimization-container">
      <Sidebar />
      <Container fluid className="ai-cloud-cost-optimization-content">
        <h2 className="ai-cloud-cost-optimization-title">
          💰 AI Cloud Cost Optimization
        </h2>

        {loading ? (
          <Spinner animation="border" />
        ) : error ? (
          <Alert variant="danger">{error}</Alert>
        ) : (
          <>
            <Table striped bordered hover responsive className="cost-table mt-4">
              <thead>
                <tr>
                  <th>Service</th>
                  <th>Current Cost ($)</th>
                  <th>Optimization Potential (%)</th>
                  <th>AI Suggested Cost ($)</th>
                </tr>
              </thead>
              <tbody>
                {costData.map((data, index) => (
                  <tr key={index}>
                    <td>{data.serviceName}</td>
                    <td>${data.currentCost}</td>
                    <td>
                      <ProgressBar
                        now={data.optimizationPotential}
                        label={`${data.optimizationPotential}%`}
                        variant={
                          data.optimizationPotential >= 75
                            ? "danger"
                            : data.optimizationPotential >= 50
                            ? "warning"
                            : "success"
                        }
                      />
                    </td>
                    <td>${data.suggestedCost}</td>
                  </tr>
                ))}
              </tbody>
            </Table>

            {/* Key Benefits */}
            <h5 className="mt-5">🚀 Key Benefits of AI Cost Optimization:</h5>
            <ul>
              <li>Detects underutilized services and suggests rightsizing</li>
              <li>Provides real-time cloud savings insights</li>
              <li>Recommends instance scaling or shutdowns for idle services</li>
              <li>Forecasts budget overspending and alerts spikes</li>
              <li>Visualizes cost vs. optimization potential via progress bars</li>
            </ul>
          </>
        )}
      </Container>

      {/* Styles */}
      <style>
        {`
          .ai-cloud-cost-optimization-container {
            display: flex;
            height: 100vh;
            width: 100vw;
          }

          .ai-cloud-cost-optimization-content {
            padding: 7% 20px;
            background-color: #f8f9fa;
            width: 100%;
            height: 100%;
          }

          @media (max-width: 768px) {
            .ai-cloud-cost-optimization-content {
              padding:7rem 20px;
            }
          }

         
        `}
      </style>
    </div>
  );
};

export default AICloudCostOptimization;
