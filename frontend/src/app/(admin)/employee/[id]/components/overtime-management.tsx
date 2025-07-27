"use client"

import { useState } from "react"
import { Clock, AlertTriangle, CheckCircle, XCircle, Plus, Send } from "lucide-react"
import type { OvertimeRequest } from "../../types/employees";

interface OvertimeManagementProps {
  overtimeRequests: OvertimeRequest[]
  currentOvertimeHours: number
  onSubmitOvertimeRequest: (hours: number, justification: string) => void
}

export function OvertimeManagement({
  overtimeRequests,
  currentOvertimeHours,
  onSubmitOvertimeRequest,
}: OvertimeManagementProps) {
  const [showRequestForm, setShowRequestForm] = useState(false)
  const [requestHours, setRequestHours] = useState("")
  const [justification, setJustification] = useState("")

  const handleSubmitRequest = () => {
    if (requestHours && justification.trim()) {
      onSubmitOvertimeRequest(Number.parseFloat(requestHours), justification)
      setRequestHours("")
      setJustification("")
      setShowRequestForm(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800"
      case "rejected":
        return "bg-red-100 text-red-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="w-4 h-4" />
      case "rejected":
        return <XCircle className="w-4 h-4" />
      case "pending":
        return <Clock className="w-4 h-4" />
      default:
        return <Clock className="w-4 h-4" />
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Overtime Management</h2>
        <button
          onClick={() => setShowRequestForm(true)}
          className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors flex items-center space-x-2 font-medium"
        >
          <Plus className="w-5 h-5" />
          <span>Request Overtime</span>
        </button>
      </div>

      {/* Current Overtime Status */}
      <div className="bg-white rounded-lg shadow-sm border border-blue-200 p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
          <Clock className="w-6 h-6 text-blue-500 mr-2" />
          Current Overtime Status
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-orange-50 rounded-lg">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Clock className="w-8 h-8 text-orange-600" />
            </div>
            <p className="text-3xl font-bold text-orange-600">{currentOvertimeHours.toFixed(1)}</p>
            <p className="text-sm text-gray-600">Hours Today</p>
          </div>

          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <AlertTriangle className="w-8 h-8 text-blue-600" />
            </div>
            <p className="text-3xl font-bold text-blue-600">
              {overtimeRequests.filter((r) => r.status === "pending").length}
            </p>
            <p className="text-sm text-gray-600">Pending Requests</p>
          </div>

          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <p className="text-3xl font-bold text-green-600">
              {overtimeRequests.filter((r) => r.status === "approved").length}
            </p>
            <p className="text-sm text-gray-600">Approved This Month</p>
          </div>
        </div>

        {currentOvertimeHours > 0 && (
          <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-center">
              <AlertTriangle className="w-5 h-5 text-yellow-600 mr-2" />
              <div>
                <h4 className="font-medium text-yellow-900">Overtime Detected</h4>
                <p className="text-yellow-700 text-sm">
                  You have worked {currentOvertimeHours.toFixed(1)} hours overtime today.
                  {currentOvertimeHours > 2 && " Manager approval may be required for extended overtime."}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Overtime Request Form */}
      {showRequestForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg">
            <h3 className="text-xl font-semibold mb-4">Request Overtime Approval</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Overtime Hours</label>
                <input
                  type="number"
                  step="0.5"
                  min="0.5"
                  max="4"
                  value={requestHours}
                  onChange={(e) => setRequestHours(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter hours (0.5 - 4.0)"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Justification</label>
                <textarea
                  value={justification}
                  onChange={(e) => setJustification(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={4}
                  placeholder="Explain why overtime is necessary..."
                />
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowRequestForm(false)}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitRequest}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center space-x-2"
              >
                <Send className="w-4 h-4" />
                <span>Submit Request</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Overtime Requests History */}
      <div className="bg-white rounded-lg shadow-sm border border-blue-200 p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Overtime Requests History</h3>

        {overtimeRequests.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Clock className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>No overtime requests submitted yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {overtimeRequests.map((request) => (
              <div key={request.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-medium text-gray-900">
                      {request.hours} hours overtime - {request.date}
                    </h4>
                    <p className="text-sm text-gray-600 mt-1">{request.justification}</p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium flex items-center space-x-1 ${getStatusColor(request.status)}`}
                  >
                    {getStatusIcon(request.status)}
                    <span>{request.status.toUpperCase()}</span>
                  </span>
                </div>

                <div className="text-xs text-gray-500 space-y-1">
                  <p>Submitted: {request.submittedAt}</p>
                  {request.reviewedBy && request.reviewedAt && (
                    <p>
                      Reviewed by {request.reviewedBy} on {request.reviewedAt}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Overtime Guidelines */}
      <div className="bg-white rounded-lg shadow-sm border border-blue-200 p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Overtime Guidelines</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Automatic Approval</h4>
            <ul className="text-sm text-gray-600 space-y-2">
              <li>• Up to 1 hour: Auto-approved</li>
              <li>• Emergency situations</li>
              <li>• Critical bug fixes</li>
              <li>• Deadline-driven tasks</li>
            </ul>
          </div>

          <div>
            <h4 className="font-medium text-gray-900 mb-3">Manager Approval Required</h4>
            <ul className="text-sm text-gray-600 space-y-2">
              <li>• More than 1 hour</li>
              <li>• Regular overtime patterns</li>
              <li>• Weekend work</li>
              <li>• Holiday work</li>
            </ul>
          </div>
        </div>

        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-medium text-blue-900 mb-2">Important Notes</h4>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• All overtime must be justified with valid business reasons</li>
            <li>• Excessive overtime may require HR review</li>
            <li>• Overtime compensation follows company policy</li>
            <li>• Submit requests before or immediately after overtime work</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
