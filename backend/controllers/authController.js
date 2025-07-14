const jwt = require("jsonwebtoken")
const User = require("../models/User")
const Counter = require("../models/Counter")

// Generate JWT token
const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      userId: user.id,
      role: user.role,
      name: user.name,
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "24h" },
  )
}

// Register new user
const register = async (req, res) => {
  try {
    const {
      name,
      role,
      upperManager = "",
      salary = 0,
      adharCard = "",
      panCard = "",
      experience = 0,
      projects = [],
      organizationName = "",
      departmentName = "",
    } = req.body

    // Validate required fields
    if (!name || !role) {
      return res.status(400).json({
        success: false,
        message: "Name and role are required",
      })
    }

    // Validate role
    const validRoles = ["admin", "manager", "employee", "sales", "intern", "hr"]
    if (!validRoles.includes(role.toLowerCase())) {
      return res.status(400).json({
        success: false,
        message: "Invalid role specified",
      })
    }

    // Check if user with same name already exists
    const existingUser = await User.findOne({
      name: { $regex: new RegExp(`^${name}$`, "i") },
      isActive: true,
    })

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User with this name already exists",
      })
    }

    // Generate dynamic ID
    const userId = await User.getNextId(role)

    // Process projects array
    const projectsArray = Array.isArray(projects)
      ? projects
      : typeof projects === "string"
        ? projects
            .split(",")
            .map((p) => p.trim())
            .filter((p) => p)
        : []

    // Create new user
    const newUser = new User({
      id: userId,
      name: name.trim(),
      password: userId, // Initial password is same as ID
      role: role.toLowerCase(),
      upperManager: upperManager.trim(),
      salary: Number(salary) || 0,
      adharCard: adharCard.trim(),
      panCard: panCard.trim().toUpperCase(),
      experience: Number(experience) || 0,
      projects: projectsArray,
      organizationName: organizationName.trim(),
      departmentName: departmentName.trim(),
    })

    await newUser.save()

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: {
        id: userId,
        name: newUser.name,
        role: newUser.role,
        message: `Login ID and password: ${userId}`,
      },
    })
  } catch (error) {
    console.error("Registration error:", error)

    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((err) => err.message)
      return res.status(400).json({
        success: false,
        message: messages.join(", "),
      })
    }

    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "User ID already exists",
      })
    }

    res.status(500).json({
      success: false,
      message: "Internal server error",
    })
  }
}

// Login user
const login = async (req, res) => {
  try {
    const { id, password } = req.body

    // Validate input
    if (!id || !password) {
      return res.status(400).json({
        success: false,
        message: "ID and password are required",
      })
    }

    // Find user by employee ID
    const user = await User.findByEmployeeId(id)
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      })
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password)
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      })
    }

    // Update last login
    user.lastLogin = new Date()
    await user.save({ validateBeforeSave: false })

    // Generate token
    const token = generateToken(user)

    res.json({
      success: true,
      message: "Login successful",
      data: {
        token,
        user: {
          id: user.id,
          name: user.name,
          role: user.role,
          organizationName: user.organizationName,
          departmentName: user.departmentName,
          lastLogin: user.lastLogin,
        },
      },
    })
  } catch (error) {
    console.error("Login error:", error)
    res.status(500).json({
      success: false,
      message: "Internal server error",
    })
  }
}

// Get user profile
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password")

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      })
    }

    res.json({
      success: true,
      data: user,
    })
  } catch (error) {
    console.error("Get profile error:", error)
    res.status(500).json({
      success: false,
      message: "Internal server error",
    })
  }
}

// Update user profile
const updateProfile = async (req, res) => {
  try {
    const allowedUpdates = [
      "name",
      "upperManager",
      "salary",
      "adharCard",
      "panCard",
      "experience",
      "projects",
      "organizationName",
      "departmentName",
    ]

    const updates = {}
    Object.keys(req.body).forEach((key) => {
      if (allowedUpdates.includes(key)) {
        updates[key] = req.body[key]
      }
    })

    const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true, runValidators: true }).select(
      "-password",
    )

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      })
    }

    res.json({
      success: true,
      message: "Profile updated successfully",
      data: user,
    })
  } catch (error) {
    console.error("Update profile error:", error)

    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((err) => err.message)
      return res.status(400).json({
        success: false,
        message: messages.join(", "),
      })
    }

    res.status(500).json({
      success: false,
      message: "Internal server error",
    })
  }
}

// Get all users (admin only)
const getAllUsers = async (req, res) => {
  try {
    const page = Number.parseInt(req.query.page) || 1
    const limit = Number.parseInt(req.query.limit) || 10
    const skip = (page - 1) * limit

    const filter = { isActive: true }

    // Add role filter if specified
    if (req.query.role) {
      filter.role = req.query.role.toLowerCase()
    }

    // Add department filter if specified
    if (req.query.department) {
      filter.departmentName = { $regex: req.query.department, $options: "i" }
    }

    const users = await User.find(filter).select("-password").sort({ createdAt: -1 }).skip(skip).limit(limit)

    const total = await User.countDocuments(filter)

    res.json({
      success: true,
      data: {
        users,
        pagination: {
          current: page,
          pages: Math.ceil(total / limit),
          total,
          limit,
        },
      },
    })
  } catch (error) {
    console.error("Get all users error:", error)
    res.status(500).json({
      success: false,
      message: "Internal server error",
    })
  }
}

// Change password
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Current password and new password are required",
      })
    }

    const user = await User.findById(req.user._id)

    // Check current password
    const isCurrentPasswordValid = await user.comparePassword(currentPassword)
    if (!isCurrentPasswordValid) {
      return res.status(400).json({
        success: false,
        message: "Current password is incorrect",
      })
    }

    // Update password
    user.password = newPassword
    user.passwordChangedAt = new Date()
    await user.save()

    res.json({
      success: true,
      message: "Password changed successfully",
    })
  } catch (error) {
    console.error("Change password error:", error)
    res.status(500).json({
      success: false,
      message: "Internal server error",
    })
  }
}

module.exports = {
  register,
  login,
  getProfile,
  updateProfile,
  getAllUsers,
  changePassword,
}
