import { Navigate } from "react-router-dom";

function ProtectedRoute({ children, allowedRoles }) {
  const token = localStorage.getItem("token");
  const userData = localStorage.getItem("user");

  if (!token || !userData) {
    return <Navigate to="/" replace />;
  }

  const user = JSON.parse(userData);

  if (!allowedRoles.includes(user.role)) {
    if (user.role === "employee") {
      return (
        <Navigate
          to="/employee/dashboard"
          replace
        />
      );
    }

    if (user.role === "support") {
      return (
        <Navigate
          to="/support/dashboard"
          replace
        />
      );
    }

    if (user.role === "admin") {
      return (
        <Navigate
          to="/admin/dashboard"
          replace
        />
      );
    }

    return <Navigate to="/" replace />;
  }

  return children;
}

export default ProtectedRoute;