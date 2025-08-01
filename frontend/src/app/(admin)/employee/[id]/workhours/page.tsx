"use client"

import { useState, useEffect, use, useCallback } from "react"
import { WorkHoursDisplay } from "../components/work-hours-display"
import type { WorkHours } from "../../types/employees"

export default function WorkHoursPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [workHours, setWorkHours] = useState<WorkHours | null>(null)
  const [isActive, setIsActive] = useState(false)
  const [loading, setLoading] = useState(true)

  const fetchWorkHours = useCallback(async () => {
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
  }, [id])

  useEffect(() => {
    fetchWorkHours()
  }, [fetchWorkHours])

  if (loading || !workHours) {
    return <div className="animate-pulse">Loading work hours...</div>
  }

  return <WorkHoursDisplay workHours={workHours} isActive={isActive} />
}
