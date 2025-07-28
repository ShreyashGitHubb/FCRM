const express = require("express")
const nodemailer = require("nodemailer")
const Contact = require("../models/Contact")
const Lead = require("../models/Lead")
const { protect } = require("../middleware/auth")

const router = express.Router()

// Create transporter
const createTransporter = () => {
  return nodemailer.createTransporter({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  })
}

// Email templates
const emailTemplates = {
  welcome: {
    subject: "Welcome to our CRM!",
    html: `
      <h2>Welcome {{firstName}}!</h2>
      <p>Thank you for your interest in our services.</p>
      <p>We'll be in touch soon.</p>
      <br>
      <p>Best regards,<br>{{senderName}}</p>
    `,
  },
  followup: {
    subject: "Following up on our conversation",
    html: `
      <h2>Hi {{firstName}},</h2>
      <p>I wanted to follow up on our recent conversation.</p>
      <p>{{customMessage}}</p>
      <p>Please let me know if you have any questions.</p>
      <br>
      <p>Best regards,<br>{{senderName}}</p>
    `,
  },
  proposal: {
    subject: "Proposal for {{company}}",
    html: `
      <h2>Hi {{firstName}},</h2>
      <p>Please find attached our proposal for {{company}}.</p>
      <p>{{customMessage}}</p>
      <p>I look forward to hearing from you.</p>
      <br>
      <p>Best regards,<br>{{senderName}}</p>
    `,
  },
}

// @desc    Get email templates
// @route   GET /api/email/templates
// @access  Private
router.get("/templates", protect, (req, res) => {
  res.json({
    success: true,
    data: Object.keys(emailTemplates).map((key) => ({
      id: key,
      name: key.charAt(0).toUpperCase() + key.slice(1),
      subject: emailTemplates[key].subject,
    })),
  })
})

// @desc    Send email to contact
// @route   POST /api/email/send
// @access  Private
router.post("/send", protect, async (req, res) => {
  try {
    const { contactId, leadId, templateId, customMessage, subject, body } = req.body

    let recipient
    if (contactId) {
      recipient = await Contact.findById(contactId)
    } else if (leadId) {
      recipient = await Lead.findById(leadId)
    }

    if (!recipient) {
      return res.status(404).json({
        success: false,
        message: "Recipient not found",
      })
    }

    let emailSubject = subject
    let emailBody = body

    // Use template if provided
    if (templateId && emailTemplates[templateId]) {
      const template = emailTemplates[templateId]
      emailSubject = template.subject
      emailBody = template.html
    }

    // Replace placeholders
    const replacements = {
      firstName: recipient.firstName,
      lastName: recipient.lastName,
      company: recipient.company || recipient.account?.name || "",
      senderName: req.user.name,
      customMessage: customMessage || "",
    }

    Object.keys(replacements).forEach((key) => {
      const regex = new RegExp(`{{${key}}}`, "g")
      emailSubject = emailSubject.replace(regex, replacements[key])
      emailBody = emailBody.replace(regex, replacements[key])
    })

    // Send email
    const transporter = createTransporter()

    const mailOptions = {
      from: `${req.user.name} <${process.env.SMTP_FROM}>`,
      to: recipient.email,
      subject: emailSubject,
      html: emailBody,
    }

    await transporter.sendMail(mailOptions)

    res.json({
      success: true,
      message: "Email sent successfully",
    })
  } catch (error) {
    console.error("Email error:", error)
    res.status(500).json({
      success: false,
      message: "Failed to send email",
    })
  }
})

// @desc    Send bulk email
// @route   POST /api/email/bulk
// @access  Private
router.post("/bulk", protect, async (req, res) => {
  try {
    const { recipients, templateId, customMessage, subject, body } = req.body

    if (!recipients || recipients.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No recipients provided",
      })
    }

    const transporter = createTransporter()
    const results = []

    for (const recipientId of recipients) {
      try {
        const recipient = (await Contact.findById(recipientId)) || (await Lead.findById(recipientId))

        if (!recipient) {
          results.push({ recipientId, status: "failed", error: "Recipient not found" })
          continue
        }

        let emailSubject = subject
        let emailBody = body

        // Use template if provided
        if (templateId && emailTemplates[templateId]) {
          const template = emailTemplates[templateId]
          emailSubject = template.subject
          emailBody = template.html
        }

        // Replace placeholders
        const replacements = {
          firstName: recipient.firstName,
          lastName: recipient.lastName,
          company: recipient.company || recipient.account?.name || "",
          senderName: req.user.name,
          customMessage: customMessage || "",
        }

        Object.keys(replacements).forEach((key) => {
          const regex = new RegExp(`{{${key}}}`, "g")
          emailSubject = emailSubject.replace(regex, replacements[key])
          emailBody = emailBody.replace(regex, replacements[key])
        })

        const mailOptions = {
          from: `${req.user.name} <${process.env.SMTP_FROM}>`,
          to: recipient.email,
          subject: emailSubject,
          html: emailBody,
        }

        await transporter.sendMail(mailOptions)
        results.push({ recipientId, status: "sent", email: recipient.email })
      } catch (error) {
        results.push({ recipientId, status: "failed", error: error.message })
      }
    }

    const successCount = results.filter((r) => r.status === "sent").length
    const failureCount = results.filter((r) => r.status === "failed").length

    res.json({
      success: true,
      message: `Bulk email completed. ${successCount} sent, ${failureCount} failed.`,
      data: {
        successCount,
        failureCount,
        results,
      },
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
    })
  }
})

module.exports = router
