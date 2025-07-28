const express = require("express")
const Ticket = require("../models/Ticket")
const { protect, authorize } = require("../middleware/auth")

const router = express.Router()

// @desc    Get customer portal data
// @route   GET /api/portal
// @access  Private/Customer
router.get("/", protect, authorize("customer"), async (req, res) => {
  try {
    const tickets = await Ticket.find({ customer: req.user._id })
      .populate("assignedTo", "name email")
      .sort({ createdAt: -1 })

    res.json({
      success: true,
      data: {
        tickets,
        customer: {
          name: req.user.name,
          email: req.user.email,
        },
      },
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
    })
  }
})

module.exports = router
