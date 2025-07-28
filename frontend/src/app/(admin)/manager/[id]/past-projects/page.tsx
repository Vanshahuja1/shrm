"use client"
import { useEffect, useState } from "react"
import type { Project } from "@/types/index"
export default function PastProjects() {

  const [projects, setProjects] = useState<Project[]>([])

  useEffect(() => {
    async function fetchProjects() {
      try {
        const response = await fetch("http://localhost:5000/api/projects")
        if (!response.ok) {
          throw new Error("Failed to fetch projects")
        }
        const data: Project[] = await response.json()
        // Filter for completed projects only
        const completed = data.filter((p) => p.completionPercentage === 100)
        setProjects(completed)
      } catch (error) {
        console.error("Error fetching projects:", error)
        setProjects([])
      }
    }
    fetchProjects()
  }, [])


  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Past Projects</h2>
      <div className="grid gap-6">
        {projects.map((project) => (
          <div key={project.id} className="bg-white rounded-lg shadow-sm border border-red-200 p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-gray-900">{project.name}</h3>
                <p className="text-gray-600 mt-2">{project.description}</p>
                <div className="flex items-center space-x-4 mt-3 text-sm">
                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-medium">
                    COMPLETED
                  </span>
                  <span className="text-gray-500">
                    {project.startDate} - {project.endDate}
                  </span>
                </div>
              </div>
              <div className="text-right ml-6">
                <span className="text-4xl font-bold text-green-500">100%</span>
                <p className="text-sm text-gray-600 mt-1">Completed</p>
              </div>
            </div>

            {/* Historical Data */}
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <h4 className="font-medium text-gray-900 mb-3">Historical Data</h4>
                  <div className="grid grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Duration:</span>
                      <p className="font-medium">
                        {project.startDate && project.endDate
                          ? `${Math.ceil((new Date(project.endDate).getTime() - new Date(project.startDate).getTime()) / (1000 * 60 * 60 * 24 * 30))} months`
                          : "-"}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-600">Team Size:</span>
                      <p className="font-medium">{Array.isArray(project.membersInvolved) ? project.membersInvolved.length : 0} members</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Budget vs Actual:</span>
                      <p className="font-medium">
                        {project.budgetVsActual ? project.budgetVsActual : "-"}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-600">Cost Efficiency:</span>
                      <p className="font-medium text-green-600">
                        {project.costEfficiency ? project.costEfficiency : "-"}
                      </p>
                    </div>
                  </div>
                </div>

            {/* Performance Analysis */}
                <div className="bg-red-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-3">Performance Analysis</h4>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Success Rate:</span>
                      <p className="font-medium text-green-600">{project.successRate ? project.successRate : "-"}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Quality Score:</span>
                      <p className="font-medium text-blue-600">{project.qualityScore ? project.qualityScore : "-"}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Client Satisfaction:</span>
                      <p className="font-medium text-red-600">{project.clientSatisfaction ? project.clientSatisfaction : "-"}</p>
                    </div>
                  </div>
                </div>
          </div>
        ))}
      </div>
    </div>
  )
}
