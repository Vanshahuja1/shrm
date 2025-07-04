'use client'

import { useState, useEffect } from 'react'

interface Leave {
  id: number
  name: string
  reason: string
  dates: string
}

export default function LeaveManagement() {
  const [leaves, setLeaves] = useState<Leave[]>([])

  useEffect(() => {
    const fetchLeaves = async () => {
      try {
        const res = await fetch('/api/leaves')
        const data: Leave[] = await res.json()
        setLeaves(data)
      } catch {
        setLeaves([
          { id: 1, name: 'Alice', reason: 'Medical', dates: 'June 3 - June 6' },
          { id: 2, name: 'Bob', reason: 'Family Trip', dates: 'June 10 - June 12' }
        ])
      }
    }
    fetchLeaves()
  }, [])

  const handleSubmit = (id: number, action: 'Approved' | 'Rejected') => {
    alert(`Leave request ${action} for ID ${id}`)
    setLeaves((prev) => prev.filter((leave) => leave.id !== id))
  }

  return (
    <div className="bg-white border border-red-100 rounded-xl p-4 shadow-sm">
      <h2 className="text-lg font-semibold mb-4 text-gray-800">📝 Leave Requests</h2>
      {leaves.length === 0 ? (
        <p className="text-sm text-gray-500 italic">✅ No pending requests</p>
      ) : (
        <ul className="space-y-4">
          {leaves.map((leave) => (
            <li
              key={leave.id}
              className="border border-red-200 p-4 rounded-lg bg-red-50 flex flex-col sm:flex-row justify-between gap-4 items-start sm:items-center"
            >
              <div>
                <p className="font-semibold text-gray-800">{leave.name}</p>
                <p className="text-sm text-gray-600">
                  {leave.reason} — <span className="text-red-600">{leave.dates}</span>
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleSubmit(leave.id, 'Approved')}
                  className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 text-sm"
                >
                  Approve
                </button>
                <button
                  onClick={() => handleSubmit(leave.id, 'Rejected')}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-sm"
                >
                  Reject
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
