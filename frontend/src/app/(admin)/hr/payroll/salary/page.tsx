'use client'

import { useEffect, useState } from 'react'

interface EmployeeSalary {
  id: number
  name: string
  organization: string
  department: string | null
  role: string
  month: string
  salary: number
}

export default function SalaryProcessing() {
  const [salaries, setSalaries] = useState<EmployeeSalary[]>([])
  const [processedIds, setProcessedIds] = useState<number[]>([])

  useEffect(() => {
    const fetchSalaries = async () => {
      try {
        const res = await fetch('/api/salaries')
        const data = await res.json()
        setSalaries(data)
      } catch {
        setSalaries([
          {
            id: 1,
            name: 'Alice Sharma',
            organization: 'IT',
            department: 'IT Development',
            role: 'Frontend Developer',
            month: 'June',
            salary: 50000
          },
          {
            id: 2,
            name: 'Bob Verma',
            organization: 'IT',
            department: 'Human Resources',
            role: 'HR Manager',
            month: 'June',
            salary: 45000
          },
          {
            id: 3,
            name: 'Neha Reddy',
            organization: 'UPSC',
            department: null,
            role: 'Administrative Officer',
            month: 'June',
            salary: 48000
          }
        ])
      }
    }
    fetchSalaries()
  }, [])

  const handleProcess = async (emp: EmployeeSalary) => {
    try {
      await fetch('/api/salaries/notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: emp.id,
          name: emp.name,
          month: emp.month,
          salary: emp.salary
        })
      })

      alert(`✅ Salary processed for ${emp.name}`)
      setProcessedIds((prev) => [...prev, emp.id])
    } catch {
      alert('❌ Failed to process salary.')
    }
  }

  return (
    <div className="bg-white border rounded-xl p-4 sm:p-6 shadow-sm">
      <h2 className="text-base sm:text-lg font-semibold mb-4 text-gray-800">
        💰 Salary Processing
      </h2>

      {/* 🖥️ Table View */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="min-w-full text-sm border rounded-lg overflow-hidden">
          <thead className="bg-red-50 text-gray-800">
            <tr>
              <th className="text-left px-4 py-2 border-b">Name</th>
              <th className="text-left px-4 py-2 border-b">Organization</th>
              <th className="text-left px-4 py-2 border-b">Department</th>
              <th className="text-left px-4 py-2 border-b">Role</th>
              <th className="text-left px-4 py-2 border-b">Month</th>
              <th className="text-left px-4 py-2 border-b">Salary</th>
              <th className="text-left px-4 py-2 border-b">Action</th>
            </tr>
          </thead>
          <tbody>
            {salaries.map(emp => (
              <tr key={emp.id} className="hover:bg-red-50 text-gray-800 transition">
                <td className="px-4 py-2 border-b">{emp.name}</td>
                <td className="px-4 py-2 border-b">{emp.organization}</td>
                <td className="px-4 py-2 border-b">{emp.department || '–'}</td>
                <td className="px-4 py-2 border-b">{emp.role}</td>
                <td className="px-4 py-2 border-b">{emp.month}</td>
                <td className="px-4 py-2 border-b">₹ {emp.salary.toLocaleString()}</td>
                <td className="px-4 py-2 border-b">
                  <button
                    onClick={() => handleProcess(emp)}
                    disabled={processedIds.includes(emp.id)}
                    className={`px-3 py-1 rounded text-sm font-medium ${
                      processedIds.includes(emp.id)
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-red-500 text-white hover:bg-red-600'
                    }`}
                  >
                    {processedIds.includes(emp.id) ? 'Processed' : 'Process Salary'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 📱 Mobile Cards */}
      <div className="sm:hidden space-y-4">
        {salaries.map(emp => (
          <div key={emp.id} className="border rounded-lg p-3 shadow-sm bg-red-50 text-gray-800 space-y-1">
            <div><strong>Name:</strong> {emp.name}</div>
            <div><strong>Org:</strong> {emp.organization}</div>
            <div><strong>Dept:</strong> {emp.department || '–'}</div>
            <div><strong>Role:</strong> {emp.role}</div>
            <div><strong>Month:</strong> {emp.month}</div>
            <div><strong>Salary:</strong> ₹ {emp.salary.toLocaleString()}</div>
            <button
              onClick={() => handleProcess(emp)}
              disabled={processedIds.includes(emp.id)}
              className={`mt-2 px-3 py-1 w-full text-xs font-medium rounded ${
                processedIds.includes(emp.id)
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-red-500 text-white hover:bg-red-600'
              }`}
            >
              {processedIds.includes(emp.id) ? 'Processed' : 'Process Salary'}
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
