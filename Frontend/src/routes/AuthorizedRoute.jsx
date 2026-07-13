import React from "react";
import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";
import { toast } from "react-toastify";

const AuthorizedRoute = ({children,allowedRole}) => {
  const { isAuthenticated, loading, user } = useAuth();
  
  if (loading) return null;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== allowedRole) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default AuthorizedRoute;
