const express = require("express")
const AuditLog = require("../models/AuditLog")
const { protect, authorize } = require("../middleware/auth")

const router = express.Router()

// @desc    Get audit logs
// @route   GET /api/audit-logs
// @access  Private (Admin only)
router.get("/", protect, authorize("admin", "super_admin"), async (req, res) => {
  try {
    const { page = 1, limit = 50, resource, action, user } = req.query

    const query = {}
    if (resource) query.resource = resource
    if (action) query.action = action
    if (user) query.user = user

    const auditLogs = await AuditLog.find(query)
      .populate("user", "name email")
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)

    const total = await AuditLog.countDocuments(query)

    res.json({
      success: true,
      count: auditLogs.length,
      total,
      pages: Math.ceil(total / limit),
      currentPage: page,
      data: auditLogs,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
    })
  }
})

module.exports = router
