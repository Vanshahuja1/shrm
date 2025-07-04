'use client'

import { useState, useEffect } from 'react'

interface EmployeeRecord {
  id: number
  name: string
  employeeId: string
  email: string
  phone: string
  designation: string
  status: 'Active' | 'On Leave' | 'Inactive'
}

export default function EmployeeRecords() {
  const [records, setRecords] = useState<EmployeeRecord[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<'All' | 'Active' | 'On Leave' | 'Inactive'>('All')

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await fetch('/api/employees')
        const data: EmployeeRecord[] = await res.json()
        setRecords(data)
      } catch {
        setRecords([
          {
            id: 1,
            name: 'Alice Sharma',
            employeeId: 'EMP001',
            email: 'alice@company.com',
            phone: '9876543210',
            designation: 'Frontend Developer',
            status: 'Active'
          },
          {
            id: 2,
            name: 'Bob Verma',
            employeeId: 'EMP002',
            email: 'bob@company.com',
            phone: '9876543211',
            designation: 'HR Manager',
            status: 'On Leave'
          },
          {
            id: 3,
            name: 'Neha Reddy',
            employeeId: 'EMP003',
            email: 'neha@company.com',
            phone: '9876543212',
            designation: 'Manager',
            status: 'Inactive'
          }
        ])
      }
    }

    fetchEmployees()
  }, [])

  const filteredRecords = records.filter((emp) => {
    const matchesSearch = emp.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'All' || emp.status === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <div className="bg-white border rounded-xl p-4 sm:p-6 shadow-sm">
      <h2 className="text-base sm:text-lg font-semibold mb-4 text-gray-800">📋 Employee Records</h2>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
        <input
          type="text"
          placeholder="Search by name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border px-3 py-2 rounded text-sm w-full sm:w-1/2 text-gray-800"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
          className="border px-3 py-2 rounded text-sm w-full sm:w-48 text-gray-800"
        >
          <option value="All">All Statuses</option>
          <option value="Active">Active</option>
          <option value="On Leave">On Leave</option>
          <option value="Inactive">Inactive</option>
        </select>
      </div>

      <div className="hidden sm:block overflow-x-auto">
        <table className="min-w-full text-sm border rounded-lg overflow-hidden">
          <thead className="bg-red-50 text-gray-900">
            <tr>
              <th className="text-left px-4 py-2 border-b">Employee ID</th>
              <th className="text-left px-4 py-2 border-b">Name</th>
              <th className="text-left px-4 py-2 border-b">Email</th>
              <th className="text-left px-4 py-2 border-b">Phone</th>
              <th className="text-left px-4 py-2 border-b">Designation</th>
              <th className="text-left px-4 py-2 border-b">Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredRecords.map((emp) => (
              <tr key={emp.id} className="hover:bg-red-50 transition text-gray-900">
                <td className="px-4 py-2 border-b">{emp.employeeId}</td>
                <td className="px-4 py-2 border-b">{emp.name}</td>
                <td className="px-4 py-2 border-b">{emp.email}</td>
                <td className="px-4 py-2 border-b">{emp.phone}</td>
                <td className="px-4 py-2 border-b">{emp.designation}</td>
                <td className="px-4 py-2 border-b">{emp.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="sm:hidden space-y-4">
        {filteredRecords.map((emp) => (
          <div key={emp.id} className="border rounded-lg p-3 shadow-sm bg-red-50 text-gray-800 space-y-1">
            <div><strong>ID:</strong> {emp.employeeId}</div>
            <div><strong>Name:</strong> {emp.name}</div>
            <div><strong>Email:</strong> {emp.email}</div>
            <div><strong>Phone:</strong> {emp.phone}</div>
            <div><strong>Designation:</strong> {emp.designation}</div>
            <div><strong>Status:</strong> {emp.status}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
