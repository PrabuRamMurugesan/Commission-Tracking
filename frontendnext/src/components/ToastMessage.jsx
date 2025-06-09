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
        type === "error" ? "danger" : "success"
      } border-0 show position-fixed bottom-0 end-0 m-4`}
      role="alert"
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
