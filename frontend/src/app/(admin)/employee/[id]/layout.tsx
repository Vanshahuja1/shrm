"use client"
import type React from "react"
import { use, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { EmployeeNavigation } from "./components/employee-navigation"
import { EmployeeHeader } from "./components/employee-header"

export default function EmployeeLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const router = useRouter()
  const [authorized, setAuthorized] = useState(false)

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null
    if (!token) {
      router.replace('/login')
      return
    }
    try {
      const parts = token.split('.')
      if (parts.length !== 3) {
        router.replace('/login')
        return
      }
      const payload = JSON.parse(atob(parts[1])) as { exp?: number }
      if (payload?.exp && payload.exp * 1000 <= Date.now()) {
        localStorage.removeItem('authToken')
        router.replace('/login')
        return
      }
    } catch (_) {
      router.replace('/login')
      return
    }
    setAuthorized(true)
  }, [router])

  if (!authorized) {
    return null
  }
  
  return (
    <div className="min-h-screen bg-blue-50">
      <EmployeeHeader employeeId={id} />

      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="flex space-x-6">
          <EmployeeNavigation employeeId={id} />
          <div className="flex-1">{children}</div>
        </div>
      </div>
    </div>
  )
}
