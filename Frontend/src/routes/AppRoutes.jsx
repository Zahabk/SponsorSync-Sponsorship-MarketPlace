import { BrowserRouter, Route, Routes } from "react-router";
import MainLayout from "../layouts/MainLayout";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import ProtectedRoute from "../routes/ProtectedRoute";
import Events from "../pages/Events";
import CreateEvent from "../pages/CreateEvent";
import LoginRegisterLayout from "../layouts/LoginRegisterLayout";
import Profile from "../pages/Profile";
import AuthorizedRoute from "./AuthorizedRoute";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* For login/register layout  */}
        <Route path="/" element={<LoginRegisterLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Route>

        {/* Main layout  */}
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />

          {/* For organizer only */}
          <Route
            path="/events"
            element={
              <AuthorizedRoute allowedRole={"organizer"}>
                <Events />
              </AuthorizedRoute>
            }
          />
          <Route
            path="create-event"
            element={
              <AuthorizedRoute allowedRole={"organizer"}>
                <CreateEvent />
              </AuthorizedRoute>
            }
          />

          {/* For sponsor only */}
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
