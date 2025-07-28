const mongoose = require("mongoose")

const PipelineSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please add pipeline name"],
      trim: true,
    },
    description: {
      type: String,
    },
    isDefault: {
      type: Boolean,
      default: false,
    },
    stages: [
      {
        name: {
          type: String,
          required: true,
        },
        order: {
          type: Number,
          required: true,
        },
        probability: {
          type: Number,
          min: 0,
          max: 100,
          default: 0,
        },
        color: {
          type: String,
          default: "#3B82F6",
        },
      },
    ],
    createdBy: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  },
)

module.exports = mongoose.model("Pipeline", PipelineSchema)
