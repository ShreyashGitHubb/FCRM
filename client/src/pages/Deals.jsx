"use client"

import { useState, useEffect } from "react"
import axios from "axios"

const Deals = () => {
  const [deals, setDeals] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingDeal, setEditingDeal] = useState(null)
  const [formData, setFormData] = useState({
    title: "",
    value: "",
    stage: "initiated",
    probability: 10,
    expectedCloseDate: "",
    contact: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      company: "",
    },
    notes: "",
  })

  useEffect(() => {
    fetchDeals()
  }, [])

  const fetchDeals = async () => {
    try {
      const res = await axios.get("/api/deals")
      setDeals(res.data.data)
      setLoading(false)
    } catch (error) {
      console.error("Error fetching deals:", error)
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingDeal) {
        await axios.put(`/api/deals/${editingDeal._id}`, formData)
      } else {
        await axios.post("/api/deals", formData)
      }
      setShowModal(false)
      setEditingDeal(null)
      resetForm()
      fetchDeals()
    } catch (error) {
      console.error("Error saving deal:", error)
    }
  }

  const handleEdit = (deal) => {
    setEditingDeal(deal)
    setFormData({
      title: deal.title,
      value: deal.value,
      stage: deal.stage,
      probability: deal.probability,
      expectedCloseDate: deal.expectedCloseDate ? deal.expectedCloseDate.split("T")[0] : "",
      contact: deal.contact || {
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        company: "",
      },
      notes: deal.notes || "",
    })
    setShowModal(true)
  }

  const resetForm = () => {
    setFormData({
      title: "",
      value: "",
      stage: "initiated",
      probability: 10,
      expectedCloseDate: "",
      contact: {
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        company: "",
      },
      notes: "",
    })
  }

  const getStageBadge = (stage) => {
    const stageClasses = {
      initiated: "badge-info",
      qualification: "badge-warning",
      proposal: "badge-warning",
      negotiation: "badge-warning",
      won: "badge-success",
      lost: "badge-danger",
    }
    return `badge ${stageClasses[stage] || "badge-secondary"}`
  }

  if (loading) {
    return <div className="loading">Loading deals...</div>
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <h1>Deals</h1>
        <button
          className="btn btn-primary"
          onClick={() => {
            resetForm()
            setEditingDeal(null)
            setShowModal(true)
          }}
        >
          Add New Deal
        </button>
      </div>

      <div className="card">
        <table className="table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Value</th>
              <th>Stage</th>
              <th>Probability</th>
              <th>Expected Close</th>
              <th>Assigned To</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {deals.map((deal) => (
              <tr key={deal._id}>
                <td>{deal.title}</td>
                <td>${deal.value.toLocaleString()}</td>
                <td>
                  <span className={getStageBadge(deal.stage)}>{deal.stage}</span>
                </td>
                <td>{deal.probability}%</td>
                <td>{new Date(deal.expectedCloseDate).toLocaleDateString()}</td>
                <td>{deal.assignedTo?.name}</td>
                <td>
                  <button className="btn btn-secondary" onClick={() => handleEdit(deal)} style={{ marginRight: "5px" }}>
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
              <h3>{editingDeal ? "Edit Deal" : "Add New Deal"}</h3>
              <button className="close" onClick={() => setShowModal(false)}>
                ×
              </button>
            </div>
            <form onSubmit={handleSubmit}>
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
                <label>Value:</label>
                <input
                  type="number"
                  className="form-control"
                  value={formData.value}
                  onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Stage:</label>
                <select
                  className="form-control"
                  value={formData.stage}
                  onChange={(e) => setFormData({ ...formData, stage: e.target.value })}
                >
                  <option value="initiated">Initiated</option>
                  <option value="qualification">Qualification</option>
                  <option value="proposal">Proposal</option>
                  <option value="negotiation">Negotiation</option>
                  <option value="won">Won</option>
                  <option value="lost">Lost</option>
                </select>
              </div>
              <div className="form-group">
                <label>Probability (%):</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  className="form-control"
                  value={formData.probability}
                  onChange={(e) => setFormData({ ...formData, probability: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Expected Close Date:</label>
                <input
                  type="date"
                  className="form-control"
                  value={formData.expectedCloseDate}
                  onChange={(e) => setFormData({ ...formData, expectedCloseDate: e.target.value })}
                  required
                />
              </div>
              <h4>Contact Information</h4>
              <div className="form-group">
                <label>First Name:</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.contact.firstName}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      contact: { ...formData.contact, firstName: e.target.value },
                    })
                  }
                />
              </div>
              <div className="form-group">
                <label>Last Name:</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.contact.lastName}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      contact: { ...formData.contact, lastName: e.target.value },
                    })
                  }
                />
              </div>
              <div className="form-group">
                <label>Email:</label>
                <input
                  type="email"
                  className="form-control"
                  value={formData.contact.email}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      contact: { ...formData.contact, email: e.target.value },
                    })
                  }
                />
              </div>
              <div className="form-group">
                <label>Company:</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.contact.company}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      contact: { ...formData.contact, company: e.target.value },
                    })
                  }
                />
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
                  {editingDeal ? "Update" : "Create"} Deal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Deals
