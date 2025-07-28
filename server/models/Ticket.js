const mongoose = require("mongoose")

const TicketSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please add ticket title"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Please add ticket description"],
    },
    status: {
      type: String,
      enum: ["open", "in_progress", "resolved", "closed"],
      default: "open",
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high", "urgent"],
      default: "medium",
    },
    category: {
      type: String,
      enum: ["technical", "billing", "general", "feature_request"],
      default: "general",
    },
    customer: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
    assignedTo: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
    createdBy: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
    resolvedAt: {
      type: Date,
    },
    closedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  },
)

module.exports = mongoose.model("Ticket", TicketSchema)
