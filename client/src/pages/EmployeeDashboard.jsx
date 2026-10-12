import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

function EmployeeDashboard() {
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await API.get("/requests", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setRequests(response.data.requests);
      } catch (error) {
        console.error("Failed to fetch requests:", error);

        setError(
          error.response?.data?.message ||
            "Failed to load requests"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  // =========================================
  // STATISTICS
  // =========================================

  const totalRequests = requests.length;

  const newRequests = requests.filter(
    (request) => request.status === "New"
  ).length;

  const inProgressRequests = requests.filter(
    (request) => request.status === "In Progress"
  ).length;

  const resolvedRequests = requests.filter(
    (request) => request.status === "Resolved"
  ).length;

  const closedRequests = requests.filter(
    (request) => request.status === "Closed"
  ).length;

  // =========================================
  // STATUS BADGE
  // =========================================

  const getStatusBadge = (status) => {
    const styles = {
      New: {
        background: "#EAF2FF",
        color: "#2563EB",
      },

      Assigned: {
        background: "#ECFEFF",
        color: "#0891B2",
      },

      "In Progress": {
        background: "#FFF7E6",
        color: "#D97706",
      },

      Resolved: {
        background: "#ECFDF3",
        color: "#16A34A",
      },

      Closed: {
        background: "#F1F5F9",
        color: "#475569",
      },
    };

    const style = styles[status] || {
      background: "#F1F5F9",
      color: "#475569",
    };

    return (
      <span
        className="badge rounded-pill px-3 py-2"
        style={{
          backgroundColor: style.background,
          color: style.color,
          fontWeight: 600,
        }}
      >
        {status}
      </span>
    );
  };

  // =========================================
  // PRIORITY BADGE
  // =========================================

  const getPriorityBadge = (priority) => {
    const styles = {
      Critical: {
        background: "#FEF2F2",
        color: "#DC2626",
      },

      High: {
        background: "#FFF7E6",
        color: "#D97706",
      },

      Medium: {
        background: "#EAF2FF",
        color: "#2563EB",
      },

      Low: {
        background: "#ECFDF3",
        color: "#16A34A",
      },
    };

    const style = styles[priority] || {
      background: "#F1F5F9",
      color: "#475569",
    };

    return (
      <span
        className="badge rounded-pill px-3 py-2"
        style={{
          backgroundColor: style.background,
          color: style.color,
          fontWeight: 600,
        }}
      >
        {priority}
      </span>
    );
  };

  // =========================================
  // STAT CARD
  // =========================================

  const StatCard = ({ title, value, color }) => (
    <div className="col-12 col-sm-6 col-xl">
      <div
        className="stat-card h-100"
        style={{
          borderTop: `3px solid ${color}`,
          minHeight: "132px",
          backgroundColor: "var(--card)",
        }}
      >
        <div className="p-4 h-100 d-flex flex-column justify-content-between">

          <div className="d-flex justify-content-between align-items-start">

            <span
              style={{
                color: "var(--text-muted)",
                fontSize: "13px",
                fontWeight: 600,
              }}
            >
              {title}
            </span>

            <span
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                backgroundColor: color,
                marginTop: "5px",
              }}
            />

          </div>

          <div className="mt-3">
            <div
              style={{
                color: "var(--navy)",
                fontSize: "32px",
                lineHeight: 1,
                fontWeight: 700,
                letterSpacing: "-0.5px",
              }}
            >
              {value}
            </div>
          </div>

        </div>
      </div>
    </div>
  );

  // =========================================
  // PAGE
  // =========================================

  return (
    <div className="page-container py-4 py-md-5">

      <div className="container-fluid px-3 px-md-4 px-xl-5">

        {/* =========================================
            PAGE HEADER
        ========================================= */}

        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">

          <div>

            <p
              className="mb-1"
              style={{
                color: "var(--primary)",
                fontSize: "13px",
                fontWeight: 700,
                letterSpacing: "0.05em",
                textTransform: "uppercase",
              }}
            >
              Employee Portal
            </p>

            <h1 className="mb-1">
              Welcome back, {user?.name}
            </h1>

            <p
              className="mb-0"
              style={{
                color: "var(--text-muted)",
              }}
            >
              Manage and track your service requests from one place.
            </p>

          </div>

          <button
            className="btn btn-primary px-4 py-2"
            onClick={() =>
              navigate("/employee/create-request")
            }
            style={{
              borderRadius: "9px",
              fontWeight: 600,
            }}
          >
            Create Request
          </button>

        </div>


        {/* =========================================
            STATISTICS
        ========================================= */}

        <div className="row g-3 mb-4">

          <StatCard
            title="Total Requests"
            value={totalRequests}
            color="var(--primary)"
          />

          <StatCard
            title="New"
            value={newRequests}
            color="var(--info)"
          />

          <StatCard
            title="In Progress"
            value={inProgressRequests}
            color="var(--warning)"
          />

          <StatCard
            title="Resolved"
            value={resolvedRequests}
            color="var(--success)"
          />

          <StatCard
            title="Closed"
            value={closedRequests}
            color="#64748B"
          />

        </div>


        {/* =========================================
            EMPLOYEE INFORMATION
        ========================================= */}

        <div className="dashboard-section mb-4">

          <div className="p-4">

            {/* Section Header */}

            <div className="d-flex align-items-center mb-4">

              <div
                className="d-flex align-items-center justify-content-center me-3"
                style={{
                  width: "42px",
                  height: "42px",
                  borderRadius: "12px",
                  backgroundColor: "var(--primary-light)",
                  color: "var(--primary)",
                  fontSize: "18px",
                  fontWeight: 700,
                }}
              >
                👤
              </div>

              <div>

                <h5
                  className="mb-1"
                  style={{
                    color: "var(--navy)",
                    fontWeight: 700,
                  }}
                >
                  Employee Information
                </h5>

                <p
                  className="mb-0"
                  style={{
                    color: "var(--text-muted)",
                    fontSize: "13px",
                  }}
                >
                  Your account details
                </p>

              </div>

            </div>


            {/* Information Cards */}

            <div className="row g-3">

              {/* Name */}

              <div className="col-md-4">

                <div
                  className="h-100 p-3"
                  style={{
                    backgroundColor: "#F8FAFC",
                    border: "1px solid var(--border)",
                    borderRadius: "var(--radius)",
                  }}
                >

                  <div
                    className="mb-2"
                    style={{
                      color: "var(--text-muted)",
                      fontSize: "12px",
                      fontWeight: 600,
                      textTransform: "uppercase",
                      letterSpacing: "0.04em",
                    }}
                  >
                    Name
                  </div>

                  <div
                    style={{
                      color: "var(--navy)",
                      fontSize: "15px",
                      fontWeight: 650,
                    }}
                  >
                    {user?.name}
                  </div>

                </div>

              </div>


              {/* Email */}

              <div className="col-md-4">

                <div
                  className="h-100 p-3"
                  style={{
                    backgroundColor: "#F8FAFC",
                    border: "1px solid var(--border)",
                    borderRadius: "var(--radius)",
                  }}
                >

                  <div
                    className="mb-2"
                    style={{
                      color: "var(--text-muted)",
                      fontSize: "12px",
                      fontWeight: 600,
                      textTransform: "uppercase",
                      letterSpacing: "0.04em",
                    }}
                  >
                    Email
                  </div>

                  <div
                    className="text-break"
                    style={{
                      color: "var(--navy)",
                      fontSize: "15px",
                      fontWeight: 650,
                    }}
                  >
                    {user?.email}
                  </div>

                </div>

              </div>


              {/* Role */}

              <div className="col-md-4">

                <div
                  className="h-100 p-3"
                  style={{
                    backgroundColor: "#F8FAFC",
                    border: "1px solid var(--border)",
                    borderRadius: "var(--radius)",
                  }}
                >

                  <div
                    className="mb-2"
                    style={{
                      color: "var(--text-muted)",
                      fontSize: "12px",
                      fontWeight: 600,
                      textTransform: "uppercase",
                      letterSpacing: "0.04em",
                    }}
                  >
                    Role
                  </div>

                  <div
                    style={{
                      color: "var(--navy)",
                      fontSize: "15px",
                      fontWeight: 650,
                      textTransform: "capitalize",
                    }}
                  >
                    {user?.role}
                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>


        {/* =========================================
            SERVICE REQUESTS
        ========================================= */}

        <div className="dashboard-section">

          {/* Section Header */}

          <div
            className="p-4"
            style={{
              borderBottom: "1px solid var(--border)",
            }}
          >

            <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">

              <div>

                <h5
                  className="mb-1"
                  style={{
                    color: "var(--navy)",
                    fontWeight: 700,
                  }}
                >
                  My Service Requests
                </h5>

                <p
                  className="mb-0"
                  style={{
                    color: "var(--text-muted)",
                    fontSize: "13px",
                  }}
                >
                  View and track all your submitted requests
                </p>

              </div>

              <span
                className="badge rounded-pill px-3 py-2"
                style={{
                  backgroundColor: "var(--primary-light)",
                  color: "var(--primary)",
                  fontWeight: 600,
                  fontSize: "12px",
                }}
              >
                {totalRequests} Requests
              </span>

            </div>

          </div>


          {/* Table Area */}

          <div className="p-3 p-md-4">

            {/* Loading */}

            {loading && (
              <div className="text-center py-5">

                <div
                  className="spinner-border"
                  style={{
                    color: "var(--primary)",
                  }}
                  role="status"
                >
                  <span className="visually-hidden">
                    Loading...
                  </span>
                </div>

                <p
                  className="mt-3 mb-0"
                  style={{
                    color: "var(--text-muted)",
                    fontSize: "14px",
                  }}
                >
                  Loading your requests...
                </p>

              </div>
            )}


            {/* Error */}

            {error && (
              <div className="alert alert-danger">
                {error}
              </div>
            )}


            {/* Empty State */}

            {!loading &&
              !error &&
              requests.length === 0 && (
                <div className="text-center py-5">

                  <div
                    className="mx-auto mb-3 d-flex align-items-center justify-content-center"
                    style={{
                      width: "58px",
                      height: "58px",
                      borderRadius: "14px",
                      backgroundColor: "var(--primary-light)",
                      color: "var(--primary)",
                      fontSize: "24px",
                      fontWeight: 700,
                    }}
                  >
                    +
                  </div>

                  <h5
                    className="mb-2"
                    style={{
                      color: "var(--navy)",
                      fontWeight: 700,
                    }}
                  >
                    No service requests yet
                  </h5>

                  <p
                    className="mb-4"
                    style={{
                      color: "var(--text-muted)",
                      fontSize: "14px",
                    }}
                  >
                    You haven't created any service requests yet.
                  </p>

                  <button
                    className="btn btn-primary px-4"
                    onClick={() =>
                      navigate("/employee/create-request")
                    }
                    style={{
                      borderRadius: "9px",
                      fontWeight: 600,
                    }}
                  >
                    Create Your First Request
                  </button>

                </div>
              )}


            {/* Request Table */}

            {!loading &&
              !error &&
              requests.length > 0 && (
                <div
                  className="table-responsive"
                  style={{
                    border: "1px solid var(--border)",
                    borderRadius: "12px",
                    overflow: "hidden",
                  }}
                >

                  <table className="table align-middle mb-0">

                    <thead>

                      <tr>

                        <th className="border-0 px-3 py-3">
                          Request ID
                        </th>

                        <th className="border-0 px-3 py-3">
                          Title
                        </th>

                        <th className="border-0 px-3 py-3">
                          Category
                        </th>

                        <th className="border-0 px-3 py-3">
                          Priority
                        </th>

                        <th className="border-0 px-3 py-3">
                          Status
                        </th>

                        <th className="border-0 px-3 py-3 text-end">
                          Action
                        </th>

                      </tr>

                    </thead>


                    <tbody>

                      {requests.map((request) => (
                        <tr key={request._id}>

                          {/* Request ID */}

                          <td className="px-3 py-3">

                            <button
                              className="btn btn-link p-0 text-decoration-none"
                              onClick={() =>
                                navigate(
                                  `/requests/${request._id}`
                                )
                              }
                              style={{
                                color: "var(--primary)",
                                fontSize: "13px",
                                fontWeight: 700,
                              }}
                            >
                              {request.requestId}
                            </button>

                          </td>


                          {/* Title */}

                          <td className="px-3 py-3">

                            <div
                              style={{
                                maxWidth: "240px",
                                color: "var(--navy)",
                                fontSize: "14px",
                                fontWeight: 600,
                              }}
                            >
                              {request.title}
                            </div>

                          </td>


                          {/* Category */}

                          <td className="px-3 py-3">

                            <span
                              style={{
                                color: "var(--text-muted)",
                                fontSize: "14px",
                              }}
                            >
                              {request.category}
                            </span>

                          </td>


                          {/* Priority */}

                          <td className="px-3 py-3">
                            {getPriorityBadge(request.priority)}
                          </td>


                          {/* Status */}

                          <td className="px-3 py-3">
                            {getStatusBadge(request.status)}
                          </td>


                          {/* Action */}

                          <td className="px-3 py-3 text-end">

                            <button
                              className="btn btn-sm btn-outline-primary"
                              onClick={() =>
                                navigate(
                                  `/requests/${request._id}`
                                )
                              }
                              style={{
                                borderRadius: "8px",
                                padding: "6px 14px",
                                fontWeight: 600,
                                fontSize: "13px",
                              }}
                            >
                              View
                            </button>

                          </td>

                        </tr>
                      ))}

                    </tbody>

                  </table>

                </div>
              )}

          </div>

        </div>

      </div>

    </div>
  );
}

export default EmployeeDashboard;