"use client"

import { useState, useEffect, use, useCallback } from "react"
import { WorkHoursDisplay } from "../components/work-hours-display"
import type { WorkHours } from "../../types/employees"
import axios from "@/lib/axiosInstance"

export default function WorkHoursPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [workHours, setWorkHours] = useState<WorkHours | null>(null)
  const [isActive, setIsActive] = useState(false)
  const [onBreak, setOnBreak] = useState(false)
  const [loading, setLoading] = useState(true)

  const fetchWorkHours = useCallback(async () => {
    try {
      const tzOffset = new Date().getTimezoneOffset()
      const [workRes, attendanceRes, breaksRes] = await Promise.all([
        axios.get(`/employees/${id}/work-hours`, { params: { tzOffset } }),
        axios.get(`/employees/${id}/attendance`, { params: { tzOffset } }),
        axios.get(`/employees/${id}/attendance/breaks`, { params: { tzOffset } }),
      ])
      setWorkHours(workRes.data)
      const isPunchedIn = attendanceRes.data?.isPunchedIn || false
      const breaks: Array<{ endTime?: string }> = breaksRes.data || []
      const hasActiveBreak = Array.isArray(breaks) && breaks.some((b) => !b.endTime)
      setIsActive(isPunchedIn && !hasActiveBreak)
      setOnBreak(isPunchedIn && hasActiveBreak)
    } catch (error) {
      console.error("Failed to fetch work hours:", error)
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    fetchWorkHours()
  }, [fetchWorkHours])

  if (loading || !workHours) {
    return <div className="animate-pulse">Loading work hours...</div>
  }

  return <WorkHoursDisplay workHours={workHours} isActive={isActive} onBreak={onBreak} />
}
