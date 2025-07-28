const mongoose = require("mongoose")

const ContactSchema = new mongoose.Schema(
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
    mobile: {
      type: String,
      trim: true,
    },
    jobTitle: {
      type: String,
      trim: true,
    },
    department: {
      type: String,
      trim: true,
    },
    account: {
      type: mongoose.Schema.ObjectId,
      ref: "Account",
      required: true,
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
    leadSource: {
      type: mongoose.Schema.ObjectId,
      ref: "Lead",
    },
    status: {
      type: String,
      enum: ["active", "inactive", "prospect"],
      default: "active",
    },
    notes: {
      type: String,
    },
    socialMedia: {
      linkedin: String,
      twitter: String,
      facebook: String,
    },
    address: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
      country: String,
    },
  },
  {
    timestamps: true,
  },
)

module.exports = mongoose.model("Contact", ContactSchema)
