"use client"

import { Menu, Bell, Settings } from "lucide-react"
import { usePathname } from "next/navigation"

interface TopHeaderProps {
  setIsSidebarOpen: (open: boolean) => void
  managerName?: string
}

export default function TopHeader({ setIsSidebarOpen, managerName }: TopHeaderProps) {
  const pathname = usePathname()

  const getPageTitle = (path: string) => {
    if (path.startsWith("/profile")) return "Manager Profile"
    if (path.startsWith("/outgoing-projects")) return "Outgoing Projects"
    if (path.startsWith("/past-projects")) return "Past Projects"
    if (path.startsWith("/task-assignment")) return "Task Assignment"
    if (path.startsWith("/emp-response")) return "Employee Responses"
    if (path.startsWith("/attendance-mgmt")) return "Attendance Management"
    if (path.startsWith("/personal-details")) return "Personal Details"
    
    return "Manager Dashboard"
  }

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="lg:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100"
          >
            <Menu size={24} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{getPageTitle(pathname)}</h1>
            {/* <p className="text-sm text-gray-500">Welcome back, manage your organization efficiently</p> */}
            <p>Welcome back, {managerName ? managerName : "Manager"}</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 relative">
            <Bell size={20} />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-600 rounded-full"></span>
          </button>
          <button className="p-2 rounded-lg text-gray-600 hover:bg-gray-100">
            <Settings size={20} />
          </button>
        </div>
      </div>
    </header>
  )
}
