const express = require("express")
const Pipeline = require("../models/Pipeline")
const { protect, authorize } = require("../middleware/auth")

const router = express.Router()

// @desc    Get all pipelines
// @route   GET /api/pipelines
// @access  Private
router.get("/", protect, async (req, res) => {
  try {
    const pipelines = await Pipeline.find().populate("createdBy", "name email").sort({ createdAt: -1 })

    res.json({
      success: true,
      count: pipelines.length,
      data: pipelines,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
    })
  }
})

// @desc    Create new pipeline
// @route   POST /api/pipelines
// @access  Private (Admin only)
router.post("/", protect, authorize("admin", "super_admin"), async (req, res) => {
  try {
    req.body.createdBy = req.user._id

    // If this is set as default, unset other defaults
    if (req.body.isDefault) {
      await Pipeline.updateMany({}, { isDefault: false })
    }

    const pipeline = await Pipeline.create(req.body)

    await pipeline.populate("createdBy", "name email")

    res.status(201).json({
      success: true,
      data: pipeline,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
    })
  }
})

// @desc    Update pipeline
// @route   PUT /api/pipelines/:id
// @access  Private (Admin only)
router.put("/:id", protect, authorize("admin", "super_admin"), async (req, res) => {
  try {
    // If this is set as default, unset other defaults
    if (req.body.isDefault) {
      await Pipeline.updateMany({ _id: { $ne: req.params.id } }, { isDefault: false })
    }

    const pipeline = await Pipeline.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate("createdBy", "name email")

    if (!pipeline) {
      return res.status(404).json({
        success: false,
        message: "Pipeline not found",
      })
    }

    res.json({
      success: true,
      data: pipeline,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
    })
  }
})

module.exports = router
