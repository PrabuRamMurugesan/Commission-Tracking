// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import "../styles/auth.css";

// const AuthForm = ({ type }) => {
//   const [username, setUsername] = useState("");
//   const [email, setEmail] = useState("");
//   const [mobile, setMobile] = useState("");
//   const [password, setPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");
//   const [rememberMe, setRememberMe] = useState(false);
//   const [passwordMatchError, setPasswordMatchError] = useState("");
//   const navigate = useNavigate();

//   const handlePasswordChange = (e) => {
//     setPassword(e.target.value);
//     if (confirmPassword && e.target.value !== confirmPassword) {
//       setPasswordMatchError("Passwords do not match!");
//     } else {
//       setPasswordMatchError("");
//     }
//   };

//   const handleConfirmPasswordChange = (e) => {
//     setConfirmPassword(e.target.value);
//     if (password && e.target.value !== password) {
//       setPasswordMatchError("Passwords do not match!");
//     } else {
//       setPasswordMatchError("");
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (type !== "login" && password !== confirmPassword) {
//       alert("Passwords do not match!");
//       return;
//     }

//     const endpoint = type === "login" ? "/api/auth/login" : "/api/auth/signup";
//     const payload =
//       type === "login"
//         ? { email, password }
//         : { username, email, mobile, password };

//     const response = await fetch(`http://localhost:5000${endpoint}`, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(payload),
//     });

//     const data = await response.json();
//     if (response.ok) {
//       alert(type === "login" ? "Login Successful" : "Signup Successful");
//       navigate(type === "login" ? "/dashboard" : "/login");
//     } else {
//       alert(data.message || "Error occurred");
//     }
//   };

//   return (
//     <div className="auth-container">
//       <div className="auth-box">
//         {/* LOGO BUTTON */}
//         <button className="logo-btn" onClick={() => navigate("/")}>
//           🏠 Home
//         </button>

//         <h2>{type === "login" ? "Hi, Welcome Back! 👋" : "Create an account"}</h2>
//         {type !== "login" && <p className="subtext">Connect with your friends today!</p>}
        
//         <form onSubmit={handleSubmit}>
//           {type !== "login" && (
//             <div className="input-group">
//               <input
//                 type="text"
//                 placeholder="Enter Your Username"
//                 value={username}
//                 onChange={(e) => setUsername(e.target.value)}
//                 required
//               />
//             </div>
//           )}
//           <div className="input-group">
//             <input
//               type="email"
//               placeholder="Enter Your Email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//                 required
//               />
//           </div>
//           {type !== "login" && (
//             <div className="input-group">
//               <input
//                 type="text"
//                 placeholder="Enter Your Phone Number"
//                 value={mobile}
//                 onChange={(e) => setMobile(e.target.value)}
//                 required
//               />
//             </div>
//           )}
//           <div className="input-group">
//             <input
//               type="password"
//               placeholder="Enter Your Password"
//               value={password}
//               onChange={handlePasswordChange}
//               required
//             />
//           </div>

//           {type !== "login" && (
//             <div className="input-group">
//               <input
//                 type="password"
//                 placeholder="Confirm Password"
//                 value={confirmPassword}
//                 onChange={handleConfirmPasswordChange}
//                 required
//               />
//               {passwordMatchError && (
//                 <p className="error-text">{passwordMatchError}</p>
//               )}
//             </div>
//           )}

//           {type === "login" && (
//             <div className="remember-me">
//               <input
//                 type="checkbox"
//                 checked={rememberMe}
//                 onChange={() => setRememberMe(!rememberMe)}
//               />
//               <label>Remember Me</label>
//               <span className="forgot-password">Forgot Password?</span>
//             </div>
//           )}

//           <button type="submit" className="auth-btn" disabled={passwordMatchError}>
//             {type === "login" ? "Login" : "Sign Up"}
//           </button>
//         </form>

//         <p className="switch-link">
//           {type === "login"
//             ? "Don't have an account?"
//             : "Already have an account?"}{" "}
//           <span onClick={() => navigate(type === "login" ? "/signup" : "/login")}>
//             {type === "login" ? "Sign Up" : "Login"}
//           </span>
//         </p>
//       </div>
//     </div>
//   );
// };

// export default AuthForm;

import connectDB from '../../utils/dbconnect'; // ✅ CORRECT

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../services/authService";
import "../styles/auth.css";

const AuthForm = ({ type }) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [passwordMatchError, setPasswordMatchError] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    if (confirmPassword && e.target.value !== confirmPassword) {
      setPasswordMatchError("Passwords do not match!");
    } else {
      setPasswordMatchError("");
    }
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
    if (password && e.target.value !== password) {
      setPasswordMatchError("Passwords do not match!");
    } else {
      setPasswordMatchError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Reset error message before new submission

    if (type !== "login" && password !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    const endpoint = type === "login" ? "/api/auth/login" : "/api/auth/signup";
    const payload =
      type === "login"
        ? { email, password }
        : { username, email, mobile, password };

    try {
      const response = await fetch(`http://localhost:3001${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        // Store auth token only for login
        if (type === "login") {
          localStorage.setItem("authToken", data.token);
          navigate("/dashboard"); // ✅ Redirect to Dashboard on success
        } else {
          alert("Signup Successful, please login!");
          navigate("/auth/login"); // Redirect to login after signup
        }
      } else {
        setError(data.message || "An error occurred, please try again.");
      }
    } catch (err) {
      setError("Server error, please try again later.");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        {/* LOGO BUTTON */}
        <button className="logo-btn" onClick={() => navigate("/")}>
          🏠 Home
        </button>

        <h2>{type === "login" ? "Hi, Welcome Back! 👋" : "Create an account"}</h2>
        {type !== "login" && <p className="subtext">Connect with your friends today!</p>}

        {error && <p className="error-text">{error}</p>}

        <form onSubmit={handleSubmit}>
          {type !== "login" && (
            <div className="input-group">
              <input
                type="text"
                placeholder="Enter Your Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
          )}
          <div className="input-group">
            <input
              type="email"
              placeholder="Enter Your Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          {type !== "login" && (
            <div className="input-group">
              <input
                type="text"
                placeholder="Enter Your Phone Number"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                required
              />
            </div>
          )}
          <div className="input-group">
            <input
              type="password"
              placeholder="Enter Your Password"
              value={password}
              onChange={handlePasswordChange}
              required
            />
          </div>

          {type !== "login" && (
            <div className="input-group">
              <input
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={handleConfirmPasswordChange}
                required
              />
              {passwordMatchError && (
                <p className="error-text">{passwordMatchError}</p>
              )}
            </div>
          )}

          {type === "login" && (
            <div className="remember-me">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={() => setRememberMe(!rememberMe)}
              />
              <label>Remember Me</label>
              <span className="forgot-password">Forgot Password?</span>
            </div>
          )}

          <button type="submit" className="auth-btn" disabled={passwordMatchError}>
            {type === "login" ? "Login" : "Sign Up"}
          </button>
        </form>

        <p className="switch-link">
          {type === "login"
            ? "Don't have an account?"
            : "Already have an account?"}{" "}
          <span onClick={() => navigate(type === "login" ? "/auth/signup" : "/auth/login")}>
            {type === "login" ? "Sign Up" : "Login"}
          </span>
        </p>
      </div>
    </div>
  );
};

export default AuthForm;

