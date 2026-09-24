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

  // Calculate employee statistics
  const totalRequests = requests.length;

  const newRequests = requests.filter(
    (request) => request.status === "New"
  ).length;

  const inProgressRequests = requests.filter(
    (request) =>
      request.status === "In Progress"
  ).length;

  const resolvedRequests = requests.filter(
    (request) => request.status === "Resolved"
  ).length;

  const closedRequests = requests.filter(
    (request) => request.status === "Closed"
  ).length;

  // Status badge
  const getStatusBadge = (status) => {
    if (status === "New") {
      return (
        <span className="badge bg-primary">
          New
        </span>
      );
    }

    if (status === "Assigned") {
      return (
        <span className="badge bg-info text-dark">
          Assigned
        </span>
      );
    }

    if (status === "In Progress") {
      return (
        <span className="badge bg-warning text-dark">
          In Progress
        </span>
      );
    }

    if (status === "Resolved") {
      return (
        <span className="badge bg-success">
          Resolved
        </span>
      );
    }

    if (status === "Closed") {
      return (
        <span className="badge bg-secondary">
          Closed
        </span>
      );
    }

    return (
      <span className="badge bg-dark">
        {status}
      </span>
    );
  };

  // Priority badge
  const getPriorityBadge = (priority) => {
    if (priority === "Critical") {
      return (
        <span className="badge bg-danger">
          Critical
        </span>
      );
    }

    if (priority === "High") {
      return (
        <span className="badge bg-warning text-dark">
          High
        </span>
      );
    }

    if (priority === "Medium") {
      return (
        <span className="badge bg-info text-dark">
          Medium
        </span>
      );
    }

    if (priority === "Low") {
      return (
        <span className="badge bg-success">
          Low
        </span>
      );
    }

    return (
      <span className="badge bg-secondary">
        {priority}
      </span>
    );
  };

  return (
    <div className="container mt-4 mb-5">

      {/* Welcome Section */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2>Employee Dashboard</h2>

          <p className="text-muted mb-0">
            Welcome back, <strong>{user?.name}</strong>
          </p>
        </div>

        <button
          className="btn btn-primary"
          onClick={() =>
            navigate("/employee/create-request")
          }
        >
          + Create Request
        </button>
      </div>

      {/* Employee Information */}
      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <h5 className="card-title mb-3">
            Employee Information
          </h5>

          <div className="row">
            <div className="col-md-4">
              <strong>Name:</strong>
              <p className="mb-0">
                {user?.name}
              </p>
            </div>

            <div className="col-md-4">
              <strong>Email:</strong>
              <p className="mb-0">
                {user?.email}
              </p>
            </div>

            <div className="col-md-4">
              <strong>Role:</strong>
              <p className="mb-0 text-capitalize">
                {user?.role}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="row g-3 mb-4">

        <div className="col-md-6 col-lg">
          <div className="card shadow-sm border-primary h-100">
            <div className="card-body">
              <h6 className="text-muted">
                Total Requests
              </h6>

              <h2 className="mb-0">
                {totalRequests}
              </h2>
            </div>
          </div>
        </div>

        <div className="col-md-6 col-lg">
          <div className="card shadow-sm border-info h-100">
            <div className="card-body">
              <h6 className="text-muted">
                New
              </h6>

              <h2 className="mb-0">
                {newRequests}
              </h2>
            </div>
          </div>
        </div>

        <div className="col-md-6 col-lg">
          <div className="card shadow-sm border-warning h-100">
            <div className="card-body">
              <h6 className="text-muted">
                In Progress
              </h6>

              <h2 className="mb-0">
                {inProgressRequests}
              </h2>
            </div>
          </div>
        </div>

        <div className="col-md-6 col-lg">
          <div className="card shadow-sm border-success h-100">
            <div className="card-body">
              <h6 className="text-muted">
                Resolved
              </h6>

              <h2 className="mb-0">
                {resolvedRequests}
              </h2>
            </div>
          </div>
        </div>

        <div className="col-md-6 col-lg">
          <div className="card shadow-sm border-secondary h-100">
            <div className="card-body">
              <h6 className="text-muted">
                Closed
              </h6>

              <h2 className="mb-0">
                {closedRequests}
              </h2>
            </div>
          </div>
        </div>

      </div>

      {/* Requests Section */}
      <div className="card shadow-sm">
        <div className="card-body">

          <div className="d-flex justify-content-between align-items-center mb-3">
            <h4 className="mb-0">
              My Service Requests
            </h4>

            <span className="badge bg-dark">
              {totalRequests} Requests
            </span>
          </div>

          {loading && (
            <div className="text-center py-4">
              <div
                className="spinner-border text-primary"
                role="status"
              >
                <span className="visually-hidden">
                  Loading...
                </span>
              </div>

              <p className="mt-2">
                Loading requests...
              </p>
            </div>
          )}

          {error && (
            <div className="alert alert-danger">
              {error}
            </div>
          )}

          {!loading &&
            !error &&
            requests.length === 0 && (
              <div className="alert alert-info mb-0">
                <h5>No service requests found.</h5>

                <p className="mb-2">
                  You have not created any service
                  requests yet.
                </p>

                <button
                  className="btn btn-primary"
                  onClick={() =>
                    navigate(
                      "/employee/create-request"
                    )
                  }
                >
                  Create Your First Request
                </button>
              </div>
            )}

          {!loading &&
            !error &&
            requests.length > 0 && (
              <div className="table-responsive">
                <table className="table table-bordered table-hover align-middle">

                  <thead className="table-dark">
                    <tr>
                      <th>Request ID</th>
                      <th>Title</th>
                      <th>Category</th>
                      <th>Priority</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>

                  <tbody>
                    {requests.map((request) => (
                      <tr key={request._id}>

                        <td>
                          <button
                            className="btn btn-link p-0"
                            onClick={() =>
                              navigate(
                                `/requests/${request._id}`
                              )
                            }
                          >
                            {request.requestId}
                          </button>
                        </td>

                        <td>
                          {request.title}
                        </td>

                        <td>
                          {request.category}
                        </td>

                        <td>
                          {getPriorityBadge(
                            request.priority
                          )}
                        </td>

                        <td>
                          {getStatusBadge(
                            request.status
                          )}
                        </td>

                        <td>
                          <button
                            className="btn btn-sm btn-outline-primary"
                            onClick={() =>
                              navigate(
                                `/requests/${request._id}`
                              )
                            }
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
  );
}

export default EmployeeDashboard;