'use client'

import { useEffect, useState } from 'react'

interface EmployeeIncrement {
  id: number
  name: string
  current: number
  percent: number
}

export default function IncrementProcessing() {
  const [increments, setIncrements] = useState<EmployeeIncrement[]>([])
  const [processedIds, setProcessedIds] = useState<number[]>([])

  useEffect(() => {
    const fetchIncrements = async () => {
      try {
        const res = await fetch('/api/increments')
        const data = await res.json()
        setIncrements(data)
      } catch {
        setIncrements([
          { id: 1, name: 'Alice Sharma', current: 50000, percent: 10 },
          { id: 2, name: 'Bob Verma', current: 40000, percent: 12 },
          { id: 3, name: 'Neha Reddy', current: 45000, percent: 8 }
        ])
      }
    }
    fetchIncrements()
  }, [])

  const handleIncrement = async (emp: EmployeeIncrement) => {
    const newSalary = emp.current + (emp.current * emp.percent) / 100

    try {
      await fetch('/api/increments/notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: emp.name,
          newSalary,
          percentage: emp.percent
        })
      })

      alert(`✅ Mail sent to manager for ${emp.name}`)
      setProcessedIds((prev) => [...prev, emp.id])
    } catch {
      alert('❌ Failed to send email')
    }
  }

  return (
    <div className="bg-white border rounded-xl p-4 sm:p-6 shadow-sm">
      <h2 className="text-base sm:text-lg font-semibold mb-4 text-gray-800">
        📈 Increment Processing
      </h2>

      {/* 🖥️ Desktop Table */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="min-w-full text-sm border rounded-lg overflow-hidden">
          <thead className="bg-green-50 text-gray-800">
            <tr>
              <th className="text-left px-4 py-2 border-b">Name</th>
              <th className="text-left px-4 py-2 border-b">Current Salary</th>
              <th className="text-left px-4 py-2 border-b">Increment %</th>
              <th className="text-left px-4 py-2 border-b">Action</th>
            </tr>
          </thead>
          <tbody>
            {increments.map((emp) => (
              <tr key={emp.id} className="hover:bg-green-50 text-gray-800 transition">
                <td className="px-4 py-2 border-b">{emp.name}</td>
                <td className="px-4 py-2 border-b">₹ {emp.current.toLocaleString()}</td>
                <td className="px-4 py-2 border-b">{emp.percent}%</td>
                <td className="px-4 py-2 border-b">
                  <button
                    onClick={() => handleIncrement(emp)}
                    disabled={processedIds.includes(emp.id)}
                    className={`px-3 py-1 rounded text-sm font-medium ${
                      processedIds.includes(emp.id)
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-green-600 text-white hover:bg-green-700'
                    }`}
                  >
                    {processedIds.includes(emp.id) ? 'Increment Sent' : 'Process Increment'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 📱 Mobile Cards */}
      <div className="sm:hidden space-y-4">
        {increments.map((emp) => (
          <div
            key={emp.id}
            className="border rounded-lg p-3 shadow-sm bg-green-50 text-gray-800 space-y-1"
          >
            <div><strong>Name:</strong> {emp.name}</div>
            <div><strong>Current:</strong> ₹ {emp.current.toLocaleString()}</div>
            <div><strong>Increment:</strong> {emp.percent}%</div>
            <button
              onClick={() => handleIncrement(emp)}
              disabled={processedIds.includes(emp.id)}
              className={`mt-2 px-3 py-1 w-full text-xs font-medium rounded ${
                processedIds.includes(emp.id)
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-green-600 text-white hover:bg-green-700'
              }`}
            >
              {processedIds.includes(emp.id) ? 'Increment Sent' : 'Process Increment'}
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
