const mongoose = require("mongoose")

const AccountSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please add account name"],
      trim: true,
    },
    website: {
      type: String,
      trim: true,
    },
    industry: {
      type: String,
      trim: true,
    },
    type: {
      type: String,
      enum: ["prospect", "customer", "partner", "vendor"],
      default: "prospect",
    },
    size: {
      type: String,
      enum: ["small", "medium", "large", "enterprise"],
      default: "small",
    },
    revenue: {
      type: Number,
    },
    employees: {
      type: Number,
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
    address: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
      country: String,
    },
    description: {
      type: String,
    },
    status: {
      type: String,
      enum: ["active", "inactive", "prospect"],
      default: "active",
    },
  },
  {
    timestamps: true,
  },
)

module.exports = mongoose.model("Account", AccountSchema)
