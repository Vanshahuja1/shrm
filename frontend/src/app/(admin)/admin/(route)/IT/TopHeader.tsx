"use client"

import { Menu, Bell, Settings } from "lucide-react"

interface TopHeaderProps {
  activeTab: string
  setIsSidebarOpen: (open: boolean) => void
}

export default function TopHeader({ activeTab, setIsSidebarOpen }: TopHeaderProps) {
  const getPageTitle = (tab: string) => {
    switch (tab) {
      case "overview":
        return "Dashboard Overview"
      case "departments":
        return "Department Management"
      case "projects":
        return "Project Management"
      case "members":
        return "Organization Members"
      case "hierarchy":
        return "Organization Hierarchy"
      case "tasks":
        return "Task Management"
      case "analytics":
        return "Analytics & Charts"
      case "emails":
        return "Email System"
      default:
        return "Dashboard"
    }
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
            <h1 className="text-2xl font-bold text-gray-900">{getPageTitle(activeTab)}</h1>
            <p className="text-sm text-gray-500">Welcome back, manage your organization efficiently</p>
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
