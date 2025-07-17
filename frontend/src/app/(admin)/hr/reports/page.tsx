'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

type Employee = {
  id: number
  name: string
  employeeId: string
  email: string
  department: string
  designation: string
  status: 'Active' | 'On Leave' | 'Inactive'
  joinedDate?: string
}

export default function EmployeeReports() {
  const [employees, setEmployees] = useState<Employee[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  const handleRowClick = (employeeId: string) => {
    router.push(`/hr/reports/${employeeId}`)
  }

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await fetch('/api/reports/employee')
        if (!res.ok) throw new Error('Failed to fetch')
        const data: Employee[] = await res.json()
        setEmployees(data)
      } catch {
        setEmployees([
          { 
            id: 1, 
            name: 'Ayesha Khan', 
            employeeId: 'EMP001',
            email: 'ayesha@company.com',
            department: 'Engineering', 
            designation: 'Senior Developer',
            status: 'Active',
            joinedDate: '2023-01-15'
          },
          { 
            id: 2, 
            name: 'Rohan Mehta', 
            employeeId: 'EMP002',
            email: 'rohan@company.com',
            department: 'HR', 
            designation: 'HR Manager',
            status: 'On Leave',
            joinedDate: '2022-06-20'
          }
        ])
      } finally {
        setLoading(false)
      }
    }

    fetchEmployees()
  }, [])

  if (loading) return <p className="text-gray-500">Loading employee data...</p>

  return (
    <div className="bg-white border rounded-xl shadow-sm">
      {/* Header Section */}
      <div className="px-6 py-4 border-b">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
            <span className="text-red-600">🧑‍💼</span> Employee Reports
          </h2>
        </div>
      </div>

      {/* Table Section */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead>
            <tr className="bg-gray-50 text-gray-600">
              <th className="px-6 py-3 border-b border-gray-200 font-medium">Employee</th>
              <th className="px-6 py-3 border-b border-gray-200 font-medium">Email Address</th>
              <th className="px-6 py-3 border-b border-gray-200 font-medium">Department</th>
              <th className="px-6 py-3 border-b border-gray-200 font-medium">Job Title</th>
              <th className="px-6 py-3 border-b border-gray-200 font-medium">Joined Date</th>
              <th className="px-6 py-3 border-b border-gray-200 font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {employees.map((emp) => (
              <tr
                key={emp.id}
                className="hover:bg-[#FDD0C4] transition-colors cursor-pointer"
                onClick={() => handleRowClick(emp.employeeId)}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 flex-shrink-0 rounded-full bg-red-100 flex items-center justify-center">
                      <span className="font-medium text-red-700">{emp.name.charAt(0)}</span>
                    </div>
                    <div 
                      onClick={() => handleRowClick(emp.employeeId)}
                      className="cursor-pointer"
                    >
                      <div className="font-medium text-gray-900 hover:text-red-600">{emp.name}</div>
                      <div className="text-gray-500 text-xs">{emp.employeeId}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                  {emp.email}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                  {emp.department || "N/A"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                  {emp.designation}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                  {emp.joinedDate ? new Date(emp.joinedDate).toLocaleDateString() : "—"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      emp.status === "Active"
                        ? "bg-green-100 text-green-800"
                        : emp.status === "On Leave"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-gray-100 text-gray-800"
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

      {/* Mobile View */}
      <div className="sm:hidden divide-y divide-gray-200">
        {employees.map((emp) => (
          <div
            key={emp.id}
            className="p-4 hover:bg-gray-50 transition-colors cursor-pointer"
            onClick={() => handleRowClick(emp.employeeId)}
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
                <span className="font-medium text-red-700">{emp.name.charAt(0)}</span>
              </div>
              <div 
                onClick={() => handleRowClick(emp.employeeId)}
                className="cursor-pointer"
              >
                <div className="font-medium text-gray-900 hover:text-red-600">{emp.name}</div>
                <div className="text-gray-500 text-sm">{emp.employeeId}</div>
              </div>
            </div>
            <div className="ml-13 space-y-1 text-sm">
              <div className="text-gray-600">{emp.email}</div>
              <div className="text-gray-600">{emp.designation} • {emp.department || "No Department"}</div>
              <div className="flex items-center justify-between mt-2">
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    emp.status === "Active"
                      ? "bg-green-100 text-green-800"
                      : emp.status === "On Leave"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {emp.status}
                </span>
                <span className="text-gray-500 text-xs">
                  Joined: {emp.joinedDate ? new Date(emp.joinedDate).toLocaleDateString() : "—"}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
