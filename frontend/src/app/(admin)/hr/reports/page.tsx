'use client'

import { useState } from 'react'
import EmployeeReports from './employeereports/page'
// import AttendanceReports from './attendancereports/page'
// import PerformanceReports from './performancereports/page'
// import PayrollReports from './payrollreports/page'

const tabs = [
  { id: 'employee', label: '🧑‍💼 Employee Reports' },
  // { id: 'attendance', label: '📅 Attendance Reports' },
  // { id: 'performance', label: '📈 Performance Reports' },
  // { id: 'payroll', label: '💰 Payroll Reports' }
] as const

type TabId = (typeof tabs)[number]['id']

export default function ReportsPage() {
  const [activeTab, setActiveTab] = useState<TabId>('employee')

  return (
    <div className="max-w-6xl mx-auto p-6 text-gray-800">
      <h1 className="text-2xl font-bold mb-6">📊 HR Reports Dashboard</h1>

      <div className="flex flex-wrap gap-2 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition ${
              activeTab === tab.id
                ? 'bg-red-500 text-white hover:bg-red-600'
                : 'bg-red-100 text-red-700 hover:bg-red-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="bg-white p-4 shadow min-h-[300px]">
        {activeTab === 'employee' && <EmployeeReports />}
        {/* {activeTab === 'attendance' && <AttendanceReports />}
        {activeTab === 'performance' && <PerformanceReports />}
        {activeTab === 'payroll' && <PayrollReports />} */}
      </div>
    </div>
  )
}
