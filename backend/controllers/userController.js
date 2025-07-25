const User = require("../models/userModel");

// Add this helper function at the top of the file
const parseAndValidateDate = (dateString) => {
  if (!dateString) return undefined;

  // Try parsing different date formats
  const date = new Date(dateString);
  if (date instanceof Date && !isNaN(date)) {
    return date;
  }

  // Try parsing DD-MM-YYYY format
  const [day, month, year] = dateString.split(/[-/]/);
  const parsedDate = new Date(year, month - 1, day);
  if (parsedDate instanceof Date && !isNaN(parsedDate)) {
    return parsedDate;
  }

  return undefined;
};

const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    res.json({ success: true, data: user });
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
const addEmp = async (req, res) => {
  try {
    // Parse dates
    const dateOfBirth = parseAndValidateDate(req.body.personalInfo.dob);
    const joiningDate = parseAndValidateDate(req.body.joiningDetails.joiningDate);

    // Validate dateOfBirth
    if (req.body.personalInfo.dob && !dateOfBirth) {
      return res.status(400).json({
        success: false,
        message: "Invalid date of birth format. Please use YYYY-MM-DD format",
      });
    }

    // Validate joiningDate
    if (req.body.joiningDetails.joiningDate && !joiningDate) {
      return res.status(400).json({
        success: false,
        message: "Invalid joining date format. Please use YYYY-MM-DD format",
      });
    }

    // Get the next unique ID for the role
    const nextId = await User.getNextId(req.body.departmentInfo.role);

    // Create the user with the generated ID and all available fields
    const user = new User({
      // Basic Info
      id: req.body.joiningDetails.employeeId || nextId,
      name: req.body.personalInfo.name,
      email: req.body.personalInfo.email,
      phone: req.body.personalInfo.phone,
      password: nextId, // Setting initial password same as ID
      role: req.body.departmentInfo.role.toLowerCase(),
      
      // Personal Info
      gender: req.body.personalInfo.gender,
      dateOfBirth: dateOfBirth,
      address: req.body.personalInfo.address,
      adharCard: req.body.personalInfo.aadhar,
      panCard: req.body.personalInfo.pan,
      emergencyContact: req.body.personalInfo.emergencyContact,
      
      // Department Info
      organizationName: req.body.departmentInfo.departmentName || "",
      departmentName: req.body.departmentInfo.departmentName || "",
      joiningDate: joiningDate,
      upperManager: req.body.departmentInfo.managerName || "",
      
      // Financial Info
      salary: Number(req.body.financialInfo.salary) || 0,
      bankDetails: req.body.financialInfo.bankInfo && {
        accountHolder: req.body.financialInfo.bankInfo.accountHolderName || "",
        accountNumber: req.body.financialInfo.bankInfo.accountNumber || "",
        ifsc: req.body.financialInfo.bankInfo.ifscCode || "",
        branch: req.body.financialInfo.bankInfo.branch || "",
        accountType: req.body.financialInfo.bankInfo.accountType || "SAVING"
      },

      // Work Info
      experience: "0", // Default value as per form
      projects: [], // Default empty array
      isActive: true,
      
      // Additional Info
      taxCode: req.body.payrollInfo.taxCode || "",
      benefits: req.body.payrollInfo.benefits || "",
      
      // Task Info (if needed)
      tasks: req.body.taskInfo ? [{
        name: req.body.taskInfo.taskName,
        assignedOn: parseAndValidateDate(req.body.taskInfo.assignedOn),
        assignedBy: req.body.taskInfo.assignedBy
      }] : []
    });

    await user.save();

    // Return success response
    res.status(201).json({
      success: true,
      data: {
        id: user.id,
        name: user.name,
        role: user.role,
        email: user.email,
        organizationName: user.organizationName,
        departmentName: user.departmentName,
        dateOfBirth: user.dateOfBirth,
        joiningDate: user.joiningDate
      }
    });

  } catch (err) {
    console.error("Add employee error:", err);
    
    if (err.name === "ValidationError") {
      const messages = Object.values(err.errors).map(error => error.message);
      return res.status(400).json({ 
        success: false, 
        message: "Validation error", 
        errors: messages 
      });
    }
    
    res.status(400).json({ 
      success: false, 
      message: err.message 
    });
  }
};

const getById = async (req, res) => {
  try {
    const user = await User.findOne({ id: req.params.id }).select("-password");
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    res.json({ success: true, data: user });
  } catch (error) {
    console.error("Get user by ID error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    if (!users || users.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "No active users found" });
    }
    res.json({ success: true, data: users });
  } catch (error) {
    console.error("Get all users error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const updateEmp = async (req, res) => {
  try {
    const user = await User.findOne({ id: req.params.id });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Update user fields
    Object.keys(req.body).forEach((key) => {
      user[key] = req.body[key];
    });

    await user.save();

    res.json({ success: true });
  } catch (error) {
    console.error("Update employee error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const deleteEmp = async(req, res)=>{
  try{
    const user = await User.findOne({ id: req.params.id });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    await User.findOneAndDelete({id: req.params.id});
    return res.status(200).json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    console.error("Delete employee error:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
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
      "salary",
      "adharCard",
      "panCard",
      "experience",
      "organizationName",
      "departmentName",
      "bankDetails",
      "documents",
    ];

    const updates = {};
    Object.keys(req.body).forEach((key) => {
      if (allowedUpdates.includes(key)) {
        updates[key] = req.body[key];
      }
    });

    const user = await User.findByIdAndUpdate(req.user._id, updates, {
      new: true,
      runValidators: true,
    }).select("-password");

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res.json({
      success: true,
      message: "Profile updated successfully",
      data: user,
    });
  } catch (error) {
    console.error("Update profile error:", error);
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((err) => err.message);
      return res
        .status(400)
        .json({ success: false, message: messages.join(", ") });
    }
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

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
      salary,
      adharCard,
      panCard,
      experience,
      organizationName,
      departmentName,
      bankDetails,
      documents, // This will now contain the structured document URLs
    } = req.body;

    // Generate unique employee ID
    const employeeId = await User.getNextId(role);

    // Create new user with all provided fields
    const userData = {
      id: employeeId,
      name,
      password: employeeId, // Initial password same as ID
      role: role.toLowerCase(),
      organizationName,
      departmentName,
      isActive: true,
    };

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
      };
    }

    // Handle structured documents
    if (documents) {
      const documentArray = [];

      if (documents.aadharFront) {
        documentArray.push({
          title: "Aadhar Card (Front)",
          url: documents.aadharFront,
          type: "other",
        });
      }

      if (documents.aadharBack) {
        documentArray.push({
          title: "Aadhar Card (Back)",
          url: documents.aadharBack,
          type: "other",
        });
      }

      if (documents.panCard) {
        documentArray.push({
          title: "PAN Card",
          url: documents.panCard,
          type: "other",
        });
      }

      if (documents.resume) {
        documentArray.push({
          title: "Resume",
          url: documents.resume,
          type: "experience",
        });
      }

      userData.documents = documentArray;
    }

    const user = await User.create(userData);

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
    });
  } catch (error) {
    console.error("Registration error:", error);
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((err) => err.message);
      return res
        .status(400)
        .json({ success: false, message: messages.join(", ") });
    }
    if (error.code === 11000) {
      return res
        .status(400)
        .json({ success: false, message: "Employee ID already exists" });
    }
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

module.exports = {
  getProfile,
  updateProfile,
  registerEmployee,
  getAllUsers,
  getById,
  addEmp,
  deleteEmp,
  updateEmp
};
