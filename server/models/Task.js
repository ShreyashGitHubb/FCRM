const mongoose = require("mongoose")

const TaskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please add task title"],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ["pending", "in_progress", "completed", "cancelled"],
      default: "pending",
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high", "urgent"],
      default: "medium",
    },
    dueDate: {
      type: Date,
      required: [true, "Please add due date"],
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
    relatedTo: {
      type: {
        type: String,
        enum: ["lead", "deal", "ticket"],
      },
      id: {
        type: mongoose.Schema.ObjectId,
        refPath: "relatedTo.type",
      },
    },
    completedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  },
)

module.exports = mongoose.model("Task", TaskSchema)
