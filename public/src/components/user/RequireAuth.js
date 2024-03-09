import React from "react";
import { Navigate } from "react-router-dom";

function RequireAuth({ isAuthenticated, children }) {
  if (!isAuthenticated) {
    console.log("en requireAuth")
    return <Navigate to="/auth" />;
  }
  return <>{children}</>;
}

export default RequireAuth;
