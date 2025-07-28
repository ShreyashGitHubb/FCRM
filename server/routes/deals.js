const express = require("express")
const Deal = require("../models/Deal")
const { protect } = require("../middleware/auth")

const router = express.Router()

// @desc    Get all deals
// @route   GET /api/deals
// @access  Private
router.get("/", protect, async (req, res) => {
  try {
    const query = {}

    // Sales executives can only see their assigned deals
    if (req.user.role === "sales_executive") {
      query.assignedTo = req.user._id
    }

    const deals = await Deal.find(query)
      .populate("assignedTo", "name email")
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 })

    res.json({
      success: true,
      count: deals.length,
      data: deals,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
    })
  }
})

// @desc    Get single deal
// @route   GET /api/deals/:id
// @access  Private
router.get("/:id", protect, async (req, res) => {
  try {
    const deal = await Deal.findById(req.params.id)
      .populate("assignedTo", "name email")
      .populate("createdBy", "name email")

    if (!deal) {
      return res.status(404).json({
        success: false,
        message: "Deal not found",
      })
    }

    // Check if user can access this deal
    if (req.user.role === "sales_executive" && deal.assignedTo._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to access this deal",
      })
    }

    res.json({
      success: true,
      data: deal,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
    })
  }
})

// @desc    Create new deal
// @route   POST /api/deals
// @access  Private
router.post("/", protect, async (req, res) => {
  try {
    req.body.createdBy = req.user._id

    // If no assignedTo is provided, assign to creator
    if (!req.body.assignedTo) {
      req.body.assignedTo = req.user._id
    }

    const deal = await Deal.create(req.body)

    await deal.populate("assignedTo", "name email")
    await deal.populate("createdBy", "name email")

    res.status(201).json({
      success: true,
      data: deal,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
    })
  }
})

// @desc    Update deal
// @route   PUT /api/deals/:id
// @access  Private
router.put("/:id", protect, async (req, res) => {
  try {
    let deal = await Deal.findById(req.params.id)

    if (!deal) {
      return res.status(404).json({
        success: false,
        message: "Deal not found",
      })
    }

    // Check if user can update this deal
    if (req.user.role === "sales_executive" && deal.assignedTo.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this deal",
      })
    }

    // Set actual close date if deal is won or lost
    if ((req.body.stage === "won" || req.body.stage === "lost") && !deal.actualCloseDate) {
      req.body.actualCloseDate = new Date()
    }

    deal = await Deal.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })
      .populate("assignedTo", "name email")
      .populate("createdBy", "name email")

    res.json({
      success: true,
      data: deal,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
    })
  }
})

module.exports = router
