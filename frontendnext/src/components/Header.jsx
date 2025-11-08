import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

const Header = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ Watch for route changes or storage changes
  useEffect(() => {
    const loggedIn =
      localStorage.getItem("isLoggedIn") === "true" ||
      !!localStorage.getItem("authToken");
    setIsLoggedIn(loggedIn);
  }, [location]); // re-check every time user navigates

  // ✅ Also listen for manual storage changes (like other tabs or manual localStorage edits)
  useEffect(() => {
    const handleStorageChange = () => {
      const loggedIn =
        localStorage.getItem("isLoggedIn") === "true" ||
        !!localStorage.getItem("authToken");
      setIsLoggedIn(loggedIn);
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("authToken");
    setIsLoggedIn(false);
    navigate("/"); // redirect to login/home
  };

  const toggleDropdown = (isVisible) => {
    setShowDropdown(isVisible);
  };

  return (
    <header className="header">
      <h1>
        <a href="/dashboard">Commission Tracking System</a>
      </h1>

      <nav>
        <ul>
          <li>
            <a href="/dashboard">Dashboard</a>
          </li>
          <li
            className="dropdown"
            onMouseEnter={() => toggleDropdown(true)}
            onMouseLeave={() => toggleDropdown(false)}
          >
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setShowDropdown(!showDropdown);
              }}
            >
              Agents
            </a>
            {showDropdown && (
              <ul className="dropdown-menu">
                <li>
                  <a href="/agents/all">All Agents</a>
                </li>
                <li>
                  <a href="/agents/top">Top Agents</a>
                </li>
                <li>
                  <a href="/agents/regions">Agents by Region</a>
                </li>
              </ul>
            )}
          </li>

          <li>
            <a href="/dashboard/top-performance">Top Performancer</a>
          </li>
          <li>
            <a href="/dashboard/transactions">Transactions</a>
          </li>
          <li>
            <a href="/profile">Profile</a>
          </li>
          <li>
            <Link to="/">Home</Link>
          </li>

          {!isLoggedIn ? (
            <li>
              <Link to="/">Login</Link>
            </li>
          ) : (
            <li>
              <button
                onClick={handleLogout}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "white",
                  fontWeight: "bold",
                }}
              >
                Logout
              </button>
            </li>
          )}
        </ul>
      </nav>

      <style>{`
        .header {
          position: fixed;
          top: 0;
          width: 100%;
          background-color: #232f3e;
          color: white;
          padding: 10px 30px;
          z-index: 1000;
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
        }

        .header h1 {
          margin: 0;
          font-size: 1.5rem;
          color: #ff9900;
          white-space: nowrap;
        }

        nav ul {
          display: flex;
          list-style: none;
          margin: 0;
          padding: 0;
        }

        nav ul li {
          position: relative;
        }

        nav ul li a {
          color: white;
          text-decoration: none;
          font-weight: bold;
          padding: 8px 12px;
          display: block;
          border-radius: 4px;
        }

        nav ul li a:hover {
          background-color: rgb(61, 72, 87);
          border-radius: 10px;
        }

        .dropdown-menu {
          display: none;
          flex-direction: column;
          background-color: rgb(52, 78, 110);
          border-radius: 10px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
          position: absolute;
          top: 100%;
          left: 0;
          padding: 0;
          margin: 0;
        }

        .dropdown-menu li a {
          text-decoration: none;
          font-size: 0.8rem;
          padding: 10px 15px;
          text-align: center;
          color: white;
        }

        .dropdown-menu li a:hover {
          background-color: rgb(13, 103, 218);
        }

        .dropdown:hover .dropdown-menu {
          display: flex;
        }

        /* Responsive Styles */
        @media (max-width: 768px) {
          .header {
            flex-direction:row;
            justify-content: center;
            align-items: center;
            padding: 10px 20px;
            flex-wrap: wrap;
            justify-content:center;
            width: 100%;
          }

          .header h1 {
            font-size: 1.2rem;
            margin-bottom: 10px;
          }

          nav ul {
            flex-direction: row;
            width: 100%;
            align-items: center;
            gap: 10px;
            
          }

          nav ul li {
            width: 100%;
            
          }

          nav ul li a {
            font-size: 0.7rem;
            text-align: center;
            padding: 10px;
            width: 100%;
          }

          .dropdown-menu {
            width: 100%;
            background-color: rgb(52, 78, 110);
            display: ${showDropdown ? "flex" : "none"};
          }

          .dropdown-menu li a {
            font-size: 0.9rem;
            padding: 8px;
          }

          .dropdown-menu li a:hover {
            background-color: rgb(13, 103, 218);
          }
        }

        @media (max-width: 480px) {
          .header {
            width: 100%;
            flex-direction: column;
            align-items: center;
            background-color: blue;
          }

          .header h1 {
            font-size: 0.5rem;
            margin-bottom: 10px;
            width: 100%;
            text-align: center;
          }

          nav ul {
            flex-direction: column;
            gap: 6px;
            width: 100%;
          }

          nav ul li {
            width: 100%;
            text-align: center;
          }

          nav ul li a {
            font-size: 1rem;
            padding: 10px;
            width: 100%;
          }

          .dropdown-menu {
            position: static;
            width: 100%;
            background-color: rgb(52, 78, 110);
            display: ${showDropdown ? "flex" : "none"};
          }

          .dropdown-menu li a {
            font-size: 0.9rem;
            background-color: #2b4162;
            color: white;
            padding: 10px;
          }

          .dropdown-menu li a:hover {
            background-color: #0d67da;
          }
        }
          h1 a {
  text-decoration: none;
  color: inherit;
}
h1 a:hover {
  color: #0077c0;
}

      `}</style>
    </header>
  );
};

export default Header;
