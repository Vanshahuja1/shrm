"use client"

import { User, Calendar, CreditCard, DollarSign, FileText, Shield } from "lucide-react"
import { useState, useEffect } from "react"
import axios from "@/lib/axiosInstance"
import type { EmployeeInfo, AttendanceRecord } from "../../types/employees"

interface PersonalDashboardProps {
  employeeInfo: EmployeeInfo
  attendanceRecords: AttendanceRecord[]
}

export function PersonalDashboard({ employeeInfo, attendanceRecords }: PersonalDashboardProps) {
  const [showChangePassword, setShowChangePassword] = useState(false)
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [pwLoading, setPwLoading] = useState(false)
  const [pwMessage, setPwMessage] = useState<string | null>(null)
  const [pwError, setPwError] = useState<string | null>(null)

  // Pagination state
  const PAGE_SIZE = 5
  const [currentPage, setCurrentPage] = useState(1)

  const handlePasswordChange = async () => {
    setPwMessage(null)
    setPwError(null)

    if (!currentPassword || !newPassword) {
      setPwError("Please fill all fields")
      return
    }

    if (newPassword !== confirmPassword) {
      setPwError("New passwords do not match")
      return
    }

    try {
      setPwLoading(true)
      const res = await axios.patch("/auth/change-password", {
        currentPassword,
        newPassword,
      })

      if (res.data?.success) {
        setPwMessage("Password changed successfully. Please log in again if required.")
        setCurrentPassword("")
        setNewPassword("")
        setConfirmPassword("")
        setShowChangePassword(false)
      } else {
        setPwError(res.data?.message || "Failed to change password")
      }
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message
      setPwError(message || "Failed to change password")
    } finally {
      setPwLoading(false)
    }
  }

  // Last 30 days attendance (backend already sorted DESC)
  const last30Days = attendanceRecords.slice(0, 30)

  const presentDays = last30Days.filter(
    (record) => record.status === "present" || record.status === "late"
  ).length

  const attendancePercentage = last30Days.length
    ? Math.round((presentDays / last30Days.length) * 100)
    : 0

  const totalPages = Math.ceil(last30Days.length / PAGE_SIZE)

  const paginatedAttendance = last30Days.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  )

  // Reset page when data changes
  useEffect(() => {
    setCurrentPage(1)
  }, [attendanceRecords])

  return (
    <div className="space-y-6">
      {/* Basic Details */}
      <div className="bg-white rounded-lg shadow-sm border border-blue-200 p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
          <User className="w-6 h-6 text-blue-500 mr-2" />
          Basic Details
        </h3>

        <div className="flex items-center space-x-6 mb-6">
          <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
            <User className="w-12 h-12 text-white" />
          </div>
          <div>
            <h4 className="text-2xl font-bold text-gray-900">{employeeInfo.name}</h4>
            <p className="text-blue-600 font-medium text-lg">{employeeInfo.role}</p>
            <p className="text-sm text-gray-500">Employee ID: {employeeInfo.employeeId}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
            <p className="text-gray-900 font-medium">{employeeInfo.department}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Manager</label>
            <p className="text-gray-900 font-medium">{employeeInfo.manager}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <p className="text-gray-900 font-medium">{employeeInfo.email}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
            <p className="text-gray-900 font-medium">{employeeInfo.phone}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Join Date</label>
            <p className="text-gray-900 font-medium">{employeeInfo.joinDate}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
            <p className="text-gray-900 font-medium">
              {employeeInfo.personalInfo.dateOfBirth}
            </p>
          </div>
        </div>

        <div className="mt-6">
          <button
            onClick={() => setShowChangePassword((s) => !s)}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
          >
            {showChangePassword ? "Cancel" : "Change Password"}
          </button>
        </div>
      </div>

      {/* Last 30 Days Attendance */}
      <div className="bg-white rounded-lg shadow-sm border border-blue-200 p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
          <Calendar className="w-6 h-6 text-blue-500 mr-2" />
          Last 30 Days Attendance
        </h3>

        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <span className="text-2xl font-bold text-green-600">
                {attendancePercentage}%
              </span>
            </div>
            <p className="text-sm text-gray-600">Overall</p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <span className="text-2xl font-bold text-blue-600">{presentDays}</span>
            </div>
            <p className="text-sm text-gray-600">Present Days</p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <span className="text-2xl font-bold text-yellow-600">
                {last30Days.filter((r) => r.status === "late").length}
              </span>
            </div>
            <p className="text-sm text-gray-600">Late Days</p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <span className="text-2xl font-bold text-red-600">
                {last30Days.filter((r) => r.status === "absent").length}
              </span>
            </div>
            <p className="text-sm text-gray-600">Absent Days</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-blue-200">
                <th className="py-2 px-3 text-left">Date</th>
                <th className="py-2 px-3 text-left">Punch In</th>
                <th className="py-2 px-3 text-left">Punch Out</th>
                <th className="py-2 px-3 text-left">Hours</th>
                <th className="py-2 px-3 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {paginatedAttendance.map((record, index) => (
                <tr key={index} className="border-b border-gray-100">
                  <td className="py-2 px-3">{record.date}</td>
                  <td className="py-2 px-3">{record.punchIn || "-"}</td>
                  <td className="py-2 px-3">{record.punchOut || "-"}</td>
                  <td className="py-2 px-3">{record.totalHours}h</td>
                  <td className="py-2 px-3">
                    {record.status.toUpperCase()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination Controls */}
          <div className="flex items-center justify-between mt-4">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
            >
              Previous
            </button>

            <span className="text-sm text-gray-600">
              Page {currentPage} of {totalPages}
            </span>

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Bank Details, Salary, Identity Docs — unchanged */}
      {/* Bank Details & Salary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-blue-200 p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <CreditCard className="w-6 h-6 text-blue-500 mr-2" />
            Bank Details
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Account Number</label>
              <p className="text-gray-900 font-medium">{employeeInfo.bankDetails.accountNumber}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Bank Name</label>
              <p className="text-gray-900 font-medium">{employeeInfo.bankDetails.bankName}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">IFSC Code</label>
              <p className="text-gray-900 font-medium">{employeeInfo.bankDetails.ifsc}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Branch</label>
              <p className="text-gray-900 font-medium">{employeeInfo.bankDetails.branch}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-blue-200 p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <DollarSign className="w-6 h-6 text-blue-500 mr-2" />
            Salary Information
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-gray-600">Basic Salary:</span>
              <span className="font-medium">${employeeInfo.salary.basic.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Allowances:</span>
              <span className="font-medium">${employeeInfo.salary.allowances.toLocaleString()}</span>
            </div>
            <div className="flex justify-between border-t pt-2">
              <span className="text-gray-900 font-medium">Total Salary:</span>
              <span className="font-bold text-blue-600">${employeeInfo.salary.total.toLocaleString()}</span>
            </div>
            <div className="text-sm text-gray-600">Last Appraisal: {employeeInfo.salary.lastAppraisal}</div>
          </div>
        </div>
      </div>

      {/* Appraisal Requests */}
      {/* <div className="bg-white rounded-lg shadow-sm border border-blue-200 p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
          <TrendingUp className="w-6 h-6 text-blue-500 mr-2" />
          Appraisal Requests
        </h3>
        <div className="bg-blue-50 rounded-lg p-4 mb-4">
          <p className="text-blue-700 mb-2">
            <strong>Next Appraisal Due:</strong> December 2024
          </p>
          <p className="text-gray-600 text-sm">
            You can request an appraisal review based on your performance metrics and achievements.
          </p>
        </div>
        <button className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors font-medium">
          <TrendingUp className="w-5 h-5 inline mr-2" />
          Request Appraisal Review
        </button>
      </div> */}

      {/* Identity Documents */}
      <div className="bg-white rounded-lg shadow-sm border border-blue-200 p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
          <Shield className="w-6 h-6 text-blue-500 mr-2" />
          Identity Documents
        </h3>
        <div className="grid gap-4">
          {employeeInfo.personalInfo.identityDocuments.map((doc) => (
            <div key={doc.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center space-x-3">
                <FileText className="w-5 h-5 text-gray-500" />
                <div>
                  <h4 className="font-medium text-gray-900">{doc.type}</h4>
                  <p className="text-sm text-gray-600">{doc.number}</p>
                  <p className="text-xs text-gray-500">Uploaded: {doc.uploadDate}</p>
                </div>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  doc.status === "verified"
                    ? "bg-green-100 text-green-800"
                    : doc.status === "pending"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-red-100 text-red-800"
                }`}
              >
                {doc.status.toUpperCase()}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
