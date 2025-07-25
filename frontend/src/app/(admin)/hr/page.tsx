"use client"

import { useEffect } from "react"
import { useParams, useRouter } from "next/navigation"

export default function DashboardPage() {
  const router = useRouter()
  const { hr_id: hrId } = useParams()

  useEffect(() => {
    router.replace(`/hr/${hrId}/profile`) // Redirect to your main landing tab
  }, [router, hrId])

  return null
}