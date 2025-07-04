'use client'

import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { motion } from 'framer-motion'

interface AttendanceDay {
  date: Date
  status: 'Present' | 'Absent'
}

interface Employee {
  id: number
  name: string
}

const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
]

const dummyEmployees: Employee[] = [
  { id: 1, name: 'Alice Sharma' },
  { id: 2, name: 'Bob Verma' },
  { id: 3, name: 'Neha Reddy' }
]

const generateDummyStatus = (year: number, month: number): AttendanceDay[] => {
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  return Array.from({ length: daysInMonth }, (_, i) => ({
    date: new Date(year, month, i + 1),
    status: Math.random() > 0.2 ? 'Present' : 'Absent'
  }))
}

export default function MonthlyCalendar() {
  const today = new Date()
  const [data, setData] = useState<AttendanceDay[]>([])
  const [selectedMonth, setSelectedMonth] = useState(today.getMonth())
  const [selectedYear, setSelectedYear] = useState(today.getFullYear())
  const [selectedEmployee, setSelectedEmployee] = useState<number>(dummyEmployees[0].id)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`/api/attendance/monthly?empId=${selectedEmployee}&month=${selectedMonth}&year=${selectedYear}`)
        const result = await res.json()
        const parsed: AttendanceDay[] = result.map((item: { date: string; status: 'Present' | 'Absent' }) => ({
          date: new Date(item.date),
          status: item.status
        }))
        setData(parsed)
      } catch {
        setData(generateDummyStatus(selectedYear, selectedMonth))
      }
    }
    fetchData()
  }, [selectedMonth, selectedYear, selectedEmployee])

  const firstDay = new Date(selectedYear, selectedMonth, 1).getDay()

  const handleMonthChange = (offset: number) => {
    let newMonth = selectedMonth + offset
    let newYear = selectedYear
    if (newMonth < 0) {
      newMonth = 11
      newYear--
    } else if (newMonth > 11) {
      newMonth = 0
      newYear++
    }
    setSelectedMonth(newMonth)
    setSelectedYear(newYear)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-white border rounded-xl p-6 shadow"
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-4">
        <div className="flex items-center gap-2 flex-wrap">
          <h2 className="text-lg font-semibold text-gray-800">📆 Monthly Attendance</h2>
          <select
            className="border rounded px-2 py-1 text-sm text-gray-800"
            value={selectedEmployee}
            onChange={(e) => setSelectedEmployee(Number(e.target.value))}
          >
            {dummyEmployees.map(emp => (
              <option key={emp.id} value={emp.id}>{emp.name}</option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => handleMonthChange(-1)} className="p-2 rounded text-gray-800 hover:bg-gray-100">
            <ChevronLeft size={18} />
          </button>
          <select
            className="border rounded px-2 py-1 text-sm text-gray-800"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(Number(e.target.value))}
          >
            {months.map((m, idx) => (
              <option key={m} value={idx}>{m}</option>
            ))}
          </select>
          <select
            className="border rounded px-2 py-1 text-sm text-gray-800"
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
          >
            {Array.from({ length: 20 }, (_, i) => 2010 + i).map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
          <button onClick={() => handleMonthChange(1)} className="p-2 rounded text-gray-800 hover:bg-gray-100">
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
      <div className="flex gap-6 text-sm mb-3">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-blue-500 rounded-full" />
          <span className="text-gray-600">Present</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-red-500 rounded-full" />
          <span className="text-gray-600">Absent</span>
        </div>
      </div>
      <div className="grid grid-cols-7 text-center text-xs text-gray-500 font-medium mb-1">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
          <div key={d}>{d}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-2 text-sm">
        {Array.from({ length: firstDay }).map((_, i) => (
          <div key={`pad-${i}`} />
        ))}
        {data.map(({ date, status }) => {
          const isToday =
            date.getDate() === today.getDate() &&
            date.getMonth() === today.getMonth() &&
            date.getFullYear() === today.getFullYear()

          const colorClass =
            status === 'Present' ? 'bg-blue-100 text-blue-700' : 'bg-red-100 text-red-700'

          return (
            <motion.div
              key={date.toISOString()}
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
              title={`${status} on ${date.toDateString()}`}
              className={`h-16 sm:h-20 flex flex-col items-center justify-center border font-medium rounded-md overflow-hidden
                ${colorClass} ${isToday ? 'ring-2 ring-red-400' : ''} hover:scale-105 transition-transform duration-200`}
            >
              {date.getDate()}
            </motion.div>
          )
        })}
      </div>
    </motion.div>
  )
}
