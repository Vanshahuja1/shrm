const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const validator = require("validator");

const userSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      // required: true,
      unique: true,
      trim: true,
      index: true,
    },
    name: {
      type: String,
      // required: [true, "Name is required"],
      trim: true,
      maxlength: [100, "Name cannot exceed 100 characters"],
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      // validate: {
      //   validator: (v) => !v || validator.isEmail(v),
      //   message: "Invalid email format",
      // },
      default: "",
    },
    phone: {
      type: String,
      trim: true,
      default: "",
    },
    password: {
      type: String,
      // required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
    },
    role: {
      type: String,
      // required: [true, "Role is required"],
      enum: ["admin", "manager", "employee", "sales", "intern", "hr"],
      lowercase: true,
    },

    dateOfBirth: {
      type: Date,
    },

    address: {
      type: String,
      trim: true,
      default: "",
    },

    performance: {
      type: Number,
      min: [0, "Performance cannot be below 0"],
      max: [100, "Performance cannot exceed 100"],
      default: 0,
    },

    joiningDate: {
      type: Date,
    },

    currentProjects: {
      type: [String],
      default: [],
    },

    pastProjects: {
      type: [String],
      default: [],
    },
    documents: [
      {
        title: {
          type: String,
          // required: true,
          trim: true,
          maxlength: 100,
        },
        url: {
          type: String,
          // required: true,
          trim: true,
          validate: {
            validator: (v) => validator.isURL(v),
            message: "Invalid document URL",
          },
        },
        type: {
          type: String,
          enum: ["experience", "certificate", "other"],
          default: "other",
        },
        uploadedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
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

    photo: {
      type: String,
      trim: true,
      default: "",
    },

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
      // validate: {
      //   validator: (v) => !v || /^\d{12}$/.test(v.replace(/\s/g, "")),
      //   message: "Aadhar card must be 12 digits",
      // },
      default: "",
    },

    panCard: {
      type: String,
      trim: true,
      uppercase: true,
      // validate: {
      //   validator: (v) => !v || /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(v),
      //   message: "Invalid PAN card format",
      // },
      default: "",
    },

    experience: {
      type: String,
      min: [0, "Experience cannot be negative"],
      default: "0",
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
  }
);

// Indexes
userSchema.index({ role: 1 });
userSchema.index({ organizationName: 1 });
userSchema.index({ departmentName: 1 });
userSchema.index({ createdAt: -1 });

// Virtual
userSchema.virtual("employeeInfo").get(function () {
  return {
    id: this.id,
    name: this.name,
    role: this.role,
    department: this.departmentName,
    organization: this.organizationName,
  };
});


userSchema.virtual("OrgMemberInfo").get(function () {
  return {
    id: this.id,
    name: this.name,
    role: this.role,
    department: this.departmentName,
    salary: this.salary,
    projects: this.projects || [],
    experience: `${this.experience || 0} years`,
    contactInfo: {
      email: this.email || "",
      phone: this.phone || "",
      address: this.address || "",
    },
    documents: {
      pan: this.panCard || "",
      aadhar: this.adharCard || "",
    },
    joiningDate: this.joiningDate ? this.joiningDate.toISOString().split('T')[0] : "",
    performanceMetrics: {
      tasksPerDay: this.taskCountPerDay || 0,
      attendanceScore: this.attendanceCount30Days || 0,
      managerReviewRating: this.performance / 20 || 0, // Convert 0-100 to 0-5 scale
      combinedPercentage: this.performance || 0,
    },
    attendance: {
      last7Days: new Array(7).fill(true), // You can implement actual logic here
      todayPresent: this.isActive,
    },
    reportsTo: this.upperManager || undefined,
  };
});

// Password Hash
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare Password
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// JWT check
userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    return JWTTimestamp < changedTimestamp;
  }
  return false;
};

// Static: Get Next ID
userSchema.statics.getNextId = async function (role) {
  const rolePrefixes = {
    admin: "ADM",
    manager: "MAG",
    employee: "EMP",
    sales: "SAL",
    intern: "INT",
    hr: "HR",
  };

  const prefix = rolePrefixes[role.toLowerCase()];
  if (!prefix) throw new Error("Invalid role");

  const lastUser = await this.findOne(
    { id: { $regex: `^${prefix}` } },
    { id: 1 }
  ).sort({ id: -1 });

  let nextNumber = 101;
  if (lastUser) {
    const currentNumber = parseInt(lastUser.id.replace(prefix, ""));
    nextNumber = currentNumber + 1;
  }

  return `${prefix}${nextNumber}`;
};

// Static: Find by Employee ID
userSchema.statics.findByEmployeeId = function (employeeId) {
  return this.findOne({ id: employeeId, isActive: true });
};

module.exports = mongoose.model("User", userSchema);
