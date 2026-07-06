import { Navigate } from "react-router";
import { useAuth } from "../context/AuthContext.jsx";

const ProtectedRoute = ({ children, allowedRole }) => { 
  const { isAuthenticated, loading, user } = useAuth(); 

  console.log(allowedRole);
  
  if (loading) return null; 

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== allowedRole) {
    return <Navigate to="/" replace />;
  }

  return children; 
};

export default ProtectedRoute;
