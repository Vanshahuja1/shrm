"use client"

import { useState, useEffect, use } from "react"
import { WorkHoursDisplay } from "../components/work-hours-display"
import type { WorkHours } from "@/types/employee"

export default function WorkHoursPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [workHours, setWorkHours] = useState<WorkHours | null>(null)
  const [isActive, setIsActive] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchWorkHours()
  }, [id])

  const fetchWorkHours = async () => {
    try {
      const response = await fetch(`/api/employees/${id}/work-hours`)
      if (response.ok) {
        const data = await response.json()
        setWorkHours(data)
        setIsActive(data.isActive || false)
      }
    } catch (error) {
      console.error("Failed to fetch work hours:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading || !workHours) {
    return <div className="animate-pulse">Loading work hours...</div>
  }

  return <WorkHoursDisplay workHours={workHours} isActive={isActive} />
}
