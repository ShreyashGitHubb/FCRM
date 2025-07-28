"use client"

import { useState, useEffect } from "react"
import axios from "axios"

const Leads = () => {
  const [leads, setLeads] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingLead, setEditingLead] = useState(null)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    company: "",
    status: "new",
    source: "website",
    notes: "",
  })

  useEffect(() => {
    fetchLeads()
  }, [])

  const fetchLeads = async () => {
    try {
      const res = await axios.get("/api/leads")
      setLeads(res.data.data)
      setLoading(false)
    } catch (error) {
      console.error("Error fetching leads:", error)
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingLead) {
        await axios.put(`/api/leads/${editingLead._id}`, formData)
      } else {
        await axios.post("/api/leads", formData)
      }
      setShowModal(false)
      setEditingLead(null)
      resetForm()
      fetchLeads()
    } catch (error) {
      console.error("Error saving lead:", error)
    }
  }

  const handleEdit = (lead) => {
    setEditingLead(lead)
    setFormData({
      firstName: lead.firstName,
      lastName: lead.lastName,
      email: lead.email,
      phone: lead.phone || "",
      company: lead.company || "",
      status: lead.status,
      source: lead.source,
      notes: lead.notes || "",
    })
    setShowModal(true)
  }

  const resetForm = () => {
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      company: "",
      status: "new",
      source: "website",
      notes: "",
    })
  }

  const getStatusBadge = (status) => {
    const statusClasses = {
      new: "badge-info",
      contacted: "badge-warning",
      qualified: "badge-success",
      converted: "badge-success",
      lost: "badge-danger",
    }
    return `badge ${statusClasses[status] || "badge-secondary"}`
  }

  if (loading) {
    return <div className="loading">Loading leads...</div>
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", }}>
        <h1>Leads</h1>
        <button
          className="btn btn-primary"
          onClick={() => {
            resetForm()
            setEditingLead(null)
            setShowModal(true)
          }}
        >
          Add New Lead
        </button>
      </div>

      <div className="card">
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Company</th>
              <th>Status</th>
              <th>Source</th>
              <th>Assigned To</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {leads.map((lead) => (
              <tr key={lead._id}>
                <td>
                  {lead.firstName} {lead.lastName}
                </td>
                <td>{lead.email}</td>
                <td>{lead.company || "-"}</td>
                <td>
                  <span className={getStatusBadge(lead.status)}>{lead.status}</span>
                </td>
                <td>{lead.source}</td>
                <td>{lead.assignedTo?.name}</td>
                <td>
                  <button className="btn btn-secondary" onClick={() => handleEdit(lead)} style={{ marginRight: "5px" }}>
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
              <h3>{editingLead ? "Edit Lead" : "Add New Lead"}</h3>
              <button className="close" onClick={() => setShowModal(false)}>
                ×
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>First Name:</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Last Name:</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Email:</label>
                <input
                  type="email"
                  className="form-control"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Phone:</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Company:</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Status:</label>
                <select
                  className="form-control"
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                >
                  <option value="new">New</option>
                  <option value="contacted">Contacted</option>
                  <option value="qualified">Qualified</option>
                  <option value="converted">Converted</option>
                  <option value="lost">Lost</option>
                </select>
              </div>
              <div className="form-group">
                <label>Source:</label>
                <select
                  className="form-control"
                  value={formData.source}
                  onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                >
                  <option value="website">Website</option>
                  <option value="referral">Referral</option>
                  <option value="social_media">Social Media</option>
                  <option value="email_campaign">Email Campaign</option>
                  <option value="cold_call">Cold Call</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="form-group">
                <label>Notes:</label>
                <textarea
                  className="form-control"
                  rows="3"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                />
              </div>
              <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingLead ? "Update" : "Create"} Lead
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Leads
