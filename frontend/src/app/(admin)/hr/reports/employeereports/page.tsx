'use client'

import { useEffect, useState } from 'react'

type Employee = {
  id: number
  name: string
  department: string
  status: 'Active' | 'On Leave' | string
}

export default function EmployeeReports() {
  const [employees, setEmployees] = useState<Employee[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await fetch('/api/reports/employee')
        if (!res.ok) throw new Error('Failed to fetch')
        const data: Employee[] = await res.json()
        setEmployees(data)
      } catch {
        setEmployees([
          { id: 1, name: 'Ayesha Khan', department: 'Engineering', status: 'Active' },
          { id: 2, name: 'Rohan Mehta', department: 'HR', status: 'On Leave' }
        ])
      } finally {
        setLoading(false)
      }
    }

    fetchEmployees()
  }, [])

  if (loading) return <p className="text-gray-500">Loading employee data...</p>

  return (
    <div className="bg-white border rounded-xl p-6 shadow text-gray-800">
      <h2 className="text-xl font-bold mb-4">🧑‍💼 Employee Reports</h2>

      {/* Mobile View */}
      <div className="block sm:hidden space-y-4">
        {employees.map((emp) => (
          <div
            key={emp.id}
            className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-sm shadow-sm"
          >
            <p><span className="font-semibold">Name:</span> {emp.name}</p>
            <p><span className="font-semibold">Department:</span> {emp.department}</p>
            <p>
              <span className="font-semibold">Status:</span>{' '}
              <span
                className={`px-2 py-0.5 rounded text-xs font-medium ${
                  emp.status === 'Active'
                    ? 'bg-green-100 text-green-700'
                    : emp.status === 'On Leave'
                    ? 'bg-yellow-100 text-yellow-700'
                    : 'bg-red-100 text-red-700'
                }`}
              >
                {emp.status}
              </span>
            </p>
          </div>
        ))}
      </div>

      {/* Desktop View */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="w-full text-sm border rounded min-w-[500px]">
          <thead className="bg-gray-100">
            <tr>
              <th className="text-left px-4 py-2 border-b">Name</th>
              <th className="text-left px-4 py-2 border-b">Department</th>
              <th className="text-left px-4 py-2 border-b">Status</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((emp) => (
              <tr key={emp.id} className="hover:bg-gray-50">
                <td className="px-4 py-2 border-b">{emp.name}</td>
                <td className="px-4 py-2 border-b">{emp.department}</td>
                <td className="px-4 py-2 border-b">
                  <span
                    className={`px-2 py-0.5 rounded text-xs font-medium ${
                      emp.status === 'Active'
                        ? 'bg-green-100 text-green-700'
                        : emp.status === 'On Leave'
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {emp.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
