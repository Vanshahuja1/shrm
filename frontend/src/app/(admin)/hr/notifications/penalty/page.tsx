'use client'

import { useEffect, useState } from 'react'

interface Employee {
  id: number
  name: string
  email: string
  organization: string
  department: string
  role: string
}

export default function PenaltyNotificationPage() {
  const [employees, setEmployees] = useState<Employee[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [percent, setPercent] = useState('')
  const [subject, setSubject] = useState('')
  const [body, setBody] = useState('')
  const [preview, setPreview] = useState(false)
  const [sentIds, setSentIds] = useState<number[]>([])
  const penaltyReasons = [
    'Late arrival',
    'Uninformed leave',
    'Policy violation',
    'Unprofessional conduct',
    'Missed deadline'
  ]

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await fetch('/api/employees/all')
        const data: Employee[] = await res.json()
        setEmployees(data)
      } catch {
        setEmployees([
          {
            id: 1,
            name: 'Vansh Ahuja',
            email: 'vansh@company.com',
            organization: 'Tech',
            department: 'IT',
            role: 'Developer'
          },
          {
            id: 2,
            name: 'Neha Reddy',
            email: 'neha@company.com',
            organization: 'Admin',
            department: 'HR',
            role: 'Manager'
          }
        ])
      }
    }

    fetchEmployees()
  }, [])

  const handleSend = async () => {
    if (!selectedId || !subject.trim() || !body.trim() || !percent) {
      return alert('Please complete all fields.')
    }

    try {
      await fetch('/api/notifications/penalty', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: selectedId, subject, body, percent })
      })

      setSentIds((prev) => [...prev, selectedId])
      setSubject('')
      setBody('')
      setPercent('')
      setSelectedId(null)
      setPreview(false)
    } catch {
      alert('❌ Failed to send penalty email.')
    }
  }

  const filtered = employees.filter(
    (emp) =>
      emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.organization.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.role.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="bg-white border border-red-100 rounded-xl p-4 sm:p-6 shadow-sm text-gray-900">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">🚫 Penalty Notification</h2>

      <input
        type="text"
        placeholder="Search employee by name, org, or role"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full sm:w-72 px-3 py-2 border border-red-100 rounded text-sm shadow-sm mb-4"
      />

      <div className="grid sm:grid-cols-2 gap-4 mb-6">
        {filtered.map((emp) => (
          <div
            key={emp.id}
            className={`border px-4 py-3 rounded-xl ${
              selectedId === emp.id ? 'bg-red-100 border-red-300' : 'bg-white border-red-100'
            }`}
          >
            <p className="text-sm font-medium text-gray-900">{emp.name}</p>
            <p className="text-sm text-gray-600">{emp.email}</p>
            <p className="text-xs text-gray-500">
              {emp.organization} — {emp.department} — {emp.role}
            </p>
            <button
              onClick={() => setSelectedId(emp.id)}
              disabled={sentIds.includes(emp.id)}
              className={`mt-2 px-3 py-1 text-xs rounded ${
                sentIds.includes(emp.id)
                  ? 'bg-gray-300 text-gray-500'
                  : 'bg-red-500 text-white hover:bg-red-600'
              }`}
            >
              {sentIds.includes(emp.id) ? 'Sent' : 'Select'}
            </button>
          </div>
        ))}
      </div>

      {selectedId && (
        <div className="border-t pt-4">
          <h3 className="text-md font-semibold mb-2 text-gray-800">🖋️ Compose Penalty Mail</h3>

          <input
            type="number"
            placeholder="Penalty %"
            value={percent}
            onChange={(e) => setPercent(e.target.value)}
            className="w-full px-3 py-2 border border-red-100 rounded text-sm mb-3"
          />

          <input
            type="text"
            placeholder="Subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full px-3 py-2 border border-red-100 rounded text-sm mb-3"
          />

          <select
            onChange={(e) => setBody(e.target.value)}
            className="w-full px-3 py-2 border border-red-100 rounded text-sm mb-3"
          >
            <option value="">📋 Select Penalty Reason (optional)</option>
            {penaltyReasons.map((reason, idx) => (
              <option key={idx} value={`Reason: ${reason}`}>
                {reason}
              </option>
            ))}
          </select>

          <textarea
            placeholder="Write penalty reason/message..."
            rows={5}
            value={body}
            onChange={(e) => setBody(e.target.value)}
            className="w-full px-3 py-2 border border-red-100 rounded text-sm mb-3"
          />

          <button
            onClick={() => setPreview(true)}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 text-sm rounded"
          >
            Preview
          </button>
        </div>
      )}

      {preview && selectedId !== null && (
        <div className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center">
          <div className="bg-white border border-red-100 rounded-xl p-6 shadow-lg w-[90%] max-w-md">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">📨 Email Preview</h3>
            <p className="text-sm text-gray-600 mb-1">
              <strong>To:</strong> {employees.find((e) => e.id === selectedId)?.email}
            </p>
            <p className="text-sm text-gray-600 mb-1">
              <strong>Subject:</strong> {subject}
            </p>
            <p className="text-sm text-gray-600 mb-1">
              <strong>Penalty:</strong> {percent}%
            </p>
            <div className="text-sm text-gray-800 whitespace-pre-line border-t pt-2 mt-2 mb-4">
              {body}
            </div>
            <div className="flex justify-end gap-3">
              <button
                onClick={handleSend}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-1 rounded text-sm"
              >
                Confirm & Send
              </button>
              <button
                onClick={() => setPreview(false)}
                className="bg-gray-200 text-gray-700 px-4 py-1 rounded text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
