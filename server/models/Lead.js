const mongoose = require("mongoose")

const LeadSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "Please add first name"],
      trim: true,
    },
    lastName: {
      type: String,
      required: [true, "Please add last name"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Please add email"],
      lowercase: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    company: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ["new", "contacted", "qualified", "converted", "lost"],
      default: "new",
    },
    source: {
      type: String,
      enum: ["website", "referral", "social_media", "email_campaign", "cold_call", "other"],
      default: "website",
    },
    assignedTo: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
    notes: {
      type: String,
    },
    convertedToDeal: {
      type: mongoose.Schema.ObjectId,
      ref: "Deal",
    },
  },
  {
    timestamps: true,
  },
)

module.exports = mongoose.model("Lead", LeadSchema)
