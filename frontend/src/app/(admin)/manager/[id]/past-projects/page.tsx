"use client"
import { useEffect, useState } from "react"
import type { Project } from "@/types/index"
import axios from "@/lib/axiosInstance"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

export default function PastProjects() {
  const [projects, setProjects] = useState<Project[]>([])
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchProjects() {
      try {
        setLoading(true)
        const response = await axios.get("/projects")
        const data: Project[] = response.data
        // Filter for completed projects only
        const completed = data.filter((p) => p.completionPercentage === 100)
        setProjects(completed)
      } catch (error) {
        console.error("Error fetching projects:", error)
        setProjects([])
      } finally {
        setLoading(false)
      }
    }
    fetchProjects()
  }, [])

  const formatDate = (dateString: string) => {
    if (!dateString) return "-"
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const handleEdit = (project: Project) => {
    setEditingProject({ ...project })
    setIsEditing(true)
  }

  const handleSave = async () => {
    if (!editingProject) return

    try {
      const response = await axios.put(`/projects/${editingProject.id}`, editingProject)
      const updatedProject = response.data
      
      // Update the projects list
      setProjects(projects.map(p => p.id === updatedProject._id ? updatedProject : p))
      setSelectedProject(updatedProject)
      setIsEditing(false)
      setEditingProject(null)
    } catch (error) {
      console.error('Error updating project:', error)
    }
  }

  const handleCancel = () => {
    setIsEditing(false)
    setEditingProject(null)
  }

  const addLink = () => {
    if (!editingProject) return
    setEditingProject({
      ...editingProject,
      links: [...(editingProject.links || []), ""]
    })
  }

  const updateLink = (index: number, value: string) => {
    if (!editingProject) return
    const newLinks = [...(editingProject.links || [])]
    newLinks[index] = value
    setEditingProject({
      ...editingProject,
      links: newLinks
    })
  }

  const removeLink = (index: number) => {
    if (!editingProject) return
    const newLinks = [...(editingProject.links || [])]
    newLinks.splice(index, 1)
    setEditingProject({
      ...editingProject,
      links: newLinks
    })
  }


  return (
    <div className="space-y-6 bg-gray-50 min-h-screen p-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Past Projects</h2>
            <p className="text-gray-600 mt-2">Review completed projects with detailed analytics and performance metrics</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-green-600">{projects.length}</div>
            <div className="text-sm text-gray-600">Completed Projects</div>
          </div>
        </div>
      </div>
      <div className="grid gap-6">
        {loading ? (
          <div className="grid gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 animate-pulse">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="h-6 bg-gray-200 rounded w-1/3 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3 mb-3"></div>
                    <div className="flex items-center space-x-4">
                      <div className="h-6 bg-gray-200 rounded w-20"></div>
                      <div className="h-4 bg-gray-200 rounded w-32"></div>
                    </div>
                  </div>
                  <div className="text-right ml-6">
                    <div className="h-12 w-20 bg-gray-200 rounded mb-1"></div>
                    <div className="h-4 w-16 bg-gray-200 rounded"></div>
                  </div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <div className="h-5 bg-gray-200 rounded w-1/4 mb-3"></div>
                  <div className="grid grid-cols-4 gap-4">
                    {[1, 2, 3, 4].map((j) => (
                      <div key={j}>
                        <div className="h-4 bg-gray-200 rounded w-16 mb-1"></div>
                        <div className="h-5 bg-gray-200 rounded w-20"></div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-red-50 rounded-lg p-4">
                  <div className="h-5 bg-gray-200 rounded w-1/3 mb-3"></div>
                  <div className="grid grid-cols-3 gap-4">
                    {[1, 2, 3].map((k) => (
                      <div key={k}>
                        <div className="h-4 bg-gray-200 rounded w-16 mb-1"></div>
                        <div className="h-5 bg-gray-200 rounded w-12"></div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : projects.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <div className="text-6xl mb-4">📋</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Past Projects Found</h3>
            <p className="text-gray-600">Once projects are completed, they will appear here with detailed analytics.</p>
          </div>
        ) : (
        projects.map((project) => (
          <Dialog key={project.id} onOpenChange={(open) => {
            if (open) {
              setSelectedProject(project)
              setIsEditing(false)
              setEditingProject(null)
            }
          }}>
            <DialogTrigger asChild>
              <div className="bg-white rounded-lg shadow-sm border border-red-200 p-6 cursor-pointer hover:shadow-lg hover:scale-[1.02] transition-all duration-200">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900">{project.name}</h3>
                    <p className="text-gray-600 mt-2">{project.projectScope}</p>
                    <div className="flex items-center space-x-4 mt-3 text-sm">
                      <Badge className="bg-green-100 text-green-800">
                        COMPLETED
                      </Badge>
                      <span className="text-gray-500">
                        {formatDate(project.assignDate)} - {formatDate(project.endDate || "")}
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
                        {project.assignDate && project.endDate
                          ? `${Math.ceil((new Date(project.endDate).getTime() - new Date(project.assignDate).getTime()) / (1000 * 60 * 60 * 24 * 30))} months`
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
            </DialogTrigger>

            <DialogContent className="max-w-[95vw] w-full max-h-[95vh] overflow-y-auto bg-white/95 backdrop-blur-sm border-2 border-gray-200 shadow-2xl">
              <div className="absolute inset-0 bg-black/20 backdrop-blur-sm -z-10" />
              <DialogHeader className="border-b border-gray-200 pb-4 mb-6">
                <DialogTitle className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="flex flex-col">
                    <span className="text-xl sm:text-2xl font-bold text-gray-900">{selectedProject?.name}</span>
                    <span className="text-sm text-gray-600 mt-1">Complete Project Details</span>
                  </div>
                  <div className="flex space-x-3 shrink-0">
                    {!isEditing ? (
                      <Button onClick={() => handleEdit(selectedProject!)} className="bg-blue-600 hover:bg-blue-700 text-white px-4 sm:px-6 py-2 text-sm sm:text-base">
                        Edit Project
                      </Button>
                    ) : (
                      <>
                        <Button onClick={handleSave} variant="default" className="bg-green-600 hover:bg-green-700 text-white px-4 sm:px-6 py-2 text-sm sm:text-base">
                          Save Changes
                        </Button>
                        <Button onClick={handleCancel} variant="outline" className="border-gray-300 hover:bg-gray-50 px-4 sm:px-6 py-2 text-sm sm:text-base">
                          Cancel
                        </Button>
                      </>
                    )}
                  </div>
                </DialogTitle>
              </DialogHeader>

              {selectedProject && (
                <div className="space-y-6 lg:space-y-8 p-1 lg:p-2 max-w-full overflow-hidden">
                  {/* Basic Information */}
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                      Project Information
                    </h3>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
                      <div className="space-y-6">
                        <div>
                          <Label className="text-sm font-medium text-gray-700 block mb-2">Project Name</Label>
                          <div className="bg-white rounded-lg p-3 border border-gray-200">
                            <p className="text-gray-900 font-medium">{selectedProject.name}</p>
                          </div>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-gray-700 block mb-2">Client</Label>
                          <div className="bg-white rounded-lg p-3 border border-gray-200">
                            <p className="text-gray-900">{selectedProject.client || "Not specified"}</p>
                          </div>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-gray-700 block mb-2">Project Amount</Label>
                          <div className="bg-white rounded-lg p-3 border border-gray-200">
                            <p className="font-semibold text-green-600">${selectedProject.amount?.toLocaleString() || "0"}</p>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-6">
                        <div>
                          <Label className="text-sm font-medium text-gray-700 block mb-2">Status</Label>
                          <div className="bg-white rounded-lg p-3 border border-gray-200">
                            <Badge className="bg-green-100 text-green-800 px-3 py-1">
                              {selectedProject.status?.toUpperCase()}
                            </Badge>
                          </div>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-gray-700 block mb-2">Assign Date</Label>
                          <div className="bg-white rounded-lg p-3 border border-gray-200">
                            <p className="text-gray-900">{formatDate(selectedProject.assignDate)}</p>
                          </div>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-gray-700 block mb-2">End Date</Label>
                          <div className="bg-white rounded-lg p-3 border border-gray-200">
                            <p className="text-gray-900">{formatDate(selectedProject.endDate || "")}</p>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-6">
                        <div>
                          <Label className="text-sm font-medium text-gray-700 block mb-2">Completion</Label>
                          <div className="bg-white rounded-lg p-3 border border-gray-200">
                            <div className="flex items-center space-x-3">
                              <span className="text-2xl font-bold text-green-500">{selectedProject.completionPercentage}%</span>
                              <div className="flex-1 bg-gray-200 rounded-full h-3">
                                <div 
                                  className="bg-green-500 h-3 rounded-full transition-all duration-300" 
                                  style={{ width: `${selectedProject.completionPercentage}%` }}
                                ></div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-gray-700 block mb-2">Project Scope</Label>
                          <div className="bg-white rounded-lg p-3 border border-gray-200 h-24 overflow-y-auto">
                            <p className="text-gray-900 text-sm leading-relaxed">{selectedProject.projectScope || "No scope defined"}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Separator className="my-8" />

                  {/* Team Information */}
                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <span className="w-2 h-2 bg-purple-500 rounded-full mr-3"></span>
                      Team & Resources
                    </h3>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
                      <div className="space-y-6">
                        <div>
                          <Label className="text-sm font-medium text-gray-700 block mb-3">Managers Involved</Label>
                          <div className="bg-white rounded-lg p-4 border border-gray-200 min-h-[80px]">
                            <div className="flex flex-wrap gap-2">
                              {selectedProject.managersInvolved?.map((manager, index) => (
                                <Badge key={index} variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 px-3 py-1">
                                  {manager}
                                </Badge>
                              )) || <span className="text-gray-500 italic">No managers assigned</span>}
                            </div>
                          </div>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-gray-700 block mb-3">Departments Involved</Label>
                          <div className="bg-white rounded-lg p-4 border border-gray-200 min-h-[80px]">
                            <div className="flex flex-wrap gap-2">
                              {selectedProject.departmentsInvolved?.map((dept, index) => (
                                <Badge key={index} variant="outline" className="bg-green-50 text-green-700 border-green-200 px-3 py-1">
                                  {dept}
                                </Badge>
                              )) || <span className="text-gray-500 italic">No departments specified</span>}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-6">
                        <div>
                          <Label className="text-sm font-medium text-gray-700 block mb-3">Team Members</Label>
                          <div className="bg-white rounded-lg p-4 border border-gray-200 min-h-[80px] max-h-[120px] overflow-y-auto">
                            <div className="flex flex-wrap gap-2">
                              {selectedProject.membersInvolved?.map((member, index) => (
                                <Badge key={index} variant="outline" className="bg-gray-50 text-gray-700 border-gray-200 px-3 py-1">
                                  {member}
                                </Badge>
                              )) || <span className="text-gray-500 italic">No team members listed</span>}
                            </div>
                          </div>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-gray-700 block mb-3">Skills Required</Label>
                          <div className="bg-white rounded-lg p-4 border border-gray-200 min-h-[80px] max-h-[120px] overflow-y-auto">
                            <div className="flex flex-wrap gap-2">
                              {selectedProject.skillsRequired?.map((skill, index) => (
                                <Badge key={index} variant="secondary" className="bg-yellow-50 text-yellow-700 border-yellow-200 px-3 py-1">
                                  {skill}
                                </Badge>
                              )) || <span className="text-gray-500 italic">No specific skills listed</span>}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Separator className="my-8" />

                  {/* Project Links - Editable */}
                  <div className="bg-gradient-to-r from-cyan-50 to-blue-50 rounded-xl p-6 border border-cyan-200">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                        <span className="w-2 h-2 bg-cyan-500 rounded-full mr-3"></span>
                        Project Links
                      </h3>
                      {isEditing && (
                        <Button onClick={addLink} size="sm" variant="outline" className="bg-white hover:bg-gray-50 border-cyan-300">
                          Add Link
                        </Button>
                      )}
                    </div>
                    {isEditing ? (
                      <div className="space-y-3">
                        {(editingProject?.links || []).map((link, index) => (
                          <div key={index} className="flex gap-3 p-3 bg-white rounded-lg border border-gray-200">
                            <Input
                              value={link}
                              onChange={(e) => updateLink(index, e.target.value)}
                              placeholder="Enter project link (e.g., https://example.com)"
                              className="flex-1 border-gray-300 focus:border-cyan-500 focus:ring-cyan-200"
                            />
                            <Button 
                              onClick={() => removeLink(index)} 
                              size="sm" 
                              variant="destructive"
                              className="shrink-0"
                            >
                              Remove
                            </Button>
                          </div>
                        ))}
                        {(!editingProject?.links || editingProject.links.length === 0) && (
                          <div className="bg-white rounded-lg p-6 border border-gray-200 text-center">
                            <p className="text-gray-500 text-sm">No links added. Click &quot;Add Link&quot; to add project links.</p>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {selectedProject.links?.map((link, index) => (
                          <div key={index} className="bg-white rounded-lg p-4 border border-gray-200">
                            <a 
                              href={link} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-800 underline block font-medium transition-colors"
                            >
                              🔗 {link}
                            </a>
                          </div>
                        )) || (
                          <div className="bg-white rounded-lg p-6 border border-gray-200 text-center">
                            <span className="text-gray-500 italic">No links available</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  <Separator className="my-8" />

                  {/* Analysis and Feedback */}
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                      Project Analysis & Feedback
                    </h3>
                    <div className="grid grid-cols-1 gap-6">
                      <div>
                        <Label className="text-sm font-medium text-gray-700 block mb-3">Client Inputs</Label>
                        {isEditing ? (
                          <div className="bg-white rounded-lg border border-gray-200 p-1">
                            <Textarea
                              value={editingProject?.clientInputs || ""}
                              onChange={(e) => setEditingProject(prev => prev ? {...prev, clientInputs: e.target.value} : null)}
                              className="border-0 focus:ring-0 resize-none"
                              rows={4}
                              placeholder="Enter client inputs and feedback..."
                            />
                          </div>
                        ) : (
                          <div className="bg-white rounded-lg p-4 border border-gray-200 min-h-[100px]">
                            <p className="text-gray-900 whitespace-pre-wrap leading-relaxed">
                              {selectedProject.clientInputs || <span className="text-gray-500 italic">No client inputs recorded</span>}
                            </p>
                          </div>
                        )}
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-700 block mb-3">Effect Analysis</Label>
                        {isEditing ? (
                          <div className="bg-white rounded-lg border border-gray-200 p-1">
                            <Textarea
                              value={editingProject?.effectAnalysis || ""}
                              onChange={(e) => setEditingProject(prev => prev ? {...prev, effectAnalysis: e.target.value} : null)}
                              className="border-0 focus:ring-0 resize-none"
                              rows={4}
                              placeholder="Enter project effect analysis and impact assessment..."
                            />
                          </div>
                        ) : (
                          <div className="bg-white rounded-lg p-4 border border-gray-200 min-h-[100px]">
                            <p className="text-gray-900 whitespace-pre-wrap leading-relaxed">
                              {selectedProject.effectAnalysis || <span className="text-gray-500 italic">No effect analysis recorded</span>}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <Separator className="my-8" />

                  {/* Performance Metrics */}
                  <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-xl p-6 border border-orange-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                      <span className="w-2 h-2 bg-orange-500 rounded-full mr-3"></span>
                      Performance Metrics & Analytics
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 lg:gap-6">
                      <div className="bg-white rounded-xl p-4 lg:p-6 border border-gray-200 text-center shadow-sm hover:shadow-md transition-shadow">
                        <div className="text-2xl lg:text-3xl mb-2">💰</div>
                        <Label className="text-xs lg:text-sm text-gray-600 block mb-2">Budget vs Actual</Label>
                        <p className="text-sm lg:text-lg font-bold text-gray-900 break-words">
                          {selectedProject.budgetVsActual || 
                            (selectedProject.amount ? `$${selectedProject.amount.toLocaleString()}` : "N/A")
                          }
                        </p>
                      </div>
                      <div className="bg-white rounded-xl p-4 lg:p-6 border border-gray-200 text-center shadow-sm hover:shadow-md transition-shadow">
                        <div className="text-2xl lg:text-3xl mb-2">📈</div>
                        <Label className="text-xs lg:text-sm text-gray-600 block mb-2">Cost Efficiency</Label>
                        <p className="text-sm lg:text-lg font-bold text-green-600 break-words">
                          {selectedProject.costEfficiency || "N/A"}
                        </p>
                      </div>
                      <div className="bg-white rounded-xl p-4 lg:p-6 border border-gray-200 text-center shadow-sm hover:shadow-md transition-shadow">
                        <div className="text-2xl lg:text-3xl mb-2">🎯</div>
                        <Label className="text-xs lg:text-sm text-gray-600 block mb-2">Success Rate</Label>
                        <p className="text-sm lg:text-lg font-bold text-green-600 break-words">
                          {selectedProject.successRate || "N/A"}
                        </p>
                      </div>
                      <div className="bg-white rounded-xl p-4 lg:p-6 border border-gray-200 text-center shadow-sm hover:shadow-md transition-shadow">
                        <div className="text-2xl lg:text-3xl mb-2">⭐</div>
                        <Label className="text-xs lg:text-sm text-gray-600 block mb-2">Quality Score</Label>
                        <p className="text-sm lg:text-lg font-bold text-blue-600 break-words">
                          {selectedProject.qualityScore || "N/A"}
                        </p>
                      </div>
                      <div className="bg-white rounded-xl p-4 lg:p-6 border border-gray-200 text-center shadow-sm hover:shadow-md transition-shadow">
                        <div className="text-2xl lg:text-3xl mb-2">😊</div>
                        <Label className="text-xs lg:text-sm text-gray-600 block mb-2">Client Satisfaction</Label>
                        <p className="text-sm lg:text-lg font-bold text-red-600 break-words">
                          {selectedProject.clientSatisfaction || "N/A"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>
        ))
        )}
      </div>
    </div>
  )
}
