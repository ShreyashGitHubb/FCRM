const express = require("express")
const CallLog = require("../models/CallLog")
const { protect } = require("../middleware/auth")

const router = express.Router()

// @desc    Get all call logs
// @route   GET /api/call-logs
// @access  Private
router.get("/", protect, async (req, res) => {
  try {
    const query = {}

    // Filter by user role
    if (req.user.role === "sales_executive" || req.user.role === "support_agent") {
      query.user = req.user._id
    }

    const callLogs = await CallLog.find(query)
      .populate("contact", "firstName lastName email")
      .populate("deal", "title value")
      .populate("user", "name email")
      .sort({ createdAt: -1 })

    res.json({
      success: true,
      count: callLogs.length,
      data: callLogs,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
    })
  }
})

// @desc    Create new call log
// @route   POST /api/call-logs
// @access  Private
router.post("/", protect, async (req, res) => {
  try {
    req.body.user = req.user._id

    const callLog = await CallLog.create(req.body)

    await callLog.populate("contact", "firstName lastName email")
    await callLog.populate("deal", "title value")
    await callLog.populate("user", "name email")

    res.status(201).json({
      success: true,
      data: callLog,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
    })
  }
})

// @desc    Update call log
// @route   PUT /api/call-logs/:id
// @access  Private
router.put("/:id", protect, async (req, res) => {
  try {
    let callLog = await CallLog.findById(req.params.id)

    if (!callLog) {
      return res.status(404).json({
        success: false,
        message: "Call log not found",
      })
    }

    // Check if user can update this call log
    if (
      callLog.user.toString() !== req.user._id.toString() &&
      req.user.role !== "admin" &&
      req.user.role !== "super_admin"
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this call log",
      })
    }

    callLog = await CallLog.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })
      .populate("contact", "firstName lastName email")
      .populate("deal", "title value")
      .populate("user", "name email")

    res.json({
      success: true,
      data: callLog,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
    })
  }
})

module.exports = router
