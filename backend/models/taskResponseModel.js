const mongoose = require("mongoose")

const taskResponseSchema = new mongoose.Schema(
  {
    taskId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Task",
    },
    employeeId: {
      type: String,
      required: true,
      ref: "User",
    },
    response: {
      type: String,
      required: true,
      maxlength: 2000,
    },
    format: {
      type: String,
      enum: ["text", "document"],
      default: "text",
    },
    documents: [
      {
        filename: String,
        originalName: String,
        path: String,
        size: Number,
        mimetype: String,
        uploadedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    submittedAt: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ["submitted", "reviewed", "approved", "rejected"],
      default: "submitted",
    },
    reviewedBy: {
      type: String,
      default: null,
    },
    reviewedAt: {
      type: Date,
      default: null,
    },
    reviewComments: {
      type: String,
      default: "",
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      default: null,
    },
  },
  {
    timestamps: true,
  },
)

taskResponseSchema.index({ taskId: 1, employeeId: 1 }, { unique: true })
taskResponseSchema.index({ employeeId: 1 })
taskResponseSchema.index({ status: 1 })

module.exports = mongoose.model("TaskResponse", taskResponseSchema)
