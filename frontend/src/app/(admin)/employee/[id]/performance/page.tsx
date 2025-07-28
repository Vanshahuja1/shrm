"use client"

import { useState, useEffect, use } from "react"
import { PerformanceMetrics } from "../components/performance-metrics"
import type { EmployeePerformanceMetricsType } from "../../types/employees";
import axios from "@/lib/axiosInstance"

export default function PerformancePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [metrics, setMetrics] = useState<EmployeePerformanceMetricsType | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPerformanceMetrics()
  }, [id])

  const fetchPerformanceMetrics = async () => {
    try {
      const response = await axios.get(`/employees/${id}/performance`)
      setMetrics(response.data)
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