import { BrowserRouter, Route, Routes } from "react-router";
import MainLayout from "../layouts/MainLayout";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import ProtectedRoute from "../routes/ProtectedRoute";
import Events from "../pages/Events";
import CreateEvent from "../pages/CreateEvent";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/events" element={
            <ProtectedRoute allowedRole={"organizer"}>
              <Events/>
            </ProtectedRoute>
          }/>
        </Route>
        <Route path="create-event" element={<CreateEvent/>} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
