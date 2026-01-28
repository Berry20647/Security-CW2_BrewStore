import React from "react";
import { Navigate } from "react-router-dom";

export default function AdminRoute({ children }) {
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user || !user.isAdmin) {
    return <Navigate to="/" replace />;
  }
  return <div className="min-h-screen">{children}</div>;
} 