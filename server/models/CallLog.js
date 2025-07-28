const mongoose = require("mongoose")

const CallLogSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["inbound", "outbound"],
      required: true,
    },
    duration: {
      type: Number, // in seconds
      required: true,
    },
    status: {
      type: String,
      enum: ["completed", "missed", "busy", "no_answer"],
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    contact: {
      type: mongoose.Schema.ObjectId,
      ref: "Contact",
    },
    deal: {
      type: mongoose.Schema.ObjectId,
      ref: "Deal",
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
    notes: {
      type: String,
    },
    followUpRequired: {
      type: Boolean,
      default: false,
    },
    followUpDate: {
      type: Date,
    },
  },
  {
    timestamps: true,
  },
)

module.exports = mongoose.model("CallLog", CallLogSchema)
