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

export default function GeneralNotificationPage() {
  const [employees, setEmployees] = useState<Employee[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [sentIds, setSentIds] = useState<number[]>([])
  

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await fetch('/api/employees/all')
        const data = await res.json()
        setEmployees(data)
      } catch {
        setEmployees([
          {
            id: 1,
            name: 'Vansh Ahuja',
            email: 'vansh@company.com',
            organization: 'Tech',
            department: 'IT',
            role: 'Developer',
          },
          {
            id: 2,
            name: 'Neha Reddy',
            email: 'neha@company.com',
            organization: 'Admin',
            department: 'HR',
            role: 'Manager',
          },
        ])
      }
    }

    fetchEmployees()
  }, [])

  
  const filtered = employees.filter(
    (emp) =>
      emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.organization.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.role.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="bg-white border border-red-100 rounded-xl p-4 sm:p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">📢 General Notification</h2>

      <input
        type="text"
        placeholder="Search employee by name, org, or role"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full sm:w-72 px-3 py-2 border border-red-100 rounded text-sm shadow-sm mb-4 text-gray-900"
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
              onClick={() => {
                setSelectedId(emp.id)
                // Open Gmail compose in new window
                const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(emp.email)}`
                window.open(gmailUrl, '_blank')
              }}
              disabled={sentIds.includes(emp.id)}
              className={`mt-2 px-3 py-1 text-xs rounded flex items-center gap-1.5 ${
                sentIds.includes(emp.id)
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-red-500 text-white hover:bg-red-600'
              }`}
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              {sentIds.includes(emp.id) ? 'Sent' : 'Compose Email'}
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
