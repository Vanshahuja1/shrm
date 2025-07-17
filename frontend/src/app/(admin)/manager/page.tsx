"use client";
import type React from "react";
import { useState, useEffect } from "react";
import {
  User,
  Bell,
  Calendar,
  CheckCircle,
  Send,
  Settings,
  Target,
  MessageSquare,
} from "lucide-react";
import ManagerProfile from "./profile/page";
import OutgoingProjects from "./outgoingProjects/page";
import PastProjectsPage from "./pastProjects/page";
import TaskAssignmentsPage from "./taskAssignments/page";
import EmployeeResponsePage from "./empResponse/page";
import AttendanceManagementPage from "./attendanceManagement/page";
import PersonalDetailsPage from "./personalDetails/page";

type Employee = {
  id: number;
  name: string;
  department: string;
  position: string;
  email: string;
  phone: string;
  joinDate: string;
  performance: number;
  attendance: number;
  tasksPerDay: number;
  managerRating: number;
};

type Intern = {
  id: number;
  name: string;
  department: string;
  duration: string;
  mentor: string;
  performance: number;
  startDate: string;
  endDate: string;
};

type Project = {
  id: number;
  name: string;
  description: string;
  progress: number;
  employees: string[];
  startDate: string;
  endDate: string;
  status: "ongoing" | "completed" | "paused";
  priority: "high" | "medium" | "low";
  budget: number;
  actualCost: number;
};

type Task = {
  id: number;
  title: string;
  description: string;
  assignedTo: string;
  assignedBy: string;
  department: string;
  team: string;
  priority: "high" | "medium" | "low";
  weightage: number;
  dueDate: string;
  dueTime: string;
  status: "pending" | "in-progress" | "completed";
  responses: TaskResponse[];
  emailSent: boolean;
  createdAt: string;
};

type TaskResponse = {
  id: number;
  employee: string;
  response: string;
  timestamp: string;
  rating?: number;
  documents?: string[];
  format: "text" | "document";
};

type AttendanceRecord = {
  date: string;
  employee: string;
  punchIn: string;
  punchOut: string;
  status: "present" | "absent" | "late" | "half-day";
  regularized: boolean;
  regularizationReason?: string;
  totalHours: number;
};

type ManagerInfo = {
  id: string;
  name: string;
  department: string;
  email: string;
  phone: string;
  employees: Employee[];
  interns: Intern[];
  bankDetails: {
    accountNumber: string;
    bankName: string;
    ifsc: string;
    branch: string;
  };
  salary: {
    basic: number;
    allowances: number;
    total: number;
    lastAppraisal: string;
  };
  personalInfo: {
    address: string;
    emergencyContact: string;
    dateOfBirth: string;
    employeeId: string;
  };
};

type EmailNotification = {
  id: number;
  to: string;
  subject: string;
  message: string;
  type: "task_assignment" | "task_reminder" | "performance_review";
  sent: boolean;
  timestamp: string;
};

type ProjectUpdate = {
  projectId: number;
  projectName: string;
  oldProgress: number;
  newProgress: number;
  updatedBy: string;
  timestamp: string;
};

type EmployeeResponse = {
  taskId: number;
  taskTitle: string;
  employee: string;
  rating: number;
  ratedBy: string;
  timestamp: string;
};

type AttendanceData = {
  employee: string;
  date: string;
  action: string;
  reason: string;
  approvedBy: string;
  timestamp: string;
};

type AdminData = {
  projectUpdates: ProjectUpdate[];
  employeeResponses: EmployeeResponse[];
  attendanceData: AttendanceData[];
  performanceMetrics: unknown[];
};

const ManagerDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [isPunchedIn, setIsPunchedIn] = useState(false);
  const [punchTime, setPunchTime] = useState<string>("");
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

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
  });

  // Projects State
  const [ongoingProjects, setOngoingProjects] = useState<Project[]>([
    {
      id: 1,
      name: "E-commerce Platform Redesign",
      description:
        "Complete overhaul of the company's e-commerce platform with modern UI/UX",
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
  ]);

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
  ]);

  // Tasks State
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: 1,
      title: "Review Q2 Performance Reports",
      description:
        "Analyze and review quarterly performance metrics for all team members",
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
      description:
        "Review and update all security protocols for the development environment",
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
  ]);

  // Attendance State
  const [attendanceRecords, setAttendanceRecords] = useState<
    AttendanceRecord[]
  >([
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
  ]);

  // Email Notifications State
  const [emailNotifications, setEmailNotifications] = useState<
    EmailNotification[]
  >([
    {
      id: 1,
      to: "alice@company.com",
      subject: "New Task Assignment: Review Q2 Performance Reports",
      message:
        "You have been assigned a new high-priority task. Please check your dashboard for details.",
      type: "task_assignment",
      sent: true,
      timestamp: "2024-07-10 09:05 AM",
    },
    {
      id: 2,
      to: "carol@company.com",
      subject: "Task Reminder: Update Security Protocols",
      message:
        "Reminder: Your task 'Update Security Protocols' is due tomorrow.",
      type: "task_reminder",
      sent: true,
      timestamp: "2024-07-11 10:00 AM",
    },
  ]);

  // Admin Data State
  const [adminData, setAdminData] = useState<AdminData>({
    projectUpdates: [],
    employeeResponses: [],
    attendanceData: [],
    performanceMetrics: [],
  });

  

  // Handle project progress change and send to admin
  const handleProgressChange = (projectId: number, newProgress: number) => {
    setOngoingProjects(
      ongoingProjects.map((project) => {
        if (project.id === projectId) {
          const updatedProject = { ...project, progress: newProgress };
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
          }));
          return updatedProject;
        }
        return project;
      })
    );
  };

  

  // Send email notification
  const sendEmailNotification = (task: Task) => {
    const newNotification: EmailNotification = {
      id: emailNotifications.length + 1,
      to:
        managerInfo.employees.find((emp) => emp.name === task.assignedTo)
          ?.email || "",
      subject: `New Task Assignment: ${task.title}`,
      message: `You have been assigned a new ${task.priority}-priority task. Due: ${task.dueDate} at ${task.dueTime}`,
      type: "task_assignment",
      sent: true,
      timestamp: new Date().toLocaleString(),
    };
    setEmailNotifications([...emailNotifications, newNotification]);
  };


  // Handle attendance regularization
  const handleRegularization = (record: AttendanceRecord, reason: string) => {
    setAttendanceRecords(
      attendanceRecords.map((r) =>
        r.date === record.date && r.employee === record.employee
          ? { ...r, regularized: true, regularizationReason: reason }
          : r
      )
    );
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
    }));
  };

  const renderProfile = () => <ManagerProfile managerInfo={managerInfo} />;

  const renderOngoingProjects = () => (
    <OutgoingProjects managerName={managerInfo.name} />
  );

  const renderPastProjects = () => (
    <PastProjectsPage pastProjects={pastProjects} />
  );

  const renderTaskAssignment = () => (
    <TaskAssignmentsPage
      managerInfo={managerInfo}
      setAdminData={setAdminData}
    />
  );

  const renderEmployeeResponse = () => (
    <EmployeeResponsePage managerInfo={managerInfo} tasks={tasks} />
  );

  const renderAttendance = () => (
    <AttendanceManagementPage handleRegularization={handleRegularization} />
  );

  const renderPersonalDetails = () => (
    <PersonalDetailsPage managerInfo={managerInfo} />
  );

  const tabs = [
    { id: "profile", label: "Manager Profile", icon: User },
    { id: "ongoing-projects", label: "Ongoing Projects", icon: Target },
    { id: "past-projects", label: "Past Projects", icon: CheckCircle },
    { id: "task-assignment", label: "Task Assignment", icon: Send },
    {
      id: "employee-response",
      label: "Employee Response",
      icon: MessageSquare,
    },
    { id: "attendance", label: "Attendance Management", icon: Calendar },
    { id: "personal", label: "Personal Details", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-red-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-red-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Manager Dashboard
              </h1>
              <p className="text-red-600 text-lg">
                Welcome back, {managerInfo.name}
              </p>
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
                const Icon = tab.icon;
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
                );
              })}
            </nav>

            {/* Data to Admin Status */}
            <div className="mt-6 pt-6 border-t border-red-200">
              <h4 className="text-sm font-medium text-gray-900 mb-3">
                Data Sync Status
              </h4>
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Project Updates:</span>
                  <span className="text-green-600 font-medium">
                    {adminData.projectUpdates.length} sent
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Employee Data:</span>
                  <span className="text-green-600 font-medium">
                    {adminData.employeeResponses.length} sent
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Attendance:</span>
                  <span className="text-green-600 font-medium">
                    {adminData.attendanceData.length} sent
                  </span>
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

    
    </div>
  );
};

export default ManagerDashboard;
