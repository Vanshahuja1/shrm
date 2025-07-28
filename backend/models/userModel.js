const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const validator = require("validator");

const userSchema = new mongoose.Schema(
  {
    upperManager: {
      type: String,
      default: "",
    },
    upperManagerName: { type: String, default: "" },
    id: {
      type: String,
      unique: true,
      trim: true,
      index: true,
    },
    name: {
      type: String,
      default: "",
    },
    employees: [
      {
        id: {
          type: String,
          required: true,
          trim: true,
        },
        upperManager: {
          type: String,
          trim: true,
        },
      },
    ],
    interns: [
      {
        id: {
          type: String,
          required: true,
          trim: true,
        },
        upperManager: {
          type: String,
          trim: true,
        },
      },
    ],
    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
    },
    phone: {
      type: String,
      trim: true,
      default: "",
    },
    password: {
      type: String,
      minlength: [6, "Password must be at least 6 characters"],
    },
    role: {
      type: String,
      enum: ["admin", "manager", "employee", "sales", "intern", "hr"],
      lowercase: true,
    },
    designation: {
      type: String,
      trim: true,
      default: "",
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
          trim: true,
          maxlength: 100,
        },
        url: {
          type: String,
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
      punchIn: Date,
      punchOut: Date,
      hoursWorked: {
        type: Number,
        default: 0,
        min: 0,
      },
    },
    salary: {
      type: Number,
      min: [0, "Salary cannot be negative"],
      default: 0,
    },
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
    lastLogin: Date,
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

userSchema.index({ role: 1 });
userSchema.index({ organizationName: 1 });
userSchema.index({ departmentName: 1 });
userSchema.index({ createdAt: -1 });

userSchema.virtual("employeeInfo").get(function () {
  return {
    id: this.id,
    email: this.email,
    phone: this.phone,
    name: this.name,
    role: this.role,
    department: this.departmentName,
    organization: this.organizationName,
  };
});

userSchema.virtual("reportRecords").get(function () {
  return {
    id: this.id,
    name: this.name,
    email: this.email,
    departmentName: this.departmentName,
    role: this.role,
    joiningDate: this.joiningDate,
    status: this.isActive ? "Active" : "Inactive",
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
    experience: (() => {
      const exp = (this.experience || "0").toString();
      const cleanExp = exp.replace(/\s*years?\s*/gi, "").trim();
      return `${cleanExp} years`;
    })(),
    contactInfo: {
      email: this.email || "",
      phone: this.phone || "",
      address: this.address || "",
    },
    documents: {
      pan: this.panCard || "",
      aadhar: this.adharCard || "",
    },
    joiningDate: this.joiningDate
      ? this.joiningDate.toISOString().split("T")[0]
      : "",
    performanceMetrics: {
      tasksPerDay: this.taskCountPerDay || 0,
      attendanceScore: this.attendanceCount30Days || 0,
      managerReviewRating: this.performance / 20 || 0,
      combinedPercentage: this.performance || 0,
    },
    attendance: {
      last7Days: new Array(7).fill(true),
      todayPresent: this.isActive,
    },
    upperManager: this.upperManager || null,
    upperManagerName: null,
  };
});

userSchema.pre("save", function (next) {
  this.wasNew = this.isNew;
  next();
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

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

userSchema.statics.findByEmployeeId = function (employeeId) {
  return this.findOne({ id: employeeId, isActive: true });
};

userSchema.post("save", async function (doc, next) {
  if (doc.wasNew) {
    try {
      const Report = mongoose.model("Report");
      const reportData = {
        id: doc.id,
        name: doc.name || "N/A",
        designation: doc.designation || "N/A",
        department: doc.departmentName || "N/A",
        email: doc.email || `${doc.id || "user"}@placeholder.email`,
        growthAndHR: {
          joiningDate: doc.joiningDate || new Date(),
        },
        finance: {
          currentSalary: (doc.salary || 0).toString(),
        },
      };
      await Report.create(reportData);
    } catch (error) {
      console.error(`Failed to create report for new user ${doc.id}:`, error);
    }
  }
  next();
});

module.exports = mongoose.model("User", userSchema);
