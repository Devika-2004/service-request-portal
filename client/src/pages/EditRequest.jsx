import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../services/api";

function EditRequest() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [dueDate, setDueDate] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRequest = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await API.get(`/requests/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const request = response.data.request;

        setTitle(request.title);
        setDescription(request.description);
        setCategory(request.category);
        setPriority(request.priority);

        if (request.dueDate) {
          setDueDate(request.dueDate.split("T")[0]);
        }
      } catch (error) {
        console.error("Failed to load request:", error);

        setError(
          error.response?.data?.message ||
            "Failed to load request"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchRequest();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setSaving(true);
    setError("");

    try {
      const token = localStorage.getItem("token");

      await API.put(
        `/requests/${id}`,
        {
          title,
          description,
          category,
          priority,
          dueDate: dueDate || null,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Request updated successfully");

      navigate(`/requests/${id}`);
    } catch (error) {
      console.error("Update request failed:", error);

      setError(
        error.response?.data?.message ||
          "Failed to update request"
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="container mt-5">
        <p>Loading request...</p>
      </div>
    );
  }

  if (error && !title) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger">
          {error}
        </div>

        <button
          className="btn btn-secondary"
          onClick={() => navigate("/employee/dashboard")}
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card shadow">
            <div className="card-body">
              <h2 className="mb-4">Edit Service Request</h2>

              {error && (
                <div className="alert alert-danger">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">
                    Request Title
                  </label>

                  <input
                    type="text"
                    className="form-control"
                    value={title}
                    onChange={(e) =>
                      setTitle(e.target.value)
                    }
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">
                    Description
                  </label>

                  <textarea
                    className="form-control"
                    rows="4"
                    value={description}
                    onChange={(e) =>
                      setDescription(e.target.value)
                    }
                    required
                  ></textarea>
                </div>

                <div className="mb-3">
                  <label className="form-label">
                    Category
                  </label>

                  <select
                    className="form-select"
                    value={category}
                    onChange={(e) =>
                      setCategory(e.target.value)
                    }
                    required
                  >
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

                <div className="mb-3">
                  <label className="form-label">
                    Priority
                  </label>

                  <select
                    className="form-select"
                    value={priority}
                    onChange={(e) =>
                      setPriority(e.target.value)
                    }
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Critical">
                      Critical
                    </option>
                  </select>
                </div>

                <div className="mb-4">
                  <label className="form-label">
                    Due Date
                  </label>

                  <input
                    type="date"
                    className="form-control"
                    value={dueDate}
                    onChange={(e) =>
                      setDueDate(e.target.value)
                    }
                  />
                </div>

                <div className="d-flex gap-2">
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={saving}
                  >
                    {saving
                      ? "Saving..."
                      : "Update Request"}
                  </button>

                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() =>
                      navigate(`/requests/${id}`)
                    }
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditRequest;