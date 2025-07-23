const mongoose = require("mongoose");
const validator = require("validator");

const projectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Project name is required"],
      trim: true,
      maxlength: [150, "Project name too long"],
    },

    assignDate: {
      type: Date,
      required: [true, "Assign date is required"],
    },

    startDate: {
      type: Date,
    },

    deadline: {
      type: Date,
      required: true,
    },

    endDate: {
      type: Date,
    },

    projectScope: {
      type: String,
      trim: true,
      default: "",
    },

    client: {
      type: String,
      trim: true,
      default: "",
    },

    amount: {
      type: Number,
      min: 0,
      default: 0,
    },

    managersInvolved: [
      {
        type: String,
        trim: true,
      },
    ],

    departmentsInvolved: [
      {
        type: String,
        trim: true,
      },
    ],

    membersInvolved: [
      {
        type: String,
        trim: true,
      },
    ],

    skillsRequired: [
      {
        type: String,
        trim: true,
      },
    ],

    completionPercentage: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },
    status: {
      type: String,
      enum: ["pending", "active", "completed", "on-hold", "cancelled"],
      default: "pending",
    },
    clientInputs: {
      type: String,
      trim: true,
      default: "",
    },

    effectAnalysis: {
      type: String,
      trim: true,
      default: "",
    },

    teamRemarks: {
      type: String,
      trim: true,
      default: "",
    },

    clientRemarks: {
      type: String,
      trim: true,
      default: "",
    },

    ongoing: {
      type: Boolean,
      default: true,
    },

    links: [
      {
        type: String,
        trim: true,
        validate: {
          validator: validator.isURL,
          message: "Invalid project link",
        },
      },
    ],

    documentation: [
      {
        title: {
          type: String,
          required: true,
          trim: true,
        },
        url: {
          type: String,
          required: true,
          trim: true,
          validate: {
            validator: validator.isURL,
            message: "Invalid document URL",
          },
        },
        uploadedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

module.exports = mongoose.model("Project", projectSchema);
