const express = require("express")
const Project = require("../models/Project")
const { protect, authorize } = require("../middleware/auth")
const { logActivity } = require("../middleware/auditLog")

const router = express.Router()

// @desc    Get all projects
// @route   GET /api/projects
// @access  Private
router.get("/", protect, async (req, res) => {
  try {
    const query = {}

    // Filter based on user role
    if (req.user.role === "sales_executive" || req.user.role === "support_agent") {
      query.$or = [{ assignedTo: req.user._id }, { teamMembers: req.user._id }]
    } else if (req.user.role === "customer") {
      // Customers can only see projects where they are the contact
      const Contact = require("../models/Contact")
      const contacts = await Contact.find({ email: req.user.email })
      if (contacts.length > 0) {
        query.contact = { $in: contacts.map((c) => c._id) }
      } else {
        query.contact = null // No projects if no matching contact
      }
    }

    const projects = await Project.find(query)
      .populate("account", "name industry")
      .populate("contact", "firstName lastName email")
      .populate("assignedTo", "name email")
      .populate("teamMembers", "name email")
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 })

    res.json({
      success: true,
      count: projects.length,
      data: projects,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
    })
  }
})

// @desc    Get single project
// @route   GET /api/projects/:id
// @access  Private
router.get("/:id", protect, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate("account", "name industry website")
      .populate("contact", "firstName lastName email phone")
      .populate("assignedTo", "name email")
      .populate("teamMembers", "name email")
      .populate("createdBy", "name email")

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      })
    }

    // Check if user can access this project
    const canAccess =
      req.user.role === "admin" ||
      req.user.role === "super_admin" ||
      req.user.role === "sales_manager" ||
      project.assignedTo._id.toString() === req.user._id.toString() ||
      project.teamMembers.some((member) => member._id.toString() === req.user._id.toString()) ||
      (req.user.role === "customer" && project.contact && project.contact.email === req.user.email)

    if (!canAccess) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to access this project",
      })
    }

    res.json({
      success: true,
      data: project,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
    })
  }
})

// @desc    Create new project
// @route   POST /api/projects
// @access  Private
router.post(
  "/",
  protect,
  authorize("admin", "super_admin", "sales_manager", "sales_executive"),
  logActivity("create", "Project"),
  async (req, res) => {
    try {
      req.body.createdBy = req.user._id

      // If no assignedTo is provided, assign to creator
      if (!req.body.assignedTo) {
        req.body.assignedTo = req.user._id
      }

      const project = await Project.create(req.body)

      await project.populate("account", "name industry")
      await project.populate("contact", "firstName lastName email")
      await project.populate("assignedTo", "name email")
      await project.populate("teamMembers", "name email")
      await project.populate("createdBy", "name email")

      res.status(201).json({
        success: true,
        data: project,
      })
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Server error",
      })
    }
  },
)

// @desc    Update project
// @route   PUT /api/projects/:id
// @access  Private
router.put("/:id", protect, logActivity("update", "Project"), async (req, res) => {
  try {
    let project = await Project.findById(req.params.id)

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      })
    }

    // Check if user can update this project
    const canUpdate =
      req.user.role === "admin" ||
      req.user.role === "super_admin" ||
      req.user.role === "sales_manager" ||
      project.assignedTo.toString() === req.user._id.toString() ||
      project.teamMembers.includes(req.user._id)

    if (!canUpdate) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this project",
      })
    }

    project = await Project.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })
      .populate("account", "name industry")
      .populate("contact", "firstName lastName email")
      .populate("assignedTo", "name email")
      .populate("teamMembers", "name email")
      .populate("createdBy", "name email")

    res.json({
      success: true,
      data: project,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
    })
  }
})

// @desc    Update project milestone
// @route   PUT /api/projects/:id/milestones/:milestoneId
// @access  Private
router.put("/:id/milestones/:milestoneId", protect, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      })
    }

    const milestone = project.milestones.id(req.params.milestoneId)
    if (!milestone) {
      return res.status(404).json({
        success: false,
        message: "Milestone not found",
      })
    }

    // Update milestone
    Object.assign(milestone, req.body)

    if (req.body.status === "completed" && !milestone.completedAt) {
      milestone.completedAt = new Date()
    }

    await project.save()

    res.json({
      success: true,
      data: project,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
    })
  }
})

module.exports = router
