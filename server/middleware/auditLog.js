const AuditLog = require("../models/AuditLog")

// Middleware to log user activities
const logActivity = (action, resource) => {
  return async (req, res, next) => {
    // Store original json method
    const originalJson = res.json

    // Override json method to capture response
    res.json = function (data) {
      // Log activity after successful operation
      if (data.success && req.user) {
        const logData = {
          user: req.user._id,
          action,
          resource,
          resourceId: data.data?._id || req.params.id,
          details: {
            method: req.method,
            url: req.originalUrl,
            body: req.body,
          },
          ipAddress: req.ip || req.connection.remoteAddress,
          userAgent: req.get("User-Agent"),
        }

        // Don't wait for audit log to complete
        AuditLog.create(logData).catch((err) => {
          console.error("Audit log error:", err)
        })
      }

      // Call original json method
      return originalJson.call(this, data)
    }

    next()
  }
}

module.exports = { logActivity }
