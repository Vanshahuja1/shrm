"use client"

import { useState, useEffect, use } from "react"
import { PerformanceMetrics } from "../components/performance-metrics"
import type { EmployeePerformanceMetricsType } from "@/types/employee"

export default function PerformancePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [metrics, setMetrics] = useState<EmployeePerformanceMetricsType | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPerformanceMetrics()
  }, [id])

  const fetchPerformanceMetrics = async () => {
    try {
      const response = await fetch(`/api/employees/${id}/performance`)
      if (response.ok) {
        const data = await response.json()
        setMetrics(data)
      }
    } catch (error) {
      console.error("Failed to fetch performance metrics:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading || !metrics) {
    return <div className="animate-pulse">Loading performance metrics...</div>
  }

  return <PerformanceMetrics metrics={metrics} />
}
