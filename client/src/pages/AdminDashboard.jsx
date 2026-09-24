import { useEffect, useState } from "react";
import API from "../services/api";

import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await API.get("/requests/stats", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setStats(response.data);
      } catch (error) {
        console.error(
          "Failed to fetch dashboard statistics:",
          error
        );

        setError(
          error.response?.data?.message ||
            "Failed to load dashboard statistics"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="container mt-5">
        <p>Loading dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger">
          {error}
        </div>
      </div>
    );
  }

  const categoryData = stats.categoryStats.map((item) => ({
    name: item._id,
    value: item.count,
  }));

  const statusData = stats.statusStats.map((item) => ({
    name: item._id,
    value: item.count,
  }));

  const priorityData = stats.priorityStats.map((item) => ({
    name: item._id,
    value: item.count,
  }));

  return (
    <div className="container mt-5 mb-5">

      {/* Header */}
      <div className="mb-4">
        <h2>Admin Dashboard</h2>

        <p className="text-muted">
          Service Request Management Overview
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="row">

        <div className="col-md-3 mb-3">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <h6 className="text-muted">
                Total Requests
              </h6>
              <h2>{stats.totalRequests}</h2>
            </div>
          </div>
        </div>

        <div className="col-md-3 mb-3">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <h6 className="text-muted">
                New Requests
              </h6>
              <h2>{stats.newRequests}</h2>
            </div>
          </div>
        </div>

        <div className="col-md-3 mb-3">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <h6 className="text-muted">
                Assigned
              </h6>
              <h2>{stats.assignedRequests}</h2>
            </div>
          </div>
        </div>

        <div className="col-md-3 mb-3">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <h6 className="text-muted">
                In Progress
              </h6>
              <h2>{stats.inProgressRequests}</h2>
            </div>
          </div>
        </div>

        <div className="col-md-3 mb-3">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <h6 className="text-muted">
                Resolved
              </h6>
              <h2>{stats.resolvedRequests}</h2>
            </div>
          </div>
        </div>

        <div className="col-md-3 mb-3">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <h6 className="text-muted">
                Closed
              </h6>
              <h2>{stats.closedRequests}</h2>
            </div>
          </div>
        </div>

        <div className="col-md-3 mb-3">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <h6 className="text-muted">
                High Priority
              </h6>
              <h2>{stats.highPriorityRequests}</h2>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
  <div className="card shadow-sm h-100 border-danger">
    <div className="card-body">
      <h6 className="text-muted">
        Overdue Requests
      </h6>
      <h2 className="text-danger">
        {stats.overdueRequests}
      </h2>
    </div>
  </div>
</div>

      </div>

      {/* Charts */}
      <div className="row mt-4">

        {/* Category Chart */}
        <div className="col-md-6 mb-4">
          <div className="card shadow-sm h-100">
            <div className="card-body">

              <h4 className="mb-4">
                Requests by Category
              </h4>

              <ResponsiveContainer
                width="100%"
                height={300}
              >
                <BarChart data={categoryData}>

                  <CartesianGrid strokeDasharray="3 3" />

                  <XAxis dataKey="name" />

                  <YAxis allowDecimals={false} />

                  <Tooltip />

                  <Legend />

                  <Bar
                    dataKey="value"
                    name="Requests"
                  />

                </BarChart>
              </ResponsiveContainer>

            </div>
          </div>
        </div>

        {/* Status Chart */}
        <div className="col-md-6 mb-4">
          <div className="card shadow-sm h-100">
            <div className="card-body">

              <h4 className="mb-4">
                Requests by Status
              </h4>

              <ResponsiveContainer
                width="100%"
                height={300}
              >
                <PieChart>

                  <Pie
                    data={statusData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label
                  >
                    {statusData.map(
                      (entry, index) => (
                        <Cell key={index} />
                      )
                    )}
                  </Pie>

                  <Tooltip />

                  <Legend />

                </PieChart>

              </ResponsiveContainer>

            </div>
          </div>
        </div>

        {/* Priority Chart */}
        <div className="col-md-6 mb-4">
          <div className="card shadow-sm h-100">
            <div className="card-body">

              <h4 className="mb-4">
                Requests by Priority
              </h4>

              <ResponsiveContainer
                width="100%"
                height={300}
              >
                <BarChart data={priorityData}>

                  <CartesianGrid strokeDasharray="3 3" />

                  <XAxis dataKey="name" />

                  <YAxis allowDecimals={false} />

                  <Tooltip />

                  <Legend />

                  <Bar
                    dataKey="value"
                    name="Requests"
                  />

                </BarChart>

              </ResponsiveContainer>

            </div>
          </div>
        </div>

      </div>

      {/* Category Table */}
      <div className="card shadow-sm mb-4">
        <div className="card-body">

          <h4 className="mb-3">
            Category Summary
          </h4>

          <div className="table-responsive">
            <table className="table table-bordered">

              <thead className="table-dark">
                <tr>
                  <th>Category</th>
                  <th>Number of Requests</th>
                </tr>
              </thead>

              <tbody>
                {stats.categoryStats.map((item) => (
                  <tr key={item._id}>
                    <td>{item._id}</td>
                    <td>{item.count}</td>
                  </tr>
                ))}
              </tbody>

            </table>
          </div>

        </div>
      </div>

      {/* Status Table */}
      <div className="card shadow-sm mb-4">
        <div className="card-body">

          <h4 className="mb-3">
            Status Summary
          </h4>

          <div className="table-responsive">
            <table className="table table-bordered">

              <thead className="table-dark">
                <tr>
                  <th>Status</th>
                  <th>Number of Requests</th>
                </tr>
              </thead>

              <tbody>
                {stats.statusStats.map((item) => (
                  <tr key={item._id}>
                    <td>{item._id}</td>
                    <td>{item.count}</td>
                  </tr>
                ))}
              </tbody>

            </table>
          </div>

        </div>
      </div>

      {/* Priority Table */}
      <div className="card shadow-sm">
        <div className="card-body">

          <h4 className="mb-3">
            Priority Summary
          </h4>

          <div className="table-responsive">
            <table className="table table-bordered">

              <thead className="table-dark">
                <tr>
                  <th>Priority</th>
                  <th>Number of Requests</th>
                </tr>
              </thead>

              <tbody>
                {stats.priorityStats.map((item) => (
                  <tr key={item._id}>
                    <td>{item._id}</td>
                    <td>{item.count}</td>
                  </tr>
                ))}
              </tbody>

            </table>
          </div>

        </div>
      </div>

    </div>
  );
}

export default AdminDashboard;