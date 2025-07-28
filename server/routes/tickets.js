const express = require("express")
const Ticket = require("../models/Ticket")
const { protect, authorize } = require("../middleware/auth")

const router = express.Router()

// @desc    Get all tickets
// @route   GET /api/tickets
// @access  Private
router.get("/", protect, async (req, res) => {
  try {
    const query = {}

    // Customers can only see their own tickets
    if (req.user.role === "customer") {
      query.customer = req.user._id
    }
    // Support agents can see assigned tickets
    else if (req.user.role === "support_agent") {
      query.assignedTo = req.user._id
    }

    const tickets = await Ticket.find(query)
      .populate("customer", "name email")
      .populate("assignedTo", "name email")
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 })

    res.json({
      success: true,
      count: tickets.length,
      data: tickets,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
    })
  }
})

// @desc    Create new ticket
// @route   POST /api/tickets
// @access  Private
router.post("/", protect, async (req, res) => {
  try {
    req.body.createdBy = req.user._id
    if (req.user.role === "customer") {
      req.body.customer = req.user._id
    }
    const ticket = await Ticket.create(req.body)
    res.status(201).json(ticket)
  } catch (error) {
    console.error(error) // Add this line
    res.status(500).json({ message: error.message })
  }
})

// @desc    Update ticket
// @route   PUT /api/tickets/:id
// @access  Private
router.put("/:id", protect, async (req, res) => {
  try {
    let ticket = await Ticket.findById(req.params.id)

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: "Ticket not found",
      })
    }

    // Check permissions
    if (req.user.role === "customer" && ticket.customer.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this ticket",
      })
    }

    // Set resolved/closed dates
    if (req.body.status === "resolved" && !ticket.resolvedAt) {
      req.body.resolvedAt = new Date()
    }
    if (req.body.status === "closed" && !ticket.closedAt) {
      req.body.closedAt = new Date()
    }

    ticket = await Ticket.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })
      .populate("customer", "name email")
      .populate("assignedTo", "name email")
      .populate("createdBy", "name email")

    res.json({
      success: true,
      data: ticket,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
    })
  }
})

module.exports = router
