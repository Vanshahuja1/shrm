const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")
const validator = require("validator")

const userSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      maxlength: [100, "Name cannot exceed 100 characters"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
    },
    role: {
      type: String,
      required: [true, "Role is required"],
      enum: ["admin", "manager", "employee", "sales", "intern", "hr"],
      lowercase: true,
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
    adharCard: {
      type: String,
      trim: true,
      validate: {
        validator: (v) => !v || /^\d{12}$/.test(v.replace(/\s/g, "")),
        message: "Aadhar card must be 12 digits",
      },
      default: "",
    },
    panCard: {
      type: String,
      trim: true,
      uppercase: true,
      validate: {
        validator: (v) => !v || /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(v),
        message: "Invalid PAN card format",
      },
      default: "",
    },
    experience: {
      type: Number,
      min: [0, "Experience cannot be negative"],
      default: 0,
    },
    projects: [
      {
        type: String,
        trim: true,
      },
    ],
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

// Indexes for better performance
userSchema.index({ role: 1 })
userSchema.index({ organizationName: 1 })
userSchema.index({ departmentName: 1 })
userSchema.index({ createdAt: -1 })

// Virtual for full employee info
userSchema.virtual("employeeInfo").get(function () {
  return {
    id: this.id,
    name: this.name,
    role: this.role,
    department: this.departmentName,
    organization: this.organizationName,
  }
})

// Pre-save middleware to hash password
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next()

  try {
    const salt = await bcrypt.genSalt(12)
    this.password = await bcrypt.hash(this.password, salt)
    next()
  } catch (error) {
    next(error)
  }
})

// Instance method to check password
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password)
}

// Instance method to check if password was changed after JWT was issued
userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = Number.parseInt(this.passwordChangedAt.getTime() / 1000, 10)
    return JWTTimestamp < changedTimestamp
  }
  return false
}

// Static method to get next ID for a role
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

  // Find the highest ID for this role
  const lastUser = await this.findOne({ id: { $regex: `^${prefix}` } }, { id: 1 }).sort({ id: -1 })

  let nextNumber = 101
  if (lastUser) {
    const currentNumber = Number.parseInt(lastUser.id.replace(prefix, ""))
    nextNumber = currentNumber + 1
  }

  return `${prefix}${nextNumber}`
}

// Static method to find by employee ID
userSchema.statics.findByEmployeeId = function (employeeId) {
  return this.findOne({ id: employeeId, isActive: true })
}

module.exports = mongoose.model("User", userSchema)
