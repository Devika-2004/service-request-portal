import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../services/api";

function RequestDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [request, setRequest] = useState(null);
  const [comments, setComments] = useState([]);
  const [supportUsers, setSupportUsers] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [newComment, setNewComment] = useState("");
  const [commentLoading, setCommentLoading] = useState(false);

  const [selectedSupportUser, setSelectedSupportUser] =
    useState("");
  const [assignLoading, setAssignLoading] = useState(false);

  const [selectedStatus, setSelectedStatus] = useState("");
  const [statusLoading, setStatusLoading] = useState(false);

  const [resolutionNotes, setResolutionNotes] =
    useState("");
  const [resolutionLoading, setResolutionLoading] =
    useState(false);

  const user = JSON.parse(localStorage.getItem("user"));

  const isSupportUser =
    user?.role === "support" || user?.role === "admin";

  const fetchRequestDetails = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      const requestResponse = await API.get(
        `/requests/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const commentsResponse = await API.get(
        `/requests/${id}/comments`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const fetchedRequest =
        requestResponse.data.request;

      setRequest(fetchedRequest);
      setComments(commentsResponse.data.comments);

      setSelectedStatus(fetchedRequest.status);

      setResolutionNotes(
        fetchedRequest.resolutionNotes || ""
      );

      if (fetchedRequest.assignedTo?._id) {
        setSelectedSupportUser(
          fetchedRequest.assignedTo._id
        );
      }
    } catch (error) {
      console.error(
        "Failed to load request details:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to load request details"
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchSupportUsers = async () => {
    if (!isSupportUser) {
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const response = await API.get(
        "/users/support",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSupportUsers(response.data.users);
    } catch (error) {
      console.error(
        "Failed to load support users:",
        error
      );
    }
  };

  useEffect(() => {
    fetchRequestDetails();
    fetchSupportUsers();
  }, [id]);

  const handleCancelRequest = async () => {
    const confirmCancel = window.confirm(
      "Are you sure you want to cancel this request?"
    );

    if (!confirmCancel) {
      return;
    }

    try {
      const token = localStorage.getItem("token");

      await API.delete(`/requests/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert("Request cancelled successfully");

      navigate("/employee/dashboard");
    } catch (error) {
      console.error(
        "Cancel request failed:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Failed to cancel request"
      );
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();

    if (!newComment.trim()) {
      return;
    }

    setCommentLoading(true);

    try {
      const token = localStorage.getItem("token");

      const response = await API.post(
        `/requests/${id}/comments`,
        {
          comment: newComment.trim(),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setComments((previousComments) => [
        response.data.comment,
        ...previousComments,
      ]);

      setNewComment("");
    } catch (error) {
      console.error(
        "Add comment failed:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Failed to add comment"
      );
    } finally {
      setCommentLoading(false);
    }
  };

  const handleAssignRequest = async () => {
    if (!selectedSupportUser) {
      alert("Please select a support user");
      return;
    }

    setAssignLoading(true);

    try {
      const token = localStorage.getItem("token");

      await API.patch(
        `/requests/${id}/assign`,
        {
          assignedTo: selectedSupportUser,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Request assigned successfully");

      await fetchRequestDetails();
    } catch (error) {
      console.error(
        "Assign request failed:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Failed to assign request"
      );
    } finally {
      setAssignLoading(false);
    }
  };

  const getNextStatuses = () => {
    if (!request) {
      return [];
    }

    const statusFlow = {
      New: ["Assigned"],
      Assigned: ["In Progress"],
      "In Progress": ["Resolved"],
      Resolved: ["Closed"],
      Closed: [],
    };

    return statusFlow[request.status] || [];
  };

  const handleStatusUpdate = async () => {
    if (!selectedStatus) {
      return;
    }

    if (selectedStatus === request.status) {
      alert("Please select a different status");
      return;
    }

    setStatusLoading(true);

    try {
      const token = localStorage.getItem("token");

      await API.patch(
        `/requests/${id}/status`,
        {
          status: selectedStatus,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Request status updated successfully");

      await fetchRequestDetails();
    } catch (error) {
      console.error(
        "Status update failed:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Failed to update request status"
      );

      setSelectedStatus(request.status);
    } finally {
      setStatusLoading(false);
    }
  };

  const handleResolutionNotes = async (e) => {
    e.preventDefault();

    if (!resolutionNotes.trim()) {
      alert("Please enter resolution notes");
      return;
    }

    setResolutionLoading(true);

    try {
      const token = localStorage.getItem("token");

      await API.patch(
        `/requests/${id}/resolution`,
        {
          resolutionNotes:
            resolutionNotes.trim(),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Resolution notes added successfully");

      await fetchRequestDetails();
    } catch (error) {
      console.error(
        "Resolution notes failed:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Failed to add resolution notes"
      );
    } finally {
      setResolutionLoading(false);
    }
  };

  const getBackPath = () => {
    if (isSupportUser) {
      return "/support/dashboard";
    }

    return "/employee/dashboard";
  };

  const getStatusBadge = (status) => {
    const badgeClasses = {
      New: "bg-primary",
      Assigned: "bg-info text-dark",
      "In Progress": "bg-warning text-dark",
      Resolved: "bg-success",
      Closed: "bg-secondary",
    };

    return (
      <span
        className={`badge ${
          badgeClasses[status] || "bg-dark"
        }`}
      >
        {status}
      </span>
    );
  };

  const getPriorityBadge = (priority) => {
    const badgeClasses = {
      Low: "bg-success",
      Medium: "bg-info text-dark",
      High: "bg-warning text-dark",
      Critical: "bg-danger",
    };

    return (
      <span
        className={`badge ${
          badgeClasses[priority] || "bg-secondary"
        }`}
      >
        {priority}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="container mt-5">
        <div className="text-center">
          <div
            className="spinner-border text-primary"
            role="status"
          >
            <span className="visually-hidden">
              Loading...
            </span>
          </div>

          <p className="mt-2">
            Loading request details...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger">
          {error}
        </div>

        <button
          className="btn btn-secondary"
          onClick={() =>
            navigate(getBackPath())
          }
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="container mt-5 mb-5">

      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2>Request Details</h2>

          <p className="text-muted mb-0">
            {isSupportUser
              ? "Manage service request"
              : "View your service request"}
          </p>
        </div>

        <button
          className="btn btn-secondary"
          onClick={() =>
            navigate(getBackPath())
          }
        >
          Back to Dashboard
        </button>
      </div>

      {request && (
        <>
          {/* Request Information */}
          <div className="card shadow mb-4">
            <div className="card-body">

              <div className="d-flex justify-content-between align-items-start flex-wrap gap-2">
                <div>
                  <h4 className="mb-1">
                    {request.title}
                  </h4>

                  <p className="text-muted mb-0">
                    {request.requestId}
                  </p>
                </div>

               <div className="d-flex align-items-center">
  <span className="me-2">
    {getPriorityBadge(request.priority)}
  </span>

  {getStatusBadge(request.status)}
</div>
              </div>

              <hr />

              <p>
                <strong>Description:</strong>{" "}
                {request.description}
              </p>

              <p>
                <strong>Category:</strong>{" "}
                {request.category}
              </p>

              <p>
                <strong>Priority:</strong>{" "}
                {getPriorityBadge(
                  request.priority
                )}
              </p>

              <p>
                <strong>Status:</strong>{" "}
                {getStatusBadge(
                  request.status
                )}
              </p>

              <p>
                <strong>Created By:</strong>{" "}
                {request.createdBy?.name ||
                  "Unknown"}
              </p>

              <p>
                <strong>Assigned To:</strong>{" "}
                {request.assignedTo?.name ||
                  "Not assigned"}
              </p>

              <p>
                <strong>Due Date:</strong>{" "}
                {request.dueDate
                  ? new Date(
                      request.dueDate
                    ).toLocaleDateString()
                  : "Not set"}
              </p>

              <p className="mb-0">
                <strong>
                  Resolution Notes:
                </strong>{" "}
                {request.resolutionNotes ||
                  "No resolution notes yet"}
              </p>

            </div>
          </div>

          {/* SUPPORT CONTROLS */}
          {isSupportUser && (
            <>
              {/* Assign Request */}
              <div className="card shadow mb-4">
                <div className="card-body">

                  <h4 className="mb-3">
                    Assign Request
                  </h4>

                  <div className="row align-items-end">

                    <div className="col-md-8 mb-3">
                      <label className="form-label">
                        Select Support User
                      </label>

                      <select
                        className="form-select"
                        value={
                          selectedSupportUser
                        }
                        onChange={(e) =>
                          setSelectedSupportUser(
                            e.target.value
                          )
                        }
                        disabled={[
                          "Resolved",
                          "Closed",
                        ].includes(
                          request.status
                        )}
                      >
                        <option value="">
                          Select Support User
                        </option>

                        {supportUsers.map(
                          (supportUser) => (
                            <option
                              key={
                                supportUser._id
                              }
                              value={
                                supportUser._id
                              }
                            >
                              {supportUser.name} (
                              {
                                supportUser.email
                              }
                              )
                            </option>
                          )
                        )}
                      </select>
                    </div>

                    <div className="col-md-4 mb-3">
                      <button
                        className="btn btn-primary w-100"
                        onClick={
                          handleAssignRequest
                        }
                        disabled={
                          assignLoading ||
                          [
                            "Resolved",
                            "Closed",
                          ].includes(
                            request.status
                          )
                        }
                      >
                        {assignLoading
                          ? "Assigning..."
                          : "Assign Request"}
                      </button>
                    </div>

                  </div>

                </div>
              </div>

              {/* Status Update */}
              <div className="card shadow mb-4">
                <div className="card-body">

                  <h4 className="mb-3">
                    Update Request Status
                  </h4>

                  <div className="row align-items-end">

                    <div className="col-md-8 mb-3">
                      <label className="form-label">
                        Next Status
                      </label>

                      <select
                        className="form-select"
                        value={
                          selectedStatus
                        }
                        onChange={(e) =>
                          setSelectedStatus(
                            e.target.value
                          )
                        }
                        disabled={
                          request.status ===
                          "Closed"
                        }
                      >
                        <option
                          value={
                            request.status
                          }
                        >
                          Current:{" "}
                          {request.status}
                        </option>

                        {getNextStatuses().map(
                          (status) => (
                            <option
                              key={status}
                              value={status}
                            >
                              {status}
                            </option>
                          )
                        )}
                      </select>
                    </div>

                    <div className="col-md-4 mb-3">
                      <button
                        className="btn btn-warning w-100"
                        onClick={
                          handleStatusUpdate
                        }
                        disabled={
                          statusLoading ||
                          selectedStatus ===
                            request.status ||
                          request.status ===
                            "Closed"
                        }
                      >
                        {statusLoading
                          ? "Updating..."
                          : "Update Status"}
                      </button>
                    </div>

                  </div>

                  {request.status ===
                    "Closed" ? (
                    <small className="text-muted">
                      This request is closed and
                      cannot be moved to another
                      status.
                    </small>
                  ) : (
                    <small className="text-muted">
                      Next allowed status:{" "}
                      {getNextStatuses()[0] ||
                        "None"}
                    </small>
                  )}

                </div>
              </div>

              {/* Resolution Notes */}
              {request.status ===
                "In Progress" && (
                <div className="card shadow mb-4">
                  <div className="card-body">

                    <h4 className="mb-3">
                      Resolution Notes
                    </h4>

                    <form
                      onSubmit={
                        handleResolutionNotes
                      }
                    >
                      <div className="mb-3">
                        <label className="form-label">
                          Resolution Notes
                        </label>

                        <textarea
                          className="form-control"
                          rows="4"
                          value={
                            resolutionNotes
                          }
                          onChange={(e) =>
                            setResolutionNotes(
                              e.target.value
                            )
                          }
                          placeholder="Describe how the issue was resolved..."
                          required
                        ></textarea>
                      </div>

                      <button
                        type="submit"
                        className="btn btn-success"
                        disabled={
                          resolutionLoading
                        }
                      >
                        {resolutionLoading
                          ? "Saving..."
                          : "Save Resolution Notes"}
                      </button>
                    </form>

                  </div>
                </div>
              )}
            </>
          )}

          {/* Employee Edit / Cancel */}
          {!isSupportUser &&
            request.status === "New" && (
              <div className="card shadow mb-4">
                <div className="card-body">

                  <h5 className="mb-3">
                    Request Actions
                  </h5>

                  <div className="d-flex gap-2">
                    <button
                      className="btn btn-warning"
                      onClick={() =>
                        navigate(
                          `/requests/${request._id}/edit`
                        )
                      }
                    >
                      Edit Request
                    </button>

                    <button
                      className="btn btn-danger"
                      onClick={
                        handleCancelRequest
                      }
                    >
                      Cancel Request
                    </button>
                  </div>

                  <small className="text-muted d-block mt-2">
                    Requests can only be edited or
                    cancelled while they are New.
                  </small>

                </div>
              </div>
            )}

          {/* Comments */}
          <div className="card shadow">
            <div className="card-body">

              <h4 className="mb-3">
                Comments / Updates
              </h4>

              <form
                onSubmit={handleAddComment}
                className="mb-4"
              >
                <div className="mb-3">
                  <label className="form-label">
                    Add Comment / Update
                  </label>

                  <textarea
                    className="form-control"
                    rows="3"
                    value={newComment}
                    onChange={(e) =>
                      setNewComment(
                        e.target.value
                      )
                    }
                    placeholder="Write your comment or update..."
                    required
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={commentLoading}
                >
                  {commentLoading
                    ? "Adding..."
                    : "Add Comment"}
                </button>
              </form>

              {comments.length === 0 ? (
                <p className="text-muted">
                  No comments or updates yet.
                </p>
              ) : (
                comments.map((comment) => (
                  <div
                    key={comment._id}
                    className="border rounded p-3 mb-3"
                  >
                    <p className="mb-1">
                      <strong>
                        {comment.userId?.name ||
                          "Unknown User"}
                      </strong>

                      <span className="text-muted ms-2">
                        (
                        {
                          comment.userId?.role
                        }
                        )
                      </span>
                    </p>

                    <p className="mb-1">
                      {comment.comment}
                    </p>

                    <small className="text-muted">
                      {new Date(
                        comment.createdAt
                      ).toLocaleString()}
                    </small>
                  </div>
                ))
              )}

            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default RequestDetails;