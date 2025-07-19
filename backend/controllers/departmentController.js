const Department = require("../models/departmentModel")

exports.getAllDepartments = async (req, res) => {
  const departments = await Department.find()
  res.json(departments)
}

exports.getDepartmentById = async (req, res) => {
  const department = await Department.findById(req.params.id)
  if (!department) return res.status(404).json({ error: "Department not found" })
  res.json(department)
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
    const updated = await Department.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
    if (!updated) return res.status(404).json({ error: "Department not found" })
    res.json(updated)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

exports.deleteDepartment = async (req, res) => {
  const deleted = await Department.findByIdAndDelete(req.params.id)
  if (!deleted) return res.status(404).json({ error: "Department not found" })
  res.status(204).send()
}

exports.getDepartmentsByOrganisation = async (req, res) => {
  const { orgName } = req.params
  const departments = await Department.findByOrganisation(orgName)
  res.json(departments)
}

exports.getDepartmentSummary = async (req, res) => {
  const department = await Department.findById(req.params.id)
  if (!department) return res.status(404).json({ error: "Department not found" })
  res.json(department.getSummary())
}
