"use client"

import { useState, useEffect } from "react"
import axios from "axios"

const Accounts = () => {
  const [accounts, setAccounts] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingAccount, setEditingAccount] = useState(null)
  const [formData, setFormData] = useState({
    name: "",
    website: "",
    industry: "",
    type: "prospect",
    size: "small",
    revenue: "",
    employees: "",
    description: "",
    status: "active",
    address: {
      street: "",
      city: "",
      state: "",
      zipCode: "",
      country: "",
    },
  })

  useEffect(() => {
    fetchAccounts()
  }, [])

  const fetchAccounts = async () => {
    try {
      const res = await axios.get("/api/accounts")
      setAccounts(res.data.data)
      setLoading(false)
    } catch (error) {
      console.error("Error fetching accounts:", error)
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingAccount) {
        await axios.put(`/api/accounts/${editingAccount._id}`, formData)
      } else {
        await axios.post("/api/accounts", formData)
      }
      setShowModal(false)
      setEditingAccount(null)
      resetForm()
      fetchAccounts()
    } catch (error) {
      console.error("Error saving account:", error)
    }
  }

  const handleEdit = (account) => {
    setEditingAccount(account)
    setFormData({
      name: account.name,
      website: account.website || "",
      industry: account.industry || "",
      type: account.type,
      size: account.size,
      revenue: account.revenue || "",
      employees: account.employees || "",
      description: account.description || "",
      status: account.status,
      address: account.address || {
        street: "",
        city: "",
        state: "",
        zipCode: "",
        country: "",
      },
    })
    setShowModal(true)
  }

  const resetForm = () => {
    setFormData({
      name: "",
      website: "",
      industry: "",
      type: "prospect",
      size: "small",
      revenue: "",
      employees: "",
      description: "",
      status: "active",
      address: {
        street: "",
        city: "",
        state: "",
        zipCode: "",
        country: "",
      },
    })
  }

  const getTypeBadge = (type) => {
    const typeClasses = {
      prospect: "badge-warning",
      customer: "badge-success",
      partner: "badge-info",
      vendor: "badge-secondary",
    }
    return `badge ${typeClasses[type] || "badge-secondary"}`
  }

  if (loading) {
    return <div className="loading">Loading accounts...</div>
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <h1>Accounts</h1>
        <button
          className="btn btn-primary"
          onClick={() => {
            resetForm()
            setEditingAccount(null)
            setShowModal(true)
          }}
        >
          Add New Account
        </button>
      </div>

      <div className="card">
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Industry</th>
              <th>Type</th>
              <th>Size</th>
              <th>Contacts</th>
              <th>Assigned To</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {accounts.map((account) => (
              <tr key={account._id}>
                <td>
                  <div>
                    <strong>{account.name}</strong>
                    {account.website && (
                      <div style={{ fontSize: "0.8rem", color: "#666" }}>
                        <a href={account.website} target="_blank" rel="noopener noreferrer">
                          {account.website}
                        </a>
                      </div>
                    )}
                  </div>
                </td>
                <td>{account.industry || "-"}</td>
                <td>
                  <span className={getTypeBadge(account.type)}>{account.type}</span>
                </td>
                <td>{account.size}</td>
                <td>{account.contactCount || 0}</td>
                <td>{account.assignedTo?.name}</td>
                <td>
                  <button
                    className="btn btn-secondary"
                    onClick={() => handleEdit(account)}
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
              <h3>{editingAccount ? "Edit Account" : "Add New Account"}</h3>
              <button className="close" onClick={() => setShowModal(false)}>
                ×
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Company Name:</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Website:</label>
                <input
                  type="url"
                  className="form-control"
                  value={formData.website}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Industry:</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.industry}
                  onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Type:</label>
                <select
                  className="form-control"
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                >
                  <option value="prospect">Prospect</option>
                  <option value="customer">Customer</option>
                  <option value="partner">Partner</option>
                  <option value="vendor">Vendor</option>
                </select>
              </div>
              <div className="form-group">
                <label>Company Size:</label>
                <select
                  className="form-control"
                  value={formData.size}
                  onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                >
                  <option value="small">Small (1-50)</option>
                  <option value="medium">Medium (51-200)</option>
                  <option value="large">Large (201-1000)</option>
                  <option value="enterprise">Enterprise (1000+)</option>
                </select>
              </div>
              <div className="form-group">
                <label>Annual Revenue:</label>
                <input
                  type="number"
                  className="form-control"
                  value={formData.revenue}
                  onChange={(e) => setFormData({ ...formData, revenue: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Number of Employees:</label>
                <input
                  type="number"
                  className="form-control"
                  value={formData.employees}
                  onChange={(e) => setFormData({ ...formData, employees: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Description:</label>
                <textarea
                  className="form-control"
                  rows="3"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
              <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingAccount ? "Update" : "Create"} Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Accounts
