"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Users,
  TrendingUp,
  Trash2,
  Building,
  BarChart3,
  Activity,
  Menu,
  X,
  Home,
  ChevronRight,
  Mail,
  Phone,
  Award,
  ArrowLeft,
  Settings,
  Bell,
  LogOut,
  GraduationCap,
  BookOpen,
  Clock,
  Plus,
  Edit,
  DollarSign,
  CheckCircle,
  AlertCircle,
  UserMinus,
  Send,
  Target,
  Star,
  TrendingDown,
  MessageSquare,
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

// Enhanced Types
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
  type: "manager" | "employee" | "intern"
  attendanceScore: number
  managerReviewRating: number
  combinedPercentage: number
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
  description: string
}

type Faculty = {
  id: number
  name: string
  subjects: string[]
  batchAssignments: string[]
  averageClassesPerDay: number
  qualifications: string
  experience: string
  durationInOrganization: string
  rating: number
  students: number
  salary: number
  joinDate: string
  email: string
  phone: string
  performanceMetrics: {
    attendanceScore: number
    managerReviewRating: number
    combinedPercentage: number
  }
}

type Student = {
  id: number
  name: string
  batch: string
  enrollmentDate: string
  phone: string
  email: string
  feeStatus: "paid" | "pending" | "overdue"
  basicInfo: {
    age: number
    address: string
    parentContact: string
    previousEducation: string
  }
  performanceMetrics: {
    attendanceScore: number
    testScores: number[]
    assignmentCompletion: number
    overallGrade: string
  }
}

type Batch = {
  id: number
  name: string
  type: "morning" | "evening"
  startTime: string
  endTime: string
  facultyInvolved: string[]
  studentCount: number
  capacity: number
  syllabusPercentComplete: number
  subjects: string[]
  startDate: string
  duration: string
  fees: number
}

type Task = {
  id: number
  title: string
  description: string
  assignedTo: string
  assignedBy: string
  dueDate: string
  status: "pending" | "in-progress" | "completed"
  priority: "low" | "medium" | "high"
  type: "manager-todo" | "employee-task"
}

type EmailNotification = {
  id: number
  type: "member-crud" | "increment" | "decrement" | "penalty"
  recipient: string
  subject: string
  message: string
  timestamp: string
  status: "sent" | "pending" | "failed"
}

// Sample Data
const sampleDepartments: Department[] = [
  {
    id: 1,
    name: "HR",
    managers: 1,
    coManagers: 2,
    employees: 8,
    interns: 1,
    budget: 600000,
    head: "Priya Sharma",
    description: "Human Resources and Employee Management",
    members: [
      {
        id: 1,
        name: "Priya Sharma",
        position: "HR Head",
        salary: 50000,
        experience: "8 years",
        joinDate: "2021-04-10",
        email: "priya.sharma@oneaimupsc.com",
        phone: "+91-9876543210",
        address: "Delhi, India",
        manager: "Director",
        skills: ["HR Management", "Recruitment", "Employee Relations"],
        performance: 95,
        type: "manager",
        attendanceScore: 98,
        managerReviewRating: 4.8,
        combinedPercentage: 96,
      },
      {
        id: 2,
        name: "Rahul Sinha",
        position: "Finance Lead",
        salary: 45000,
        experience: "6 years",
        joinDate: "2022-01-15",
        email: "rahul.sinha@oneaimupsc.com",
        phone: "+91-9876543211",
        address: "Delhi, India",
        manager: "Priya Sharma",
        skills: ["Financial Management", "Budgeting", "Accounting"],
        performance: 88,
        type: "employee",
        attendanceScore: 92,
        managerReviewRating: 4.4,
        combinedPercentage: 90,
      },
    ],
  },
  {
    id: 2,
    name: "Sales",
    managers: 1,
    coManagers: 1,
    employees: 7,
    interns: 1,
    budget: 450000,
    head: "Ankit Jain",
    description: "Student Admissions and Sales Operations",
    members: [
      {
        id: 5,
        name: "Ankit Jain",
        position: "Head of Sales",
        salary: 48000,
        experience: "7 years",
        joinDate: "2021-07-25",
        email: "ankit.jain@oneaimupsc.com",
        phone: "+91-9876543214",
        address: "Delhi, India",
        manager: "Director",
        skills: ["Sales Management", "Team Leadership", "Customer Relations"],
        performance: 92,
        type: "manager",
        attendanceScore: 95,
        managerReviewRating: 4.6,
        combinedPercentage: 93,
      },
    ],
  },
  {
    id: 3,
    name: "Faculty",
    managers: 1,
    coManagers: 0,
    employees: 30,
    interns: 0,
    budget: 2400000,
    head: "Dr. Anil Kumar",
    description: "Academic Faculty and Teaching Staff",
    members: [],
  },
  {
    id: 4,
    name: "IT Support",
    managers: 1,
    coManagers: 1,
    employees: 6,
    interns: 2,
    budget: 350000,
    head: "Sunil Verma",
    description: "Technical Support and IT Infrastructure",
    members: [],
  },
  {
    id: 5,
    name: "Management",
    managers: 1,
    coManagers: 2,
    employees: 10,
    interns: 1,
    budget: 700000,
    head: "Shalini Bhatt",
    description: "Operations and Strategic Management",
    members: [],
  },
]

const sampleFaculties: Faculty[] = [
  {
    id: 1,
    name: "Dr. Anil Kumar",
    subjects: ["Public Administration", "Governance"],
    batchAssignments: ["Morning Batch A", "Evening Batch A"],
    averageClassesPerDay: 4,
    qualifications: "PhD in Public Administration, MA Political Science",
    experience: "12 years",
    durationInOrganization: "4 years",
    rating: 4.8,
    students: 120,
    salary: 80000,
    joinDate: "2020-03-10",
    email: "anil.kumar@oneaimupsc.com",
    phone: "+91-9876543216",
    performanceMetrics: {
      attendanceScore: 96,
      managerReviewRating: 4.8,
      combinedPercentage: 95,
    },
  },
  {
    id: 2,
    name: "Prof. Manish Grover",
    subjects: ["History", "Geography"],
    batchAssignments: ["Morning Batch B", "Evening Batch B"],
    averageClassesPerDay: 3,
    qualifications: "MA History, MA Geography",
    experience: "8 years",
    durationInOrganization: "3 years",
    rating: 4.6,
    students: 95,
    salary: 60000,
    joinDate: "2021-09-11",
    email: "manish.grover@oneaimupsc.com",
    phone: "+91-9876543217",
    performanceMetrics: {
      attendanceScore: 94,
      managerReviewRating: 4.6,
      combinedPercentage: 92,
    },
  },
]

const sampleStudents: Student[] = [
  {
    id: 1,
    name: "Arjun Patel",
    batch: "Morning Batch A",
    enrollmentDate: "2024-01-15",
    phone: "+91-9876543300",
    email: "arjun.patel@email.com",
    feeStatus: "paid",
    basicInfo: {
      age: 24,
      address: "Mumbai, Maharashtra",
      parentContact: "+91-9876543301",
      previousEducation: "B.Tech Computer Science",
    },
    performanceMetrics: {
      attendanceScore: 92,
      testScores: [85, 78, 90, 88],
      assignmentCompletion: 95,
      overallGrade: "A",
    },
  },
  {
    id: 2,
    name: "Priya Singh",
    batch: "Evening Batch A",
    enrollmentDate: "2024-02-01",
    phone: "+91-9876543302",
    email: "priya.singh@email.com",
    feeStatus: "pending",
    basicInfo: {
      age: 26,
      address: "Delhi, India",
      parentContact: "+91-9876543303",
      previousEducation: "MA Economics",
    },
    performanceMetrics: {
      attendanceScore: 88,
      testScores: [82, 85, 79, 91],
      assignmentCompletion: 90,
      overallGrade: "B+",
    },
  },
]

const sampleBatches: Batch[] = [
  {
    id: 1,
    name: "Morning Batch A",
    type: "morning",
    startTime: "6:00 AM",
    endTime: "12:00 PM",
    facultyInvolved: ["Dr. Anil Kumar", "Dr. Priya Mehta", "Ms. Neha Gupta"],
    studentCount: 45,
    capacity: 50,
    syllabusPercentComplete: 65,
    subjects: ["Public Administration", "Economics", "English"],
    startDate: "2024-01-15",
    duration: "12 months",
    fees: 85000,
  },
  {
    id: 2,
    name: "Evening Batch A",
    type: "evening",
    startTime: "2:00 PM",
    endTime: "8:00 PM",
    facultyInvolved: ["Dr. Anil Kumar", "Prof. Manish Grover"],
    studentCount: 48,
    capacity: 50,
    syllabusPercentComplete: 58,
    subjects: ["Public Administration", "History", "Geography"],
    startDate: "2024-01-20",
    duration: "12 months",
    fees: 85000,
  },
]

const sampleTasks: Task[] = [
  {
    id: 1,
    title: "Review Q1 Performance Reports",
    description: "Analyze and review all department performance reports for Q1",
    assignedTo: "Priya Sharma",
    assignedBy: "Director",
    dueDate: "2024-04-15",
    status: "pending",
    priority: "high",
    type: "manager-todo",
  },
  {
    id: 2,
    title: "Update Student Database",
    description: "Update all student records with latest contact information",
    assignedTo: "Rahul Sinha",
    assignedBy: "Priya Sharma",
    dueDate: "2024-04-10",
    status: "in-progress",
    priority: "medium",
    type: "employee-task",
  },
]

const monthlyData = [
  { month: "Jan", revenue: 1200000, students: 450, admissions: 45, growth: 8.5 },
  { month: "Feb", revenue: 1350000, students: 465, admissions: 52, growth: 12.5 },
  { month: "Mar", revenue: 1280000, students: 470, admissions: 48, growth: -5.2 },
  { month: "Apr", revenue: 1450000, students: 485, admissions: 58, growth: 13.3 },
  { month: "May", revenue: 1380000, students: 490, admissions: 55, growth: -4.8 },
  { month: "Jun", revenue: 1520000, students: 495, admissions: 62, growth: 10.1 },
]

const departmentColors = ["#DC2626", "#059669", "#7C3AED", "#EA580C", "#0891B2"]

// Sidebar Navigation
const Sidebar = ({ activeTab, setActiveTab, isSidebarOpen, setIsSidebarOpen }) => {
  const menuItems = [
    { id: "overview", label: "Dashboard", icon: Home },
    { id: "sub-departments", label: "Sub Departments", icon: Building },
    { id: "ongoing-batches", label: "Ongoing Batches", icon: BookOpen },
    { id: "organization-members", label: "Organization Members", icon: Users },
    { id: "organization-hierarchy", label: "Organization Hierarchy", icon: Activity },
    { id: "crud-operations", label: "CRUD Operations", icon: Settings },
    { id: "dashboard-charts", label: "Dashboard Charts", icon: BarChart3 },
    { id: "task-management", label: "Task Management", icon: Target },
    { id: "email-system", label: "Email System", icon: Mail },
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
                  <GraduationCap className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">One Aim UPSC</h1>
                  <p className="text-sm text-gray-500">Admin Dashboard</p>
                </div>
              </div>
              <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden text-gray-400 hover:text-gray-600">
                <X size={24} />
              </button>
            </div>
          </div>

          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
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
    const titles = {
      overview: "Dashboard Overview",
      "sub-departments": "Sub Departments",
      "ongoing-batches": "Ongoing Batches",
      "organization-members": "Organization Members",
      "organization-hierarchy": "Organization Hierarchy",
      "crud-operations": "CRUD Operations",
      "dashboard-charts": "Dashboard Charts",
      "task-management": "Task Management",
      "email-system": "Email System",
    }
    return titles[tab] || "Dashboard"
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
            <p className="text-sm text-gray-500">Manage your UPSC coaching organization efficiently</p>
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

// Overview Component
const Overview = () => {
  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { title: "Total Students", value: "495", change: "+7%", icon: GraduationCap, color: "red" },
          { title: "Active Batches", value: "4", change: "+1", icon: BookOpen, color: "green" },
          { title: "Faculty Members", value: "15", change: "0%", icon: Users, color: "blue" },
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
                formatter={(value) => [`₹${value.toLocaleString()}`, "Revenue"]}
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

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-gray-900">
            <div className="p-2 bg-blue-100 rounded-lg">
              <BarChart3 className="text-blue-600" size={20} />
            </div>
            Student Growth
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
              <Bar dataKey="students" fill="#DC2626" name="Total Students" radius={[4, 4, 0, 0]} />
              <Bar dataKey="admissions" fill="#7C3AED" name="New Admissions" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}

// Sub Departments Component
const SubDepartments = ({ departments }) => {
  const [selectedDepartment, setSelectedDepartment] = useState(null)

  if (selectedDepartment) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => setSelectedDepartment(null)}
            className="flex items-center gap-2 text-red-600 hover:text-red-800 font-medium"
          >
            <ArrowLeft size={20} />
            Back to Departments
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{selectedDepartment.name}</h1>
              <p className="text-gray-600 mb-2">{selectedDepartment.description}</p>
              <p className="text-gray-600">
                Department Head: <span className="font-semibold text-red-600">{selectedDepartment.head}</span>
              </p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-green-600">₹{selectedDepartment.budget.toLocaleString()}</p>
              <p className="text-gray-600">Annual Budget</p>
            </div>
          </div>

          {/* Department Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-red-50 p-4 rounded-lg border border-red-200 text-center">
              <p className="text-red-600 font-semibold text-sm">Managers</p>
              <p className="text-2xl font-bold text-red-800">{selectedDepartment.managers}</p>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 text-center">
              <p className="text-blue-600 font-semibold text-sm">Co-Managers</p>
              <p className="text-2xl font-bold text-blue-800">{selectedDepartment.coManagers}</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg border border-green-200 text-center">
              <p className="text-green-600 font-semibold text-sm">Employees</p>
              <p className="text-2xl font-bold text-green-800">{selectedDepartment.employees}</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg border border-purple-200 text-center">
              <p className="text-purple-600 font-semibold text-sm">Interns</p>
              <p className="text-2xl font-bold text-purple-800">{selectedDepartment.interns}</p>
            </div>
          </div>

          {/* Members List */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {selectedDepartment.members.map((member) => (
              <motion.div
                key={member.id}
                whileHover={{ y: -2, scale: 1.01 }}
                className="border border-gray-200 rounded-lg p-6 bg-white hover:shadow-md transition-all"
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
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        member.type === "manager"
                          ? "bg-red-100 text-red-800"
                          : member.type === "employee"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-green-100 text-green-800"
                      }`}
                    >
                      {member.type.charAt(0).toUpperCase() + member.type.slice(1)}
                    </span>
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  <p className="flex justify-between">
                    <span className="text-gray-600">Salary:</span>
                    <span className="font-semibold text-green-600">₹{member.salary.toLocaleString()}</span>
                  </p>
                  <p className="flex justify-between">
                    <span className="text-gray-600">Experience:</span>
                    <span className="font-semibold text-gray-900">{member.experience}</span>
                  </p>
                  <p className="flex justify-between">
                    <span className="text-gray-600">Attendance:</span>
                    <span className="font-semibold text-blue-600">{member.attendanceScore}%</span>
                  </p>
                  <p className="flex justify-between">
                    <span className="text-gray-600">Rating:</span>
                    <span className="font-semibold text-yellow-600">{member.managerReviewRating}/5.0</span>
                  </p>
                  <p className="flex justify-between">
                    <span className="text-gray-600">Combined:</span>
                    <span className="font-semibold text-red-600">{member.combinedPercentage}%</span>
                  </p>
                </div>

                <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-200">
                  <span className="text-sm text-gray-500">Joined: {member.joinDate}</span>
                  <div className="flex gap-2">
                    <button className="text-gray-400 hover:text-blue-600 transition-colors">
                      <Edit size={16} />
                    </button>
                    <button className="text-gray-400 hover:text-red-600 transition-colors">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Sub Departments</h1>
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

            <p className="text-gray-600 text-sm mb-4">{dept.description}</p>

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
              <p className="text-sm text-green-600 font-semibold mt-2">Budget: ₹{dept.budget.toLocaleString()}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

// Ongoing Batches Component
const OngoingBatches = ({ batches }) => {
  const [selectedBatch, setSelectedBatch] = useState(null)

  if (selectedBatch) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => setSelectedBatch(null)}
            className="flex items-center gap-2 text-red-600 hover:text-red-800 font-medium"
          >
            <ArrowLeft size={20} />
            Back to Batches
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{selectedBatch.name}</h1>
              <div className="flex items-center gap-4">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    selectedBatch.type === "morning" ? "bg-yellow-100 text-yellow-800" : "bg-blue-100 text-blue-800"
                  }`}
                >
                  {selectedBatch.type === "morning" ? "Morning Batch" : "Evening Batch"}
                </span>
                <span className="text-gray-600">
                  {selectedBatch.startTime} - {selectedBatch.endTime}
                </span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-green-600">₹{selectedBatch.fees.toLocaleString()}</p>
              <p className="text-gray-600">Course Fees</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <div className="flex items-center gap-2 mb-2">
                <Users className="text-blue-600" size={20} />
                <span className="text-blue-800 font-semibold">Students</span>
              </div>
              <p className="text-2xl font-bold text-blue-600">
                {selectedBatch.studentCount}/{selectedBatch.capacity}
              </p>
            </div>

            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <div className="flex items-center gap-2 mb-2">
                <GraduationCap className="text-green-600" size={20} />
                <span className="text-green-800 font-semibold">Faculty Count</span>
              </div>
              <p className="text-2xl font-bold text-green-600">{selectedBatch.facultyInvolved.length}</p>
            </div>

            <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
              <div className="flex items-center gap-2 mb-2">
                <BookOpen className="text-purple-600" size={20} />
                <span className="text-purple-800 font-semibold">Syllabus</span>
              </div>
              <p className="text-2xl font-bold text-purple-600">{selectedBatch.syllabusPercentComplete}%</p>
            </div>

            <div className="bg-red-50 p-4 rounded-lg border border-red-200">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="text-red-600" size={20} />
                <span className="text-red-800 font-semibold">Duration</span>
              </div>
              <p className="text-lg font-semibold text-red-600">{selectedBatch.duration}</p>
            </div>
          </div>

          {/* Faculty Involved */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Faculty Involved</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {selectedBatch.facultyInvolved.map((faculty, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-red-700 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {faculty
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>
                  <span className="font-semibold text-gray-900">{faculty}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Syllabus Progress */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Syllabus Progress</h3>
            <div className="w-full bg-gray-200 rounded-full h-6">
              <div
                className="bg-gradient-to-r from-green-500 to-green-600 h-6 rounded-full transition-all duration-300 flex items-center justify-center"
                style={{ width: `${selectedBatch.syllabusPercentComplete}%` }}
              >
                <span className="text-white text-sm font-semibold">{selectedBatch.syllabusPercentComplete}%</span>
              </div>
            </div>
            <p className="text-sm text-gray-600 mt-2">{selectedBatch.syllabusPercentComplete}% of syllabus completed</p>
          </div>

          {/* Subjects */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Subjects Covered</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {selectedBatch.subjects.map((subject, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <BookOpen size={20} className="text-red-600" />
                  <span className="font-semibold text-gray-900">{subject}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Ongoing Batches</h1>
        <button className="bg-red-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-700 transition-colors flex items-center gap-2">
          <Plus size={20} />
          Add New Batch
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {batches.map((batch) => (
          <motion.div
            key={batch.id}
            whileHover={{ y: -2, scale: 1.01 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 cursor-pointer hover:shadow-md transition-all"
            onClick={() => setSelectedBatch(batch)}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900">{batch.name}</h3>
              <ChevronRight className="text-red-600" size={20} />
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-gray-600 text-sm">Time:</p>
                <p className="font-semibold text-gray-900">
                  {batch.startTime} - {batch.endTime}
                </p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Students:</p>
                <p className="font-semibold text-blue-600">
                  {batch.studentCount}/{batch.capacity}
                </p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Faculty:</p>
                <p className="font-semibold text-green-600">{batch.facultyInvolved.length} Members</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Syllabus:</p>
                <p className="font-semibold text-purple-600">{batch.syllabusPercentComplete}%</p>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-4">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-purple-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${batch.syllabusPercentComplete}%` }}
                ></div>
              </div>
            </div>

            <div className="flex justify-between items-center text-sm text-gray-600">
              <span>Started: {batch.startDate}</span>
              <span className="font-semibold text-green-600">₹{batch.fees.toLocaleString()}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

// Organization Members Component
const OrganizationMembers = ({ faculties, students }) => {
  const [activeTab, setActiveTab] = useState("faculties")
  const [selectedMember, setSelectedMember] = useState(null)

  if (selectedMember) {
    if (selectedMember.type === "faculty") {
      return (
        <div className="space-y-6">
          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={() => setSelectedMember(null)}
              className="flex items-center gap-2 text-red-600 hover:text-red-800 font-medium"
            >
              <ArrowLeft size={20} />
              Back to Members
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
                <p className="text-xl text-gray-600">{selectedMember.subjects.join(", ")}</p>
                <div className="flex items-center gap-4 mt-3">
                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                    Rating: {selectedMember.rating}/5.0
                  </span>
                  <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium">
                    {selectedMember.experience} Experience
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Professional Details */}
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-gray-900 border-b border-gray-200 pb-2">Professional Details</h3>
                <div className="space-y-4">
                  <div className="p-4 bg-green-50 rounded-lg">
                    <p className="font-semibold text-gray-700 mb-1">Monthly Salary</p>
                    <p className="text-2xl font-bold text-green-600">₹{selectedMember.salary.toLocaleString()}</p>
                  </div>
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <p className="font-semibold text-gray-700 mb-1">Students Teaching</p>
                    <p className="text-2xl font-bold text-blue-600">{selectedMember.students}</p>
                  </div>
                  <div className="p-4 bg-purple-50 rounded-lg">
                    <p className="font-semibold text-gray-700 mb-1">Classes/Day</p>
                    <p className="text-2xl font-bold text-purple-600">{selectedMember.averageClassesPerDay}</p>
                  </div>
                  <div className="p-4 bg-yellow-50 rounded-lg">
                    <p className="font-semibold text-gray-700 mb-1">Duration in Org</p>
                    <p className="text-lg font-semibold text-yellow-600">{selectedMember.durationInOrganization}</p>
                  </div>
                </div>
              </div>

              {/* Performance Metrics */}
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-gray-900 border-b border-gray-200 pb-2">Performance Metrics</h3>
                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="font-semibold text-gray-700 mb-2">Attendance Score</p>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full"
                        style={{ width: `${selectedMember.performanceMetrics.attendanceScore}%` }}
                      ></div>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{selectedMember.performanceMetrics.attendanceScore}%</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="font-semibold text-gray-700 mb-2">Manager Review Rating</p>
                    <div className="flex items-center gap-2">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={20}
                            className={
                              i < Math.floor(selectedMember.performanceMetrics.managerReviewRating)
                                ? "text-yellow-400 fill-current"
                                : "text-gray-300"
                            }
                          />
                        ))}
                      </div>
                      <span className="font-semibold">{selectedMember.performanceMetrics.managerReviewRating}/5.0</span>
                    </div>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="font-semibold text-gray-700 mb-2">Combined Percentage</p>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-gradient-to-r from-red-500 to-red-600 h-3 rounded-full"
                        style={{ width: `${selectedMember.performanceMetrics.combinedPercentage}%` }}
                      ></div>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      {selectedMember.performanceMetrics.combinedPercentage}%
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Batch Assignments */}
            <div className="mt-8 p-6 bg-gray-50 rounded-lg">
              <h3 className="text-lg font-bold mb-4 text-gray-900">Batch Assignments</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {selectedMember.batchAssignments.map((batch, index) => (
                  <div key={index} className="bg-white p-3 rounded-lg border border-gray-200">
                    <span className="font-semibold text-gray-900">{batch}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Qualifications */}
            <div className="mt-8 p-6 bg-gray-50 rounded-lg">
              <h3 className="text-lg font-bold mb-4 text-gray-900">Qualifications</h3>
              <p className="text-gray-700">{selectedMember.qualifications}</p>
            </div>
          </div>
        </div>
      )
    }

    // Student Details
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => setSelectedMember(null)}
            className="flex items-center gap-2 text-red-600 hover:text-red-800 font-medium"
          >
            <ArrowLeft size={20} />
            Back to Members
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <div className="flex items-center gap-6 mb-8">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full flex items-center justify-center text-white text-2xl font-bold">
              {selectedMember.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{selectedMember.name}</h1>
              <p className="text-xl text-gray-600">{selectedMember.batch}</p>
              <div className="flex items-center gap-4 mt-3">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    selectedMember.feeStatus === "paid"
                      ? "bg-green-100 text-green-800"
                      : selectedMember.feeStatus === "pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                  }`}
                >
                  Fee Status: {selectedMember.feeStatus.charAt(0).toUpperCase() + selectedMember.feeStatus.slice(1)}
                </span>
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                  Grade: {selectedMember.performanceMetrics.overallGrade}
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Basic Information */}
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-gray-900 border-b border-gray-200 pb-2">Basic Information</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Mail className="text-gray-500" size={20} />
                  <span className="text-gray-700">{selectedMember.email}</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Phone className="text-gray-500" size={20} />
                  <span className="text-gray-700">{selectedMember.phone}</span>
                </div>
                <div className="p-4 bg-blue-50 rounded-lg">
                  <p className="font-semibold text-gray-700 mb-1">Age</p>
                  <p className="text-lg font-bold text-blue-600">{selectedMember.basicInfo.age} years</p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <p className="font-semibold text-gray-700 mb-1">Address</p>
                  <p className="text-gray-700">{selectedMember.basicInfo.address}</p>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg">
                  <p className="font-semibold text-gray-700 mb-1">Previous Education</p>
                  <p className="text-gray-700">{selectedMember.basicInfo.previousEducation}</p>
                </div>
              </div>
            </div>

            {/* Performance Metrics */}
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-gray-900 border-b border-gray-200 pb-2">Performance Metrics</h3>
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="font-semibold text-gray-700 mb-2">Attendance Score</p>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full"
                      style={{ width: `${selectedMember.performanceMetrics.attendanceScore}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{selectedMember.performanceMetrics.attendanceScore}%</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="font-semibold text-gray-700 mb-2">Assignment Completion</p>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full"
                      style={{ width: `${selectedMember.performanceMetrics.assignmentCompletion}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    {selectedMember.performanceMetrics.assignmentCompletion}%
                  </p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="font-semibold text-gray-700 mb-2">Test Scores</p>
                  <div className="flex gap-2">
                    {selectedMember.performanceMetrics.testScores.map((score, index) => (
                      <div key={index} className="bg-white px-3 py-2 rounded border">
                        <span className="font-semibold">{score}%</span>
                      </div>
                    ))}
                  </div>
                  <p className="text-sm text-gray-600 mt-2">
                    Average:{" "}
                    {Math.round(
                      selectedMember.performanceMetrics.testScores.reduce((a, b) => a + b, 0) /
                        selectedMember.performanceMetrics.testScores.length,
                    )}
                    %
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Organization Members</h1>
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab("faculties")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === "faculties" ? "bg-red-600 text-white" : "bg-gray-200 text-gray-600 hover:bg-gray-300"
            }`}
          >
            Faculties ({faculties.length})
          </button>
          <button
            onClick={() => setActiveTab("students")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === "students" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-600 hover:bg-gray-300"
            }`}
          >
            Students ({students.length})
          </button>
        </div>
      </div>

      {activeTab === "faculties" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {faculties.map((faculty) => (
            <motion.div
              key={faculty.id}
              whileHover={{ y: -2, scale: 1.01 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 cursor-pointer hover:shadow-md transition-all"
              onClick={() => setSelectedMember({ ...faculty, type: "faculty" })}
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-red-600 to-red-700 rounded-full flex items-center justify-center text-white font-bold text-lg">
                  {faculty.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
                <div>
                  <h3 className="font-bold text-xl text-gray-900">{faculty.name}</h3>
                  <p className="text-gray-600">{faculty.subjects.join(", ")}</p>
                </div>
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Experience:</span>
                  <span className="font-semibold text-gray-900">{faculty.experience}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Students:</span>
                  <span className="font-semibold text-blue-600">{faculty.students}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Classes/Day:</span>
                  <span className="font-semibold text-purple-600">{faculty.averageClassesPerDay}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Rating:</span>
                  <span className="font-semibold text-green-600">{faculty.rating}/5.0</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Salary:</span>
                  <span className="font-semibold text-green-600">₹{faculty.salary.toLocaleString()}</span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-600 mb-2">Batch Assignments:</p>
                <div className="flex flex-wrap gap-1">
                  {faculty.batchAssignments.slice(0, 2).map((batch, index) => (
                    <span key={index} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                      {batch}
                    </span>
                  ))}
                  {faculty.batchAssignments.length > 2 && (
                    <span className="text-xs text-gray-500">+{faculty.batchAssignments.length - 2} more</span>
                  )}
                </div>
              </div>

              <div className="mt-4">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${faculty.performanceMetrics.combinedPercentage}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-600 mt-1">
                  Overall Performance: {faculty.performanceMetrics.combinedPercentage}%
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {students.map((student) => (
            <motion.div
              key={student.id}
              whileHover={{ y: -2, scale: 1.01 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 cursor-pointer hover:shadow-md transition-all"
              onClick={() => setSelectedMember({ ...student, type: "student" })}
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full flex items-center justify-center text-white font-bold text-lg">
                  {student.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
                <div>
                  <h3 className="font-bold text-xl text-gray-900">{student.name}</h3>
                  <p className="text-gray-600">{student.batch}</p>
                </div>
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Age:</span>
                  <span className="font-semibold text-gray-900">{student.basicInfo.age} years</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Attendance:</span>
                  <span className="font-semibold text-blue-600">{student.performanceMetrics.attendanceScore}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Grade:</span>
                  <span className="font-semibold text-green-600">{student.performanceMetrics.overallGrade}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Fee Status:</span>
                  <span
                    className={`font-semibold ${
                      student.feeStatus === "paid"
                        ? "text-green-600"
                        : student.feeStatus === "pending"
                          ? "text-yellow-600"
                          : "text-red-600"
                    }`}
                  >
                    {student.feeStatus.charAt(0).toUpperCase() + student.feeStatus.slice(1)}
                  </span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-600 mb-2">Test Scores:</p>
                <div className="flex gap-1">
                  {student.performanceMetrics.testScores.slice(0, 4).map((score, index) => (
                    <div key={index} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                      {score}%
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-4">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${student.performanceMetrics.attendanceScore}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-600 mt-1">
                  Attendance Score: {student.performanceMetrics.attendanceScore}%
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}

// Organization Hierarchy Component
const OrganizationHierarchy = ({ departments }) => {
  const hierarchy = {
    director: { name: "Director - One Aim UPSC", position: "Director/CEO" },
    departments: [
      {
        name: "HR",
        head: { name: "Priya Sharma", position: "Head of HR" },
        subunits: [
          { name: "Finance", head: "Rahul Sinha" },
          { name: "Attendance", head: "Neha Gupta" },
          { name: "Performance", head: "Rohit Mehra" },
        ],
      },
      {
        name: "Sales",
        head: { name: "Ankit Jain", position: "Head of Sales" },
        subunits: [{ name: "Admissions", head: "Kavita Singh" }],
      },
      {
        name: "Faculty",
        head: { name: "Dr. Anil Kumar", position: "Faculty Head" },
        subunits: [],
      },
      {
        name: "IT Support",
        head: { name: "Sunil Verma", position: "IT Support Lead" },
        subunits: [
          { name: "Tele Callers", head: "Geeta Yadav" },
          { name: "Faculty IT Support", head: "Suresh Nair" },
        ],
      },
      {
        name: "Management",
        head: { name: "Shalini Bhatt", position: "Operations Manager" },
        subunits: [
          { name: "MIS", head: "Atul Mishra" },
          { name: "Reporting", head: "Pooja Arora" },
          { name: "AlignUp", head: "Sandeep Singh" },
          { name: "Team Lead", head: "Richa Thakur" },
          { name: "MIS Coordinator", head: "Vikram Joshi" },
        ],
      },
    ],
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Organization Hierarchy</h1>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-2">
          <div className="p-2 bg-red-100 rounded-lg">
            <Activity className="text-red-600" size={20} />
          </div>
          Complete Organization Structure
        </h2>

        <div className="flex flex-col items-center">
          {/* Director/CEO */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-gradient-to-r from-red-600 to-red-700 text-white p-6 rounded-xl mb-8 shadow-lg text-center min-w-[250px]"
          >
            <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-3">
              <Award size={24} />
            </div>
            <h3 className="font-bold text-lg">{hierarchy.director.name}</h3>
            <p className="text-red-100">{hierarchy.director.position}</p>
          </motion.div>

          {/* Departments */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl">
            {hierarchy.departments.map((dept, index) => (
              <motion.div
                key={dept.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex flex-col items-center w-full"
              >
                <div className="bg-red-50 border-2 border-red-300 p-4 rounded-lg mb-4 w-full text-center">
                  <p className="font-semibold text-red-800">{dept.head.name}</p>
                  <p className="text-sm text-red-600">{dept.head.position || dept.name}</p>
                </div>
                {dept.subunits.length > 0 && (
                  <div className="w-full">
                    <div className="grid gap-2">
                      {dept.subunits.map((sub) => (
                        <div key={sub.name} className="bg-green-50 border border-green-200 p-2 rounded text-center">
                          <p className="text-sm font-medium text-green-800">{sub.name}</p>
                          <p className="text-xs text-green-600">Lead: {sub.head}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Reporting Structure */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-gray-900">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Users className="text-blue-600" size={20} />
          </div>
          View Reporting Structure
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center">
          {departments.map((dept) => (
            <div key={dept.id} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-2xl font-bold text-red-600">
                {dept.managers + dept.coManagers + dept.employees + dept.interns}
              </p>
              <p className="text-gray-600 text-sm font-medium">{dept.name}</p>
              <p className="text-xs text-gray-500 mt-1">Total Members</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// CRUD Operations Component
const CRUDOperations = () => {
  const [selectedOperation, setSelectedOperation] = useState(null)
  const [emailNotifications, setEmailNotifications] = useState([])

  const operations = [
    {
      id: "delete-member",
      title: "Delete Member",
      description: "Remove a member from the organization",
      icon: UserMinus,
      color: "red",
      action: "HR Mail Notification",
    },
    {
      id: "increment",
      title: "Salary Increment",
      description: "Increase employee salary",
      icon: TrendingUp,
      color: "green",
      action: "HR Mail Notification",
    },
    {
      id: "decrement",
      title: "Salary Decrement",
      description: "Decrease employee salary",
      icon: TrendingDown,
      color: "orange",
      action: "HR Mail Notification",
    },
    {
      id: "salary-deduction",
      title: "Salary Deduction",
      description: "Apply salary deductions",
      icon: DollarSign,
      color: "yellow",
      action: "HR Mail Notification",
    },
    {
      id: "penalty-actions",
      title: "Penalty Actions",
      description: "Apply disciplinary actions",
      icon: AlertCircle,
      color: "purple",
      action: "HR Mail Notification",
    },
  ]

  const handleOperation = (operation) => {
    // Simulate sending HR notification
    const notification = {
      id: Date.now(),
      type: operation.id,
      recipient: "hr@oneaimupsc.com",
      subject: `${operation.title} - Action Required`,
      message: `A ${operation.title.toLowerCase()} operation has been initiated and requires HR attention.`,
      timestamp: new Date().toLocaleString(),
      status: "sent",
    }

    setEmailNotifications((prev) => [notification, ...prev])
    alert(`${operation.title} completed. HR notification sent.`)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">CRUD Operations</h1>
        <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded-lg font-semibold">
          {emailNotifications.length} Notifications Sent
        </div>
      </div>

      {/* Operations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {operations.map((operation) => {
          const Icon = operation.icon
          const colorClasses = {
            red: "bg-red-50 border-red-200 text-red-700",
            green: "bg-green-50 border-green-200 text-green-700",
            orange: "bg-orange-50 border-orange-200 text-orange-700",
            yellow: "bg-yellow-50 border-yellow-200 text-yellow-700",
            purple: "bg-purple-50 border-purple-200 text-purple-700",
          }

          return (
            <motion.div
              key={operation.id}
              whileHover={{ y: -2, scale: 1.01 }}
              className={`p-6 rounded-xl border-2 ${colorClasses[operation.color]} bg-white shadow-sm cursor-pointer`}
              onClick={() => handleOperation(operation)}
            >
              <div className="flex items-center gap-4 mb-4">
                <div
                  className={`p-3 rounded-lg ${colorClasses[operation.color].replace("text-", "bg-").replace("-700", "-100")}`}
                >
                  <Icon size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-gray-900">{operation.title}</h3>
                  <p className="text-sm text-gray-600">{operation.description}</p>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">{operation.action}</span>
                <ChevronRight size={20} className="text-gray-400" />
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Recent Notifications */}
      {emailNotifications.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-gray-900">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Mail className="text-blue-600" size={20} />
            </div>
            Recent HR Notifications
          </h3>
          <div className="space-y-4">
            {emailNotifications.slice(0, 5).map((notification) => (
              <div key={notification.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-semibold text-gray-900">{notification.subject}</p>
                  <p className="text-sm text-gray-600">{notification.message}</p>
                  <p className="text-xs text-gray-500 mt-1">{notification.timestamp}</p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    notification.status === "sent"
                      ? "bg-green-100 text-green-800"
                      : notification.status === "pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                  }`}
                >
                  {notification.status.charAt(0).toUpperCase() + notification.status.slice(1)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// Dashboard Charts Component
const DashboardCharts = () => {
  const pieData = [
    { name: "HR", value: 12, color: "#DC2626" },
    { name: "Sales", value: 10, color: "#059669" },
    { name: "Faculty", value: 31, color: "#7C3AED" },
    { name: "IT Support", value: 10, color: "#EA580C" },
    { name: "Management", value: 14, color: "#0891B2" },
  ]

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Dashboard Charts</h1>

      {/* Revenue and Growth Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-gray-900">
            <div className="p-2 bg-green-100 rounded-lg">
              <DollarSign className="text-green-600" size={20} />
            </div>
            Revenue Generated
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip
                formatter={(value) => [`₹${value.toLocaleString()}`, "Revenue"]}
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
                stroke="#059669"
                strokeWidth={3}
                dot={{ fill: "#059669", strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-gray-900">
            <div className="p-2 bg-blue-100 rounded-lg">
              <TrendingUp className="text-blue-600" size={20} />
            </div>
            Growth Metrics
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip
                formatter={(value) => [`${value}%`, "Growth"]}
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                }}
              />
              <Bar dataKey="growth" fill="#3B82F6" name="Growth %" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Member Count Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-gray-900">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Users className="text-purple-600" size={20} />
            </div>
            Member Count by Department
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <RechartsPieChart>
              <Tooltip
                formatter={(value) => [value, "Members"]}
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                }}
              />
              <RechartsPieChart.Pie
                data={pieData}
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                label={({ name, value }) => `${name}: ${value}`}
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </RechartsPieChart.Pie>
            </RechartsPieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-gray-900">
            <div className="p-2 bg-red-100 rounded-lg">
              <BarChart3 className="text-red-600" size={20} />
            </div>
            Department Statistics
          </h3>
          <div className="space-y-4">
            {pieData.map((dept, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded-full" style={{ backgroundColor: dept.color }}></div>
                  <span className="font-semibold text-gray-900">{dept.name}</span>
                </div>
                <div className="text-right">
                  <p className="font-bold text-lg" style={{ color: dept.color }}>
                    {dept.value}
                  </p>
                  <p className="text-xs text-gray-500">Members</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// Task Management Component
const TaskManagement = ({ tasks }) => {
  const [selectedTask, setSelectedTask] = useState(null)
  const [filterType, setFilterType] = useState("all")

  const filteredTasks = tasks.filter((task) => {
    if (filterType === "all") return true
    return task.type === filterType
  })

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800"
      case "in-progress":
        return "bg-blue-100 text-blue-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "low":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Task Management</h1>
        <div className="flex gap-2">
          <button
            onClick={() => setFilterType("all")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filterType === "all" ? "bg-red-600 text-white" : "bg-gray-200 text-gray-600 hover:bg-gray-300"
            }`}
          >
            All Tasks
          </button>
          <button
            onClick={() => setFilterType("manager-todo")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filterType === "manager-todo" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-600 hover:bg-gray-300"
            }`}
          >
            Manager TODOs
          </button>
          <button
            onClick={() => setFilterType("employee-task")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filterType === "employee-task" ? "bg-green-600 text-white" : "bg-gray-200 text-gray-600 hover:bg-gray-300"
            }`}
          >
            Employee Tasks
          </button>
        </div>
      </div>

      {/* Task Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <Target className="text-blue-600" size={24} />
            <span className="font-semibold text-gray-700">Total Tasks</span>
          </div>
          <p className="text-3xl font-bold text-blue-600">{tasks.length}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <CheckCircle className="text-green-600" size={24} />
            <span className="font-semibold text-gray-700">Completed</span>
          </div>
          <p className="text-3xl font-bold text-green-600">{tasks.filter((t) => t.status === "completed").length}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <Clock className="text-yellow-600" size={24} />
            <span className="font-semibold text-gray-700">In Progress</span>
          </div>
          <p className="text-3xl font-bold text-yellow-600">{tasks.filter((t) => t.status === "in-progress").length}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <AlertCircle className="text-red-600" size={24} />
            <span className="font-semibold text-gray-700">Pending</span>
          </div>
          <p className="text-3xl font-bold text-red-600">{tasks.filter((t) => t.status === "pending").length}</p>
        </div>
      </div>

      {/* Tasks List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-xl font-bold mb-4 text-gray-900">
          {filterType === "all" ? "All Tasks" : filterType === "manager-todo" ? "Manager TODOs" : "Employee Tasks"}
        </h3>
        <div className="space-y-4">
          {filteredTasks.map((task) => (
            <motion.div
              key={task.id}
              whileHover={{ y: -1, scale: 1.01 }}
              className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all cursor-pointer"
              onClick={() => setSelectedTask(task)}
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="font-bold text-lg text-gray-900">{task.title}</h4>
                  <p className="text-gray-600 text-sm">{task.description}</p>
                </div>
                <ChevronRight className="text-gray-400" size={20} />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(task.status)}`}>
                    {task.status.charAt(0).toUpperCase() + task.status.slice(1).replace("-", " ")}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(task.priority)}`}>
                    {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)} Priority
                  </span>
                </div>
                <div className="text-right text-sm text-gray-600">
                  <p>
                    Assigned to: <span className="font-semibold">{task.assignedTo}</span>
                  </p>
                  <p>
                    Due: <span className="font-semibold">{task.dueDate}</span>
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}

// Email System Component
const EmailSystem = () => {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: "member-crud",
      recipient: "hr@oneaimupsc.com",
      subject: "New Employee Added - Action Required",
      message: "A new employee has been added to the system. Please review and complete onboarding process.",
      timestamp: "2024-03-15 10:30 AM",
      status: "sent",
    },
    {
      id: 2,
      type: "increment",
      recipient: "hr@oneaimupsc.com",
      subject: "Salary Increment Approved - Process Payment",
      message: "Salary increment for Dr. Anil Kumar has been approved. Please process the updated salary.",
      timestamp: "2024-03-14 02:15 PM",
      status: "sent",
    },
    {
      id: 3,
      type: "penalty",
      recipient: "hr@oneaimupsc.com",
      subject: "Disciplinary Action Required",
      message: "A penalty action has been initiated for an employee. Please review and take appropriate action.",
      timestamp: "2024-03-13 11:45 AM",
      status: "pending",
    },
  ])

  const getTypeColor = (type) => {
    switch (type) {
      case "member-crud":
        return "bg-blue-100 text-blue-800"
      case "increment":
        return "bg-green-100 text-green-800"
      case "decrement":
        return "bg-orange-100 text-orange-800"
      case "penalty":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "sent":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "failed":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Email System</h1>
        <button className="bg-red-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-700 transition-colors flex items-center gap-2">
          <Send size={20} />
          Send New Notification
        </button>
      </div>

      {/* Email Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <Mail className="text-blue-600" size={24} />
            <span className="font-semibold text-gray-700">Total Sent</span>
          </div>
          <p className="text-3xl font-bold text-blue-600">{notifications.filter((n) => n.status === "sent").length}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <Clock className="text-yellow-600" size={24} />
            <span className="font-semibold text-gray-700">Pending</span>
          </div>
          <p className="text-3xl font-bold text-yellow-600">
            {notifications.filter((n) => n.status === "pending").length}
          </p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <AlertCircle className="text-red-600" size={24} />
            <span className="font-semibold text-gray-700">Failed</span>
          </div>
          <p className="text-3xl font-bold text-red-600">{notifications.filter((n) => n.status === "failed").length}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <MessageSquare className="text-green-600" size={24} />
            <span className="font-semibold text-gray-700">Total</span>
          </div>
          <p className="text-3xl font-bold text-green-600">{notifications.length}</p>
        </div>
      </div>

      {/* HR Notifications */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-gray-900">
          <div className="p-2 bg-red-100 rounded-lg">
            <Mail className="text-red-600" size={20} />
          </div>
          HR Notifications
        </h3>
        <p className="text-gray-600 mb-6">
          Automated email notifications sent to HR for various organizational actions:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h4 className="font-semibold text-blue-800 mb-2">Member CRUD</h4>
            <p className="text-sm text-blue-600">Add, update, or remove organization members</p>
          </div>
          <div className="p-4 bg-green-50 rounded-lg border border-green-200">
            <h4 className="font-semibold text-green-800 mb-2">Increments</h4>
            <p className="text-sm text-green-600">Salary increment approvals and processing</p>
          </div>
          <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
            <h4 className="font-semibold text-orange-800 mb-2">Decrements</h4>
            <p className="text-sm text-orange-600">Salary reduction notifications</p>
          </div>
          <div className="p-4 bg-red-50 rounded-lg border border-red-200">
            <h4 className="font-semibold text-red-800 mb-2">Penalty Actions</h4>
            <p className="text-sm text-red-600">Disciplinary actions and penalties</p>
          </div>
        </div>

        <div className="space-y-4">
          {notifications.map((notification) => (
            <motion.div
              key={notification.id}
              whileHover={{ y: -1, scale: 1.01 }}
              className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getTypeColor(notification.type)}`}>
                      {notification.type.charAt(0).toUpperCase() + notification.type.slice(1).replace("-", " ")}
                    </span>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(notification.status)}`}
                    >
                      {notification.status.charAt(0).toUpperCase() + notification.status.slice(1)}
                    </span>
                  </div>
                  <h4 className="font-bold text-lg text-gray-900">{notification.subject}</h4>
                  <p className="text-gray-600 text-sm">{notification.message}</p>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm text-gray-600">
                <span>
                  To: <span className="font-semibold">{notification.recipient}</span>
                </span>
                <span>{notification.timestamp}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}

// Main Dashboard Component
export default function UPSCAdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview")
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [departments, setDepartments] = useState(sampleDepartments)

  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return <Overview />
      case "sub-departments":
        return <SubDepartments departments={departments} />
      case "ongoing-batches":
        return <OngoingBatches batches={sampleBatches} />
      case "organization-members":
        return <OrganizationMembers faculties={sampleFaculties} students={sampleStudents} />
      case "organization-hierarchy":
        return <OrganizationHierarchy departments={departments} />
      case "crud-operations":
        return <CRUDOperations />
      case "dashboard-charts":
        return <DashboardCharts />
      case "task-management":
        return <TaskManagement tasks={sampleTasks} />
      case "email-system":
        return <EmailSystem />
      default:
        return <Overview />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <TopHeader activeTab={activeTab} setIsSidebarOpen={setIsSidebarOpen} />

        <main className="flex-1 p-6 overflow-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  )
}
