import { useNavigate } from "react-router-dom";

const roles = [
  {
    title: "Employee",
    description:
      "Create service requests and track their progress.",
    icon: "👤",
    role: "employee",
    color: "#2563eb",
  },
  {
    title: "Support Team",
    description:
      "Manage requests, assignments and resolutions.",
    icon: "🛠️",
    role: "support",
    color: "#0891b2",
  },
  {
    title: "Administrator",
    description:
      "Monitor requests, statistics and system activity.",
    icon: "🛡️",
    role: "admin",
    color: "#172033",
  },
];

function RoleSelection() {
  const navigate = useNavigate();

  return (
    <div
      style={{
        minHeight: "calc(100vh - 70px)",
        background: "#f6f8fc",
        padding: "55px 20px",
      }}
    >
      <div className="container">
        <div className="text-center mb-5">
          <div
            style={{
              display: "inline-block",
              background: "#eaf2ff",
              color: "#2563eb",
              padding: "8px 16px",
              borderRadius: "30px",
              fontSize: "13px",
              fontWeight: "600",
              marginBottom: "18px",
            }}
          >
            CORPORATE SERVICE MANAGEMENT
          </div>

          <h1
            style={{
              fontSize: "clamp(28px, 4vw, 40px)",
              fontWeight: "750",
              color: "#172033",
              marginBottom: "14px",
            }}
          >
            Welcome to Service Portal
          </h1>

          <p
            style={{
              color: "#64748b",
              fontSize: "16px",
              maxWidth: "600px",
              margin: "0 auto",
              lineHeight: "1.8",
            }}
          >
            Select your role to access the appropriate
            workspace and manage your service activities.
          </p>
        </div>

        <div className="row justify-content-center g-4">
          {roles.map((item) => (
            <div
              className="col-12 col-md-6 col-lg-4"
              key={item.role}
            >
              <div
                style={{
                  background: "#ffffff",
                  border: "1px solid #e2e8f0",
                  borderRadius: "18px",
                  padding: "30px 24px",
                  height: "100%",
                  boxShadow: "0 8px 24px rgba(15,23,42,0.05)",
                  transition: "transform 0.2s ease, box-shadow 0.2s ease",
                  display: "flex",
                  flexDirection: "column",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform =
                    "translateY(-5px)";
                  e.currentTarget.style.boxShadow =
                    "0 16px 35px rgba(15,23,42,0.10)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform =
                    "translateY(0)";
                  e.currentTarget.style.boxShadow =
                    "0 8px 24px rgba(15,23,42,0.05)";
                }}
              >
                <div
                  style={{
                    width: "58px",
                    height: "58px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: "15px",
                    background: `${item.color}12`,
                    fontSize: "27px",
                    marginBottom: "22px",
                  }}
                >
                  {item.icon}
                </div>

                <h3
                  style={{
                    color: "#172033",
                    fontSize: "22px",
                    marginBottom: "12px",
                  }}
                >
                  {item.title}
                </h3>

                <p
                  style={{
                    color: "#64748b",
                    fontSize: "14px",
                    lineHeight: "1.8",
                    marginBottom: "25px",
                    flexGrow: 1,
                  }}
                >
                  {item.description}
                </p>

                <button
                  type="button"
                  onClick={() =>
                    navigate(`/login/${item.role}`)
                  }
                  style={{
                    width: "100%",
                    padding: "12px",
                    background: item.color,
                    color: "#ffffff",
                    border: "none",
                    borderRadius: "9px",
                    fontWeight: "600",
                    cursor: "pointer",
                  }}
                >
                  Continue as {item.title}
                  <span style={{ marginLeft: "8px" }}>
                    →
                  </span>
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-5">
          <span style={{ color: "#64748b", fontSize: "14px" }}>
            New employee?
          </span>{" "}
          <button
            type="button"
            onClick={() => navigate("/register")}
            style={{
              color: "#2563eb",
              background: "none",
              border: "none",
              fontWeight: "600",
              cursor: "pointer",
            }}
          >
            Create an account
          </button>
        </div>

        <p
          className="text-center mt-4"
          style={{ color: "#94a3b8", fontSize: "12px" }}
        >
          Secure access · Role-based authorization
        </p>
      </div>
    </div>
  );
}

export default RoleSelection;