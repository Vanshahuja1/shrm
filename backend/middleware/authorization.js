const User = require("../models/userModel")

/**
 * Authorization middleware to check if a user can access employee data
 * Rules:
 * - Users can access their own data
 * - Managers can access their direct reports' data 
 * - HR can access all employees in their organization
 * - Admins can access all data
 */
const authorizeEmployeeAccess = async (req, res, next) => {
  try {
    const requestedEmployeeId = req.params.id || req.params.employeeId
    const currentUser = req.user

    // Allow access to own data
    if (currentUser.id === requestedEmployeeId) {
      return next()
    }

    // Admin has access to all data
    if (currentUser.role === "admin") {
      return next()
    }

    // HR can access all employees in their organization
    if (currentUser.role === "hr") {
      const requestedEmployee = await User.findOne({ 
        id: requestedEmployeeId, 
        organizationId: currentUser.organizationId 
      })
      
      if (requestedEmployee) {
        return next()
      } else {
        return res.status(403).json({
          success: false,
          message: "Access denied. Employee not in your organization."
        })
      }
    }

    // Managers can access their direct reports
    if (currentUser.role === "manager") {
      const requestedEmployee = await User.findOne({ id: requestedEmployeeId })
      
      if (requestedEmployee && 
          (requestedEmployee.upperManager === currentUser.id || 
           requestedEmployee.upperManager === currentUser.name)) {
        return next()
      } else {
        return res.status(403).json({
          success: false,
          message: "Access denied. You can only access your direct reports' data."
        })
      }
    }

    // Employees and interns can only access their own data (already checked above)
    return res.status(403).json({
      success: false,
      message: "Access denied. You can only access your own data."
    })

  } catch (error) {
    console.error("Authorization error:", error)
    return res.status(500).json({
      success: false,
      message: "Authorization error"
    })
  }
}

/**
 * Authorization for HR-only operations
 */
const authorizeHRAccess = (req, res, next) => {
  const currentUser = req.user

  if (currentUser.role === "admin" || currentUser.role === "hr") {
    return next()
  }

  return res.status(403).json({
    success: false,
    message: "Access denied. HR privileges required."
  })
}

/**
 * Authorization for manager and above operations
 */
const authorizeManagerAccess = (req, res, next) => {
  const currentUser = req.user

  if (["admin", "hr", "manager"].includes(currentUser.role)) {
    return next()
  }

  return res.status(403).json({
    success: false,
    message: "Access denied. Manager privileges required."
  })
}

/**
 * Dynamic authorization based on organization scope
 */
const authorizeOrganizationAccess = async (req, res, next) => {
  try {
    const currentUser = req.user
    const requestedEmployeeId = req.params.id || req.params.employeeId

    // Admin has access to all organizations
    if (currentUser.role === "admin") {
      return next()
    }

    // For organization-specific access, check if both users belong to same organization
    if (requestedEmployeeId) {
      const requestedEmployee = await User.findOne({ id: requestedEmployeeId })
      
      if (requestedEmployee && 
          requestedEmployee.organizationId.toString() === currentUser.organizationId.toString()) {
        return next()
      } else {
        return res.status(403).json({
          success: false,
          message: "Access denied. Employee not in your organization."
        })
      }
    }

    next()
  } catch (error) {
    console.error("Organization authorization error:", error)
    return res.status(500).json({
      success: false,
      message: "Authorization error"
    })
  }
}

/**
 * Authorization for attendance operations - stricter rules
 */
const authorizeAttendanceAccess = async (req, res, next) => {
  try {
    const requestedEmployeeId = req.params.id || req.params.employeeId
    const currentUser = req.user

    // Allow access to own attendance data
    if (currentUser.id === requestedEmployeeId) {
      return next()
    }

    // Only HR, Admin, and direct managers can view others' attendance
    if (["admin", "hr"].includes(currentUser.role)) {
      return next()
    }

    if (currentUser.role === "manager") {
      const requestedEmployee = await User.findOne({ id: requestedEmployeeId })
      
      if (requestedEmployee && 
          (requestedEmployee.upperManager === currentUser.id || 
           requestedEmployee.upperManager === currentUser.name)) {
        return next()
      }
    }

    return res.status(403).json({
      success: false,
      message: "Access denied. You can only view your own attendance or your direct reports' attendance."
    })

  } catch (error) {
    console.error("Attendance authorization error:", error)
    return res.status(500).json({
      success: false,
      message: "Authorization error"
    })
  }
}

/**
 * Authorization for manager team attendance - allows managers to view all employees in their organization
 */
const authorizeManagerTeamAccess = async (req, res, next) => {
  try {
    const currentUser = req.user

    // Admin, HR, and Managers can access this endpoint
    if (["admin", "hr", "manager"].includes(currentUser.role)) {
      return next()
    }

    return res.status(403).json({
      success: false,
      message: "Access denied. Manager privileges required."
    })

  } catch (error) {
    console.error("Manager team authorization error:", error)
    return res.status(500).json({
      success: false,
      message: "Authorization error"
    })
  }
}

module.exports = {
  authorizeEmployeeAccess,
  authorizeHRAccess,
  authorizeManagerAccess,
  authorizeOrganizationAccess,
  authorizeAttendanceAccess,
  authorizeManagerTeamAccess
}