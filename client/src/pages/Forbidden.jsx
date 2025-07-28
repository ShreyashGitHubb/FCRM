import { Link } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

const Forbidden = () => {
  const { user } = useAuth()

  return (
    <div style={{ 
      display: "flex", 
      flexDirection: "column", 
      alignItems: "center", 
      justifyContent: "center", 
      minHeight: "100vh",
      textAlign: "center",
      padding: "20px"
    }}>
      <div style={{ fontSize: "120px", marginBottom: "20px" }}>🚫</div>
      <h1 style={{ fontSize: "2.5rem", marginBottom: "10px", color: "#dc3545" }}>
        Access Denied
      </h1>
      <p style={{ fontSize: "1.2rem", marginBottom: "30px", color: "#6c757d" }}>
        Sorry, you don't have permission to access this page.
      </p>
      
      {user && (
        <div style={{ 
          backgroundColor: "#f8f9fa", 
          padding: "20px", 
          borderRadius: "8px", 
          marginBottom: "30px",
          border: "1px solid #dee2e6"
        }}>
          <p style={{ margin: "0 0 10px 0", fontWeight: "bold" }}>
            Current User: {user.name} ({user.role})
          </p>
          <p style={{ margin: "0", fontSize: "0.9rem", color: "#6c757d" }}>
            Contact your administrator if you believe this is an error.
          </p>
        </div>
      )}
      
      <div style={{ display: "flex", gap: "15px", flexWrap: "wrap", justifyContent: "center" }}>
        <Link 
          to="/" 
          style={{
            padding: "12px 24px",
            backgroundColor: "#007bff",
            color: "white",
            textDecoration: "none",
            borderRadius: "6px",
            fontWeight: "bold"
          }}
        >
          Go to Dashboard
        </Link>
        <button 
          onClick={() => window.history.back()}
          style={{
            padding: "12px 24px",
            backgroundColor: "#6c757d",
            color: "white",
            border: "none",
            borderRadius: "6px",
            fontWeight: "bold",
            cursor: "pointer"
          }}
        >
          Go Back
        </button>
      </div>
    </div>
  )
}

export default Forbidden
