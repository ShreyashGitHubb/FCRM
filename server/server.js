const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const dotenv = require("dotenv")

// Load env vars
dotenv.config()

// Route files
const authRoutes = require("./routes/auth")
const userRoutes = require("./routes/users")
const leadRoutes = require("./routes/leads")
const dealRoutes = require("./routes/deals")
const taskRoutes = require("./routes/tasks")
const ticketRoutes = require("./routes/tickets")
const dashboardRoutes = require("./routes/dashboard")
const portalRoutes = require("./routes/portal")
const contactRoutes = require("./routes/contacts")
const accountRoutes = require("./routes/accounts")
const projectRoutes = require("./routes/projects")
const analyticsRoutes = require("./routes/analytics")
const reportsRoutes = require("./routes/reports")
const importExportRoutes = require("./routes/import-export")
const emailRoutes = require("./routes/email")
const callLogRoutes = require("./routes/call-logs")
const auditLogRoutes = require("./routes/audit-logs")
const pipelineRoutes = require("./routes/pipelines")

const app = express()

// Body parser
app.use(express.json())

// Enable CORS
app.use(cors())

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err))

// Mount routers
app.use("/api/auth", authRoutes)
app.use("/api/users", userRoutes)
app.use("/api/leads", leadRoutes)
app.use("/api/deals", dealRoutes)
app.use("/api/tasks", taskRoutes)
app.use("/api/tickets", ticketRoutes)
app.use("/api/dashboard", dashboardRoutes)
app.use("/api/portal", portalRoutes)
app.use("/api/contacts", contactRoutes)
app.use("/api/accounts", accountRoutes)
app.use("/api/projects", projectRoutes)
app.use("/api/analytics", analyticsRoutes)
app.use("/api/reports", reportsRoutes)
app.use("/api/import-export", importExportRoutes)
app.use("/api/email", emailRoutes)
app.use("/api/call-logs", callLogRoutes)
app.use("/api/audit-logs", auditLogRoutes)
app.use("/api/pipelines", pipelineRoutes)

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({
    success: false,
    message: "Server Error",
  })
})

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
