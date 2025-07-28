"use client"

import { useState, useEffect } from "react"
import axios from "axios"

const Tasks = () => {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingTask, setEditingTask] = useState(null)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "pending",
    priority: "medium",
    dueDate: "",
    assignedTo: "",
  })

  useEffect(() => {
    fetchTasks()
  }, [])

  const fetchTasks = async () => {
    try {
      const res = await axios.get("/api/tasks")
      setTasks(res.data.data)
      setLoading(false)
    } catch (error) {
      console.error("Error fetching tasks:", error)
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingTask) {
        await axios.put(`/api/tasks/${editingTask._id}`, formData)
      } else {
        await axios.post("/api/tasks", formData)
      }
      setShowModal(false)
      setEditingTask(null)
      resetForm()
      fetchTasks()
    } catch (error) {
      console.error("Error saving task:", error)
    }
  }

  const handleEdit = (task) => {
    setEditingTask(task)
    setFormData({
      title: task.title,
      description: task.description || "",
      status: task.status,
      priority: task.priority,
      dueDate: task.dueDate ? task.dueDate.split("T")[0] : "",
      assignedTo: task.assignedTo._id,
    })
    setShowModal(true)
  }

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      status: "pending",
      priority: "medium",
      dueDate: "",
      assignedTo: "",
    })
  }

  const getStatusBadge = (status) => {
    const statusClasses = {
      pending: "badge-warning",
      in_progress: "badge-info",
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

  if (loading) {
    return <div className="loading">Loading tasks...</div>
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <h1>Tasks</h1>
        <button
          className="btn btn-primary"
          onClick={() => {
            resetForm()
            setEditingTask(null)
            setShowModal(true)
          }}
        >
          Add New Task
        </button>
      </div>

      <div className="card">
        <table className="table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Status</th>
              <th>Priority</th>
              <th>Due Date</th>
              <th>Assigned To</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => (
              <tr key={task._id}>
                <td>{task.title}</td>
                <td>
                  <span className={getStatusBadge(task.status)}>{task.status.replace("_", " ")}</span>
                </td>
                <td>
                  <span className={getPriorityBadge(task.priority)}>{task.priority}</span>
                </td>
                <td>{new Date(task.dueDate).toLocaleDateString()}</td>
                <td>{task.assignedTo?.name}</td>
                <td>
                  <button className="btn btn-secondary" onClick={() => handleEdit(task)} style={{ marginRight: "5px" }}>
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
              <h3>{editingTask ? "Edit Task" : "Add New Task"}</h3>
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
                <label>Description:</label>
                <textarea
                  className="form-control"
                  rows="3"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Status:</label>
                <select
                  className="form-control"
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                >
                  <option value="pending">Pending</option>
                  <option value="in_progress">In Progress</option>
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
              <div className="form-group">
                <label>Due Date:</label>
                <input
                  type="date"
                  className="form-control"
                  value={formData.dueDate}
                  onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                  required
                />
              </div>
              <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingTask ? "Update" : "Create"} Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Tasks
