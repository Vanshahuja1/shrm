"use client"

import { Clock, LogIn, LogOut, AlertCircle } from "lucide-react"

interface AttendanceSystemProps {
  onPunchIn: () => void
  onPunchOut: () => void
  isPunchedIn: boolean
  currentTime: Date
  workStartTime?: string
  totalWorkHours: number
  overtimeHours: number
}

export function AttendanceSystem({
  onPunchIn,
  onPunchOut,
  isPunchedIn,
  currentTime,
  workStartTime,
  totalWorkHours,
  overtimeHours,
}: AttendanceSystemProps) {
  const isOvertimeRequired = totalWorkHours > 8.5
  const canPunchOut = totalWorkHours >= 8 || isOvertimeRequired

  // Format work start time properly
  const formattedWorkStart = workStartTime
    ? new Date(workStartTime).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true })
    : undefined

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Attendance System</h2>

      {/* Punch In/Out Section */}
      <div className="bg-white rounded-lg shadow-sm border border-blue-200 p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
          <Clock className="w-6 h-6 text-blue-500 mr-2" />
          Punch In/Out System
        </h3>

        <div className="text-center mb-6">
          <div className="w-32 h-32 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Clock className="w-16 h-16 text-white" />
          </div>
          <h4 className="text-4xl font-bold text-gray-900 mb-2">
            {currentTime.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', second: '2-digit', hour12: true })}
          </h4>
          <p className="text-gray-600 text-lg">{currentTime.toLocaleDateString()}</p>

          {formattedWorkStart && (
            <p className="text-blue-600 font-medium mt-2">Work started at: {formattedWorkStart}</p>
          )}
        </div>

        <div className="flex justify-center mb-6">
          {!isPunchedIn ? (
            <button
              onClick={onPunchIn}
              className="bg-green-500 text-white px-12 py-4 rounded-lg hover:bg-green-600 transition-colors flex items-center space-x-3 text-xl font-semibold"
            >
              <LogIn className="w-8 h-8" />
              <span>Punch In</span>
            </button>
          ) : (
            <button
              onClick={onPunchOut}
              disabled={!canPunchOut}
              className={`px-12 py-4 rounded-lg transition-colors flex items-center space-x-3 text-xl font-semibold ${
                canPunchOut 
                  ? "bg-red-500 text-white hover:bg-red-600" 
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              <LogOut className="w-8 h-8" />
              <span>Punch Out</span>
            </button>
          )}
        </div>

        {!canPunchOut && isPunchedIn && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 text-yellow-600 mr-2" />
              <span className="text-yellow-800 font-medium">
                Minimum 8 hours required before punch out. Current: {totalWorkHours.toFixed(1)} hours
              </span>
            </div>
          </div>
        )}

        <div className="mb-4">
          {isPunchedIn ? (
            <span className="inline-block bg-emerald-100 text-emerald-700 px-3 py-1 rounded text-sm">
              Currently Working
            </span>
          ) : (
            <span className="inline-block bg-gray-100 text-gray-700 px-3 py-1 rounded text-sm">
              Not Working
            </span>
          )}
        </div>
      </div>

      {/* Overtime Alert */}
      {isOvertimeRequired && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
            <div>
              <h4 className="font-medium text-red-900">Overtime Detected</h4>
              <p className="text-red-700 text-sm">
                You have worked {overtimeHours.toFixed(1)} hours overtime. Justification may be required.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}