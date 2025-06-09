import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Sidebar from '../components/Sidebar';
import { useNavigate } from 'react-router-dom';

const ReportsPageOverview = () => {
  const navigate = useNavigate();
  const [selectedOptions, setSelectedOptions] = useState({});

  const reports = [
    {
      name: "Sales",
      subcategories: [
        "DailyWeekly/Monthly sales",
        "Weekly",
        "Monthly sales",
        "Franchise-wise",
        "Territory-wise",
        "Agent-wise sales",
      ],
    },
    {
      name: "Commissions",
      subcategories: [
        "Commission payout status",
        "Pending commission payments",
        "Franchise",
        "Territory Head",
        "Agent-specific commissions",
      ],
    },
    {
      name: "Transactions",
      subcategories: [
        "Successful transactions",
        "Failed transactions",
        "Escrow-related transactions",
      ],
    },
    {
      name: "Customers",
      subcategories: [
        "Customer registration and churn trends",
        "Customer retention and acquisition patterns",
        "AI-driven Customer Lifetime Value (CLV) analysis",
      ],
    },
    {
      name: "Vendors",
      subcategories: [
        "Vendor sales performance",
        "Vendor rating scores",
        "Inventory and reorder status",
      ],
    },
    {
      name: "TerritoryHead",
      subcategories: [
        "Fraud detection logs and alerts",
        "Predictive sales forecasting",
        "Expense and revenue predictions",
        "AI-generated customer insights (behavioral analysis, sentiment analysis)",
      ],
    },
    {
      name: "Franchise",
      subcategories: [
        "Fraud detection logs and alerts",
        "Predictive sales forecasting",
        "Expense and revenue predictions",
        "AI-generated customer insights (behavioral analysis, sentiment analysis)",
      ],
    },
    {
      name: "Agents",
      subcategories: [
        "Fraud detection logs and alerts",
        "Predictive sales forecasting",
        "Expense and revenue predictions",
        "AI-generated customer insights (behavioral analysis, sentiment analysis)",
      ],
    },
    {
      name: "CBAV",
      subcategories: [
        "Fraud detection logs and alerts",
        "Predictive sales forecasting",
        "Expense and revenue predictions",
        "AI-generated customer insights (behavioral analysis, sentiment analysis)",
      ],
    },
    {
      name: "AI & Automation",
      subcategories: [
        "Fraud detection logs and alerts",
        "Predictive sales forecasting",
        "Expense and revenue predictions",
        "AI-generated customer insights (behavioral analysis, sentiment analysis)",
      ],
    },
  ];

  const handleSelect = (reportName, subcategory) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [reportName]: subcategory,
    }));
  };

  return (
    <div className="reports-header">
      <Sidebar />
      <div className="reports-main">
        <h2 className="mb-4 p-4">CRM Reports Overview</h2>
        {/* Dashboard View */}
        <div className="row g-4 mb-4 reports-overview-bar">
          <div className="col-md-3">
            <div className="card border-primary shadow">
              <div className="card-body">
                <h5>Total Sales</h5>
                <h3 className="text-primary">$125,500</h3>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card border-success shadow">
              <div className="card-body">
                <h5>Commissions Paid</h5>
                <h3 className="text-success">$12,400</h3>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card border-primary shadow">
              <div className="card-body">
                <h5>Customer Acquisition Trends</h5>
                <h3 className="text-primary">$15,500</h3>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card border-primary shadow">
              <div className="card-body">
                <h5>Transaction Volumes</h5>
                <h3 className="text-primary">$</h3>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card border-warning shadow">
              <div className="card-body">
                <h5>Pending Commissions</h5>
                <h3 className="text-warning">$3,100</h3>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card border-danger shadow">
              <div className="card-body">
                <h5>AI-Generated Insights</h5>
                <h3 className="text-danger">7 Issues</h3>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card border-danger shadow">
              <div
                className="card-body"
                onClick={() => {
                  navigate("/Taxation-settings");
                }}
              >
                <h5>Taxation</h5>
                <h3 className="text-danger">6 settings</h3>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card border-danger shadow">
              <div
                className="card-body"
                onClick={() => {
                  navigate("/commission-settings");
                }}
              >
                <h5>Commission Settings</h5>
                <h3 className="text-danger">Settings</h3>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card border-danger shadow">
              <div
                className="card-body"
                onClick={() => {
                  navigate("/invoice-Dashboard");
                }}
              >
                <h5>Invoice</h5>
                {/* <h3 className="text-danger">Settings</h3> */}
              </div>
            </div>
          </div>
        </div>

        {/* Reports Generation Section */}
        <div className="card shadow mb-4">
          <div className="card-header bg-primary text-white">
            <h5>Generate Reports</h5>
          </div>
          <div className="card-body">
            <form>
              <div className="row">
                <div className="col-md-3 mb-3">
                  <label>Date Range</label>
                  <input type="date" className="form-control" />
                </div>
                <div className="col-md-3 mb-3">
                  <label>User Role</label>
                  <select className="form-select">
                    <option>Admin</option>
                    <option>Franchise</option>
                    <option>Territory Head</option>
                    <option>Agent</option>
                    <option>Vendor</option>
                    <option>Customer Become A Vendor</option>
                    <option>Customer</option>
                  </select>
                </div>
                <div className="col-md-3 mb-3">
                  <label>Status</label>
                  <select className="form-select">
                    <option>All</option>
                    <option>Paid</option>
                    <option>Unpaid</option>
                    <option>Delivered</option>
                    <option>Pending</option>
                    <option>Successful</option>
                    <option>Failed transactions</option>
                  </select>
                </div>
                <div className="col-md-3 d-flex align-items-end mb-3">
                  <button type="submit" className="btn btn-primary w-100">
                    Generate
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
        {/* Reports List Section */}
        <div className="card shadow mb-4">
          <div className="card-header bg-primary text-white">
            <h5>Reports List</h5>
          </div>
          <div className="card-body">
            <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-3">
              {reports.map((report, index) => (
                <div className="col" key={index}>
                  <div className="card shadow h-100 p-2">
                    <div className="card-body d-flex flex-column justify-content-between">
                      <h6 className="text-center fw-bold mb-2">
                        {report.name} Report
                      </h6>

                      <ul className="list-unstyled mb-2">
                        {report.subcategories.map((subcategory, subIndex) => (
                          <li
                            key={subIndex}
                            className="d-flex align-items-center small"
                          >
                            <input
                              type="radio"
                              name={`radio-${report.name}`}
                              id={`${report.name}-${subIndex}`}
                              className="me-2"
                              checked={
                                selectedOptions[report.name] === subcategory
                              }
                              onChange={() =>
                                handleSelect(report.name, subcategory)
                              }
                            />
                            <label
                              htmlFor={`${report.name}-${subIndex}`}
                              className="mb-0"
                            >
                              {subcategory}
                            </label>
                          </li>
                        ))}
                      </ul>

                      <button
                        onClick={() => {
                          if (report.name === "Sales") navigate("/sales");
                          else if (report.name === "Commissions")
                            navigate("/commissions");
                          else if (report.name === "Transactions")
                            navigate("/transactions-report");
                          else if (report.name === "Customers")
                            navigate("/customers-report");
                          else if (report.name === "Vendors")
                            navigate("/vendor-report");
                          else if (report.name === "TerritoryHead")
                            navigate("/territory-head-report");
                          else if (report.name === "Franchise")
                            navigate("/franchise-report");
                          else if (report.name === "Agents")
                            navigate("/agents-report");
                          else if (report.name === "CBAV")
                            navigate("/customer-become-vendor-report");
                          else if (report.name === "Invoice")
                            navigate("/invoice-Dashboard");
                          else if (report.name === "AI & Automation")
                            navigate("/reports/ai");
                        }}
                      >
                        View {report.name}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <style>
          {`
          .reports-header {
            display: flex;
            width: 100vw;
            height: 100vh;
          }
          .reports-main {
            padding: 5% 20px;
            width: 100%;
            height: 100%;
            overflow-y: scroll;
          }
            .reports-overview-bar{
            display: flex;
            justify-content: center;
          flex-wrap: wrap;
      
            }
            .reports-overview-bar h5{
            font-size: 18px;
            flex-wrap: nowrap;
            }
          @media (max-width: 768px) {
            .reports-main {
              padding: 6rem 10px;
            }
          }
        `}
        </style>
      </div>
    </div>
  );
};

export default ReportsPageOverview;
