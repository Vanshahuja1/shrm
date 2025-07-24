const express = require("express")
const router = express.Router()
const Department = require("../models/departmentModel")
const Project = require("../models/projectModel")
const User = require("../models/userModel")

router.get("/", async (req, res) => {
  try {
    // Monthly data (simulate or aggregate from DB)
    const monthlyData = [
      { month: "Jan", revenue: 2100000, employees: 235, activeProjects: 15, completedProjects: 12, attendance: 92 },
      { month: "Feb", revenue: 2300000, employees: 240, activeProjects: 16, completedProjects: 14, attendance: 94 },
      { month: "Mar", revenue: 2200000, employees: 242, activeProjects: 17, completedProjects: 13, attendance: 89 },
      { month: "Apr", revenue: 2500000, employees: 245, activeProjects: 18, completedProjects: 16, attendance: 96 },
      { month: "May", revenue: 2400000, employees: 247, activeProjects: 18, completedProjects: 17, attendance: 93 },
      { month: "Jun", revenue: 2600000, employees: 247, activeProjects: 20, completedProjects: 19, attendance: 95 },
    ]

    // Department data
    const departments = await Department.find()
    const departmentData = departments.map(dep => ({
      name: dep.name,
      value: dep.value || 0,
      employees: dep.employees ? dep.employees.length : 0,
      color: dep.color || "#3B82F6"
    }))

    // Project status data
    const completed = await Project.countDocuments({ status: "Completed" })
    const inProgress = await Project.countDocuments({ status: "In Progress" })
    const planning = await Project.countDocuments({ status: "Planning" })
    const onHold = await Project.countDocuments({ status: "On Hold" })
    const projectStatusData = [
      { name: "Completed", value: completed, color: "#10B981" },
      { name: "In Progress", value: inProgress, color: "#3B82F6" },
      { name: "Planning", value: planning, color: "#F59E0B" },
      { name: "On Hold", value: onHold, color: "#EF4444" },
    ]

    // Revenue by department (simulate or aggregate)
    const revenueByDepartment = [
      { department: "IT Dev", revenue: 1040000, projects: 12 },
      { department: "Business Dev", revenue: 780000, projects: 8 },
      { department: "Management", revenue: 520000, projects: 6 },
      { department: "HR", revenue: 260000, projects: 4 },
    ]

    res.json({
      monthlyData,
      departmentData,
      projectStatusData,
      revenueByDepartment
    })
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch overview data" })
  }
})

module.exports = router