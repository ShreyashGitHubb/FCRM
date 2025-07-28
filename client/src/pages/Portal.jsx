"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { useAuth } from "../context/AuthContext"

const Portal = () => {
  const [portalData, setPortalData] = useState(null)
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  useEffect(() => {
    fetchPortalData()
  }, [])

  const fetchPortalData = async () => {
    try {
      const res = await axios.get("/api/portal")
      setPortalData(res.data.data)
      setLoading(false)
    } catch (error) {
      console.error("Error fetching portal data:", error)
      setLoading(false)
    }
  }

  const getStatusBadge = (status) => {
    const statusClasses = {
      open: "badge-danger",
      in_progress: "badge-warning",
      resolved: "badge-success",
      closed: "badge-secondary",
    }
    return `badge ${statusClasses[status] || "badge-secondary"}`
  }

  if (loading) {
    return <div className="loading">Loading portal...</div>
  }

  return (
    <div>
      <h1>Customer Portal</h1>

      <div className="card">
        <h3>Welcome, {portalData?.customer?.name}</h3>
        <p>Email: {portalData?.customer?.email}</p>
      </div>

      <div className="card">
        <h3>My Support Tickets</h3>
        {portalData?.tickets?.length > 0 ? (
          <table className="table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Status</th>
                <th>Priority</th>
                <th>Category</th>
                <th>Assigned To</th>
                <th>Created</th>
              </tr>
            </thead>
            <tbody>
              {portalData.tickets.map((ticket) => (
                <tr key={ticket._id}>
                  <td>{ticket.title}</td>
                  <td>
                    <span className={getStatusBadge(ticket.status)}>{ticket.status.replace("_", " ")}</span>
                  </td>
                  <td>{ticket.priority}</td>
                  <td>{ticket.category.replace("_", " ")}</td>
                  <td>{ticket.assignedTo?.name || "Unassigned"}</td>
                  <td>{new Date(ticket.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No tickets found.</p>
        )}
      </div>
    </div>
  )
}

export default Portal
