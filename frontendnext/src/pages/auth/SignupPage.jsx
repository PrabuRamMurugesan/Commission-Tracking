import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";

function SignupPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "agent", // default role
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    // Validate password match
    if (formData.password !== formData.confirmPassword) {
      setError("❌ Passwords do not match!");
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:3000/api/auth/signup",
        formData
      );

      console.log(res, "response data");

      setMessage("✅ Signup successful! Redirecting to login...");
      setTimeout(() => navigate("/"), 2000); // redirect after success
    } catch (err) {
      if (err.response && err.response.data.message) {
        setError(`❌ ${err.response.data.message}`);
      } else {
        setError("❌ Signup failed. Please try again.");
      }
    }
  };

  return (
    <div className="signup-page">
      <div className="signup-box">
        <h2 className="text-center mb-4">Create Your Account</h2>
        <form onSubmit={handleSubmit}>
          {/* Role Selector */}
          <label>Role</label>
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="form-control mb-3"
            required
          >
            <option value="admin">Admin</option>
            <option value="agent">Agent</option>
            <option value="vendor">Vendor</option>
            <option value="manager">Manager</option>
            <option value="franchise">Franchise</option>
            <option value="territory-head">Territory Head</option>
          </select>

          <div className="d-flex flex-row align-items-center gap-2">
            <div>
              {/* Name */}
              <label>Name</label>
              <input
                name="name"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={handleChange}
                className="form-control mb-3"
                required
              />
            </div>
            <div>
              {/* Email */}
              <label>Email</label>
              <input
                name="email"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                className="form-control mb-3"
                required
              />
            </div>{" "}
          </div>

          {/* Password */}
          <label>Password</label>
          <div className="input-group mb-3">
            <input
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter password"
              value={formData.password}
              onChange={handleChange}
              className="form-control"
              required
            />
            <span
              className="input-group-text toggle-icon"
              onClick={() => setShowPassword(!showPassword)}
              style={{ cursor: "pointer", background: "#fff" }}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          {/* Confirm Password */}
          <label>Confirm Password</label>
          <div className="input-group mb-3">
            <input
              name="confirmPassword"
              type={showConfirm ? "text" : "password"}
              placeholder="Re-enter password"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="form-control"
              required
            />
            <span
              className="input-group-text toggle-icon"
              onClick={() => setShowConfirm(!showConfirm)}
              style={{ cursor: "pointer", background: "#fff" }}
            >
              {showConfirm ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          {message && <div className="alert alert-success">{message}</div>}
          {error && <div className="alert alert-danger">{error}</div>}

          <button type="submit" className="btn btn-primary w-100 mt-2">
            Register
          </button>
        </form>
        <div>
          <p className="text-center mt-3">
            Already have an account?{" "}
            <a href="/" className="text-deco">
              Login
            </a>
          </p>
        </div>
      </div>

      <style>{`
.signup-page {
  display: flex;
  align-items: center;
  justify-content: end;
  height: 100vh;
  width: 100vw;
  font-family: "Poppins", sans-serif;
  background: url("https://images.unsplash.com/photo-1507679799987-c73779587ccf?ixlib=rb-1.2.1&auto=format&fit=crop&w=1170&q=80")
    center/cover no-repeat;
  padding: 50px;
}

.signup-box {
  background: rgba(0, 0, 0, 0.75);
  backdrop-filter: blur(12px);
  border-radius: 16px;
  padding: 40px;
  width: 100%;
  max-width: 500px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
  color: #fff;
  animation: fadeIn 0.8s ease;
  transition: all 0.3s ease;
}

/* Responsive adjustments */
@media (max-width: 992px) {
  .signup-page {
    justify-content: center;
    padding: 30px;
  }

  .signup-box {
    max-width: 450px;
    padding: 35px;
  }
}

@media (max-width: 768px) {
  .signup-page {
    justify-content: center;
    padding: 20px;
  }

  .signup-box {
    max-width: 90%;
    padding: 30px;
  }
}

@media (max-width: 480px) {
  .signup-box {
    max-width: 100%;
    padding: 25px;
    border-radius: 12px;
  }

  h2 {
    font-size: 1.5rem;
  }

  label {
    font-size: 0.9rem;
  }

  .form-control {
    font-size: 0.85rem;
    padding: 8px 10px;
  }

  .btn-primary {
    font-size: 0.9rem;
    padding: 10px;
  }
}

/* Shared styles */
h2 {
  font-weight: 600;
  color: #fff;
}

label {
  font-weight: 500;
  margin-bottom: 5px;
  color: #f5f5f5;
}

.form-control {
  border-radius: 8px;
  border: none;
  font-size: 0.95rem;
  padding: 10px 12px;
  background: rgba(255, 255, 255, 0.9);
}

.form-control:focus {
  border: none;
  box-shadow: 0 0 5px rgba(37, 117, 252, 0.5);
}

.btn-primary {
  background: linear-gradient(90deg, #6a11cb, #2575fc);
  border: none;
  font-weight: 600;
  padding: 12px;
  transition: all 0.3s ease;
}

.btn-primary:hover {
  background: linear-gradient(90deg, #2575fc, #6a11cb);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.alert {
  border-radius: 8px;
  margin-top: 15px;
  font-weight: 500;
}

.toggle-icon:hover {
  color: #2575fc;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.text-deco {
  color: #ffffff;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.3s ease;
}

.text-deco:hover {
  color: #2575fc;
  text-shadow: 0 0 5px rgba(37, 117, 252, 0.6);
}

.text-deco:active {
  opacity: 0.8;
}

      `}</style>
    </div>
  );
}

export default SignupPage;
