const User = require("../models/User")

const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password")

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" })
    }

    res.json({ success: true, data: user })
  } catch (error) {
    console.error("Get profile error:", error)
    res.status(500).json({ success: false, message: "Internal server error" })
  }
}

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

    const user = await User.findByIdAndUpdate(req.user._id, updates, {
      new: true,
      runValidators: true,
    }).select("-password")

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" })
    }

    res.json({ success: true, message: "Profile updated successfully", data: user })
  } catch (error) {
    console.error("Update profile error:", error)

    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((err) => err.message)
      return res.status(400).json({ success: false, message: messages.join(", ") })
    }

    res.status(500).json({ success: false, message: "Internal server error" })
  }
}

module.exports = {
  getProfile,
  updateProfile,
}
