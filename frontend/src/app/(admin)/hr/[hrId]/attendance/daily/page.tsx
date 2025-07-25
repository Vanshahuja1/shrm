'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

interface AttendanceRecord {
  name: string
  department: string
  present: number
  absent: number
  leaves: number
}

function getPreviousMonthName(): string {
  const now = new Date()
  const prevMonth = new Date(now.getFullYear(), now.getMonth() - 1)
  return prevMonth.toLocaleString('default', { month: 'long', year: 'numeric' })
}

function getToday(): string {
  return new Date().toLocaleDateString(undefined, {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

export default function DailyAttendance() {
  const [data, setData] = useState<AttendanceRecord[] | null>(null)

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const res = await fetch('/api/attendance/daily')
        const data: AttendanceRecord[] = await res.json()
        setData(data)
      } catch {
        setData([
          { name: 'Alice Sharma', department: 'Engineering', present: 22, absent: 2, leaves: 3 },
          { name: 'Bob Verma', department: 'Marketing', present: 20, absent: 4, leaves: 2 },
          { name: 'Neha Reddy', department: 'HR', present: 21, absent: 3, leaves: 4 },
          { name: 'Vikram Patel', department: 'Sales', present: 23, absent: 1, leaves: 1 },
          { name: 'Sara Ali', department: 'Finance', present: 19, absent: 5, leaves: 5 }
        ])
      }
    }
    fetchAttendance()
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-white border rounded-xl p-6 shadow-sm text-gray-800"
    >
      <h2 className="text-lg font-semibold mb-2">📅 Daily Attendance</h2>
      <p className="text-sm text-gray-600 mb-6">
        Overview as of <span className="font-medium">{getToday()}</span>
      </p>

      <motion.div
        whileHover={{ scale: 1.02 }}
        transition={{ type: 'spring', stiffness: 160 }}
        className="mb-6 border border-red-100 rounded-lg p-4 bg-red-50/40"
      >
        <p className="font-semibold text-red-600 mb-1">Today’s Snapshot</p>
        <div className="text-sm text-gray-700">
          ✔️ Present: <span className="font-medium text-blue-600">45</span> | ❌ Absent:{' '}
          <span className="font-medium text-red-600">6</span> | 📋 Leaves:{' '}
          <span className="font-medium text-purple-600">2</span>
        </div>
      </motion.div>

      {data && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <h3 className="text-md font-semibold text-gray-700 mb-3">
            📊 Monthly Summary — <span className="text-red-600">{getPreviousMonthName()}</span>
          </h3>

          <div className="block sm:hidden space-y-4">
            {data.map((emp, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.01 }}
                transition={{ type: 'spring', stiffness: 200, damping: 18 }}
                className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm shadow-sm"
              >
                <p><span className="font-semibold">Name:</span> {emp.name}</p>
                <p><span className="font-semibold">Department:</span> {emp.department}</p>
                <p><span className="text-blue-600 font-medium">Present:</span> {emp.present}</p>
                <p><span className="text-red-600 font-medium">Absent:</span> {emp.absent}</p>
                <p><span className="text-purple-600 font-medium">Leaves:</span> {emp.leaves}</p>
              </motion.div>
            ))}
          </div>

          <div className="hidden sm:block overflow-x-auto">
            <table className="min-w-full text-sm border rounded-lg overflow-hidden">
              <thead className="bg-red-50 text-gray-800">
                <tr>
                  <th className="text-left px-4 py-2 border-b">Name</th>
                  <th className="text-left px-4 py-2 border-b">Department</th>
                  <th className="text-left px-4 py-2 border-b text-blue-600">Present</th>
                  <th className="text-left px-4 py-2 border-b text-red-600">Absent</th>
                  <th className="text-left px-4 py-2 border-b text-purple-600">Leaves</th>
                </tr>
              </thead>
              <tbody>
                {data.map((emp, i) => (
                  <motion.tr
                    key={i}
                    whileHover={{ scale: 1.01 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 18 }}
                    className="border-t hover:bg-red-50"
                  >
                    <td className="px-4 py-2 border-b">{emp.name}</td>
                    <td className="px-4 py-2 border-b">{emp.department}</td>
                    <td className="px-4 py-2 border-b text-blue-600 font-medium">{emp.present}</td>
                    <td className="px-4 py-2 border-b text-red-600 font-medium">{emp.absent}</td>
                    <td className="px-4 py-2 border-b text-purple-600 font-medium">{emp.leaves}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}
    </motion.div>
  )
}
