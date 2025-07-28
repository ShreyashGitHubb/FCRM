const mongoose = require("mongoose")

const AuditLogSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
    action: {
      type: String,
      required: true,
      enum: ["create", "update", "delete", "login", "logout", "approve", "reject"],
    },
    resource: {
      type: String,
      required: true, // e.g., "Lead", "Deal", "User", etc.
    },
    resourceId: {
      type: mongoose.Schema.ObjectId,
      required: true,
    },
    details: {
      type: mongoose.Schema.Types.Mixed, // Store old and new values
    },
    ipAddress: {
      type: String,
    },
    userAgent: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
)

module.exports = mongoose.model("AuditLog", AuditLogSchema)
