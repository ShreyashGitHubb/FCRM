const express = require("express")
const User = require("../models/User")
const UserApproval = require("../models/UserApproval")
const { protect, requireAdmin } = require("../middleware/auth")

const router = express.Router()

// @desc    Get all users (admin/super_admin only)
// @route   GET /api/users
// @access  Private (Admin/Super_Admin)
router.get("/", protect, requireAdmin, async (req, res) => {
  try {
    const users = await User.find().select("-password").populate("approvedBy", "name email")
    
    res.json({
      success: true,
      count: users.length,
      data: users,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
    })
  }
})

// @desc    Get pending approval requests
// @route   GET /api/users/pending-approvals
// @access  Private (Admin/Super_Admin)
router.get("/pending-approvals", protect, requireAdmin, async (req, res) => {
  try {
    const pendingApprovals = await UserApproval.find({ status: "pending" })
      .populate("userId", "name email role createdAt")
      .populate("requestedBy", "name email")
    
    res.json({
      success: true,
      count: pendingApprovals.length,
      data: pendingApprovals,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
    })
  }
})

// @desc    Approve user
// @route   PUT /api/users/:id/approve
// @access  Private (Admin/Super_Admin)
router.put("/:id/approve", protect, requireAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      })
    }

    if (user.isApproved) {
      return res.status(400).json({
        success: false,
        message: "User is already approved",
      })
    }

    // Update user approval status
    user.isApproved = true
    user.approvedBy = req.user._id
    user.approvedAt = new Date()
    await user.save()

    // Update approval request
    await UserApproval.findOneAndUpdate(
      { userId: user._id },
      {
        status: "approved",
        approvedBy: req.user._id,
        approvedAt: new Date(),
      }
    )

    res.json({
      success: true,
      message: "User approved successfully",
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isApproved: user.isApproved,
      },
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
    })
  }
})

// @desc    Reject user
// @route   PUT /api/users/:id/reject
// @access  Private (Admin/Super_Admin)
router.put("/:id/reject", protect, requireAdmin, async (req, res) => {
  try {
    const { rejectionReason } = req.body

    const user = await User.findById(req.params.id)
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      })
    }

    if (user.isApproved) {
      return res.status(400).json({
        success: false,
        message: "User is already approved",
      })
    }

    // Update approval request
    await UserApproval.findOneAndUpdate(
      { userId: user._id },
      {
        status: "rejected",
        approvedBy: req.user._id,
        approvedAt: new Date(),
        rejectionReason,
      }
    )

    // Delete the user
    await User.findByIdAndDelete(user._id)

    res.json({
      success: true,
      message: "User rejected successfully",
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
    })
  }
})

// @desc    Create user (admin/super_admin only)
// @route   POST /api/users
// @access  Private (Admin/Super_Admin)
router.post("/", protect, requireAdmin, async (req, res) => {
  try {
    const { name, email, password, role } = req.body

    // Check if user exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      })
    }

    // Create user with immediate approval
    const user = await User.create({
      name,
      email,
      password,
      role: role || "sales_executive",
      isApproved: true,
      approvedBy: req.user._id,
      approvedAt: new Date(),
      createdBy: req.user._id,
    })

    res.status(201).json({
      success: true,
      message: "User created successfully",
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isApproved: user.isApproved,
      },
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
    })
  }
})

// @desc    Update user (admin/super_admin only)
// @route   PUT /api/users/:id
// @access  Private (Admin/Super_Admin)
router.put("/:id", protect, requireAdmin, async (req, res) => {
  try {
    const { name, email, role, isActive, isApproved } = req.body

    const user = await User.findById(req.params.id)
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      })
    }

    // Update user fields
    if (name) user.name = name
    if (email) user.email = email
    if (role) user.role = role
    if (typeof isActive === "boolean") user.isActive = isActive
    if (typeof isApproved === "boolean") {
      user.isApproved = isApproved
      if (isApproved) {
        user.approvedBy = req.user._id
        user.approvedAt = new Date()
      }
    }

    await user.save()

    res.json({
      success: true,
      message: "User updated successfully",
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
        isApproved: user.isApproved,
      },
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
    })
  }
})

// @desc    Delete user (admin/super_admin only)
// @route   DELETE /api/users/:id
// @access  Private (Admin/Super_Admin)
router.delete("/:id", protect, requireAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      })
    }

    // Prevent deletion of super_admin users
    if (user.role === "super_admin") {
      return res.status(400).json({
        success: false,
        message: "Cannot delete super admin users",
      })
    }

    await User.findByIdAndDelete(req.params.id)

    res.json({
      success: true,
      message: "User deleted successfully",
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
    })
  }
})

module.exports = router
