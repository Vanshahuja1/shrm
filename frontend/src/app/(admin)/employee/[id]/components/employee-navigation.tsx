"use client"

import { useParams, usePathname } from "next/navigation"
import Link from "next/link"
import { Target, Calendar, User, BarChart3, Zap, Database, Settings } from "lucide-react"
import { useCallback, useEffect, useState } from "react"
import axios from "@/lib/axiosInstance"
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

  const [stats, setStats] = useState<{ isWorking: boolean, workingHrs: number }>({
    isWorking: false,
    workingHrs: 0
  })

  const { id: empId } = useParams()

useEffect(() => {
  const fetchStats = async()=>{
    const res =await axios.get(`attendance/employee/stats/${empId}`)
    setStats({
      isWorking: res.data.isPunchedIn,
      workingHrs: res.data.attendanceRecord?.totalHours || 0
    })
  }
  fetchStats()
}, [employeeId])

  const tabs = [
    { id: "tasks", label: "Task List", icon: Target, href: `/employee/${employeeId}/tasks` },
    { id: "attendance", label: "Attendance System", icon: Calendar, href: `/employee/${employeeId}/attendance` },
    { id: "dashboard", label: "Personal Dashboard", icon: User, href: `/employee/${employeeId}/dashboard` },
    { id: "performance", label: "Performance Metrics", icon: BarChart3, href: `/employee/${employeeId}/performance` },
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
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors font-medium ${isActive ? "bg-blue-500 text-white shadow-md" : "text-gray-700 hover:bg-blue-50 hover:text-blue-700"
                }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-sm">{tab.label}</span>
            </Link>
          )
        })}
      </nav>

      {/* Quick Stats */}


      {/* Status Indicator */}
      <div className="mt-6 pt-6 border-t border-blue-200">
        <div className="flex items-center space-x-2">
          <div
            className={`w-3 h-3 rounded-full ${stats.isWorking ? "bg-green-500 animate-pulse" : "bg-gray-300"}`}
          ></div>
          <span className="text-sm text-gray-600">{stats.isWorking ? "Currently Working" : "Not Clocked In"}</span>
        </div>
        <div
          className={`w-3 h-3 rounded-full`}
        > {stats.workingHrs} </div>
      </div>
    </div>
  )
}
