import React from "react";
import Footer from "../components/Footer";
import { Outlet } from "react-router";

const LoginRegisterLayout = () => {
  return (
    <div>
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default LoginRegisterLayout;
