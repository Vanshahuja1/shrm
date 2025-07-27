"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  User,
  DollarSign,
  Briefcase,
  Calendar,
  CreditCard,
  Mail,
  Shield,
  Award,
  Building,
  Clock,
  FileText,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useRouter } from "next/navigation";
import axios from "@/lib/axiosInstance"
import EditModal from "./editModal";
interface EmployeeDetails {
  _id: string;
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  gender: string;
  address: string;
  dateOfBirth: string;
  performance: number;
  joiningDate: string;
  currentProjects: string[];
  pastProjects: string[];
  attendanceCount30Days: number;
  taskCountPerDay: number;
  tasks: any[];
  responses: any[];
  managers: string[];
  photo: string;
  upperManager: string;
  salary: number;
  adharCard: string;
  panCard: string;
  experience: string;
  projects: string[];
  organizationName: string;
  departmentName: string;
  designation: string;
  isActive: boolean;
  documents: any[];
  bankDetails: {
    accountHolder: string;
    accountNumber: string;
    ifsc: string;
    branch: string;
    accountType: string;
  };
  workLog: {
    hoursWorked: number;
  };
  employeeInfo: {
    id: string;
    email: string;
    phone: string;
    name: string;
    role: string;
    department: string;
    organization: string;
  };
  OrgMemberInfo: {
    id: string;
    name: string;
    role: string;
    department: string;
    salary: number;
    projects: string[];
    experience: string;
    contactInfo: {
      email: string;
      phone: string;
      address: string;
    };
    documents: {
      pan: string;
      aadhar: string;
    };
    joiningDate: string;
    performanceMetrics: {
      tasksPerDay: number;
      attendanceScore: number;
      managerReviewRating: number;
      combinedPercentage: number;
    };
    attendance: {
      last7Days: boolean[];
      todayPresent: boolean;
    };
  };
}

export default function EmployeeDetailsPage() {
  const [details, setDetails] = useState<EmployeeDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const params = useParams();
  const router = useRouter();

  const { hrId, id } = params;


  const handleEditSave = async (updatedData: EmployeeDetails) => {
    try {
      const response = await axios.put(`/user/${details?.id}`, updatedData);
      if (response.status === 200) {
        alert('Employee details updated successfully!');
        setIsEditModalOpen(false);
        // Refresh employee details
        const updatedDetails = await axios.get(`/user/${id}`);
        setDetails(updatedDetails.data.data);
      }
    } catch (error) {
      alert('Failed to update employee details. Please try again.');
      console.error('Error updating employee:', error);
    }
  }

  useEffect(() => {
    const fetchEmployeeDetails = async () => {
      try {
        const response = await axios.get(`/user/${id}`);
        const employee = response.data.data;
        setDetails(employee);

      } catch (error) {
        console.error("Failed to fetch employee details:", error);
        setDetails(null);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployeeDetails();
  }, [id]);

  const calculateYearsWithCompany = (joiningDate: string) => {
    const start = new Date(joiningDate);
    const now = new Date();
    const yearDiff = now.getFullYear() - start.getFullYear();
    const monthDiff = now.getMonth() - start.getMonth();
    const totalYears = yearDiff + monthDiff / 12;
    return totalYears.toFixed(1);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const formatSalary = (salary: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(salary);
  };

  const tabs = [
    { id: "overview", label: "Overview", icon: User },
    { id: "details", label: "Details", icon: FileText },
    { id: "projects", label: "Projects", icon: Building },
    { id: "payroll", label: "Payroll", icon: CreditCard },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
      </div>
    );
  }

  if (!details) {
    return (
      <div className="text-center p-6 text-gray-500">
        Employee details not found.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                className="flex items-center text-gray-600 cursor-pointer hover:text-red-600 transition"
                onClick={() => {
                  router.push(`/hr/${hrId}/employees`);
                }}
              >
                <ArrowLeft size={18} className="mr-2" />
                <span>Back to Employees</span>
              </button>
              <div className="h-6 w-px bg-gray-300"></div>
              <h1 className="text-xl font-semibold text-gray-800">
                Employee Details
              </h1>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setIsEditModalOpen(true)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 cursor-pointer">
                Edit
              </button>
              <button

                onClick={() => setIsDeleteDialogOpen(true)}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-500 cursor-pointer">
                Delete
              </button>

              <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Delete Employee</DialogTitle>
                    <DialogDescription>
                      Are you sure you want to delete this employee? This action cannot be undone.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={async () => {
                        try {
                          const response = await axios.delete(`/user/${details?.id}`);
                          if (response.status === 200) {
                            alert('Employee deleted successfully!');
                            router.push(`/hr/${hrId}/employees`);
                          }
                        } catch (error) {
                          alert('Failed to delete employee. Please try again.');
                          console.error('Error deleting employee:', error);
                        }
                      }}
                    >
                      Delete
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <EditModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                employee={details}
                onSave={handleEditSave}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Employee Header Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
          <div className="p-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-center space-x-6">
                <div className="relative">
                  <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center text-red-600 text-2xl font-bold">
                    {getInitials(details.name)}
                  </div>
                  <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-2 border-white ${details.isActive ? 'bg-green-500' : 'bg-gray-500'
                    }`}></div>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-1">
                    {details.name}
                  </h2>
                  <p className="text-gray-600 text-lg mb-2 capitalize">
                    {details.role}
                  </p>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span className="flex items-center">
                      <Building size={14} className="mr-1" />
                      {details.departmentName}
                    </span>
                    <span className="flex items-center">
                      <Calendar size={14} className="mr-1" />
                      Since {formatDate(details.joiningDate)}
                    </span>
                    <span className="flex items-center">
                      <Star size={14} className="mr-1" />
                      {details.id}
                    </span>
                  </div>
                </div>
              </div>
              <div className="mt-6 lg:mt-0 flex flex-col lg:items-end space-y-2">
                <div className="flex items-center space-x-2">
                  <span className={`px-3 py-1 text-sm rounded-full font-medium ${details.isActive
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-800'
                    }`}>
                    {details.isActive ? 'Active' : 'Inactive'}
                  </span>
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full font-medium capitalize">
                    {details.role}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-8">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === tab.id
                      ? "border-red-500 text-red-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                      }`}
                  >
                    <Icon size={16} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-8">
            {activeTab === "overview" && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-gray-50 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-gray-900">Quick Stats</h3>
                    <Clock size={16} className="text-gray-400" />
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Department</span>
                      <span className="text-sm font-medium text-gray-900">
                        {details.departmentName}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">
                        Years with company
                      </span>
                      <span className="text-sm font-medium text-gray-900">
                        {calculateYearsWithCompany(details.joiningDate)} years
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">
                        Performance Score
                      </span>
                      <span className="text-sm font-medium text-gray-900">
                        {details.performance}%
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-gray-900">
                      Contact Information
                    </h3>
                    <Mail size={16} className="text-blue-500" />
                  </div>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-600">Email</p>
                      <p className="text-sm font-medium text-gray-900">
                        {details.email}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Phone</p>
                      <p className="text-sm font-medium text-gray-900">
                        {details.phone}
                      </p>
                    </div>

                  </div>
                </div>

                <div className="bg-green-50 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-gray-900">
                      Current Projects
                    </h3>
                    <Award size={16} className="text-green-500" />
                  </div>
                  <div className="space-y-2">
                    {details.projects && details.projects.length > 0 ? (
                      details.projects.map((project, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span className="text-sm text-gray-900 capitalize">{project}</span>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-gray-500">No active projects</p>
                    )}
                  </div>
                </div>

                <div className="bg-yellow-50 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-gray-900">
                      Performance Metrics
                    </h3>
                    <Star size={16} className="text-yellow-500" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Tasks/Day</span>
                      <span className="text-sm font-medium text-gray-900">
                        {details.taskCountPerDay}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Attendance</span>
                      <span className="text-sm font-medium text-gray-900">
                        {details.attendanceCount30Days}%
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Experience</span>
                      <span className="text-sm font-medium text-gray-900">
                        {details.experience} years
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "details" && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                      <User size={16} className="mr-2 text-red-500" />
                      Personal Information
                    </h3>
                    <div className="space-y-4">
                      <div className="grid grid-cols-3 gap-4">
                        <div className="col-span-1">
                          <p className="text-sm font-medium text-gray-600">
                            Full Name
                          </p>
                        </div>
                        <div className="col-span-2">
                          <p className="text-sm text-gray-900">
                            {details.name}
                          </p>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                        <div className="col-span-1">
                          <p className="text-sm font-medium text-gray-600">
                            Email
                          </p>
                        </div>
                        <div className="col-span-2">
                          <p className="text-sm text-gray-900">
                            {details.email}
                          </p>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                        <div className="col-span-1">
                          <p className="text-sm font-medium text-gray-600">
                            Phone
                          </p>
                        </div>

                        <div className="col-span-2">
                          <p className="text-sm text-gray-900">
                            {details.phone}
                          </p>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                        <div className="col-span-1">
                          <p className="text-sm font-medium text-gray-600">
                            Date Of Birth
                          </p>
                        </div>

                        <div className="col-span-2">
                          <p className="text-sm text-gray-900">
                            {formatDate(details.dateOfBirth)}
                          </p>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                        <div className="col-span-1">
                          <p className="text-sm font-medium text-gray-600">
                            Gender
                          </p>
                        </div>

                        <div className="col-span-2">
                          <p className="text-sm text-gray-900">
                            {details.gender}
                          </p>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                        <div className="col-span-1">
                          <p className="text-sm font-medium text-gray-600">
                            Aadhar Number
                          </p>
                        </div>
                        <div className="col-span-2">
                          <p className="text-sm text-gray-900 font-mono">
                            {details.adharCard}
                          </p>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                        <div className="col-span-1">
                          <p className="text-sm font-medium text-gray-600">
                            PAN Number
                          </p>
                        </div>
                        <div className="col-span-2">
                          <p className="text-sm text-gray-900 font-mono">
                            {details.panCard}
                          </p>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                        <div className="col-span-1">
                          <p className="text-sm font-medium text-gray-600">
                            Address
                          </p>
                        </div>
                        <div className="col-span-2">
                          <p className="text-sm text-gray-900">
                            {details.address}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                      <Briefcase size={16} className="mr-2 text-red-500" />
                      Department Information
                    </h3>
                    <div className="space-y-4">
                      <div className="grid grid-cols-3 gap-4">
                        <div className="col-span-1">
                          <p className="text-sm font-medium text-gray-600">
                            Department
                          </p>
                        </div>
                        <div className="col-span-2">
                          <p className="text-sm text-gray-900">
                            {details.departmentName}
                          </p>
                        </div>
                      </div>
                       <div className="grid grid-cols-3 gap-4">
                        <div className="col-span-1">
                          <p className="text-sm font-medium text-gray-600">
                            Designation
                          </p>
                        </div>
                        <div className="col-span-2">
                          <p className="text-sm text-gray-900">
                            {details.designation}
                          </p>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                        <div className="col-span-1">
                          <p className="text-sm font-medium text-gray-600">
                            Role
                          </p>
                        </div>
                        <div className="col-span-2">
                          <p className="text-sm text-gray-900 capitalize">
                            {details.role}
                          </p>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                        <div className="col-span-1">
                          <p className="text-sm font-medium text-gray-600">
                            Organization
                          </p>
                        </div>
                        <div className="col-span-2">
                          <p className="text-sm text-gray-900">
                            {details.organizationName}
                          </p>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                        <div className="col-span-1">
                          <p className="text-sm font-medium text-gray-600">
                            Experience
                          </p>
                        </div>
                        <div className="col-span-2">
                          <p className="text-sm text-gray-900">
                            {details.experience} years
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                      <Calendar size={16} className="mr-2 text-red-500" />
                      Employment Details
                    </h3>
                    <div className="space-y-4">
                      <div className="grid grid-cols-3 gap-4">
                        <div className="col-span-1">
                          <p className="text-sm font-medium text-gray-600">
                            Joining Date
                          </p>
                        </div>
                        <div className="col-span-2">
                          <p className="text-sm text-gray-900">
                            {formatDate(details.joiningDate)}
                          </p>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                        <div className="col-span-1">
                          <p className="text-sm font-medium text-gray-600">
                            Employee ID
                          </p>
                        </div>
                        <div className="col-span-2">
                          <p className="text-sm text-gray-900 font-mono">
                            {details.id}
                          </p>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                        <div className="col-span-1">
                          <p className="text-sm font-medium text-gray-600">
                            Status
                          </p>
                        </div>
                        <div className="col-span-2">
                          <p className={`text-sm font-medium ${details.isActive ? 'text-green-600' : 'text-red-600'
                            }`}>
                            {details.isActive ? 'Active' : 'Inactive'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                      <DollarSign size={16} className="mr-2 text-red-500" />
                      Financial Information
                    </h3>
                    <div className="space-y-4">
                      <div className="grid grid-cols-3 gap-4">
                        <div className="col-span-1">
                          <p className="text-sm font-medium text-gray-600">
                            Salary
                          </p>
                        </div>
                        <div className="col-span-2">
                          <p className="text-sm text-gray-900 font-semibold">
                            {formatSalary(details.salary)}
                          </p>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                        <div className="col-span-1">
                          <p className="text-sm font-medium text-gray-600">
                            Account Holder
                          </p>
                        </div>
                        <div className="col-span-2">
                          <p className="text-sm text-gray-900">
                            {details.bankDetails.accountHolder || 'Not provided'}
                          </p>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                        <div className="col-span-1">
                          <p className="text-sm font-medium text-gray-600">
                            Account Type
                          </p>
                        </div>
                        <div className="col-span-2">
                          <p className="text-sm text-gray-900 capitalize">
                            {details.bankDetails.accountType.toLowerCase()}
                          </p>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                        <div className="col-span-1">
                          <p className="text-sm font-medium text-gray-600">
                            IFSC Code
                          </p>
                        </div>
                        <div className="col-span-2">
                          <p className="text-sm text-gray-900 font-mono">
                            {details.bankDetails.ifsc || 'Not provided'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "projects" && (
              <div className="max-w-4xl">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <div className="flex items-center">
                    <Building size={16} className="text-blue-600 mr-2" />
                    <p className="text-sm text-blue-800">
                      <strong>Project Information:</strong> Current and past project assignments for this employee.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Current Projects */}
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                      <Building size={16} className="mr-2 text-green-500" />
                      Current Projects
                    </h3>
                    <div className="space-y-3">
                      {details.projects && details.projects.length > 0 ? (
                        details.projects.map((project, index) => (
                          <div key={index} className="p-3 bg-white rounded border">
                            <div className="flex items-center justify-between">
                              <span className="font-medium text-gray-900 capitalize">{project}</span>
                              <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                                Active
                              </span>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-gray-500">No current projects assigned.</p>
                      )}
                    </div>
                  </div>

                  {/* Past Projects */}
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                      <Building size={16} className="mr-2 text-blue-500" />
                      Past Projects
                    </h3>
                    <div className="space-y-3">
                      {details.pastProjects && details.pastProjects.length > 0 ? (
                        details.pastProjects.map((project, index) => (
                          <div key={index} className="p-3 bg-white rounded border">
                            <div className="flex items-center justify-between">
                              <span className="font-medium text-gray-900 capitalize">{project}</span>
                              <span className="text-xs bg-gray-100 text-gray-800 px-2 py-0.5 rounded-full">
                                Completed
                              </span>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-gray-500">No past projects on record.</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Work Stats */}
                <div className="mt-8 bg-gray-50 rounded-lg p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Work Statistics</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white p-4 rounded border text-center">
                      <div className="text-2xl font-bold text-blue-600">{details.workLog.hoursWorked}</div>
                      <div className="text-sm text-gray-600">Hours Worked</div>
                    </div>
                    <div className="bg-white p-4 rounded border text-center">
                      <div className="text-2xl font-bold text-green-600">{details.taskCountPerDay}</div>
                      <div className="text-sm text-gray-600">Tasks Per Day</div>
                    </div>
                    <div className="bg-white p-4 rounded border text-center">
                      <div className="text-2xl font-bold text-purple-600">{details.performance}%</div>
                      <div className="text-sm text-gray-600">Performance Score</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "payroll" && (
              <div className="max-w-4xl">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                  <div className="flex items-center">
                    <Shield size={16} className="text-red-600 mr-2" />
                    <p className="text-sm text-red-800">
                      <strong>Confidential Information:</strong> This section
                      contains sensitive payroll data. Access is logged and
                      monitored.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                      <DollarSign size={16} className="mr-2 text-red-500" />
                      Salary Information
                    </h3>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center p-3 bg-white rounded border">
                        <span className="text-sm font-medium text-gray-600">
                          Monthly Salary
                        </span>
                        <span className="text-sm text-gray-900 font-bold">
                          {formatSalary(details.salary)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-white rounded border">
                        <span className="text-sm font-medium text-gray-600">
                          Annual Salary
                        </span>
                        <span className="text-sm text-gray-900 font-bold">
                          {formatSalary(details.salary * 12)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-white rounded border">
                        <span className="text-sm font-medium text-gray-600">
                          Payment Status
                        </span>
                        <span className="text-sm text-green-600 font-medium">
                          Current
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                      <CreditCard size={16} className="mr-2 text-red-500" />
                      Bank Details
                    </h3>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center p-3 bg-white rounded border">
                        <span className="text-sm font-medium text-gray-600">
                          Account Holder
                        </span>
                        <span className="text-sm text-gray-900">
                          {details.bankDetails.accountHolder || 'Not provided'}
                        </span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-white rounded border">
                        <span className="text-sm font-medium text-gray-600">
                          Account Type
                        </span>
                        <span className="text-sm text-gray-900 capitalize">
                          {details.bankDetails.accountType.toLowerCase()}
                        </span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-white rounded border">
                        <span className="text-sm font-medium text-gray-600">
                          Account Number
                        </span>
                        <span className="text-sm text-gray-900 font-mono">
                          {details.bankDetails.accountNumber
                            ? `${details.bankDetails.accountNumber}`
                            : 'Not provided'
                          }
                        </span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-white rounded border">
                        <span className="text-sm font-medium text-gray-600">
                          IFSC Code
                        </span>
                        <span className="text-sm text-gray-900 font-mono">
                          {details.bankDetails.ifsc || 'Not provided'}
                        </span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-white rounded border">
                        <span className="text-sm font-medium text-gray-600">
                          Branch
                        </span>
                        <span className="text-sm text-gray-900">
                          {details.bankDetails.branch || 'Not provided'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-8 bg-gray-50 rounded-lg p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">
                    Performance & Attendance
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white p-4 rounded border text-center">
                      <div className="text-2xl font-bold text-blue-600">{details.performance}%</div>
                      <div className="text-sm text-gray-600">Overall Performance</div>
                    </div>
                    <div className="bg-white p-4 rounded border text-center">
                      <div className="text-2xl font-bold text-green-600">{details.attendanceCount30Days}%</div>
                      <div className="text-sm text-gray-600">Attendance (30 days)</div>
                    </div>
                    <div className="bg-white p-4 rounded border text-center">
                      <div className="text-2xl font-bold text-purple-600">{details.taskCountPerDay}</div>
                      <div className="text-sm text-gray-600">Avg Tasks/Day</div>
                    </div>
                  </div>
                </div>

                {/* Mock Payroll History */}
                <div className="mt-8 bg-gray-50 rounded-lg p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">
                    Recent Payroll History
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left py-2 font-medium text-gray-600">
                            Pay Period
                          </th>
                          <th className="text-left py-2 font-medium text-gray-600">
                            Gross Pay
                          </th>
                          <th className="text-left py-2 font-medium text-gray-600">
                            Deductions
                          </th>
                          <th className="text-left py-2 font-medium text-gray-600">
                            Net Pay
                          </th>
                          <th className="text-left py-2 font-medium text-gray-600">
                            Status
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-gray-100">
                          <td className="py-3 text-gray-900">July 2025</td>
                          <td className="py-3 text-gray-900">{formatSalary(details.salary)}</td>
                          <td className="py-3 text-gray-900">{formatSalary(Math.round(details.salary * 0.22))}</td>
                          <td className="py-3 text-gray-900 font-semibold">
                            {formatSalary(Math.round(details.salary * 0.78))}
                          </td>
                          <td className="py-3">
                            <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                              Paid
                            </span>
                          </td>
                        </tr>
                        <tr className="border-b border-gray-100">
                          <td className="py-3 text-gray-900">June 2025</td>
                          <td className="py-3 text-gray-900">{formatSalary(details.salary)}</td>
                          <td className="py-3 text-gray-900">{formatSalary(Math.round(details.salary * 0.22))}</td>
                          <td className="py-3 text-gray-900 font-semibold">
                            {formatSalary(Math.round(details.salary * 0.78))}
                          </td>
                          <td className="py-3">
                            <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                              Paid
                            </span>
                          </td>
                        </tr>
                        <tr className="border-b border-gray-100">
                          <td className="py-3 text-gray-900">May 2025</td>
                          <td className="py-3 text-gray-900">{formatSalary(details.salary)}</td>
                          <td className="py-3 text-gray-900">{formatSalary(Math.round(details.salary * 0.22))}</td>
                          <td className="py-3 text-gray-900 font-semibold">
                            {formatSalary(Math.round(details.salary * 0.78))}
                          </td>
                          <td className="py-3">
                            <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                              Paid
                            </span>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}