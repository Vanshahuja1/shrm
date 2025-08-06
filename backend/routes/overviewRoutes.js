const express = require("express")
const router = express.Router()
const Department = require("../models/departmentModel")
const Project = require("../models/projectModel")
const User = require("../models/userModel")
const Attendance = require("../models/attendanceModel")

router.get("/", async (req, res) => {
  try {
    // Get current counts from database
    const totalEmployees = await User.countDocuments({ role: { $in: ['employee', 'manager'] } })
    const totalDepartments = await Department.countDocuments()
    
    // Get project counts
    const activeProjects = await Project.countDocuments({ status: { $in: ['active', 'pending'] } })
    const completedProjects = await Project.countDocuments({ status: 'completed' })
    
    // Get attendance data for the last 6 months
    const monthlyAttendanceData = []
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
    
    for (let i = 0; i < 6; i++) {
      const month = months[i]
      // For demo purposes, generate attendance percentage between 88-97%
      const attendance = Math.floor(Math.random() * 10) + 88
      monthlyAttendanceData.push({
        month,
        attendance,
        employees: totalEmployees + Math.floor(Math.random() * 10) - 5, // slight variation
        activeProjects: activeProjects + Math.floor(Math.random() * 5) - 2,
        completedProjects: Math.floor(Math.random() * 5) + 10
      })
    }

    // Department data with real employee counts
    const departments = await Department.find()
    const departmentData = departments.map(dep => ({
      name: dep.name,
      value: dep.value || 0,
      employees: (dep.employees ? dep.employees.length : 0) + 
                (dep.managers ? dep.managers.length : 0) + 
                (dep.interns ? dep.interns.length : 0),
      color: "#3B82F6"
    }))

    // Project status data with real counts
    const completed = await Project.countDocuments({ status: "completed" })
    const pending = await Project.countDocuments({ status: "pending" })
    const active = await Project.countDocuments({ status: "active" })
    const cancelled = await Project.countDocuments({ status: "cancelled" })
    const onHold = await Project.countDocuments({ status: "on-hold" })
    
    const projectStatusData = [
      { name: "Completed", value: completed, color: "#10B981" },
      { name: "Active", value: active, color: "#3B82F6" },
      { name: "Pending", value: pending, color: "#F59E0B" },
      { name: "On Hold", value: onHold, color: "#EF4444" },
      { name: "Cancelled", value: cancelled, color: "#6B7280" },
    ].filter(item => item.value > 0) // Only show statuses with projects

    res.json({
      monthlyData: monthlyAttendanceData,
      departmentData,
      projectStatusData,
      totalEmployees,
      totalDepartments,
      activeProjects,
      completedProjects
    })
  } catch (err) {
    console.error("Overview API error:", err)
    res.status(500).json({ error: "Failed to fetch overview data" })
  }
})

module.exports = router