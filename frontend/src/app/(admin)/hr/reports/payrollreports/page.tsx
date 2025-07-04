'use client'

import { useEffect, useState } from 'react'

type PayrollEntry = {
  id: number
  name: string
  base: number
  bonus: number
  deduction: number
}

export default function PayrollReports() {
  const [data, setData] = useState<PayrollEntry[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPayroll = async () => {
      try {
        const res = await fetch('/api/reports/payroll')
        if (!res.ok) throw new Error('Failed to fetch')
        const json: PayrollEntry[] = await res.json()
        setData(json)
      } catch {
        setData([
          { id: 1, name: 'Ayesha Khan', base: 80000, bonus: 5000, deduction: 2000 },
          { id: 2, name: 'Rohan Mehta', base: 75000, bonus: 3000, deduction: 1000 }
        ])
      } finally {
        setLoading(false)
      }
    }

    fetchPayroll()
  }, [])

  if (loading) return <p className="text-gray-500">Loading payroll data...</p>

  return (
    <div className="bg-white border rounded-xl p-4 shadow text-gray-800">
      <h2 className="text-xl font-bold mb-4">💰 Payroll Reports</h2>

      {/* 📱 Mobile Card UI */}
      <div className="block sm:hidden space-y-4">
        {data.map((e) => {
          const net = e.base + e.bonus - e.deduction
          return (
            <div
              key={e.id}
              className="bg-red-50 border border-red-200 rounded-xl p-4 shadow-sm text-sm"
            >
              <p><span className="font-semibold">Name:</span> {e.name}</p>
              <p><span className="font-semibold">Base Salary:</span> ₹{e.base.toLocaleString()}</p>
              <p>
                <span className="font-semibold">Bonus:</span>{' '}
                <span className="text-green-700 font-medium">+₹{e.bonus.toLocaleString()}</span>
              </p>
              <p>
                <span className="font-semibold">Deductions:</span>{' '}
                <span className="text-red-600 font-medium">-₹{e.deduction.toLocaleString()}</span>
              </p>
              <p>
                <span className="font-semibold">Net Pay:</span>{' '}
                <span className="font-semibold">₹{net.toLocaleString()}</span>
              </p>
            </div>
          )
        })}
      </div>

      {/* 💻 Desktop Table UI */}
      <div className="hidden sm:block overflow-x-auto w-full">
        <table className="w-full text-sm border rounded min-w-[600px]">
          <thead className="bg-gray-100">
            <tr>
              <th className="text-left px-4 py-2 border-b whitespace-nowrap">Employee</th>
              <th className="text-left px-4 py-2 border-b whitespace-nowrap">Base Salary (₹)</th>
              <th className="text-left px-4 py-2 border-b whitespace-nowrap">Bonus (₹)</th>
              <th className="text-left px-4 py-2 border-b whitespace-nowrap">Deductions (₹)</th>
              <th className="text-left px-4 py-2 border-b whitespace-nowrap">Net Pay (₹)</th>
            </tr>
          </thead>
          <tbody>
            {data.map((e) => {
              const net = e.base + e.bonus - e.deduction
              return (
                <tr key={e.id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 border-b">{e.name}</td>
                  <td className="px-4 py-2 border-b">₹{e.base.toLocaleString()}</td>
                  <td className="px-4 py-2 border-b text-green-700 font-medium">+₹{e.bonus.toLocaleString()}</td>
                  <td className="px-4 py-2 border-b text-red-600 font-medium">-₹{e.deduction.toLocaleString()}</td>
                  <td className="px-4 py-2 border-b font-semibold">₹{net.toLocaleString()}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
