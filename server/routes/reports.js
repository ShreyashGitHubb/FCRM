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

// Download comprehensive report
router.get('/download/comprehensive', protect, async (req, res) => {
    try {
        if (req.user.role !== 'admin' && req.user.role !== 'super_admin') {
            return res.status(403).json({ message: 'Access denied' })
        }

        // Fetch all data for comprehensive report
        const [
            leads,
            deals,
            projects,
            tickets,
            users,
            accounts,
            contacts
        ] = await Promise.all([
            Lead.find().populate('assignedTo', 'name'),
            Deal.find().populate('assignedTo', 'name').populate('account', 'name'),
            Project.find().populate('assignedTo', 'name').populate('account', 'name'),
            Ticket.find().populate('assignedTo', 'name'),
            User.find(),
            Account.find(),
            Contact.find()
        ])

        // Calculate key metrics
        const totalRevenue = deals
            .filter(deal => deal.status === 'closed_won')
            .reduce((sum, deal) => sum + (deal.value || 0), 0)

        const conversionRate = leads.length > 0 ?
            (leads.filter(lead => lead.status === 'converted').length / leads.length) * 100 : 0

        const avgDealSize = deals.length > 0 ?
            deals.reduce((sum, deal) => sum + (deal.value || 0), 0) / deals.length : 0

        // Create report data
        const reportData = {
            generatedAt: new Date().toISOString(),
            generatedBy: req.user.name,
            overview: {
                totalLeads: leads.length,
                totalDeals: deals.length,
                totalProjects: projects.length,
                totalTickets: tickets.length,
                totalUsers: users.length,
                totalAccounts: accounts.length,
                totalContacts: contacts.length,
                totalRevenue,
                conversionRate: Math.round(conversionRate * 100) / 100,
                avgDealSize: Math.round(avgDealSize * 100) / 100
            },
            leads: leads.map(lead => ({
                name: lead.firstName + ' ' + lead.lastName,
                email: lead.email,
                phone: lead.phone,
                status: lead.status,
                source: lead.source,
                assignedTo: lead.assignedTo?.name || 'Unassigned',
                createdAt: lead.createdAt
            })),
            deals: deals.map(deal => ({
                name: deal.name,
                value: deal.value,
                status: deal.status,
                stage: deal.stage,
                assignedTo: deal.assignedTo?.name || 'Unassigned',
                account: deal.account?.name || 'No Account',
                expectedCloseDate: deal.expectedCloseDate,
                createdAt: deal.createdAt
            })),
            projects: projects.map(project => ({
                name: project.name,
                status: project.status,
                priority: project.priority,
                progress: project.progress,
                assignedTo: project.assignedTo?.name || 'Unassigned',
                account: project.account?.name || 'No Account',
                startDate: project.startDate,
                endDate: project.endDate,
                budget: project.budget
            })),
            tickets: tickets.map(ticket => ({
                subject: ticket.subject,
                status: ticket.status,
                priority: ticket.priority,
                assignedTo: ticket.assignedTo?.name || 'Unassigned',
                createdAt: ticket.createdAt,
                resolvedAt: ticket.resolvedAt
            })),
            users: users.map(user => ({
                name: user.name,
                email: user.email,
                role: user.role,
                status: user.status,
                createdAt: user.createdAt
            }))
        }

        // For now, return JSON data
        // In a real implementation, you would use a PDF library like PDFKit or Puppeteer
        res.setHeader('Content-Type', 'application/json')
        res.setHeader('Content-Disposition', `attachment; filename="comprehensive_report_${new Date().toISOString().split('T')[0]}.json"`)
        res.json(reportData)

    } catch (error) {
        console.error('Error generating comprehensive report:', error)
        res.status(500).json({ message: 'Error generating report' })
    }
})

// Download executive summary
router.get('/download/executive', protect, async (req, res) => {
    try {
        if (req.user.role !== 'admin' && req.user.role !== 'super_admin') {
            return res.status(403).json({ message: 'Access denied' })
        }

        // Fetch key metrics for executive summary
        const [
            totalLeads,
            totalDeals,
            totalProjects,
            totalTickets,
            totalRevenue,
            wonDeals,
            activeProjects,
            resolvedTickets
        ] = await Promise.all([
            Lead.countDocuments(),
            Deal.countDocuments(),
            Project.countDocuments(),
            Ticket.countDocuments(),
            Deal.aggregate([
                { $match: { status: 'closed_won' } },
                { $group: { _id: null, total: { $sum: '$value' } } }
            ]),
            Deal.countDocuments({ status: 'closed_won' }),
            Project.countDocuments({ status: 'active' }),
            Ticket.countDocuments({ status: 'resolved' })
        ])

        // Calculate key performance indicators
        const conversionRate = totalLeads > 0 ? (wonDeals / totalLeads) * 100 : 0
        const projectCompletionRate = totalProjects > 0 ? (resolvedTickets / totalTickets) * 100 : 0
        const avgDealSize = wonDeals > 0 ? (totalRevenue[0]?.total || 0) / wonDeals : 0

        // Get top performers
        const topPerformers = await Deal.aggregate([
            { $match: { status: 'closed_won' } },
            { $group: { _id: '$assignedTo', dealsClosed: { $sum: 1 }, totalValue: { $sum: '$value' } } },
            { $sort: { dealsClosed: -1 } },
            { $limit: 3 },
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

        const executiveSummary = {
            generatedAt: new Date().toISOString(),
            generatedBy: req.user.name,
            keyMetrics: {
                totalLeads,
                totalDeals,
                totalProjects,
                totalTickets,
                totalRevenue: totalRevenue[0]?.total || 0,
                wonDeals,
                activeProjects,
                resolvedTickets,
                conversionRate: Math.round(conversionRate * 100) / 100,
                projectCompletionRate: Math.round(projectCompletionRate * 100) / 100,
                avgDealSize: Math.round(avgDealSize * 100) / 100
            },
            topPerformers: topPerformers.map(performer => ({
                name: performer.user.name,
                role: performer.user.role,
                dealsClosed: performer.dealsClosed,
                totalValue: performer.totalValue
            })),
            recommendations: [
                'Focus on lead qualification to improve conversion rates',
                'Implement better follow-up processes for active deals',
                'Monitor project timelines to ensure on-time delivery',
                'Provide additional training for sales team members'
            ]
        }

        res.setHeader('Content-Type', 'application/json')
        res.setHeader('Content-Disposition', `attachment; filename="executive_summary_${new Date().toISOString().split('T')[0]}.json"`)
        res.json(executiveSummary)

    } catch (error) {
        console.error('Error generating executive summary:', error)
        res.status(500).json({ message: 'Error generating executive summary' })
    }
})

module.exports = router 