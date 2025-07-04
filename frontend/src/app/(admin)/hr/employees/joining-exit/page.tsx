'use client'

import { useState, useEffect } from 'react'

interface EmployeeDates {
  id: number
  name: string
  employeeId: string
  joiningDate: string
  exitDate: string | null
  employmentType: string
  status: string
}

export default function JoiningExitDates() {
  const [employees, setEmployees] = useState<EmployeeDates[]>([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/employees/dates')
        const data: EmployeeDates[] = await res.json()
        setEmployees(data)
      } catch {
        setEmployees([
          {
            id: 1,
            name: 'Alice Sharma',
            employeeId: 'EMP001',
            joiningDate: '2020-01-15',
            exitDate: null,
            employmentType: 'Full-Time',
            status: 'Active'
          },
          {
            id: 2,
            name: 'Bob Verma',
            employeeId: 'EMP002',
            joiningDate: '2018-06-01',
            exitDate: '2023-03-30',
            employmentType: 'Contract',
            status: 'Exited'
          }
        ])
      }
    }

    fetchData()
  }, [])

  return (
    <div className="bg-white border rounded-xl p-4 sm:p-6 shadow-sm">
      <h2 className="text-base sm:text-lg font-semibold mb-4 text-gray-800">
        📅 Joining & Exit Dates
      </h2>

      <div className="hidden sm:block overflow-x-auto">
        <table className="min-w-full text-sm border rounded-lg overflow-hidden">
          <thead className="bg-red-50 text-gray-900">
            <tr>
              <th className="text-left px-4 py-2 border-b">Employee ID</th>
              <th className="text-left px-4 py-2 border-b">Name</th>
              <th className="text-left px-4 py-2 border-b">Joining Date</th>
              <th className="text-left px-4 py-2 border-b">Exit Date</th>
              <th className="text-left px-4 py-2 border-b">Employment Type</th>
              <th className="text-left px-4 py-2 border-b">Status</th>
            </tr>
          </thead>
          <tbody>
            {employees.map(emp => (
              <tr key={emp.id} className="hover:bg-red-50 transition text-gray-900">
                <td className="px-4 py-2 border-b">{emp.employeeId}</td>
                <td className="px-4 py-2 border-b">{emp.name}</td>
                <td className="px-4 py-2 border-b">{emp.joiningDate}</td>
                <td className="px-4 py-2 border-b">{emp.exitDate || '–'}</td>
                <td className="px-4 py-2 border-b">{emp.employmentType}</td>
                <td className="px-4 py-2 border-b">{emp.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="sm:hidden space-y-4">
        {employees.map(emp => (
          <div
            key={emp.id}
            className="border rounded-lg p-3 shadow-sm bg-red-50 text-gray-900 space-y-1"
          >
            <div><strong>ID:</strong> {emp.employeeId}</div>
            <div><strong>Name:</strong> {emp.name}</div>
            <div><strong>Joining:</strong> {emp.joiningDate}</div>
            <div><strong>Exit:</strong> {emp.exitDate || '–'}</div>
            <div><strong>Type:</strong> {emp.employmentType}</div>
            <div><strong>Status:</strong> {emp.status}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
