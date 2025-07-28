"use client"

import { useState, useEffect } from "react"
import axios from "axios"

const Contacts = () => {
  const [contacts, setContacts] = useState([])
  const [accounts, setAccounts] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingContact, setEditingContact] = useState(null)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    mobile: "",
    jobTitle: "",
    department: "",
    account: "",
    status: "active",
    notes: "",
    address: {
      street: "",
      city: "",
      state: "",
      zipCode: "",
      country: "",
    },
  })

  useEffect(() => {
    fetchContacts()
    fetchAccounts()
  }, [])

  const fetchContacts = async () => {
    try {
      const res = await axios.get("/api/contacts")
      setContacts(res.data.data)
      setLoading(false)
    } catch (error) {
      console.error("Error fetching contacts:", error)
      setLoading(false)
    }
  }

  const fetchAccounts = async () => {
    try {
      const res = await axios.get("/api/accounts")
      setAccounts(res.data.data)
    } catch (error) {
      console.error("Error fetching accounts:", error)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingContact) {
        await axios.put(`/api/contacts/${editingContact._id}`, formData)
      } else {
        await axios.post("/api/contacts", formData)
      }
      setShowModal(false)
      setEditingContact(null)
      resetForm()
      fetchContacts()
    } catch (error) {
      console.error("Error saving contact:", error)
    }
  }

  const handleEdit = (contact) => {
    setEditingContact(contact)
    setFormData({
      firstName: contact.firstName,
      lastName: contact.lastName,
      email: contact.email,
      phone: contact.phone || "",
      mobile: contact.mobile || "",
      jobTitle: contact.jobTitle || "",
      department: contact.department || "",
      account: contact.account._id,
      status: contact.status,
      notes: contact.notes || "",
      address: contact.address || {
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
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      mobile: "",
      jobTitle: "",
      department: "",
      account: "",
      status: "active",
      notes: "",
      address: {
        street: "",
        city: "",
        state: "",
        zipCode: "",
        country: "",
      },
    })
  }

  const getStatusBadge = (status) => {
    const statusClasses = {
      active: "badge-success",
      inactive: "badge-secondary",
      prospect: "badge-warning",
    }
    return `badge ${statusClasses[status] || "badge-secondary"}`
  }

  if (loading) {
    return <div className="loading">Loading contacts...</div>
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <h1>Contacts</h1>
        <button
          className="btn btn-primary"
          onClick={() => {
            resetForm()
            setEditingContact(null)
            setShowModal(true)
          }}
        >
          Add New Contact
        </button>
      </div>

      <div className="card">
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Job Title</th>
              <th>Account</th>
              <th>Status</th>
              <th>Assigned To</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {contacts.map((contact) => (
              <tr key={contact._id}>
                <td>
                  {contact.firstName} {contact.lastName}
                </td>
                <td>{contact.email}</td>
                <td>{contact.phone || contact.mobile || "-"}</td>
                <td>{contact.jobTitle || "-"}</td>
                <td>{contact.account?.name || "-"}</td>
                <td>
                  <span className={getStatusBadge(contact.status)}>{contact.status}</span>
                </td>
                <td>{contact.assignedTo?.name}</td>
                <td>
                  <button
                    className="btn btn-secondary"
                    onClick={() => handleEdit(contact)}
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
              <h3>{editingContact ? "Edit Contact" : "Add New Contact"}</h3>
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
                <label>Mobile:</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.mobile}
                  onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Job Title:</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.jobTitle}
                  onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Department:</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Account:</label>
                <select
                  className="form-control"
                  value={formData.account}
                  onChange={(e) => setFormData({ ...formData, account: e.target.value })}
                  required
                >
                  <option value="">Select Account</option>
                  {accounts.map((account) => (
                    <option key={account._id} value={account._id}>
                      {account.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Status:</label>
                <select
                  className="form-control"
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="prospect">Prospect</option>
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
                  {editingContact ? "Update" : "Create"} Contact
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Contacts
