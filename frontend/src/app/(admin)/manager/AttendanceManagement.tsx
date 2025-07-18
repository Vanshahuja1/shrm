"use client"

import { Clock, Edit, CheckCircle, LogIn, LogOut } from "lucide-react"
import { useState, useEffect } from "react"
import type { AttendanceRecord } from "./types"

interface AttendanceManagementProps {
  attendanceRecords: AttendanceRecord[]
  onAttendanceEdit: (record: AttendanceRecord) => void
  onRegularization: (record: AttendanceRecord, reason: string) => void
}

export default function AttendanceManagement({
  attendanceRecords,
  onAttendanceEdit,
  onRegularization,
}: AttendanceManagementProps) {
  const [isPunchedIn, setIsPunchedIn] = useState(false)
  const [punchTime, setPunchTime] = useState<string>("")
  const [currentTime, setCurrentTime] = useState(new Date())

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

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

  return (
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
                        onClick={() => onAttendanceEdit(record)}
                        className="text-red-600 hover:text-red-800 text-sm"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      {!record.regularized && record.status !== "present" && (
                        <button
                          onClick={() => onRegularization(record, "Approved by manager")}
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
}
