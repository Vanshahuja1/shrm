'use client'

import { useState, useEffect, useRef } from 'react'
import { ChevronLeft, ChevronRight, Search, X, User } from 'lucide-react'

interface AttendanceDay {
  date: Date
  status: 'Present' | 'Absent' | ''  // Empty string for future dates
  punchIn?: string
  punchOut?: string
  totalHours?: number
  breakTime?: number
}

interface Employee {
  id: string
  name: string
  department?: string
  email?: string
  phone?: string
  role?: string
  organization?: string
  salary?: number
}

interface AttendanceRecord {
  date: string
  punchIn: string | null
  punchOut: string | null
  totalHours: number
  status: string
  breakTime: number
}

interface ApiResponse {
  employeeInfo: Employee
  attendanceRecords: AttendanceRecord[]
}

const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
]

import axiosInstance from '@/lib/axiosInstance'

export default function MonthlyCalendar() {
  const today = new Date()
  const [data, setData] = useState<AttendanceDay[]>([])
  const [selectedMonth, setSelectedMonth] = useState(today.getMonth())
  const [selectedYear, setSelectedYear] = useState(today.getFullYear())
  const [employees, setEmployees] = useState<Employee[]>([])
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null)
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [highlightedIndex, setHighlightedIndex] = useState(-1)
  const searchRef = useRef<HTMLDivElement>(null)

  // Filter employees based on search
  const filteredEmployees = searchTerm 
    ? employees.filter(emp =>
        emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.department?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.email?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : []

  const exportToCSV = () => {
    if (!selectedEmployee) return
    
    const headers = ['Date', 'Day', 'Status', 'Punch In', 'Punch Out', 'Total Hours', 'Break Time']
    const rows = data.map(({ date, status, punchIn, punchOut, totalHours, breakTime }) => [
      date.toLocaleDateString(),
      date.toLocaleDateString('en-US', { weekday: 'long' }),
      status || 'Upcoming',
      punchIn || '',
      punchOut || '',
      totalHours?.toString() || '',
      breakTime?.toString() || ''
    ])
    
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => 
        /[,"\n]/.test(cell) ? `"${cell.replace(/"/g, '""')}"` : cell
      ).join(','))
    ].join('\n')
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    
    link.setAttribute('href', url)
    link.setAttribute('download', `attendance_${selectedEmployee.name.replace(/\s+/g, '_')}_${months[selectedMonth]}_${selectedYear}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // Fetch employees on component mount
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        setLoading(true)
        const res = await axiosInstance.get(`IT/org-members/empInfo`)
        setEmployees(res.data)
      } catch (error) {
        console.error('Error fetching employees:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchEmployees()
  }, [])

  // Generate calendar data based on attendance records
  const generateCalendarData = (attendanceRecords: AttendanceRecord[], year: number, month: number): AttendanceDay[] => {
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    const today = new Date()
    const currentDate = new Date(today.getFullYear(), today.getMonth(), today.getDate())
    
    return Array.from({ length: daysInMonth }, (_, i) => {
      const date = new Date(year, month, i + 1)
      const isFutureDate = date > currentDate
      
      // Find attendance record for this date
      const attendanceRecord = attendanceRecords.find(record => {
        const recordDate = new Date(record.date)
        return recordDate.getDate() === date.getDate() &&
               recordDate.getMonth() === date.getMonth() &&
               recordDate.getFullYear() === date.getFullYear()
      })
      
      if (isFutureDate) {
        return { date, status: '' as const }
      }
      
      if (attendanceRecord) {
        return {
          date,
          status: attendanceRecord.status === 'present' ? 'Present' as const : 'Absent' as const,
          punchIn: attendanceRecord.punchIn || undefined,
          punchOut: attendanceRecord.punchOut || undefined,
          totalHours: attendanceRecord.totalHours,
          breakTime: attendanceRecord.breakTime
        }
      }
      
      // No record found for past date - mark as absent
      return { date, status: 'Absent' as const }
    })
  }

  // Fetch attendance data when employee, month, or year changes
  useEffect(() => {
    if (!selectedEmployee) {
      setData([])
      return
    }

    const fetchAttendanceData = async () => {
      try {
        setLoading(true)
        const res = await axiosInstance.get(`/attendance/hr/employee/${selectedEmployee.id}`)
        console.log('API Response:', res.data)
        
        const calendarData = generateCalendarData(
          res.data.attendanceRecords || [], 
          selectedYear, 
          selectedMonth
        )
        setData(calendarData)
        
      } catch (error) {
        console.error('Error fetching attendance data:', error)
        // Generate empty calendar on error
        setData(generateCalendarData([], selectedYear, selectedMonth))
      } finally {
        setLoading(false)
      }
    }

    fetchAttendanceData()
  }, [selectedEmployee, selectedMonth, selectedYear])

  // Handle clicking outside search
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false)
        setSearchTerm('')
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

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

  const handleEmployeeSelect = (employee: Employee) => {
    setSelectedEmployee(employee)
    setIsSearchOpen(false)
    setSearchTerm('')
    setHighlightedIndex(-1)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isSearchOpen || filteredEmployees.length === 0) return

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setHighlightedIndex(prev => 
          prev < filteredEmployees.length - 1 ? prev + 1 : 0
        )
        break
      case 'ArrowUp':
        e.preventDefault()
        setHighlightedIndex(prev => 
          prev > 0 ? prev - 1 : filteredEmployees.length - 1
        )
        break
      case 'Enter':
        e.preventDefault()
        if (highlightedIndex >= 0) {
          handleEmployeeSelect(filteredEmployees[highlightedIndex])
        }
        break
      case 'Escape':
        setIsSearchOpen(false)
        setSearchTerm('')
        break
    }
  }

  return (
    <div className="bg-white border rounded-xl p-6 shadow relative">
      {loading && (
        <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-20 rounded-xl">
          <div className="flex items-center gap-2 text-blue-600">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            <span>Loading...</span>
          </div>
        </div>
      )}
      
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-semibold text-gray-800 whitespace-nowrap">📆 Monthly Attendance</h2>
            <button
              onClick={exportToCSV}
              disabled={loading || !selectedEmployee}
              className="flex items-center gap-2 px-3 py-1.5 text-sm bg-green-50 text-green-600 rounded-lg hover:bg-green-100 border border-green-200 transition-colors disabled:opacity-50"
              title="Export current month's attendance"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Export CSV
            </button>
          </div>
          
          {/* Employee Search/Selector */}
          <div className="relative w-full sm:w-72 md:w-80" ref={searchRef}>
            <div className="flex items-center gap-2">
              {/* Selected Employee Display */}
              <div className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2 border w-full">
                <User size={18} className="text-gray-600 flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  {selectedEmployee ? (
                    <>
                      <div className="font-medium text-sm text-gray-800 truncate">
                        {selectedEmployee.name} ({selectedEmployee.id})
                      </div>
                      <div className="text-xs text-gray-500 truncate">
                        {selectedEmployee.department} • {selectedEmployee.email}
                      </div>
                    </>
                  ) : (
                    <div className="font-medium text-sm text-gray-500">
                      Select Employee
                    </div>
                  )}
                </div>
                <button
                  onClick={() => setIsSearchOpen(true)}
                  className="text-gray-400 hover:text-gray-600 flex-shrink-0 p-1 rounded-md hover:bg-gray-100"
                >
                  <Search size={18} />
                </button>
              </div>
            </div>

            {/* Search Input */}
            {isSearchOpen && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white border rounded-lg shadow-lg z-10 w-full sm:w-72 md:w-80">
                <div className="p-3 border-b">
                  <div className="relative">
                    <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search by name, ID, email, or department..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      onKeyDown={handleKeyDown}
                      className="w-full pl-10 pr-10 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
                      autoFocus
                    />
                    <button
                      onClick={() => {
                        setIsSearchOpen(false)
                        setSearchTerm('')
                      }}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1 hover:bg-gray-100 rounded-full"
                    >
                      <X size={18} />
                    </button>
                  </div>
                </div>
                
                {/* Results */}
                <div className="max-h-72 overflow-y-auto">
                  {filteredEmployees.length === 0 && searchTerm && (
                    <div className="p-4 text-center text-gray-500">
                      No employees found
                    </div>
                  )}
                  {filteredEmployees.map((employee, index) => (
                    <button
                      key={employee.id}
                      onClick={() => handleEmployeeSelect(employee)}
                      className={`w-full text-left p-3.5 hover:bg-gray-50 border-b last:border-b-0 flex items-center gap-3 ${
                        index === highlightedIndex ? 'bg-blue-50' : ''
                      }`}
                    >
                      <User size={18} className="text-gray-600 flex-shrink-0" />
                      <div className="min-w-0">
                        <div className="font-medium text-sm text-gray-800 truncate">
                          {employee.name} ({employee.id})
                        </div>
                        <div className="text-xs text-gray-500 truncate">
                          {employee.department} • {employee.email}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div className="flex items-center justify-center sm:justify-end gap-2">
          <div className="flex items-center gap-1 bg-gray-50 border rounded-lg p-1">
            <button 
              onClick={() => handleMonthChange(-1)} 
              disabled={loading}
              className="p-1.5 rounded-md text-gray-600 hover:bg-gray-200 hover:text-gray-800 transition-colors disabled:opacity-50"
              aria-label="Previous month"
            >
              <ChevronLeft size={18} />
            </button>
            <div className="flex gap-2 px-2">
              <select
                className="bg-transparent border-none rounded py-1 text-sm text-gray-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(Number(e.target.value))}
                disabled={loading}
                aria-label="Select month"
              >
                {months.map((m, idx) => (
                  <option key={m} value={idx}>{m}</option>
                ))}
              </select>
              <select
                className="bg-transparent border-none rounded py-1 text-sm text-gray-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
                value={selectedYear}
                onChange={(e) => setSelectedYear(Number(e.target.value))}
                disabled={loading}
                aria-label="Select year"
              >
                {Array.from({ length: 20 }, (_, i) => 2010 + i).map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
            <button 
              onClick={() => handleMonthChange(1)} 
              disabled={loading}
              className="p-1.5 rounded-md text-gray-600 hover:bg-gray-200 hover:text-gray-800 transition-colors disabled:opacity-50"
              aria-label="Next month"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
      
      <div className="flex flex-wrap gap-4 md:gap-6 text-sm mb-3">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-blue-500 rounded-full" />
          <span className="text-gray-600">Present</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-red-500 rounded-full" />
          <span className="text-gray-600">Absent</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-gray-200 rounded-full" />
          <span className="text-gray-600">Upcoming</span>
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
        {data.map(({ date, status, punchIn, punchOut, totalHours }) => {
          const isToday =
            date.getDate() === today.getDate() &&
            date.getMonth() === today.getMonth() &&
            date.getFullYear() === today.getFullYear()
            
          const isFutureDate = status === ''
          
          let colorClass = ''
          if (!isFutureDate) {
            colorClass = status === 'Present' ? 'bg-blue-100 text-blue-700' : 'bg-red-100 text-red-700'
          } else {
            colorClass = 'bg-gray-50 text-gray-400'
          }

          const tooltipText = isFutureDate 
            ? `Upcoming: ${date.toDateString()}` 
            : `${status} on ${date.toDateString()}${punchIn ? `\nPunch In: ${punchIn}` : ''}${punchOut ? `\nPunch Out: ${punchOut}` : ''}${totalHours ? `\nTotal Hours: ${totalHours}` : ''}`

          return (
            <div
              key={date.toISOString()}
              title={tooltipText}
              className={`h-16 sm:h-20 flex flex-col items-center justify-center border font-medium rounded-md overflow-hidden relative
                ${colorClass} ${isToday ? 'ring-2 ring-blue-500' : ''} ${!isFutureDate ? 'hover:scale-105' : ''} transition-transform duration-200`}
            >
              <div className="text-sm font-semibold">{date.getDate()}</div>
              {punchIn && (
                <div className="text-xs opacity-75 mt-1">
                  {punchIn}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}