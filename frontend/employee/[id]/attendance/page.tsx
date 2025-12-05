"use client"

import { useState, useEffect, use, useCallback } from "react"
import { AttendanceSystem } from "../components/attendance-system"
import axios from "@/lib/axiosInstance";

interface AttendanceData {
  isPunchedIn?: boolean;
  workStartTime?: string;
  totalWorkHours?: number;
  breakTime?: number;
  overtimeHours?: number;
}

export default function AttendancePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [currentTime, setCurrentTime] = useState(new Date())
  const [attendanceData, setAttendanceData] = useState<AttendanceData | null>(null)
  const [todayBreaks, setTodayBreaks] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const fetchAttendanceData = useCallback(async () => {
    try {
      const tzOffset = new Date().getTimezoneOffset()
      const [attendanceRes, breaksRes] = await Promise.all([
        axios.get(`/employees/${id}/attendance`, { params: { tzOffset } }),
        axios.get(`/employees/${id}/attendance/breaks`, { params: { tzOffset } }),
      ])
      setAttendanceData(attendanceRes.data)
      setTodayBreaks(Array.isArray(breaksRes.data) ? breaksRes.data : [])
    } catch (error) {
      console.error("Failed to fetch attendance data:", error)
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    fetchAttendanceData()
    return () => clearInterval(timer)
  }, [fetchAttendanceData])

  // Auto-refresh today's hours every 1 minute
  useEffect(() => {
    const interval = setInterval(() => {
      fetchAttendanceData()
    }, 60_000)
    return () => clearInterval(interval)
  }, [fetchAttendanceData])

  const handlePunchIn = async () => {
    try {
      const tzOffset = new Date().getTimezoneOffset()
      await axios.post(`/employees/${id}/attendance`, {
        timestamp: new Date().toISOString(),
        tzOffset,
      });
      fetchAttendanceData();
    } catch (error) {
      console.error("Failed to punch in:", error);
    }
  }

  const handlePunchOut = async () => {
    try {
      const tzOffset = new Date().getTimezoneOffset()
      await axios.post(`/employees/${id}/attendance/punch-out`, {
        timestamp: new Date().toISOString(),
        tzOffset,
      })
      fetchAttendanceData()
    } catch (error) {
      console.error("Failed to punch out:", error)
    }
  }

  const handleBreakStart = async (breakType: "break1" | "break2" | "lunch") => {
    try {
      const tzOffset = new Date().getTimezoneOffset()
      await axios.post(`/employees/${id}/attendance/breaks`, {
        type: breakType,
        action: "start",
        tzOffset,
      })
      fetchAttendanceData()
    } catch (error) {
      console.error("Failed to start break:", error)
    }
  }

  const handleBreakEnd = async (breakType: "break1" | "break2" | "lunch") => {
    try {
      const tzOffset = new Date().getTimezoneOffset()
      await axios.post(`/employees/${id}/attendance/breaks`, {
        type: breakType,
        action: "end",
        tzOffset,
      })
      fetchAttendanceData()
    } catch (error) {
      console.error("Failed to end break:", error)
    }
  }

// ...existing code...

  if (loading) {
    return <div className="animate-pulse">Loading attendance data...</div>
  }

  return (
    <AttendanceSystem
      onPunchIn={handlePunchIn}
      onPunchOut={handlePunchOut}
      //onBreakStart={handleBreakStart}
     // onBreakEnd={handleBreakEnd}
      isPunchedIn={attendanceData?.isPunchedIn || false}
      currentTime={currentTime}
      workStartTime={attendanceData?.workStartTime || ""}
      totalWorkHours={attendanceData?.totalWorkHours || 0}
      //breakTime={attendanceData?.breakTime || 0}
      overtimeHours={attendanceData?.overtimeHours || 0}
      //breakSessions={todayBreaks}
    />
  )
}
