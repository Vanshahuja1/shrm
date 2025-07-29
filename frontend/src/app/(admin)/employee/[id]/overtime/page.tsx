"use client"

import { useState, useEffect, use } from "react"
import { OvertimeManagement } from "../components/overtime-management"
import type { OvertimeRequest } from "../../types/employees";
import axios from "@/lib/axiosInstance"

export default function OvertimePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [overtimeRequests, setOvertimeRequests] = useState<OvertimeRequest[]>([])
  const [currentOvertimeHours, setCurrentOvertimeHours] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchOvertimeData()
  }, [id])

  const fetchOvertimeData = async () => {
    try {
      const response = await axios.get(`/employees/${id}/overtime`)
      setOvertimeRequests(response.data.requests || [])
      setCurrentOvertimeHours(response.data.currentHours || 0)
    } catch (error) {
      console.error("Failed to fetch overtime data:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmitOvertimeRequest = async (hours: number, justification: string) => {
    try {
      await axios.post(`/employees/${id}/overtime`, {
        hours,
        justification,
        date: new Date().toISOString().split("T")[0],
      })
      fetchOvertimeData() // Refresh data
    } catch (error) {
      console.error("Failed to submit overtime request:", error)
    }
  }

  if (loading) {
    return <div className="animate-pulse">Loading overtime data...</div>
  }

  return (
    <OvertimeManagement
      overtimeRequests={overtimeRequests}
      currentOvertimeHours={currentOvertimeHours}
      onSubmitOvertimeRequest={handleSubmitOvertimeRequest}
    />
  );}