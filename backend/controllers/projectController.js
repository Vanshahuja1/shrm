const Project = require("../models/projectModel")

exports.getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find()
    res.json(projects)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

exports.getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
    if (!project) return res.status(404).json({ message: "Project not found" })
    res.json(project)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

exports.createProject = async (req, res) => {
  try {
    const project = await Project.create(req.body)
    res.status(201).json(project)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

exports.updateProject = async (req, res) => {
  try {
    const updated = await Project.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })
    if (!updated) return res.status(404).json({ message: "Project not found" })
    res.json(updated)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

exports.deleteProject = async (req, res) => {
  try {
    const deleted = await Project.findByIdAndDelete(req.params.id)
    if (!deleted) return res.status(404).json({ message: "Project not found" })
    res.status(204).send()
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}
