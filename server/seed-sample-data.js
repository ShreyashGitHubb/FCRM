const mongoose = require("mongoose")
const dotenv = require("dotenv")
const Account = require("./models/Account")
const Contact = require("./models/Contact")
const Project = require("./models/Project")
const Pipeline = require("./models/Pipeline")
const User = require("./models/User")

// Load env vars
dotenv.config()

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)

const seedData = async () => {
  try {
    console.log("Seeding sample data...")

    // Get admin user
    const adminUser = await User.findOne({ role: "admin" })
    if (!adminUser) {
      console.log("Please create an admin user first")
      return
    }

    // Create sample accounts
    const sampleAccounts = [
      {
        name: "Tech Solutions Inc",
        website: "https://techsolutions.com",
        industry: "Technology",
        type: "customer",
        size: "medium",
        revenue: 5000000,
        employees: 150,
        assignedTo: adminUser._id,
        createdBy: adminUser._id,
        address: {
          street: "123 Tech Street",
          city: "San Francisco",
          state: "CA",
          zipCode: "94105",
          country: "USA",
        },
        description: "Leading technology solutions provider",
        status: "active",
      },
      {
        name: "Global Manufacturing Corp",
        website: "https://globalmanufacturing.com",
        industry: "Manufacturing",
        type: "prospect",
        size: "large",
        revenue: 50000000,
        employees: 500,
        assignedTo: adminUser._id,
        createdBy: adminUser._id,
        address: {
          street: "456 Industrial Ave",
          city: "Detroit",
          state: "MI",
          zipCode: "48201",
          country: "USA",
        },
        description: "Large scale manufacturing company",
        status: "active",
      },
      {
        name: "StartupXYZ",
        website: "https://startupxyz.com",
        industry: "Software",
        type: "prospect",
        size: "small",
        revenue: 500000,
        employees: 25,
        assignedTo: adminUser._id,
        createdBy: adminUser._id,
        address: {
          street: "789 Startup Blvd",
          city: "Austin",
          state: "TX",
          zipCode: "73301",
          country: "USA",
        },
        description: "Innovative software startup",
        status: "active",
      },
    ]

    await Account.deleteMany({})
    const accounts = await Account.insertMany(sampleAccounts)
    console.log(`Created ${accounts.length} sample accounts`)

    // Create sample contacts
    const sampleContacts = [
      {
        firstName: "John",
        lastName: "Smith",
        email: "john.smith@techsolutions.com",
        phone: "+1-555-0101",
        mobile: "+1-555-0102",
        jobTitle: "CTO",
        department: "Technology",
        account: accounts[0]._id,
        assignedTo: adminUser._id,
        createdBy: adminUser._id,
        status: "active",
        notes: "Key decision maker for technology purchases",
      },
      {
        firstName: "Sarah",
        lastName: "Johnson",
        email: "sarah.johnson@globalmanufacturing.com",
        phone: "+1-555-0201",
        mobile: "+1-555-0202",
        jobTitle: "VP Operations",
        department: "Operations",
        account: accounts[1]._id,
        assignedTo: adminUser._id,
        createdBy: adminUser._id,
        status: "active",
        notes: "Interested in automation solutions",
      },
      {
        firstName: "Mike",
        lastName: "Davis",
        email: "mike.davis@startupxyz.com",
        phone: "+1-555-0301",
        mobile: "+1-555-0302",
        jobTitle: "CEO",
        department: "Executive",
        account: accounts[2]._id,
        assignedTo: adminUser._id,
        createdBy: adminUser._id,
        status: "active",
        notes: "Looking for scalable solutions",
      },
    ]

    await Contact.deleteMany({})
    const contacts = await Contact.insertMany(sampleContacts)
    console.log(`Created ${contacts.length} sample contacts`)

    // Create sample projects
    const sampleProjects = [
      {
        name: "CRM Implementation",
        description: "Implement new CRM system for Tech Solutions Inc",
        status: "active",
        priority: "high",
        startDate: new Date("2024-01-15"),
        endDate: new Date("2024-06-15"),
        budget: 150000,
        progress: 45,
        account: accounts[0]._id,
        contact: contacts[0]._id,
        assignedTo: adminUser._id,
        teamMembers: [adminUser._id],
        createdBy: adminUser._id,
        milestones: [
          {
            name: "Requirements Gathering",
            description: "Collect and document all requirements",
            dueDate: new Date("2024-02-15"),
            status: "completed",
            completedAt: new Date("2024-02-10"),
          },
          {
            name: "System Design",
            description: "Design the system architecture",
            dueDate: new Date("2024-03-15"),
            status: "completed",
            completedAt: new Date("2024-03-12"),
          },
          {
            name: "Development Phase 1",
            description: "Core functionality development",
            dueDate: new Date("2024-04-30"),
            status: "pending",
          },
        ],
      },
      {
        name: "Manufacturing Automation",
        description: "Automate production line processes",
        status: "planning",
        priority: "medium",
        startDate: new Date("2024-03-01"),
        endDate: new Date("2024-12-31"),
        budget: 500000,
        progress: 10,
        account: accounts[1]._id,
        contact: contacts[1]._id,
        assignedTo: adminUser._id,
        teamMembers: [adminUser._id],
        createdBy: adminUser._id,
        milestones: [
          {
            name: "Process Analysis",
            description: "Analyze current manufacturing processes",
            dueDate: new Date("2024-04-01"),
            status: "pending",
          },
          {
            name: "Equipment Selection",
            description: "Select automation equipment",
            dueDate: new Date("2024-05-15"),
            status: "pending",
          },
        ],
      },
    ]

    await Project.deleteMany({})
    const projects = await Project.insertMany(sampleProjects)
    console.log(`Created ${projects.length} sample projects`)

    // Create default pipeline
    const defaultPipeline = {
      name: "Standard Sales Pipeline",
      description: "Default sales pipeline for deals",
      isDefault: true,
      stages: [
        { name: "Initiated", order: 1, probability: 10, color: "#6B7280" },
        { name: "Qualification", order: 2, probability: 25, color: "#3B82F6" },
        { name: "Proposal", order: 3, probability: 50, color: "#F59E0B" },
        { name: "Negotiation", order: 4, probability: 75, color: "#EF4444" },
        { name: "Won", order: 5, probability: 100, color: "#10B981" },
        { name: "Lost", order: 6, probability: 0, color: "#6B7280" },
      ],
      createdBy: adminUser._id,
    }

    await Pipeline.deleteMany({})
    await Pipeline.create(defaultPipeline)
    console.log("Created default pipeline")

    console.log("Sample data seeded successfully!")
    process.exit(0)
  } catch (error) {
    console.error("Error seeding data:", error)
    process.exit(1)
  }
}

seedData()
