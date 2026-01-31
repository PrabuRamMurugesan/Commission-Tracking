// src/components/ToastMessage.jsx
import React, { useEffect } from "react";

const ToastMessage = ({ message, type = "success", onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => onClose(), 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      className={`toast align-items-center text-white bg-${
        type === "error" ? "danger" : type === "warning" ? "warning" : "success"
      } border-0 show position-fixed`}
      role="alert"
      style={{
        bottom: "80px",
        right: "20px",
        zIndex: 9999,
        minWidth: "300px",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
      }}
    >
      <div className="d-flex">
        <div className="toast-body">{message}</div>
        <button
          type="button"
          className="btn-close btn-close-white me-2 m-auto"
          aria-label="Close"
          onClick={onClose}
        ></button>
      </div>
    </div>
  );
};

export default ToastMessage;
