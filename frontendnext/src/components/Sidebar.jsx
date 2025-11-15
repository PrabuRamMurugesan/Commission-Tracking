import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { GiHamburgerMenu } from "react-icons/gi";
import { MdDeliveryDining } from "react-icons/md";
import { MdOutlineHealthAndSafety } from "react-icons/md";
const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
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
    monsterProduct: false,
    delivery: false,
    healthcare: false,
  });

  // ✅ Get user safely
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const role = user?.role || "guest";

  // ✅ Sidebar toggle
  const toggleSidebar = () => setIsOpen(!isOpen);

  // ✅ Dropdown toggle — only one open at a time
  const toggleDropdown = (menu) => {
    setDropdowns((prev) => {
      const newState = {};
      Object.keys(prev).forEach((key) => {
        newState[key] = key === menu ? !prev[key] : false;
      });
      return newState;
    });
  };

  // ✅ Load dashboard roles (only for admin)
  useEffect(() => {
    if (role !== "admin") return;

    const loadDashboards = async () => {
      try {
        console.log("📡 Fetching dashboard roles...");
        const res = await axios.get("/api/users/by-role");
        setDashboardUsers(res.data || {});
        console.log("✅ Dashboard roles loaded:", res.data);
      } catch (err) {
        console.error("❌ Failed to load dashboard roles:", err?.message);
      }
    };

    loadDashboards();
  }, [role]);

  return (
    <div
      className={`sidebar text-white p-3 ${isOpen ? "expanded" : "collapsed"}`}
    >
      {/* Sidebar toggle button */}
      <div style={{ cursor: "pointer" }} onClick={toggleSidebar}>
        <GiHamburgerMenu className="sidebar-toggle mx-2" />
      </div>

      <ul className="nav flex-column">
        {/* 🏢 Franchise Dashboard */}
        {(role === "franchise" || role === "admin") && (
          <li>
            <div
              className="dropdown-toggle"
              onClick={() => toggleDropdown("franchise")}
            >
              💰 Franchise Dashboard
            </div>
            {dropdowns.franchise && (
              <ul className="submenu">
                {/* Franchise List – ONLY VISIBLE FOR ADMIN */}
                {role === "admin" && (
                  <li>
                    <Link
                      className="submenu-item"
                      to="/dashboard/franchise-list"
                    >
                      Franchise List
                    </Link>
                  </li>
                )}

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

        {/* 🧑‍💼 Territory Head */}
        {(role === "territory" || role === "admin") && (
          <li>
            <div
              className="dropdown-toggle"
              onClick={() => toggleDropdown("territory")}
            >
              👔 Territory Head
            </div>
            {dropdowns.territory && (
              <ul className="submenu">
                <li>
                  <Link className="submenu-item" to="/dashboard/territory-list">
                    Territory List
                  </Link>
                </li>
                <li>
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

        {/* 👨‍💼 Agent Dashboard */}
        {(role === "agent" || role === "admin") && (
          <li>
            <div
              className="dropdown-toggle"
              onClick={() => toggleDropdown("agentList")}
            >
              👔 Agent Dashboard
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

        {/* 🏬 Vendor Dashboard */}
        {(role === "vendor" || role === "admin") && (
          <li>
            <div
              className="dropdown-toggle"
              onClick={() => toggleDropdown("vendor")}
            >
              🏢 Vendor Dashboard
            </div>
            {dropdowns.vendor && (
              <ul className="submenu">
                <li>
                  <Link
                    className="submenu-item"
                    to="/dashboard/vendor-customer-list"
                  >
                    Customer List
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

        {/* 🛍 Customer Become Vendor */}
        {(role === "customer-become-vendor" || role === "admin") && (
          <li>
            <div
              className="dropdown-toggle"
              onClick={() => toggleDropdown("customerVendorDetails")}
            >
              🛍️ Customer Become A Vendor
            </div>
            {dropdowns.customerVendorDetails && (
              <ul className="submenu">
                <Link className="submenu-item" to="/dashboard/cbv-list">
                  CBV List
                </Link>

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

        {/* 🧍 Customer */}
        {(role === "customer" || role === "admin") && (
          <li>
            <div
              className="dropdown-toggle"
              onClick={() => toggleDropdown("customerDetails")}
            >
              🧍 Customer
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

        {/* 🏥 Healthcare Partner */}
        {(role === "Healthcare" || role === "admin") && (
          <li>
            <div
              className="dropdown-toggle d-flex align-items-center"
              onClick={() => toggleDropdown("healthcare")}
            >
              <MdOutlineHealthAndSafety
                className="text-primary me-1"
                size={20}
              />{" "}
              Healthcare Partner
            </div>
            {dropdowns.healthcare && (
              <ul className="submenu">
                <li>
                  <Link
                    className="submenu-item"
                    to="/dashboard/healthcare-list"
                  >
                    Healthcare List
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

        {/* 🚚 Delivery Partner */}
        {(role === "delivery" || role === "admin") && (
          <li>
            <div
              className="dropdown-toggle"
              onClick={() => toggleDropdown("delivery")}
            >
              <MdDeliveryDining className="text-danger me-2" size={20} />{" "}
              Delivery Partner
            </div>
            {dropdowns.delivery && (
              <ul className="submenu">
                <li>
                  <Link className="submenu-item" to="/dashboard/delivery-list">
                    Delivery List
                  </Link>
                </li>
                <li>
                  <Link
                    className="submenu-item"
                    to="/dashboard/delivery-transactions"
                  >
                    Transaction History
                  </Link>
                </li>
              </ul>
            )}
          </li>
        )}

        {/* 🧩 Monster Product Ops */}
        {(role === "admin" || role === "staff") && (
          <li>
            <div
              className="dropdown-toggle"
              onClick={() => toggleDropdown("monsterProduct")}
            >
              🧩 Monster Product Ops
            </div>
            {dropdowns.monsterProduct && (
              <ul className="submenu">
                <li>
                  <Link className="submenu-item" to="/admin/bulk-upload">
                    Bulk Upload
                  </Link>
                </li>
                <li>
                  <Link className="submenu-item" to="/admin/upload-logs">
                    Upload Logs
                  </Link>
                </li>
                <li>
                  <Link className="submenu-item" to="/admin/rollback-tools">
                    Rollback Tools
                  </Link>
                </li>
              </ul>
            )}
          </li>
        )}

        {/* Common Links */}
        <li>
          <Link className="nav-link text-white" to="/Items">
            📦 Items
          </Link>
        </li>
        <li>
          <Link className="nav-link text-white" to="/Reports">
            📈 Reports
          </Link>
        </li>
      </ul>

      {/* Static Admin Links */}
      {(role === "admin" || role === "staff") && (
        <ul className="nav flex-column mt-3">
          <li>
            <a className="nav-link text-white" href="/admin/upload">
              📤 Upload Products
            </a>
          </li>
          <li>
            <a className="nav-link text-white" href="/admin/upload-logs">
              🧾 Upload Logs
            </a>
          </li>
          <li>
            <a className="nav-link text-white" href="/admin/rollback">
              ⏪ Rollback Manager
            </a>
          </li>
          <li>
            <a className="nav-link text-white" href="/admin/audit">
              📋 Audit Trail
            </a>
          </li>
          <li>
            <a className="nav-link text-white" href="/admin/flagged">
              🚩 Flagged Products
            </a>
          </li>
        </ul>
      )}

      {/* Inline Styles */}
      <style>{`
        .sidebar {
          width: 350px;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          margin-top: 60px;
          background-color: black;
          overflow-y: auto;
        }

        .sidebar.collapsed {
          width: 70px;
          background-color: white;
          transition: width 0.3s ease;
        }

        .sidebar-toggle {
          margin-bottom: 20px;
          font-size: 30px;
          background: white;
          color: black;
          border-radius: 5px;
          padding: 3px;
        }

        .dropdown-toggle {
          cursor: pointer;
          margin: 10px 0;
          padding: 10px 15px;
          border-radius: 5px;
          font-size: 14px;
          transition: background-color 0.3s ease;
        }

        .submenu {
          list-style: none;
          padding-left: 40px;
          font-size: 12px;
        }

        .submenu-item {
          color: #fff;
          text-decoration: none !important;
          display: block;
          padding: 5px 0;
        }

        .submenu-item:hover {
          color: red;
        }

        .nav-link {
          padding: 10px 15px;
          font-size: 14px;
        }

        @media (max-width: 768px) {
          .sidebar {
            width: 60%;
            position: fixed;
            left: 0;
            bottom: 0;
            z-index: 1000;
          }
        }
      `}</style>
    </div>
  );
};

export default Sidebar;
