import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [agents, setAgents] = useState([]);
  const [dashboardUsers, setDashboardUsers] = useState({
    agents: [],
    vendors: [],
  });

  const [dropdowns, setDropdowns] = useState({
    franchise: false,
    territory: false,
    agentList: false,
    vendor: false,
    customerVendorDetails: false,
    customerDetails: false,
  });

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const toggleDropdown = (menu) => {
    setDropdowns((prev) => {
      const updatedDropdowns = {};
      for (const key in prev) {
        updatedDropdowns[key] = key === menu ? !prev[key] : false;
      }
      return updatedDropdowns;
    });
  };

  // useEffect(() => {
  //   const fetchAgents = async () => {
  //     try {
  //       const res = await axios.get("http://localhost:3000/api/agents");
  //       setAgents(res.data.agents);
  //       console.log(res, "res.data.agents");

  //     } catch (err) {
  //       console.error("Error loading agents:", err);
  //     }
  //   };

  //   if (user?.role === "admin") {
  //     fetchAgents();
  //   }
  // }, []);
  useEffect(() => {
    const loadDashboards = async () => {
      try {
        console.log("📡 Fetching dashboard user lists from /api/users/by-role");

        const res = await axios.get("/api/users/by-role");

        console.log("✅ Raw API Response:", res.data);
        console.log("🟢 Agents List:", res.data.agents);
        console.log("🟢 Vendors List:", res.data.vendors);

        setDashboardUsers(res.data);
      } catch (err) {
        console.error(
          "❌ Failed to load dashboard roles:",
          err?.response?.data || err.message
        );
      }
    };

    if (user?.role === "admin") {
      console.log("🧠 Logged-in as Admin – Loading all dashboard roles");
      loadDashboards();
    } else {
      console.warn("⚠️ Not admin, skipping dashboard user load");
    }
  }, []);
  // Get user role from localStorage
  const user = JSON.parse(localStorage.getItem("user"));
  const role = user?.role;

  return (
    <div
      className={`sidebar text-white p-3 ${isOpen ? "expanded" : "collapsed"}`}
    >
      <div className="sidebar-toggle" onClick={toggleSidebar}>
        ☰
      </div>
      <ul className="nav flex-column">
        {/* CBV DASHBOARDS */}

        {/* Franchise */}
        {(role === "franchise" || role === "admin") && (
          <li>
            <div
              className="dropdown-toggle"
              onClick={() => toggleDropdown("franchise")}
            >
              <span>💰</span> Franchise Dashboard
            </div>
            {dropdowns.franchise && (
              <ul className="submenu">
                <li>
                  <Link className="submenu-item" to="/dashboard/franchise-list">
                    Franchise List
                  </Link>
                </li>
                <li>
                  <Link className="submenu-item" to="/dashboard/agent-list">
                    Agent List
                  </Link>
                </li>
                <li>
                  <Link className="submenu-item" to="/dashboard/vendor-list">
                    Vendor List
                  </Link>
                </li>
                <li>
                  <Link
                    className="submenu-item"
                    to="/dashboard/franchise-customer-list"
                  >
                    Customer List
                  </Link>
                </li>
                <li>
                  <Link className="submenu-item" to="/dashboard/cbv-list">
                    CBV List
                  </Link>
                </li>
                <li>
                  <Link
                    className="submenu-item"
                    to="/dashboard/transaction-history"
                  >
                    Transaction History
                  </Link>
                </li>
              </ul>
            )}
          </li>
        )}

        {/* Territory Head */}
        {(role === "territory-head" || role === "admin") && (
          <li>
            <div
              className="dropdown-toggle"
              onClick={() => toggleDropdown("territory")}
            >
              <span>👔</span> Territory Head
            </div>
            {dropdowns.territory && (
              <ul className="submenu">
                <li>
                  <Link className="submenu-item" to="/dashboard/territory-list">
                    Territory List
                  </Link>
                  <Link className="submenu-item" to="/dashboard/agent-list">
                    Agent List
                  </Link>
                </li>
                <li>
                  <Link
                    className="submenu-item"
                    to="/dashboard/territory-customer-list"
                  >
                    Customer List
                  </Link>
                </li>
                <li>
                  <Link className="submenu-item" to="/dashboard/vendor-list">
                    Vendor List
                  </Link>
                </li>
                <li>
                  <Link
                    className="submenu-item"
                    to="/dashboard/transaction-history"
                  >
                    Transaction History
                  </Link>
                </li>
              </ul>
            )}
          </li>
        )}

        {/* Agent */}
        {(role === "agent" || role === "admin") && (
          <li>
            <div
              className="dropdown-toggle"
              onClick={() => toggleDropdown("agentList")}
            >
              <span>👔</span> Agent Dashboard
            </div>
            {dropdowns.agentList && (
              <ul className="submenu">
                <li>
                  <Link
                    className="submenu-item"
                    to="/dashboard/agent-customer-list"
                  >
                    Customer List
                  </Link>
                </li>
                <li>
                  <Link className="submenu-item" to="/dashboard/vendor-list">
                    Vendor List
                  </Link>
                </li>
                <li>
                  <Link
                    className="submenu-item"
                    to="/dashboard/transaction-history"
                  >
                    Transaction History
                  </Link>
                </li>
              </ul>
            )}
          </li>
        )}

        {/* Vendor */}
        {(role === "vendor" || role === "admin") && (
          <li>
            <div
              className="dropdown-toggle"
              onClick={() => toggleDropdown("vendor")}
            >
              <span>🏢</span> Vendor Dashboard
            </div>
            {dropdowns.vendor && (
              <ul className="submenu">
                <li>
                  {/* <Link className="submenu-item" to="/dashboard/customer-list">
                    Customer list
                  </Link> */}
                  <Link
                    className="submenu-item"
                    to="/dashboard/vendor-customer-list"
                  >
                    Customer list
                  </Link>
                </li>
                <li>
                  <Link
                    className="submenu-item"
                    to="/dashboard/transaction-history"
                  >
                    Transaction History
                  </Link>
                </li>
              </ul>
            )}
          </li>
        )}

        {/* Customer Become a Vendor */}
        {(role === "customer-become-vendor" || role === "admin") && (
          <li>
            <div
              className="dropdown-toggle"
              onClick={() => toggleDropdown("customerVendorDetails")}
            >
              <span>🛍️</span> Customer Become A Vendor
            </div>
            {dropdowns.customerVendorDetails && (
              <ul className="submenu">
                <li>
                  <Link
                    className="submenu-item"
                    to="/dashboard/cbv-customer-list"
                  >
                    Customer list
                  </Link>
                </li>
                <li>
                  <Link
                    className="submenu-item"
                    to="/dashboard/transaction-history"
                  >
                    Transaction History
                  </Link>
                </li>
              </ul>
            )}
          </li>
        )}

        {/* Customer */}
        {(role === "customer" || role === "admin") && (
          <li>
            <div
              className="dropdown-toggle"
              onClick={() => toggleDropdown("customerDetails")}
            >
              <span>🧍</span>Customer
            </div>
            {dropdowns.customerDetails && (
              <ul className="submenu">
                <li>
                  <Link
                    className="submenu-item"
                    to="/dashboard/transaction-history"
                  >
                    Transaction History
                  </Link>
                </li>
              </ul>
            )}
          </li>
        )}

        {/* Common Items and Reports */}
        <li>
          <Link className="nav-link text-white" to="/Items">
            📦 Items
          </Link>
        </li>
        <li>
          <Link className="nav-link text-white pb-5" to="/Reports">
            📈 Reports
          </Link>
        </li>
      </ul>

      {/* Styles */}
      <style>
        {`
          .sidebar {
            width: 350px;
            height: 100%;
            display: flex;
            flex-direction: column;
            justify-content: start;
            margin-top: 60px;
            background-color: black;
            overflow-y: auto;
          }

          .sidebar.collapsed {
            width: 60px;
            padding: 20px;
            background-color: white;
            margin-top: 60px;
            transition: transform 0.3s ease;
            overflow-y: none;
          }

          .sidebar-toggle {
            cursor: pointer;
            margin-bottom: 20px;
            font-size: 24px;
            color: gray;
            gap: 10px;
          }

          .dropdown-toggle {
            cursor: pointer;
            margin: 10px 0;
            padding: 10px 15px;
            border-radius: 5px;
            font-size: 14px;
            transition: background-color 0.3s ease;
          }

          .dropdown-toggle span {
            margin-right: 10px;
          }

          .submenu {
            list-style: none;
            padding-left: 20px;
            display: block;
          }

          .submenu-item {
            padding: 5px 30px;
            color: #fff;
            text-decoration: none;
            display: block;
            font-size: 14px;
          }

          .submenu-item:hover {
            text-decoration: underline;
          }

          .nav-link {
            padding: 15px 13px;
            font-size: 14px;
          }

          @media (max-width: 768px) {
            .sidebar {
              width: 55%;
              height: 100%;
              position: fixed;
              bottom: 0;
              left: 0;
              z-index: 1000;
              padding: 60px;
              margin-top: 60px;
              display: none;
            }

            .sidebar.collapsed {
              display: none;
            }

            .dropdown-toggle {
              margin: 10px 0;
              padding: 10px 15px;
              font-size: 14px;
            }

            .nav-list {
              display: flex;
              flex-direction: row;
              width: 100%;
            }

            .nav-list li {
              flex: 1;
              text-align: center;
            }
          }

          @media (max-width: 769px) {
            .sidebar-toggle {
              display: none;
            }
          }
        `}
      </style>
    </div>
  );
};

export default Sidebar;
