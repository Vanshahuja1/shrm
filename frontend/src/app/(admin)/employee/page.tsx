"use client"

import { useState, useEffect } from "react"
import { Bell, User, Calendar, Target, BarChart3, Clock, Zap, Database, Settings } from "lucide-react"

// Import components
import TaskList from           "./TaskList"
import AttendanceSystem from   "./AttendanceSystem"
import PersonalDashboard from  "./PersonalDashboard"
import PerformanceMetrics from "./PerformanceMetrics"
import OvertimeManagement from "./OvertimeManagement"
import WorkHoursDisplay from   "./WorkHoursDisplay"
import DataSyncStatus from     "./DataSyncStatus"
import EmployeeSettings from   "./EmployeeSettings"

// Import types and data
import type { EmployeeTask, AttendanceRecord, OvertimeRequest } from "@/types/employee"
import {
  mockEmployeeInfo,
  mockEmployeeTasks,
  mockAttendanceRecords,
  mockPerformanceMetrics,
  mockWorkHours,
  mockOvertimeRequests,
  mockDataToAdmin,
  mockDataToManager,
  mockEmployeeSettings,
} from "./data/employeeData";

export default function EmployeeDashboard() {
  const [activeTab, setActiveTab] = useState("tasks")
  const [currentTime, setCurrentTime] = useState(new Date())

  // Attendance states
  const [isPunchedIn, setIsPunchedIn] = useState(false)
  const [workStartTime, setWorkStartTime] = useState<string>("")
  const [totalWorkHours, setTotalWorkHours] = useState(7.5)
  const [breakTime, setBreakTime] = useState(45)
  const [overtimeHours, setOvertimeHours] = useState(0)

  // Data states
  const [employeeInfo] = useState(mockEmployeeInfo)
  const [tasks, setTasks] = useState<EmployeeTask[]>(mockEmployeeTasks)
  const [attendanceRecords] = useState<AttendanceRecord[]>(mockAttendanceRecords)
  const [performanceMetrics] = useState(mockPerformanceMetrics)
  const [workHours] = useState(mockWorkHours)
  const [overtimeRequests, setOvertimeRequests] = useState<OvertimeRequest[]>(mockOvertimeRequests)

  const [dataToAdmin] = useState(mockDataToAdmin)
  const [dataToManager] = useState(mockDataToManager)
  const [employeeSettings, setEmployeeSettings] = useState(mockEmployeeSettings)
  const [lastSyncTime] = useState("2024-07-15 09:00:00")
  const [syncStatus] = useState<"synced" | "pending" | "error">("synced")

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  // Handle punch in
  const handlePunchIn = () => {
    setIsPunchedIn(true)
    setWorkStartTime(currentTime.toLocaleTimeString())
  }

  // Handle punch out
  const handlePunchOut = () => {
    setIsPunchedIn(false)
    setWorkStartTime("")
  }

  // Handle break start
  const handleBreakStart = (breakType: "break1" | "break2" | "lunch") => {
    console.log(`Started ${breakType}`)
  }

  // Handle break end
  const handleBreakEnd = (breakType: "break1" | "break2" | "lunch") => {
    console.log(`Ended ${breakType}`)
  }

  // Handle task response
  const handleTaskResponse = (taskId: number, response: string, format: "text" | "document", documents?: string[]) => {
    setTasks(
      tasks.map((task) =>
        task.id === taskId
          ? {
              ...task,
              response: {
                id: Date.now(),
                response,
                format,
                documents,
                submittedAt: new Date().toLocaleString(),
                status: "submitted",
              },
              status: "completed",
            }
          : task,
      ),
    )
  }

  // Handle overtime request
  const handleOvertimeRequest = (hours: number, justification: string) => {
    const newRequest: OvertimeRequest = {
      id: Date.now(),
      date: new Date().toLocaleDateString(),
      hours,
      justification,
      status: "pending",
      submittedAt: new Date().toLocaleString(),
    }
    setOvertimeRequests([...overtimeRequests, newRequest])
  }

  const handleSettingsUpdate = (newSettings: EmployeeSettings) => {
    setEmployeeSettings(newSettings)
    console.log("Settings updated:", newSettings)
  }

  const tabs = [
    { id: "tasks", label: "Task List", icon: Target },
    { id: "attendance", label: "Attendance System", icon: Calendar },
    { id: "personal", label: "Personal Dashboard", icon: User },
    { id: "performance", label: "Performance Metrics", icon: BarChart3 },
    { id: "overtime", label: "Overtime Management", icon: Clock },
    { id: "workhours", label: "Work Hours Display", icon: Zap },
    { id: "datasync", label: "Data Sync Status", icon: Database },
    { id: "settings", label: "Settings", icon: Settings },
  ]

  const renderContent = () => {
    switch (activeTab) {
      case "tasks":
        return <TaskList tasks={tasks} onTaskResponse={handleTaskResponse} />
      case "attendance":
        return (
          <AttendanceSystem
            onPunchIn={handlePunchIn}
            onPunchOut={handlePunchOut}
            onBreakStart={handleBreakStart}
            onBreakEnd={handleBreakEnd}
            isPunchedIn={isPunchedIn}
            currentTime={currentTime}
            workStartTime={workStartTime}
            totalWorkHours={totalWorkHours}
            breakTime={breakTime}
            overtimeHours={overtimeHours}
          />
        )
      case "personal":
        return <PersonalDashboard employeeInfo={employeeInfo} attendanceRecords={attendanceRecords} />
      case "performance":
        return <PerformanceMetrics metrics={performanceMetrics} />
      case "overtime":
        return (
          <OvertimeManagement
            overtimeRequests={overtimeRequests}
            currentOvertimeHours={overtimeHours}
            onSubmitOvertimeRequest={handleOvertimeRequest}
          />
        )
      case "workhours":
        return <WorkHoursDisplay workHours={workHours} isActive={isPunchedIn} />
      case "datasync":
        return (
          <DataSyncStatus
            adminData={dataToAdmin}
            managerData={dataToManager}
            lastSyncTime={lastSyncTime}
            syncStatus={syncStatus}
          />
        )
      case "settings":
        return <EmployeeSettings settings={employeeSettings} onSettingsUpdate={handleSettingsUpdate} />
      default:
        return <TaskList tasks={tasks} onTaskResponse={handleTaskResponse} />
    }
  }

  return (
    <div className="min-h-screen bg-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-blue-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Employee Dashboard</h1>
              <p className="text-blue-600 text-lg">Welcome back, {employeeInfo.name}</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Bell className="w-6 h-6 text-gray-600" />
                <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {tasks.filter((t) => t.status === "pending").length}
                </span>
              </div>
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="flex space-x-6">
          {/* Sidebar */}
          <div className="w-72 bg-white rounded-lg shadow-sm border border-blue-200 p-4">
            <nav className="space-y-2">
              {tabs.map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors font-medium ${
                      activeTab === tab.id
                        ? "bg-blue-500 text-white shadow-md"
                        : "text-gray-700 hover:bg-blue-50 hover:text-blue-700"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="text-sm">{tab.label}</span>
                  </button>
                )
              })}
            </nav>

            {/* Quick Stats */}
            <div className="mt-6 pt-6 border-t border-blue-200">
              <h4 className="text-sm font-medium text-gray-900 mb-3">Quick Stats</h4>
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Pending Tasks:</span>
                  <span className="text-blue-600 font-medium">
                    {tasks.filter((t) => t.status === "pending").length}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Today's Hours:</span>
                  <span className="text-green-600 font-medium">{totalWorkHours.toFixed(1)}h</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Performance:</span>
                  <span className="text-purple-600 font-medium">{performanceMetrics.combinedPercentage}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Attendance:</span>
                  <span className="text-orange-600 font-medium">{performanceMetrics.attendanceScore}%</span>
                </div>
              </div>
            </div>

            {/* Status Indicator */}
            <div className="mt-6 pt-6 border-t border-blue-200">
              <div className="flex items-center space-x-2">
                <div
                  className={`w-3 h-3 rounded-full ${isPunchedIn ? "bg-green-500 animate-pulse" : "bg-gray-300"}`}
                ></div>
                <span className="text-sm text-gray-600">{isPunchedIn ? "Currently Working" : "Not Clocked In"}</span>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">{renderContent()}</div>
        </div>
      </div>
    </div>
  )
}
