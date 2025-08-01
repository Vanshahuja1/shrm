"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { Target, Calendar, User, BarChart3, Clock, Zap, Database, Settings } from "lucide-react"
import { useEffect, useState, useCallback } from "react"

interface EmployeeNavigationProps {
  employeeId: string
}

interface Task {
  status: string
  id?: string
  title?: string
  description?: string
}

export function EmployeeNavigation({ employeeId }: EmployeeNavigationProps) {
  const pathname = usePathname()
  const [quickStats, setQuickStats] = useState({
    pendingTasks: 0,
    todayHours: 0,
    performance: 0,
    attendance: 0,
    isWorking: false,
  })

  const fetchQuickStats = useCallback(async () => {
    try {
      // Fetch quick stats from multiple endpoints
      const [tasksRes, workHoursRes, performanceRes, attendanceRes] = await Promise.all([
        fetch(`/api/employees/${employeeId}/tasks`),
        fetch(`/api/employees/${employeeId}/work-hours`),
        fetch(`/api/employees/${employeeId}/performance`),
        fetch(`/api/employees/${employeeId}/attendance`),
      ])

      const [tasks, workHours, performance, attendance] = await Promise.all([
        tasksRes.json(),
        workHoursRes.json(),
        performanceRes.json(),
        attendanceRes.json(),
      ])

      setQuickStats({
        pendingTasks: tasks.filter((t: Task) => t.status === "pending").length,
        todayHours: workHours.todayHours || 0,
        performance: performance.combinedPercentage || 0,
        attendance: performance.attendanceScore || 0,
        isWorking: attendance.isPunchedIn || false,
      })
    } catch (error) {
      console.error("Failed to fetch quick stats:", error)
    }
  }, [employeeId])

  useEffect(() => {
    fetchQuickStats()
  }, [fetchQuickStats])

  const tabs = [
    { id: "tasks", label: "Task List", icon: Target, href: `/employee/${employeeId}/tasks` },
    { id: "attendance", label: "Attendance System", icon: Calendar, href: `/employee/${employeeId}/attendance` },
    { id: "dashboard", label: "Personal Dashboard", icon: User, href: `/employee/${employeeId}/dashboard` },
    { id: "performance", label: "Performance Metrics", icon: BarChart3, href: `/employee/${employeeId}/performance` },
    { id: "overtime", label: "Overtime Management", icon: Clock, href: `/employee/${employeeId}/overtime` },
    { id: "workhours", label: "Work Hours Display", icon: Zap, href: `/employee/${employeeId}/workhours` },
    { id: "datasync", label: "Data Sync Status", icon: Database, href: `/employee/${employeeId}/datasync` },
    { id: "settings", label: "Settings", icon: Settings, href: `/employee/${employeeId}/settings` },
  ]

  return (
    <div className="w-72 bg-white rounded-lg shadow-sm border border-blue-200 p-4">
      <nav className="space-y-2">
        {tabs.map((tab) => {
          const Icon = tab.icon
          const isActive = pathname === tab.href

          return (
            <Link
              key={tab.id}
              href={tab.href}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors font-medium ${
                isActive ? "bg-blue-500 text-white shadow-md" : "text-gray-700 hover:bg-blue-50 hover:text-blue-700"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-sm">{tab.label}</span>
            </Link>
          )
        })}
      </nav>

      {/* Quick Stats */}
      <div className="mt-6 pt-6 border-t border-blue-200">
        <h4 className="text-sm font-medium text-gray-900 mb-3">Quick Stats</h4>
        <div className="space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Pending Tasks:</span>
            <span className="text-blue-600 font-medium">{quickStats.pendingTasks}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Today&apos;s Hours:</span>
            <span className="text-green-600 font-medium">{quickStats.todayHours.toFixed(1)}h</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Performance:</span>
            <span className="text-purple-600 font-medium">{quickStats.performance}%</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Attendance:</span>
            <span className="text-orange-600 font-medium">{quickStats.attendance}%</span>
          </div>
        </div>
      </div>

      {/* Status Indicator */}
      <div className="mt-6 pt-6 border-t border-blue-200">
        <div className="flex items-center space-x-2">
          <div
            className={`w-3 h-3 rounded-full ${quickStats.isWorking ? "bg-green-500 animate-pulse" : "bg-gray-300"}`}
          ></div>
          <span className="text-sm text-gray-600">{quickStats.isWorking ? "Currently Working" : "Not Clocked In"}</span>
        </div>
      </div>
    </div>
  )
}
