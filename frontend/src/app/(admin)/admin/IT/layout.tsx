"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useParams } from "next/navigation"
import Sidebar from "./Sidebar"
import TopHeader from "./TopHeader"
import axiosInstance from "@/lib/axiosInstance"

interface AdminData {
  name: string
  organizationId: string
}

interface OrganizationData {
  name: string
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [adminData, setAdminData] = useState<AdminData | null>(null)
  const [organizationData, setOrganizationData] = useState<OrganizationData | null>(null)
  const { id: adminId } = useParams()

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        // Fetch admin data
        const adminResponse = await axiosInstance.get(`/user/${adminId}`)
        if (adminResponse.data.success) {
          const admin = adminResponse.data.data
          setAdminData(admin)
          
          // Fetch organization data using the admin's organizationId
          if (admin.organizationId) {
            const orgResponse = await axiosInstance.get(`/organizations/${admin.organizationId}`)
            if (orgResponse.data.success) {
              setOrganizationData(orgResponse.data.data)
            }
          }
        }
      } catch (error) {
        console.error("Error fetching admin/organization data:", error)
      }
    }

    if (adminId) {
      fetchAdminData()
    }
  }, [adminId])

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        adminName={adminData?.name}
        organizationName={organizationData?.name}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <TopHeader setIsSidebarOpen={setIsSidebarOpen} adminName={adminData?.name} />

        <main className="flex-1 p-6 overflow-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={typeof window !== "undefined" ? location.pathname : "initial"}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  )
}
