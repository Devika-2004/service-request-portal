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
    (escalationFilter === "Escalated" && request.escalated === true) ||
    (escalationFilter === "Normal" && request.escalated === false);

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

  return (
    <div className="container mt-5 mb-5">

      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2>Support Dashboard</h2>

          <p className="text-muted mb-0">
            Manage and track employee service requests
          </p>
        </div>

        <button
          className="btn btn-outline-primary"
          onClick={() => {
            setLoading(true);
            fetchRequests();
          }}
          disabled={loading}
        >
          {loading ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      {/* Loading */}
      {loading && (
        <div className="alert alert-info">
          Loading requests...
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="alert alert-danger">
          {error}
        </div>
      )}

      {!loading && !error && (
        <>
          {/* Filters */}
          <div className="card shadow-sm mb-4">
            <div className="card-body">

              <h5 className="mb-3">
                Search & Filters
              </h5>

              <div className="row">

                {/* Search */}
                <div className="col-md-3 mb-3">
                  <label className="form-label">
                    Search
                  </label>

                  <input
                    type="text"
                    className="form-control"
                    placeholder="Request ID or Title"
                    value={search}
                    onChange={(e) =>
                      setSearch(e.target.value)
                    }
                  />
                </div>

                {/* Category */}
                <div className="col-md-3 mb-3">
                  <label className="form-label">
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
                {/* Sort By */}
<div className="col-md-3 mb-3">
  <label className="form-label">
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
                <div className="col-md-3 mb-3">
                  <label className="form-label">
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

                    <option value="Low">
                      Low
                    </option>

                    <option value="Medium">
                      Medium
                    </option>

                    <option value="High">
                      High
                    </option>

                    <option value="Critical">
                      Critical
                    </option>
                  </select>
                </div>

                {/* Status */}
                <div className="col-md-3 mb-3">
                  <label className="form-label">
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

                    <option value="New">
                      New
                    </option>

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
<div className="col-md-3 mb-3">
  <label className="form-label">
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

              <button
                className="btn btn-secondary btn-sm"
                onClick={clearFilters}
              >
                Clear Filters
              </button>

            </div>
          </div>

          {/* Request Count */}
          <div className="mb-3">
            <strong>
              Showing {filteredRequests.length} of{" "}
              {requests.length} requests
            </strong>
          </div>

          {/* No Requests */}
          {requests.length === 0 && (
            <div className="alert alert-info">
              No service requests found.
            </div>
          )}

          {/* No Filter Results */}
          {requests.length > 0 &&
            filteredRequests.length === 0 && (
              <div className="alert alert-warning">
                No requests match the selected filters.
              </div>
            )}

          {/* Requests Table */}
          {filteredRequests.length > 0 && (
            <div className="table-responsive">
              <table className="table table-bordered table-hover align-middle">

                <thead className="table-dark">
                  <tr>
                    <th>Request ID</th>
                    <th>Title</th>
                    <th>Category</th>
                    <th>Priority</th>
                    <th>Status</th>
                    <th>Escalation</th>
                    <th>Created By</th>
                    <th>Assigned To</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredRequests.map((request) => (
                    <tr key={request._id}>

                      <td>
                        <strong>
                          {request.requestId}
                        </strong>
                      </td>

                      <td>
                        {request.title}
                      </td>

                      <td>
                        {request.category}
                      </td>

                      <td>
                        {request.priority}
                      </td>

                      <td>
                        <span className="badge bg-secondary">
                          {request.status}
                        </span>
                      </td>
                      <td>
  {request.escalated ? (
    <span className="badge bg-danger">
      Escalated
    </span>
  ) : (
    <span className="badge bg-secondary">
      Normal
    </span>
  )}
</td>

                      <td>
                        {request.createdBy?.name ||
                          "Unknown"}
                      </td>

                      <td>
                        {request.assignedTo?.name ||
                          "Not Assigned"}
                      </td>

                      <td>
                        <button
                          className="btn btn-primary btn-sm"
                          onClick={() =>
                            navigate(
                              `/requests/${request._id}`
                            )
                          }
                        >
                          View / Manage
                        </button>
                      </td>

                    </tr>
                  ))}
                </tbody>

              </table>
              {/* Pagination */}
<div className="d-flex justify-content-center align-items-center gap-3 mt-4">

  <button
    className="btn btn-outline-primary"
    disabled={currentPage === 1}
    onClick={() => setCurrentPage(currentPage - 1)}
  >
    Previous
  </button>

  <span>
    Page <strong>{currentPage}</strong> of{" "}
    <strong>{totalPages}</strong>
  </span>

  <button
    className="btn btn-outline-primary"
    disabled={currentPage === totalPages}
    onClick={() => setCurrentPage(currentPage + 1)}
  >
    Next
  </button>

</div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default SupportDashboard;