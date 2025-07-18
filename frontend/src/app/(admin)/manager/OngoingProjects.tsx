"use client"

import { Plus, Database, Edit, FileText } from "lucide-react"
import type { Project } from "./types"

interface OngoingProjectsProps {
  projects: Project[]
  onProgressChange: (projectId: number, newProgress: number) => void
  onShowNewProject: () => void
}

export default function OngoingProjects({ projects, onProgressChange, onShowNewProject }: OngoingProjectsProps) {
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
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      project.priority === "high"
                        ? "bg-red-100 text-red-800"
                        : project.priority === "medium"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-green-100 text-green-800"
                    }`}
                  >
                    {project.priority.toUpperCase()} Priority
                  </span>
                  <span className="text-gray-500">
                    {project.startDate} - {project.endDate}
                  </span>
                  <span className="text-gray-600">
                    Budget: ${project.budget.toLocaleString()} | Spent: ${project.actualCost.toLocaleString()}
                  </span>
                </div>
              </div>
              <div className="text-right ml-6">
                <span className="text-4xl font-bold text-red-500">{project.progress}%</span>
                <p className="text-sm text-gray-600 mt-1">Completion</p>
              </div>
            </div>

            {/* Progress Bar with Adjustment */}
            <div className="mb-4">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Adjust Completion Progress</span>
                <span>{project.progress}%</span>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                value={project.progress}
                onChange={(e) => onProgressChange(project.id, Number.parseInt(e.target.value))}
                className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, #ef4444 0%, #ef4444 ${project.progress}%, #e5e7eb ${project.progress}%, #e5e7eb 100%)`,
                }}
              />
            </div>

            {/* Team Members */}
            <div className="mb-4">
              <span className="text-sm font-medium text-gray-700">Team Members:</span>
              <div className="flex flex-wrap gap-2 mt-2">
                {project.employees.map((employee, index) => (
                  <span
                    key={index}
                    className="bg-red-50 text-red-700 px-3 py-1 rounded-full text-sm border border-red-200 font-medium"
                  >
                    {employee}
                  </span>
                ))}
              </div>
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
              <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium">
                <FileText className="w-4 h-4 inline mr-1" />
                Generate Report
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
