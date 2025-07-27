"use client"

import { useState, useEffect, use } from "react"
import { EmployeeSettings } from "../components/employee-settings"
import type { EmployeeSettings as EmployeeSettingsType } from "@/types/employee"

export default function SettingsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [settings, setSettings] = useState<EmployeeSettingsType | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchSettings()
  }, [id])

  const fetchSettings = async () => {
    try {
      const response = await fetch(`/api/employees/${id}/settings`)
      if (response.ok) {
        const data = await response.json()
        setSettings(data)
      }
    } catch (error) {
      console.error("Failed to fetch settings:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSettingsUpdate = async (newSettings: EmployeeSettingsType) => {
    try {
      const response = await fetch(`/api/employees/${id}/settings`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newSettings),
      })

      if (response.ok) {
        const updatedSettings = await response.json()
        setSettings(updatedSettings)
      }
    } catch (error) {
      console.error("Failed to update settings:", error)
    }
  }

  if (loading || !settings) {
    return <div className="animate-pulse">Loading settings...</div>
  }

  return <EmployeeSettings settings={settings} onSettingsUpdate={handleSettingsUpdate} />
}
