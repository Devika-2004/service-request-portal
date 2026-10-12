import { useState, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../services/api";
import AuthContext from "../context/AuthContext";

const roleConfig = {
  employee: {
    title: "Employee Login",
    subtitle: "Sign in to create and track your service requests.",
    color: "#2563eb",
  },
  support: {
    title: "Support Team Login",
    subtitle: "Sign in to manage service requests and resolutions.",
    color: "#0891b2",
  },
  admin: {
    title: "Administrator Login",
    subtitle: "Sign in to monitor and manage the service portal.",
    color: "#172033",
  },
};

function Login({ expectedRole: roleProp }) {
  const { role: roleParam } = useParams();
  const expectedRole = roleProp || roleParam;
  const config = roleConfig[expectedRole];

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (!config) {
      setErrorMessage("Invalid login page. Please select your role again.");
      return;
    }

    setLoading(true);

    try {
      const response = await API.post("/auth/login", {
        email,
        password,
      });

      const { token, user } = response.data;

      // Verify the actual role returned by the backend.
      if (user.role !== expectedRole) {
        setErrorMessage(
          `Access denied. Please use the ${roleConfig[user.role]?.title || "correct"} page for your account.`
        );
        return;
      }

      // Save authentication only after role verification.
      login(token, user);

      if (user.role === "employee") {
        navigate("/employee/dashboard");
      } else if (user.role === "support") {
        navigate("/support/dashboard");
      } else if (user.role === "admin") {
        navigate("/admin/dashboard");
      }
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message ||
          "Login failed. Please check your email and password."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "calc(100vh - 70px)",
        background: "#f6f8fc",
        padding: "55px 16px",
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
      }}
    >
      <div
        className="card border-0"
        style={{
          width: "100%",
          maxWidth: "460px",
          borderRadius: "18px",
          boxShadow: "0 12px 35px rgba(15,23,42,0.08)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "6px",
            background: config?.color || "#2563eb",
          }}
        />

        <div style={{ padding: "35px 32px" }}>
          <button
            type="button"
            onClick={() => navigate("/")}
            className="btn btn-link p-0 mb-4 text-decoration-none"
            style={{ color: "#64748b", fontSize: "14px" }}
          >
            ← Back to role selection
          </button>

          <div className="text-center mb-4">
            <div
              style={{
                width: "62px",
                height: "62px",
                borderRadius: "16px",
                background: `${config?.color || "#2563eb"}12`,
                color: config?.color || "#2563eb",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "27px",
                fontWeight: "700",
                margin: "0 auto 18px",
              }}
            >
              {expectedRole === "employee"
                ? "E"
                : expectedRole === "support"
                  ? "S"
                  : "A"}
            </div>

            <h2
              style={{
                fontSize: "27px",
                fontWeight: "750",
                color: "#172033",
                marginBottom: "10px",
              }}
            >
              {config?.title || "Login"}
            </h2>

            <p
              style={{
                color: "#64748b",
                fontSize: "14px",
                lineHeight: "1.7",
                margin: 0,
              }}
            >
              {config?.subtitle || "Sign in to your account."}
            </p>
          </div>

          {errorMessage && (
            <div
              className="alert alert-danger"
              role="alert"
              style={{
                fontSize: "14px",
                lineHeight: "1.6",
              }}
            >
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleLogin}>
            <div className="mb-3">
              <label
                htmlFor="email"
                className="form-label fw-semibold"
                style={{ color: "#334155", fontSize: "14px" }}
              >
                Email Address
              </label>

              <input
                id="email"
                type="email"
                className="form-control"
                style={{ padding: "12px", borderRadius: "9px" }}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                autoComplete="username"
                required
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="password"
                className="form-label fw-semibold"
                style={{ color: "#334155", fontSize: "14px" }}
              >
                Password
              </label>

              <input
                id="password"
                type="password"
                className="form-control"
                style={{ padding: "12px", borderRadius: "9px" }}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                autoComplete="current-password"
                required
              />
            </div>

            <button
              type="submit"
              className="btn w-100 text-white"
              disabled={loading}
              style={{
                padding: "12px",
                borderRadius: "9px",
                border: "none",
                background: config?.color || "#2563eb",
                fontWeight: "600",
              }}
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          {expectedRole === "employee" && (
            <div
              className="text-center mt-4"
              style={{ fontSize: "14px", color: "#64748b" }}
            >
              Don't have an account?{" "}
              <button
                type="button"
                className="btn btn-link p-0 text-decoration-none fw-semibold"
                onClick={() => navigate("/register")}
                style={{ color: "#2563eb" }}
              >
                Register
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Login;