"use client"

import { useEffect } from "react"
import { useParams, useRouter } from "next/navigation"

export default function DashboardPage() {
  const router = useRouter()
  const { id: managerId } = useParams()

  useEffect(() => {
    router.replace(`/admin/manager/${managerId}/profile`) // Redirect to your main landing tab
  }, [router, managerId])

  return null
}
