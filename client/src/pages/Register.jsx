"use client"

import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "sales_executive",
  })
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { register, isAuthenticated, loading } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/")
    }
  }, [isAuthenticated, navigate])

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    setIsSubmitting(true)

    try {
      const result = await register(formData.name, formData.email, formData.password, formData.role)
      if (result.success) {
        setSuccess("Registration successful! Your account is pending approval. You will be able to login once an administrator approves your account.")
        setFormData({
          name: "",
          email: "",
          password: "",
          role: "sales_executive",
        })
      } else {
        setError(result.message)
      }
    } catch (error) {
      setError("An error occurred during registration. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) {
    return <div className="loading">Loading...</div>
  }

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        background: "#f5f5f5",
      }}
    >
      <div className="card" style={{ width: "400px" }}>
        <h2 style={{ textAlign: "center", marginBottom: "30px" }}>Register for CRM</h2>

        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Name:</label>
            <input
              type="text"
              name="name"
              className="form-control"
              value={formData.name}
              onChange={handleChange}
              required
              disabled={isSubmitting}
            />
          </div>

          <div className="form-group">
            <label>Email:</label>
            <input
              type="email"
              name="email"
              className="form-control"
              value={formData.email}
              onChange={handleChange}
              required
              disabled={isSubmitting}
            />
          </div>

          <div className="form-group">
            <label>Password:</label>
            <input
              type="password"
              name="password"
              className="form-control"
              value={formData.password}
              onChange={handleChange}
              required
              disabled={isSubmitting}
            />
          </div>

          <div className="form-group">
            <label>Role:</label>
            <select 
              name="role" 
              className="form-control" 
              value={formData.role} 
              onChange={handleChange}
              disabled={isSubmitting}
            >
              <option value="sales_executive">Sales Executive</option>
              <option value="sales_manager">Sales Manager</option>
              <option value="support_agent">Support Agent</option>
              <option value="customer">Customer</option>
            </select>
          </div>

          <button 
            type="submit" 
            className="btn btn-primary" 
            style={{ width: "100%" }}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Registering..." : "Register"}
          </button>
        </form>

        <p style={{ textAlign: "center", marginTop: "20px" }}>
          Already have an account? <Link to="/login">Login here</Link>
        </p>
      </div>
    </div>
  )
}

export default Register
