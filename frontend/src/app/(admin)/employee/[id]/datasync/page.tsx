"use client"

import { useState, useEffect, use } from "react"
import { DataSyncStatus } from "../components/data-sync-status"
import axios from "@/lib/axiosInstance"

export default function DataSyncPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [syncData, setSyncData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchSyncData()
  }, [id])

  const fetchSyncData = async () => {
    try {
      const response = await axios.get(`/employees/${id}/data-sync`)
      setSyncData(response.data)
    } catch (error) {
      console.error("Failed to fetch sync data:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading || !syncData) {
    return <div className="animate-pulse">Loading sync status...</div>
  }

  return (
    <DataSyncStatus
      adminData={syncData.adminData}
      managerData={syncData.managerData}
      lastSyncTime={syncData.lastSyncTime}
      syncStatus={syncData.syncStatus}
    />
  )