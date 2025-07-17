'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Calendar, Building, Trophy, TrendingUp, BadgeCheck, Target } from 'lucide-react'
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts'

type EmployeeReport = {
  id: string
  name: string
  designation: string
  department: string
  email: string
  performance: {
    rating: number
    attendance: number
    projectsCompleted: number
    targetsAchieved: number
  }
  recentActivities: Array<{
    id: number
    type: string
    description: string
    date: string
  }>
}

export default function EmployeeReportDetails({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [report, setReport] = useState<EmployeeReport | null>(null)

  // Mock data for chart
  const weeklyWorkData = [
    { day: 'Sat', hours: 6 },
    { day: 'Sun', hours: 10 },
    { day: 'Mon', hours: 4 },
    { day: 'Tue', hours: 11 },
    { day: 'Wed', hours: 7 },
    { day: 'Thu', hours: 3 },
    { day: 'Fri', hours: 9 }
  ]

  const unwrappedParams = React.use(params)

  useEffect(() => {
    const fetchEmployeeReport = async () => {
      try {
        // Replace with your actual API endpoint
        const res = await fetch(`/api/employee-report/${unwrappedParams.id}`)
        if (!res.ok) throw new Error('API error')
        const data = await res.json()
        setReport(data)
      } catch (error) {
        // Dummy data fallback
        setReport({
          id: unwrappedParams.id,
          name: 'Ayesha Khan',
          designation: 'Senior Developer',
          department: 'Engineering',
          email: 'ayesha@company.com',
          performance: {
            rating: 4.8,
            attendance: 98,
            projectsCompleted: 12,
            targetsAchieved: 95
          },
          recentActivities: [
            {
              id: 1,
              type: 'Project',
              description: 'Completed the frontend redesign project ahead of schedule',
              date: '2025-07-15'
            },
            {
              id: 2,
              type: 'Achievement',
              description: 'Awarded Employee of the Month',
              date: '2025-07-10'
            },
            {
              id: 3,
              type: 'Training',
              description: 'Completed Advanced React Course',
              date: '2025-07-05'
            }
          ]
        })
      } finally {
        setLoading(false)
      }
    }

    fetchEmployeeReport()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!report) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-2xl font-semibold text-gray-900">Report not found</h2>
          <p className="mt-2 text-gray-600">The employee report you're looking for doesn't exist.</p>
          <button
            onClick={() => router.back()}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.back()}
                className="flex items-center text-gray-600 hover:text-red-600 transition-colors"
              >
                <ArrowLeft size={18} className="mr-2" />
                <span>Back to Reports</span>
              </button>
              <div className="h-6 w-px bg-gray-300"></div>
              <h1 className="text-xl font-semibold text-gray-800">Employee Report</h1>
            </div>
            <button
              onClick={() => window.print()}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Download Report
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-6">
        {/* Employee Info Card */}
        <div className="bg-white rounded-xl border shadow-sm p-6">
          <div className="flex items-center space-x-4">
            <div className="h-16 w-16 rounded-full bg-red-100 flex items-center justify-center">
              <span className="text-xl font-semibold text-red-700">{report.name.charAt(0)}</span>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{report.name}</h2>
              <div className="flex items-center space-x-4 mt-1">
                <div className="flex items-center text-gray-500">
                  <Building size={16} className="mr-1" />
                  <span>{report.designation}</span>
                </div>
                <span className="text-gray-300">•</span>
                <div className="flex items-center text-gray-500">
                  <Calendar size={16} className="mr-1" />
                  <span>{report.department}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl border shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">Performance Rating</h3>
              <Trophy size={20} className="text-yellow-500" />
            </div>
            <p className="text-3xl font-bold text-gray-900">{report.performance.rating}</p>
            <p className="text-sm text-gray-500 mt-1">out of 5.0</p>
          </div>

          <div className="bg-white rounded-xl border shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">Attendance Rate</h3>
              <BadgeCheck size={20} className="text-green-500" />
            </div>
            <p className="text-3xl font-bold text-gray-900">{report.performance.attendance}%</p>
            <p className="text-sm text-gray-500 mt-1">Last 30 days</p>
          </div>

          <div className="bg-white rounded-xl border shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">Projects Completed</h3>
              <TrendingUp size={20} className="text-blue-500" />
            </div>
            <p className="text-3xl font-bold text-gray-900">{report.performance.projectsCompleted}</p>
            <p className="text-sm text-gray-500 mt-1">This year</p>
          </div>

          <div className="bg-white rounded-xl border shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">Targets Achieved</h3>
              <Target size={20} className="text-red-500" />
            </div>
            <p className="text-3xl font-bold text-gray-900">{report.performance.targetsAchieved}%</p>
            <p className="text-sm text-gray-500 mt-1">Success rate</p>
          </div>
        </div>

        {/* Weekly Stats & Work Hours Chart */}
        <div className="grid grid-cols-1 gap-6">
          <div className="bg-white rounded-xl border shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Weekly Overview</h3>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">Jul 10 - Jul 16, 2025</span>
              </div>
            </div>
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-600">Projects Worked</span>
                  <span className="text-gray-400">🗂️</span>
                </div>
                <div className="text-2xl font-bold text-gray-900">6h 38m</div>
                <div className="text-xs text-green-600 mt-1">+12% Since last week</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-600">Break Time</span>
                  <span className="text-gray-400">⏰</span>
                </div>
                <div className="text-2xl font-bold text-gray-900">2h 30m</div>
                <div className="text-xs text-red-600 mt-1">-02% Since last week</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-600">AVG. Activity</span>
                  <span className="text-gray-400">📈</span>
                </div>
                <div className="text-2xl font-bold text-gray-900">69%</div>
                <div className="text-xs text-green-600 mt-1">+08% Since last week</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-600">Earned</span>
                  <span className="text-gray-400">💰</span>
                </div>
                <div className="text-2xl font-bold text-gray-900">$328</div>
                <div className="text-xs text-red-600 mt-1">-04% Since last week</div>
              </div>
            </div>
            {/* Work Hours Chart (Recharts) */}
            <div className="bg-gray-50 rounded-lg p-6 mt-2">
              <h4 className="text-md font-semibold text-gray-800 mb-2">Total hours worked per day</h4>
              <ResponsiveContainer width="100%" height={120}>
                <LineChart data={weeklyWorkData} margin={{ top: 10, right: 20, left: 0, bottom: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" stroke="#6b7280" fontSize={12} />
                  <YAxis stroke="#6b7280" fontSize={12} domain={[0, 12]} tickFormatter={h => `${h}h`} />
                  <Tooltip formatter={(value) => `${value} hours`} />
                  <Line type="monotone" dataKey="hours" stroke="#ef4444" strokeWidth={3} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Recent Activities */}
        <div className="bg-white rounded-xl border shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activities</h3>
          <div className="space-y-4">
            {report.recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                <div className="h-8 w-8 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                  <span className="text-xs font-medium text-red-700">{activity.type[0]}</span>
                </div>
                <div className="flex-1">
                  <p className="text-gray-900 font-medium">{activity.description}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    {new Date(activity.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
