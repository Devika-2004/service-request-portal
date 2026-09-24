import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";

function Navbar() {
  const navigate = useNavigate();

  const { user, logout } = useContext(AuthContext);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  if (!user) {
    return null;
  }

  const goToDashboard = () => {
    if (user.role === "employee") {
      navigate("/employee/dashboard");
    } else if (user.role === "support") {
      navigate("/support/dashboard");
    } else if (user.role === "admin") {
      navigate("/admin/dashboard");
    }
  };

  return (
    <nav className="navbar navbar-dark bg-dark px-4">
      <div className="container-fluid">
        <span
          className="navbar-brand"
          style={{ cursor: "pointer" }}
          onClick={goToDashboard}
        >
          Service Request Portal
        </span>

        <div className="d-flex align-items-center gap-3">
          <span className="text-white">
            {user.name} ({user.role})
          </span>

          <button
            className="btn btn-outline-light btn-sm"
            onClick={goToDashboard}
          >
            Dashboard
          </button>

          <button
            className="btn btn-danger btn-sm"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;