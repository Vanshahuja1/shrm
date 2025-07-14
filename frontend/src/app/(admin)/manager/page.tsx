"use client"
import type React from "react"
import { useState, useEffect } from "react"
import {
  User,
  Users,
  Plus,
  Bell,
  Calendar,
  CheckCircle,
  Send,
  Clock,
  Star,
  Edit,
  FileText,
  TrendingUp,
  DollarSign,
  CreditCard,
  Settings,
  LogIn,
  LogOut,
  Target,
  Award,
  Mail,
  Download,
  Eye,
  MessageSquare,
  Database,
} from "lucide-react"

// Type definitions
type Employee = {
  id: number
  name: string
  department: string
  position: string
  email: string
  phone: string
  joinDate: string
  performance: number
  attendance: number
  tasksPerDay: number
  managerRating: number
}

type Intern = {
  id: number
  name: string
  department: string
  duration: string
  mentor: string
  performance: number
  startDate: string
  endDate: string
}

type Project = {
  id: number
  name: string
  description: string
  progress: number
  employees: string[]
  startDate: string
  endDate: string
  status: "ongoing" | "completed" | "paused"
  priority: "high" | "medium" | "low"
  budget: number
  actualCost: number
}

type Task = {
  id: number
  title: string
  description: string
  assignedTo: string
  assignedBy: string
  department: string
  team: string
  priority: "high" | "medium" | "low"
  weightage: number
  dueDate: string
  dueTime: string
  status: "pending" | "in-progress" | "completed"
  responses: TaskResponse[]
  emailSent: boolean
  createdAt: string
}

type TaskResponse = {
  id: number
  employee: string
  response: string
  timestamp: string
  rating?: number
  documents?: string[]
  format: "text" | "document"
}

type AttendanceRecord = {
  date: string
  employee: string
  punchIn: string
  punchOut: string
  status: "present" | "absent" | "late" | "half-day"
  regularized: boolean
  regularizationReason?: string
  totalHours: number
}

type ManagerInfo = {
  id: string
  name: string
  department: string
  email: string
  phone: string
  employees: Employee[]
  interns: Intern[]
  bankDetails: {
    accountNumber: string
    bankName: string
    ifsc: string
    branch: string
  }
  salary: {
    basic: number
    allowances: number
    total: number
    lastAppraisal: string
  }
  personalInfo: {
    address: string
    emergencyContact: string
    dateOfBirth: string
    employeeId: string
  }
}

type EmailNotification = {
  id: number
  to: string
  subject: string
  message: string
  type: "task_assignment" | "task_reminder" | "performance_review"
  sent: boolean
  timestamp: string
}

type ProjectUpdate = {
  projectId: number
  projectName: string
  oldProgress: number
  newProgress: number
  updatedBy: string
  timestamp: string
}

type EmployeeResponse = {
  taskId: number
  taskTitle: string
  employee: string
  rating: number
  ratedBy: string
  timestamp: string
}

type AttendanceData = {
  employee: string
  date: string
  action: string
  reason: string
  approvedBy: string
  timestamp: string
}

type AdminData = {
  projectUpdates: ProjectUpdate[]
  employeeResponses: EmployeeResponse[]
  attendanceData: AttendanceData[]
  performanceMetrics: unknown[]
}

const ManagerDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState("profile")
  const [isPunchedIn, setIsPunchedIn] = useState(false)
  const [punchTime, setPunchTime] = useState<string>("")
  const [currentTime, setCurrentTime] = useState(new Date())

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  // Manager Info
  const [managerInfo] = useState<ManagerInfo>({
    id: "MGR001",
    name: "Sarah Johnson",
    department: "Software Development",
    email: "sarah.johnson@company.com",
    phone: "+1 (555) 123-4567",
    employees: [
      {
        id: 1,
        name: "Alice Smith",
        department: "Frontend",
        position: "Senior Developer",
        email: "alice@company.com",
        phone: "+1 (555) 111-1111",
        joinDate: "2022-01-15",
        performance: 4.5,
        attendance: 95,
        tasksPerDay: 4.2,
        managerRating: 4.5,
      },
      {
        id: 2,
        name: "Bob Wilson",
        department: "Backend",
        position: "Lead Developer",
        email: "bob@company.com",
        phone: "+1 (555) 222-2222",
        joinDate: "2021-08-20",
        performance: 4.2,
        attendance: 92,
        tasksPerDay: 3.8,
        managerRating: 4.0,
      },
      {
        id: 3,
        name: "Carol Davis",
        department: "DevOps",
        position: "DevOps Engineer",
        email: "carol@company.com",
        phone: "+1 (555) 333-3333",
        joinDate: "2023-03-10",
        performance: 4.8,
        attendance: 98,
        tasksPerDay: 4.5,
        managerRating: 4.8,
      },
    ],
    interns: [
      {
        id: 1,
        name: "David Lee",
        department: "Frontend",
        duration: "6 months",
        mentor: "Alice Smith",
        performance: 4.0,
        startDate: "2024-01-15",
        endDate: "2024-07-15",
      },
      {
        id: 2,
        name: "Emma Brown",
        department: "Backend",
        duration: "3 months",
        mentor: "Bob Wilson",
        performance: 3.8,
        startDate: "2024-04-01",
        endDate: "2024-07-01",
      },
    ],
    bankDetails: {
      accountNumber: "****1234",
      bankName: "Chase Bank",
      ifsc: "CHAS0001234",
      branch: "Downtown Branch",
    },
    salary: {
      basic: 85000,
      allowances: 15000,
      total: 100000,
      lastAppraisal: "2023-12-15",
    },
    personalInfo: {
      address: "123 Main St, City, State 12345",
      emergencyContact: "+1 (555) 999-9999",
      dateOfBirth: "1985-06-15",
      employeeId: "EMP001",
    },
  })

  // Projects State
  const [ongoingProjects, setOngoingProjects] = useState<Project[]>([
    {
      id: 1,
      name: "E-commerce Platform Redesign",
      description: "Complete overhaul of the company's e-commerce platform with modern UI/UX",
      progress: 65,
      employees: ["Alice Smith", "Bob Wilson", "Carol Davis"],
      startDate: "2024-01-15",
      endDate: "2024-08-15",
      status: "ongoing",
      priority: "high",
      budget: 150000,
      actualCost: 95000,
    },
    {
      id: 2,
      name: "Mobile App Development",
      description: "Native mobile app for iOS and Android platforms",
      progress: 30,
      employees: ["Emma Brown", "David Lee"],
      startDate: "2024-03-01",
      endDate: "2024-10-01",
      status: "ongoing",
      priority: "medium",
      budget: 120000,
      actualCost: 35000,
    },
  ])

  const [pastProjects] = useState<Project[]>([
    {
      id: 3,
      name: "API Integration Project",
      description: "Integration with third-party payment and shipping APIs",
      progress: 100,
      employees: ["Alice Smith", "Bob Wilson"],
      startDate: "2023-09-01",
      endDate: "2023-12-15",
      status: "completed",
      priority: "high",
      budget: 80000,
      actualCost: 75000,
    },
    {
      id: 4,
      name: "Database Migration",
      description: "Migration from MySQL to PostgreSQL with data optimization",
      progress: 100,
      employees: ["Carol Davis", "Bob Wilson"],
      startDate: "2023-06-01",
      endDate: "2023-08-30",
      status: "completed",
      priority: "medium",
      budget: 60000,
      actualCost: 58000,
    },
  ])

  // Tasks State
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: 1,
      title: "Review Q2 Performance Reports",
      description: "Analyze and review quarterly performance metrics for all team members",
      assignedTo: "Alice Smith",
      assignedBy: "Sarah Johnson",
      department: "Frontend",
      team: "Development Team A",
      priority: "high",
      weightage: 8,
      dueDate: "2024-07-15",
      dueTime: "17:00",
      status: "in-progress",
      emailSent: true,
      createdAt: "2024-07-10 09:00 AM",
      responses: [
        {
          id: 1,
          employee: "Alice Smith",
          response:
            "Started working on the performance analysis. Found some interesting trends in productivity metrics. Will complete detailed report by tomorrow.",
          timestamp: "2024-07-10 10:30 AM",
          rating: 4,
          format: "text",
        },
      ],
    },
    {
      id: 2,
      title: "Update Security Protocols",
      description: "Review and update all security protocols for the development environment",
      assignedTo: "Carol Davis",
      assignedBy: "Sarah Johnson",
      department: "DevOps",
      team: "Infrastructure Team",
      priority: "high",
      weightage: 9,
      dueDate: "2024-07-12",
      dueTime: "16:00",
      status: "completed",
      emailSent: true,
      createdAt: "2024-07-08 11:00 AM",
      responses: [
        {
          id: 2,
          employee: "Carol Davis",
          response:
            "Completed security protocol updates. All firewall rules updated and documented. Security audit passed successfully.",
          timestamp: "2024-07-11 14:30 PM",
          rating: 5,
          format: "document",
          documents: ["security_audit_report.pdf", "updated_protocols.docx"],
        },
      ],
    },
  ])

  // Attendance State
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([
    {
      date: "2024-07-01",
      employee: "Alice Smith",
      punchIn: "09:00",
      punchOut: "18:00",
      status: "present",
      regularized: false,
      totalHours: 9,
    },
    {
      date: "2024-07-01",
      employee: "Bob Wilson",
      punchIn: "09:15",
      punchOut: "18:15",
      status: "late",
      regularized: true,
      regularizationReason: "Traffic jam due to road construction",
      totalHours: 9,
    },
    {
      date: "2024-07-02",
      employee: "Carol Davis",
      punchIn: "08:45",
      punchOut: "17:45",
      status: "present",
      regularized: false,
      totalHours: 9,
    },
    {
      date: "2024-07-02",
      employee: "Alice Smith",
      punchIn: "09:30",
      punchOut: "13:30",
      status: "half-day",
      regularized: true,
      regularizationReason: "Medical appointment",
      totalHours: 4,
    },
  ])

  // Email Notifications State
 /* const [emailNotifications, setEmailNotifications] = useState<EmailNotification[]>([
    {
      id: 1,
      to: "alice@company.com",
      subject: "New Task Assignment: Review Q2 Performance Reports",
      message: "You have been assigned a new high-priority task. Please check your dashboard for details.",
      type: "task_assignment",
      sent: true,
      timestamp: "2024-07-10 09:05 AM",
    },
    {
      id: 2,
      to: "carol@company.com",
      subject: "Task Reminder: Update Security Protocols",
      message: "Reminder: Your task 'Update Security Protocols' is due tomorrow.",
      type: "task_reminder",
      sent: true,
      timestamp: "2024-07-11 10:00 AM",
    },
  ])

  // Admin Data State
  const [adminData, setAdminData] = useState<AdminData>({
    projectUpdates: [],
    employeeResponses: [],
    attendanceData: [],
    performanceMetrics: [],
  })

  const [showNewProject, setShowNewProject] = useState(false)
  const [showNewTask, setShowNewTask] = useState(false)
  //const [selectedAttendance, setSelectedAttendance] = useState<AttendanceRecord | null>(null)

  // Handle project progress change and send to admin
  const handleProgressChange = (projectId: number, newProgress: number) => {
    setOngoingProjects(
      ongoingProjects.map((project) => {
        if (project.id === projectId) {
          const updatedProject = { ...project, progress: newProgress }
          // Send data to admin
          setAdminData((prev) => ({
            ...prev,
            projectUpdates: [
              ...prev.projectUpdates,
              {
                projectId,
                projectName: project.name,
                oldProgress: project.progress,
                newProgress,
                updatedBy: managerInfo.name,
                timestamp: new Date().toISOString(),
              },
            ],
          }))
          return updatedProject
        }
        return project
      }),
    )
  }

  // Handle punch in/out
  const handlePunchToggle = () => {
    const now = new Date()
    const timeString = now.toLocaleTimeString()

    if (!isPunchedIn) {
      setIsPunchedIn(true)
      setPunchTime(timeString)
    } else {
      setIsPunchedIn(false)
      setPunchTime("")
    }
  }

  // Handle task rating and send to admin
  const handleTaskRating = (taskId: number, responseId: number, rating: number) => {
    setTasks(
      tasks.map((task) => {
        if (task.id === taskId) {
          const updatedTask = {
            ...task,
            responses: task.responses.map((response) =>
              response.id === responseId ? { ...response, rating } : response,
            ),
          }
          // Send data to admin
          setAdminData((prev) => ({
            ...prev,
            employeeResponses: [
              ...prev.employeeResponses,
              {
                taskId,
                taskTitle: task.title,
                employee: task.assignedTo,
                rating,
                ratedBy: managerInfo.name,
                timestamp: new Date().toISOString(),
              },
            ],
          }))
          return updatedTask
        }
        return task
      }),
    )
  }

  // Send email notification
  /*const sendEmailNotification = (task: Task) => {
    const newNotification: EmailNotification = {
      id: emailNotifications.length + 1,
      to: managerInfo.employees.find((emp) => emp.name === task.assignedTo)?.email || "",
      subject: `New Task Assignment: ${task.title}`,
      message: `You have been assigned a new ${task.priority}-priority task. Due: ${task.dueDate} at ${task.dueTime}`,
      type: "task_assignment",
      sent: true,
      timestamp: new Date().toLocaleString(),
    }
    setEmailNotifications([...emailNotifications, newNotification])
  }*/

  // Calculate performance metrics
  const calculatePerformanceMetrics = (employee: Employee) => {
    const tasksScore = (employee.tasksPerDay / 5) * 100
    const attendanceScore = employee.attendance
    const managerReviewScore = (employee.managerRating / 5) * 100
    const combinedPercentage = (tasksScore + attendanceScore + managerReviewScore) / 3

    return {
      tasksScore,
      attendanceScore,
      managerReviewScore,
      combinedPercentage: Math.round(combinedPercentage),
    }
  }

  // Handle attendance edit
  const handleAttendanceEdit = (record: AttendanceRecord) => {
    setSelectedAttendance(record)
    // setShowAttendanceEdit(true) - removed unused state
  }

  // Handle attendance regularization
  const handleRegularization = (record: AttendanceRecord, reason: string) => {
    setAttendanceRecords(
      attendanceRecords.map((r) =>
        r.date === record.date && r.employee === record.employee
          ? { ...r, regularized: true, regularizationReason: reason }
          : r,
      ),
    )
    // Send data to admin
    setAdminData((prev) => ({
      ...prev,
      attendanceData: [
        ...prev.attendanceData,
        {
          employee: record.employee,
          date: record.date,
          action: "regularized",
          reason,
          approvedBy: managerInfo.name,
          timestamp: new Date().toISOString(),
        },
      ],
    }))
  }

  const renderProfile = () => (
    <div className="space-y-6">
      {/* Manager Profile Card */}
      <div className="bg-white rounded-lg shadow-sm border border-red-200 p-6">
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-20 h-20 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center">
            <User className="w-10 h-10 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{managerInfo.name}</h2>
            <p className="text-red-600 font-medium text-lg">{managerInfo.department}</p>
            <p className="text-gray-600">{managerInfo.email}</p>
            <p className="text-gray-600">{managerInfo.phone}</p>
            <p className="text-sm text-gray-500">Employee ID: {managerInfo.personalInfo.employeeId}</p>
          </div>
        </div>
      </div>

      {/* Associated Employees */}
      <div className="bg-white rounded-lg shadow-sm border border-red-200 p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
          <Users className="w-6 h-6 text-red-500 mr-2" />
          Associated Employees ({managerInfo.employees.length})
        </h3>
        <div className="grid gap-4">
          {managerInfo.employees.map((employee) => {
            const metrics = calculatePerformanceMetrics(employee)
            return (
              <div
                key={employee.id}
                className="border border-red-100 rounded-lg p-4 hover:shadow-md transition-shadow bg-red-50"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-semibold text-gray-900 text-lg">{employee.name}</h4>
                    <p className="text-red-600 font-medium">{employee.position}</p>
                    <p className="text-gray-600">{employee.department}</p>
                    <p className="text-gray-500 text-sm">Joined: {employee.joinDate}</p>
                    <p className="text-gray-600 text-sm">{employee.email}</p>
                  </div>
                  <div className="text-right">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">Performance</p>
                        <div className="flex items-center space-x-1">
                          <Star className="w-4 h-4 text-yellow-500" />
                          <span className="font-medium">{employee.performance}/5</span>
                        </div>
                      </div>
                      <div>
                        <p className="text-gray-600">Attendance</p>
                        <span className="font-medium text-green-600">{employee.attendance}%</span>
                      </div>
                      <div>
                        <p className="text-gray-600">Tasks/Day</p>
                        <span className="font-medium text-blue-600">{employee.tasksPerDay}/5</span>
                      </div>
                      <div>
                        <p className="text-gray-600">Overall</p>
                        <span className="font-medium text-red-600">{metrics.combinedPercentage}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Associated Interns */}
      <div className="bg-white rounded-lg shadow-sm border border-red-200 p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
          <Award className="w-6 h-6 text-red-500 mr-2" />
          Associated Interns ({managerInfo.interns.length})
        </h3>
        <div className="grid gap-4">
          {managerInfo.interns.map((intern) => (
            <div key={intern.id} className="border border-red-100 rounded-lg p-4 bg-red-50">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-semibold text-gray-900 text-lg">{intern.name}</h4>
                  <p className="text-red-600 font-medium">{intern.department}</p>
                  <p className="text-gray-600">Duration: {intern.duration}</p>
                  <p className="text-gray-500 text-sm">Mentor: {intern.mentor}</p>
                  <p className="text-gray-500 text-sm">
                    {intern.startDate} - {intern.endDate}
                  </p>
                </div>
                <div className="text-right">
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-500" />
                    <span className="font-medium">{intern.performance}/5</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  const renderOngoingProjects = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Ongoing Projects</h2>
        <button
          onClick={() => setShowNewProject(true)}
          className="bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600 transition-colors flex items-center space-x-2 font-medium"
        >
          <Plus className="w-5 h-5" />
          <span>Add New Project</span>
        </button>
      </div>

      <div className="grid gap-6">
        {ongoingProjects.map((project) => (
          <div key={project.id} className="bg-white rounded-lg shadow-sm border border-red-200 p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-gray-900">{project.name}</h3>
                <p className="text-gray-600 mt-2">{project.description}</p>
                <div className="flex items-center space-x-4 mt-3 text-sm">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      project.priority === "high"
                        ? "bg-red-100 text-red-800"
                        : project.priority === "medium"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-green-100 text-green-800"
                    }`}
                  >
                    {project.priority.toUpperCase()} Priority
                  </span>
                  <span className="text-gray-500">
                    {project.startDate} - {project.endDate}
                  </span>
                  <span className="text-gray-600">
                    Budget: ${project.budget.toLocaleString()} | Spent: ${project.actualCost.toLocaleString()}
                  </span>
                </div>
              </div>
              <div className="text-right ml-6">
                <span className="text-4xl font-bold text-red-500">{project.progress}%</span>
                <p className="text-sm text-gray-600 mt-1">Completion</p>
              </div>
            </div>

            {/* Progress Bar with Adjustment */}
            <div className="mb-4">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Adjust Completion Progress</span>
                <span>{project.progress}%</span>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                value={project.progress}
                onChange={(e) => handleProgressChange(project.id, Number.parseInt(e.target.value))}
                className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, #ef4444 0%, #ef4444 ${project.progress}%, #e5e7eb ${project.progress}%, #e5e7eb 100%)`,
                }}
              />
            </div>

            {/* Team Members */}
            <div className="mb-4">
              <span className="text-sm font-medium text-gray-700">Team Members:</span>
              <div className="flex flex-wrap gap-2 mt-2">
                {project.employees.map((employee, index) => (
                  <span
                    key={index}
                    className="bg-red-50 text-red-700 px-3 py-1 rounded-full text-sm border border-red-200 font-medium"
                  >
                    {employee}
                  </span>
                ))}
              </div>
            </div>

            {/* Project Management Actions */}
            <div className="flex space-x-3 pt-4 border-t border-red-100">
              <button className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors text-sm font-medium">
                <Database className="w-4 h-4 inline mr-1" />
                Send to Admin
              </button>
              <button className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors text-sm font-medium">
                <Edit className="w-4 h-4 inline mr-1" />
                Edit Project
              </button>
              <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium">
                <FileText className="w-4 h-4 inline mr-1" />
                Generate Report
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  const renderPastProjects = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Past Projects</h2>

      <div className="grid gap-6">
        {pastProjects.map((project) => (
          <div key={project.id} className="bg-white rounded-lg shadow-sm border border-red-200 p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-gray-900">{project.name}</h3>
                <p className="text-gray-600 mt-2">{project.description}</p>
                <div className="flex items-center space-x-4 mt-3 text-sm">
                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-medium">
                    COMPLETED
                  </span>
                  <span className="text-gray-500">
                    {project.startDate} - {project.endDate}
                  </span>
                </div>
              </div>
              <div className="text-right ml-6">
                <span className="text-4xl font-bold text-green-500">100%</span>
                <p className="text-sm text-gray-600 mt-1">Completed</p>
              </div>
            </div>

            {/* Historical Data */}
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <h4 className="font-medium text-gray-900 mb-3">Historical Data</h4>
              <div className="grid grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Duration:</span>
                  <p className="font-medium">
                    {Math.ceil(
                      (new Date(project.endDate).getTime() - new Date(project.startDate).getTime()) /
                        (1000 * 60 * 60 * 24 * 30),
                    )}{" "}
                    months
                  </p>
                </div>
                <div>
                  <span className="text-gray-600">Team Size:</span>
                  <p className="font-medium">{project.employees.length} members</p>
                </div>
                <div>
                  <span className="text-gray-600">Budget vs Actual:</span>
                  <p className="font-medium">
                    ${project.budget.toLocaleString()} / ${project.actualCost.toLocaleString()}
                  </p>
                </div>
                <div>
                  <span className="text-gray-600">Cost Efficiency:</span>
                  <p className="font-medium text-green-600">
                    {Math.round(((project.budget - project.actualCost) / project.budget) * 100)}% saved
                  </p>
                </div>
              </div>
            </div>

            {/* Performance Analysis */}
            <div className="bg-red-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-3">Performance Analysis</h4>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Success Rate:</span>
                  <p className="font-medium text-green-600">95%</p>
                </div>
                <div>
                  <span className="text-gray-600">Quality Score:</span>
                  <p className="font-medium text-blue-600">4.5/5</p>
                </div>
                <div>
                  <span className="text-gray-600">Client Satisfaction:</span>
                  <p className="font-medium text-red-600">Excellent</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  const renderTaskAssignment = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Task Assignment</h2>
        <button
          onClick={() => setShowNewTask(true)}
          className="bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600 transition-colors flex items-center space-x-2 font-medium"
        >
          <Plus className="w-5 h-5" />
          <span>Assign New Task</span>
        </button>
      </div>

      {/* Email System Status */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center space-x-2">
          <Mail className="w-5 h-5 text-blue-500" />
          <span className="font-medium text-blue-900">Email System Active</span>
          <span className="text-blue-700">- Automatic notifications sent for task assignments</span>
        </div>
      </div>

      <div className="grid gap-6">
        {tasks.map((task) => (
          <div key={task.id} className="bg-white rounded-lg shadow-sm border border-red-200 p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-gray-900">{task.title}</h3>
                <p className="text-gray-600 mt-2">{task.description}</p>
                <div className="grid grid-cols-2 gap-4 mt-4 text-sm">
                  <div>
                    <span className="text-gray-600">Department:</span>
                    <span className="ml-2 font-medium text-red-600">{task.department}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Team:</span>
                    <span className="ml-2 font-medium text-blue-600">{task.team}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Assigned to:</span>
                    <span className="ml-2 font-medium text-green-600">{task.assignedTo}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Created:</span>
                    <span className="ml-2 text-gray-500">{task.createdAt}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-4 mt-3">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      task.priority === "high"
                        ? "bg-red-100 text-red-800"
                        : task.priority === "medium"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-green-100 text-green-800"
                    }`}
                  >
                    {task.priority.toUpperCase()} Priority
                  </span>
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-medium">
                    Weight: {task.weightage}/10
                  </span>
                  <span className="text-gray-500 text-sm">
                    Due: {task.dueDate} at {task.dueTime}
                  </span>
                  {task.emailSent && (
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                      <Mail className="w-3 h-3 inline mr-1" />
                      Email Sent
                    </span>
                  )}
                </div>
              </div>
              <div className="text-right ml-6">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    task.status === "completed"
                      ? "bg-green-100 text-green-800"
                      : task.status === "in-progress"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {task.status.replace("-", " ").toUpperCase()}
                </span>
              </div>
            </div>

            {/* Task Responses */}
            {task.responses.length > 0 && (
              <div className="border-t border-red-100 pt-4">
                <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                  <MessageSquare className="w-5 h-5 text-red-500 mr-2" />
                  Employee Responses:
                </h4>
                {task.responses.map((response) => (
                  <div key={response.id} className="bg-red-50 rounded-lg p-4 mb-3">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-red-700">{response.employee}</span>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            response.format === "document" ? "bg-blue-100 text-blue-800" : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {response.format.toUpperCase()}
                        </span>
                      </div>
                      <span className="text-xs text-gray-500">{response.timestamp}</span>
                    </div>
                    <p className="text-gray-700 mb-3">{response.response}</p>

                    {/* Document attachments */}
                    {response.documents && response.documents.length > 0 && (
                      <div className="mb-3">
                        <span className="text-sm text-gray-600">Attachments:</span>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {response.documents.map((doc, index) => (
                            <span
                              key={index}
                              className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs flex items-center"
                            >
                              <FileText className="w-3 h-3 mr-1" />
                              {doc}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Performance Rating */}
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-600">Rate Performance (1-5):</span>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          onClick={() => handleTaskRating(task.id, response.id, star)}
                          className={`w-5 h-5 transition-colors ${
                            response.rating && star <= response.rating ? "text-yellow-500" : "text-gray-300"
                          }`}
                        >
                          <Star className="w-full h-full fill-current" />
                        </button>
                      ))}
                      {response.rating && (
                        <span className="text-sm text-gray-600 ml-2 font-medium">{response.rating}/5</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )

  const renderEmployeeResponse = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Employee Response & Performance Tracking</h2>

      {/* Performance Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {managerInfo.employees.map((employee) => {
          const metrics = calculatePerformanceMetrics(employee)
          return (
            <div key={employee.id} className="bg-white rounded-lg shadow-sm border border-red-200 p-4">
              <h3 className="font-semibold text-gray-900 mb-3">{employee.name}</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Tasks/Day:</span>
                  <span className="font-medium">{employee.tasksPerDay}/5</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Attendance:</span>
                  <span className="font-medium">{employee.attendance}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Manager Rating:</span>
                  <span className="font-medium">{employee.managerRating}/5</span>
                </div>
                <div className="flex justify-between border-t pt-2">
                  <span className="text-gray-600 font-medium">Combined:</span>
                  <span className="font-bold text-red-600">{metrics.combinedPercentage}%</span>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* All Responses View */}
      <div className="bg-white rounded-lg shadow-sm border border-red-200 p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
          <Eye className="w-6 h-6 text-red-500 mr-2" />
          View All Responses
        </h3>

        <div className="space-y-4">
          {tasks
            .filter((task) => task.responses.length > 0)
            .map((task) => (
              <div key={task.id} className="border border-red-100 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">{task.title}</h4>
                <p className="text-sm text-gray-600 mb-3">Assigned to: {task.assignedTo}</p>

                {task.responses.map((response) => (
                  <div key={response.id} className="bg-red-50 rounded-lg p-3 mb-2">
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-medium text-red-700">{response.employee}</span>
                      <div className="flex items-center space-x-2">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            response.format === "document" ? "bg-blue-100 text-blue-800" : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {response.format.toUpperCase()}
                        </span>
                        <span className="text-xs text-gray-500">{response.timestamp}</span>
                      </div>
                    </div>

                    <p className="text-gray-700 text-sm mb-2">{response.response}</p>

                    {response.documents && response.documents.length > 0 && (
                      <div className="mb-2">
                        <span className="text-xs text-gray-600">Documents:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {response.documents.map((doc, index) => (
                            <span
                              key={index}
                              className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs flex items-center"
                            >
                              <Download className="w-3 h-3 mr-1" />
                              {doc}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {response.rating && (
                      <div className="flex items-center space-x-1">
                        <span className="text-xs text-gray-600">Rating:</span>
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`w-3 h-3 ${
                                star <= response.rating! ? "text-yellow-500 fill-current" : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-xs text-gray-600">({response.rating}/5)</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ))}
        </div>
      </div>
    </div>
  )

  const renderAttendance = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Attendance Management</h2>

      {/* Last 30 Days Overview */}
      <div className="bg-white rounded-lg shadow-sm border border-red-200 p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Last 30 Days Overview</h3>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-red-200">
                <th className="text-left py-3 px-4 font-medium text-gray-900">Date</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Employee</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Punch In</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Punch Out</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Hours</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody>
              {attendanceRecords.map((record, index) => (
                <tr key={index} className="border-b border-gray-100 hover:bg-red-50">
                  <td className="py-3 px-4">{record.date}</td>
                  <td className="py-3 px-4 font-medium">{record.employee}</td>
                  <td className="py-3 px-4">{record.punchIn}</td>
                  <td className="py-3 px-4">{record.punchOut}</td>
                  <td className="py-3 px-4">{record.totalHours}h</td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        record.status === "present"
                          ? "bg-green-100 text-green-800"
                          : record.status === "late"
                            ? "bg-yellow-100 text-yellow-800"
                            : record.status === "absent"
                              ? "bg-red-100 text-red-800"
                              : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {record.status.toUpperCase()}
                    </span>
                    {record.regularized && (
                      <span className="ml-2 text-xs text-blue-600 font-medium">(Regularized)</span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleAttendanceEdit(record)}
                        className="text-red-600 hover:text-red-800 text-sm"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      {!record.regularized && record.status !== "present" && (
                        <button
                          onClick={() => handleRegularization(record, "Approved by manager")}
                          className="text-blue-600 hover:text-blue-800 text-sm"
                        >
                          <CheckCircle className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Punch In/Out Section */}
      <div className="bg-white rounded-lg shadow-sm border border-red-200 p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
          <Clock className="w-6 h-6 text-red-500 mr-2" />
          Punch In/Out - Own Attendance
        </h3>

        <div className="text-center">
          <div className="mb-6">
            <div className="w-24 h-24 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="w-12 h-12 text-white" />
            </div>
            <h4 className="text-3xl font-bold text-gray-900">{currentTime.toLocaleTimeString()}</h4>
            <p className="text-gray-600 text-lg">{currentTime.toLocaleDateString()}</p>
          </div>

          <div className="mb-6">
            <button
              onClick={handlePunchToggle}
              className={`px-10 py-4 rounded-lg text-white font-semibold text-xl transition-colors ${
                isPunchedIn ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"
              }`}
            >
              {isPunchedIn ? (
                <>
                  <LogOut className="w-6 h-6 inline mr-2" />
                  Punch Out
                </>
              ) : (
                <>
                  <LogIn className="w-6 h-6 inline mr-2" />
                  Punch In
                </>
              )}
            </button>
          </div>

          {punchTime && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-700 font-medium">
                {isPunchedIn ? "Punched In" : "Punched Out"} at: <strong>{punchTime}</strong>
              </p>
            </div>
          )}
        </div>

        {/* Time Tracking */}
        <div className="mt-6 pt-6 border-t border-red-100">
          <h4 className="font-medium text-gray-900 mb-3">{"Today's Time Tracking"}</h4>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="bg-red-50 rounded-lg p-3">
              <p className="text-sm text-gray-600">Total Hours</p>
              <p className="text-xl font-bold text-red-600">8.5h</p>
            </div>
            <div className="bg-green-50 rounded-lg p-3">
              <p className="text-sm text-gray-600">Break Time</p>
              <p className="text-xl font-bold text-green-600">1.0h</p>
            </div>
            <div className="bg-blue-50 rounded-lg p-3">
              <p className="text-sm text-gray-600">Productive</p>
              <p className="text-xl font-bold text-blue-600">7.5h</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  const renderPersonalDetails = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Personal Details</h2>

      {/* Profile Information */}
      <div className="bg-white rounded-lg shadow-sm border border-red-200 p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
          <User className="w-6 h-6 text-red-500 mr-2" />
          Profile Information
        </h3>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <p className="text-gray-900 font-medium">{managerInfo.name}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Employee ID</label>
            <p className="text-gray-900 font-medium">{managerInfo.personalInfo.employeeId}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
            <p className="text-gray-900 font-medium">{managerInfo.department}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
            <p className="text-gray-900 font-medium">{managerInfo.personalInfo.dateOfBirth}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <p className="text-gray-900 font-medium">{managerInfo.email}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
            <p className="text-gray-900 font-medium">{managerInfo.phone}</p>
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
            <p className="text-gray-900 font-medium">{managerInfo.personalInfo.address}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Emergency Contact</label>
            <p className="text-gray-900 font-medium">{managerInfo.personalInfo.emergencyContact}</p>
          </div>
        </div>
      </div>

      {/* Bank Details */}
      <div className="bg-white rounded-lg shadow-sm border border-red-200 p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
          <CreditCard className="w-6 h-6 text-red-500 mr-2" />
          Bank Details
        </h3>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Account Number</label>
            <p className="text-gray-900 font-medium">{managerInfo.bankDetails.accountNumber}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Bank Name</label>
            <p className="text-gray-900 font-medium">{managerInfo.bankDetails.bankName}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">IFSC Code</label>
            <p className="text-gray-900 font-medium">{managerInfo.bankDetails.ifsc}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Branch</label>
            <p className="text-gray-900 font-medium">{managerInfo.bankDetails.branch}</p>
          </div>
        </div>
      </div>

      {/* Salary Information */}
      <div className="bg-white rounded-lg shadow-sm border border-red-200 p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
          <DollarSign className="w-6 h-6 text-red-500 mr-2" />
          Salary Information
        </h3>
        <div className="grid grid-cols-3 gap-6">
          <div className="text-center">
            <label className="block text-sm font-medium text-gray-700 mb-2">Basic Salary</label>
            <p className="text-3xl font-bold text-gray-900">${managerInfo.salary.basic.toLocaleString()}</p>
          </div>
          <div className="text-center">
            <label className="block text-sm font-medium text-gray-700 mb-2">Allowances</label>
            <p className="text-3xl font-bold text-gray-900">${managerInfo.salary.allowances.toLocaleString()}</p>
          </div>
          <div className="text-center">
            <label className="block text-sm font-medium text-gray-700 mb-2">Total Salary</label>
            <p className="text-3xl font-bold text-red-600">${managerInfo.salary.total.toLocaleString()}</p>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-red-100">
          <p className="text-sm text-gray-600">
            Last Appraisal: <span className="font-medium">{managerInfo.salary.lastAppraisal}</span>
          </p>
        </div>
      </div>

      {/* Appraisal Requests */}
      <div className="bg-white rounded-lg shadow-sm border border-red-200 p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
          <TrendingUp className="w-6 h-6 text-red-500 mr-2" />
          Appraisal Requests
        </h3>
        <div className="bg-red-50 rounded-lg p-4 mb-4">
          <p className="text-red-700 mb-2">
            <strong>Next Appraisal Due:</strong> December 2024
          </p>
          <p className="text-gray-600 text-sm">
            You can request an appraisal review based on your performance metrics and achievements.
          </p>
        </div>
        <button className="bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600 transition-colors font-medium">
          <TrendingUp className="w-5 h-5 inline mr-2" />
          Request Appraisal Review
        </button>
      </div>
    </div>
  )

  const tabs = [
    { id: "profile", label: "Manager Profile", icon: User },
    { id: "ongoing-projects", label: "Ongoing Projects", icon: Target },
    { id: "past-projects", label: "Past Projects", icon: CheckCircle },
    { id: "task-assignment", label: "Task Assignment", icon: Send },
    { id: "employee-response", label: "Employee Response", icon: MessageSquare },
    { id: "attendance", label: "Attendance Management", icon: Calendar },
    { id: "personal", label: "Personal Details", icon: Settings },
  ]

  return (
    <div className="min-h-screen bg-red-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-red-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Manager Dashboard</h1>
              <p className="text-red-600 text-lg">Welcome back, {managerInfo.name}</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Bell className="w-6 h-6 text-gray-600" />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {emailNotifications.length}
                </span>
              </div>
              <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="flex space-x-6">
          {/* Sidebar */}
          <div className="w-72 bg-white rounded-lg shadow-sm border border-red-200 p-4">
            <nav className="space-y-2">
              {tabs.map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors font-medium ${
                      activeTab === tab.id
                        ? "bg-red-500 text-white shadow-md"
                        : "text-gray-700 hover:bg-red-50 hover:text-red-700"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="text-sm">{tab.label}</span>
                  </button>
                )
              })}
            </nav>

            {/* Data to Admin Status */}
            <div className="mt-6 pt-6 border-t border-red-200">
              <h4 className="text-sm font-medium text-gray-900 mb-3">Data Sync Status</h4>
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Project Updates:</span>
                  <span className="text-green-600 font-medium">{adminData.projectUpdates.length} sent</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Employee Data:</span>
                  <span className="text-green-600 font-medium">{adminData.employeeResponses.length} sent</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Attendance:</span>
                  <span className="text-green-600 font-medium">{adminData.attendanceData.length} sent</span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {activeTab === "profile" && renderProfile()}
            {activeTab === "ongoing-projects" && renderOngoingProjects()}
            {activeTab === "past-projects" && renderPastProjects()}
            {activeTab === "task-assignment" && renderTaskAssignment()}
            {activeTab === "employee-response" && renderEmployeeResponse()}
            {activeTab === "attendance" && renderAttendance()}
            {activeTab === "personal" && renderPersonalDetails()}
          </div>
        </div>
      </div>

      {/* New Project Modal */}
      {showNewProject && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg">
            <h3 className="text-xl font-semibold mb-4">Add New Project</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Project Name</label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="Enter project name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                  rows={3}
                  placeholder="Enter project description"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                <select className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500">
                  <option value="high">High Priority</option>
                  <option value="medium">Medium Priority</option>
                  <option value="low">Low Priority</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Budget</label>
                <input
                  type="number"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="Enter budget amount"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowNewProject(false)}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowNewProject(false)}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
              >
                Add Project
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New Task Modal */}
      {showNewTask && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg">
            <h3 className="text-xl font-semibold mb-4">Assign New Task</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Task Title</label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="Enter task title"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                  rows={3}
                  placeholder="Enter task description"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                  <select className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500">
                    <option value="">Select Department</option>
                    <option value="Frontend">Frontend</option>
                    <option value="Backend">Backend</option>
                    <option value="DevOps">DevOps</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Team</label>
                  <select className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500">
                    <option value="">Select Team</option>
                    <option value="Development Team A">Development Team A</option>
                    <option value="Infrastructure Team">Infrastructure Team</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Assign to Member</label>
                <select className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500">
                  <option value="">Select Member</option>
                  {managerInfo.employees.map((employee) => (
                    <option key={employee.id} value={employee.name}>
                      {employee.name} - {employee.department}
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                  <select className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500">
                    <option value="high">High Priority</option>
                    <option value="medium">Medium Priority</option>
                    <option value="low">Low Priority</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Weightage (1-10)</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="5"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                  <input
                    type="date"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Due Time</label>
                  <input
                    type="time"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowNewTask(false)}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowNewTask(false)
                  // Here you would normally send email notification
                }}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 flex items-center space-x-2"
              >
                <Send className="w-4 h-4" />
                <span>Assign & Send Email</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ManagerDashboard
