import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

import RoleSelection from "./pages/RoleSelection";
import Login from "./pages/Login";
import EmployeeDashboard from "./pages/EmployeeDashboard";
import CreateRequest from "./pages/CreateRequest";
import RequestDetails from "./pages/RequestDetails";
import EditRequest from "./pages/EditRequest";
import SupportDashboard from "./pages/SupportDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import Register from "./pages/Register";
import Profile from "./pages/Profile";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Navbar />

        <Routes>
          {/* Role Selection Page */}
          <Route
            path="/"
            element={<RoleSelection />}
          />

          {/* Employee Login */}
          <Route
            path="/login/employee"
            element={<Login expectedRole="employee" />}
          />

          {/* Support Login */}
          <Route
            path="/login/support"
            element={<Login expectedRole="support" />}
          />

          {/* Admin Login */}
          <Route
            path="/login/admin"
            element={<Login expectedRole="admin" />}
          />

          {/* Register */}
          <Route
            path="/register"
            element={<Register />}
          />

          {/* Employee Dashboard */}
          <Route
            path="/employee/dashboard"
            element={
              <ProtectedRoute allowedRoles={["employee"]}>
                <EmployeeDashboard />
              </ProtectedRoute>
            }
          />

          {/* Create Request */}
          <Route
            path="/employee/create-request"
            element={
              <ProtectedRoute allowedRoles={["employee"]}>
                <CreateRequest />
              </ProtectedRoute>
            }
          />

          {/* Request Details */}
          <Route
            path="/requests/:id"
            element={
              <ProtectedRoute
                allowedRoles={["employee", "support", "admin"]}
              >
                <RequestDetails />
              </ProtectedRoute>
            }
          />

          {/* Edit Request */}
          <Route
            path="/requests/:id/edit"
            element={
              <ProtectedRoute allowedRoles={["employee"]}>
                <EditRequest />
              </ProtectedRoute>
            }
          />

          {/* Support Dashboard */}
          <Route
            path="/support/dashboard"
            element={
              <ProtectedRoute allowedRoles={["support", "admin"]}>
                <SupportDashboard />
              </ProtectedRoute>
            }
          />

          {/* Admin Dashboard */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          {/* Profile Page */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute
                allowedRoles={["employee", "support", "admin"]}
              >
                <Profile />
              </ProtectedRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;