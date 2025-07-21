const User = require("../models/userModel")

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
      "dateOfBirth",
      "address",
      "joiningDate",
      "photo",
      "upperManager",
      "salary",
      "adharCard",
      "panCard",
      "experience",
      "organizationName",
      "departmentName",
      "bankDetails",
      "documents",
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

// Updated registration function without project fields
const registerEmployee = async (req, res) => {
  try {
    const {
      name,
      role,
      dateOfBirth,
      address,
      joiningDate,
      photo,
      upperManager,
      salary,
      adharCard,
      panCard,
      experience,
      organizationName,
      departmentName,
      bankDetails,
      documents, // This will now contain the structured document URLs
    } = req.body

    // Generate unique employee ID
    const employeeId = await User.getNextId(role)

    // Create new user with all provided fields
    const userData = {
      id: employeeId,
      name,
      password: employeeId, // Initial password same as ID
      role: role.toLowerCase(),
      organizationName,
      departmentName,
      isActive: true,
    }

    // Add optional fields if provided
    if (dateOfBirth) userData.dateOfBirth = new Date(dateOfBirth)
    if (address) userData.address = address
    if (joiningDate) userData.joiningDate = new Date(joiningDate)
    if (photo) userData.photo = photo
    if (upperManager) userData.upperManager = upperManager
    if (salary) userData.salary = Number(salary)
    if (adharCard) userData.adharCard = adharCard
    if (panCard) userData.panCard = panCard
    if (experience) userData.experience = Number(experience)

    // Handle bank details
    if (bankDetails) {
      userData.bankDetails = {
        accountHolder: bankDetails.accountHolder || "",
        accountNumber: bankDetails.accountNumber || "",
        ifsc: bankDetails.ifsc || "",
        branch: bankDetails.branch || "",
        accountType: bankDetails.accountType || "SAVING",
      }
    }

    // Handle structured documents
    if (documents) {
      const documentArray = []

      if (documents.aadharFront) {
        documentArray.push({
          title: "Aadhar Card (Front)",
          url: documents.aadharFront,
          type: "other",
        })
      }

      if (documents.aadharBack) {
        documentArray.push({
          title: "Aadhar Card (Back)",
          url: documents.aadharBack,
          type: "other",
        })
      }

      if (documents.panCard) {
        documentArray.push({
          title: "PAN Card",
          url: documents.panCard,
          type: "other",
        })
      }

      if (documents.resume) {
        documentArray.push({
          title: "Resume",
          url: documents.resume,
          type: "experience",
        })
      }

      userData.documents = documentArray
    }

    const user = await User.create(userData)

    res.status(201).json({
      success: true,
      message: "Employee registered successfully",
      data: {
        id: user.id,
        name: user.name,
        role: user.role,
        organizationName: user.organizationName,
        departmentName: user.departmentName,
      },
    })
  } catch (error) {
    console.error("Registration error:", error)
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((err) => err.message)
      return res.status(400).json({ success: false, message: messages.join(", ") })
    }
    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: "Employee ID already exists" })
    }
    res.status(500).json({ success: false, message: "Internal server error" })
  }
}

module.exports = {
  getProfile,
  updateProfile,
  registerEmployee,
}
