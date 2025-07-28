const jwt = require("jsonwebtoken")
const User = require("../models/User")

// Protect routes
exports.protect = async (req, res, next) => {
  let token

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1]
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Not authorized to access this route",
    })
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    
    // Check if user still exists
    const user = await User.findById(decoded.id)
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User no longer exists",
      })
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: "User account is deactivated",
      })
    }

    // Check if user is approved (except for super_admin and admin)
    if (!user.isApproved && user.role !== "super_admin" && user.role !== "admin") {
      return res.status(401).json({
        success: false,
        message: "Your account is pending approval",
      })
    }

    req.user = user
    next()
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: "Not authorized to access this route",
    })
  }
}

// Grant access to specific roles
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `User role ${req.user.role} is not authorized to access this route`,
      })
    }
    next()
  }
}

// Check if user is admin or super_admin
exports.requireAdmin = (req, res, next) => {
  if (req.user.role !== "admin" && req.user.role !== "super_admin") {
    return res.status(403).json({
      success: false,
      message: "Access denied. Admin privileges required.",
    })
  }
  next()
}
