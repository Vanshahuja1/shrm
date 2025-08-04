'use client'
import { useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
// import GeneralNotificationPage from './general/page'
// import IncrementNotificationPage from './increment/page'
// import PenaltyNotificationPage from './penalty/page'
// import SalaryNotificationPage from './salary/page'
import SentboxPage from './sent/page'
import InboxPage from './inbox/page'

const tabs = [
  // { label: 'General Notification', icon: '📢' },
  // { label: 'Increment Notification', icon: '📈' },
  // { label: 'Penalty Notification', icon: '🚫' },
  // { label: 'Salary Notification', icon: '💰' },
  { label: 'Sent', icon: '📤' },
  { label: 'Inbox', icon: '📥' }
]

export default function NotificationsPage() {
  const router = useRouter()
  const { hrId } = useParams()
  const [activeTab, setActiveTab] = useState<number>(0)

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">📨 Emails</h1>
        <button
          onClick={() => router.push(`/hr/${hrId}/emails/compose`)}
          className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
        >
          <span className="text-lg">✏️</span>
          Compose
        </button>
      </div>

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
        {activeTab === 0 && <SentboxPage />}
        {activeTab === 1 && <InboxPage />}
      </div>
    </div>
  )
}
