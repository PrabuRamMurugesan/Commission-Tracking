import React from "react";

const ToastAlert = ({ show, message, type = "success", onClose }) => {
  if (!show) return null;

  return (
    <div
      className={`alert alert-${type} alert-dismissible fade show mt-3`}
      role="alert"
    >
      {message}
      <button type="button" className="btn-close" onClick={onClose}></button>
    </div>
  );
};

export default ToastAlert;
