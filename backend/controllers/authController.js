const jwt = require("jsonwebtoken")
const User = require("../models/userModel")

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

    if (!name || !role) {
      return res.status(400).json({ success: false, message: "Name and role are required" })
    }

    const validRoles = ["admin", "manager", "employee", "sales", "intern", "hr"]
    if (!validRoles.includes(role.toLowerCase())) {
      return res.status(400).json({ success: false, message: "Invalid role specified" })
    }

    const existingUser = await User.findOne({
      name: { $regex: new RegExp(`^${name}$`, "i") },
      isActive: true,
    })

    if (existingUser) {
      return res.status(400).json({ success: false, message: "User with this name already exists" })
    }

    const userId = await User.getNextId(role)

    const projectsArray = Array.isArray(projects)
      ? projects
      : typeof projects === "string"
        ? projects.split(",").map(p => p.trim()).filter(p => p)
        : []

    const newUser = new User({
      id: userId,
      name: name.trim(),
      password: userId,
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
      const messages = Object.values(error.errors).map(err => err.message)
      return res.status(400).json({ success: false, message: messages.join(", ") })
    }

    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: "User ID already exists" })
    }

    res.status(500).json({ success: false, message: "Internal server error" })
  }
}

const login = async (req, res) => {
  try {
    const { id, password } = req.body

    if (!id || !password) {
      return res.status(400).json({ success: false, message: "ID and password are required" })
    }

    const user = await User.findByEmployeeId(id)
    if (!user) {
      return res.status(401).json({ success: false, message: "Invalid credentials" })
    }

    const isPasswordValid = await user.comparePassword(password)
    if (!isPasswordValid) {
      return res.status(401).json({ success: false, message: "Invalid credentials" })
    }

    user.lastLogin = new Date()
    await user.save({ validateBeforeSave: false })

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
    res.status(500).json({ success: false, message: "Internal server error" })
  }
}

const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ success: false, message: "Current password and new password are required" })
    }

    const user = await User.findById(req.user._id)

    const isCurrentPasswordValid = await user.comparePassword(currentPassword)
    if (!isCurrentPasswordValid) {
      return res.status(400).json({ success: false, message: "Current password is incorrect" })
    }

    user.password = newPassword
    user.passwordChangedAt = new Date()
    await user.save()

    res.json({ success: true, message: "Password changed successfully" })
  } catch (error) {
    console.error("Change password error:", error)
    res.status(500).json({ success: false, message: "Internal server error" })
  }
}

module.exports = {
  register,
  login,
  changePassword,
}
