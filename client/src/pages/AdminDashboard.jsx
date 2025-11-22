import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import API from "../utils/API";

const AdminDashboard = () => {
  const { user } = useAuth();

  const [analytics, setAnalytics] = useState(null);
  const [sales, setSales] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [activeTab, setActiveTab] = useState("overview");

  // -----------------------------
  // FETCH DASHBOARD ANALYTICS
  // -----------------------------
  const fetchAnalytics = async () => {
    try {
      const res = await API.get("/api/analytics/dashboard");
      setAnalytics(res.data.data);
    } catch (err) {
      console.error("Analytics Fetch Error:", err);
      setError("Failed to load dashboard analytics");
    }
  };

  // -----------------------------
  // FETCH SALES ANALYTICS
  // -----------------------------
  const fetchSalesAnalytics = async () => {
    try {
      const res = await API.get("/api/analytics/sales");
      setSales(res.data.data || []);
    } catch (err) {
      console.error("Sales Fetch Error:", err);
      setError("Failed to load sales analytics");
    }
  };

  // -----------------------------
  // FETCH AUDIT LOGS
  // -----------------------------
  const fetchAuditLogs = async () => {
    try {
      const res = await API.get("/api/audit/logs");
      setAuditLogs(res.data.logs || []);
    } catch (err) {
      console.error("Audit Log Fetch Error:", err);
      setError("Failed to load audit logs");
    }
  };

  // -----------------------------
  // INITIAL FETCH
  // -----------------------------
  useEffect(() => {
    const loadAll = async () => {
      setLoading(true);
      await Promise.all([
        fetchAnalytics(),
        fetchSalesAnalytics(),
        fetchAuditLogs()
      ]);
      setLoading(false);
    };

    loadAll();
  }, []);

  if (loading) {
    return (
      <div className="loading-screen">
        <h2>Loading Dashboard...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-screen">
        <h2>Error</h2>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">

      <h1>Admin Dashboard</h1>
      <p>Welcome, {user?.name || "Admin"} 👋</p>

      {/* ------------------------- */}
      {/*   TAB NAVIGATION          */}
      {/* ------------------------- */}
      <div className="tabs">
        <button
          className={activeTab === "overview" ? "active" : ""}
          onClick={() => setActiveTab("overview")}
        >
          Overview
        </button>
        <button
          className={activeTab === "sales" ? "active" : ""}
          onClick={() => setActiveTab("sales")}
        >
          Sales
        </button>
        <button
          className={activeTab === "audit" ? "active" : ""}
          onClick={() => setActiveTab("audit")}
        >
          Audit Logs
        </button>
      </div>

      {/* ------------------------- */}
      {/*   OVERVIEW TAB            */}
      {/* ------------------------- */}
      {activeTab === "overview" && (
        <div className="overview-cards">

          <div className="card">
            <h3>Total Revenue</h3>
            <p>
              ₹
              {analytics?.performance?.totalRevenue?.toLocaleString() ||
                "0"}
            </p>
          </div>

          <div className="card">
            <h3>Total Users</h3>
            <p>{analytics?.users?.total || 0}</p>
          </div>

          <div className="card">
            <h3>Total Orders</h3>
            <p>{analytics?.performance?.totalOrders || 0}</p>
          </div>
        </div>
      )}

      {/* ------------------------- */}
      {/*   SALES TAB               */}
      {/* ------------------------- */}
      {activeTab === "sales" && (
        <div>
          <h2>Sales Analytics</h2>
          {sales.length === 0 ? (
            <p>No sales data found.</p>
          ) : (
            <ul>
              {sales.map((item, index) => (
                <li key={index}>
                  <strong>{item.productName}</strong> — ₹{item.revenue}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* ------------------------- */}
      {/*   AUDIT TAB               */}
      {/* ------------------------- */}
      {activeTab === "audit" && (
        <div>
          <h2>Audit Logs</h2>
          {auditLogs.length === 0 ? (
            <p>No audit logs available.</p>
          ) : (
            <ul>
              {auditLogs.map((log, index) => (
                <li key={index}>
                  <strong>{log.action}</strong> — {log.user} at{" "}
                  {new Date(log.timestamp).toLocaleString()}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;


// "use client"

// import { useState, useEffect } from "react"
// import API from "../utils/axios"
// import { useAuth } from "../context/AuthContext"

// const AdminDashboard = () => {
//   const { user } = useAuth()
//   const [analytics, setAnalytics] = useState(null)
//   const [salesAnalytics, setSalesAnalytics] = useState(null)
//   const [auditLogs, setAuditLogs] = useState([])
//   const [loading, setLoading] = useState(true)
//   const [activeTab, setActiveTab] = useState("overview")

//   useEffect(() => {
//     fetchAnalytics()
//     fetchSalesAnalytics()
//     fetchAuditLogs()
//   }, [])

//   const fetchAnalytics = async () => {
//     try {
//       const res = await API.get("/api/analytics/dashboard")
//       setAnalytics(res.data.data)
//     } catch (error) {
//       console.error("Error fetching analytics:", error)
//     }
//   }

//   const fetchSalesAnalytics = async () => {
//     try {
//       const res = await API.get("/api/analytics/sales")
//       setSalesAnalytics(res.data.data)
//     } catch (error) {
//       console.error("Error fetching sales analytics:", error)
//     }
//   }

//   const fetchAuditLogs = async () => {
//     try {
//       const res = await API.get("/api/audit-logs?limit=20")
//       setAuditLogs(res.data.data)
//       setLoading(false)
//     } catch (error) {
//       console.error("Error fetching audit logs:", error)
//       setLoading(false)
//     }
//   }

//   if (loading) {
//     return <div className="loading">Loading dashboard...</div>
//   }

//   return (
//     <div>
//       <h1>Admin Dashboard</h1>

//       <div className="tabs">
//         <button
//           className={`tab ${activeTab === "overview" ? "active" : ""}`}
//           onClick={() => setActiveTab("overview")}
//         >
//           Overview
//         </button>

//         <button
//           className={`tab ${activeTab === "sales" ? "active" : ""}`}
//           onClick={() => setActiveTab("sales")}
//         >
//           Sales Analytics
//         </button>

//         <button
//           className={`tab ${activeTab === "audit" ? "active" : ""}`}
//           onClick={() => setActiveTab("audit")}
//         >
//           Audit Logs
//         </button>
//       </div>

//       {activeTab === "overview" && analytics && (
//         <div>
//           <div className="dashboard-grid">
//             <div className="card">
//               <h3>Total Records</h3>
//               <div className="stats-grid">
//                 <div className="stat">
//                   <span className="stat-number">{analytics.overview.totalLeads}</span>
//                   <span className="stat-label">Leads</span>
//                 </div>
//                 <div className="stat">
//                   <span className="stat-number">{analytics.overview.totalDeals}</span>
//                   <span className="stat-label">Deals</span>
//                 </div>
//                 <div className="stat">
//                   <span className="stat-number">{analytics.overview.totalContacts}</span>
//                   <span className="stat-label">Contacts</span>
//                 </div>
//                 <div className="stat">
//                   <span className="stat-number">{analytics.overview.totalAccounts}</span>
//                   <span className="stat-label">Accounts</span>
//                 </div>
//               </div>
//             </div>

//             <div className="card">
//               <h3>Performance Metrics</h3>
//               <div className="stats-grid">
//                 <div className="stat">
//                   <span className="stat-number">
//                     ${analytics.performance.totalRevenue.toLocaleString()}
//                   </span>
//                   <span className="stat-label">Total Revenue</span>
//                 </div>
//                 <div className="stat">
//                   <span className="stat-number">
//                     ${analytics.performance.avgDealSize.toLocaleString()}
//                   </span>
//                   <span className="stat-label">Avg Deal Size</span>
//                 </div>
//                 <div className="stat">
//                   <span className="stat-number">
//                     {analytics.performance.conversionRate}%
//                   </span>
//                   <span className="stat-label">Conversion Rate</span>
//                 </div>
//                 <div className="stat">
//                   <span className="stat-number">
//                     {analytics.performance.winRate}%
//                   </span>
//                   <span className="stat-label">Win Rate</span>
//                 </div>
//               </div>
//             </div>

//             <div className="card">
//               <h3>Project Status</h3>
//               <div className="stats-grid">
//                 <div className="stat">
//                   <span className="stat-number">
//                     {analytics.performance.activeProjects}
//                   </span>
//                   <span className="stat-label">Active Projects</span>
//                 </div>
//                 <div className="stat">
//                   <span className="stat-number">
//                     {analytics.performance.completedProjects}
//                   </span>
//                   <span className="stat-label">Completed Projects</span>
//                 </div>
//                 <div className="stat">
//                   <span className="stat-number">
//                     {analytics.overview.totalTickets}
//                   </span>
//                   <span className="stat-label">Support Tickets</span>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {analytics.trends && analytics.trends.length > 0 && (
//             <div className="card">
//               <h3>Monthly Trends</h3>
//               <div className="chart-container">
//                 <table className="table">
//                   <thead>
//                     <tr>
//                       <th>Month</th>
//                       <th>Deals</th>
//                       <th>Revenue</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {analytics.trends.map((trend, index) => (
//                       <tr key={index}>
//                         <td>
//                           {trend._id.month}/{trend._id.year}
//                         </td>
//                         <td>{trend.count}</td>
//                         <td>${trend.revenue.toLocaleString()}</td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             </div>
//           )}
//         </div>
//       )}

//       {activeTab === "sales" && salesAnalytics && (
//         <div>
//           <div className="card">
//             <h3>Sales Performance by User</h3>
//             <table className="table">
//               <thead>
//                 <tr>
//                   <th>User</th>
//                   <th>Total Revenue</th>
//                   <th>Deals Won</th>
//                   <th>Avg Deal Size</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {salesAnalytics.salesByUser.map((user, index) => (
//                   <tr key={index}>
//                     <td>{user.userName}</td>
//                     <td>${user.totalRevenue.toLocaleString()}</td>
//                     <td>{user.dealCount}</td>
//                     <td>${(user.totalRevenue / user.dealCount).toLocaleString()}</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>

//           <div className="card">
//             <h3>Pipeline Performance</h3>
//             <table className="table">
//               <thead>
//                 <tr>
//                   <th>Stage</th>
//                   <th>Count</th>
//                   <th>Total Value</th>
//                   <th>Average Value</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {salesAnalytics.pipelinePerformance.map((stage, index) => (
//                   <tr key={index}>
//                     <td>{stage._id}</td>
//                     <td>{stage.count}</td>
//                     <td>${stage.totalValue.toLocaleString()}</td>
//                     <td>${stage.avgValue.toLocaleString()}</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       )}

//       {activeTab === "audit" && (
//         <div className="card">
//           <h3>Recent Activity</h3>
//           <table className="table">
//             <thead>
//               <tr>
//                 <th>User</th>
//                 <th>Action</th>
//                 <th>Resource</th>
//                 <th>Date</th>
//                 <th>IP Address</th>
//               </tr>
//             </thead>
//             <tbody>
//               {auditLogs.map((log) => (
//                 <tr key={log._id}>
//                   <td>{log.user?.name}</td>
//                   <td>
//                     <span
//                       className={`badge badge-${
//                         log.action === "create"
//                           ? "success"
//                           : log.action === "delete"
//                           ? "danger"
//                           : "info"
//                       }`}
//                     >
//                       {log.action}
//                     </span>
//                   </td>
//                   <td>{log.resource}</td>
//                   <td>{new Date(log.createdAt).toLocaleString()}</td>
//                   <td>{log.ipAddress}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}
//     </div>
//   )
// }

// export default AdminDashboard





// "use client"

// import { useState, useEffect } from "react"
// // import axios from "axios"
// // import axios from "../utils/axios";
// import API from "../utils/axios"
// import { useAuth } from "../context/AuthContext"

// const AdminDashboard = () => {
//   const { user } = useAuth()
//   const [analytics, setAnalytics] = useState(null)
//   const [salesAnalytics, setSalesAnalytics] = useState(null)
//   const [auditLogs, setAuditLogs] = useState([])
//   const [loading, setLoading] = useState(true)
//   const [activeTab, setActiveTab] = useState("overview")

//   useEffect(() => {
//     fetchAnalytics()
//     fetchSalesAnalytics()
//     fetchAuditLogs()
//   }, [])

//   const fetchAnalytics = async () => {
//     try {
//       const res = await API.get("/api/analytics/dashboard")
//       setAnalytics(res.data.data)
//     } catch (error) {
//       console.error("Error fetching analytics:", error)
//     }
//   }

//   const fetchSalesAnalytics = async () => {
//     try {
//       const res = await API.get("/api/analytics/sales")
//       setSalesAnalytics(res.data.data)
//     } catch (error) {
//       console.error("Error fetching sales analytics:", error)
//     }
//   }

//   const fetchAuditLogs = async () => {
//     try {
//       const res = await API.get("/api/audit-logs?limit=20")
//       setAuditLogs(res.data.data)
//       setLoading(false)
//     } catch (error) {
//       console.error("Error fetching audit logs:", error)
//       setLoading(false)
//     }
//   }

//   if (loading) {
//     return <div className="loading">Loading dashboard...</div>
//   }

//   return (
//     <div>
//       <h1>Admin Dashboard</h1>

//       <div className="tabs">
//         <button className={tab ${activeTab === "overview" ? "active" : ""}} onClick={() => setActiveTab("overview")}>
//           Overview
//         </button>
//         <button className={tab ${activeTab === "sales" ? "active" : ""}} onClick={() => setActiveTab("sales")}>
//           Sales Analytics
//         </button>
//         <button className={tab ${activeTab === "audit" ? "active" : ""}} onClick={() => setActiveTab("audit")}>
//           Audit Logs
//         </button>
//       </div>

//       {activeTab === "overview" && analytics && (
//         <div>
//           <div className="dashboard-grid">
//             <div className="card">
//               <h3>Total Records</h3>
//               <div className="stats-grid">
//                 <div className="stat">
//                   <span className="stat-number">{analytics.overview.totalLeads}</span>
//                   <span className="stat-label">Leads</span>
//                 </div>
//                 <div className="stat">
//                   <span className="stat-number">{analytics.overview.totalDeals}</span>
//                   <span className="stat-label">Deals</span>
//                 </div>
//                 <div className="stat">
//                   <span className="stat-number">{analytics.overview.totalContacts}</span>
//                   <span className="stat-label">Contacts</span>
//                 </div>
//                 <div className="stat">
//                   <span className="stat-number">{analytics.overview.totalAccounts}</span>
//                   <span className="stat-label">Accounts</span>
//                 </div>
//               </div>
//             </div>

//             <div className="card">
//               <h3>Performance Metrics</h3>
//               <div className="stats-grid">
//                 <div className="stat">
//                   <span className="stat-number">${analytics.performance.totalRevenue.toLocaleString()}</span>
//                   <span className="stat-label">Total Revenue</span>
//                 </div>
//                 <div className="stat">
//                   <span className="stat-number">${analytics.performance.avgDealSize.toLocaleString()}</span>
//                   <span className="stat-label">Avg Deal Size</span>
//                 </div>
//                 <div className="stat">
//                   <span className="stat-number">{analytics.performance.conversionRate}%</span>
//                   <span className="stat-label">Conversion Rate</span>
//                 </div>
//                 <div className="stat">
//                   <span className="stat-number">{analytics.performance.winRate}%</span>
//                   <span className="stat-label">Win Rate</span>
//                 </div>
//               </div>
//             </div>

//             <div className="card">
//               <h3>Project Status</h3>
//               <div className="stats-grid">
//                 <div className="stat">
//                   <span className="stat-number">{analytics.performance.activeProjects}</span>
//                   <span className="stat-label">Active Projects</span>
//                 </div>
//                 <div className="stat">
//                   <span className="stat-number">{analytics.performance.completedProjects}</span>
//                   <span className="stat-label">Completed Projects</span>
//                 </div>
//                 <div className="stat">
//                   <span className="stat-number">{analytics.overview.totalTickets}</span>
//                   <span className="stat-label">Support Tickets</span>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {analytics.trends && analytics.trends.length > 0 && (
//             <div className="card">
//               <h3>Monthly Trends</h3>
//               <div className="chart-container">
//                 <table className="table">
//                   <thead>
//                     <tr>
//                       <th>Month</th>
//                       <th>Deals</th>
//                       <th>Revenue</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {analytics.trends.map((trend, index) => (
//                       <tr key={index}>
//                         <td>
//                           {trend._id.month}/{trend._id.year}
//                         </td>
//                         <td>{trend.count}</td>
//                         <td>${trend.revenue.toLocaleString()}</td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             </div>
//           )}
//         </div>
//       )}

//       {activeTab === "sales" && salesAnalytics && (
//         <div>
//           <div className="card">
//             <h3>Sales Performance by User</h3>
//             <table className="table">
//               <thead>
//                 <tr>
//                   <th>User</th>
//                   <th>Total Revenue</th>
//                   <th>Deals Won</th>
//                   <th>Avg Deal Size</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {salesAnalytics.salesByUser.map((user, index) => (
//                   <tr key={index}>
//                     <td>{user.userName}</td>
//                     <td>${user.totalRevenue.toLocaleString()}</td>
//                     <td>{user.dealCount}</td>
//                     <td>${(user.totalRevenue / user.dealCount).toLocaleString()}</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>

//           <div className="card">
//             <h3>Pipeline Performance</h3>
//             <table className="table">
//               <thead>
//                 <tr>
//                   <th>Stage</th>
//                   <th>Count</th>
//                   <th>Total Value</th>
//                   <th>Average Value</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {salesAnalytics.pipelinePerformance.map((stage, index) => (
//                   <tr key={index}>
//                     <td>{stage._id}</td>
//                     <td>{stage.count}</td>
//                     <td>${stage.totalValue.toLocaleString()}</td>
//                     <td>${stage.avgValue.toLocaleString()}</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       )}

//       {activeTab === "audit" && (
//         <div className="card">
//           <h3>Recent Activity</h3>
//           <table className="table">
//             <thead>
//               <tr>
//                 <th>User</th>
//                 <th>Action</th>
//                 <th>Resource</th>
//                 <th>Date</th>
//                 <th>IP Address</th>
//               </tr>
//             </thead>
//             <tbody>
//               {auditLogs.map((log) => (
//                 <tr key={log._id}>
//                   <td>{log.user?.name}</td>
//                   <td>
//                     <span
//                       className={badge badge-${log.action === "create" ? "success" : log.action === "delete" ? "danger" : "info"}}
//                     >
//                       {log.action}
//                     </span>
//                   </td>
//                   <td>{log.resource}</td>
//                   <td>{new Date(log.createdAt).toLocaleString()}</td>
//                   <td>{log.ipAddress}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}
//     </div>
//   )
// }

// export default AdminDashboard
