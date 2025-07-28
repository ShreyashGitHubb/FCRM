const mongoose = require("mongoose")
const User = require("./models/User")
const dotenv = require("dotenv")

// Load env vars
dotenv.config()

const createUsers = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI)
    console.log("MongoDB Connected")

    // Create Super Admin
    const superAdmin = await User.create({
      name: "Super Admin",
      email: "superadmin@crm.com",
      password: "superadmin123",
      role: "super_admin",
      isApproved: true,
      isActive: true,
    })

    console.log("Super Admin created successfully:")
    console.log(`Email: ${superAdmin.email}`)
    console.log(`Password: superadmin123`)

    // Create Admin
    const admin = await User.create({
      name: "Admin User",
      email: "admin@crm.com",
      password: "admin123",
      role: "admin",
      isApproved: true,
      isActive: true,
    })

    console.log("\nAdmin created successfully:")
    console.log(`Email: ${admin.email}`)
    console.log(`Password: admin123`)

    console.log("\n=== Login Credentials ===")
    console.log("Super Admin:")
    console.log("  Email: superadmin@crm.com")
    console.log("  Password: superadmin123")
    console.log("\nAdmin:")
    console.log("  Email: admin@crm.com")
    console.log("  Password: admin123")

    process.exit(0)
  } catch (error) {
    console.error("Error creating users:", error)
    process.exit(1)
  }
}

createUsers()
