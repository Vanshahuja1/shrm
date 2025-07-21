const Department = require("../models/departmentModel")

exports.getAllDepartments = async (req, res) => {
  try {
    const departments = await Department.find()
    res.json(departments)
  } catch (error) {
    console.error("Get all departments error:", error)
    res.status(500).json({ error: error.message })
  }
}

exports.getDepartmentById = async (req, res) => {
  try {
    const { id } = req.params
    
    // Validate ObjectId format
    if (!id || !id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ error: "Invalid department ID format" })
    }

    const department = await Department.findById(id)
    if (!department) return res.status(404).json({ error: "Department not found" })
    res.json(department)
  } catch (error) {
    console.error("Get department by ID error:", error)
    res.status(500).json({ error: error.message })
  }
}

exports.createDepartment = async (req, res) => {
  try {
    const newDepartment = await Department.create(req.body)
    res.status(201).json(newDepartment)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

exports.updateDepartment = async (req, res) => {
  try {
    const { id } = req.params
    
    // Validate ObjectId format
    if (!id || !id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ error: "Invalid department ID format" })
    }

    const updated = await Department.findByIdAndUpdate(id, req.body, { new: true, runValidators: true })
    if (!updated) return res.status(404).json({ error: "Department not found" })
    res.json(updated)
  } catch (error) {
    console.error("Update department error:", error)
    res.status(400).json({ error: error.message })
  }
}

exports.deleteDepartment = async (req, res) => {
  try {
    const { id } = req.params    
    // Validate ObjectId format
    if (!id || !id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ error: "Invalid department ID format" })
    }

    const deleted = await Department.findByIdAndDelete(id)
    if (!deleted) return res.status(404).json({ error: "Department not found" })
    res.status(204).send()
  } catch (error) {
    console.error("Delete department error:", error)
    res.status(500).json({ error: error.message })
  }
}

exports.getDepartmentsByOrganisation = async (req, res) => {
  const { orgName } = req.params
  const departments = await Department.findByOrganisation(orgName)
  res.json(departments)
}

exports.getDepartmentSummary = async (req, res) => {
  try {
    const { id } = req.params
    
    // Validate ObjectId format
    if (!id || !id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ error: "Invalid department ID format" })
    }

    const department = await Department.findById(id)
    if (!department) return res.status(404).json({ error: "Department not found" })
    res.json(department.getSummary())
  } catch (error) {
    console.error("Get department summary error:", error)
    res.status(500).json({ error: error.message })
  }
}
