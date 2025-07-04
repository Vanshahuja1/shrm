"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import {
  Briefcase,
  Calendar,
  DollarSign,
  Users,
  Plus,
  Edit,
  Trash2,
  Search,
  ExternalLink,
  Clock,
  CheckCircle,
  AlertCircle,
  Building2,
  Award,
} from "lucide-react"
import { sampleProjects } from "./SampleData"
import type { Project } from "../types"
import type { JSX } from "react/jsx-runtime" // Import JSX to fix the lint error

export default function ProjectManagement() {
  const [projects, setProjects] = useState(sampleProjects)
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [showAddForm, setShowAddForm] = useState(false)

  // Separate ongoing and previous projects
  const ongoingProjects = projects
    .filter((project) => project.status === "active" || project.status === "pending")
    .filter(
      (project) =>
        project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.client.toLowerCase().includes(searchTerm.toLowerCase()),
    )

  const previousProjects = projects
    .filter((project) => project.status === "completed")
    .filter(
      (project) =>
        project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.client.toLowerCase().includes(searchTerm.toLowerCase()),
    )

  const getStatusIcon = (status: Project["status"]) => {
    switch (status) {
      case "active":
        return <Clock className="text-blue-600" size={16} />
      case "completed":
        return <CheckCircle className="text-green-600" size={16} />
      case "pending":
        return <AlertCircle className="text-yellow-600" size={16} />
    }
  }

  const getStatusColor = (status: Project["status"]) => {
    switch (status) {
      case "active":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "completed":
        return "bg-green-100 text-green-800 border-green-200"
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
    }
  }

  if (selectedProject) {
    return (
      <ProjectDetail
        project={selectedProject}
        onBack={() => setSelectedProject(null)}
        onUpdate={(updated) => {
          setProjects(projects.map((p) => (p.id === updated.id ? updated : p)))
          setSelectedProject(null)
        }}
        onDelete={(id) => {
          setProjects(projects.filter((p) => p.id !== id))
          setSelectedProject(null)
        }}
      />
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Project Management</h1>
          <p className="text-gray-600">Manage all ongoing and completed projects</p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus size={20} />
          Add Project
        </button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="text"
          placeholder="Search projects..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {/* Project Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Briefcase className="text-blue-600" size={24} />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{projects.length}</p>
              <p className="text-gray-600">Total Projects</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-green-100 rounded-lg">
              <CheckCircle className="text-green-600" size={24} />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{previousProjects.length}</p>
              <p className="text-gray-600">Completed</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-yellow-100 rounded-lg">
              <Clock className="text-yellow-600" size={24} />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{ongoingProjects.length}</p>
              <p className="text-gray-600">Ongoing</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-purple-100 rounded-lg">
              <DollarSign className="text-purple-600" size={24} />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                ${projects.reduce((sum, p) => sum + p.price, 0).toLocaleString()}
              </p>
              <p className="text-gray-600">Total Value</p>
            </div>
          </div>
        </div>
      </div>

      {/* Ongoing Projects Section */}
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Clock className="text-blue-600" size={24} />
          <h2 className="text-2xl font-bold text-gray-900">Ongoing Projects</h2>
          <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
            {ongoingProjects.length}
          </span>
        </div>

        {ongoingProjects.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <Clock size={48} className="mx-auto mb-4 text-gray-300" />
            <p>No ongoing projects found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {ongoingProjects.map((project) => (
              <OngoingProjectCard
                key={project.id}
                project={project}
                onClick={() => setSelectedProject(project)}
                getStatusIcon={getStatusIcon}
                getStatusColor={getStatusColor}
              />
            ))}
          </div>
        )}
      </div>

      {/* Previous Projects Section */}
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <CheckCircle className="text-green-600" size={24} />
          <h2 className="text-2xl font-bold text-gray-900">Previous Projects</h2>
          <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
            {previousProjects.length}
          </span>
        </div>

        {previousProjects.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <CheckCircle size={48} className="mx-auto mb-4 text-gray-300" />
            <p>No completed projects found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {previousProjects.map((project) => (
              <PreviousProjectCard
                key={project.id}
                project={project}
                onClick={() => setSelectedProject(project)}
                getStatusIcon={getStatusIcon}
                getStatusColor={getStatusColor}
              />
            ))}
          </div>
        )}
      </div>

      {/* Add Project Modal */}
      {showAddForm && (
        <AddProjectModal
          onClose={() => setShowAddForm(false)}
          onAdd={(newProject) => {
            const id = Math.max(...projects.map((p) => p.id)) + 1
            setProjects([...projects, { ...newProject, id }])
            setShowAddForm(false)
          }}
        />
      )}
    </div>
  )
}

// Ongoing Project Card Component
function OngoingProjectCard({
  project,
  onClick,
  getStatusIcon,
  getStatusColor,
}: {
  project: Project
  onClick: () => void
  getStatusIcon: (status: Project["status"]) => JSX.Element
  getStatusColor: (status: Project["status"]) => string
}) {
  return (
    <motion.div
      whileHover={{ y: -2, scale: 1.01 }}
      className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 cursor-pointer hover:shadow-md transition-all"
      onClick={onClick}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-900 line-clamp-2 flex-1 mr-4">{project.name}</h3>
        <div className="flex items-center gap-1 flex-shrink-0">
          {getStatusIcon(project.status)}
          <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(project.status)}`}>
            {project.status}
          </span>
        </div>
      </div>

      {/* Client & Price */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-sm text-gray-600">Client</p>
          <p className="font-semibold text-gray-900">{project.client}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Price</p>
          <p className="font-semibold text-green-600">${project.price.toLocaleString()}</p>
        </div>
      </div>

      {/* Dates */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-sm text-gray-600">Start Date</p>
          <p className="font-semibold text-gray-900">{project.startDate}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Deadline</p>
          <p className="font-semibold text-gray-900">{project.deadline}</p>
        </div>
      </div>

      {/* Progress */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-600">Completion</span>
          <span className="font-semibold text-blue-600">{project.completionPercentage}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${project.completionPercentage}%` }}
          ></div>
        </div>
      </div>

      {/* Departments */}
      <div className="mb-4">
        <p className="text-sm text-gray-600 mb-2">Departments Involved</p>
        <div className="flex flex-wrap gap-1">
          {project.departmentsInvolved.slice(0, 3).map((dept, index) => (
            <span key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium">
              {dept}
            </span>
          ))}
          {project.departmentsInvolved.length > 3 && (
            <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">
              +{project.departmentsInvolved.length - 3}
            </span>
          )}
        </div>
      </div>

      {/* Team Info */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <Users size={16} className="text-gray-400" />
            <span className="text-sm text-gray-600">{project.membersInvolved.length} members</span>
          </div>
          <div className="flex items-center gap-1">
            <Building2 size={16} className="text-gray-400" />
            <span className="text-sm text-gray-600">{project.managersInvolved.length} managers</span>
          </div>
        </div>
      </div>

      {/* Project Scope Preview */}
      <div className="mt-3">
        <p className="text-sm text-gray-600 line-clamp-2">{project.projectScope}</p>
      </div>
    </motion.div>
  )
}

// Previous Project Card Component
function PreviousProjectCard({
  project,
  onClick,
  getStatusIcon,
  getStatusColor,
}: {
  project: Project
  onClick: () => void
  getStatusIcon: (status: Project["status"]) => JSX.Element
  getStatusColor: (status: Project["status"]) => string
}) {
  return (
    <motion.div
      whileHover={{ y: -2, scale: 1.01 }}
      className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 cursor-pointer hover:shadow-md transition-all"
      onClick={onClick}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-900 line-clamp-2 flex-1 mr-4">{project.name}</h3>
        <div className="flex items-center gap-2 flex-shrink-0">
          {getStatusIcon(project.status)}
          <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(project.status)}`}>
            {project.status}
          </span>
          {project.showcaseLink && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                window.open(project.showcaseLink, "_blank")
              }}
              className="text-blue-600 hover:text-blue-800 p-1"
            >
              <ExternalLink size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Client & Price */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-sm text-gray-600">Client</p>
          <p className="font-semibold text-gray-900">{project.client}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Price</p>
          <p className="font-semibold text-green-600">${project.price.toLocaleString()}</p>
        </div>
      </div>

      {/* Dates */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-sm text-gray-600">Start Date</p>
          <p className="font-semibold text-gray-900">{project.startDate}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Completed</p>
          <p className="font-semibold text-gray-900">{project.deadline}</p>
        </div>
      </div>

      {/* Departments */}
      <div className="mb-4">
        <p className="text-sm text-gray-600 mb-2">Departments Involved</p>
        <div className="flex flex-wrap gap-1">
          {project.departmentsInvolved.slice(0, 3).map((dept, index) => (
            <span key={index} className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-medium">
              {dept}
            </span>
          ))}
          {project.departmentsInvolved.length > 3 && (
            <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">
              +{project.departmentsInvolved.length - 3}
            </span>
          )}
        </div>
      </div>

      {/* Skills Required */}
      <div className="mb-4">
        <p className="text-sm text-gray-600 mb-2">Skills Required</p>
        <div className="flex flex-wrap gap-1">
          {project.skillsRequired.slice(0, 3).map((skill, index) => (
            <span key={index} className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs font-medium">
              {skill}
            </span>
          ))}
          {project.skillsRequired.length > 3 && (
            <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">
              +{project.skillsRequired.length - 3}
            </span>
          )}
        </div>
      </div>

      {/* Effect Analysis Preview */}
      {project.effectAnalysis && (
        <div className="mb-4">
          <p className="text-sm text-gray-600 mb-1">Effect Analysis</p>
          <p className="text-sm text-gray-700 line-clamp-2 bg-gray-50 p-2 rounded">{project.effectAnalysis}</p>
        </div>
      )}

      {/* Team Info */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <Users size={16} className="text-gray-400" />
            <span className="text-sm text-gray-600">{project.membersInvolved.length} members</span>
          </div>
          <div className="flex items-center gap-1">
            <Building2 size={16} className="text-gray-400" />
            <span className="text-sm text-gray-600">{project.managersInvolved.length} managers</span>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Award size={16} className="text-green-600" />
          <span className="text-sm text-green-600 font-medium">100%</span>
        </div>
      </div>
    </motion.div>
  )
}

// Project Detail Component (keeping the existing one)
function ProjectDetail({
  project,
  onBack,
  onUpdate,
  onDelete,
}: {
  project: Project
  onBack: () => void
  onUpdate: (project: Project) => void
  onDelete: (id: number) => void
}) {
  const [isEditing, setIsEditing] = useState(false)
  const [editData, setEditData] = useState(project)

  const handleSave = () => {
    onUpdate(editData)
    setIsEditing(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <button onClick={onBack} className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium">
          ← Back to Projects
        </button>
        <div className="flex gap-2">
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            <Edit size={16} />
            {isEditing ? "Cancel" : "Edit"}
          </button>
          <button
            onClick={() => onDelete(project.id)}
            className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
          >
            <Trash2 size={16} />
            Delete
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        {isEditing ? (
          <ProjectEditForm
            project={editData}
            onChange={setEditData}
            onSave={handleSave}
            onCancel={() => setIsEditing(false)}
          />
        ) : (
          <ProjectDetailView project={project} />
        )}
      </div>
    </div>
  )
}

// Project Detail View (keeping the existing one)
function ProjectDetailView({ project }: { project: Project }) {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{project.name}</h1>
        <p className="text-gray-600 text-lg">{project.projectScope}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="text-green-600" size={20} />
            <span className="text-green-800 font-semibold">Project Value</span>
          </div>
          <p className="text-2xl font-bold text-green-600">${project.price.toLocaleString()}</p>
        </div>

        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="text-blue-600" size={20} />
            <span className="text-blue-800 font-semibold">Deadline</span>
          </div>
          <p className="text-lg font-semibold text-blue-600">{project.deadline}</p>
        </div>

        <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
          <div className="flex items-center gap-2 mb-2">
            <Users className="text-purple-600" size={20} />
            <span className="text-purple-800 font-semibold">Team Size</span>
          </div>
          <p className="text-2xl font-bold text-purple-600">{project.membersInvolved.length}</p>
        </div>

        <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="text-orange-600" size={20} />
            <span className="text-orange-800 font-semibold">Progress</span>
          </div>
          <p className="text-2xl font-bold text-orange-600">{project.completionPercentage}%</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">Project Details</h3>
            <div className="space-y-3">
              <div>
                <span className="font-semibold text-gray-700">Client:</span>
                <p className="text-gray-900">{project.client}</p>
              </div>
              <div>
                <span className="font-semibold text-gray-700">Start Date:</span>
                <p className="text-gray-900">{project.startDate}</p>
              </div>
              <div>
                <span className="font-semibold text-gray-700">Client Inputs:</span>
                <p className="text-gray-900">{project.clientInputs}</p>
              </div>
              {project.showcaseLink && (
                <div>
                  <span className="font-semibold text-gray-700">Showcase Link:</span>
                  <a
                    href={project.showcaseLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                  >
                    View Project <ExternalLink size={16} />
                  </a>
                </div>
              )}
            </div>
          </div>

          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">Departments Involved</h3>
            <div className="flex flex-wrap gap-2">
              {project.departmentsInvolved.map((dept, index) => (
                <span key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                  {dept}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">Skills Required</h3>
            <div className="flex flex-wrap gap-2">
              {project.skillsRequired.map((skill, index) => (
                <span key={index} className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">Team Members</h3>
            <div className="space-y-3">
              {project.membersInvolved.map((member, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {member
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>
                  <span className="font-semibold text-gray-900">{member}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">Managers</h3>
            <div className="space-y-3">
              {project.managersInvolved.map((manager, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg">
                  <div className="w-10 h-10 bg-yellow-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {manager
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>
                  <span className="font-semibold text-gray-900">{manager}</span>
                </div>
              ))}
            </div>
          </div>

          {project.effectAnalysis && (
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Effect Analysis</h3>
              <p className="text-gray-700 bg-gray-50 p-4 rounded-lg">{project.effectAnalysis}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// Project Edit Form (keeping the existing one)
function ProjectEditForm({
  project,
  onChange,
  onSave,
  onCancel,
}: {
  project: Project
  onChange: (project: Project) => void
  onSave: () => void
  onCancel: () => void
}) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Edit Project</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Project Name</label>
          <input
            type="text"
            value={project.name}
            onChange={(e) => onChange({ ...project, name: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Client</label>
          <input
            type="text"
            value={project.client}
            onChange={(e) => onChange({ ...project, client: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Price</label>
          <input
            type="number"
            value={project.price}
            onChange={(e) => onChange({ ...project, price: Number(e.target.value) })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Completion %</label>
          <input
            type="number"
            min="0"
            max="100"
            value={project.completionPercentage}
            onChange={(e) => onChange({ ...project, completionPercentage: Number(e.target.value) })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
          <input
            type="date"
            value={project.startDate}
            onChange={(e) => onChange({ ...project, startDate: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Deadline</label>
          <input
            type="date"
            value={project.deadline}
            onChange={(e) => onChange({ ...project, deadline: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Project Scope</label>
        <textarea
          value={project.projectScope}
          onChange={(e) => onChange({ ...project, projectScope: e.target.value })}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Client Inputs</label>
        <textarea
          value={project.clientInputs}
          onChange={(e) => onChange({ ...project, clientInputs: e.target.value })}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="flex gap-4">
        <button onClick={onSave} className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700">
          Save Changes
        </button>
        <button onClick={onCancel} className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700">
          Cancel
        </button>
      </div>
    </div>
  )
}

// Add Project Modal (keeping the existing one)
function AddProjectModal({ onClose, onAdd }: { onClose: () => void; onAdd: (project: Omit<Project, "id">) => void }) {
  const [formData, setFormData] = useState<Omit<Project, "id">>({
    name: "",
    departmentsInvolved: [],
    membersInvolved: [],
    startDate: "",
    deadline: "",
    managersInvolved: [],
    completionPercentage: 0,
    price: 0,
    client: "",
    projectScope: "",
    clientInputs: "",
    skillsRequired: [],
    status: "pending",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onAdd(formData)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Add New Project</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Project Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Client</label>
              <input
                type="text"
                value={formData.client}
                onChange={(e) => setFormData({ ...formData, client: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Price</label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as Project["status"] })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="pending">Pending</option>
                <option value="active">Active</option>
                <option value="completed">Completed</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Deadline</label>
              <input
                type="date"
                value={formData.deadline}
                onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Project Scope</label>
            <textarea
              value={formData.projectScope}
              onChange={(e) => setFormData({ ...formData, projectScope: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="flex gap-4 pt-4">
            <button type="submit" className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">
              Add Project
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-600 text-white py-2 rounded-lg hover:bg-gray-700"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
