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
      <div
        className="d-flex align-items-center justify-content-center"
        style={{
          minHeight: "70vh",
          backgroundColor: "var(--bg)",
        }}
      >
        <div className="text-center">
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
            Loading admin dashboard...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="container-fluid px-4 py-5"
        style={{
          backgroundColor: "var(--bg)",
          minHeight: "80vh",
        }}
      >
        <div
          className="alert alert-danger"
          style={{
            borderRadius: "12px",
          }}
        >
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

  /* ---------------------------------------
     CHART COLORS
  --------------------------------------- */

  const statusColors = [
    "#2563EB",
    "#0891B2",
    "#16A34A",
    "#D97706",
    "#7C3AED",
  ];

  const priorityColors = {
    Low: "#16A34A",
    Medium: "#2563EB",
    High: "#F59E0B",
    Critical: "#DC2626",
  };

  /* ---------------------------------------
     STAT CARD
  --------------------------------------- */

  const StatCard = ({
    title,
    value,
    color,
    background,
    label,
  }) => (
    <div className="col-12 col-sm-6 col-xl-3">
      <div
        className="h-100"
        style={{
          backgroundColor: "#FFFFFF",
          border: "1px solid var(--border)",
          borderRadius: "16px",
          boxShadow: "var(--shadow-sm)",
          overflow: "hidden",
          transition:
            "transform 0.2s ease, box-shadow 0.2s ease",
        }}
      >
        <div
          style={{
            height: "4px",
            backgroundColor: color,
          }}
        />

        <div className="p-4">
          <div className="d-flex justify-content-between align-items-start">
            <div>
              <div
                style={{
                  width: "42px",
                  height: "42px",
                  borderRadius: "12px",
                  backgroundColor: background,
                  color: color,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "18px",
                  fontWeight: 700,
                  marginBottom: "14px",
                }}
              >
                {label}
              </div>

              <div
                style={{
                  color: "var(--text-muted)",
                  fontSize: "13px",
                  fontWeight: 600,
                }}
              >
                {title}
              </div>
            </div>

            <div
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                backgroundColor: color,
                marginTop: "4px",
              }}
            />
          </div>

          <div
            className="mt-2"
            style={{
              color: "var(--navy)",
              fontSize: "30px",
              fontWeight: 700,
              lineHeight: 1.1,
            }}
          >
            {value}
          </div>
        </div>
      </div>
    </div>
  );

  /* ---------------------------------------
     SECTION HEADER
  --------------------------------------- */

  const SectionHeader = ({
    eyebrow,
    title,
    description,
  }) => (
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
        {eyebrow}
      </div>

      <h3
        className="mb-1"
        style={{
          color: "var(--navy)",
          fontWeight: 700,
          fontSize: "22px",
        }}
      >
        {title}
      </h3>

      <p
        className="mb-0"
        style={{
          color: "var(--text-muted)",
          fontSize: "14px",
        }}
      >
        {description}
      </p>
    </div>
  );

  /* ---------------------------------------
     CHART CARD
  --------------------------------------- */

  const ChartCard = ({
    title,
    description,
    children,
  }) => (
    <div
      className="h-100"
      style={{
        backgroundColor: "#FFFFFF",
        border: "1px solid var(--border)",
        borderRadius: "16px",
        boxShadow: "var(--shadow-sm)",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          padding: "20px 22px 14px",
          borderBottom: "1px solid var(--border)",
        }}
      >
        <h5
          className="mb-1"
          style={{
            color: "var(--navy)",
            fontWeight: 700,
            fontSize: "16px",
          }}
        >
          {title}
        </h5>

        <p
          className="mb-0"
          style={{
            color: "var(--text-muted)",
            fontSize: "12px",
          }}
        >
          {description}
        </p>
      </div>

      <div
        style={{
          padding: "18px",
        }}
      >
        {children}
      </div>
    </div>
  );

  /* ---------------------------------------
     SUMMARY TABLE CARD
  --------------------------------------- */

  const SummaryCard = ({
    title,
    subtitle,
    children,
  }) => (
    <div
      className="h-100"
      style={{
        backgroundColor: "#FFFFFF",
        border: "1px solid var(--border)",
        borderRadius: "16px",
        boxShadow: "var(--shadow-sm)",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          padding: "20px 22px",
          borderBottom: "1px solid var(--border)",
        }}
      >
        <h5
          className="mb-1"
          style={{
            color: "var(--navy)",
            fontWeight: 700,
            fontSize: "16px",
          }}
        >
          {title}
        </h5>

        <p
          className="mb-0"
          style={{
            color: "var(--text-muted)",
            fontSize: "12px",
          }}
        >
          {subtitle}
        </p>
      </div>

      <div className="table-responsive">
        {children}
      </div>
    </div>
  );

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "var(--bg)",
      }}
    >
      <div className="container-fluid px-3 px-md-4 px-xl-5 py-4 py-md-5">

        {/* =====================================
            PAGE HEADER
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
                Admin Portal
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
                Admin Dashboard
              </h1>

              <p
                className="mb-0"
                style={{
                  color: "rgba(255,255,255,0.78)",
                  fontSize: "14px",
                }}
              >
                Monitor service requests, priorities and
                overall support activity.
              </p>
            </div>

            <div
              className="d-flex align-items-center justify-content-center"
              style={{
                width: "54px",
                height: "54px",
                borderRadius: "15px",
                backgroundColor:
                  "rgba(255,255,255,0.12)",
                border:
                  "1px solid rgba(255,255,255,0.18)",
                color: "#FFFFFF",
                fontSize: "20px",
                fontWeight: 700,
              }}
            >
              A
            </div>
          </div>
        </div>

        {/* =====================================
            SYSTEM OVERVIEW
        ====================================== */}

        <section className="mb-5">
          <SectionHeader
            eyebrow="System Overview"
            title="Request Statistics"
            description="A quick overview of the current service request workload."
          />

          <div className="row g-3">
            <StatCard
              title="Total Requests"
              value={stats.totalRequests}
              color="#2563EB"
              background="#EAF2FF"
              label="T"
            />

            <StatCard
              title="New Requests"
              value={stats.newRequests}
              color="#0891B2"
              background="#ECFEFF"
              label="N"
            />

            <StatCard
              title="Assigned"
              value={stats.assignedRequests}
              color="#7C3AED"
              background="#F3E8FF"
              label="A"
            />

            <StatCard
              title="In Progress"
              value={stats.inProgressRequests}
              color="#D97706"
              background="#FFF7E6"
              label="P"
            />

            <StatCard
              title="Resolved"
              value={stats.resolvedRequests}
              color="#16A34A"
              background="#ECFDF3"
              label="R"
            />

            <StatCard
              title="Closed"
              value={stats.closedRequests}
              color="#64748B"
              background="#F1F5F9"
              label="C"
            />

            <StatCard
              title="High Priority"
              value={stats.highPriorityRequests}
              color="#F59E0B"
              background="#FFF7E6"
              label="!"
            />

            <StatCard
              title="Overdue Requests"
              value={stats.overdueRequests}
              color="#DC2626"
              background="#FEF2F2"
              label="!"
            />
          </div>
        </section>

        {/* =====================================
            ANALYTICS
        ====================================== */}

        <section className="mb-5">
          <SectionHeader
            eyebrow="Analytics"
            title="Request Analytics"
            description="Visual overview of service request activity across categories, status and priority."
          />

          <div className="row g-4">

            {/* CATEGORY CHART */}

            <div className="col-12 col-xl-7">
              <ChartCard
                title="Requests by Category"
                description="Distribution across service categories"
              >
                <ResponsiveContainer
                  width="100%"
                  height={320}
                >
                  <BarChart
                    data={categoryData}
                    margin={{
                      top: 10,
                      right: 15,
                      left: -15,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="#E2E8F0"
                      vertical={false}
                    />

                    <XAxis
                      dataKey="name"
                      tick={{
                        fill: "#64748B",
                        fontSize: 11,
                      }}
                      axisLine={false}
                      tickLine={false}
                    />

                    <YAxis
                      allowDecimals={false}
                      tick={{
                        fill: "#64748B",
                        fontSize: 11,
                      }}
                      axisLine={false}
                      tickLine={false}
                    />

                    <Tooltip
                      contentStyle={{
                        borderRadius: "10px",
                        border: "1px solid #E2E8F0",
                        boxShadow:
                          "0 8px 24px rgba(15,23,42,0.10)",
                      }}
                    />

                    <Bar
                      dataKey="value"
                      name="Requests"
                      radius={[7, 7, 0, 0]}
                      fill="#2563EB"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </ChartCard>
            </div>

            {/* STATUS CHART */}

            <div className="col-12 col-xl-5">
              <ChartCard
                title="Requests by Status"
                description="Current status of all service requests"
              >
                <ResponsiveContainer
                  width="100%"
                  height={320}
                >
                  <PieChart>
                    <Pie
                      data={statusData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="46%"
                      outerRadius={105}
                      innerRadius={58}
                      paddingAngle={3}
                      label
                    >
                      {statusData.map(
                        (entry, index) => (
                          <Cell
                            key={`status-${index}`}
                            fill={
                              statusColors[
                                index %
                                  statusColors.length
                              ]
                            }
                          />
                        )
                      )}
                    </Pie>

                    <Tooltip />

                    <Legend
                      verticalAlign="bottom"
                      height={36}
                      iconType="circle"
                    />
                  </PieChart>
                </ResponsiveContainer>
              </ChartCard>
            </div>

            {/* PRIORITY CHART */}

            <div className="col-12">
              <ChartCard
                title="Requests by Priority"
                description="Distribution based on request priority"
              >
                <ResponsiveContainer
                  width="100%"
                  height={300}
                >
                  <BarChart
                    data={priorityData}
                    margin={{
                      top: 10,
                      right: 15,
                      left: -15,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="#E2E8F0"
                      vertical={false}
                    />

                    <XAxis
                      dataKey="name"
                      tick={{
                        fill: "#64748B",
                        fontSize: 12,
                      }}
                      axisLine={false}
                      tickLine={false}
                    />

                    <YAxis
                      allowDecimals={false}
                      tick={{
                        fill: "#64748B",
                        fontSize: 11,
                      }}
                      axisLine={false}
                      tickLine={false}
                    />

                    <Tooltip
                      contentStyle={{
                        borderRadius: "10px",
                        border: "1px solid #E2E8F0",
                        boxShadow:
                          "0 8px 24px rgba(15,23,42,0.10)",
                      }}
                    />

                    <Legend />

                    <Bar
                      dataKey="value"
                      name="Requests"
                      radius={[7, 7, 0, 0]}
                    >
                      {priorityData.map(
                        (entry, index) => (
                          <Cell
                            key={`priority-${index}`}
                            fill={
                              priorityColors[
                                entry.name
                              ] || "#2563EB"
                            }
                          />
                        )
                      )}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </ChartCard>
            </div>
          </div>
        </section>

        {/* =====================================
            SUMMARY TABLES
        ====================================== */}

        <section>
          <SectionHeader
            eyebrow="Summary"
            title="Request Breakdown"
            description="Detailed counts of requests across different dimensions."
          />

          <div className="row g-4">

            {/* CATEGORY SUMMARY */}

            <div className="col-12 col-lg-4">
              <SummaryCard
                title="Category Summary"
                subtitle="Requests by service category"
              >
                <table className="table align-middle mb-0">
                  <thead>
                    <tr>
                      <th
                        style={{
                          color: "var(--text-muted)",
                          fontSize: "11px",
                          textTransform: "uppercase",
                          letterSpacing: "0.04em",
                          padding: "13px 18px",
                          backgroundColor: "#F8FAFC",
                        }}
                      >
                        Category
                      </th>

                      <th
                        className="text-end"
                        style={{
                          color: "var(--text-muted)",
                          fontSize: "11px",
                          textTransform: "uppercase",
                          letterSpacing: "0.04em",
                          padding: "13px 18px",
                          backgroundColor: "#F8FAFC",
                        }}
                      >
                        Requests
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {stats.categoryStats.map(
                      (item) => (
                        <tr key={item._id}>
                          <td
                            style={{
                              padding: "14px 18px",
                              color: "var(--navy)",
                              fontSize: "13px",
                              fontWeight: 600,
                            }}
                          >
                            {item._id}
                          </td>

                          <td
                            className="text-end"
                            style={{
                              padding: "14px 18px",
                            }}
                          >
                            <span
                              className="badge rounded-pill"
                              style={{
                                backgroundColor:
                                  "var(--primary-light)",
                                color: "var(--primary)",
                                padding:
                                  "6px 10px",
                              }}
                            >
                              {item.count}
                            </span>
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </SummaryCard>
            </div>

            {/* STATUS SUMMARY */}

            <div className="col-12 col-lg-4">
              <SummaryCard
                title="Status Summary"
                subtitle="Current request status"
              >
                <table className="table align-middle mb-0">
                  <thead>
                    <tr>
                      <th
                        style={{
                          color: "var(--text-muted)",
                          fontSize: "11px",
                          textTransform: "uppercase",
                          letterSpacing: "0.04em",
                          padding: "13px 18px",
                          backgroundColor: "#F8FAFC",
                        }}
                      >
                        Status
                      </th>

                      <th
                        className="text-end"
                        style={{
                          color: "var(--text-muted)",
                          fontSize: "11px",
                          textTransform: "uppercase",
                          letterSpacing: "0.04em",
                          padding: "13px 18px",
                          backgroundColor: "#F8FAFC",
                        }}
                      >
                        Requests
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {stats.statusStats.map(
                      (item) => (
                        <tr key={item._id}>
                          <td
                            style={{
                              padding: "14px 18px",
                              color: "var(--navy)",
                              fontSize: "13px",
                              fontWeight: 600,
                            }}
                          >
                            {item._id}
                          </td>

                          <td
                            className="text-end"
                            style={{
                              padding: "14px 18px",
                            }}
                          >
                            <span
                              className="badge rounded-pill"
                              style={{
                                backgroundColor:
                                  "#EAF2FF",
                                color:
                                  "#2563EB",
                                padding:
                                  "6px 10px",
                              }}
                            >
                              {item.count}
                            </span>
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </SummaryCard>
            </div>

            {/* PRIORITY SUMMARY */}

            <div className="col-12 col-lg-4">
              <SummaryCard
                title="Priority Summary"
                subtitle="Requests by priority level"
              >
                <table className="table align-middle mb-0">
                  <thead>
                    <tr>
                      <th
                        style={{
                          color: "var(--text-muted)",
                          fontSize: "11px",
                          textTransform: "uppercase",
                          letterSpacing: "0.04em",
                          padding: "13px 18px",
                          backgroundColor: "#F8FAFC",
                        }}
                      >
                        Priority
                      </th>

                      <th
                        className="text-end"
                        style={{
                          color: "var(--text-muted)",
                          fontSize: "11px",
                          textTransform: "uppercase",
                          letterSpacing: "0.04em",
                          padding: "13px 18px",
                          backgroundColor: "#F8FAFC",
                        }}
                      >
                        Requests
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {stats.priorityStats.map(
                      (item) => (
                        <tr key={item._id}>
                          <td
                            style={{
                              padding: "14px 18px",
                              color: "var(--navy)",
                              fontSize: "13px",
                              fontWeight: 600,
                            }}
                          >
                            {item._id}
                          </td>

                          <td
                            className="text-end"
                            style={{
                              padding: "14px 18px",
                            }}
                          >
                            <span
                              className="badge rounded-pill"
                              style={{
                                backgroundColor:
                                  item._id ===
                                  "Critical"
                                    ? "#FEF2F2"
                                    : item._id ===
                                      "High"
                                    ? "#FFF7E6"
                                    : item._id ===
                                      "Medium"
                                    ? "#EAF2FF"
                                    : "#ECFDF3",
                                color:
                                  item._id ===
                                  "Critical"
                                    ? "#DC2626"
                                    : item._id ===
                                      "High"
                                    ? "#D97706"
                                    : item._id ===
                                      "Medium"
                                    ? "#2563EB"
                                    : "#16A34A",
                                padding:
                                  "6px 10px",
                              }}
                            >
                              {item.count}
                            </span>
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </SummaryCard>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}

export default AdminDashboard;