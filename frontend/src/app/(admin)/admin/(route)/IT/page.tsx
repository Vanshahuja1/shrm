"use client"

import { useState } from "react"
import DepartmentManagement from "./DepartmentManagement"
import ProjectManagement from "./ProjectManagement"
import MemberManagement from "./MemberManagement"
import OrganizationHierarchy from "./OrganizationHierarchy"
import TaskManagement from "./TaskManagement"
import AnalyticsCharts from "./AnalyticsCharts"
import EmailSystem from "./EmailSystem"
import Overview from "./Overview"
import DashboardLayout from "./DashboardLayout"
import { motion } from "framer-motion"
import {
  Users,
  Briefcase,
  TrendingUp,
  Calendar,
  Trash2,
  DollarSign,
  Building,
  BarChart3,
  Activity,
  Menu,
  X,
  Home,
  FolderOpen,
  ChevronRight,
  Mail,
  Phone,
  MapPin,
  Award,
  UserCheck,
  Target,
  PieChart,
  ArrowLeft,
  Search,
  Settings,
  Bell,
  LogOut,
} from "lucide-react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart as RechartsPieChart,
  Cell,
} from "recharts"

// Types
type DepartmentMember = {
  id: number
  name: string
  position: string
  salary: number
  experience: string
  joinDate: string
  email: string
  phone: string
  address: string
  manager: string
  skills: string[]
  performance: number
  avatar?: string
}

type Department = {
  id: number
  name: string
  managers: number
  coManagers: number
  employees: number
  interns: number
  members: DepartmentMember[]
  budget: number
  head: string
}

type Project = {
  id: number
  name: string
  description: string
  amount: number
  client: string
  deadline: string
  startDate: string
  progress?: number
  status: "active" | "completed" | "pending"
  team: string[]
}

// Sample data
const sampleDepartments: Department[] = [
  {
    id: 1,
    name: "IT Development",
    managers: 3,
    coManagers: 2,
    employees: 25,
    interns: 8,
    budget: 850000,
    head: "Sarah Johnson",
    members: [
      {
        id: 1,
        name: "John Doe",
        position: "Senior Developer",
        salary: 8500,
        experience: "5 years",
        joinDate: "2023-01-15",
        email: "john.doe@company.com",
        phone: "+1-555-0101",
        address: "123 Tech Street, Silicon Valley",
        manager: "Sarah Johnson",
        skills: ["React", "Node.js", "Python", "AWS"],
        performance: 92,
      },
      {
        id: 2,
        name: "Jane Smith",
        position: "Frontend Developer",
        salary: 6500,
        experience: "3 years",
        joinDate: "2023-03-20",
        email: "jane.smith@company.com",
        phone: "+1-555-0102",
        address: "456 Code Avenue, Tech City",
        manager: "Sarah Johnson",
        skills: ["React", "TypeScript", "CSS", "Figma"],
        performance: 88,
      },
      {
        id: 3,
        name: "Mike Johnson",
        position: "DevOps Engineer",
        salary: 7500,
        experience: "4 years",
        joinDate: "2023-02-10",
        email: "mike.johnson@company.com",
        phone: "+1-555-0103",
        address: "789 Cloud Lane, DevOps District",
        manager: "Sarah Johnson",
        skills: ["Docker", "Kubernetes", "AWS", "Jenkins"],
        performance: 90,
      },
    ],
  },
  {
    id: 2,
    name: "Human Resources",
    managers: 2,
    coManagers: 1,
    employees: 12,
    interns: 3,
    budget: 320000,
    head: "David Brown",
    members: [
      {
        id: 4,
        name: "Sarah Wilson",
        position: "HR Manager",
        salary: 7000,
        experience: "6 years",
        joinDate: "2022-11-05",
        email: "sarah.wilson@company.com",
        phone: "+1-555-0201",
        address: "321 People Street, HR Heights",
        manager: "David Brown",
        skills: ["Recruitment", "Employee Relations", "Training", "Payroll"],
        performance: 94,
      },
    ],
  },
  {
    id: 3,
    name: "Business Development",
    managers: 2,
    coManagers: 2,
    employees: 18,
    interns: 5,
    budget: 420000,
    head: "Maria Garcia",
    members: [
      {
        id: 6,
        name: "Emma Davis",
        position: "Business Analyst",
        salary: 6800,
        experience: "4 years",
        joinDate: "2023-01-20",
        email: "emma.davis@company.com",
        phone: "+1-555-0301",
        address: "654 Business Blvd, Commerce Center",
        manager: "Maria Garcia",
        skills: ["Data Analysis", "Market Research", "SQL", "Excel"],
        performance: 86,
      },
    ],
  },
]

const sampleOngoingProjects: Project[] = [
  {
    id: 1,
    name: "E-commerce Platform Redesign",
    description: "Complete overhaul of the existing e-commerce platform with modern UI/UX and enhanced functionality.",
    amount: 250000,
    client: "TechCorp Solutions",
    deadline: "2024-08-15",
    startDate: "2024-01-10",
    progress: 65,
    status: "active",
    team: ["John Doe", "Jane Smith", "Mike Johnson"],
  },
  {
    id: 2,
    name: "Mobile Banking App",
    description: "Development of a secure mobile banking application with biometric authentication.",
    amount: 180000,
    client: "SecureBank Ltd",
    deadline: "2024-09-30",
    startDate: "2024-02-01",
    progress: 40,
    status: "active",
    team: ["Jane Smith", "Emma Davis"],
  },
  {
    id: 3,
    name: "HR Management System",
    description: "Internal HR management system for employee tracking and performance management.",
    amount: 120000,
    client: "Internal Project",
    deadline: "2024-07-20",
    startDate: "2024-03-15",
    progress: 80,
    status: "active",
    team: ["Sarah Wilson", "Mike Johnson"],
  },
]

const samplePastProjects: Project[] = [
  {
    id: 4,
    name: "Inventory Management System",
    description: "Complete inventory tracking system with real-time updates and analytics.",
    amount: 95000,
    client: "RetailMax Inc",
    deadline: "2023-12-15",
    startDate: "2023-08-01",
    progress: 100,
    status: "completed",
    team: ["John Doe", "Emma Davis"],
  },
  {
    id: 5,
    name: "Customer Portal",
    description: "Self-service customer portal with account management and support features.",
    amount: 75000,
    client: "ServicePro Ltd",
    deadline: "2023-11-30",
    startDate: "2023-07-15",
    progress: 100,
    status: "completed",
    team: ["Jane Smith", "Mike Johnson"],
  },
]

const monthlyData = [
  { month: "Jan", revenue: 2100000, employees: 235, projects: 15 },
  { month: "Feb", revenue: 2300000, employees: 240, projects: 16 },
  { month: "Mar", revenue: 2200000, employees: 242, projects: 17 },
  { month: "Apr", revenue: 2500000, employees: 245, projects: 18 },
  { month: "May", revenue: 2400000, employees: 247, projects: 18 },
  { month: "Jun", revenue: 2600000, employees: 247, projects: 20 },
]

const departmentBudgetData = [
  { name: "IT Development", budget: 850000, color: "#DC2626" },
  { name: "HR", budget: 320000, color: "#059669" },
  { name: "Business Dev", budget: 420000, color: "#7C3AED" },
  { name: "Management", budget: 500000, color: "#D97706" },
  { name: "IT Support", budget: 280000, color: "#DC2626" },
]

// Sidebar Navigation
const Sidebar = ({ activeTab, setActiveTab, isSidebarOpen, setIsSidebarOpen }) => {
  const menuItems = [
    { id: "overview", label: "Dashboard", icon: Home },
    { id: "departments", label: "Departments", icon: Building },
    { id: "ongoing-projects", label: "Active Projects", icon: Briefcase },
    { id: "past-projects", label: "Completed Projects", icon: FolderOpen },
    { id: "hierarchy", label: "Organization", icon: Activity },
  ]

  return (
    <>
      {/* Mobile overlay */}
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" onClick={() => setIsSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <div
        className={`fixed left-0 top-0 h-full w-72 bg-white border-r border-gray-200 shadow-xl z-50 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:z-auto ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo Section */}
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

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id)
                    setIsSidebarOpen(false)
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 text-left ${
                    activeTab === item.id
                      ? "bg-red-50 text-red-700 border-l-4 border-red-600 font-semibold"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  <Icon size={20} />
                  {item.label}
                </button>
              )
            })}
          </nav>

          {/* User Section */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50">
              <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-red-700 rounded-full flex items-center justify-center text-white font-semibold">
                A
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-900">Admin User</p>
                <p className="text-sm text-gray-500">System Administrator</p>
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

// Top Header Bar
const TopHeader = ({ activeTab, setIsSidebarOpen }) => {
  const getPageTitle = (tab) => {
    switch (tab) {
      case "overview":
        return "Dashboard Overview"
      case "departments":
        return "Department Management"
      case "ongoing-projects":
        return "Active Projects"
      case "past-projects":
        return "Completed Projects"
      case "hierarchy":
        return "Organization Structure"
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

// Overview Component with Charts
const OverviewComponent = () => {
  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { title: "Total Employees", value: "247", change: "+12%", icon: Users, color: "red" },
          { title: "Active Projects", value: "18", change: "+5%", icon: Briefcase, color: "green" },
          { title: "Monthly Revenue", value: "$2.6M", change: "+18%", icon: TrendingUp, color: "blue" },
          { title: "Departments", value: "5", change: "0%", icon: Building, color: "purple" },
        ].map((stat, index) => {
          const Icon = stat.icon
          const colorClasses = {
            red: "bg-red-50 text-red-700 border-red-200",
            green: "bg-green-50 text-green-700 border-green-200",
            blue: "bg-blue-50 text-blue-700 border-blue-200",
            purple: "bg-purple-50 text-purple-700 border-purple-200",
          }

          return (
            <motion.div
              key={index}
              whileHover={{ y: -2, scale: 1.01 }}
              className={`p-6 rounded-xl border-2 ${colorClasses[stat.color]} bg-white shadow-sm`}
            >
              <div className="flex items-center justify-between mb-4">
                <div
                  className={`p-3 rounded-lg ${colorClasses[stat.color].replace("border-", "bg-").replace("-200", "-100")}`}
                >
                  <Icon size={24} />
                </div>
                <span
                  className={`text-sm font-semibold px-2 py-1 rounded-full ${
                    stat.change.startsWith("+") ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {stat.change}
                </span>
              </div>
              <p className="text-3xl font-bold mb-1 text-gray-900">{stat.value}</p>
              <p className="text-sm text-gray-600">{stat.title}</p>
            </motion.div>
          )
        })}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-gray-900">
            <div className="p-2 bg-green-100 rounded-lg">
              <TrendingUp className="text-green-600" size={20} />
            </div>
            Revenue Trend
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip
                formatter={(value) => [`$${value.toLocaleString()}`, "Revenue"]}
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                }}
              />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#DC2626"
                strokeWidth={3}
                dot={{ fill: "#DC2626", strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Department Budget Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-gray-900">
            <div className="p-2 bg-purple-100 rounded-lg">
              <PieChart className="text-purple-600" size={20} />
            </div>
            Department Budgets
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <RechartsPieChart>
              <RechartsPieChart data={departmentBudgetData} cx="50%" cy="50%" outerRadius={80} dataKey="budget">
                {departmentBudgetData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </RechartsPieChart>
              <Tooltip
                formatter={(value) => [`$${value.toLocaleString()}`, "Budget"]}
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                }}
              />
            </RechartsPieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap gap-3 mt-4">
            {departmentBudgetData.map((dept, index) => (
              <div key={index} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: dept.color }}></div>
                <span className="text-sm text-gray-600">{dept.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Employee Growth Chart */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-gray-900">
          <div className="p-2 bg-blue-100 rounded-lg">
            <BarChart3 className="text-blue-600" size={20} />
          </div>
          Employee & Project Growth
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={monthlyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="month" stroke="#6b7280" />
            <YAxis stroke="#6b7280" />
            <Tooltip
              contentStyle={{
                backgroundColor: "white",
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
              }}
            />
            <Bar dataKey="employees" fill="#DC2626" name="Employees" radius={[4, 4, 0, 0]} />
            <Bar dataKey="projects" fill="#7C3AED" name="Projects" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

// Department Detail View
const DepartmentDetail = ({ department, onBack, onDeleteMember }) => {
  const [selectedMember, setSelectedMember] = useState(null)
  const [viewType, setViewType] = useState("grid")

  if (selectedMember) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => setSelectedMember(null)}
            className="flex items-center gap-2 text-red-600 hover:text-red-800 font-medium"
          >
            <ArrowLeft size={20} />
            Back to {department.name}
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <div className="flex items-center gap-6 mb-8">
            <div className="w-24 h-24 bg-gradient-to-br from-red-600 to-red-700 rounded-full flex items-center justify-center text-white text-2xl font-bold">
              {selectedMember.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{selectedMember.name}</h1>
              <p className="text-xl text-gray-600">{selectedMember.position}</p>
              <div className="flex items-center gap-4 mt-3">
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                  Performance: {selectedMember.performance}%
                </span>
                <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium">
                  {selectedMember.experience} Experience
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Contact Information */}
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-gray-900 border-b border-gray-200 pb-2">Contact Information</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Mail className="text-gray-500" size={20} />
                  <span className="text-gray-700">{selectedMember.email}</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Phone className="text-gray-500" size={20} />
                  <span className="text-gray-700">{selectedMember.phone}</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <MapPin className="text-gray-500" size={20} />
                  <span className="text-gray-700">{selectedMember.address}</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <UserCheck className="text-gray-500" size={20} />
                  <span className="text-gray-700">Reports to: {selectedMember.manager}</span>
                </div>
              </div>
            </div>

            {/* Professional Details */}
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-gray-900 border-b border-gray-200 pb-2">Professional Details</h3>
              <div className="space-y-4">
                <div className="p-4 bg-green-50 rounded-lg">
                  <p className="font-semibold text-gray-700 mb-1">Monthly Salary</p>
                  <p className="text-2xl font-bold text-green-600">${selectedMember.salary.toLocaleString()}</p>
                </div>
                <div className="p-4 bg-red-50 rounded-lg">
                  <p className="font-semibold text-gray-700 mb-1">Join Date</p>
                  <p className="text-lg font-semibold text-red-600">{selectedMember.joinDate}</p>
                </div>
                <div>
                  <p className="font-semibold text-gray-700 mb-3">Skills & Expertise</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedMember.skills.map((skill, index) => (
                      <span key={index} className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Performance Chart */}
          <div className="mt-8 p-6 bg-gray-50 rounded-lg">
            <h3 className="text-lg font-bold mb-4 text-gray-900">Performance Overview</h3>
            <div className="w-full bg-gray-200 rounded-full h-4">
              <div
                className="bg-gradient-to-r from-red-500 to-red-600 h-4 rounded-full transition-all duration-300"
                style={{ width: `${selectedMember.performance}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-600 mt-2">{selectedMember.performance}% Overall Performance Rating</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="flex items-center gap-2 text-red-600 hover:text-red-800 font-medium">
            <ArrowLeft size={20} />
            Back to Departments
          </button>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setViewType("grid")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              viewType === "grid" ? "bg-red-600 text-white" : "bg-gray-200 text-gray-600 hover:bg-gray-300"
            }`}
          >
            Grid View
          </button>
          <button
            onClick={() => setViewType("list")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              viewType === "list" ? "bg-red-600 text-white" : "bg-gray-200 text-gray-600 hover:bg-gray-300"
            }`}
          >
            List View
          </button>
        </div>
      </div>

      {/* Department Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{department.name}</h1>
            <p className="text-gray-600 mt-1">
              Department Head: <span className="font-semibold text-red-600">{department.head}</span>
            </p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-green-600">${department.budget.toLocaleString()}</p>
            <p className="text-gray-600">Annual Budget</p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-red-50 p-4 rounded-lg text-center border border-red-200">
            <p className="text-2xl font-bold text-red-600">{department.managers}</p>
            <p className="text-red-800 font-medium">Managers</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg text-center border border-green-200">
            <p className="text-2xl font-bold text-green-600">{department.coManagers}</p>
            <p className="text-green-800 font-medium">Co-Managers</p>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg text-center border border-blue-200">
            <p className="text-2xl font-bold text-blue-600">{department.employees}</p>
            <p className="text-blue-800 font-medium">Employees</p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg text-center border border-purple-200">
            <p className="text-2xl font-bold text-purple-600">{department.interns}</p>
            <p className="text-purple-800 font-medium">Interns</p>
          </div>
        </div>
      </div>

      {/* Members List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Department Members</h2>

        {viewType === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {department.members.map((member) => (
              <motion.div
                key={member.id}
                whileHover={{ y: -2, scale: 1.01 }}
                className="border border-gray-200 rounded-lg p-6 cursor-pointer hover:shadow-md transition-all bg-white"
                onClick={() => setSelectedMember(member)}
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-red-600 to-red-700 rounded-full flex items-center justify-center text-white font-bold">
                    {member.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-gray-900">{member.name}</h3>
                    <p className="text-gray-600">{member.position}</p>
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  <p className="flex justify-between">
                    <span className="text-gray-600">Salary:</span>
                    <span className="font-semibold text-green-600">${member.salary.toLocaleString()}</span>
                  </p>
                  <p className="flex justify-between">
                    <span className="text-gray-600">Experience:</span>
                    <span className="font-semibold text-gray-900">{member.experience}</span>
                  </p>
                  <p className="flex justify-between">
                    <span className="text-gray-600">Performance:</span>
                    <span className="font-semibold text-red-600">{member.performance}%</span>
                  </p>
                </div>

                <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-200">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      setSelectedMember(member)
                    }}
                    className="text-red-600 hover:text-red-800 text-sm font-medium"
                  >
                    View Details
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      onDeleteMember(department.id, member.id)
                    }}
                    className="text-gray-400 hover:text-red-600 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {department.members.map((member) => (
              <div
                key={member.id}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                onClick={() => setSelectedMember(member)}
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-red-700 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {member.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{member.name}</h3>
                    <p className="text-gray-600 text-sm">{member.position}</p>
                  </div>
                </div>

                <div className="flex items-center gap-6 text-sm">
                  <span className="font-semibold text-green-600">${member.salary.toLocaleString()}</span>
                  <span className="text-gray-600">{member.experience}</span>
                  <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full font-medium">
                    {member.performance}%
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      onDeleteMember(department.id, member.id)
                    }}
                    className="text-gray-400 hover:text-red-600 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// Departments Component
const DepartmentsView = ({ departments, onDeleteMember }) => {
  const [selectedDepartment, setSelectedDepartment] = useState(null)

  if (selectedDepartment) {
    return (
      <DepartmentDetail
        department={selectedDepartment}
        onBack={() => setSelectedDepartment(null)}
        onDeleteMember={onDeleteMember}
      />
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Department Management</h1>
        <div className="bg-red-100 text-red-800 px-4 py-2 rounded-lg font-semibold">
          {departments.length} Active Departments
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {departments.map((dept) => (
          <motion.div
            key={dept.id}
            whileHover={{ y: -2, scale: 1.01 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 cursor-pointer hover:shadow-md transition-all"
            onClick={() => setSelectedDepartment(dept)}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900">{dept.name}</h3>
              <ChevronRight className="text-red-600" size={20} />
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-red-50 p-3 rounded-lg text-center border border-red-200">
                <p className="text-red-600 font-semibold text-sm">Managers</p>
                <p className="text-xl font-bold text-red-800">{dept.managers}</p>
              </div>
              <div className="bg-green-50 p-3 rounded-lg text-center border border-green-200">
                <p className="text-green-600 font-semibold text-sm">Employees</p>
                <p className="text-xl font-bold text-green-800">{dept.employees}</p>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-4">
              <p className="text-sm text-gray-600 mb-2">Department Head</p>
              <p className="font-semibold text-gray-900">{dept.head}</p>
              <p className="text-sm text-green-600 font-semibold mt-2">Budget: ${dept.budget.toLocaleString()}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

// Project Detail Component
const ProjectDetail = ({ project, onBack }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 border-green-200"
      case "completed":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getDaysRemaining = (deadline) => {
    const today = new Date()
    const deadlineDate = new Date(deadline)
    const diffTime = deadlineDate - today
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <button onClick={onBack} className="flex items-center gap-2 text-red-600 hover:text-red-800 font-medium">
          <ArrowLeft size={20} />
          Back to Projects
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{project.name}</h1>
            <p className="text-gray-600 text-lg">{project.description}</p>
          </div>
          <span className={`px-4 py-2 rounded-full text-sm font-semibold border ${getStatusColor(project.status)}`}>
            {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="text-green-600" size={20} />
              <span className="text-green-800 font-semibold">Project Value</span>
            </div>
            <p className="text-2xl font-bold text-green-600">${project.amount.toLocaleString()}</p>
          </div>

          <div className="bg-red-50 p-4 rounded-lg border border-red-200">
            <div className="flex items-center gap-2 mb-2">
              <Building className="text-red-600" size={20} />
              <span className="text-red-800 font-semibold">Client</span>
            </div>
            <p className="text-lg font-semibold text-red-600">{project.client}</p>
          </div>

          <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="text-purple-600" size={20} />
              <span className="text-purple-800 font-semibold">Deadline</span>
            </div>
            <p className="text-lg font-semibold text-purple-600">{project.deadline}</p>
            {project.status === "active" && (
              <p className="text-sm text-purple-500 mt-1">{getDaysRemaining(project.deadline)} days remaining</p>
            )}
          </div>

          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <div className="flex items-center gap-2 mb-2">
              <Users className="text-blue-600" size={20} />
              <span className="text-blue-800 font-semibold">Team Size</span>
            </div>
            <p className="text-2xl font-bold text-blue-600">{project.team.length}</p>
          </div>
        </div>

        {/* Progress Bar */}
        {project.progress !== undefined && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold text-gray-900">Project Progress</h3>
              <span className="text-lg font-bold text-red-600">{project.progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4">
              <div
                className="bg-gradient-to-r from-red-500 to-red-600 h-4 rounded-full transition-all duration-300"
                style={{ width: `${project.progress}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* Team Members */}
        <div className="border-t border-gray-200 pt-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Team Members</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {project.team.map((member, index) => (
              <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-red-700 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  {member
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
                <span className="font-semibold text-gray-900">{member}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Project Timeline */}
        <div className="border-t border-gray-200 pt-6 mt-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Project Timeline</h3>
          <div className="flex items-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-gray-700">
                Started: <span className="font-semibold">{project.startDate}</span>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span className="text-gray-700">
                Deadline: <span className="font-semibold">{project.deadline}</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Projects Components
const ProjectsView = ({ projects, title, type }) => {
  const [viewMode, setViewMode] = useState("grid")
  const [selectedProject, setSelectedProject] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.client.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || project.status === statusFilter
    return matchesSearch && matchesStatus
  })

  if (selectedProject) {
    return <ProjectDetail project={selectedProject} onBack={() => setSelectedProject(null)} />
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 border-green-200"
      case "completed":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-3xl font-bold text-gray-900">{title}</h1>

        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
          </select>

          {/* View Mode Toggle */}
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode("grid")}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                viewMode === "grid" ? "bg-red-600 text-white" : "bg-gray-200 text-gray-600 hover:bg-gray-300"
              }`}
            >
              Grid
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                viewMode === "list" ? "bg-red-600 text-white" : "bg-gray-200 text-gray-600 hover:bg-gray-300"
              }`}
            >
              List
            </button>
          </div>
        </div>
      </div>

      {/* Projects Display */}
      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <motion.div
              key={project.id}
              whileHover={{ y: -2, scale: 1.01 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 cursor-pointer hover:shadow-md transition-all"
              onClick={() => setSelectedProject(project)}
            >
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-900 line-clamp-2">{project.name}</h3>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(project.status)}`}
                >
                  {project.status}
                </span>
              </div>

              <p className="text-gray-600 text-sm mb-4 line-clamp-2">{project.description}</p>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Client:</span>
                  <span className="font-semibold text-gray-900">{project.client}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Value:</span>
                  <span className="font-bold text-green-600">${project.amount.toLocaleString()}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Deadline:</span>
                  <span className="font-semibold text-gray-900">{project.deadline}</span>
                </div>

                {project.progress !== undefined && (
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-gray-500">Progress:</span>
                      <span className="text-sm font-semibold text-red-600">{project.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-red-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${project.progress}%` }}
                      ></div>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-2 pt-2">
                  <Users size={16} className="text-gray-400" />
                  <span className="text-sm text-gray-600">{project.team.length} team members</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Project
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Client
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Value
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Progress
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Deadline
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Team
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredProjects.map((project) => (
                  <tr
                    key={project.id}
                    className="hover:bg-gray-50 cursor-pointer transition-colors"
                    onClick={() => setSelectedProject(project)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{project.name}</div>
                        <div className="text-sm text-gray-500 truncate max-w-xs">{project.description}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{project.client}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-600">
                      ${project.amount.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded-full border ${getStatusColor(project.status)}`}
                      >
                        {project.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {project.progress !== undefined ? (
                        <div className="flex items-center">
                          <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                            <div
                              className="bg-red-600 h-2 rounded-full"
                              style={{ width: `${project.progress}%` }}
                            ></div>
                          </div>
                          <span className="text-sm text-gray-600">{project.progress}%</span>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-400">N/A</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{project.deadline}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{project.team.length}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {filteredProjects.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <Briefcase size={48} className="mx-auto" />
          </div>
          <h3 className="text-lg font-semibold text-gray-600 mb-2">No projects found</h3>
          <p className="text-gray-500">Try adjusting your search or filter criteria.</p>
        </div>
      )}
    </div>
  )
}

// Hierarchy Component
const HierarchyView = ({ departments }) => {
  const [selectedDepartment, setSelectedDepartment] = useState(departments[0]?.id || null)

  const selectedDept = departments.find((d) => d.id === selectedDepartment)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Organization Structure</h1>
        <select
          value={selectedDepartment}
          onChange={(e) => setSelectedDepartment(Number(e.target.value))}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
        >
          {departments.map((dept) => (
            <option key={dept.id} value={dept.id}>
              {dept.name}
            </option>
          ))}
        </select>
      </div>

      {selectedDept && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{selectedDept.name}</h2>
            <p className="text-gray-600">Organizational Hierarchy</p>
          </div>

          {/* Department Head */}
          <div className="flex justify-center mb-8">
            <div className="bg-gradient-to-br from-red-600 to-red-700 text-white p-6 rounded-xl text-center min-w-[200px] shadow-lg">
              <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-3">
                <Award size={24} />
              </div>
              <h3 className="font-bold text-lg">{selectedDept.head}</h3>
              <p className="text-red-100">Department Head</p>
            </div>
          </div>

          {/* Hierarchy Levels */}
          <div className="space-y-8">
            {/* Managers Level */}
            <div className="text-center">
              <h4 className="text-lg font-semibold text-gray-700 mb-4">Managers ({selectedDept.managers})</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
                {Array.from({ length: selectedDept.managers }, (_, i) => (
                  <div key={i} className="bg-red-50 border-2 border-red-200 p-4 rounded-lg">
                    <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-2">
                      <UserCheck size={20} className="text-white" />
                    </div>
                    <p className="font-semibold text-red-800">Manager {i + 1}</p>
                    <p className="text-red-600 text-sm">Senior Level</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Co-Managers Level */}
            <div className="text-center">
              <h4 className="text-lg font-semibold text-gray-700 mb-4">Co-Managers ({selectedDept.coManagers})</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
                {Array.from({ length: selectedDept.coManagers }, (_, i) => (
                  <div key={i} className="bg-green-50 border-2 border-green-200 p-4 rounded-lg">
                    <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-2">
                      <Target size={20} className="text-white" />
                    </div>
                    <p className="font-semibold text-green-800">Co-Manager {i + 1}</p>
                    <p className="text-green-600 text-sm">Mid Level</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Employees Level */}
            <div className="text-center">
              <h4 className="text-lg font-semibold text-gray-700 mb-4">Employees ({selectedDept.employees})</h4>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3 max-w-4xl mx-auto">
                {selectedDept.members.map((member) => (
                  <div key={member.id} className="bg-blue-50 border-2 border-blue-200 p-3 rounded-lg">
                    <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-2 text-white text-sm font-bold">
                      {member.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </div>
                    <p className="font-semibold text-blue-800 text-sm">{member.name}</p>
                    <p className="text-blue-600 text-xs">{member.position}</p>
                  </div>
                ))}
                {/* Fill remaining employee slots */}
                {Array.from({ length: Math.max(0, selectedDept.employees - selectedDept.members.length) }, (_, i) => (
                  <div key={`empty-${i}`} className="bg-gray-50 border-2 border-gray-200 p-3 rounded-lg">
                    <div className="w-10 h-10 bg-gray-400 rounded-full flex items-center justify-center mx-auto mb-2">
                      <Users size={16} className="text-white" />
                    </div>
                    <p className="font-semibold text-gray-600 text-sm">Employee</p>
                    <p className="text-gray-500 text-xs">Position</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Interns Level */}
            <div className="text-center">
              <h4 className="text-lg font-semibold text-gray-700 mb-4">Interns ({selectedDept.interns})</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-3xl mx-auto">
                {Array.from({ length: selectedDept.interns }, (_, i) => (
                  <div key={i} className="bg-purple-50 border-2 border-purple-200 p-3 rounded-lg">
                    <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-2">
                      <Users size={16} className="text-white" />
                    </div>
                    <p className="font-semibold text-purple-800 text-sm">Intern {i + 1}</p>
                    <p className="text-purple-600 text-xs">Entry Level</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Department Stats */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                <p className="text-2xl font-bold text-red-600">
                  {selectedDept.managers + selectedDept.coManagers + selectedDept.employees + selectedDept.interns}
                </p>
                <p className="text-gray-600 text-sm font-medium">Total Members</p>
              </div>
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <p className="text-2xl font-bold text-green-600">${selectedDept.budget.toLocaleString()}</p>
                <p className="text-gray-600 text-sm font-medium">Annual Budget</p>
                <p className="text-2xl font-bold text-green-600">${selectedDept.budget.toLocaleString()}</p>
                <p className="text-gray-600 text-sm font-medium">Annual Budget</p>
              </div>
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-2xl font-bold text-blue-600">{selectedDept.managers + selectedDept.coManagers}</p>
                <p className="text-gray-600 text-sm font-medium">Leadership</p>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                <p className="text-2xl font-bold text-purple-600">
                  {Math.round((selectedDept.employees / (selectedDept.managers + selectedDept.coManagers)) * 10) / 10}
                </p>
                <p className="text-gray-600 text-sm font-medium">Avg Team Size</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Main Dashboard Component
export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview")

  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return <Overview />
      case "departments":
        return <DepartmentManagement />
      case "projects":
        return <ProjectManagement />
      case "members":
        return <MemberManagement />
      case "hierarchy":
        return <OrganizationHierarchy />
      case "tasks":
        return <TaskManagement />
      case "analytics":
        return <AnalyticsCharts />
      case "emails":
        return <EmailSystem />
      default:
        return <Overview />
    }
  }

  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [departments, setDepartments] = useState(sampleDepartments)

  const handleDeleteMember = (departmentId, memberId) => {
    setDepartments((prevDepartments) =>
      prevDepartments.map((dept) =>
        dept.id === departmentId ? { ...dept, members: dept.members.filter((member) => member.id !== memberId) } : dept,
      ),
    )
  }

  return (
    <DashboardLayout activeTab={activeTab} setActiveTab={setActiveTab}>
      {renderContent()}
    </DashboardLayout>
  )
}

function renderContent(activeTab: string) {
  switch (activeTab) {
    case "overview":
      return <Overview />
    case "departments":
      return <DepartmentManagement />
    case "projects":
      return <ProjectManagement />
    case "members":
      return <MemberManagement />
    case "hierarchy":
      return <OrganizationHierarchy />
    case "tasks":
      return <TaskManagement />
    case "analytics":
      return <AnalyticsCharts />
    case "emails":
      return <EmailSystem />
    default:
      return <Overview />
  }
}
