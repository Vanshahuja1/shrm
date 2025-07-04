'use client'

import { useState, useEffect } from 'react'

interface EmployeePersonalInfo {
  id: number
  name: string
  gender: string
  dob: string
  phone: string
  email: string
  address: string
}

export default function PersonalInformation() {
  const [personalInfo, setPersonalInfo] = useState<EmployeePersonalInfo[]>([])
  const [showModal, setShowModal] = useState(false)
  const [selected, setSelected] = useState<EmployeePersonalInfo | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/employees/personal')
        const data: EmployeePersonalInfo[] = await res.json()
        setPersonalInfo(data)
      } catch {
        setPersonalInfo([
          {
            id: 1,
            name: 'Alice Sharma',
            gender: 'Female',
            dob: '1990-05-12',
            phone: '9876543210',
            email: 'alice@company.com',
            address: '123 Main St, Delhi'
          },
          {
            id: 2,
            name: 'Bob Verma',
            gender: 'Male',
            dob: '1988-09-20',
            phone: '9876543211',
            email: 'bob@company.com',
            address: '456 MG Road, Mumbai'
          }
        ])
      }
    }

    fetchData()
  }, [])

  const handleEditClick = (emp: EmployeePersonalInfo) => {
    setSelected(emp)
    setShowModal(true)
  }

  const handleSave = () => {
    if (!selected) return
    setPersonalInfo(prev => prev.map(emp => (emp.id === selected.id ? selected : emp)))
    setShowModal(false)
  }

  return (
    <div className="bg-white border rounded-xl p-4 sm:p-6 shadow-sm">
      <h2 className="text-base sm:text-lg font-semibold mb-4 text-gray-900">👤 Personal Information</h2>

      <div className="hidden sm:block overflow-x-auto">
        <table className="min-w-full text-sm border rounded-lg overflow-hidden">
          <thead className="bg-white text-gray-900">
            <tr>
              <th className="text-left px-4 py-2 border-b">Name</th>
              <th className="text-left px-4 py-2 border-b">Gender</th>
              <th className="text-left px-4 py-2 border-b">DOB</th>
              <th className="text-left px-4 py-2 border-b">Phone</th>
              <th className="text-left px-4 py-2 border-b">Email</th>
              <th className="text-left px-4 py-2 border-b">Address</th>
              <th className="text-left px-4 py-2 border-b">Action</th>
            </tr>
          </thead>
          <tbody>
            {personalInfo.map(emp => (
              <tr key={emp.id} className="hover:bg-white text-gray-900">
                <td className="px-4 py-2 border-b">{emp.name}</td>
                <td className="px-4 py-2 border-b">{emp.gender}</td>
                <td className="px-4 py-2 border-b">{emp.dob}</td>
                <td className="px-4 py-2 border-b">{emp.phone}</td>
                <td className="px-4 py-2 border-b">{emp.email}</td>
                <td className="px-4 py-2 border-b">{emp.address}</td>
                <td className="px-4 py-2 border-b">
                  <button
                    onClick={() => handleEditClick(emp)}
                    className="text-sm text-red-700 hover:bg-red-50"
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="sm:hidden space-y-4">
        {personalInfo.map(emp => (
          <div key={emp.id} className="border rounded-lg p-3 shadow-sm bg-white text-gray-900 space-y-1">
            <div><strong>Name:</strong> {emp.name}</div>
            <div><strong>Gender:</strong> {emp.gender}</div>
            <div><strong>DOB:</strong> {emp.dob}</div>
            <div><strong>Phone:</strong> {emp.phone}</div>
            <div><strong>Email:</strong> {emp.email}</div>
            <div><strong>Address:</strong> {emp.address}</div>
            <button
              onClick={() => handleEditClick(emp)}
              className="text-xs text-red-700 mt-2 underline"
            >
              Edit
            </button>
          </div>
        ))}
      </div>

      {showModal && selected && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[90%] max-w-md space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Edit {selected.name}</h3>
            <input
              type="text"
              value={selected.phone}
              onChange={e => setSelected({ ...selected, phone: e.target.value })}
              className="w-full border px-3 py-2 rounded text-sm text-gray-900"
              placeholder="Phone"
            />
            <input
              type="email"
              value={selected.email}
              onChange={e => setSelected({ ...selected, email: e.target.value })}
              className="w-full border px-3 py-2 rounded text-sm text-gray-900"
              placeholder="Email"
            />
            <input
              type="text"
              value={selected.address}
              onChange={e => setSelected({ ...selected, address: e.target.value })}
              className="w-full border px-3 py-2 rounded text-sm text-gray-900"
              placeholder="Address"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowModal(false)}
                className="text-sm px-3 py-1 rounded bg-gray-900 hover:bg-gray-300 text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="text-sm px-3 py-1 rounded bg-red-500  text-white hover:bg-red-600"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
