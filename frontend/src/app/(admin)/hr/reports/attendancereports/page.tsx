'use client'

import { useEffect, useState } from 'react'

type AttendanceRecord = {
  id: number
  name: string
  presentDays: number
  totalDays: number
}

export default function AttendanceReports() {
  const [data, setData] = useState<AttendanceRecord[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const res = await fetch('/api/reports/attendance')
        if (!res.ok) throw new Error('Fetch failed')
        const json: AttendanceRecord[] = await res.json()
        setData(json)
      } catch {
        setData([
          { id: 1, name: 'Ayesha Khan', presentDays: 20, totalDays: 22 },
          { id: 2, name: 'Rohan Mehta', presentDays: 17, totalDays: 22 }
        ])
      } finally {
        setLoading(false)
      }
    }

    fetchAttendance()
  }, [])

  if (loading) return <p className="text-gray-500">Loading attendance data...</p>

  return (
    <div className="bg-white border rounded-xl p-6 shadow text-gray-800">
      <h2 className="text-xl font-bold mb-4">📅 Attendance Reports</h2>

      {/* Mobile View */}
      <div className="block sm:hidden space-y-4">
        {data.map((emp) => {
          const percent = Number(((emp.presentDays / emp.totalDays) * 100).toFixed(1))
          return (
            <div key={emp.id} className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-sm shadow-sm">
              <p><span className="font-semibold">Name:</span> {emp.name}</p>
              <p><span className="font-semibold">Present Days:</span> {emp.presentDays}</p>
              <p><span className="font-semibold">Total Days:</span> {emp.totalDays}</p>
              <p>
                <span className="font-semibold">Attendance %:</span>{' '}
                <span className={percent < 75 ? 'text-red-600 font-medium' : 'text-green-600 font-medium'}>
                  {percent}%
                </span>
              </p>
            </div>
          )
        })}
      </div>

      {/* Desktop View */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="w-full text-sm border rounded min-w-[500px]">
          <thead className="bg-gray-100">
            <tr>
              <th className="text-left px-4 py-2 border-b">Employee</th>
              <th className="text-left px-4 py-2 border-b">Present Days</th>
              <th className="text-left px-4 py-2 border-b">Total Days</th>
              <th className="text-left px-4 py-2 border-b">Attendance %</th>
            </tr>
          </thead>
          <tbody>
            {data.map((emp) => {
              const percent = Number(((emp.presentDays / emp.totalDays) * 100).toFixed(1))
              return (
                <tr key={emp.id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 border-b">{emp.name}</td>
                  <td className="px-4 py-2 border-b">{emp.presentDays}</td>
                  <td className="px-4 py-2 border-b">{emp.totalDays}</td>
                  <td className="px-4 py-2 border-b">
                    <span className={percent < 75 ? 'text-red-600 font-medium' : 'text-green-600 font-medium'}>
                      {percent}%
                    </span>
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
