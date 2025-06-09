import React, { useEffect, useState } from "react";
import { Card, Table, Spinner, Alert, Form } from "react-bootstrap";
import axios from "axios";
import Sidebar from "../../components/Sidebar";

const TopPerformanceDashboard = () => {
  const [agentData, setAgentData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [period, setPeriod] = useState("");



  const fetchData = async (period) => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/performance/top?period=${period}`);
      setAgentData(response.data || []);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
      setError("Failed to load data.");
      setLoading(false);
    }
  };

  useEffect(() => {
    if (period) {
      fetchData(period);
    }
  }, [period]);

  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="dashboard-content mt-4">
        <h2 className="text-primary text-center mb-4">
          Top Agent Performance Dashboard
        </h2>
        <Form.Select
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
          style={{ width: "200px", margin: "0 auto" }}
        >
          <option value="" disabled>
            -- Select Period --
          </option>
          <option value="quarterly">Weekly</option>
          <option value="monthly">Monthly</option>
          <option value="quarterly">Quarterly</option>
          <option value="half-yearly">Half-Yearly</option>
          <option value="annually">Annually</option>
        </Form.Select>

        {loading ? (
          <div className="text-center">
            <Spinner animation="border" />
          </div>
        ) : error ? (
          <Alert variant="danger" className="text-center">
            {error}
          </Alert>
        ) : (
          <Card className="performance-card m-3">
            <Card.Body>
              <Table striped bordered hover responsive>
                <thead>
                  <tr>
                    <th>Agent Name</th>
                    <th>Total Sales ($)</th>
                    <th>Commission Earned ($)</th>
                    <th>Conversion Rate (%)</th>
                  </tr>
                </thead>
                <tbody>
                  {Array.isArray(agentData) && agentData.length > 0 ? (
                    agentData.map((agent, index) => (
                      <tr key={index}>
                        <td>{agent.name}</td>
                        <td>${agent.sales}</td>
                        <td>${agent.commission}</td>
                        <td>{agent.conversionRate}%</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="text-center">
                        No data available
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        )}
      </div>

      <style>
        {`
          .dashboard-container {
            display: flex;
            height: 100vh;
            width: 100vw;
          }
          .dashboard-content {
            padding: 7% 20px;
            width: 100%;
            height: 100%;
            overflow-y: scroll;
          }
          .performance-card {
            padding: 20px;
            background: #fff;
            border-radius: 10px;
            box-shadow: 0 4px 10px rgba(0,0,0,0.1);
          }
            @media (max-width: 768px) {
              .dashboard-container {
                flex-direction: column;
              }
              .dashboard-content {
                padding: 7rem 20px;
              }
            }
        `}
      </style>
    </div>
  );
};

export default TopPerformanceDashboard;
