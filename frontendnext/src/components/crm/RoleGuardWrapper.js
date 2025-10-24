import React from "react";
import { Navigate } from "react-router-dom";

// Example usage: <RoleGuardWrapper allowedRoles={['admin', 'staff']}>...</RoleGuardWrapper>

const RoleGuardWrapper = ({ children, allowedRoles }) => {
  const currentUser = JSON.parse(localStorage.getItem("user")) || {};
  const role = currentUser?.role;

  if (!allowedRoles.includes(role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};

export default RoleGuardWrapper;
