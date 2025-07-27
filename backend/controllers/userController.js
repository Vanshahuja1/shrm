const User = require("../models/userModel");
const Report = require("../models/reportModel");

// Utility Functions
const parseAndValidateDate = (dateString) => {
  if (!dateString) return null;

  // Try parsing standard date formats
  const date = new Date(dateString);
  if (date instanceof Date && !isNaN(date)) {
    return date;
  }

  // Try parsing DD-MM-YYYY format
  const [day, month, year] = dateString.split(/[-/]/);
  if (day && month && year) {
    const parsedDate = new Date(year, month - 1, day);
    if (parsedDate instanceof Date && !isNaN(parsedDate)) {
      return parsedDate;
    }
  }

  return null;
};

const validateDateField = (dateValue, fieldName) => {
  if (dateValue && !parseAndValidateDate(dateValue)) {
    return `Invalid ${fieldName} format. Please use YYYY-MM-DD format`;
  }
  return null;
};

const createErrorResponse = (res, statusCode, message, errors = null) => {
  const response = { success: false, message };
  if (errors) response.errors = errors;
  return res.status(statusCode).json(response);
};

const createSuccessResponse = (res, statusCode, data = null, message = null) => {
  const response = { success: true };
  if (data) response.data = data;
  if (message) response.message = message;
  return res.status(statusCode).json(response);
};

// Data Mapping Functions
const mapPersonalInfo = (personalInfo, existingUser = null) => {
  if (!personalInfo) return {};
  
  const mapped = {};
  if (personalInfo.name) mapped.name = personalInfo.name;
  if (personalInfo.email) mapped.email = personalInfo.email;
  if (personalInfo.phone) mapped.phone = personalInfo.phone;
  if (personalInfo.gender) mapped.gender = personalInfo.gender;
  if (personalInfo.address) mapped.address = personalInfo.address;
  if (personalInfo.aadhar) mapped.adharCard = personalInfo.aadhar;
  if (personalInfo.pan) mapped.panCard = personalInfo.pan;
  if (personalInfo.emergencyContact) mapped.emergencyContact = personalInfo.emergencyContact;
  
  if (personalInfo.dob) {
    const dateOfBirth = parseAndValidateDate(personalInfo.dob);
    if (dateOfBirth) mapped.dateOfBirth = dateOfBirth;
  } else if (existingUser) {
    mapped.dateOfBirth = existingUser.dateOfBirth;
  }
  
  return mapped;
};

const mapDepartmentInfo = (departmentInfo, joiningDetails = null) => {
  if (!departmentInfo && !joiningDetails) return {};
  
  const mapped = {};
  
  if (departmentInfo) {
    if (departmentInfo.role) mapped.role = departmentInfo.role.toLowerCase();
    if (departmentInfo.departmentName) {
      mapped.organizationName = departmentInfo.departmentName;
      mapped.departmentName = departmentInfo.departmentName;
    }
    if (departmentInfo.managerName) mapped.upperManager = departmentInfo.managerName;
    if (departmentInfo.designation) mapped.designation = departmentInfo.designation;
  }
  
  if (joiningDetails?.joiningDate) {
    const joiningDate = parseAndValidateDate(joiningDetails.joiningDate);
    if (joiningDate) mapped.joiningDate = joiningDate;
  }
  
  return mapped;
};

const mapFinancialInfo = (financialInfo, existingBankDetails = null) => {
  if (!financialInfo) return {};
  
  const mapped = {};
  
  if (financialInfo.salary) {
    mapped.salary = Number(financialInfo.salary) || 0;
  }
  
  if (financialInfo.bankInfo) {
    const bankInfo = financialInfo.bankInfo;
    mapped.bankDetails = {
      accountHolder: bankInfo.accountHolderName || existingBankDetails?.accountHolder || "",
      accountNumber: bankInfo.accountNumber || existingBankDetails?.accountNumber || "",
      ifsc: bankInfo.ifscCode || existingBankDetails?.ifsc || "",
      branch: bankInfo.branch || existingBankDetails?.branch || "",
      accountType: bankInfo.accountType || existingBankDetails?.accountType || "SAVING"
    };
  }
  
  return mapped;
};

const mapPayrollInfo = (payrollInfo) => {
  if (!payrollInfo) return {};
  
  const mapped = {};
  if (payrollInfo.taxCode) mapped.taxCode = payrollInfo.taxCode;
  if (payrollInfo.benefits) mapped.benefits = payrollInfo.benefits;
  
  return mapped;
};

const mapDocuments = (documents) => {
  if (!documents) return [];
  
  const documentArray = [];
  const documentMappings = [
    { key: 'aadharFront', title: 'Aadhar Card (Front)', type: 'other' },
    { key: 'aadharBack', title: 'Aadhar Card (Back)', type: 'other' },
    { key: 'panCard', title: 'PAN Card', type: 'other' },
    { key: 'resume', title: 'Resume', type: 'experience' }
  ];
  
  documentMappings.forEach(({ key, title, type }) => {
    if (documents[key]) {
      documentArray.push({ title, url: documents[key], type });
    }
  });
  
  return documentArray;
};

const mapTaskInfo = (taskInfo) => {
  if (!taskInfo) return [];
  
  return [{
    name: taskInfo.taskName,
    assignedOn: parseAndValidateDate(taskInfo.assignedOn),
    assignedBy: taskInfo.assignedBy
  }];
};

// Validation Functions
const validateEmployeeData = (body) => {
  const errors = [];
  
  // Validate required fields
  if (!body.personalInfo?.name) {
    errors.push("Name is required");
  }
  
  if (!body.personalInfo?.email) {
    errors.push("Email is required");
  }
  
  if (!body.departmentInfo?.role) {
    errors.push("Role is required");
  }
  
  // Validate date formats
  const dobError = validateDateField(body.personalInfo?.dob, "date of birth");
  if (dobError) errors.push(dobError);
  
  const joiningDateError = validateDateField(body.joiningDetails?.joiningDate, "joining date");
  if (joiningDateError) errors.push(joiningDateError);
  
  const taskDateError = validateDateField(body.taskInfo?.assignedOn, "task assigned date");
  if (taskDateError) errors.push(taskDateError);
  
  return errors;
};

// Profile Management
const getProfile = async (req, res) => {
  try {
    if (!req.user?._id) {
      return createErrorResponse(res, 401, "Authentication required");
    }

    const user = await User.findById(req.user._id).select("-password");
    if (!user) {
      return createErrorResponse(res, 404, "User not found");
    }
    
    return createSuccessResponse(res, 200, user);
    
  } catch (error) {
    console.error("Get profile error:", error);
    return createErrorResponse(res, 500, "Internal server error");
  }
};

const updateProfile = async (req, res) => {
  try {
    if (!req.user?._id) {
      return createErrorResponse(res, 401, "Authentication required");
    }

    const allowedUpdates = [
      "name", "dateOfBirth", "address", "joiningDate", "photo", 
      "upperManager", "salary", "adharCard", "panCard", "experience",
      "organizationName", "departmentName", "bankDetails", "documents"
    ];

    const updates = {};
    Object.keys(req.body).forEach((key) => {
      if (allowedUpdates.includes(key)) {
        // Handle date fields specially
        if ((key === "dateOfBirth" || key === "joiningDate") && req.body[key]) {
          const parsedDate = parseAndValidateDate(req.body[key]);
          if (parsedDate) {
            updates[key] = parsedDate;
          }
        } else {
          updates[key] = req.body[key];
        }
      }
    });

    const user = await User.findByIdAndUpdate(req.user._id, updates, {
      new: true,
      runValidators: true,
    }).select("-password");

    if (!user) {
      return createErrorResponse(res, 404, "User not found");
    }

    return createSuccessResponse(res, 200, user, "Profile updated successfully");

  } catch (error) {
    console.error("Update profile error:", error);
    
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((err) => err.message);
      return createErrorResponse(res, 400, "Validation error", messages);
    }
    
    return createErrorResponse(res, 500, "Internal server error");
  }
};

// Employee Management
const addEmp = async (req, res) => {
  try {
    // Validate input data
    const validationErrors = validateEmployeeData(req.body);
    if (validationErrors.length > 0) {
      return createErrorResponse(res, 400, "Validation error", validationErrors);
    }

    // Get the next unique ID for the role
    const nextId = await User.getNextId(req.body.departmentInfo.role);

    // Map all the data
    const personalInfo = mapPersonalInfo(req.body.personalInfo);
    const departmentInfo = mapDepartmentInfo(req.body.departmentInfo, req.body.joiningDetails);
    const financialInfo = mapFinancialInfo(req.body.financialInfo);
    const payrollInfo = mapPayrollInfo(req.body.payrollInfo);
    const documents = mapDocuments(req.body.documents);
    const tasks = mapTaskInfo(req.body.taskInfo);

    // Create the user object
    const userData = {
      // Basic Info
      id: req.body.joiningDetails?.employeeId || nextId,
      password: nextId, // Setting initial password same as ID
      
      // Personal Info
      ...personalInfo,
      
      // Department Info
      ...departmentInfo,
      
      // Financial Info
      ...financialInfo,
      
      // Payroll Info
      ...payrollInfo,
      
      // Work Info
      experience: "0", // Default value
      projects: [], // Default empty array
      isActive: true,
      
      // Documents and Tasks
      documents,
      tasks
    };

    const user = new User(userData);
    await user.save();

    // Return success response with essential data
    const responseData = {
      id: user.id,
      name: user.name,
      role: user.role,
      email: user.email,
      organizationName: user.organizationName,
      departmentName: user.departmentName,
      dateOfBirth: user.dateOfBirth,
      joiningDate: user.joiningDate
    };

    return createSuccessResponse(res, 201, responseData);

  } catch (err) {
    console.error("Add employee error:", err);
    
    if (err.name === "ValidationError") {
      const messages = Object.values(err.errors).map(error => error.message);
      return createErrorResponse(res, 400, "Validation error", messages);
    }
    
    return createErrorResponse(res, 400, err.message);
  }
};

const registerEmployee = async (req, res) => {
  try {
    const {
      name, role, dateOfBirth, address, joiningDate, photo,
      upperManager, salary, adharCard, panCard, experience,
      organizationName, departmentName, bankDetails, documents
    } = req.body;

    // Validate required fields
    if (!name || !role || !organizationName || !departmentName) {
      return createErrorResponse(res, 400, "Name, role, organization name, and department name are required");
    }

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

    // Add optional fields if provided with date validation
    if (dateOfBirth) {
      const parsedDOB = parseAndValidateDate(dateOfBirth);
      if (!parsedDOB) {
        return createErrorResponse(res, 400, "Invalid date of birth format");
      }
      userData.dateOfBirth = parsedDOB;
    }

    if (joiningDate) {
      const parsedJoiningDate = parseAndValidateDate(joiningDate);
      if (!parsedJoiningDate) {
        return createErrorResponse(res, 400, "Invalid joining date format");
      }
      userData.joiningDate = parsedJoiningDate;
    }

    // Add other optional fields
    if (address) userData.address = address;
    if (photo) userData.photo = photo;
    if (upperManager) userData.upperManager = upperManager;
    if (salary) userData.salary = Number(salary);
    if (adharCard) userData.adharCard = adharCard;
    if (panCard) userData.panCard = panCard;
    if (experience) userData.experience = String(experience);

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

    // Handle documents
    if (documents) {
      userData.documents = mapDocuments(documents);
    }

    const user = await User.create(userData);

    return createSuccessResponse(res, 201, {
      id: user.id,
      name: user.name,
      role: user.role,
      organizationName: user.organizationName,
      departmentName: user.departmentName,
    }, "Employee registered successfully");

  } catch (error) {
    console.error("Registration error:", error);
    
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((err) => err.message);
      return createErrorResponse(res, 400, "Validation error", messages);
    }
    
    if (error.code === 11000) {
      return createErrorResponse(res, 400, "Employee ID already exists");
    }
    
    return createErrorResponse(res, 500, "Internal server error");
  }
};

const getById = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!id) {
      return createErrorResponse(res, 400, "Employee ID is required");
    }

    const user = await User.findOne({ id }).select("-password");
    
    if (!user) {
      return createErrorResponse(res, 404, "User not found");
    }
    
    return createSuccessResponse(res, 200, user);
    
  } catch (error) {
    console.error("Get user by ID error:", error);
    return createErrorResponse(res, 500, "Internal server error");
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    
    if (!users || users.length === 0) {
      return createErrorResponse(res, 404, "No active users found");
    }
    
    return createSuccessResponse(res, 200, users);
    
  } catch (error) {
    console.error("Get all users error:", error);
    return createErrorResponse(res, 500, "Internal server error");
  }
};

const updateEmp = async (req, res) => {
  try {
    const user = await User.findOne({ id: req.params.id });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Parse dates
    const dateOfBirth = req.body.personalInfo?.dob
      ? parseAndValidateDate(req.body.personalInfo.dob)
      : user.dateOfBirth;
    const joiningDate = req.body.joiningDetails?.joiningDate
      ? parseAndValidateDate(req.body.joiningDetails.joiningDate)
      : user.joiningDate;

    // Validate dateOfBirth
    if (req.body.personalInfo?.dob && !dateOfBirth) {
      return res.status(400).json({
        success: false,
        message: "Invalid date of birth format. Please use YYYY-MM-DD format",
      });
    }

    // Validate joiningDate
    if (req.body.joiningDetails?.joiningDate && !joiningDate) {
      return res.status(400).json({
        success: false,
        message: "Invalid joining date format. Please use YYYY-MM-DD format",
      });
    }

    // Update fields if present in request
    // Basic Info
    if (req.body.personalInfo?.name) user.name = req.body.personalInfo.name;
    if (req.body.personalInfo?.email) user.email = req.body.personalInfo.email;
    if (req.body.personalInfo?.phone) user.phone = req.body.personalInfo.phone;
    if (req.body.departmentInfo?.role) user.role = req.body.departmentInfo.role.toLowerCase();

    // Personal Info
    if (req.body.personalInfo?.gender) user.gender = req.body.personalInfo.gender;
    if (req.body.personalInfo?.dob) user.dateOfBirth = dateOfBirth;
    if (req.body.personalInfo?.address) user.address = req.body.personalInfo.address;
    if (req.body.personalInfo?.aadhar) user.adharCard = req.body.personalInfo.aadhar;
    if (req.body.personalInfo?.pan) user.panCard = req.body.personalInfo.pan;
    if (req.body.personalInfo?.emergencyContact) user.emergencyContact = req.body.personalInfo.emergencyContact;

    // Department Info
    if (req.body.departmentInfo?.departmentName) {
      user.organizationName = req.body.departmentInfo.departmentName;
      user.departmentName = req.body.departmentInfo.departmentName;
    }
    if (req.body.joiningDetails?.joiningDate) user.joiningDate = joiningDate;
    if (req.body.departmentInfo?.managerName) user.upperManager = req.body.departmentInfo.managerName;
    if (req.body.departmentInfo?.designation) user.designation = req.body.departmentInfo.designation;

    // Financial Info
    if (req.body.financialInfo?.salary) user.salary = Number(req.body.financialInfo.salary);
    if (req.body.financialInfo?.bankInfo) {
      user.bankDetails = {
        accountHolder: req.body.financialInfo.bankInfo.accountHolderName || user.bankDetails.accountHolder || "",
        accountNumber: req.body.financialInfo.bankInfo.accountNumber || user.bankDetails.accountNumber || "",
        ifsc: req.body.financialInfo.bankInfo.ifscCode || user.bankDetails.ifsc || "",
        branch: req.body.financialInfo.bankInfo.branch || user.bankDetails.branch || "",
        accountType: req.body.financialInfo.bankInfo.accountType || user.bankDetails.accountType || "SAVING",
      };
    }

    // Work Info
    if (req.body.experience) user.experience = req.body.experience;
    if (req.body.projects) user.projects = req.body.projects;
    if (req.body.isActive !== undefined) user.isActive = req.body.isActive;

    // Additional Info
    if (req.body.payrollInfo?.taxCode) user.taxCode = req.body.payrollInfo.taxCode;
    if (req.body.payrollInfo?.benefits) user.benefits = req.body.payrollInfo.benefits;

    // Documents
    if (req.body.documents) {
      const documentArray = [];
      if (req.body.documents.aadharFront) {
        documentArray.push({
          title: "Aadhar Card (Front)",
          url: req.body.documents.aadharFront,
          type: "other",
        });
      }
      if (req.body.documents.aadharBack) {
        documentArray.push({
          title: "Aadhar Card (Back)",
          url: req.body.documents.aadharBack,
          type: "other",
        });
      }
      if (req.body.documents.panCard) {
        documentArray.push({
          title: "PAN Card",
          url: req.body.documents.panCard,
          type: "other",
        });
      }
      if (req.body.documents.resume) {
        documentArray.push({
          title: "Resume",
          url: req.body.documents.resume,
          type: "experience",
        });
      }
      user.documents = documentArray;
    }

    // Task Info (if needed)
    if (req.body.taskInfo) {
      user.tasks = [
        {
          name: req.body.taskInfo.taskName,
          assignedOn: parseAndValidateDate(req.body.taskInfo.assignedOn),
          assignedBy: req.body.taskInfo.assignedBy,
        },
      ];
    }

    await user.save();

    // Update the corresponding report
    const reportUpdate = {
      name: user.name,
      designation: user.designation,
      department: user.departmentName,
      email: user.email,
      growthAndHR: {
        joiningDate: user.joiningDate,
      },
      finance: {
        currentSalary: user.salary ? user.salary.toString() : "0",
      },
    };
    await Report.findOneAndUpdate(
      { id: user.id },
      reportUpdate,
      { new: true, upsert: false }
    );

    res.json({ success: true });
  } catch (error) {
    console.error("Update employee error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const deleteEmp = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!id) {
      return createErrorResponse(res, 400, "Employee ID is required");
    }

    const user = await User.findOne({ id });
    if (!user) {
      return createErrorResponse(res, 404, "User not found");
    }

    await User.findOneAndDelete({ id });
    
    return createSuccessResponse(res, 200, null, "User deleted successfully");

  } catch (error) {
    console.error("Delete employee error:", error);
    return createErrorResponse(res, 500, "Internal server error");
  }
};

// Export all controller functions
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