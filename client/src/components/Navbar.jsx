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

  const goToProfile = () => {
    navigate("/profile");
  };

  return (
    <nav
      className="navbar px-3 px-md-4"
      style={{
        minHeight: "68px",
        backgroundColor: "var(--navy)",
        borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
      }}
    >
      <div className="container-fluid">
        {/* Brand */}
        <div
          className="d-flex align-items-center"
          style={{ cursor: "pointer" }}
          onClick={goToDashboard}
        >
          <div
            className="d-flex align-items-center justify-content-center me-2"
            style={{
              width: "34px",
              height: "34px",
              borderRadius: "9px",
              backgroundColor: "var(--primary)",
              color: "#ffffff",
              fontSize: "16px",
              fontWeight: 700,
            }}
          >
            S
          </div>

          <span
            style={{
              color: "#ffffff",
              fontSize: "17px",
              fontWeight: 650,
              letterSpacing: "-0.2px",
            }}
          >
            Service Request Portal
          </span>
        </div>

        {/* Right Side */}
        <div className="d-flex align-items-center gap-2 gap-md-3">
          {/* User */}
          <div
            className="d-none d-sm-flex align-items-center"
            style={{
              color: "#cbd5e1",
              fontSize: "14px",
            }}
          >
            <span
              style={{
                color: "#ffffff",
                fontWeight: 600,
              }}
            >
              {user.name}
            </span>

            <span
              className="ms-1"
              style={{
                color: "#94a3b8",
              }}
            >
              ({user.role})
            </span>
          </div>

          {/* Dashboard */}
          <button
            type="button"
            onClick={goToDashboard}
            className="btn btn-sm"
            style={{
              color: "#ffffff",
              backgroundColor: "rgba(255, 255, 255, 0.08)",
              border: "1px solid rgba(255, 255, 255, 0.18)",
              borderRadius: "8px",
              padding: "7px 14px",
              fontWeight: 600,
            }}
          >
            Dashboard
          </button>

          {/* Profile */}
          <button
            type="button"
            onClick={goToProfile}
            className="btn btn-sm"
            style={{
              color: "#ffffff",
              backgroundColor: "var(--primary)",
              border: "1px solid var(--primary)",
              borderRadius: "8px",
              padding: "7px 14px",
              fontWeight: 600,
            }}
          >
            My Profile
          </button>

          {/* Logout */}
          <button
            type="button"
            onClick={handleLogout}
            className="btn btn-sm"
            style={{
              color: "#ffffff",
              backgroundColor: "#dc2626",
              border: "1px solid #dc2626",
              borderRadius: "8px",
              padding: "7px 14px",
              fontWeight: 600,
            }}
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;