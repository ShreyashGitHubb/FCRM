"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { useAuth } from "../context/AuthContext"

const Dashboard = () => {
  const [stats, setStats] = useState({})
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const res = await axios.get("/api/dashboard")
      setStats(res.data.data)
      setLoading(false)
    } catch (error) {
      console.error("Error fetching stats:", error)
      setLoading(false)
    }
  }

  const getStatsForRole = () => {
    switch (user?.role) {
      case "sales_executive":
        return [
          { label: "My Leads", value: stats.leads || 0, color: "#007bff" },
          { label: "My Deals", value: stats.deals || 0, color: "#28a745" },
          { label: "Won Deals", value: stats.wonDeals || 0, color: "#17a2b8" },
          { label: "Pending Tasks", value: stats.pendingTasks || 0, color: "#ffc107" },
          { label: "Total Revenue", value: `$${(stats.totalRevenue || 0).toLocaleString()}`, color: "#6f42c1" },
        ]
      case "sales_manager":
      case "admin":
      case "super_admin":
        return [
          { label: "Total Leads", value: stats.leads || 0, color: "#007bff" },
          { label: "Total Deals", value: stats.deals || 0, color: "#28a745" },
          { label: "Won Deals", value: stats.wonDeals || 0, color: "#17a2b8" },
          { label: "Total Users", value: stats.users || 0, color: "#fd7e14" },
          { label: "Open Tickets", value: stats.openTickets || 0, color: "#dc3545" },
          { label: "Total Revenue", value: `$${(stats.totalRevenue || 0).toLocaleString()}`, color: "#6f42c1" },
        ]
      case "support_agent":
        return [
          { label: "Assigned Tickets", value: stats.assignedTickets || 0, color: "#007bff" },
          { label: "Open Tickets", value: stats.openTickets || 0, color: "#dc3545" },
          { label: "Resolved Tickets", value: stats.resolvedTickets || 0, color: "#28a745" },
          { label: "Pending Tasks", value: stats.pendingTasks || 0, color: "#ffc107" },
        ]
      case "customer":
        return [
          { label: "My Tickets", value: stats.myTickets || 0, color: "#007bff" },
          { label: "Open Tickets", value: stats.openTickets || 0, color: "#dc3545" },
          { label: "Resolved Tickets", value: stats.resolvedTickets || 0, color: "#28a745" },
        ]
      default:
        return []
    }
  }

  if (loading) {
    return <div className="loading">Loading dashboard...</div>
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">📊 Dashboard</h1>
          <p className="page-subtitle">
            Overview of your CRM activities and performance metrics
          </p>
        </div>
      </div>

      <div className="stats-grid">
        {getStatsForRole().map((stat, index) => (
          <div key={index} className="stat">
            <div className="stat-number" style={{ color: stat.color }}>
              {stat.value}
            </div>
            <div className="stat-label">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="dashboard-grid">
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">🎯 Welcome Back!</h3>
          </div>
          <div className="card-body">
            <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "20px" }}>
              <div style={{
                width: "60px",
                height: "60px",
                borderRadius: "50%",
                background: "linear-gradient(135deg, var(--primary-color), var(--info-color))",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "1.5rem",
                color: "white"
              }}>
                👤
              </div>
              <div>
                <h4 style={{ margin: "0 0 4px 0", color: "var(--text-primary)" }}>
                  {user?.name}
                </h4>
                <p style={{ margin: 0, color: "var(--text-secondary)", textTransform: "capitalize" }}>
                  {user?.role?.replace("_", " ")} • Active
                </p>
              </div>
            </div>
            <p style={{ color: "var(--text-secondary)", lineHeight: "1.6" }}>
              Welcome to your CRM dashboard! Use the navigation menu to access different sections
              based on your role permissions. Your performance metrics are displayed above.
            </p>
            <div style={{
              marginTop: "20px",
              padding: "16px",
              background: "var(--surface-color)",
              borderRadius: "var(--radius)",
              border: "1px solid var(--border-color)"
            }}>
              <h5 style={{ margin: "0 0 8px 0", color: "var(--text-primary)" }}>
                🚀 Quick Actions
              </h5>
              <p style={{ margin: "0 0 12px 0", fontSize: "0.875rem", color: "var(--text-secondary)" }}>
                Get started with these common tasks
              </p>
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                <button className="btn btn-sm btn-primary">Add Lead</button>
                <button className="btn btn-sm btn-secondary">View Reports</button>
                <button className="btn btn-sm btn-secondary">Manage Tasks</button>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="card-title">📈 Recent Activity</h3>
          </div>
          <div className="card-body">
            <div className="empty-state">
              <div className="empty-state-icon">📋</div>
              <div className="empty-state-title">No Recent Activity</div>
              <div className="empty-state-description">
                Your recent activities will appear here once you start using the system.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
