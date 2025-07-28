const express = require("express")
const Lead = require("../models/Lead")
const { protect, authorize } = require("../middleware/auth")

const router = express.Router()

// @desc    Get all leads
// @route   GET /api/leads
// @access  Private
router.get("/", protect, async (req, res) => {
  try {
    const query = {}

    // Sales executives can only see their assigned leads
    if (req.user.role === "sales_executive") {
      query.assignedTo = req.user._id
    }

    const leads = await Lead.find(query)
      .populate("assignedTo", "name email")
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 })

    res.json({
      success: true,
      count: leads.length,
      data: leads,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
    })
  }
})

// @desc    Get single lead
// @route   GET /api/leads/:id
// @access  Private
router.get("/:id", protect, async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id)
      .populate("assignedTo", "name email")
      .populate("createdBy", "name email")

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: "Lead not found",
      })
    }

    // Check if user can access this lead
    if (req.user.role === "sales_executive" && lead.assignedTo._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to access this lead",
      })
    }

    res.json({
      success: true,
      data: lead,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
    })
  }
})

// @desc    Create new lead
// @route   POST /api/leads
// @access  Private
router.post("/", protect, async (req, res) => {
  try {
    req.body.createdBy = req.user._id

    // If no assignedTo is provided, assign to creator
    if (!req.body.assignedTo) {
      req.body.assignedTo = req.user._id
    }

    const lead = await Lead.create(req.body)

    await lead.populate("assignedTo", "name email")
    await lead.populate("createdBy", "name email")

    res.status(201).json({
      success: true,
      data: lead,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
    })
  }
})

// @desc    Update lead
// @route   PUT /api/leads/:id
// @access  Private
router.put("/:id", protect, async (req, res) => {
  try {
    let lead = await Lead.findById(req.params.id)

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: "Lead not found",
      })
    }

    // Check if user can update this lead
    if (req.user.role === "sales_executive" && lead.assignedTo.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this lead",
      })
    }

    lead = await Lead.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })
      .populate("assignedTo", "name email")
      .populate("createdBy", "name email")

    res.json({
      success: true,
      data: lead,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
    })
  }
})

// @desc    Delete lead
// @route   DELETE /api/leads/:id
// @access  Private
router.delete("/:id", protect, authorize("admin", "super_admin", "sales_manager"), async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id)

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: "Lead not found",
      })
    }

    await lead.deleteOne()

    res.json({
      success: true,
      message: "Lead deleted successfully",
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
    })
  }
})

module.exports = router
