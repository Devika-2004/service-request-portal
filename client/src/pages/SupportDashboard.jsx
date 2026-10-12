import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

function SupportDashboard() {
  const navigate = useNavigate();

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortBy, setSortBy] = useState("newest");
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [escalationFilter, setEscalationFilter] = useState("");

  const fetchRequests = async () => {
    try {
      setError("");

      const token = localStorage.getItem("token");

      const response = await API.get(
        `/requests?page=${currentPage}&limit=5&sortBy=${sortBy}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setRequests(response.data.requests);
      setTotalPages(response.data.totalPages);
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

  useEffect(() => {
    fetchRequests();
  }, [currentPage, sortBy]);

  const filteredRequests = requests.filter((request) => {
    const searchText = search.toLowerCase();

    const matchesSearch =
      request.requestId
        .toLowerCase()
        .includes(searchText) ||
      request.title
        .toLowerCase()
        .includes(searchText);

    const matchesCategory =
      categoryFilter === "" ||
      request.category === categoryFilter;

    const matchesPriority =
      priorityFilter === "" ||
      request.priority === priorityFilter;

    const matchesStatus =
      statusFilter === "" ||
      request.status === statusFilter;

    const matchesEscalation =
      escalationFilter === "" ||
      (escalationFilter === "Escalated" &&
        request.escalated === true) ||
      (escalationFilter === "Normal" &&
        request.escalated === false);

    return (
      matchesSearch &&
      matchesCategory &&
      matchesPriority &&
      matchesStatus &&
      matchesEscalation
    );
  });

  const clearFilters = () => {
    setSearch("");
    setCategoryFilter("");
    setPriorityFilter("");
    setStatusFilter("");
    setEscalationFilter("");
  };

  /* ---------------------------------------
     STATUS BADGE
  --------------------------------------- */

  const getStatusBadge = (status) => {
    const styles = {
      New: {
        background: "#EAF2FF",
        color: "#2563EB",
      },
      Assigned: {
        background: "#F3E8FF",
        color: "#7C3AED",
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
        className="badge rounded-pill"
        style={{
          backgroundColor: style.background,
          color: style.color,
          padding: "7px 11px",
          fontWeight: 600,
          fontSize: "11px",
        }}
      >
        {status}
      </span>
    );
  };

  /* ---------------------------------------
     PRIORITY BADGE
  --------------------------------------- */

  const getPriorityBadge = (priority) => {
    const styles = {
      Low: {
        background: "#ECFDF3",
        color: "#16A34A",
      },
      Medium: {
        background: "#EAF2FF",
        color: "#2563EB",
      },
      High: {
        background: "#FFF7E6",
        color: "#D97706",
      },
      Critical: {
        background: "#FEF2F2",
        color: "#DC2626",
      },
    };

    const style = styles[priority] || {
      background: "#F1F5F9",
      color: "#475569",
    };

    return (
      <span
        className="badge rounded-pill"
        style={{
          backgroundColor: style.background,
          color: style.color,
          padding: "7px 11px",
          fontWeight: 600,
          fontSize: "11px",
        }}
      >
        {priority}
      </span>
    );
  };

  /* ---------------------------------------
     STATISTICS
  --------------------------------------- */

  const totalCurrent = requests.length;

  const newCount = requests.filter(
    (request) => request.status === "New"
  ).length;

  const progressCount = requests.filter(
    (request) => request.status === "In Progress"
  ).length;

  const escalatedCount = requests.filter(
    (request) => request.escalated === true
  ).length;

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "var(--bg)",
      }}
    >
      <div className="container-fluid px-3 px-md-4 px-xl-5 py-4 py-md-5">

        {/* =====================================
            HEADER
        ====================================== */}

        <div
          className="mb-4"
          style={{
            background:
              "linear-gradient(135deg, #172033 0%, #1d4ed8 100%)",
            borderRadius: "18px",
            padding: "28px 30px",
            color: "#FFFFFF",
            boxShadow: "var(--shadow)",
          }}
        >
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
            <div>
              <div
                style={{
                  fontSize: "12px",
                  fontWeight: 700,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  opacity: 0.75,
                  marginBottom: "6px",
                }}
              >
                Support Portal
              </div>

              <h1
                className="mb-2"
                style={{
                  color: "#FFFFFF",
                  fontSize: "30px",
                  fontWeight: 700,
                  letterSpacing: "-0.5px",
                }}
              >
                Support Dashboard
              </h1>

              <p
                className="mb-0"
                style={{
                  color: "rgba(255,255,255,0.78)",
                  fontSize: "14px",
                }}
              >
                Manage, track and resolve employee service
                requests.
              </p>
            </div>

            <button
              onClick={() => {
                setLoading(true);
                fetchRequests();
              }}
              disabled={loading}
              style={{
                border: "1px solid rgba(255,255,255,0.25)",
                backgroundColor:
                  "rgba(255,255,255,0.10)",
                color: "#FFFFFF",
                borderRadius: "10px",
                padding: "9px 18px",
                fontSize: "13px",
                fontWeight: 600,
              }}
            >
              {loading ? "Refreshing..." : "Refresh"}
            </button>
          </div>
        </div>

        {/* =====================================
            QUICK OVERVIEW
        ====================================== */}

        <section className="mb-5">
          <div className="mb-4">
            <div
              style={{
                color: "var(--primary)",
                fontSize: "12px",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                marginBottom: "5px",
              }}
            >
              Support Overview
            </div>

            <h3
              className="mb-1"
              style={{
                color: "var(--navy)",
                fontWeight: 700,
                fontSize: "22px",
              }}
            >
              Request Activity
            </h3>

            <p
              className="mb-0"
              style={{
                color: "var(--text-muted)",
                fontSize: "14px",
              }}
            >
              Quick view of requests available on this page.
            </p>
          </div>

          <div className="row g-3">

            {/* Total */}

            <div className="col-12 col-sm-6 col-xl-3">
              <div
                className="h-100"
                style={{
                  background: "#FFFFFF",
                  border: "1px solid var(--border)",
                  borderRadius: "16px",
                  boxShadow: "var(--shadow-sm)",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    height: "4px",
                    background: "#2563EB",
                  }}
                />

                <div className="p-4">
                  <div
                    style={{
                      width: "42px",
                      height: "42px",
                      borderRadius: "12px",
                      background: "#EAF2FF",
                      color: "#2563EB",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: 700,
                      marginBottom: "14px",
                    }}
                  >
                    T
                  </div>

                  <div
                    style={{
                      color: "var(--text-muted)",
                      fontSize: "13px",
                      fontWeight: 600,
                    }}
                  >
                    Current Requests
                  </div>

                  <div
                    className="mt-2"
                    style={{
                      color: "var(--navy)",
                      fontSize: "30px",
                      fontWeight: 700,
                    }}
                  >
                    {totalCurrent}
                  </div>
                </div>
              </div>
            </div>

            {/* New */}

            <div className="col-12 col-sm-6 col-xl-3">
              <div
                className="h-100"
                style={{
                  background: "#FFFFFF",
                  border: "1px solid var(--border)",
                  borderRadius: "16px",
                  boxShadow: "var(--shadow-sm)",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    height: "4px",
                    background: "#0891B2",
                  }}
                />

                <div className="p-4">
                  <div
                    style={{
                      width: "42px",
                      height: "42px",
                      borderRadius: "12px",
                      background: "#ECFEFF",
                      color: "#0891B2",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: 700,
                      marginBottom: "14px",
                    }}
                  >
                    N
                  </div>

                  <div
                    style={{
                      color: "var(--text-muted)",
                      fontSize: "13px",
                      fontWeight: 600,
                    }}
                  >
                    New Requests
                  </div>

                  <div
                    className="mt-2"
                    style={{
                      color: "var(--navy)",
                      fontSize: "30px",
                      fontWeight: 700,
                    }}
                  >
                    {newCount}
                  </div>
                </div>
              </div>
            </div>

            {/* In Progress */}

            <div className="col-12 col-sm-6 col-xl-3">
              <div
                className="h-100"
                style={{
                  background: "#FFFFFF",
                  border: "1px solid var(--border)",
                  borderRadius: "16px",
                  boxShadow: "var(--shadow-sm)",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    height: "4px",
                    background: "#D97706",
                  }}
                />

                <div className="p-4">
                  <div
                    style={{
                      width: "42px",
                      height: "42px",
                      borderRadius: "12px",
                      background: "#FFF7E6",
                      color: "#D97706",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: 700,
                      marginBottom: "14px",
                    }}
                  >
                    P
                  </div>

                  <div
                    style={{
                      color: "var(--text-muted)",
                      fontSize: "13px",
                      fontWeight: 600,
                    }}
                  >
                    In Progress
                  </div>

                  <div
                    className="mt-2"
                    style={{
                      color: "var(--navy)",
                      fontSize: "30px",
                      fontWeight: 700,
                    }}
                  >
                    {progressCount}
                  </div>
                </div>
              </div>
            </div>

            {/* Escalated */}

            <div className="col-12 col-sm-6 col-xl-3">
              <div
                className="h-100"
                style={{
                  background: "#FFFFFF",
                  border: "1px solid var(--border)",
                  borderRadius: "16px",
                  boxShadow: "var(--shadow-sm)",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    height: "4px",
                    background: "#DC2626",
                  }}
                />

                <div className="p-4">
                  <div
                    style={{
                      width: "42px",
                      height: "42px",
                      borderRadius: "12px",
                      background: "#FEF2F2",
                      color: "#DC2626",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: 700,
                      marginBottom: "14px",
                    }}
                  >
                    !
                  </div>

                  <div
                    style={{
                      color: "var(--text-muted)",
                      fontSize: "13px",
                      fontWeight: 600,
                    }}
                  >
                    Escalated
                  </div>

                  <div
                    className="mt-2"
                    style={{
                      color: "var(--navy)",
                      fontSize: "30px",
                      fontWeight: 700,
                    }}
                  >
                    {escalatedCount}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =====================================
            SEARCH & FILTERS
        ====================================== */}

        {!loading && !error && (
          <section className="mb-5">

            <div className="mb-4">
              <div
                style={{
                  color: "var(--primary)",
                  fontSize: "12px",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  marginBottom: "5px",
                }}
              >
                Request Management
              </div>

              <h3
                className="mb-1"
                style={{
                  color: "var(--navy)",
                  fontWeight: 700,
                  fontSize: "22px",
                }}
              >
                Search & Filters
              </h3>

              <p
                className="mb-0"
                style={{
                  color: "var(--text-muted)",
                  fontSize: "14px",
                }}
              >
                Find requests quickly using search, category,
                priority, status and escalation filters.
              </p>
            </div>

            <div
              style={{
                background: "#FFFFFF",
                border: "1px solid var(--border)",
                borderRadius: "16px",
                boxShadow: "var(--shadow-sm)",
                padding: "22px",
              }}
            >
              <div className="row g-3">

                {/* Search */}

                <div className="col-12 col-lg-4">
                  <label
                    className="form-label"
                    style={{
                      color: "var(--navy)",
                      fontSize: "12px",
                      fontWeight: 700,
                    }}
                  >
                    Search
                  </label>

                  <input
                    type="text"
                    className="form-control"
                    placeholder="Request ID or title"
                    value={search}
                    onChange={(e) =>
                      setSearch(e.target.value)
                    }
                  />
                </div>

                {/* Category */}

                <div className="col-12 col-sm-6 col-lg-2">
                  <label
                    className="form-label"
                    style={{
                      color: "var(--navy)",
                      fontSize: "12px",
                      fontWeight: 700,
                    }}
                  >
                    Category
                  </label>

                  <select
                    className="form-select"
                    value={categoryFilter}
                    onChange={(e) =>
                      setCategoryFilter(e.target.value)
                    }
                  >
                    <option value="">
                      All Categories
                    </option>
                    <option value="IT Support">
                      IT Support
                    </option>
                    <option value="Hardware">
                      Hardware
                    </option>
                    <option value="Software">
                      Software
                    </option>
                    <option value="Access Request">
                      Access Request
                    </option>
                    <option value="Network">
                      Network
                    </option>
                    <option value="HR/Admin">
                      HR/Admin
                    </option>
                  </select>
                </div>

                {/* Sort */}

                <div className="col-12 col-sm-6 col-lg-2">
                  <label
                    className="form-label"
                    style={{
                      color: "var(--navy)",
                      fontSize: "12px",
                      fontWeight: 700,
                    }}
                  >
                    Sort By
                  </label>

                  <select
                    className="form-select"
                    value={sortBy}
                    onChange={(e) => {
                      setSortBy(e.target.value);
                      setCurrentPage(1);
                    }}
                  >
                    <option value="newest">
                      Newest First
                    </option>
                    <option value="oldest">
                      Oldest First
                    </option>
                    <option value="priority">
                      Priority
                    </option>
                    <option value="dueDate">
                      Due Date
                    </option>
                  </select>
                </div>

                {/* Priority */}

                <div className="col-12 col-sm-6 col-lg-2">
                  <label
                    className="form-label"
                    style={{
                      color: "var(--navy)",
                      fontSize: "12px",
                      fontWeight: 700,
                    }}
                  >
                    Priority
                  </label>

                  <select
                    className="form-select"
                    value={priorityFilter}
                    onChange={(e) =>
                      setPriorityFilter(e.target.value)
                    }
                  >
                    <option value="">
                      All Priorities
                    </option>
                    <option value="Low">Low</option>
                    <option value="Medium">
                      Medium
                    </option>
                    <option value="High">High</option>
                    <option value="Critical">
                      Critical
                    </option>
                  </select>
                </div>

                {/* Status */}

                <div className="col-12 col-sm-6 col-lg-2">
                  <label
                    className="form-label"
                    style={{
                      color: "var(--navy)",
                      fontSize: "12px",
                      fontWeight: 700,
                    }}
                  >
                    Status
                  </label>

                  <select
                    className="form-select"
                    value={statusFilter}
                    onChange={(e) =>
                      setStatusFilter(e.target.value)
                    }
                  >
                    <option value="">
                      All Statuses
                    </option>
                    <option value="New">New</option>
                    <option value="Assigned">
                      Assigned
                    </option>
                    <option value="In Progress">
                      In Progress
                    </option>
                    <option value="Resolved">
                      Resolved
                    </option>
                    <option value="Closed">
                      Closed
                    </option>
                  </select>
                </div>

                {/* Escalation */}

                <div className="col-12 col-sm-6 col-lg-2">
                  <label
                    className="form-label"
                    style={{
                      color: "var(--navy)",
                      fontSize: "12px",
                      fontWeight: 700,
                    }}
                  >
                    Escalation
                  </label>

                  <select
                    className="form-select"
                    value={escalationFilter}
                    onChange={(e) =>
                      setEscalationFilter(e.target.value)
                    }
                  >
                    <option value="">
                      All Requests
                    </option>
                    <option value="Escalated">
                      Escalated
                    </option>
                    <option value="Normal">
                      Normal
                    </option>
                  </select>
                </div>
              </div>

              <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mt-4 pt-3 border-top">
                <div
                  style={{
                    color: "var(--text-muted)",
                    fontSize: "13px",
                  }}
                >
                  Showing{" "}
                  <strong
                    style={{
                      color: "var(--navy)",
                    }}
                  >
                    {filteredRequests.length}
                  </strong>{" "}
                  of{" "}
                  <strong
                    style={{
                      color: "var(--navy)",
                    }}
                  >
                    {requests.length}
                  </strong>{" "}
                  requests
                </div>

                <button
                  className="btn btn-outline-secondary btn-sm"
                  onClick={clearFilters}
                  style={{
                    borderRadius: "8px",
                    fontWeight: 600,
                  }}
                >
                  Clear Filters
                </button>
              </div>
            </div>
          </section>
        )}

        {/* =====================================
            LOADING / ERROR
        ====================================== */}

        {loading && (
          <div
            className="text-center py-5"
            style={{
              background: "#FFFFFF",
              borderRadius: "16px",
              border: "1px solid var(--border)",
            }}
          >
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
              Loading service requests...
            </p>
          </div>
        )}

        {error && (
          <div
            className="alert alert-danger"
            style={{
              borderRadius: "12px",
            }}
          >
            {error}
          </div>
        )}

        {/* =====================================
            REQUEST LIST
        ====================================== */}

        {!loading &&
          !error &&
          requests.length === 0 && (
            <div
              className="text-center py-5"
              style={{
                background: "#FFFFFF",
                border: "1px solid var(--border)",
                borderRadius: "16px",
              }}
            >
              <h5
                style={{
                  color: "var(--navy)",
                  fontWeight: 700,
                }}
              >
                No service requests found
              </h5>

              <p
                style={{
                  color: "var(--text-muted)",
                  fontSize: "14px",
                }}
              >
                There are currently no requests available.
              </p>
            </div>
          )}

        {!loading &&
          !error &&
          requests.length > 0 &&
          filteredRequests.length === 0 && (
            <div
              className="text-center py-5"
              style={{
                background: "#FFFFFF",
                border: "1px solid var(--border)",
                borderRadius: "16px",
              }}
            >
              <h5
                style={{
                  color: "var(--navy)",
                  fontWeight: 700,
                }}
              >
                No matching requests
              </h5>

              <p
                className="mb-3"
                style={{
                  color: "var(--text-muted)",
                  fontSize: "14px",
                }}
              >
                No requests match the selected filters.
              </p>

              <button
                className="btn btn-primary btn-sm"
                onClick={clearFilters}
                style={{
                  borderRadius: "8px",
                  fontWeight: 600,
                }}
              >
                Clear Filters
              </button>
            </div>
          )}

        {!loading &&
          !error &&
          filteredRequests.length > 0 && (
            <section>

              <div className="mb-4">
                <div
                  style={{
                    color: "var(--primary)",
                    fontSize: "12px",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                    marginBottom: "5px",
                  }}
                >
                  Work Queue
                </div>

                <h3
                  className="mb-1"
                  style={{
                    color: "var(--navy)",
                    fontWeight: 700,
                    fontSize: "22px",
                  }}
                >
                  Service Requests
                </h3>

                <p
                  className="mb-0"
                  style={{
                    color: "var(--text-muted)",
                    fontSize: "14px",
                  }}
                >
                  Review requests and open a request to manage
                  assignment, status and resolution.
                </p>
              </div>

              <div
                style={{
                  background: "#FFFFFF",
                  border: "1px solid var(--border)",
                  borderRadius: "16px",
                  boxShadow: "var(--shadow-sm)",
                  overflow: "hidden",
                }}
              >
                {/* Table Header */}

                <div
                  className="d-flex justify-content-between align-items-center flex-wrap gap-2"
                  style={{
                    padding: "18px 20px",
                    borderBottom:
                      "1px solid var(--border)",
                  }}
                >
                  <div>
                    <h5
                      className="mb-1"
                      style={{
                        color: "var(--navy)",
                        fontWeight: 700,
                        fontSize: "16px",
                      }}
                    >
                      Request Queue
                    </h5>

                    <p
                      className="mb-0"
                      style={{
                        color: "var(--text-muted)",
                        fontSize: "12px",
                      }}
                    >
                      Page {currentPage} of {totalPages}
                    </p>
                  </div>

                  <span
                    className="badge rounded-pill"
                    style={{
                      background: "var(--primary-light)",
                      color: "var(--primary)",
                      padding: "7px 12px",
                    }}
                  >
                    {filteredRequests.length} Results
                  </span>
                </div>

                {/* Table */}

                <div className="table-responsive">
                  <table
                    className="table align-middle mb-0"
                    style={{
                      minWidth: "1000px",
                    }}
                  >
                    <thead>
                      <tr
                        style={{
                          backgroundColor: "#F8FAFC",
                        }}
                      >
                        <th
                          style={{
                            padding: "13px 16px",
                            color: "var(--text-muted)",
                            fontSize: "11px",
                            fontWeight: 700,
                            textTransform: "uppercase",
                            letterSpacing: "0.04em",
                            borderBottom:
                              "1px solid var(--border)",
                          }}
                        >
                          Request ID
                        </th>

                        <th
                          style={{
                            padding: "13px 16px",
                            color: "var(--text-muted)",
                            fontSize: "11px",
                            fontWeight: 700,
                            textTransform: "uppercase",
                            letterSpacing: "0.04em",
                          }}
                        >
                          Request
                        </th>

                        <th
                          style={{
                            padding: "13px 16px",
                            color: "var(--text-muted)",
                            fontSize: "11px",
                            fontWeight: 700,
                            textTransform: "uppercase",
                            letterSpacing: "0.04em",
                          }}
                        >
                          Category
                        </th>

                        <th
                          style={{
                            padding: "13px 16px",
                            color: "var(--text-muted)",
                            fontSize: "11px",
                            fontWeight: 700,
                            textTransform: "uppercase",
                            letterSpacing: "0.04em",
                          }}
                        >
                          Priority
                        </th>

                        <th
                          style={{
                            padding: "13px 16px",
                            color: "var(--text-muted)",
                            fontSize: "11px",
                            fontWeight: 700,
                            textTransform: "uppercase",
                            letterSpacing: "0.04em",
                          }}
                        >
                          Status
                        </th>

                        <th
                          style={{
                            padding: "13px 16px",
                            color: "var(--text-muted)",
                            fontSize: "11px",
                            fontWeight: 700,
                            textTransform: "uppercase",
                            letterSpacing: "0.04em",
                          }}
                        >
                          Escalation
                        </th>

                        <th
                          style={{
                            padding: "13px 16px",
                            color: "var(--text-muted)",
                            fontSize: "11px",
                            fontWeight: 700,
                            textTransform: "uppercase",
                            letterSpacing: "0.04em",
                          }}
                        >
                          Created By
                        </th>

                        <th
                          style={{
                            padding: "13px 16px",
                            color: "var(--text-muted)",
                            fontSize: "11px",
                            fontWeight: 700,
                            textTransform: "uppercase",
                            letterSpacing: "0.04em",
                          }}
                        >
                          Assigned To
                        </th>

                        <th
                          className="text-end"
                          style={{
                            padding: "13px 16px",
                            color: "var(--text-muted)",
                            fontSize: "11px",
                            fontWeight: 700,
                            textTransform: "uppercase",
                            letterSpacing: "0.04em",
                          }}
                        >
                          Action
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {filteredRequests.map(
                        (request) => (
                          <tr
                            key={request._id}
                            style={{
                              borderBottom:
                                "1px solid #EEF2F7",
                            }}
                          >
                            <td
                              style={{
                                padding: "15px 16px",
                              }}
                            >
                              <button
                                className="btn btn-link p-0 text-decoration-none"
                                onClick={() =>
                                  navigate(
                                    `/requests/${request._id}`
                                  )
                                }
                                style={{
                                  color:
                                    "var(--primary)",
                                  fontSize: "12px",
                                  fontWeight: 700,
                                }}
                              >
                                {request.requestId}
                              </button>
                            </td>

                            <td
                              style={{
                                padding: "15px 16px",
                              }}
                            >
                              <div
                                style={{
                                  color: "var(--navy)",
                                  fontSize: "13px",
                                  fontWeight: 600,
                                  maxWidth: "220px",
                                }}
                              >
                                {request.title}
                              </div>
                            </td>

                            <td
                              style={{
                                padding: "15px 16px",
                                color:
                                  "var(--text-muted)",
                                fontSize: "13px",
                              }}
                            >
                              {request.category}
                            </td>

                            <td
                              style={{
                                padding: "15px 16px",
                              }}
                            >
                              {getPriorityBadge(
                                request.priority
                              )}
                            </td>

                            <td
                              style={{
                                padding: "15px 16px",
                              }}
                            >
                              {getStatusBadge(
                                request.status
                              )}
                            </td>

                            <td
                              style={{
                                padding: "15px 16px",
                              }}
                            >
                              {request.escalated ? (
                                <span
                                  className="badge rounded-pill"
                                  style={{
                                    background:
                                      "#FEF2F2",
                                    color:
                                      "#DC2626",
                                    padding:
                                      "7px 11px",
                                    fontSize:
                                      "11px",
                                  }}
                                >
                                  Escalated
                                </span>
                              ) : (
                                <span
                                  className="badge rounded-pill"
                                  style={{
                                    background:
                                      "#F1F5F9",
                                    color:
                                      "#64748B",
                                    padding:
                                      "7px 11px",
                                    fontSize:
                                      "11px",
                                  }}
                                >
                                  Normal
                                </span>
                              )}
                            </td>

                            <td
                              style={{
                                padding: "15px 16px",
                                color:
                                  "var(--text-muted)",
                                fontSize: "13px",
                              }}
                            >
                              {request.createdBy?.name ||
                                "Unknown"}
                            </td>

                            <td
                              style={{
                                padding: "15px 16px",
                                color:
                                  "var(--text-muted)",
                                fontSize: "13px",
                              }}
                            >
                              {request.assignedTo?.name ||
                                "Not Assigned"}
                            </td>

                            <td
                              className="text-end"
                              style={{
                                padding: "15px 16px",
                              }}
                            >
                              <button
                                className="btn btn-primary btn-sm"
                                onClick={() =>
                                  navigate(
                                    `/requests/${request._id}`
                                  )
                                }
                                style={{
                                  borderRadius: "8px",
                                  padding:
                                    "7px 13px",
                                  fontSize: "12px",
                                  fontWeight: 600,
                                }}
                              >
                                View / Manage
                              </button>
                            </td>
                          </tr>
                        )
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}

                <div
                  className="d-flex justify-content-between align-items-center flex-wrap gap-3"
                  style={{
                    padding: "16px 20px",
                    borderTop:
                      "1px solid var(--border)",
                  }}
                >
                  <div
                    style={{
                      color: "var(--text-muted)",
                      fontSize: "13px",
                    }}
                  >
                    Page{" "}
                    <strong
                      style={{
                        color: "var(--navy)",
                      }}
                    >
                      {currentPage}
                    </strong>{" "}
                    of{" "}
                    <strong
                      style={{
                        color: "var(--navy)",
                      }}
                    >
                      {totalPages}
                    </strong>
                  </div>

                  <div className="d-flex gap-2">
                    <button
                      className="btn btn-outline-primary btn-sm"
                      disabled={currentPage === 1}
                      onClick={() =>
                        setCurrentPage(
                          currentPage - 1
                        )
                      }
                      style={{
                        borderRadius: "8px",
                        fontWeight: 600,
                      }}
                    >
                      Previous
                    </button>

                    <button
                      className="btn btn-primary btn-sm"
                      disabled={
                        currentPage === totalPages
                      }
                      onClick={() =>
                        setCurrentPage(
                          currentPage + 1
                        )
                      }
                      style={{
                        borderRadius: "8px",
                        fontWeight: 600,
                      }}
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>
            </section>
          )}
      </div>
    </div>
  );
}

export default SupportDashboard;