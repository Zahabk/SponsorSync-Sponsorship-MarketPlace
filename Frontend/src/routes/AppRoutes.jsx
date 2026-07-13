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
import EventDetails from "../pages/EventDetails";
import PublicRoute from "./PublicRoute";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* For login/register layout  */}
        <Route element={<LoginRegisterLayout />}>
          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />
          <Route
            path="/signup"
            element={
              <PublicRoute>
                <Signup />
              </PublicRoute>
            }
          />
        </Route>

        {/* Main layout  */}
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="/events" element={<Events />} />
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
            path="create-event"
            element={
              <AuthorizedRoute allowedRole={"organizer"}>
                <CreateEvent />
              </AuthorizedRoute>
            }
          />

          {/* For sponsor only */}
          <Route
            path="/events/:id"
            element={
              <AuthorizedRoute allowedRole={"sponsor"}>
                <EventDetails />
              </AuthorizedRoute>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
