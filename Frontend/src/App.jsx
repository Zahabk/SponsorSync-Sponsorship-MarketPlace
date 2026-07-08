import React from "react";
import AppRoutes from "./routes/AppRoutes";
import { AuthProvider } from "./context/AuthContext";
import { ToastContainer } from "react-toastify";

const App = () => {
  return (
    <AuthProvider>
      <ToastContainer position="top-right" autoClose={2000} closeOnClick={true} theme="colored" />
      <AppRoutes />
    </AuthProvider>
  );
};

export default App;
