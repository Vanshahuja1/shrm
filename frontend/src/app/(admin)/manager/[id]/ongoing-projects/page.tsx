"use client"
import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Plus, Database, Edit,ExternalLink, Clock, CheckCircle, AlertCircle } from "lucide-react"
import type { Project } from "@/types/index"
import axios from "@/lib/axiosInstance"


export default function OngoingProjects() {
  const [projects, setProjects] = useState<Project[]>([])
  const params = useParams()
  const { id: managerId } = params
  const router = useRouter()
  
  // Debug logging
  console.log("All params:", params)
  console.log("Manager ID:", managerId)
  console.log("Type of managerId:", typeof managerId)
  
  // Handle undefined managerId
  useEffect(() => {
    if (!managerId) {
      console.error("Manager ID is undefined. Redirecting to admin dashboard.")
      router.replace("/admin")
      return
    }
  }, [managerId, router])
  
  useEffect(() => {
    if (!managerId) return // Don't fetch if managerId is undefined
    // Fetch ongoing projects for the manager
    const fetchProjects = async () => {
      try {
        const response = await axios.get("/projects")
        const data = response.data
        // Filter for ongoing projects only
        const ongoingProjects = data.filter((p: Project) => p.status !== "completed" && p.completionPercentage !== 100)
        setProjects(ongoingProjects)
      } catch (error) {
        console.error("Error fetching projects:", error)
        setProjects([]) // Empty array as fallback
      }
    }

    fetchProjects()
  }, [managerId])



  const onShowNewProject = () => {
    if (!managerId) {
      console.error("Manager ID is undefined. Cannot navigate to add project page.")
      return
    }
    router.push(`/admin/manager/${managerId}/ongoing-projects/add`)
  }

  const getStatusIcon = (status: Project["status"]) => {
    switch (status) {
      case "active":
        return <Clock className="text-blue-600" size={16} />
      case "completed":
        return <CheckCircle className="text-green-600" size={16} />
      case "pending":
        return <AlertCircle className="text-yellow-600" size={16} />
      case "on-hold":
        return <AlertCircle className="text-orange-600" size={16} />
      case "cancelled":
        return <AlertCircle className="text-red-600" size={16} />
      default:
        return <AlertCircle className="text-gray-600" size={16} />
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
      case "on-hold":
        return "bg-orange-100 text-orange-800 border-orange-200"
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  // Show loading state if managerId is undefined
  if (!managerId) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Loading...</h2>
          <p className="text-gray-600">Please wait while we verify your manager access.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Ongoing Projects</h2>
        <button
          onClick={onShowNewProject}
          className="bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600 transition-colors flex items-center space-x-2 font-medium"
        >
          <Plus className="w-5 h-5" />
          <span>Add New Project</span>
        </button>
      </div>
      <div className="grid gap-6">
        {projects.map((project) => (
          <div key={project.id} className="bg-white rounded-lg shadow-sm border border-red-200 p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-gray-900">{project.name}</h3>
                <p className="text-gray-600 mt-2">{project.description}</p>
                <div className="flex items-center space-x-4 mt-3 text-sm">
                  <div className="flex items-center gap-1">
                    {getStatusIcon(project.status)}
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(project.status)}`}>
                      {project.status}
                    </span>
                  </div>
                </div>
              </div>
              <div className="text-right ml-6">
                {/* <span className="text-4xl font-bold text-red-500">{project.completionPercentage}%</span> */}
                {/* <p className="text-sm text-gray-600 mt-1">Completion</p> */}
              </div>
            </div>

            {/* Progress Display */}
            <div className="mb-4">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Completion Progress</span>
                <span>{project.completionPercentage}%</span>
              </div>
              <div className="w-full h-3 bg-gray-200 rounded-lg overflow-hidden">
                <div 
                  className="h-full bg-red-500 transition-all duration-300 ease-in-out"
                  style={{ width: `${project.completionPercentage}%` }}
                />
              </div>
            </div>

            {/* Project Details */}
            <div className="mb-4 space-y-2">
              <div className="text-sm text-gray-600">
                <span className="font-medium text-gray-700">Client:</span> {project.client || "not known"}
              </div>
              <div className="text-sm text-gray-600">
                <span className="font-medium text-gray-700">Deadline:</span> {project.deadline ? (() => {
                  const d = new Date(project.deadline);
                  const day = String(d.getDate()).padStart(2, '0');
                  const month = String(d.getMonth() + 1).padStart(2, '0');
                  const year = d.getFullYear();
                  return `${day}/${month}/${year}`;
                })() : "not set"}
              </div>
            </div>

            {/* Departments */}
            {/* <div className="mb-4">
              <span className="text-sm font-medium text-gray-700">Departments:</span>
              <div className="flex flex-wrap gap-2 mt-2">
                {(project.departmentsInvolved ?? []).map((dept, idx) => (
                  <span key={idx} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium">
                    {dept}
                  </span>
                ))}
              </div>
            </div> */}

            {/* Skills Required */}
            <div className="mb-4">
              <span className="text-sm font-medium text-gray-700">Skills Required:</span>
              <div className="flex flex-wrap gap-2 mt-2">
                {(project.skillsRequired ?? []).map((skill, idx) => (
                  <span key={idx} className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-medium">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Team Members */}
            <div className="mb-4">
              <span className="text-sm font-medium text-gray-700">Team Members:</span>
              <div className="flex flex-wrap gap-2 mt-2">
                {(project.membersInvolved ?? []).map((member, index) => (
                  <span
                    key={index}
                    className="bg-red-50 text-red-700 px-3 py-1 rounded-full text-sm border border-red-200 font-medium"
                  >
                    {member}
                  </span>
                ))}
              </div>
            </div>

            {/* Project Stats */}
            <div className="flex items-center justify-between pt-2 border-t border-gray-200 mb-4">
              {/* <div className="flex items-center gap-4">
                <div className="flex items-center gap-1 text-sm text-gray-600">
                  <Users size={16} className="text-gray-400" />
                  {(project.membersInvolved ?? []).length} members
                </div>
                <div className="flex items-center gap-1 text-sm text-gray-600">
                  <Building2 size={16} className="text-gray-400" />
                  {(project.managersInvolved ?? []).length} managers
                </div>
              </div> */}
              {/* Project Links */}
              {project.links && project.links.length > 0 && (
                <div className="flex gap-2">
                  {project.links.slice(0, 2).map((url, idx) => (
                    <a
                      key={idx}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline flex items-center gap-1 text-xs"
                    >
                      Link <ExternalLink size={12} />
                    </a>
                  ))}
                  {project.links.length > 2 && (
                    <span className="text-xs text-gray-500">+{project.links.length - 2} more</span>
                  )}
                </div>
              )}
            </div>

            {/* Project Management Actions */}
            <div className="flex space-x-3 pt-4 border-t border-red-100">
              <button className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors text-sm font-medium">
                <Database className="w-4 h-4 inline mr-1" />
                Send to Admin
              </button>
              <button className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors text-sm font-medium">
                <Edit className="w-4 h-4 inline mr-1" />
                Edit Project
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
