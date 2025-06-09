import React, { useState } from "react";
import axiosInstance from "../../api/axiosInstance";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate(); // To redirect after successful login

 const handleSubmit = async (e) => {
   e.preventDefault();
   try {
     const { data } = await axiosInstance.post(
       "http://localhost:3000/api/auth/login",
       {
         email,
         password,
       }
     );

     // Save user to localStorage
     localStorage.setItem("user", JSON.stringify(data.user));
     localStorage.setItem("authToken", data.token);
     
    console.log(data.user.name, "user.name"); // "Francise"
     console.log(data.user.role, "user.role"); // "Francise"

     // ✅ Redirect based on user role
     const role = data.user?.role;

     if (role === "franchise") {
       navigate("/dashboard/franchise/");
     } else if (role === "agent") {
       navigate("/dashboard/agent");
     } else if (role === "vendor") {
       navigate("dashboard/customer-vendor");
     } else if (role === "territory-head") {
       navigate("dashboard/territory");
     } else if (role === "customer-become-vendor") {
       navigate("dashboard/customer-become-vendor");
     } else if (role === "admin") {
       navigate("/dashboard");
     } 
   } catch (err) {
     setError("Invalid email or password");
   }
 };


  return (
    <div className="login-container">
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <label>Email:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label>Password:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {error && <p className="error-message">{error}</p>}

        <button type="submit">Login</button>
      </form>

      <style>
        {`
          .login-container {
            max-width: 400px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f9f9f9;
            border-radius: 10px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          }

          h1 {
            text-align: center;
          }

          label {
            display: block;
            margin-bottom: 5px;
          }

          input {
            width: 100%;
            padding: 8px;
            margin-bottom: 10px;
            border: 1px solid #ccc;
            border-radius: 4px;
          }

          .error-message {
            color: red;
          }

          button {
            width: 100%;
            padding: 10px;
            background-color: #4CAF50;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
          }

          button:hover {
            background-color: #45a049;
          }
        `}
      </style>
    </div>
  );
};

export default LoginPage;
