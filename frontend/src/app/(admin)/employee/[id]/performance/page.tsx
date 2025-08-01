"use client"

import { useState, useEffect, use, useCallback } from "react"
import { PerformanceMetrics } from "../components/performance-metrics"
import type { EmployeePerformanceMetricsType } from "../../types/employees";
import axios from "@/lib/axiosInstance"

export default function PerformancePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [metrics, setMetrics] = useState<EmployeePerformanceMetricsType | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchPerformanceMetrics = useCallback(async () => {
    try {
      const response = await axios.get(`/employees/${id}/performance`)
      setMetrics(response.data)
    } catch (error) {
      console.error("Failed to fetch performance metrics:", error)
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    fetchPerformanceMetrics()
  }, [fetchPerformanceMetrics])

  if (loading || !metrics) {
    return <div className="animate-pulse">Loading performance metrics...</div>
  }

  return (<PerformanceMetrics metrics={metrics} />);}