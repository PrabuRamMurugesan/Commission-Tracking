import React, { useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import Sidebar from "../components/Sidebar";

const DarkModeSettings = () => {
  const [darkMode, setDarkMode] = useState(false);

  const toggleTheme = () => {
    setDarkMode(!darkMode);
    document.body.classList.toggle("dark-mode", !darkMode);
  };

  useEffect(() => {
    const savedMode = localStorage.getItem("darkMode");
    if (savedMode === "true") {
      setDarkMode(true);
    }
  }, []);

  

  return (
    <>
   <div className="theme-settings-wrapper">
  {/* Dark mode panel in the center */}
  <div className="dark-mode-container">
    <h2>🎨 Theme Settings</h2>
    <Button variant="dark" onClick={toggleTheme}>
      {darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
    </Button>
  </div>

  {/* Sidebar pushed to the right */}
  <div className="sidebar-container">
    <Sidebar />
  </div>
</div>

<style>
  {`
    .theme-settings-wrapper {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100vw;
      height: 100vh;
      padding: 0 40px;
      position: relative;
    }

    .dark-mode-container {
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      justify-content: start;
      align-items: center;
      background-color: #f0f0f0;
      padding: 60px;
      border-radius: 8px;
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
      gap: 20px;
      position: relative;
      left: 5%;
      top: -10%;
    }

    .sidebar-container {
      position: absolute;
      left: 0px;
      top: 0px;
    }

    .dark-mode {
      background-color: #121212;
      // color: black;
      

    }

    .dark-mode .card {
      background-color: #1e1e1e;
      color: #ffffff;
      
    }

    .dark-mode-container button {
      background-color: #333;
      border: none;
      padding: 10px 20px;
      border-radius: 4px;
      cursor: pointer;
    
    }

    .dark-mode-container button:hover {
      // background-color: red;
      color: white;
    }

    .dark-mode-container h2 {
      margin-top: 0;
    }
  `}
</style>

    </>
  );
};

export default DarkModeSettings;


//update
// import React, { useEffect, useState } from 'react';
// import 'bootstrap/dist/css/bootstrap.min.css';

// const DarkModeSettingsPage = () => {
//   const [darkMode, setDarkMode] = useState(() => {
//     return localStorage.getItem('theme') === 'dark';
//   });

//   const handleToggle = () => {
//     setDarkMode(!darkMode);
//     const theme = !darkMode ? 'dark' : 'light';
//     document.body.setAttribute('data-theme', theme);
//     localStorage.setItem('theme', theme);
//   };

//   useEffect(() => {
//     const currentTheme = localStorage.getItem('theme') || 'light';
//     document.body.setAttribute('data-theme', currentTheme);
//   }, []);

//   return (
//     <div className="container py-5 darkmode-settings-page">
//       <div className="row justify-content-center">
//         <div className="col-md-6">
//           <div className="card shadow">
//             <div className="card-header bg-dark text-white">
//               <h4>Dark Mode Settings</h4>
//             </div>
//             <div className="card-body">
//               <div className="form-check form-switch">
//                 <input
//                   className="form-check-input"
//                   type="checkbox"
//                   id="darkModeSwitch"
//                   checked={darkMode}
//                   onChange={handleToggle}
//                 />
//                 <label className="form-check-label" htmlFor="darkModeSwitch">
//                   {darkMode ? 'Dark Mode Enabled' : 'Dark Mode Disabled'}
//                 </label>
//               </div>
//               <p className="mt-3 text-muted">
//                 Your theme preference will be saved for future visits.
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>

//       <style>{`
//         body[data-theme='dark'] {
//           background-color: #121212;
//           color: #e0e0e0;
//         }
//         body[data-theme='dark'] .card {
//           background-color: #1e1e1e;
//           color: #ffffff;
//         }
//         body[data-theme='dark'] .btn,
//         body[data-theme='dark'] .form-control,
//         body[data-theme='dark'] .form-check-input {
//           background-color: #2c2c2c;
//           color: #fff;
//           border-color: #555;
//         }
//         .darkmode-settings-page h4 {
//           font-weight: 600;
//         }
//       `}</style>
//     </div>
//   );
// };

// export default DarkModeSettingsPage;
