"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  User,
  Save,
  DollarSign,
  Briefcase,
  Calendar,
  CreditCard,
  Check,
  ClipboardList,
} from "lucide-react";
import Link from "next/link";

interface EmployeeFormData {
  personalInfo: {
    name: string;
    email: string;
    phone: string;
    dob: string;
    gender: string;
    aadhar: string;
    pan: string;
    address: string;
    emergencyContact: string;
  };

  financialInfo: {
    salary: string;
    bankInfo: {
      accountHolderName: string;
      accountType: string;
      accountNumber: string;
      bankName: string;
      ifscCode: string;
      branch: string;
    };
  };
  departmentInfo: {
    department: string;
    designation: string;
    managerName: string;
  };
  joiningDetails: {
    joiningDate: string;
    employeeId: string;
  };
  taskInfo: {
    taskName: string;
    assignedOn: string;
    assignedBy: string;
  };
  payrollInfo: {
    taxCode: string;
    benefits: string;
  };
}

type TabType =
  | "personal"
  | "financial"
  | "department"
  | "joining"
  | "task"
  | "payroll"
  | "review";

export default function AddEmployeePage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>("personal");

  const [formData, setFormData] = useState<EmployeeFormData>({
    personalInfo: {
      name: "",
      email: "",
      phone: "",
      dob: "",
      gender: "",
      aadhar: "",
      pan: "",
      address: "",
      emergencyContact: "",
    },
    financialInfo: {
      salary: "",
      bankInfo: {
        accountHolderName: "",
        accountType: "",
        accountNumber: "",
        bankName: "",
        ifscCode: "",
        branch: "",
      },
    },
    departmentInfo: {
      department: "",
      designation: "",
      managerName: "",
    },
    joiningDetails: {
      joiningDate: "",
      employeeId: "",
    },
    taskInfo: {
      taskName: "",
      assignedOn: "",
      assignedBy: "",
    },
    payrollInfo: {
      taxCode: "",
      benefits: "",
    },
  });

  const handleChange = (
    section: keyof EmployeeFormData,
    field: string,
    value: string
  ) => {
    setFormData({
      ...formData,
      [section]: {
        ...formData[section],
        [field]: value,
      },
    });
  };

  const handleBankInfoChange = (field: string, value: string) => {
    setFormData({
      ...formData,
      financialInfo: {
        ...formData.financialInfo,
        bankInfo: {
          ...formData.financialInfo.bankInfo,
          [field]: value,
        },
      },
    });
  };

  const nextTab = () => {
    switch (activeTab) {
      case "personal":
        setActiveTab("financial");
        break;
      case "financial":
        setActiveTab("department");
        break;
      case "department":
        setActiveTab("joining");
        break;
      case "joining":
        setActiveTab("task");
        break;
      case "task":
        setActiveTab("payroll");
        break;
      case "payroll":
        setActiveTab("review");
        break;
      default:
        break;
    }
  };

  const prevTab = () => {
    switch (activeTab) {
      case "financial":
        setActiveTab("personal");
        break;
      case "department":
        setActiveTab("financial");
        break;
      case "joining":
        setActiveTab("department");
        break;
      case "task":
        setActiveTab("joining");
        break;
      case "payroll":
        setActiveTab("task");
        break;
      case "review":
        setActiveTab("payroll");
        break;
      default:
        break;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Save to localStorage for demo/mock purposes
      const emps = JSON.parse(localStorage.getItem("employeeList") || "[]");
      const newEmp = {
        id: Date.now(),
        name: formData.personalInfo.name,
        employeeId: formData.joiningDetails.employeeId,
        email: formData.personalInfo.email,
        phone: formData.personalInfo.phone,
        designation: formData.departmentInfo.designation,
        department: formData.departmentInfo.department,
        joinedDate: formData.joiningDetails.joiningDate,
        status: "Active",
        // Store the full formData for detailed view
        _details: formData,
      };
      localStorage.setItem("employeeList", JSON.stringify([newEmp, ...emps]));

      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      router.push("/hr/employees/records");
    } catch (error) {
      console.error("Failed to add employee:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const tabIcons = {
    personal: <User size={18} />,
    financial: <DollarSign size={18} />,
    department: <Briefcase size={18} />,
    joining: <Calendar size={18} />,
    task: <ClipboardList size={18} />,
    payroll: <CreditCard size={18} />,
    review: <Check size={18} />,
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "personal":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4 md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <input
                type="text"
                required
                value={formData.personalInfo.name}
                onChange={(e) =>
                  handleChange("personalInfo", "name", e.target.value)
                }
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                placeholder="Enter full name"
              />
            </div>
            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                required
                value={formData.personalInfo.email}
                onChange={(e) =>
                  handleChange("personalInfo", "email", e.target.value)
                }
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                placeholder="Enter email address"
              />
            </div>
            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700">
                Phone
              </label>
              <input
                type="tel"
                required
                value={formData.personalInfo.phone}
                onChange={(e) =>
                  handleChange("personalInfo", "phone", e.target.value)
                }
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                placeholder="Enter phone number"
              />
            </div>
            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700">
                Date of Birth
              </label>
              <input
                type="date"
                required
                value={formData.personalInfo.dob}
                onChange={(e) =>
                  handleChange("personalInfo", "dob", e.target.value)
                }
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
              />
            </div>
            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700">
                Gender
              </label>
              <select
                required
                value={formData.personalInfo.gender}
                onChange={(e) =>
                  handleChange("personalInfo", "gender", e.target.value)
                }
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700">
                Aadhar Number
              </label>
              <input
                type="text"
                required
                value={formData.personalInfo.aadhar}
                onChange={(e) =>
                  handleChange("personalInfo", "aadhar", e.target.value)
                }
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                placeholder="Enter Aadhar number"
              />
            </div>
            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700">
                PAN Number
              </label>
              <input
                type="text"
                required
                value={formData.personalInfo.pan}
                onChange={(e) =>
                  handleChange("personalInfo", "pan", e.target.value)
                }
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                placeholder="Enter PAN number"
              />
            </div>
            <div className="space-y-4 md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">
                Address
              </label>
              <textarea
                required
                value={formData.personalInfo.address}
                onChange={(e) =>
                  handleChange("personalInfo", "address", e.target.value)
                }
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors resize-none"
                rows={3}
                placeholder="Enter full address"
              />
            </div>
            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700">
                Emergency Contact
              </label>
              <input
                type="tel"
                required
                value={formData.personalInfo.emergencyContact}
                onChange={(e) =>
                  handleChange("personalInfo", "emergencyContact", e.target.value)
                }
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                placeholder="Enter emergency contact number"
              />
            </div>
          </div>
        );

      case "financial":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4 md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">
                Salary
              </label>
              <input
                type="text"
                required
                value={formData.financialInfo.salary}
                onChange={(e) =>
                  handleChange("financialInfo", "salary", e.target.value)
                }
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                placeholder="Enter salary amount"
              />
            </div>
            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700">
                Account Holder Name
              </label>
              <input
                type="text"
                required
                value={formData.financialInfo.bankInfo.accountHolderName}
                onChange={(e) =>
                  handleBankInfoChange("accountHolderName", e.target.value)
                }
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                placeholder="Enter account holder name"
              />
            </div>
            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700">
                Account Type
              </label>
              <select
                required
                value={formData.financialInfo.bankInfo.accountType}
                onChange={(e) =>
                  handleBankInfoChange("accountType", e.target.value)
                }
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
              >
                <option value="">Select Account Type</option>
                <option value="Savings">Savings</option>
                <option value="Current">Current</option>
                <option value="Salary">Salary</option>
              </select>
            </div>
            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700">
                Account Number
              </label>
              <input
                type="text"
                required
                value={formData.financialInfo.bankInfo.accountNumber}
                onChange={(e) =>
                  handleBankInfoChange("accountNumber", e.target.value)
                }
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                placeholder="Enter account number"
              />
            </div>
            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700">
                Bank Name
              </label>
              <input
                type="text"
                required
                value={formData.financialInfo.bankInfo.bankName}
                onChange={(e) =>
                  handleBankInfoChange("bankName", e.target.value)
                }
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                placeholder="Enter bank name"
              />
            </div>
            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700">
                IFSC Code
              </label>
              <input
                type="text"
                required
                value={formData.financialInfo.bankInfo.ifscCode}
                onChange={(e) =>
                  handleBankInfoChange("ifscCode", e.target.value)
                }
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                placeholder="Enter IFSC code"
              />
            </div>
            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700">
                Branch
              </label>
              <input
                type="text"
                required
                value={formData.financialInfo.bankInfo.branch}
                onChange={(e) =>
                  handleBankInfoChange("branch", e.target.value)
                }
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                placeholder="Enter branch name"
              />
            </div>
          </div>
        );

      case "department":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700">
                Department
              </label>
              <select
                required
                value={formData.departmentInfo.department}
                onChange={(e) =>
                  handleChange("departmentInfo", "department", e.target.value)
                }
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
              >
                <option value="">Select Department</option>
                <option value="Engineering">Engineering</option>
                <option value="HR">HR</option>
                <option value="Finance">Finance</option>
                <option value="Marketing">Marketing</option>
                <option value="Sales">Sales</option>
              </select>
            </div>
            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700">
                Designation
              </label>
              <input
                type="text"
                required
                value={formData.departmentInfo.designation}
                onChange={(e) =>
                  handleChange("departmentInfo", "designation", e.target.value)
                }
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                placeholder="Enter designation"
              />
            </div>
            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700">
                Manager Name
              </label>
              <input
                type="text"
                required
                value={formData.departmentInfo.managerName}
                onChange={(e) =>
                  handleChange("departmentInfo", "managerName", e.target.value)
                }
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                placeholder="Enter manager name"
              />
            </div>
          </div>
        );

      case "joining":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700">
                Joining Date
              </label>
              <input
                type="date"
                required
                value={formData.joiningDetails.joiningDate}
                onChange={(e) =>
                  handleChange("joiningDetails", "joiningDate", e.target.value)
                }
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
              />
            </div>
            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700">
                Employee ID
              </label>
              <input
                type="text"
                required
                value={formData.joiningDetails.employeeId}
                onChange={(e) =>
                  handleChange("joiningDetails", "employeeId", e.target.value)
                }
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                placeholder="Enter employee ID"
              />
            </div>
          </div>
        );

      case "task":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4 md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">
                Task Name
              </label>
              <input
                type="text"
                required
                value={formData.taskInfo.taskName}
                onChange={(e) =>
                  handleChange("taskInfo", "taskName", e.target.value)
                }
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                placeholder="Enter task name"
              />
            </div>
            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700">
                Assigned On
              </label>
              <input
                type="date"
                required
                value={formData.taskInfo.assignedOn}
                onChange={(e) =>
                  handleChange("taskInfo", "assignedOn", e.target.value)
                }
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
              />
            </div>
            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700">
                Assigned By
              </label>
              <input
                type="text"
                required
                value={formData.taskInfo.assignedBy}
                onChange={(e) =>
                  handleChange("taskInfo", "assignedBy", e.target.value)
                }
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                placeholder="Enter who assigned the task"
              />
            </div>
          </div>
        );

      case "payroll":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700">
                Tax Code
              </label>
              <input
                type="text"
                required
                value={formData.payrollInfo.taxCode}
                onChange={(e) =>
                  handleChange("payrollInfo", "taxCode", e.target.value)
                }
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                placeholder="Enter tax code"
              />
            </div>
            <div className="space-y-4 md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">
                Benefits
              </label>
              <textarea
                required
                value={formData.payrollInfo.benefits}
                onChange={(e) =>
                  handleChange("payrollInfo", "benefits", e.target.value)
                }
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors resize-none"
                rows={3}
                placeholder="Enter employee benefits (e.g., Health Insurance, Paid Leave, etc.)"
              ></textarea>
            </div>
          </div>
        );

      case "review":
        return (
          <div className="space-y-8">
            <section className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Personal Information
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm font-medium text-gray-500">Full Name</p>
                  <p className="mt-1 text-base">
                    {formData.personalInfo.name || "Not provided"}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Email</p>
                  <p className="mt-1 text-base">
                    {formData.personalInfo.email || "Not provided"}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Phone</p>
                  <p className="mt-1 text-base">
                    {formData.personalInfo.phone || "Not provided"}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Date of Birth</p>
                  <p className="mt-1 text-base">
                    {formData.personalInfo.dob || "Not provided"}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Gender</p>
                  <p className="mt-1 text-base">
                    {formData.personalInfo.gender || "Not provided"}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Aadhar Number</p>
                  <p className="mt-1 text-base">
                    {formData.personalInfo.aadhar || "Not provided"}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">PAN Number</p>
                  <p className="mt-1 text-base">
                    {formData.personalInfo.pan || "Not provided"}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Emergency Contact</p>
                  <p className="mt-1 text-base">
                    {formData.personalInfo.emergencyContact || "Not provided"}
                  </p>
                </div>
                <div className="sm:col-span-2">
                  <p className="text-sm font-medium text-gray-500">Address</p>
                  <p className="mt-1 text-base whitespace-pre-wrap">
                    {formData.personalInfo.address || "Not provided"}
                  </p>
                </div>
              </div>
            </section>

            <section className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Financial Information
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm font-medium text-gray-500">Salary</p>
                  <p className="mt-1 text-base">
                    {formData.financialInfo.salary || "Not provided"}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Account Holder Name
                  </p>
                  <p className="mt-1 text-base">
                    {formData.financialInfo.bankInfo.accountHolderName || "Not provided"}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Account Type
                  </p>
                  <p className="mt-1 text-base">
                    {formData.financialInfo.bankInfo.accountType || "Not provided"}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Account Number
                  </p>
                  <p className="mt-1 text-base">
                    {formData.financialInfo.bankInfo.accountNumber
                      ? "••••" + formData.financialInfo.bankInfo.accountNumber.slice(-4)
                      : "Not provided"}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Bank Name</p>
                  <p className="mt-1 text-base">
                    {formData.financialInfo.bankInfo.bankName || "Not provided"}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">IFSC Code</p>
                  <p className="mt-1 text-base">
                    {formData.financialInfo.bankInfo.ifscCode || "Not provided"}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Branch</p>
                  <p className="mt-1 text-base">
                    {formData.financialInfo.bankInfo.branch || "Not provided"}
                  </p>
                </div>
              </div>
            </section>

            <section className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Department Information
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Department
                  </p>
                  <p className="mt-1 text-base">
                    {formData.departmentInfo.department || "Not provided"}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Designation
                  </p>
                  <p className="mt-1 text-base">
                    {formData.departmentInfo.designation || "Not provided"}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Manager Name
                  </p>
                  <p className="mt-1 text-base">
                    {formData.departmentInfo.managerName || "Not provided"}
                  </p>
                </div>
              </div>
            </section>

            <section className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Joining Details
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Joining Date
                  </p>
                  <p className="mt-1 text-base">
                    {formData.joiningDetails.joiningDate || "Not provided"}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Employee ID
                  </p>
                  <p className="mt-1 text-base">
                    {formData.joiningDetails.employeeId || "Not provided"}
                  </p>
                </div>
              </div>
            </section>

            <section className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Task Information
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="sm:col-span-2">
                  <p className="text-sm font-medium text-gray-500">
                    Task Name
                  </p>
                  <p className="mt-1 text-base">
                    {formData.taskInfo.taskName || "Not provided"}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Assigned On
                  </p>
                  <p className="mt-1 text-base">
                    {formData.taskInfo.assignedOn || "Not provided"}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Assigned By
                  </p>
                  <p className="mt-1 text-base">
                    {formData.taskInfo.assignedBy || "Not provided"}
                  </p>
                </div>
              </div>
            </section>

            <section className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Payroll Information
              </h3>
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <p className="text-sm font-medium text-gray-500">Tax Code</p>
                  <p className="mt-1 text-base">
                    {formData.payrollInfo.taxCode || "Not provided"}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Benefits</p>
                  <p className="mt-1 text-base whitespace-pre-wrap">
                    {formData.payrollInfo.benefits || "Not provided"}
                  </p>
                </div>
              </div>
            </section>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="bg-white border rounded-2xl shadow-sm max-w-4xl mx-auto overflow-hidden">
        {/* Header with back button */}
        <div className="border-b px-6 py-4 flex items-center justify-between bg-white sticky top-0 z-10">
          <div className="flex items-center space-x-4">
            <Link
              href="/hr/employees/records"
              className="flex items-center text-gray-600 hover:text-red-600 transition"
            >
              <ArrowLeft size={18} className="mr-1" />
              <span>Back</span>
            </Link>
            <div className="h-4 w-px bg-gray-300"></div>
            <h2 className="text-xl font-semibold text-gray-800">
              Add New Employee
            </h2>
          </div>
          {activeTab === "review" && (
            <button
              type="submit"
              form="employee-form"
              disabled={isSubmitting}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md flex items-center disabled:bg-gray-400 transition-colors"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white mr-2"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save size={16} className="mr-2" />
                  Save Employee
                </>
              )}
            </button>
          )}
        </div>

        {/* Tab Navigation */}
        <div className="border-b">
          <div className="flex overflow-x-auto">
            {(
              [
                "personal",
                "financial",
                "department",
                "joining",
                "task",
                "payroll",
                "review",
              ] as TabType[]
            ).map((tab, index) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 min-w-[120px] px-6 py-4 flex items-center justify-center whitespace-nowrap text-sm font-medium transition-colors relative
                  ${
                    activeTab === tab
                      ? "text-red-600 bg-red-50"
                      : "text-gray-600 hover:text-red-500 hover:bg-gray-50"
                  }`}
              >
                <span className="mr-2">{tabIcons[tab]}</span>
                <span className="capitalize">
                  {tab === "review" ? "Review" : tab}
                </span>
                {activeTab === tab && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-600"></div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Form */}
        <form
          id="employee-form"
          onSubmit={handleSubmit}
          className="flex-1 flex flex-col"
        >
          <div className="p-6 space-y-6 flex-1 overflow-auto">
            <div className="bg-white rounded-lg">{renderTabContent()}</div>
          </div>

          {/* Sticky Navigation Buttons */}
          <div className="border-t bg-white px-6 py-4 sticky bottom-0 flex justify-between items-center shadow-[0_-1px_2px_rgba(0,0,0,0.05)]">
            <button
              type="button"
              onClick={prevTab}
              className={`px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors ${
                activeTab === "personal" ? "invisible" : ""
              }`}
            >
              Previous
            </button>
            {activeTab !== "review" && (
              <button
                type="button"
                onClick={nextTab}
                className="ml-auto px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              >
                Next
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
