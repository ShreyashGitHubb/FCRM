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
      <h1>Dashboard</h1>
      <div className="stats-grid">
        {getStatsForRole().map((stat, index) => (
          <div key={index} className="stat-card">
            <div className="stat-number" style={{ color: stat.color }}>
              {stat.value}
            </div>
            <div className="stat-label">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="card">
        <h3>Welcome to the CRM System</h3>
        <p>
          You are logged in as <strong>{user?.name}</strong> with the role of <strong>{user?.role}</strong>.
        </p>
        <p>Use the navigation menu to access different sections of the CRM system based on your role permissions.</p>
      </div>
    </div>
  )
}

export default Dashboard
