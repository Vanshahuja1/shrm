"use client";

import { useEffect, useState } from "react";
import {
  ArrowLeft,
  User,
  DollarSign,
  Briefcase,
  Calendar,
  CreditCard,
  Mail,
  Phone,
  Shield,
  Award,
  Building,
  Clock,
  FileText,
  Star,
} from "lucide-react";
import { useRouter } from "next/navigation";
interface EmployeeDetails {
  personalInfo: {
    name: string;
    email: string;
    phone: string;
  };
  financialInfo: {
    salary: string;
    bankAccount: string;
  };
  departmentInfo: {
    department: string;
    designation: string;
    performanceRating: number;
  };
  joiningDetails: {
    joiningDate: string;
    employeeId: string;
  };
  payrollInfo: {
    taxCode: string;
    benefits: string;
  };
}

export default function EmployeeDetailsPage() {
  const [details, setDetails] = useState<EmployeeDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  const router = useRouter();

  useEffect(() => {
    const fetchEmployeeDetails = async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 800));

        setDetails({
          personalInfo: {
            name: "John Doe",
            email: "john.doe@company.com",
            phone: "1234567890",
          },
          financialInfo: {
            salary: "$4000",
            bankAccount: "9876543210",
          },
          departmentInfo: {
            department: "Engineering",
            designation: "Software Engineer",

            performanceRating: 4.8,
          },
          joiningDetails: {
            joiningDate: "2021-06-01",
            employeeId: "EMP999",
          },
          payrollInfo: {
            taxCode: "TX456",
            benefits: "Health Insurance, Paid Leave",
          },
        });
      } catch (error) {
        console.error("Failed to fetch employee details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployeeDetails();
  }, []);

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

  const benefitsList =
    details?.payrollInfo.benefits.split(",").map((b) => b.trim()) || [];

  const tabs = [
    { id: "overview", label: "Overview", icon: User },
    { id: "details", label: "Details", icon: FileText },
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
                  router.push("/hr/employees");
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
              <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200">
                Edit
              </button>
              <button className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700">
                Actions
              </button>
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
                    {getInitials(details.personalInfo.name)}
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white"></div>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-1">
                    {details.personalInfo.name}
                  </h2>
                  <p className="text-gray-600 text-lg mb-2">
                    {details.departmentInfo.designation}
                  </p>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span className="flex items-center">
                      <Building size={14} className="mr-1" />
                      {details.departmentInfo.department}
                    </span>
                    <span className="flex items-center">
                      <Calendar size={14} className="mr-1" />
                      Since {formatDate(details.joiningDetails.joiningDate)}
                    </span>
                    <span className="flex items-center">
                      <Star size={14} className="mr-1" />
                      {details.joiningDetails.employeeId}
                    </span>
                  </div>
                </div>
              </div>
              <div className="mt-6 lg:mt-0 flex flex-col lg:items-end space-y-2">
                <div className="flex items-center space-x-2">
                  <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full font-medium">
                    Active
                  </span>
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full font-medium">
                    Full-time
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
                    className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === tab.id
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
                        {details.departmentInfo.department}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">
                        Years with company
                      </span>
                      <span className="text-sm font-medium text-gray-900">
                        {calculateYearsWithCompany(
                          details.joiningDetails.joiningDate
                        )}{" "}
                        years
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">
                        Performance rating
                      </span>
                      <span className="text-sm font-medium text-gray-900">
                        {details.departmentInfo.performanceRating}/5.0
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
                        {details.personalInfo.email}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Phone</p>
                      <p className="text-sm font-medium text-gray-900">
                        {details.personalInfo.phone}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-green-50 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-gray-900">
                      Current Benefits
                    </h3>
                    <Award size={16} className="text-green-500" />
                  </div>
                  <div className="space-y-2">
                    {benefitsList.map((benefit, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-sm text-gray-900">{benefit}</span>
                      </div>
                    ))}
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
                            {details.personalInfo.name}
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
                            {details.personalInfo.email}
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
                            {details.personalInfo.phone}
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
                            {details.departmentInfo.department}
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
                            {details.departmentInfo.designation}
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
                            {formatDate(details.joiningDetails.joiningDate)}
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
                            {details.joiningDetails.employeeId}
                          </p>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                        <div className="col-span-1">
                          <p className="text-sm font-medium text-gray-600">
                            Employment Type
                          </p>
                        </div>
                        <div className="col-span-2">
                          <p className="text-sm text-gray-900">Full-time</p>
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
                            {details.financialInfo.salary}
                          </p>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                        <div className="col-span-1">
                          <p className="text-sm font-medium text-gray-600">
                            Bank Account
                          </p>
                        </div>
                        <div className="col-span-2">
                          <p className="text-sm text-gray-900 font-mono">
                            ••••{details.financialInfo.bankAccount.slice(-4)}
                          </p>
                        </div>
                      </div>
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
                      <CreditCard size={16} className="mr-2 text-red-500" />
                      Tax Information
                    </h3>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center p-3 bg-white rounded border">
                        <span className="text-sm font-medium text-gray-600">
                          Tax Code
                        </span>
                        <span className="text-sm text-gray-900 font-mono">
                          {details.payrollInfo.taxCode}
                        </span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-white rounded border">
                        <span className="text-sm font-medium text-gray-600">
                          Tax Status
                        </span>
                        <span className="text-sm text-gray-900">Single</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-white rounded border">
                        <span className="text-sm font-medium text-gray-600">
                          Withholding Rate
                        </span>
                        <span className="text-sm text-gray-900">22%</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                      <Award size={16} className="mr-2 text-red-500" />
                      Benefits Package
                    </h3>
                    <div className="space-y-3">
                      {benefitsList.map((benefit, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 bg-white rounded border"
                        >
                          <div className="flex items-center space-x-3">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <span className="text-sm text-gray-900">
                              {benefit}
                            </span>
                          </div>
                          <span className="text-xs text-gray-500 px-2 py-1 bg-gray-100 rounded">
                            Active
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

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
                          <td className="py-3 text-gray-900">Dec 1-15, 2024</td>
                          <td className="py-3 text-gray-900">$2,000</td>
                          <td className="py-3 text-gray-900">$440</td>
                          <td className="py-3 text-gray-900 font-semibold">
                            $1,560
                          </td>
                          <td className="py-3">
                            <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                              Paid
                            </span>
                          </td>
                        </tr>
                        <tr className="border-b border-gray-100">
                          <td className="py-3 text-gray-900">
                            Nov 16-30, 2024
                          </td>
                          <td className="py-3 text-gray-900">$2,000</td>
                          <td className="py-3 text-gray-900">$440</td>
                          <td className="py-3 text-gray-900 font-semibold">
                            $1,560
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
