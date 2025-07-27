"use client"

import { useState, useEffect, use } from "react"
import { AttendanceSystem } from "../components/attendance-system"

export default function AttendancePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [currentTime, setCurrentTime] = useState(new Date())
  const [attendanceData, setAttendanceData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    fetchAttendanceData()
    return () => clearInterval(timer)
  }, [id])

  const fetchAttendanceData = async () => {
    try {
      const response = await fetch(`/api/employees/${id}/attendance`)
      if (response.ok) {
        const data = await response.json()
        setAttendanceData(data)
      }
    } catch (error) {
      console.error("Failed to fetch attendance data:", error)
    } finally {
      setLoading(false)
    }
  }

  const handlePunchIn = async () => {
    try {
      const response = await fetch(`/api/employees/${id}/attendance`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          timestamp: new Date().toISOString(),
        }),
      })

      if (response.ok) {
        fetchAttendanceData()
      }
    } catch (error) {
      console.error("Failed to punch in:", error)
    }
  }

  const handlePunchOut = async () => {
    try {
      const response = await fetch(`/api/employees/${id}/attendance/punch-out`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          timestamp: new Date().toISOString(),
        }),
      })

      if (response.ok) {
        fetchAttendanceData()
      }
    } catch (error) {
      console.error("Failed to punch out:", error)
    }
  }

  const handleBreakStart = async (breakType: "break1" | "break2" | "lunch") => {
    try {
      await fetch(`/api/employees/${id}/attendance/breaks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: breakType,
          action: "start",
        }),
      })
    } catch (error) {
      console.error("Failed to start break:", error)
    }
  }

  const handleBreakEnd = async (breakType: "break1" | "break2" | "lunch") => {
    try {
      await fetch(`/api/employees/${id}/attendance/breaks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: breakType,
          action: "end",
        }),
      })
    } catch (error) {
      console.error("Failed to end break:", error)
    }
  }

  if (loading) {
    return <div className="animate-pulse">Loading attendance data...</div>
  }

  return (
    <AttendanceSystem
      onPunchIn={handlePunchIn}
      onPunchOut={handlePunchOut}
      onBreakStart={handleBreakStart}
      onBreakEnd={handleBreakEnd}
      isPunchedIn={attendanceData?.isPunchedIn || false}
      currentTime={currentTime}
      workStartTime={attendanceData?.workStartTime || ""}
      totalWorkHours={attendanceData?.totalWorkHours || 0}
      breakTime={attendanceData?.breakTime || 0}
      overtimeHours={attendanceData?.overtimeHours || 0}
    />
  )
}
