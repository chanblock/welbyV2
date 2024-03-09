import React from "react";
import { Navigate } from "react-router-dom";

function RequireAuth({ isAuthenticated, children }) {
  if (!isAuthenticated) {
    return <Navigate to="/" />;
  }
  return <>{children}</>;
}

export default RequireAuth;
