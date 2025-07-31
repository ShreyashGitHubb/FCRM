const express = require('express')
const router = express.Router()
const { protect } = require('../middleware/auth')
const Lead = require('../models/Lead')
const Deal = require('../models/Deal')
const Project = require('../models/Project')
const Ticket = require('../models/Ticket')
const User = require('../models/User')
const Account = require('../models/Account')
const Contact = require('../models/Contact')
const AuditLog = require('../models/AuditLog')

// Overview statistics
router.get('/overview', protect, async (req, res) => {
  try {
    if (req.user.role !== 'admin' && req.user.role !== 'super_admin') {
      return res.status(403).json({ message: 'Access denied' })
    }

    const [
      totalLeads,
      totalDeals,
      totalProjects,
      totalTickets,
      totalRevenue,
      dealStatus,
      recentProjects
    ] = await Promise.all([
      Lead.countDocuments(),
      Deal.countDocuments(),
      Project.countDocuments(),
      Ticket.countDocuments(),
      Deal.aggregate([
        { $match: { status: 'closed_won' } },
        { $group: { _id: null, total: { $sum: '$value' } } }
      ]),
      Deal.aggregate([
        { $group: { _id: '$status', count: { $sum: 1 } } }
      ]),
      Project.find().sort({ createdAt: -1 }).limit(5).populate('account')
    ])

    const dealStatusMap = {}
    dealStatus.forEach(status => {
      dealStatusMap[status._id] = status.count
    })

    res.json({
      totalLeads,
      totalDeals,
      totalProjects,
      totalTickets,
      totalRevenue: totalRevenue[0]?.total || 0,
      dealStatus: dealStatusMap,
      recentProjects,
      avgResponseTime: 2.5 // Mock data - can be calculated from actual ticket data
    })
  } catch (error) {
    console.error('Error fetching overview stats:', error)
    res.status(500).json({ message: 'Error fetching overview statistics' })
  }
})

// Recent activity
router.get('/recent-activity', protect, async (req, res) => {
  try {
    if (req.user.role !== 'admin' && req.user.role !== 'super_admin') {
      return res.status(403).json({ message: 'Access denied' })
    }

    const recentActivity = await AuditLog.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .populate('user', 'name')

    const formattedActivity = recentActivity.map(activity => ({
      description: `${activity.user?.name || 'System'} ${activity.action} ${activity.resource}`,
      timestamp: activity.createdAt,
      type: activity.action
    }))

    res.json(formattedActivity)
  } catch (error) {
    console.error('Error fetching recent activity:', error)
    res.status(500).json({ message: 'Error fetching recent activity' })
  }
})

// Top performers
router.get('/top-performers', protect, async (req, res) => {
  try {
    if (req.user.role !== 'admin' && req.user.role !== 'super_admin') {
      return res.status(403).json({ message: 'Access denied' })
    }

    const topPerformers = await Deal.aggregate([
      { $match: { status: 'closed_won' } },
      { $group: { _id: '$assignedTo', dealsClosed: { $sum: 1 }, totalValue: { $sum: '$value' } } },
      { $sort: { dealsClosed: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user'
        }
      },
      { $unwind: '$user' }
    ])

    const formattedPerformers = topPerformers.map(performer => ({
      _id: performer._id,
      name: performer.user.name,
      role: performer.user.role,
      dealsClosed: performer.dealsClosed,
      totalValue: performer.totalValue
    }))

    res.json(formattedPerformers)
  } catch (error) {
    console.error('Error fetching top performers:', error)
    res.status(500).json({ message: 'Error fetching top performers' })
  }
})

// Conversion rates
router.get('/conversion-rates', protect, async (req, res) => {
  try {
    if (req.user.role !== 'admin' && req.user.role !== 'super_admin') {
      return res.status(403).json({ message: 'Access denied' })
    }

    const [totalLeads, qualifiedLeads, proposals, closedWon] = await Promise.all([
      Lead.countDocuments(),
      Lead.countDocuments({ status: 'qualified' }),
      Deal.countDocuments({ status: 'proposal' }),
      Deal.countDocuments({ status: 'closed_won' })
    ])

    const conversionRates = {
      lead_to_qualified: totalLeads > 0 ? Math.round((qualifiedLeads / totalLeads) * 100) : 0,
      qualified_to_proposal: qualifiedLeads > 0 ? Math.round((proposals / qualifiedLeads) * 100) : 0,
      proposal_to_closed: proposals > 0 ? Math.round((closedWon / proposals) * 100) : 0,
      overall_conversion: totalLeads > 0 ? Math.round((closedWon / totalLeads) * 100) : 0
    }

    res.json(conversionRates)
  } catch (error) {
    console.error('Error fetching conversion rates:', error)
    res.status(500).json({ message: 'Error fetching conversion rates' })
  }
})

// Revenue data
router.get('/revenue', protect, async (req, res) => {
  try {
    if (req.user.role !== 'admin' && req.user.role !== 'super_admin') {
      return res.status(403).json({ message: 'Access denied' })
    }

    const revenueData = await Deal.aggregate([
      { $match: { status: 'closed_won' } },
      {
        $group: {
          _id: {
            year: { $year: '$closedDate' },
            month: { $month: '$closedDate' }
          },
          revenue: { $sum: '$value' }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
      { $limit: 12 }
    ])

    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ]

    const formattedRevenue = revenueData.map(item => ({
      month: `${monthNames[item._id.month - 1]} ${item._id.year}`,
      revenue: item.revenue
    }))

    res.json(formattedRevenue)
  } catch (error) {
    console.error('Error fetching revenue data:', error)
    res.status(500).json({ message: 'Error fetching revenue data' })
  }
})

// Project status
router.get('/project-status', protect, async (req, res) => {
  try {
    if (req.user.role !== 'admin' && req.user.role !== 'super_admin') {
      return res.status(403).json({ message: 'Access denied' })
    }

    const projectStatus = await Project.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          avgProgress: { $avg: '$progress' }
        }
      }
    ])

    const statusMap = {}
    projectStatus.forEach(status => {
      statusMap[status._id] = {
        count: status.count,
        avgProgress: Math.round(status.avgProgress || 0)
      }
    })

    res.json(statusMap)
  } catch (error) {
    console.error('Error fetching project status:', error)
    res.status(500).json({ message: 'Error fetching project status' })
  }
})

// Ticket metrics
router.get('/ticket-metrics', protect, async (req, res) => {
  try {
    if (req.user.role !== 'admin' && req.user.role !== 'super_admin') {
      return res.status(403).json({ message: 'Access denied' })
    }

    const [
      totalTickets,
      openTickets,
      resolvedTickets,
      avgResolutionTime
    ] = await Promise.all([
      Ticket.countDocuments(),
      Ticket.countDocuments({ status: 'open' }),
      Ticket.countDocuments({ status: 'resolved' }),
      Ticket.aggregate([
        { $match: { status: 'resolved' } },
        {
          $group: {
            _id: null,
            avgTime: { $avg: { $subtract: ['$resolvedAt', '$createdAt'] } }
          }
        }
      ])
    ])

    const metrics = {
      total_tickets: totalTickets,
      open_tickets: openTickets,
      resolved_tickets: resolvedTickets,
      resolution_rate: totalTickets > 0 ? Math.round((resolvedTickets / totalTickets) * 100) : 0,
      avg_resolution_time: avgResolutionTime[0]?.avgTime ?
        Math.round(avgResolutionTime[0].avgTime / (1000 * 60 * 60)) : 24 // hours
    }

    res.json(metrics)
  } catch (error) {
    console.error('Error fetching ticket metrics:', error)
    res.status(500).json({ message: 'Error fetching ticket metrics' })
  }
})

module.exports = router
