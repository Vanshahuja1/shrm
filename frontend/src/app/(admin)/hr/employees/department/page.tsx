'use client'

import { useState, useEffect } from 'react'

interface Assignment {
  id: number
  name: string
  employeeId: string
  department: string
  subDepartment: string
  manager: string
  assignedOn: string
}

export default function DepartmentAssignment() {
  const [assignments, setAssignments] = useState<Assignment[]>([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/employees/department')
        const data: Assignment[] = await res.json()
        setAssignments(data)
      } catch {
        setAssignments([
          {
            id: 1,
            name: 'Alice Sharma',
            employeeId: 'EMP001',
            department: 'IT Development',
            subDepartment: 'Frontend',
            manager: 'Rajiv Menon',
            assignedOn: '2021-02-10'
          },
          {
            id: 2,
            name: 'Bob Verma',
            employeeId: 'EMP002',
            department: 'Human Resources',
            subDepartment: 'Recruitment',
            manager: 'Meena Rao',
            assignedOn: '2020-08-05'
          }
        ])
      }
    }

    fetchData()
  }, [])

  return (
    <div className="bg-white border rounded-xl p-4 sm:p-6 shadow-sm">
      <h2 className="text-base sm:text-lg font-semibold mb-4 text-gray-800">
        🏢 Department Assignment
      </h2>

      <div className="hidden sm:block overflow-x-auto">
        <table className="min-w-full text-sm border rounded-lg overflow-hidden">
          <thead className="bg-red-50 text-gray-900">
            <tr>
              <th className="text-left px-4 py-2 border-b">Employee ID</th>
              <th className="text-left px-4 py-2 border-b">Name</th>
              <th className="text-left px-4 py-2 border-b">Department</th>
              <th className="text-left px-4 py-2 border-b">Sub-Department</th>
              <th className="text-left px-4 py-2 border-b">Manager</th>
              <th className="text-left px-4 py-2 border-b">Assigned On</th>
            </tr>
          </thead>
          <tbody>
            {assignments.map(emp => (
              <tr key={emp.id} className="hover:bg-red-50 transition text-gray-900">
                <td className="px-4 py-2 border-b">{emp.employeeId}</td>
                <td className="px-4 py-2 border-b">{emp.name}</td>
                <td className="px-4 py-2 border-b">{emp.department}</td>
                <td className="px-4 py-2 border-b">{emp.subDepartment}</td>
                <td className="px-4 py-2 border-b">{emp.manager}</td>
                <td className="px-4 py-2 border-b">{emp.assignedOn}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="sm:hidden space-y-4">
        {assignments.map(emp => (
          <div
            key={emp.id}
            className="border rounded-lg p-3 shadow-sm bg-red-50 text-gray-900 space-y-1"
          >
            <div><strong>ID:</strong> {emp.employeeId}</div>
            <div><strong>Name:</strong> {emp.name}</div>
            <div><strong>Dept:</strong> {emp.department}</div>
            <div><strong>Sub-Dept:</strong> {emp.subDepartment}</div>
            <div><strong>Manager:</strong> {emp.manager}</div>
            <div><strong>Assigned:</strong> {emp.assignedOn}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
