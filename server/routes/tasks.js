const express = require("express")
const Task = require("../models/Task")
const { protect } = require("../middleware/auth")

const router = express.Router()

// @desc    Get all tasks
// @route   GET /api/tasks
// @access  Private
router.get("/", protect, async (req, res) => {
  try {
    const query = {}

    // Sales executives can only see their assigned tasks
    if (req.user.role === "sales_executive") {
      query.assignedTo = req.user._id
    }

    const tasks = await Task.find(query)
      .populate("assignedTo", "name email")
      .populate("createdBy", "name email")
      .sort({ dueDate: 1 })

    res.json({
      success: true,
      count: tasks.length,
      data: tasks,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
    })
  }
})

// @desc    Create new task
// @route   POST /api/tasks
// @access  Private
router.post("/", protect, async (req, res) => {
  try {
    req.body.createdBy = req.user._id

    // If no assignedTo is provided, assign to creator
    if (!req.body.assignedTo) {
      req.body.assignedTo = req.user._id
    }

    const task = await Task.create(req.body)

    await task.populate("assignedTo", "name email")
    await task.populate("createdBy", "name email")

    res.status(201).json({
      success: true,
      data: task,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
    })
  }
})

// @desc    Update task
// @route   PUT /api/tasks/:id
// @access  Private
router.put("/:id", protect, async (req, res) => {
  try {
    let task = await Task.findById(req.params.id)

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      })
    }

    // Check if user can update this task
    if (req.user.role === "sales_executive" && task.assignedTo.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this task",
      })
    }

    // Set completed date if task is completed
    if (req.body.status === "completed" && !task.completedAt) {
      req.body.completedAt = new Date()
    }

    task = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })
      .populate("assignedTo", "name email")
      .populate("createdBy", "name email")

    res.json({
      success: true,
      data: task,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
    })
  }
})

module.exports = router
