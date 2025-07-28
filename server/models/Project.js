const mongoose = require("mongoose")

const ProjectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please add project name"],
      trim: true,
    },
    description: {
      type: String,
    },
    status: {
      type: String,
      enum: ["planning", "active", "on_hold", "completed", "cancelled"],
      default: "planning",
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high", "urgent"],
      default: "medium",
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    budget: {
      type: Number,
    },
    actualCost: {
      type: Number,
      default: 0,
    },
    progress: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },
    account: {
      type: mongoose.Schema.ObjectId,
      ref: "Account",
    },
    contact: {
      type: mongoose.Schema.ObjectId,
      ref: "Contact",
    },
    assignedTo: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
    teamMembers: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "User",
      },
    ],
    createdBy: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
    milestones: [
      {
        name: String,
        description: String,
        dueDate: Date,
        status: {
          type: String,
          enum: ["pending", "completed", "overdue"],
          default: "pending",
        },
        completedAt: Date,
      },
    ],
  },
  {
    timestamps: true,
  },
)

module.exports = mongoose.model("Project", ProjectSchema)
