const express = require("express")
const multer = require("multer")
const csv = require("csv-parser")
const { Parser } = require("json2csv")
const fs = require("fs")
const Lead = require("../models/Lead")
const Contact = require("../models/Contact")
const Deal = require("../models/Deal")
const Account = require("../models/Account")
const { protect, authorize } = require("../middleware/auth")

const router = express.Router()

// Configure multer for file uploads
const upload = multer({ dest: "uploads/" })

// @desc    Export leads to CSV
// @route   GET /api/import-export/leads/export
// @access  Private
router.get("/leads/export", protect, async (req, res) => {
  try {
    const query = {}

    // Sales executives can only export their assigned leads
    if (req.user.role === "sales_executive") {
      query.assignedTo = req.user._id
    }

    const leads = await Lead.find(query).populate("assignedTo", "name").populate("createdBy", "name").lean()

    // Transform data for CSV
    const csvData = leads.map((lead) => ({
      firstName: lead.firstName,
      lastName: lead.lastName,
      email: lead.email,
      phone: lead.phone || "",
      company: lead.company || "",
      status: lead.status,
      source: lead.source,
      assignedTo: lead.assignedTo?.name || "",
      createdBy: lead.createdBy?.name || "",
      notes: lead.notes || "",
      createdAt: lead.createdAt,
    }))

    const fields = [
      "firstName",
      "lastName",
      "email",
      "phone",
      "company",
      "status",
      "source",
      "assignedTo",
      "createdBy",
      "notes",
      "createdAt",
    ]

    const json2csvParser = new Parser({ fields })
    const csv = json2csvParser.parse(csvData)

    res.header("Content-Type", "text/csv")
    res.attachment("leads.csv")
    res.send(csv)
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
    })
  }
})

// @desc    Import leads from CSV
// @route   POST /api/import-export/leads/import
// @access  Private
router.post(
  "/leads/import",
  protect,
  authorize("admin", "super_admin", "sales_manager"),
  upload.single("file"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "Please upload a CSV file",
        })
      }

      const results = []
      const errors = []

      fs.createReadStream(req.file.path)
        .pipe(csv())
        .on("data", (data) => results.push(data))
        .on("end", async () => {
          let successCount = 0
          let errorCount = 0

          for (const row of results) {
            try {
              // Validate required fields
              if (!row.firstName || !row.lastName || !row.email) {
                errors.push(`Row ${results.indexOf(row) + 1}: Missing required fields`)
                errorCount++
                continue
              }

              // Check if lead already exists
              const existingLead = await Lead.findOne({ email: row.email })
              if (existingLead) {
                errors.push(`Row ${results.indexOf(row) + 1}: Lead with email ${row.email} already exists`)
                errorCount++
                continue
              }

              // Create lead
              await Lead.create({
                firstName: row.firstName,
                lastName: row.lastName,
                email: row.email,
                phone: row.phone || "",
                company: row.company || "",
                status: row.status || "new",
                source: row.source || "import",
                assignedTo: req.user._id,
                createdBy: req.user._id,
                notes: row.notes || "",
              })

              successCount++
            } catch (error) {
              errors.push(`Row ${results.indexOf(row) + 1}: ${error.message}`)
              errorCount++
            }
          }

          // Clean up uploaded file
          fs.unlinkSync(req.file.path)

          res.json({
            success: true,
            message: `Import completed. ${successCount} leads imported successfully, ${errorCount} errors.`,
            data: {
              successCount,
              errorCount,
              errors: errors.slice(0, 10), // Return first 10 errors
            },
          })
        })
    } catch (error) {
      // Clean up uploaded file on error
      if (req.file) {
        fs.unlinkSync(req.file.path)
      }

      res.status(500).json({
        success: false,
        message: "Server error",
      })
    }
  },
)

// @desc    Export contacts to CSV
// @route   GET /api/import-export/contacts/export
// @access  Private
router.get("/contacts/export", protect, async (req, res) => {
  try {
    const query = {}

    if (req.user.role === "sales_executive") {
      query.assignedTo = req.user._id
    }

    const contacts = await Contact.find(query).populate("account", "name").populate("assignedTo", "name").lean()

    const csvData = contacts.map((contact) => ({
      firstName: contact.firstName,
      lastName: contact.lastName,
      email: contact.email,
      phone: contact.phone || "",
      mobile: contact.mobile || "",
      jobTitle: contact.jobTitle || "",
      department: contact.department || "",
      account: contact.account?.name || "",
      assignedTo: contact.assignedTo?.name || "",
      status: contact.status,
      createdAt: contact.createdAt,
    }))

    const fields = [
      "firstName",
      "lastName",
      "email",
      "phone",
      "mobile",
      "jobTitle",
      "department",
      "account",
      "assignedTo",
      "status",
      "createdAt",
    ]

    const json2csvParser = new Parser({ fields })
    const csv = json2csvParser.parse(csvData)

    res.header("Content-Type", "text/csv")
    res.attachment("contacts.csv")
    res.send(csv)
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
    })
  }
})

// @desc    Export deals to CSV
// @route   GET /api/import-export/deals/export
// @access  Private
router.get("/deals/export", protect, async (req, res) => {
  try {
    const query = {}

    if (req.user.role === "sales_executive") {
      query.assignedTo = req.user._id
    }

    const deals = await Deal.find(query).populate("assignedTo", "name").lean()

    const csvData = deals.map((deal) => ({
      title: deal.title,
      value: deal.value,
      stage: deal.stage,
      probability: deal.probability,
      expectedCloseDate: deal.expectedCloseDate,
      actualCloseDate: deal.actualCloseDate || "",
      assignedTo: deal.assignedTo?.name || "",
      contactFirstName: deal.contact?.firstName || "",
      contactLastName: deal.contact?.lastName || "",
      contactEmail: deal.contact?.email || "",
      contactCompany: deal.contact?.company || "",
      notes: deal.notes || "",
      createdAt: deal.createdAt,
    }))

    const fields = [
      "title",
      "value",
      "stage",
      "probability",
      "expectedCloseDate",
      "actualCloseDate",
      "assignedTo",
      "contactFirstName",
      "contactLastName",
      "contactEmail",
      "contactCompany",
      "notes",
      "createdAt",
    ]

    const json2csvParser = new Parser({ fields })
    const csv = json2csvParser.parse(csvData)

    res.header("Content-Type", "text/csv")
    res.attachment("deals.csv")
    res.send(csv)
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
    })
  }
})

module.exports = router
