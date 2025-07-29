"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { useAuth } from "../context/AuthContext"

const Tickets = () => {
  const [tickets, setTickets] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingTicket, setEditingTicket] = useState(null)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "open",
    priority: "medium",
    category: "general",
    customer: "",
    assignedTo: "",
  })
  const [customers, setCustomers] = useState([])
  const [error, setError] = useState("")
  const { user } = useAuth()

  useEffect(() => {
    fetchTickets()
    if (user?.role !== "customer") {
      fetchCustomers()
    }
  }, [])

  const fetchTickets = async () => {
    try {
      const res = await axios.get("/api/tickets")
      setTickets(res.data.data)
      setLoading(false)
    } catch (error) {
      console.error("Error fetching tickets:", error)
      setLoading(false)
    }
  }

  const fetchCustomers = async () => {
    try {
      const res = await axios.get("/api/users")
      setCustomers(res.data.data.filter(u => u.role === "customer"))
    } catch (error) {
      console.error("Error fetching customers:", error)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    try {
      let submitData = { ...formData }
      if (submitData.assignedTo === "") {
        delete submitData.assignedTo
      }
      if (editingTicket) {
        await axios.put(`/api/tickets/${editingTicket._id}`, submitData)
      } else {
        await axios.post("/api/tickets", submitData)
      }
      setShowModal(false)
      setEditingTicket(null)
      resetForm()
      fetchTickets()
    } catch (error) {
      setError(error.response?.data?.message || "Error saving ticket.")
      console.error("Error saving ticket:", error)
    }
  }

  const handleEdit = (ticket) => {
    setEditingTicket(ticket)
    setFormData({
      title: ticket.title,
      description: ticket.description,
      status: ticket.status,
      priority: ticket.priority,
      category: ticket.category,
      customer: ticket.customer._id,
      assignedTo: ticket.assignedTo?._id || "",
    })
    setShowModal(true)
  }

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      status: "open",
      priority: "medium",
      category: "general",
      customer: "",
      assignedTo: "",
    })
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

  const getPriorityBadge = (priority) => {
    const priorityClasses = {
      low: "badge-secondary",
      medium: "badge-info",
      high: "badge-warning",
      urgent: "badge-danger",
    }
    return `badge ${priorityClasses[priority] || "badge-secondary"}`
  }

  if (loading) {
    return <div className="loading">Loading tickets...</div>
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <h1>Support Tickets</h1>
        {user?.role !== "support_agent" && (
          <button
            className="btn btn-primary"
            onClick={() => {
              resetForm()
              setEditingTicket(null)
              setShowModal(true)
            }}
          >
            Create New Ticket
          </button>
        )}
      </div>

      <div className="card">
        <table className="table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Status</th>
              <th>Priority</th>
              <th>Category</th>
              <th>Customer</th>
              <th>Assigned To</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {tickets.map((ticket) => (
              <tr key={ticket._id}>
                <td>{ticket.title}</td>
                <td>
                  <span className={getStatusBadge(ticket.status)}>{ticket.status.replace("_", " ")}</span>
                </td>
                <td>
                  <span className={getPriorityBadge(ticket.priority)}>{ticket.priority}</span>
                </td>
                <td>{ticket.category.replace("_", " ")}</td>
                <td>{ticket.customer?.name}</td>
                <td>{ticket.assignedTo?.name || "Unassigned"}</td>
                <td>{new Date(ticket.createdAt).toLocaleDateString()}</td>
                <td>
                  <button
                    className="btn btn-secondary"
                    onClick={() => handleEdit(ticket)}
                    style={{ marginRight: "5px" }}
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <div className="modal-header">
              <h3>{editingTicket ? "Edit Ticket" : "Create New Ticket"}</h3>
              <button className="close" onClick={() => setShowModal(false)}>
                ×
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              {error && (
                <div style={{ color: "red", marginBottom: 10 }}>{error}</div>
              )}
              <div className="form-group">
                <label>Title:</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Description:</label>
                <textarea
                  className="form-control"
                  rows="4"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                />
              </div>
              {/* Customer selection for admin/support agent */}
              {user?.role !== "customer" && (
                <div className="form-group">
                  <label>Customer:</label>
                  <select
                    className="form-control"
                    value={formData.customer}
                    onChange={(e) => setFormData({ ...formData, customer: e.target.value })}
                    required
                  >
                    <option value="">Select Customer</option>
                    {customers.map((c) => (
                      <option key={c._id} value={c._id}>{c.name} ({c.email})</option>
                    ))}
                  </select>
                </div>
              )}
              <div className="form-group">
                <label>Status:</label>
                <select
                  className="form-control"
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                >
                  <option value="open">Open</option>
                  <option value="in_progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                  <option value="closed">Closed</option>
                </select>
              </div>
              <div className="form-group">
                <label>Priority:</label>
                <select
                  className="form-control"
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>
              <div className="form-group">
                <label>Category:</label>
                <select
                  className="form-control"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                >
                  <option value="technical">Technical</option>
                  <option value="billing">Billing</option>
                  <option value="general">General</option>
                  <option value="feature_request">Feature Request</option>
                </select>
              </div>
              <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingTicket ? "Update" : "Create"} Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Tickets
