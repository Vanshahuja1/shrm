"use client"

import { usePathname, useRouter } from "next/navigation"
import { User, Calendar, CheckCircle, Send, MessageSquare, Settings, Target } from "lucide-react"
import { Building, LogOut, X } from "lucide-react"

interface SidebarProps {
  isSidebarOpen: boolean
  setIsSidebarOpen: (open: boolean) => void
  managerName?: string
  managerId: string
}

export default function Sidebar({ isSidebarOpen, setIsSidebarOpen , managerName, managerId}: SidebarProps) {
  const router = useRouter()
  const pathname = usePathname()

  const menuItems = [
    { id: "profile", label: "Manager Profile", icon: User },
    { id: "ongoing-projects", label: "Ongoing Projects", icon: Target },
    { id: "past-projects", label: "Past Projects", icon: CheckCircle },
    { id: "task-assignment", label: "Task Assignment", icon: Send },
    { id: "emp-response", label: "Employee Responses", icon: MessageSquare },
    { id: "attendance-mgmt", label: "Attendance Management", icon: Calendar },
    { id: "personal-details", label: "Personal Details", icon: Settings },
    
  ]

  return (
    <>
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" onClick={() => setIsSidebarOpen(false)} />
      )}

      <div
        className={`fixed left-0 top-0 h-full w-72 bg-white border-r border-gray-200 shadow-xl z-50 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:z-auto ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-red-700 rounded-lg flex items-center justify-center">
                  <Building className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">One Aim IT Solutions</h1>
                  <p className="text-sm text-gray-500">Enterprise Dashboard</p>
                </div>
              </div>
              <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden text-gray-400 hover:text-gray-600">
                <X size={24} />
              </button>
            </div>
          </div>

          <nav className="flex-1 p-4 space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon
              const active = pathname.startsWith(`/admin/manager/${managerId}/${item.id}`)
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    // if (item.id === "overview") {
                    //   router.push("/admin")
                    // } else {
                    //   router.push(`/admin/IT/${item.id}`)
                    // }
                    router.push(`/admin/manager/${managerId}/${item.id}`)
                    setIsSidebarOpen(false)
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 text-left ${
                    active
                      ? "bg-blue-50 text-red-700 border-l-4 border-red-600 font-semibold"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  <Icon size={20} />
                  {item.label}
                </button>
              )
            })}
          </nav>

          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50">
              <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-red-700 rounded-full flex items-center justify-center text-white font-semibold">
                M
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-900">{managerName ? managerName : "Manager"}</p>
              </div>
              <button className="text-gray-400 hover:text-red-600">
                <LogOut size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
