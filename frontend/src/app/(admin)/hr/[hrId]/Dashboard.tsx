'use client'

import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { CircularProgress } from '@mui/material'
import { ResponsiveContainer, BarChart, Bar, XAxis, Tooltip } from 'recharts'
import { motion } from 'framer-motion'
import { useParams } from 'next/navigation'
import axios from '@/lib/axiosInstance'

interface EmployeeInfo {
  id: string
  email: string
  phone: string
  name: string
  role: string
  department: string
  organization: string
  salary: number
  contactInfo: {
    email: string
    phone: string
    address: string
  }
}

interface AttendanceInfo {
  date: string
  punchIn: string
  punchOut: string | null
  totalHours: number
  status: string
}

interface EmployeeAttendanceRecord {
  employeeInfo: EmployeeInfo
  attendance: AttendanceInfo | null
}

type DashboardData = {
  totalEmployees: number
  employeesPresent: number
  employeesOnLeave: number
  employeesLate: number
  attendanceBar: { month: string; value: number }[]
  presentList: { name: string; checkin: string; status: string }[]
  leaveList: { name: string; days: string }[]
  attendanceToday: { name: string; id: string; checkin: string; checkout: string }[]
  birthdays: { name: string; date: string }[]
}

const Dashboard = () => {
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<DashboardData | null>(null)
  const [hrName, setHrName] = useState('')
  const { hrId } = useParams()

  useEffect(() => {
    const fetchHrName = async () => {
      try {
        const res = await axios.get(`user/${hrId}`)
        setHrName(res.data.data.name)
      } catch (error) {
        console.error('Failed to fetch HR name:', error)
        setHrName('HR')
      }
    }
    if (hrId) {
      fetchHrName()
    }
  }, [hrId])

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true)
        // Fetch attendance data using the same logic as DailyAttendance
        const res = await axios.get(`/attendance/hr/${hrId}`)
        const attendanceRecords: EmployeeAttendanceRecord[] = res.data.attendanceRecords || []
        
        // Process the data to match dashboard format
        const totalEmployees = attendanceRecords.length
        const employeesPresent = attendanceRecords.filter(record => 
          record.attendance?.status === 'present'
        ).length
        const employeesOnLeave = attendanceRecords.filter(record => 
          record.attendance?.status === 'leave'
        ).length
        const employeesAbsent = attendanceRecords.filter(record => 
          !record.attendance || record.attendance.status === 'absent'
        ).length
        const employeesLate = attendanceRecords.filter(record => 
          record.attendance?.status === 'late'
        ).length

        // Create attendance today data
        const attendanceToday = attendanceRecords
          .filter(record => record.attendance)
          .map(record => ({
            name: record.employeeInfo.name,
            id: record.employeeInfo.id,
            checkin: record.attendance?.punchIn || '--:--',
            checkout: record.attendance?.punchOut || '-'
          }))

        // Mock data for charts and other sections (since we don't have historical data)
        const dashboardData: DashboardData = {
          totalEmployees,
          employeesPresent,
          employeesOnLeave,
          employeesLate,
          attendanceBar: [
            { month: 'Jan', value: Math.max(1, totalEmployees - 20) },
            { month: 'Feb', value: Math.max(1, totalEmployees - 15) },
            { month: 'Mar', value: Math.max(1, totalEmployees - 10) },
            { month: 'Apr', value: Math.max(1, totalEmployees - 5) },
            { month: 'May', value: totalEmployees }
          ],
          presentList: attendanceRecords
            .filter(record => record.attendance?.status === 'present')
            .slice(0, 5)
            .map(record => ({
              name: record.employeeInfo.name,
              checkin: record.attendance?.punchIn || '--:--',
              status: 'present'
            })),
          leaveList: attendanceRecords
            .filter(record => record.attendance?.status === 'leave')
            .slice(0, 5)
            .map(record => ({
              name: record.employeeInfo.name,
              days: '1/3' // Mock data since we don't have leave days info
            })),
          attendanceToday,
          birthdays: [] // Mock empty since we don't have birthday data
        }

        setData(dashboardData)
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error)
        // Fallback to mock data if API fails
        setData({
          totalEmployees: 53,
          employeesPresent: 44,
          employeesOnLeave: 9,
          employeesLate: 0,
          attendanceBar: [
            { month: 'Jan', value: 30 },
            { month: 'Feb', value: 40 },
            { month: 'Mar', value: 45 },
            { month: 'Apr', value: 50 },
            { month: 'May', value: 53 }
          ],
          presentList: [
            { name: 'Kitty', checkin: '09.02', status: 'present' },
            { name: 'Olivia', checkin: '09.04', status: 'present' },
            { name: 'Peter', checkin: '09.05', status: 'present' }
          ],
          leaveList: [
            { name: 'Kitty', days: '2/3' },
            { name: 'Olivia', days: '4/5' }
          ],
          attendanceToday: [
            { name: 'Adhvik', id: '14', checkin: '09:00 AM', checkout: '-' }
          ],
          birthdays: [
            { name: 'Kitty', date: '21 Jan 2025' }
          ]
        })
      } finally {
        setLoading(false)
      }
    }

    if (hrId) {
      fetchDashboardData()
    }
  }, [hrId])

  if (loading || !data) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <CircularProgress color="error" />
      </div>
    )
  }

  // Calculate percentages for circular progress
  const presentPercentage = data.totalEmployees > 0 
    ? Math.round((data.employeesPresent / data.totalEmployees) * 100) 
    : 0
  const leavePercentage = data.totalEmployees > 0 
    ? Math.round((data.employeesOnLeave / data.totalEmployees) * 100) 
    : 0
  const latePercentage = data.totalEmployees > 0 
    ? Math.round((data.employeesLate / data.totalEmployees) * 100) 
    : 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="max-w-7xl mx-auto px-6 py-10"
    >
      <h1 className="text-2xl font-bold mb-2">Hello, {hrName}!</h1>
      <p className="mb-6 text-gray-600">Hope you&apos;re having a productive day :)</p>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader>Total Employees</CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-3xl font-bold text-indigo-700">{data.totalEmployees}</span>
              <div className="w-24 h-16">
                <ResponsiveContainer width="100%" height={60}>
                  <BarChart data={data.attendanceBar}>
                    <Bar dataKey="value" fill="#6366f1" radius={[6, 6, 0, 0]} />
                    <XAxis dataKey="month" fontSize={10} stroke="#6b7280" />
                    <Tooltip />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>Employee&apos;s Present Today</CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-3xl font-bold text-green-700">{data.employeesPresent}</span>
              <CircularProgress 
                variant="determinate" 
                value={presentPercentage} 
                color="success" 
                size={60} 
                thickness={5} 
              />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>Employee&apos;s on Leave</CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-3xl font-bold text-red-700">{data.totalEmployees - data.employeesPresent}</span>
              <CircularProgress 
                variant="determinate" 
                value={leavePercentage} 
                color="error" 
                size={60} 
                thickness={5} 
              />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>Employee&apos;s Late Today</CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-3xl font-bold text-yellow-700">{data.employeesLate}</span>
              <CircularProgress 
                variant="determinate" 
                value={latePercentage} 
                color="warning" 
                size={60} 
                thickness={5} 
              />
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">       
      </div>
      
      <div className="bg-white rounded-xl border shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Today&apos;s Attendance</h3>
        {data.attendanceToday.length > 0 ? (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-gray-500 text-left">
                <th className="py-2">Emp Name</th>
                <th className="py-2">Emp Id</th>
                <th className="py-2">Check-in</th>
                <th className="py-2">Check-out</th>
              </tr>
            </thead>
            <tbody>
              {data.attendanceToday.map((row, idx) => (
                <tr key={idx} className="border-t">
                  <td className="py-2 flex items-center gap-2">
                    <span className="rounded-full bg-green-100 w-7 h-7 flex items-center justify-center font-bold text-green-700">
                      {row.name[0]}
                    </span>
                    {row.name}
                  </td>
                  <td className="py-2">{row.id}</td>
                  <td className="py-2">{row.checkin}</td>
                  <td className="py-2">{row.checkout}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p>No attendance records found for today</p>
          </div>
        )}
      </div>
    </motion.div>
  )
}

export default Dashboard