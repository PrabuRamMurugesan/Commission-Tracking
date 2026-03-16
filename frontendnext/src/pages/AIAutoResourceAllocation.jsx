import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Table,
  Spinner,
  Alert,
  ProgressBar,
  Button,
} from "react-bootstrap";
import axios from "axios";
import Sidebar from "../components/Sidebar";

const AIAutoResourceAllocation = () => {
  const [resourceData, setResourceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [autoAllocation, setAutoAllocation] = useState(false);

  useEffect(() => {
    fetchResourceData();
  }, []);

  const fetchResourceData = async () => {
    try {
      const response = await axios.get("/api/ai-auto-resource-allocation");
      const data = response.data;
      setResourceData(Array.isArray(data) ? data : []);
      setLoading(false);
    } catch (err) {
      setError("Failed to load resource allocation data.");
      setLoading(false);
    }
  };
  

  const toggleAutoAllocation = async () => {
    try {
      await axios.post("/api/ai-auto-resource-allocation/toggle", {
        enabled: !autoAllocation,
      });
      setAutoAllocation(!autoAllocation);
    } catch (err) {
      console.error("Error toggling auto resource allocation:", err);
    }
  };

  return (
    <div className="ai-auto-resource-allocation-container">
      <Sidebar />
      <Container fluid className="ai-auto-resource-allocation-content">
        <h2 className="ai-auto-resource-allocation-title">
          🔄 AI Auto Resource Allocation
        </h2>

        <Button
          variant={autoAllocation ? "danger" : "success"}
          className="mb-3"
          onClick={toggleAutoAllocation}
        >
          {autoAllocation
            ? "Disable Auto Allocation"
            : "Enable Auto Allocation"}
        </Button>

        {/* Resource Allocation Table */}
        {loading ? (
          <Spinner animation="border" />
        ) : error ? (
          <Alert variant="danger">{error}</Alert>
        ) : (
          <Table
            striped
            bordered
            hover
            responsive
            className="resource-table mt-4"
          >
            <thead>
              <tr>
                <th>Resource Type</th>
                <th>Current Usage (%)</th>
                <th>Optimization Status</th>
              </tr>
            </thead>
            <tbody>
              {resourceData.map((data, index) => (
                <tr key={index}>
                  <td>{data.resourceType}</td>
                  <td>{data.currentUsage}%</td>
                  <td>
                    <ProgressBar
                      now={data.optimizationScore}
                      label={`${data.optimizationScore}%`}
                      variant={
                        data.optimizationScore > 80
                          ? "success"
                          : data.optimizationScore > 50
                          ? "warning"
                          : "danger"
                      }
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Container>
      <style>
        {`
        .ai-auto-resource-allocation-container {
  display: flex;
  height: 100vh;
 width: 100vw;
}

.ai-auto-resource-allocation-content {
  padding: 7% 20px;
  height: 100%;
  width: 100%;
}

.ai-auto-resource-allocation-title {
  font-size: 24px;
  font-weight: bold;
  color: #333;
  margin-bottom: 20px;
}

.resource-table th {
  background-color: #2980b9;
  color: white;
  text-align: center;
}

.resource-table td {
  text-align: center;
  padding: 10px;
}

@media (max-width: 768px){
.ai-auto-resource-allocation-content {
  padding: 7rem 20px;
  height: 100%;
  width: 100%;
}
}
`}
      </style>
    </div>
  );
};

export default AIAutoResourceAllocation;
