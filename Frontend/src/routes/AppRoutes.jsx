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
import OrganizerDashboard from "../pages/OrganizerDashboard";
import DashboardLayout from "../layouts/DashboardLayout";
import MyEvents from "../pages/MyEvents";
import Proposals from "../pages/Proposals";
import MyProposals from "../pages/MyProposals";
import EditEvent from "../pages/EditEvent";

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
          <Route
            path="/events/:id"
            element={
              <ProtectedRoute>
                <EventDetails />
              </ProtectedRoute>
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
           <Route
            path="/my-proposals"
            element={
              <AuthorizedRoute allowedRole={"sponsor"}>
                <MyProposals />
              </AuthorizedRoute>
            }
          />
        </Route>

        {/* Dashboard Layout  */}
        <Route element={<DashboardLayout />}>
          <Route
            path="/dashboard"
            element={
              <AuthorizedRoute allowedRole={"organizer"}>
                <OrganizerDashboard />
              </AuthorizedRoute>
            }
          />
          <Route
            path="/dashboard/events"
            element={
              <AuthorizedRoute allowedRole={"organizer"}>
                <MyEvents />
              </AuthorizedRoute>
            }
          />
          <Route
            path="/dashboard/events/:id"
            element={
              <AuthorizedRoute allowedRole={"organizer"}>
                <EditEvent />
              </AuthorizedRoute>
            }
          />
          <Route
            path="/dashboard/proposals"
            element={
              <AuthorizedRoute allowedRole={"organizer"}>
                <Proposals />
              </AuthorizedRoute>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
