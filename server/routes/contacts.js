const express = require("express")
const Contact = require("../models/Contact")
const Account = require("../models/Account")
const { protect, authorize } = require("../middleware/auth")
const { logActivity } = require("../middleware/auditLog")

const router = express.Router()

// @desc    Get all contacts
// @route   GET /api/contacts
// @access  Private
router.get("/", protect, async (req, res) => {
  try {
    const query = {}

    // Sales executives can only see their assigned contacts
    if (req.user.role === "sales_executive") {
      query.assignedTo = req.user._id
    }

    const contacts = await Contact.find(query)
      .populate("account", "name industry")
      .populate("assignedTo", "name email")
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 })

    res.json({
      success: true,
      count: contacts.length,
      data: contacts,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
    })
  }
})

// @desc    Get single contact
// @route   GET /api/contacts/:id
// @access  Private
router.get("/:id", protect, async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id)
      .populate("account", "name industry website")
      .populate("assignedTo", "name email")
      .populate("createdBy", "name email")

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: "Contact not found",
      })
    }

    // Check if user can access this contact
    if (req.user.role === "sales_executive" && contact.assignedTo._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to access this contact",
      })
    }

    res.json({
      success: true,
      data: contact,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
    })
  }
})

// @desc    Create new contact
// @route   POST /api/contacts
// @access  Private
router.post("/", protect, logActivity("create", "Contact"), async (req, res) => {
  try {
    req.body.createdBy = req.user._id

    // If no assignedTo is provided, assign to creator
    if (!req.body.assignedTo) {
      req.body.assignedTo = req.user._id
    }

    // Verify account exists
    const account = await Account.findById(req.body.account)
    if (!account) {
      return res.status(400).json({
        success: false,
        message: "Account not found",
      })
    }

    const contact = await Contact.create(req.body)

    await contact.populate("account", "name industry")
    await contact.populate("assignedTo", "name email")
    await contact.populate("createdBy", "name email")

    res.status(201).json({
      success: true,
      data: contact,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
    })
  }
})

// @desc    Update contact
// @route   PUT /api/contacts/:id
// @access  Private
router.put("/:id", protect, logActivity("update", "Contact"), async (req, res) => {
  try {
    let contact = await Contact.findById(req.params.id)

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: "Contact not found",
      })
    }

    // Check if user can update this contact
    if (req.user.role === "sales_executive" && contact.assignedTo.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this contact",
      })
    }

    contact = await Contact.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })
      .populate("account", "name industry")
      .populate("assignedTo", "name email")
      .populate("createdBy", "name email")

    res.json({
      success: true,
      data: contact,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
    })
  }
})

// @desc    Delete contact
// @route   DELETE /api/contacts/:id
// @access  Private
router.delete(
  "/:id",
  protect,
  authorize("admin", "super_admin", "sales_manager"),
  logActivity("delete", "Contact"),
  async (req, res) => {
    try {
      const contact = await Contact.findById(req.params.id)

      if (!contact) {
        return res.status(404).json({
          success: false,
          message: "Contact not found",
        })
      }

      await contact.deleteOne()

      res.json({
        success: true,
        message: "Contact deleted successfully",
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
