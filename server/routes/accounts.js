const express = require("express")
const Account = require("../models/Account")
const Contact = require("../models/Contact")
const { protect, authorize } = require("../middleware/auth")
const { logActivity } = require("../middleware/auditLog")

const router = express.Router()

// @desc    Get all accounts
// @route   GET /api/accounts
// @access  Private
router.get("/", protect, async (req, res) => {
  try {
    const query = {}

    // Sales executives can only see their assigned accounts
    if (req.user.role === "sales_executive") {
      query.assignedTo = req.user._id
    }

    const accounts = await Account.find(query)
      .populate("assignedTo", "name email")
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 })

    // Get contact count for each account
    const accountsWithContactCount = await Promise.all(
      accounts.map(async (account) => {
        const contactCount = await Contact.countDocuments({ account: account._id })
        return {
          ...account.toObject(),
          contactCount,
        }
      }),
    )

    res.json({
      success: true,
      count: accountsWithContactCount.length,
      data: accountsWithContactCount,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
    })
  }
})

// @desc    Get single account with contacts
// @route   GET /api/accounts/:id
// @access  Private
router.get("/:id", protect, async (req, res) => {
  try {
    const account = await Account.findById(req.params.id)
      .populate("assignedTo", "name email")
      .populate("createdBy", "name email")

    if (!account) {
      return res.status(404).json({
        success: false,
        message: "Account not found",
      })
    }

    // Check if user can access this account
    if (req.user.role === "sales_executive" && account.assignedTo._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to access this account",
      })
    }

    // Get associated contacts
    const contacts = await Contact.find({ account: account._id }).populate("assignedTo", "name email")

    res.json({
      success: true,
      data: {
        ...account.toObject(),
        contacts,
      },
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
    })
  }
})

// @desc    Create new account
// @route   POST /api/accounts
// @access  Private
router.post("/", protect, logActivity("create", "Account"), async (req, res) => {
  try {
    req.body.createdBy = req.user._id

    // If no assignedTo is provided, assign to creator
    if (!req.body.assignedTo) {
      req.body.assignedTo = req.user._id
    }

    const account = await Account.create(req.body)

    await account.populate("assignedTo", "name email")
    await account.populate("createdBy", "name email")

    res.status(201).json({
      success: true,
      data: account,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
    })
  }
})

// @desc    Update account
// @route   PUT /api/accounts/:id
// @access  Private
router.put("/:id", protect, logActivity("update", "Account"), async (req, res) => {
  try {
    let account = await Account.findById(req.params.id)

    if (!account) {
      return res.status(404).json({
        success: false,
        message: "Account not found",
      })
    }

    // Check if user can update this account
    if (req.user.role === "sales_executive" && account.assignedTo.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this account",
      })
    }

    account = await Account.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })
      .populate("assignedTo", "name email")
      .populate("createdBy", "name email")

    res.json({
      success: true,
      data: account,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
    })
  }
})

// @desc    Delete account
// @route   DELETE /api/accounts/:id
// @access  Private
router.delete(
  "/:id",
  protect,
  authorize("admin", "super_admin", "sales_manager"),
  logActivity("delete", "Account"),
  async (req, res) => {
    try {
      const account = await Account.findById(req.params.id)

      if (!account) {
        return res.status(404).json({
          success: false,
          message: "Account not found",
        })
      }

      // Check if account has associated contacts
      const contactCount = await Contact.countDocuments({ account: account._id })
      if (contactCount > 0) {
        return res.status(400).json({
          success: false,
          message: "Cannot delete account with associated contacts",
        })
      }

      await account.deleteOne()

      res.json({
        success: true,
        message: "Account deleted successfully",
      })
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Server error",
      })
    }
  },
)

module.exports = router
