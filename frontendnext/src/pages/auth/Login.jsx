import React, { useState } from "react";
import axiosInstance from "../../api/axiosInstance";
import { useNavigate } from "react-router-dom";
import { SiGmail } from "react-icons/si";
import { DiYahooSmall } from "react-icons/di";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axiosInstance.post(
        `${VITE_API_URL}/api/auth/login`,
        { email, password }
      );

      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("authToken", data.token);

      const role = data.user?.role;
      if (role === "franchise") navigate("/dashboard/franchise/");
      else if (role === "agent") navigate("/dashboard/agent");
      else if (role === "vendor") navigate("/dashboard");
      else if (role === "territory") navigate("/dashboard/territory");
      else if (role === "customer-become-vendor")
        navigate("/dashboard/customer-become-vendor");
      else if (role === "admin") navigate("/dashboard");
    } catch (err) {
      setError("Invalid email or password");
    }
  };

  return (
    <div className="login-page">
      <div className="login-box">
        <h2 className="text-center mb-4">Welcome to CRM</h2>
        <form onSubmit={handleSubmit}>
          <label>Email Address</label>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          {/* Password Field */}
          <label>Password</label>
          <div className="input-group">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <span
              className="toggle-icon"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          {error && <p className="error-message">{error}</p>}

          <button type="submit" className="login-btn">
            Login
          </button>
        </form>

        <div className="link-group">
          <a href="#">Forgot Password?</a>
          <a href="/signup">Create an Account</a>
        </div>

        <div className="divider">
          <span>or continue with</span>
        </div>

        <div className="social-icons">
          <a href="https://mail.google.com" target="_blank" rel="noreferrer">
            <SiGmail className="gmail-icon" size={22} />
          </a>
          <a href="https://mail.yahoo.com" target="_blank" rel="noreferrer">
            <DiYahooSmall className="yahoo-icon" size={32} />
          </a>
        </div>
      </div>

      <style>{`
        .login-page {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 100vh;
          width: 100vw;
          font-family: "Poppins", sans-serif;
        }

        .login-box {
          background:#002e2c;
          backdrop-filter: blur(12px);
          border-radius: 16px;
          padding: 40px;
          width: 100%;
          max-width: 400px;
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
          color: #fff;
          animation: fadeIn 0.8s ease;
        }

        h2 {
          font-weight: 600;
          font-size: 1.8rem;
        }

        label {
          display: block;
          margin: 12px 0 6px;
          font-size: 0.95rem;
          font-weight: 500;
        }

        input {
          width: 100%;
          padding: 10px 12px;
          border-radius: 8px;
          border: none;
          outline: none;
          font-size: 0.95rem;
          background: rgba(255, 255, 255, 0.85);
          color: #333;
          transition: all 0.3s ease;
        }

        input:focus {
          background: #fff;
          box-shadow: 0 0 5px rgba(37, 117, 252, 0.5);
        }

        .input-group {
          position: relative;
        }

        .toggle-icon {
          position: absolute;
          right: 10px;
          top: 50%;
          transform: translateY(-50%);
          cursor: pointer;
          color: #333;
          opacity: 0.7;
        }

        .toggle-icon:hover {
          opacity: 1;
          color: #2575fc;
        }

        .login-btn {
          width: 100%;
          margin-top: 20px;
          padding: 12px;
          background: linear-gradient(90deg, #6a11cb, #2575fc);
          border: none;
          border-radius: 8px;
          color: #fff;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .login-btn:hover {
          background: linear-gradient(90deg, #2575fc, #6a11cb);
          transform: translateY(-2px);
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
        }

        .error-message {
          color: #ffdddd;
          background: rgba(255, 0, 0, 0.2);
          border-radius: 6px;
          padding: 8px;
          font-weight: 500;
          text-align: center;
        }

        .link-group {
          display: flex;
          justify-content: space-between;
          margin-top: 15px;
          font-size: 0.9rem;
        }

        .link-group a {
          color: #e0e0e0;
          text-decoration: none;
          transition: 0.3s;
        }

        .link-group a:hover {
          color: #fff;
          text-decoration: underline;
        }

        .divider {
          display: flex;
          align-items: center;
          text-align: center;
          margin: 25px 0 15px;
          color: #ddd;
        }

        .divider::before,
        .divider::after {
          content: "";
          flex: 1;
          border-bottom: 1px solid rgba(255, 255, 255, 0.3);
        }

        .divider:not(:empty)::before {
          margin-right: 10px;
        }
        .divider:not(:empty)::after {
          margin-left: 10px;
        }

        .social-icons {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 20px;
        }

        .gmail-icon, .yahoo-icon {
          transition: transform 0.2s ease;
          cursor: pointer;
          color: #fff;     
        }

        .gmail-icon:hover { color: #ff4b4b; transform: scale(1.1); }
        .yahoo-icon:hover { color: #ff4b4b; transform: scale(1.1); }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default LoginPage;
