"use client"

import { useState, useEffect } from "react"
import axios from "axios"

const Projects = () => {
  const [projects, setProjects] = useState([])
  const [accounts, setAccounts] = useState([])
  const [contacts, setContacts] = useState([])
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingProject, setEditingProject] = useState(null)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    status: "planning",
    priority: "medium",
    startDate: "",
    endDate: "",
    budget: "",
    account: "",
    contact: "",
    teamMembers: [],
    milestones: [],
  })

  useEffect(() => {
    fetchProjects()
    fetchAccounts()
    fetchContacts()
    fetchUsers()
  }, [])

  const fetchProjects = async () => {
    try {
      const res = await axios.get("/api/projects")
      setProjects(res.data.data)
      setLoading(false)
    } catch (error) {
      console.error("Error fetching projects:", error)
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

  const fetchContacts = async () => {
    try {
      const res = await axios.get("/api/contacts")
      setContacts(res.data.data)
    } catch (error) {
      console.error("Error fetching contacts:", error)
    }
  }

  const fetchUsers = async () => {
    try {
      const res = await axios.get("/api/users")
      setUsers(res.data.data)
    } catch (error) {
      console.error("Error fetching users:", error)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingProject) {
        await axios.put(`/api/projects/${editingProject._id}`, formData)
      } else {
        await axios.post("/api/projects", formData)
      }
      setShowModal(false)
      setEditingProject(null)
      resetForm()
      fetchProjects()
    } catch (error) {
      console.error("Error saving project:", error)
    }
  }

  const handleEdit = (project) => {
    setEditingProject(project)
    setFormData({
      name: project.name,
      description: project.description || "",
      status: project.status,
      priority: project.priority,
      startDate: project.startDate ? project.startDate.split("T")[0] : "",
      endDate: project.endDate ? project.endDate.split("T")[0] : "",
      budget: project.budget || "",
      account: project.account?._id || "",
      contact: project.contact?._id || "",
      teamMembers: project.teamMembers?.map((member) => member._id) || [],
      milestones: project.milestones || [],
    })
    setShowModal(true)
  }

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      status: "planning",
      priority: "medium",
      startDate: "",
      endDate: "",
      budget: "",
      account: "",
      contact: "",
      teamMembers: [],
      milestones: [],
    })
  }

  const getStatusBadge = (status) => {
    const statusClasses = {
      planning: "badge-info",
      active: "badge-success",
      on_hold: "badge-warning",
      completed: "badge-success",
      cancelled: "badge-danger",
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

  const addMilestone = () => {
    setFormData({
      ...formData,
      milestones: [
        ...formData.milestones,
        {
          name: "",
          description: "",
          dueDate: "",
          status: "pending",
        },
      ],
    })
  }

  const updateMilestone = (index, field, value) => {
    const updatedMilestones = [...formData.milestones]
    updatedMilestones[index][field] = value
    setFormData({ ...formData, milestones: updatedMilestones })
  }

  const removeMilestone = (index) => {
    const updatedMilestones = formData.milestones.filter((_, i) => i !== index)
    setFormData({ ...formData, milestones: updatedMilestones })
  }

  if (loading) {
    return <div className="loading">Loading projects...</div>
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <h1>Projects</h1>
        <button
          className="btn btn-primary"
          onClick={() => {
            resetForm()
            setEditingProject(null)
            setShowModal(true)
          }}
        >
          Add New Project
        </button>
      </div>

      <div className="card">
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Status</th>
              <th>Priority</th>
              <th>Progress</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Budget</th>
              <th>Assigned To</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((project) => (
              <tr key={project._id}>
                <td>
                  <div>
                    <strong>{project.name}</strong>
                    {project.account && <div style={{ fontSize: "0.8rem", color: "#666" }}>{project.account.name}</div>}
                  </div>
                </td>
                <td>
                  <span className={getStatusBadge(project.status)}>{project.status.replace("_", " ")}</span>
                </td>
                <td>
                  <span className={getPriorityBadge(project.priority)}>{project.priority}</span>
                </td>
                <td>
                  <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                    <div
                      style={{
                        width: "50px",
                        height: "8px",
                        backgroundColor: "#e0e0e0",
                        borderRadius: "4px",
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          width: `${project.progress}%`,
                          height: "100%",
                          backgroundColor: "#4CAF50",
                        }}
                      />
                    </div>
                    <span>{project.progress}%</span>
                  </div>
                </td>
                <td>{new Date(project.startDate).toLocaleDateString()}</td>
                <td>{new Date(project.endDate).toLocaleDateString()}</td>
                <td>{project.budget ? `$${project.budget.toLocaleString()}` : "-"}</td>
                <td>{project.assignedTo?.name}</td>
                <td>
                  <button
                    className="btn btn-secondary"
                    onClick={() => handleEdit(project)}
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
          <div className="modal-content" style={{ maxWidth: "800px" }}>
            <div className="modal-header">
              <h3>{editingProject ? "Edit Project" : "Add New Project"}</h3>
              <button className="close" onClick={() => setShowModal(false)}>
                ×
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Project Name:</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
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
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
                <div className="form-group">
                  <label>Status:</label>
                  <select
                    className="form-control"
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  >
                    <option value="planning">Planning</option>
                    <option value="active">Active</option>
                    <option value="on_hold">On Hold</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
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
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
                <div className="form-group">
                  <label>Start Date:</label>
                  <input
                    type="date"
                    className="form-control"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>End Date:</label>
                  <input
                    type="date"
                    className="form-control"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Budget:</label>
                <input
                  type="number"
                  className="form-control"
                  value={formData.budget}
                  onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
                <div className="form-group">
                  <label>Account:</label>
                  <select
                    className="form-control"
                    value={formData.account}
                    onChange={(e) => setFormData({ ...formData, account: e.target.value })}
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
                  <label>Contact:</label>
                  <select
                    className="form-control"
                    value={formData.contact}
                    onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                  >
                    <option value="">Select Contact</option>
                    {contacts.map((contact) => (
                      <option key={contact._id} value={contact._id}>
                        {contact.firstName} {contact.lastName}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label>Team Members:</label>
                <select
                  multiple
                  className="form-control"
                  value={formData.teamMembers}
                  onChange={(e) => {
                    const selectedOptions = Array.from(e.target.selectedOptions, (option) => option.value)
                    setFormData({ ...formData, teamMembers: selectedOptions })
                  }}
                  style={{ height: "100px" }}
                >
                  {users.map((user) => (
                    <option key={user._id} value={user._id}>
                      {user.name} ({user.role})
                    </option>
                  ))}
                </select>
                <small>Hold Ctrl/Cmd to select multiple team members</small>
              </div>

              <div className="form-group">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <label>Milestones:</label>
                  <button type="button" className="btn btn-secondary" onClick={addMilestone}>
                    Add Milestone
                  </button>
                </div>
                {formData.milestones.map((milestone, index) => (
                  <div
                    key={index}
                    style={{ border: "1px solid #ddd", padding: "10px", margin: "5px 0", borderRadius: "4px" }}
                  >
                    <div
                      style={{ display: "grid", gridTemplateColumns: "1fr 1fr auto", gap: "10px", alignItems: "end" }}
                    >
                      <div>
                        <label>Name:</label>
                        <input
                          type="text"
                          className="form-control"
                          value={milestone.name}
                          onChange={(e) => updateMilestone(index, "name", e.target.value)}
                        />
                      </div>
                      <div>
                        <label>Due Date:</label>
                        <input
                          type="date"
                          className="form-control"
                          value={milestone.dueDate}
                          onChange={(e) => updateMilestone(index, "dueDate", e.target.value)}
                        />
                      </div>
                      <button type="button" className="btn btn-danger" onClick={() => removeMilestone(index)}>
                        Remove
                      </button>
                    </div>
                    <div style={{ marginTop: "10px" }}>
                      <label>Description:</label>
                      <textarea
                        className="form-control"
                        rows="2"
                        value={milestone.description}
                        onChange={(e) => updateMilestone(index, "description", e.target.value)}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingProject ? "Update" : "Create"} Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Projects
