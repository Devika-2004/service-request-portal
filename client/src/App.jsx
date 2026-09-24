import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

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

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Navbar />

        <Routes>

          {/* Login */}
          <Route
            path="/"
            element={<Login />}
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
                allowedRoles={[
                  "employee",
                  "support",
                  "admin",
                ]}
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
              <ProtectedRoute
                allowedRoles={["support", "admin"]}
              >
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

        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;