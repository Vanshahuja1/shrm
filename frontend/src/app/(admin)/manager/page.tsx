"use client"

import { useState } from "react"
import { Bell, User, Calendar, CheckCircle, Send, MessageSquare, Settings, Target } from "lucide-react"

// Import components
import ProfileSection from "./ProfileSection"
import OngoingProjects from "./OngoingProjects"
import PastProjects from "./PastProjects"
import TaskAssignment from "./TaskAssignment"
import EmployeeResponse from "./EmployeeResponse"
import AttendanceManagement from "./AttendanceManagement"
import PersonalDetails from "./PersonalDetails"
import NewProjectModal from "./modals/NewProjectModal"
import NewTaskModal from "./modals/NewTaskModal"

// Import types and data
import type { Project, Task, AttendanceRecord, AdminData, EmailNotification } from "@/types"
import {
  mockManagerInfo,
  mockOngoingProjects,
  mockPastProjects,
  mockTasks,
  mockAttendanceRecords,
  mockEmailNotifications,
  mockAdminData,
} from "./data/mockData"

export default function ManagerDashboard() {
  const [activeTab, setActiveTab] = useState("profile")

  // State management
  const [managerInfo] = useState(mockManagerInfo)
  const [ongoingProjects, setOngoingProjects] = useState<Project[]>(mockOngoingProjects)
  const [pastProjects] = useState<Project[]>(mockPastProjects)
  const [tasks, setTasks] = useState<Task[]>(mockTasks)
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>(mockAttendanceRecords)
  const [emailNotifications] = useState<EmailNotification[]>(mockEmailNotifications)
  const [adminData, setAdminData] = useState<AdminData>(mockAdminData)

  // Modal states
  const [showNewProject, setShowNewProject] = useState(false)
  const [showNewTask, setShowNewTask] = useState(false)

  // Handle project progress change and send to admin
  const handleProgressChange = (projectId: number, newProgress: number) => {
    setOngoingProjects(
      ongoingProjects.map((project) => {
        if (project.id === projectId) {
          const updatedProject = { ...project, progress: newProgress }
          // Send data to admin
          setAdminData((prev) => ({
            ...prev,
            projectUpdates: [
              ...prev.projectUpdates,
              {
                projectId,
                projectName: project.name,
                oldProgress: project.progress,
                newProgress,
                updatedBy: managerInfo.name,
                timestamp: new Date().toISOString(),
              },
            ],
          }))
          return updatedProject
        }
        return project
      }),
    )
  }

  // Handle task rating and send to admin
  const handleTaskRating = (taskId: number, responseId: number, rating: number) => {
    setTasks(
      tasks.map((task) => {
        if (task.id === taskId) {
          const updatedTask = {
            ...task,
            responses: task.responses.map((response) =>
              response.id === responseId ? { ...response, rating } : response,
            ),
          }
          // Send data to admin
          setAdminData((prev) => ({
            ...prev,
            employeeResponses: [
              ...prev.employeeResponses,
              {
                taskId,
                taskTitle: task.title,
                employee: task.assignedTo,
                rating,
                ratedBy: managerInfo.name,
                timestamp: new Date().toISOString(),
              },
            ],
          }))
          return updatedTask
        }
        return task
      }),
    )
  }

  // Handle attendance edit
  const handleAttendanceEdit = (record: AttendanceRecord) => {
    console.log("Editing attendance record:", record)
    // Implementation for editing attendance
  }

  // Handle attendance regularization
  const handleRegularization = (record: AttendanceRecord, reason: string) => {
    setAttendanceRecords(
      attendanceRecords.map((r) =>
        r.date === record.date && r.employee === record.employee
          ? { ...r, regularized: true, regularizationReason: reason }
          : r,
      ),
    )
    // Send data to admin
    setAdminData((prev) => ({
      ...prev,
      attendanceData: [
        ...prev.attendanceData,
        {
          employee: record.employee,
          date: record.date,
          action: "regularized",
          reason,
          approvedBy: managerInfo.name,
          timestamp: new Date().toISOString(),
        },
      ],
    }))
  }

  // Handle new project submission
  const handleNewProject = (projectData: any) => {
    console.log("New project data:", projectData)
    // Implementation for adding new project
  }

  // Handle new task submission
  const handleNewTask = (taskData: any) => {
    console.log("New task data:", taskData)
    // Implementation for adding new task
  }

  const tabs = [
    { id: "profile", label: "Manager Profile", icon: User },
    { id: "ongoing-projects", label: "Ongoing Projects", icon: Target },
    { id: "past-projects", label: "Past Projects", icon: CheckCircle },
    { id: "task-assignment", label: "Task Assignment", icon: Send },
    { id: "employee-response", label: "Employee Response", icon: MessageSquare },
    { id: "attendance", label: "Attendance Management", icon: Calendar },
    { id: "personal", label: "Personal Details", icon: Settings },
  ]

  const renderContent = () => {
    switch (activeTab) {
      case "profile":
        return <ProfileSection managerInfo={managerInfo} />
      case "ongoing-projects":
        return (
          <OngoingProjects
            projects={ongoingProjects}
            onProgressChange={handleProgressChange}
            onShowNewProject={() => setShowNewProject(true)}
          />
        )
      case "past-projects":
        return <PastProjects projects={pastProjects} />
      case "task-assignment":
        return (
          <TaskAssignment tasks={tasks} onShowNewTask={() => setShowNewTask(true)} onTaskRating={handleTaskRating} />
        )
      case "employee-response":
        return <EmployeeResponse managerInfo={managerInfo} tasks={tasks} />
      case "attendance":
        return (
          <AttendanceManagement
            attendanceRecords={attendanceRecords}
            onAttendanceEdit={handleAttendanceEdit}
            onRegularization={handleRegularization}
          />
        )
      case "personal":
        return <PersonalDetails managerInfo={managerInfo} />
      default:
        return <ProfileSection managerInfo={managerInfo} />
    }
  }

  return (
    <div className="min-h-screen bg-red-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-red-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Manager Dashboard</h1>
              <p className="text-red-600 text-lg">Welcome back, {managerInfo.name}</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Bell className="w-6 h-6 text-gray-600" />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {emailNotifications.length}
                </span>
              </div>
              <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="flex space-x-6">
          {/* Sidebar */}
          <div className="w-72 bg-white rounded-lg shadow-sm border border-red-200 p-4">
            <nav className="space-y-2">
              {tabs.map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors font-medium ${
                      activeTab === tab.id
                        ? "bg-red-500 text-white shadow-md"
                        : "text-gray-700 hover:bg-red-50 hover:text-red-700"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="text-sm">{tab.label}</span>
                  </button>
                )
              })}
            </nav>

            {/* Data to Admin Status */}
            <div className="mt-6 pt-6 border-t border-red-200">
              <h4 className="text-sm font-medium text-gray-900 mb-3">Data Sync Status</h4>
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Project Updates:</span>
                  <span className="text-green-600 font-medium">{adminData.projectUpdates.length} sent</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Employee Data:</span>
                  <span className="text-green-600 font-medium">{adminData.employeeResponses.length} sent</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Attendance:</span>
                  <span className="text-green-600 font-medium">{adminData.attendanceData.length} sent</span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">{renderContent()}</div>
        </div>
      </div>

      {/* Modals */}
      <NewProjectModal isOpen={showNewProject} onClose={() => setShowNewProject(false)} onSubmit={handleNewProject} />

      <NewTaskModal
        isOpen={showNewTask}
        onClose={() => setShowNewTask(false)}
        onSubmit={handleNewTask}
        managerInfo={managerInfo}
      />
    </div>
  )
}
