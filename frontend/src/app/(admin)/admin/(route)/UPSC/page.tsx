"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  Building,
  BarChart3,
  Activity,
  Menu,
  X,
  Home,
  Mail,
  Settings,
  Bell,
  LogOut,
  GraduationCap,
  BookOpen,
  Target,
} from "lucide-react";
import Overview from "./Overview/page";
import SubDepartments from "./SubDepartments/page";
import OngoingBatches from "./OngoingBatches/page";
import OrganizationMembers from "./OrganizationMembers/page";
import OrganizationHierarchy from "./OrganizationHierarchy/page";
import CRUDOperations from "./CRUDOperations/page";
import DashboardCharts from "./DashboardCharts/page";
import TaskManagement from "./TaskManagement/page";
import EmailSystem from "./EmailSystem/page";
import { Faculty, Student, Batch, Department, Task } from "./types/index";

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
];

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
];

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
];

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
];

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
];

const monthlyData = [
  {
    month: "Jan",
    revenue: 1200000,
    students: 450,
    admissions: 45,
    growth: 8.5,
  },
  {
    month: "Feb",
    revenue: 1350000,
    students: 465,
    admissions: 52,
    growth: 12.5,
  },
  {
    month: "Mar",
    revenue: 1280000,
    students: 470,
    admissions: 48,
    growth: -5.2,
  },
  {
    month: "Apr",
    revenue: 1450000,
    students: 485,
    admissions: 58,
    growth: 13.3,
  },
  {
    month: "May",
    revenue: 1380000,
    students: 490,
    admissions: 55,
    growth: -4.8,
  },
  {
    month: "Jun",
    revenue: 1520000,
    students: 495,
    admissions: 62,
    growth: 10.1,
  },
];

const departmentColors = [
  "#DC2626",
  "#059669",
  "#7C3AED",
  "#EA580C",
  "#0891B2",
];

// Sidebar Navigation
const Sidebar = ({
  activeTab,
  setActiveTab,
  isSidebarOpen,
  setIsSidebarOpen,
}: {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean) => void;
}) => {
  const menuItems = [
    { id: "overview", label: "Dashboard", icon: Home },
    { id: "sub-departments", label: "Sub Departments", icon: Building },
    { id: "ongoing-batches", label: "Ongoing Batches", icon: BookOpen },
    { id: "organization-members", label: "Organization Members", icon: Users },
    {
      id: "organization-hierarchy",
      label: "Organization Hierarchy",
      icon: Activity,
    },
    { id: "crud-operations", label: "CRUD Operations", icon: Settings },
    { id: "dashboard-charts", label: "Dashboard Charts", icon: BarChart3 },
    { id: "task-management", label: "Task Management", icon: Target },
    { id: "email-system", label: "Email System", icon: Mail },
  ];

  return (
    <>
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
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
                  <h1 className="text-xl font-bold text-gray-900">
                    One Aim UPSC
                  </h1>
                  <p className="text-sm text-gray-500">Admin Dashboard</p>
                </div>
              </div>
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="lg:hidden text-gray-400 hover:text-gray-600"
              >
                <X size={24} />
              </button>
            </div>
          </div>

          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setIsSidebarOpen(false);
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
              );
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
  );
};

const TopHeader = ({ activeTab, setIsSidebarOpen }: { activeTab: string; setIsSidebarOpen: (open: boolean) => void }) => {
  const getPageTitle = (tab: string) => {
    const titles: Record<string, string> = {
      overview: "Dashboard Overview",
      "sub-departments": "Sub Departments",
      "ongoing-batches": "Ongoing Batches",
      "organization-members": "Organization Members",
      "organization-hierarchy": "Organization Hierarchy",
      "crud-operations": "CRUD Operations",
      "dashboard-charts": "Dashboard Charts",
      "task-management": "Task Management",
      "email-system": "Email System",
    };
    return titles[tab] || "Dashboard";
  };

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
            <h1 className="text-2xl font-bold text-gray-900">
              {getPageTitle(activeTab)}
            </h1>
            <p className="text-sm text-gray-500">
              Manage your UPSC coaching organization efficiently
            </p>
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
  );
};

// Main Dashboard Component
export default function UPSCAdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [departments, setDepartments] = useState(sampleDepartments);

  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return <Overview />;
      case "sub-departments":
        return <SubDepartments departments={departments} />;
      case "ongoing-batches":
        return <OngoingBatches batches={sampleBatches} />;
      case "organization-members":
        return (
          <OrganizationMembers
            faculties={sampleFaculties}
            students={sampleStudents}
          />
        );
      case "organization-hierarchy":
        return <OrganizationHierarchy departments={departments} />;
      case "crud-operations":
        return <CRUDOperations />;
      case "dashboard-charts":
        return <DashboardCharts monthlyData={monthlyData} />;
      case "task-management":
        return <TaskManagement tasks={sampleTasks} />;
      case "email-system":
        return <EmailSystem />;
      default:
        return <Overview />;
    }
  };

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
  );
}
