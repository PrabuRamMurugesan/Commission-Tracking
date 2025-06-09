import React from "react";

const Footer = () => {
  return (
    <footer className="footer">
      <p>&copy; 2024 Commission Tracking System</p>
      <style>
        {`
        .footer {
  position: fixed;
  bottom: 0;
  width: 100%;
  background-color: #252d3a;
  color: white;
  text-align: center;
  padding: 10px 0;
}
`}
      </style>
    </footer>
  );
};

export default Footer;
