const express = require("express")
const Lead = require("../models/Lead")
const Deal = require("../models/Deal")
const Contact = require("../models/Contact")
const Account = require("../models/Account")
const Project = require("../models/Project")
const Ticket = require("../models/Ticket")
const User = require("../models/User")
const { protect, authorize } = require("../middleware/auth")

const router = express.Router()

// @desc    Get dashboard analytics
// @route   GET /api/analytics/dashboard
// @access  Private
router.get("/dashboard", protect, async (req, res) => {
  try {
    const { period = "30" } = req.query
    const days = Number.parseInt(period)
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

    // Base query for user role filtering
    const getUserQuery = () => {
      if (req.user.role === "sales_executive") {
        return { assignedTo: req.user._id }
      }
      return {}
    }

    // Get counts
    const [
      totalLeads,
      totalDeals,
      totalContacts,
      totalAccounts,
      totalProjects,
      totalTickets,
      recentLeads,
      recentDeals,
      wonDeals,
      lostDeals,
      activeProjects,
      completedProjects,
    ] = await Promise.all([
      Lead.countDocuments(getUserQuery()),
      Deal.countDocuments(getUserQuery()),
      Contact.countDocuments(getUserQuery()),
      Account.countDocuments(getUserQuery()),
      Project.countDocuments(getUserQuery()),
      Ticket.countDocuments(getUserQuery()),
      Lead.countDocuments({ ...getUserQuery(), createdAt: { $gte: startDate } }),
      Deal.countDocuments({ ...getUserQuery(), createdAt: { $gte: startDate } }),
      Deal.countDocuments({ ...getUserQuery(), stage: "won" }),
      Deal.countDocuments({ ...getUserQuery(), stage: "lost" }),
      Project.countDocuments({ ...getUserQuery(), status: "active" }),
      Project.countDocuments({ ...getUserQuery(), status: "completed" }),
    ])

    // Calculate revenue
    const revenueData = await Deal.aggregate([
      { $match: { ...getUserQuery(), stage: "won" } },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$value" },
          avgDealSize: { $avg: "$value" },
        },
      },
    ])

    // Lead conversion rate
    const convertedLeads = await Lead.countDocuments({ ...getUserQuery(), status: "converted" })
    const conversionRate = totalLeads > 0 ? ((convertedLeads / totalLeads) * 100).toFixed(2) : 0

    // Deal win rate
    const totalClosedDeals = wonDeals + lostDeals
    const winRate = totalClosedDeals > 0 ? ((wonDeals / totalClosedDeals) * 100).toFixed(2) : 0

    // Monthly trends
    const monthlyTrends = await Deal.aggregate([
      { $match: getUserQuery() },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          count: { $sum: 1 },
          revenue: { $sum: { $cond: [{ $eq: ["$stage", "won"] }, "$value", 0] } },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
      { $limit: 12 },
    ])

    res.json({
      success: true,
      data: {
        overview: {
          totalLeads,
          totalDeals,
          totalContacts,
          totalAccounts,
          totalProjects,
          totalTickets,
          recentLeads,
          recentDeals,
        },
        performance: {
          totalRevenue: revenueData[0]?.totalRevenue || 0,
          avgDealSize: revenueData[0]?.avgDealSize || 0,
          conversionRate: Number.parseFloat(conversionRate),
          winRate: Number.parseFloat(winRate),
          wonDeals,
          lostDeals,
          activeProjects,
          completedProjects,
        },
        trends: monthlyTrends,
      },
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
    })
  }
})

// @desc    Get sales analytics
// @route   GET /api/analytics/sales
// @access  Private
router.get("/sales", protect, authorize("admin", "super_admin", "sales_manager"), async (req, res) => {
  try {
    // Sales by user
    const salesByUser = await Deal.aggregate([
      { $match: { stage: "won" } },
      {
        $group: {
          _id: "$assignedTo",
          totalRevenue: { $sum: "$value" },
          dealCount: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: "$user" },
      {
        $project: {
          userName: "$user.name",
          totalRevenue: 1,
          dealCount: 1,
        },
      },
      { $sort: { totalRevenue: -1 } },
    ])

    // Pipeline performance
    const pipelinePerformance = await Deal.aggregate([
      {
        $group: {
          _id: "$stage",
          count: { $sum: 1 },
          totalValue: { $sum: "$value" },
          avgValue: { $avg: "$value" },
        },
      },
    ])

    res.json({
      success: true,
      data: {
        salesByUser,
        pipelinePerformance,
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
