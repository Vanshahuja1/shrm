'use client'

import { useEffect, useState, ChangeEvent } from 'react'

interface Employee {
  id: number
  name: string
  email: string
}

export default function PenaltyPage() {
  const [employees, setEmployees] = useState<Employee[]>([])
  const [selected, setSelected] = useState<number | null>(null)
  const [reason, setReason] = useState<string>('')
  const [issued, setIssued] = useState<Record<number, string>>({})

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/employees')
        const data: Employee[] = await res.json()
        setEmployees(data)
      } catch {
        setEmployees([
          { id: 1, name: 'Vansh Ahuja', email: 'vansh@company.com' },
          { id: 2, name: 'Neha Reddy', email: 'neha@company.com' }
        ])
      }
    }

    fetchData()
  }, [])

  const handleSendPenalty = async (id: number) => {
    if (!reason.trim()) return alert('Please enter a reason')
    await fetch('/api/penalty', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ employeeId: id, reason })
    })
    setIssued((prev) => ({ ...prev, [id]: reason }))
    setSelected(null)
    setReason('')
    alert('📩 Penalty email sent.')
  }

  return (
    <div className="p-4 sm:p-6 max-w-5xl mx-auto text-gray-800">
      <h1 className="text-xl sm:text-2xl font-bold mb-4 text-gray-900">🚫 Penalty Notices</h1>

      <div className="block sm:hidden space-y-4">
        {employees.map((emp) => {
          const isSelected = selected === emp.id
          return (
            <div key={emp.id} className="bg-red-50 border border-red-200 rounded-xl p-4 shadow-sm text-sm">
              <p><span className="font-semibold">Name:</span> {emp.name}</p>
              <p><span className="font-semibold">Email:</span> {emp.email}</p>
              <p><span className="font-semibold">Penalty Reason:</span>{' '}
                {issued[emp.id] ? (
                  <span className="text-green-600">{issued[emp.id]}</span>
                ) : isSelected ? (
                  <input
                    type="text"
                    value={reason}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setReason(e.target.value)}
                    placeholder="Enter reason"
                    className="border px-2 py-1 rounded w-full mt-1"
                  />
                ) : (
                  '-'
                )}
              </p>
              <div className="mt-3">
                {issued[emp.id] ? (
                  <span className="text-green-600 text-xs">Penalty Sent</span>
                ) : isSelected ? (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleSendPenalty(emp.id)}
                      className="text-xs bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 w-full"
                    >
                      Send
                    </button>
                    <button
                      onClick={() => {
                        setSelected(null)
                        setReason('')
                      }}
                      className="text-xs bg-gray-300 text-gray-700 px-3 py-1 rounded w-full"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setSelected(emp.id)}
                    className="text-xs bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 w-full"
                  >
                    Issue Penalty
                  </button>
                )}
              </div>
            </div>
          )
        })}
      </div>

      <div className="hidden sm:block overflow-x-auto bg-white border border-red-100 rounded-xl shadow-sm">
        <table className="min-w-full text-sm">
          <thead className="bg-red-50 text-gray-800">
            <tr>
              <th className="text-left px-4 py-2 border-b">Name</th>
              <th className="text-left px-4 py-2 border-b">Email</th>
              <th className="text-left px-4 py-2 border-b">Penalty Reason</th>
              <th className="text-left px-4 py-2 border-b">Action</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((emp) => {
              const isSelected = selected === emp.id
              return (
                <tr key={emp.id} className="text-gray-700 hover:bg-red-50">
                  <td className="px-4 py-2 border-b">{emp.name}</td>
                  <td className="px-4 py-2 border-b">{emp.email}</td>
                  <td className="px-4 py-2 border-b">
                    {issued[emp.id] || (
                      isSelected && (
                        <input
                          type="text"
                          value={reason}
                          onChange={(e: ChangeEvent<HTMLInputElement>) => setReason(e.target.value)}
                          placeholder="Enter reason"
                          className="border px-2 py-1 rounded w-full text-sm"
                        />
                      )
                    )}
                  </td>
                  <td className="px-4 py-2 border-b">
                    {issued[emp.id] ? (
                      <span className="text-green-600 text-xs">Penalty Sent</span>
                    ) : isSelected ? (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleSendPenalty(emp.id)}
                          className="text-xs bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                        >
                          Send
                        </button>
                        <button
                          className="text-xs bg-gray-300 text-gray-700 px-3 py-1 rounded"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setSelected(emp.id)}
                        className="text-xs bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                      >
                        Issue Penalty
                      </button>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
