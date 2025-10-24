// InvoiceDashboard.jsx (Page 2 of 18)

import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Form,
  Table,
} from "react-bootstrap";
import { Pie, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
} from "chart.js";
import { useNavigate } from "react-router-dom";
import axios from "axios";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
);

const InvoiceDashboard = () => {
    const navigate = useNavigate();
    const [kpiData, setKpiData] = useState(null);
    const [recentInvoices, setRecentInvoices] = useState([]);
    const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    date: "",
    platform: "All",
    status: "All",
    paymentMethod: "All",
  });

  const dummyKPIs = {
    total: 1200,
    paid: 840,
    unpaid: 210,
    partial: 50,
    overdue: 60,
    refunded: 40,
    escrowActive: 90,
    escrowReleased: 75,
    wallet: 130,
    gst: "₹2,15,000",
    avgValue: "₹3,600",
    topPlatform: "BBSCART",
  };

  const pieData = {
    labels: ["BBSCART", "Golddex", "Delivery", "Emerjobs"],
    datasets: [
      {
        label: "Invoices",
        data: [550, 320, 180, 150],
        backgroundColor: ["#0d6efd", "#198754", "#fd7e14", "#6f42c1"],
      },
    ],
  };

  const barData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Created",
        data: [100, 120, 140, 180, 200, 240],
        backgroundColor: "#0d6efd",
      },
      {
        label: "Paid",
        data: [90, 110, 130, 170, 190, 230],
        backgroundColor: "#198754",
      },
    ],
  };

  // const recentInvoices = [
  //   { id: "INV001", customer: "Rahul", amount: "₹4,200", status: "Paid" },
  //   { id: "INV002", customer: "Meena", amount: "₹1,750", status: "Unpaid" },
  //   { id: "INV003", customer: "Varun", amount: "₹2,300", status: "Partial" },
  // ];
  const navItems = [
    {
      label: "Escrow Info",
      path: "/invoice-escrowInfo",
      icon: "bi-shield-lock",
    },
    {
      label: "Wallet History",
      path: "/invoice-walletHistory",
      icon: "bi-wallet2",
    },
    {
      label: "Tax Breakdown",
      path: "/invoice-taxBreakdown",
      icon: "bi-percent",
    },
    { label: "Filter Panel", path: "/invoice-filterpanel", icon: "bi-funnel" },
    { label: "RecurringSetup", path: "/invoice-recurringSetup", icon: "bi-download" },
    { label: "SummaryBox", path: "/invoice-summaryBox", icon: "bi-download" },
    { label: "AuditLog", path: "/InvoiceAuditLog", icon: "bi-download" },
    
  ];
  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const kpiRes = await axios.get("/api/invoices/summary/dashboard");
      const listRes = await axios.get(
        "/api/invoices?limit=5&sortBy=createdAt&order=desc"
      );

      setKpiData(kpiRes.data.data);
      setRecentInvoices(listRes.data.data);
    } catch (err) {
      console.error("Dashboard load failed:", err);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Container fluid className="mt">
      <Row>
        {Object.entries(dummyKPIs).map(([key, value], index) => (
          <Col key={index} md={3} className="mb-3">
            <Card className="shadow-sm">
              <Card.Body>
                <Card.Title className="text-muted small">
                  {key
                    .replace(/([A-Z])/g, " $1")
                    .replace(/^./, (str) => str.toUpperCase())}
                </Card.Title>
                <h5 className="fw-bold">{value}</h5>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      <Card className="mb-4">
        <Card.Header>Filter Invoices</Card.Header>
        <Card.Body>
          <Row className="gy-2">
            {["Date", "Platform", "Status", "Payment Method"].map(
              (label, i) => (
                <Col key={i} md={3}>
                  <Form.Group>
                    <Form.Label>{label}</Form.Label>
                    {label === "Date" ? (
                      <Form.Control type="date" />
                    ) : (
                      <Form.Select>
                        <option>All</option>
                        <option>Option 1</option>
                        <option>Option 2</option>
                      </Form.Select>
                    )}
                  </Form.Group>
                </Col>
              )
            )}
          </Row>
          <div className="mt-3">
            <Button variant="primary">Apply Filters</Button>{" "}
            <Button variant="secondary">Reset</Button>
          </div>
        </Card.Body>
      </Card>

      <Row className="mb-3">
        <Col>
          <Button
            variant="success"
            className="me-2"
            onClick={() => {
              navigate("/create-invoice");
            }}
          >
            + Create Invoice
          </Button>
          <Button
            variant="outline-primary"
            className="me-2"
            onClick={() => {
              navigate("/invoice-list");
            }}
          >
            View All
          </Button>

          {/* <Button
            variant="outline-secondary"
            className="me-2"
            onClick={() => {
              navigate("/invoice-exportButton");
            }}
          >
            Export
          </Button> */}
          <Button
            onClick={() => window.open("/api/invoices/export/data", "_blank")}
          >
            Export
          </Button>
          <Button
            variant="outline-dark"
            className="me-2"
            onClick={fetchDashboardData}
          >
            Refresh
          </Button>
          <Button
            variant="outline-dark"
            onClick={() => {
              navigate("/invoice-statusTracker");
            }}
          >
            Status Tracker
          </Button>
          <Button
            variant="outline-dark"
            onClick={() => {
              navigate("/invoice-smartMerge");
            }}
          >
            SmartMerge
          </Button>
        </Col>
      </Row>

      <Row className="mb-4">
        <Col md={6}>
          <Card className="p-3 h-100">
            <h6>Invoices by Platform</h6>
            <Pie data={pieData} />
          </Card>
        </Col>
        <Col md={6}>
          <Card className="p-3 h-100">
            <h6>Monthly Invoice Trends</h6>
            <Bar data={barData} />
          </Card>
        </Col>
      </Row>

      <Row>
        <Col md={6}>
          <Card className="mb-4">
            <Card.Header>Recent Invoices</Card.Header>
            <Card.Body>
              <Table bordered responsive hover size="sm">
                <thead>
                  <tr>
                    <th>#ID</th>
                    <th>Customer</th>
                    <th>Amount</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentInvoices.map((inv) => (
                    <tr key={inv._id}>
                      <td>{inv.invoiceNumber}</td>
                      <td>{inv.customer?.name || "-"}</td>
                      <td>₹{inv.totalAmount.toLocaleString("en-IN")}</td>
                      <td>
                        <Badge
                          bg={
                            inv.paymentStatus === "Paid" ? "success" : "warning"
                          }
                        >
                          {inv.paymentStatus}
                        </Badge>
                      </td>
                      <td>
                        <Button
                          size="sm"
                          onClick={() =>
                            handleNavigate(`/invoice/details/${inv._id}`)
                          }
                        >
                          View
                        </Button>{" "}
                        <Button
                          size="sm"
                          variant="warning"
                          onClick={() =>
                            handleNavigate(`/invoice/edit/${inv._id}`)
                          }
                        >
                          Edit
                        </Button>{" "}
                        <Button size="sm" variant="info">
                          Print
                        </Button>{" "}
                        <Button size="sm" variant="secondary">
                          Download
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card className="mb-4">
            <Card.Header>Upcoming Due Invoices</Card.Header>
            <Card.Body className="text-muted">
              [Due Tracker Placeholder]
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <div className="bg-light py-5 min-vh-100">
        <div className="container">
          <h2 className="mb-4 text-center text-primary fw-bold">
            Billing Control Center
          </h2>
          <div className="row justify-content-center">
            {navItems.map(({ label, path, icon }) => (
              <div className="col-sm-6 col-md-4 col-lg-3 mb-4" key={path}>
                <div
                  className="card h-100 shadow border-0 hover-shadow text-center p-3 transition"
                  onClick={() => navigate(path)}
                  style={{
                    cursor: "pointer",
                    transition: "transform 0.2s ease-in-out",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.transform = "scale(1.05)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.transform = "scale(1)")
                  }
                >
                  <div className="card-body d-flex flex-column align-items-center justify-content-center">
                    <i className={`bi ${icon} text-primary fs-1 mb-3`}></i>
                    <h5 className="card-title text-dark">{label}</h5>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Container>
  );
};

export default InvoiceDashboard;
