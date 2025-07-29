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
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        padding: "20px",
      }}
    >
      <div className="card" style={{ width: "100%", maxWidth: "480px" }}>
        <div className="card-header" style={{ textAlign: "center" }}>
          <div style={{ fontSize: "3rem", marginBottom: "16px" }}>🚀</div>
          <h2 className="card-title" style={{ margin: "0 0 8px 0" }}>Create Account</h2>
          <p style={{ color: "var(--text-secondary)", margin: 0 }}>
            Join our CRM platform today
          </p>
        </div>

        <div className="card-body">
          {error && (
            <div className="alert alert-danger">
              <span>⚠️</span>
              {error}
            </div>
          )}
          {success && (
            <div className="alert alert-success">
              <span>✅</span>
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>👤 Full Name</label>
              <input
                type="text"
                name="name"
                className="form-control"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={handleChange}
                required
                disabled={isSubmitting}
              />
            </div>

            <div className="form-group">
              <label>📧 Email Address</label>
              <input
                type="email"
                name="email"
                className="form-control"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                required
                disabled={isSubmitting}
              />
            </div>

            <div className="form-group">
              <label>🔒 Password</label>
              <input
                type="password"
                name="password"
                className="form-control"
                placeholder="Create a strong password"
                value={formData.password}
                onChange={handleChange}
                required
                disabled={isSubmitting}
              />
            </div>

            <div className="form-group">
              <label>💼 Role</label>
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
              <span>🎯</span>
              {isSubmitting ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          <div style={{
            textAlign: "center",
            marginTop: "24px",
            paddingTop: "24px",
            borderTop: "1px solid var(--border-color)"
          }}>
            <p style={{ color: "var(--text-secondary)", margin: 0 }}>
              Already have an account?{" "}
              <Link
                to="/login"
                style={{
                  color: "var(--primary-color)",
                  textDecoration: "none",
                  fontWeight: "600"
                }}
              >
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Register
