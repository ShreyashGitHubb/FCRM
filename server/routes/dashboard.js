const express = require("express")
const Lead = require("../models/Lead")
const Deal = require("../models/Deal")
const Task = require("../models/Task")
const Ticket = require("../models/Ticket")
const User = require("../models/User")
const { protect } = require("../middleware/auth")

const router = express.Router()

// @desc    Get dashboard stats
// @route   GET /api/dashboard
// @access  Private
router.get("/", protect, async (req, res) => {
  try {
    let stats = {}
    const userRole = req.user.role
    const userId = req.user._id

    // Common stats for all roles
    if (userRole === "sales_executive") {
      // Sales Executive Dashboard
      const leads = await Lead.countDocuments({ assignedTo: userId })
      const deals = await Deal.countDocuments({ assignedTo: userId })
      const wonDeals = await Deal.countDocuments({ assignedTo: userId, stage: "won" })
      const tasks = await Task.countDocuments({ assignedTo: userId, status: { $ne: "completed" } })

      const totalDealValue = await Deal.aggregate([
        { $match: { assignedTo: userId, stage: "won" } },
        { $group: { _id: null, total: { $sum: "$value" } } },
      ])

      stats = {
        leads,
        deals,
        wonDeals,
        pendingTasks: tasks,
        totalRevenue: totalDealValue[0]?.total || 0,
      }
    } else if (userRole === "sales_manager" || userRole === "admin" || userRole === "super_admin") {
      // Manager/Admin Dashboard
      const leads = await Lead.countDocuments()
      const deals = await Deal.countDocuments()
      const wonDeals = await Deal.countDocuments({ stage: "won" })
      const users = await User.countDocuments()
      const tickets = await Ticket.countDocuments({ status: { $ne: "closed" } })

      const totalDealValue = await Deal.aggregate([
        { $match: { stage: "won" } },
        { $group: { _id: null, total: { $sum: "$value" } } },
      ])

      stats = {
        leads,
        deals,
        wonDeals,
        users,
        openTickets: tickets,
        totalRevenue: totalDealValue[0]?.total || 0,
      }
    } else if (userRole === "support_agent") {
      // Support Agent Dashboard
      const assignedTickets = await Ticket.countDocuments({ assignedTo: userId })
      const openTickets = await Ticket.countDocuments({ assignedTo: userId, status: "open" })
      const resolvedTickets = await Ticket.countDocuments({ assignedTo: userId, status: "resolved" })
      const tasks = await Task.countDocuments({ assignedTo: userId, status: { $ne: "completed" } })

      stats = {
        assignedTickets,
        openTickets,
        resolvedTickets,
        pendingTasks: tasks,
      }
    } else if (userRole === "customer") {
      // Customer Dashboard
      const myTickets = await Ticket.countDocuments({ customer: userId })
      const openTickets = await Ticket.countDocuments({ customer: userId, status: { $in: ["open", "in_progress"] } })
      const resolvedTickets = await Ticket.countDocuments({ customer: userId, status: "resolved" })

      stats = {
        myTickets,
        openTickets,
        resolvedTickets,
      }
    }

    res.json({
      success: true,
      data: stats,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
    })
  }
})

module.exports = router
