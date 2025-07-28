const mongoose = require("mongoose")
const User = require("./models/User")
const dotenv = require("dotenv")

// Load env vars
dotenv.config()

const createSuperAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI)
    console.log("MongoDB Connected")

    // Check if super admin already exists
    const existingSuperAdmin = await User.findOne({ role: "super_admin" })
    if (existingSuperAdmin) {
      console.log("Super admin already exists")
      process.exit(0)
    }

    // Create super admin user
    const superAdmin = await User.create({
      name: "Super Admin",
      email: "admin@crm.com",
      password: "admin123",
      role: "super_admin",
      isApproved: true,
      isActive: true,
    })

    console.log("Super admin created successfully:")
    console.log(`Email: ${superAdmin.email}`)
    console.log(`Password: admin123`)
    console.log("Please change the password after first login")

    process.exit(0)
  } catch (error) {
    console.error("Error creating super admin:", error)
    process.exit(1)
  }
}

createSuperAdmin()
