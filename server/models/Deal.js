const mongoose = require("mongoose")

const DealSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please add deal title"],
      trim: true,
    },
    value: {
      type: Number,
      required: [true, "Please add deal value"],
    },
    stage: {
      type: String,
      enum: ["initiated", "qualification", "proposal", "negotiation", "won", "lost"],
      default: "initiated",
    },
    probability: {
      type: Number,
      min: 0,
      max: 100,
      default: 10,
    },
    expectedCloseDate: {
      type: Date,
      required: [true, "Please add expected close date"],
    },
    actualCloseDate: {
      type: Date,
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
    contact: {
      firstName: String,
      lastName: String,
      email: String,
      phone: String,
      company: String,
    },
    notes: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
)

module.exports = mongoose.model("Deal", DealSchema)
