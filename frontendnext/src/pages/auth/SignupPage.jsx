
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function SignupPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "agent", // default role
  });

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

    try {
      // const res = await axios.post("/api/signup", formData);
      const res = await axios.post(
        "http://localhost:3000/api/auth/signup",
        formData
      );

      console.log(res, "response data");

      setMessage("✅ Signup successful! Redirecting to login...");
      setTimeout(() => navigate("/dashboard"), 2000); // Redirect after 2s
    } catch (err) {
      if (err.response && err.response.data.message) {
        setError(`❌ ${err.response.data.message}`);
      } else {
        setError("❌ Signup failed. Please try again.");
      }
    }
  };

  return (
    <div className="container mt-5">
      <h2>Sign Up</h2>
      <form onSubmit={handleSubmit}>
        <label>Role:</label>
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

        <input
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
          className="form-control mb-2"
          required
        />
        <input
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          type="email"
          className="form-control mb-2"
          required
        />
        <input
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          type="password"
          className="form-control mb-3"
          required
        />
        <button type="submit" className="btn btn-primary">
          Register
        </button>
      </form>

      {message && <div className="alert alert-success mt-3">{message}</div>}
      {error && <div className="alert alert-danger mt-3">{error}</div>}
    </div>
  );
}

export default SignupPage;
