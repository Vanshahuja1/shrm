"use client"

import { useEffect } from "react"
import { useParams, useRouter } from "next/navigation"

export default function DashboardPage() {
  const router = useRouter()
  const { id: managerId } = useParams()

  useEffect(() => {
    router.replace(`/manager/${managerId}/profile`) // Redirect to your main landing tab
  }, [router, managerId])

  return null
}
//hr ko employee ka bhi access rahega 
//punch in aur punch out ka bhi access rahega
//isacative ko change karna hai
//monthly revenue,charts