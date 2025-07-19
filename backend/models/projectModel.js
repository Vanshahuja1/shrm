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

    description: {
      type: String,
      trim: true,
      default: "",
    },

    clientName: {
      type: String,
      trim: true,
      default: "",
    },

    value: {
      type: Number,
      min: 0,
      default: 0,
    },

    managerAssigned: [
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

    progressPercentage: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
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
