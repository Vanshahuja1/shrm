'use client'
import { useEffect, useState } from 'react'
import axios from "@/lib/axiosInstance"
import GeneralNotificationPage from './general/page'
import IncrementNotificationPage from './increment/page'
import PenaltyNotificationPage from './penalty/page'
import SalaryNotificationPage from './salary/page'
import SentboxPage from './sent/page'
import InboxPage from './inbox/page'
import { useParams } from 'next/navigation'

const tabs = [
  { label: 'General Notification', icon: '📢' },
  { label: 'Increment Notification', icon: '📈' },
  { label: 'Penalty Notification', icon: '🚫' },
  { label: 'Salary Notification', icon: '💰' },
  { label: 'Sent', icon: '📤' },
  { label: 'Inbox', icon: '📥' }
]

interface Employee {
  id: number
  name: string
  email: string
  organization: string
  department: string
  role: string
}

export default function NotificationsPage() {
  const [activeTab, setActiveTab] = useState<number>(0)

  const [employees, setEmployees] = useState<Employee[]>([])

  const { hrId } = useParams<{ hrId: string }>()

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await axios.get('/IT/org-members/empInfo')
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        setEmployees(response.data.map((emp: any) => ({
          id: emp._id || emp.id,
          name: emp.name || emp.email.split('@')[0],
          email: emp.email,
          organization: emp.organization || 'N/A',
          department: emp.department || 'N/A',
          role: emp.role || 'N/A'
        })))
      } catch (error) {
        console.error('Error fetching employees:', error)
      }
    }

    fetchEmployees()
  }, []);

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto">
      <h1 className="text-xl sm:text-2xl font-bold mb-4 text-gray-900">📨 Notifications</h1>

      <div className="flex flex-wrap gap-2 mb-6">
        {tabs.map((tab, index) => (
          <button
            key={index}
            onClick={() => setActiveTab(index)}
            className={`px-4 py-2 rounded-full font-medium text-sm ${
              activeTab === index
                ? 'bg-red-500 text-white hover:bg-red-600'
                : 'bg-red-100 text-red-700 hover:bg-red-50'
            }`}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      <div className="transition-all">
        {activeTab === 0 && <GeneralNotificationPage employees={employees} hrId={hrId} />}
        {activeTab === 1 && <IncrementNotificationPage employees={employees} hrId={hrId} />}
        {activeTab === 2 && <PenaltyNotificationPage employees={employees} hrId={hrId} />}
        {activeTab === 3 && <SalaryNotificationPage employees={employees} hrId={hrId} />}
        {activeTab === 4 && <SentboxPage hrId={hrId} />}
        {activeTab === 5 && <InboxPage hrId={hrId} />}
      </div>
    </div>
  )
}
