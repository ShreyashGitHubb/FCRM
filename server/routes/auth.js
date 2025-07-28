const express = require("express")
const jwt = require("jsonwebtoken")
const { body, validationResult } = require("express-validator")
const User = require("../models/User")
const UserApproval = require("../models/UserApproval")
const { protect } = require("../middleware/auth")

const router = express.Router()

// Generate JWT Token with role
const signToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || "30d",
  })
}

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
router.post(
  "/register",
  [
    body("name").notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Please include a valid email"),
    body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: errors.array()[0].msg,
        })
      }

      const { name, email, password, role } = req.body

      // Check if user exists
      let user = await User.findOne({ email })
      if (user) {
        return res.status(400).json({
          success: false,
          message: "User already exists",
        })
      }

      // Create user with pending approval
      user = await User.create({
        name,
        email,
        password,
        role: role || "sales_executive",
        isApproved: false,
      })

      // Create approval request
      await UserApproval.create({
        userId: user._id,
        requestedBy: user._id,
        status: "pending",
      })

      res.status(201).json({
        success: true,
        message: "User registered successfully. Please wait for admin approval.",
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
  },
)

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Please include a valid email"),
    body("password").exists().withMessage("Password is required"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: errors.array()[0].msg,
        })
      }

      const { email, password } = req.body

      // Check for user
      const user = await User.findOne({ email }).select("+password")
      if (!user) {
        return res.status(401).json({
          success: false,
          message: "Invalid credentials",
        })
      }

      // Check if password matches
      const isMatch = await user.matchPassword(password)
      if (!isMatch) {
        return res.status(401).json({
          success: false,
          message: "Invalid credentials",
        })
      }

      // Check if user is approved (except for super_admin and admin)
      if (!user.isApproved && user.role !== "super_admin" && user.role !== "admin") {
        return res.status(401).json({
          success: false,
          message: "Your account is pending approval. Please contact an administrator.",
        })
      }

      const token = signToken(user._id, user.role)

      res.json({
        success: true,
        token,
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
  },
)

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
router.get("/me", protect, async (req, res) => {
  res.json({
    success: true,
    data: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
      isApproved: req.user.isApproved,
    },
  })
})

module.exports = router
