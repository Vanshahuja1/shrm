const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")
const validator = require("validator")

const userSchema = new mongoose.Schema(
  {
    // Basic Information
    id: {
      type: String,
      unique: true,
      trim: true,
      index: true,
    },
    name: {
      type: String,
      trim: true,
      maxlength: [100, "Name cannot exceed 100 characters"],
    },
    role: {
      type: String,
      enum: ["Admin", "manager", "employee", "intern", "hr"],
      lowercase: true,
    },
    organizationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
      required: [true, "Organization is required"],
    },
    departmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
      required: [true, "Department is required"],
    },

    // Personal Information
    email: {
      type: String,
      trim: true,
      lowercase: true,
      default: "",
    },
    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
    },
    phone: {
      type: String,
      trim: true,
      default: "",
    },
    dateOfBirth: {
      type: Date,
    },
    currentAddress: {
      type: String,
      trim: true,
      default: "",
    },
    photo: {
      type: String,
      trim: true,
      default: "",
    },

    // Work Information
    password: {
      type: String,
      minlength: [6, "Password must be at least 6 characters"],
    },
    designation: {
      type: String,
      trim: true,
      default: "",
    },
    joiningDate: {
      type: Date,
    },
    upperManager: {
      type: String,
      trim: true,
      default: "",
    },
    salary: {
      type: Number,
      min: [0, "Salary cannot be negative"],
      default: 0,
    },
    experience: {
      type: Number,
      min: [0, "Experience cannot be negative"],
      default: 0,
    },

    // Identity Documents
    adharCard: {
      type: String,
      trim: true,
      default: "",
    },
    panCard: {
      type: String,
      trim: true,
      uppercase: true,
      default: "",
    },

    // Bank Details
    bankDetails: {
      accountHolder: {
        type: String,
        default: "",
        trim: true,
      },
      accountNumber: {
        type: String,
        default: "",
        trim: true,
      },
      ifsc: {
        type: String,
        default: "",
        uppercase: true,
        trim: true,
      },
      branch: {
        type: String,
        default: "",
        trim: true,
      },
      accountType: {
        type: String,
        enum: ["SAVING", "CURRENT"],
        default: "SAVING",
        uppercase: true,
      },
    },

    // Document Files
    documents: {
      aadharFront: {
        type: String,
        default: "",
      },
      aadharBack: {
        type: String,
        default: "",
      },
      panCard: {
        type: String,
        default: "",
      },
      resume: {
        type: String,
        default: "",
      },
      experienceLetter: {
        type: String,
        default: "",
      },
      passbookPhoto: {
        type: String,
        default: "",
      },
      tenthMarksheet: {
        type: String,
        default: "",
      },
      twelfthMarksheet: {
        type: String,
        default: "",
      },
      degreeMarksheet: {
        type: String,
        default: "",
      },
      policy: {
        type: String,
        default: "",
      },
    },

    // Work Performance & Tracking
    performance: {
      type: Number,
      min: [0, "Performance cannot be below 0"],
      max: [100, "Performance cannot exceed 100"],
      default: 0,
    },
    attendanceCount30Days: {
      type: Number,
      default: 0,
      min: 0,
    },
    taskCountPerDay: {
      type: Number,
      default: 0,
      min: 0,
    },
    tasks: {
      type: [String],
      default: [],
    },
    responses: {
      type: [String],
      default: [],
    },
    managers: {
      type: [String],
      default: [],
    },
    currentProjects: {
      type: [String],
      default: [],
    },
    pastProjects: {
      type: [String],
      default: [],
    },
    projects: [
      {
        type: String,
        trim: true,
      },
    ],

    // Work Log
    workLog: {
      punchIn: {
        type: Date,
      },
      punchOut: {
        type: Date,
      },
      hoursWorked: {
        type: Number,
        default: 0,
        min: 0,
      },
    },

    // Legacy fields for backward compatibility
    organizationName: {
      type: String,
      trim: true,
      default: "",
    },
    departmentName: {
      type: String,
      trim: true,
      default: "",
    },

    // Status & Metadata
    isActive: {
      type: Boolean,
      default: true,
    },
    lastLogin: {
      type: Date,
    },
    passwordChangedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
)

// Indexes
userSchema.index({ role: 1 })
userSchema.index({ organizationId: 1 })
userSchema.index({ departmentId: 1 })
userSchema.index({ createdAt: -1 })
userSchema.index({ id: 1 })

// Virtual for employee info
userSchema.virtual("employeeInfo").get(function () {
  return {
    id: this.id,
    email: this.email,
    phone: this.phone,
    name: this.name,
    role: this.role,
    department: this.departmentName,
    organization: this.organizationName,
  }
})

// Pre-save middleware to populate organization and department names
userSchema.pre("save", async function (next) {
  if (this.isModified("organizationId") || this.isModified("departmentId")) {
    try {
      const Organization = mongoose.model("Organization")
      const Department = mongoose.model("Department")

      if (this.organizationId) {
        const org = await Organization.findById(this.organizationId)
        if (org) this.organizationName = org.name
      }

      if (this.departmentId) {
        const dept = await Department.findById(this.departmentId)
        if (dept) this.departmentName = dept.name
      }
    } catch (error) {
      console.error("Error populating org/dept names:", error)
    }
  }
  next()
})

// Password Hash
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next()
  const salt = await bcrypt.genSalt(12)
  this.password = await bcrypt.hash(this.password, salt)
  next()
})

// Compare Password
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password)
}

// JWT check
userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = Number.parseInt(this.passwordChangedAt.getTime() / 1000, 10)
    return JWTTimestamp < changedTimestamp
  }
  return false
}

// Static: Get Next ID
userSchema.statics.getNextId = async function (role) {
  const rolePrefixes = {
    admin: "ADM",
    manager: "MAG",
    employee: "EMP",
    sales: "SAL",
    intern: "INT",
    hr: "HR",
  }

  const prefix = rolePrefixes[role.toLowerCase()]
  if (!prefix) throw new Error("Invalid role")

  const lastUser = await this.findOne({ id: { $regex: `^${prefix}` } }, { id: 1 }).sort({ id: -1 })

  let nextNumber = 101
  if (lastUser) {
    const currentNumber = Number.parseInt(lastUser.id.replace(prefix, ""))
    nextNumber = currentNumber + 1
  }

  return `${prefix}${nextNumber}`
}

// Static: Find by Employee ID
userSchema.statics.findByEmployeeId = function (employeeId) {
  return this.findOne({ id: employeeId, isActive: true })
    .populate("organizationId", "name")
    .populate("departmentId", "name")
}

module.exports = mongoose.model("User", userSchema)
