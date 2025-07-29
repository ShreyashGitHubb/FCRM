"use client"
import { Link, useLocation } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { usePermissions } from "../hooks/usePermissions"
import { canApproveUsers } from "../permissions/rolePermissions"

const Layout = ({ children }) => {
  const { user, logout } = useAuth()
  const { canAccess } = usePermissions()
  const location = useLocation()

  const getNavItems = () => {
    const allItems = [
      {
        path: "/",
        label: "Dashboard",
        icon: "📊",
      },
      {
        path: "/leads",
        label: "Leads",
        icon: "🎯",
      },
      {
        path: "/deals",
        label: "Deals",
        icon: "💰",
      },
      {
        path: "/contacts",
        label: "Contacts",
        icon: "👤",
      },
      {
        path: "/accounts",
        label: "Accounts",
        icon: "🏢",
      },
      {
        path: "/projects",
        label: "Projects",
        icon: "📋",
      },
      {
        path: "/tasks",
        label: "Tasks",
        icon: "✅",
      },
      {
        path: "/tickets",
        label: "Tickets",
        icon: "🎫",
      },
      {
        path: "/email-center",
        label: "Email Center",
        icon: "📧",
      },
      {
        path: "/import-export",
        label: "Import/Export",
        icon: "📤",
      },
      {
        path: "/users",
        label: "Users",
        icon: "👥",
      },
      {
        path: "/portal",
        label: "Portal",
        icon: "🌐",
      },
    ]

    // Add admin dashboard for admin and superadmin
    if (user?.role === "admin" || user?.role === "super_admin") {
      allItems.push({
        path: "/admin-dashboard",
        label: "Admin Dashboard",
        icon: "📈",
      })
    }

    // Add pending approvals for admin and superadmin
    if (canApproveUsers(user?.role)) {
      allItems.push({
        path: "/pending-approvals",
        label: "Pending Approvals",
        icon: "⏳",
      })
    }

    // Filter items based on user permissions
    return allItems.filter((item) => canAccess(item.path))
  }

  const navItems = getNavItems()

  return (
    <div style={{ display: "flex" }}>
      <div className="sidebar">
        <div className="sidebar-header">
          <h3>🏢 CRM System</h3>
          <p>
            {user?.name} • {user?.role?.replace("_", " ").toUpperCase()}
          </p>
        </div>
        <ul className="sidebar-nav">
          {navItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={location.pathname === item.path ? "active" : ""}
              >
                <span>{item.icon}</span>
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
        {navItems.length === 0 && (
          <div style={{ padding: "32px 20px", textAlign: "center" }}>
            <div className="empty-state">
              <div className="empty-state-icon">🚫</div>
              <div className="empty-state-title">No Access</div>
              <div className="empty-state-description">
                No navigation items available for your role. Contact your administrator for access.
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="main-content">
        <div className="header">
          <div>
            <h2>Welcome back, {user?.name}! 👋</h2>
            <p style={{ margin: "4px 0 0 0", color: "var(--text-secondary)", fontSize: "0.875rem" }}>
              {new Date().toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          </div>
          <button className="btn btn-secondary" onClick={logout}>
            <span>🚪</span>
            Logout
          </button>
        </div>
        <div className="page-container">
          {children}
        </div>
      </div>
    </div>
  )
}

export default Layout
