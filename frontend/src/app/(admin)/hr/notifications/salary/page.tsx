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

export default function SalaryNotificationPage() {
  const [employees, setEmployees] = useState<Employee[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [amount, setAmount] = useState('')
  const [month, setMonth] = useState('')
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

  const handleEmailCompose = (employee: Employee, salaryAmount: string, salaryMonth: string) => {
    const subject = `Salary Credit Notification - ${salaryMonth}`
    const body = `Dear ${employee.name},\n\nThis is to inform you that your salary of Rs. ${salaryAmount} for the month of ${salaryMonth} has been credited to your registered bank account.\n\nIf you have any questions, please contact the HR department.\n\nBest regards,\nHR Team`
    
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(employee.email)}&subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    window.open(gmailUrl, '_blank')
    setSentIds(prev => [...prev, employee.id])
    setSelectedId(null)
    setAmount('')
    setMonth('')
  }

  const filtered = employees.filter(emp =>
    emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.organization.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.role.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="bg-white border border-red-100 rounded-xl p-4 sm:p-6 shadow-sm text-gray-900">
      <h2 className="text-lg font-semibold mb-4">
        💰 Salary Credit Notification
      </h2>

      <input
        type="text"
        placeholder="Search employee by name, org, or role"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full sm:w-72 px-3 py-2 border border-red-100 rounded text-sm shadow-sm mb-4"
      />

      <div className="grid sm:grid-cols-2 gap-4 mb-6">
        {filtered.map(emp => (
          <div
            key={emp.id}
            className={`border px-4 py-3 rounded-xl ${
              sentIds.includes(emp.id) ? 'bg-green-50 border-green-200' : 'bg-white border-red-100'
            }`}
          >
            <p className="text-sm font-medium">{emp.name}</p>
            <p className="text-sm text-gray-600">{emp.email}</p>
            <p className="text-xs text-gray-500">
              {emp.organization} — {emp.department} — {emp.role}
            </p>
            {!sentIds.includes(emp.id) && (
              <div className="mt-2 space-y-2">
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="Salary Amount"
                    value={selectedId === emp.id ? amount : ''}
                    onChange={(e) => {
                      setSelectedId(emp.id)
                      setAmount(e.target.value)
                    }}
                    className="w-32 px-2 py-1 text-xs border border-red-100 rounded"
                  />
                  <input
                    type="text"
                    placeholder="Month (e.g. June)"
                    value={selectedId === emp.id ? month : ''}
                    onChange={(e) => {
                      setSelectedId(emp.id)
                      setMonth(e.target.value)
                    }}
                    className="flex-1 px-2 py-1 text-xs border border-red-100 rounded"
                  />
                </div>
                <button
                  onClick={() => handleEmailCompose(emp, amount, month)}
                  disabled={selectedId !== emp.id || !amount || !month}
                  className={`w-full px-3 py-1 text-xs rounded flex items-center justify-center gap-1.5 ${
                    selectedId !== emp.id || !amount || !month
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-red-500 text-white hover:bg-red-600'
                  }`}
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Compose Email
                </button>
              </div>
            )}
            {sentIds.includes(emp.id) && (
              <div className="mt-2 flex items-center gap-2">
                <span className="text-xs text-green-600 flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  Email Sent
                </span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
