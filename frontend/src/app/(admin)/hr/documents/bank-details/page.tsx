'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface Employee {
  id: number
  name: string
  organization: string
  department: string
  role: string
}

export default function BankDetailsListPage() {
  const [employees, setEmployees] = useState<Employee[]>([])
  const pathname = usePathname()

  useEffect(() => {
    const fetchBankEmployees = async () => {
      try {
        const res = await fetch('/api/employees/bank-accounts')
        const data: Employee[] = await res.json()
        setEmployees(data)
      } catch {
        setEmployees([
          {
            id: 1,
            name: 'Vansh Ahuja',
            organization: 'Finance',
            department: 'Payroll',
            role: 'Accountant'
          },
          {
            id: 2,
            name: 'Neha Reddy',
            organization: 'IT',
            department: 'Development',
            role: 'Software Engineer'
          }
        ])
      }
    }

    fetchBankEmployees()
  }, [])

  return (
    <div className="bg-white border border-red-100 shadow-sm rounded-xl p-4 sm:p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">🏦 Bank Detail Directory</h2>
        {pathname !== '/documents' && (
          <Link
            href="/documents"
            className="text-sm bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
          >
            ← Back
          </Link>
        )}
      </div>

      <div className="hidden sm:block overflow-x-auto">
        <table className="min-w-full text-sm border rounded">
          <thead className="bg-red-50 text-gray-800">
            <tr>
              <th className="text-left px-4 py-2 border-b">S.no</th>
              <th className="text-left px-4 py-2 border-b">Name</th>
              <th className="text-left px-4 py-2 border-b">Organization</th>
              <th className="text-left px-4 py-2 border-b">Department</th>
              <th className="text-left px-4 py-2 border-b">Role</th>
              <th className="text-left px-4 py-2 border-b">Action</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((emp, index) => (
              <tr key={emp.id} className="text-gray-700 hover:bg-red-50">
                <td className="px-4 py-2 border-b">{index + 1}</td>
                <td className="px-4 py-2 border-b">{emp.name}</td>
                <td className="px-4 py-2 border-b">{emp.organization}</td>
                <td className="px-4 py-2 border-b">{emp.department}</td>
                <td className="px-4 py-2 border-b">{emp.role}</td>
                <td className="px-4 py-2 border-b">
                  <Link
                    href={`/documents/bank-details/${emp.id}`}
                    className="text-sm bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                  >
                    View Details
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="sm:hidden space-y-4">
        {employees.map((emp, index) => (
          <div
            key={emp.id}
            className="border border-red-100 shadow-sm bg-white rounded-xl p-4 text-gray-800"
          >
            <p className="text-sm font-medium text-gray-900">
              {index + 1} — {emp.name}
            </p>
            <p className="text-sm text-gray-700">Org: {emp.organization}</p>
            <p className="text-sm text-gray-700">Dept: {emp.department}</p>
            <p className="text-sm text-gray-700">Role: {emp.role}</p>
            <div className="mt-3">
              <Link
                href={`/documents/bank-details/${emp.id}`}
                className="inline-block bg-red-500 text-white text-sm px-3 py-1 rounded hover:bg-red-600"
              >
                View Details
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
