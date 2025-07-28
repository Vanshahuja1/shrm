"use client"

import { useState, useEffect, use } from "react"
import { PersonalDashboard } from "../components/personal-dashboard"
import type { EmployeeInfo, AttendanceRecord } from "../../types/employees";
import axios from "@/lib/axiosInstance"

export default function DashboardPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [employeeInfo, setEmployeeInfo] = useState<EmployeeInfo | null>(null)
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchEmployeeData()
    fetchAttendanceRecords()
  }, [id])

  const fetchEmployeeData = async () => {
    try {
      const response = await axios.get(`/employees/${id}`)
      setEmployeeInfo(response.data)
    } catch (error) {
      console.error("Failed to fetch employee data:", error)
    }
  }

  const fetchAttendanceRecords = async () => {
    try {
      const response = await axios.get(`/employees/${id}/attendance`)
      setAttendanceRecords(response.data)
    } catch (error) {
      console.error("Failed to fetch attendance records:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading || !employeeInfo) {
    return <div className="animate-pulse">Loading dashboard...</div>
  }

  return <PersonalDashboard employeeInfo={employeeInfo} attendanceRecords={attendanceRecords}