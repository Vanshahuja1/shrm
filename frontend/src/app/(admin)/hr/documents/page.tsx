'use client'

import { useState } from 'react'
import BankDetails from './bank-details/page'
import IdentityDocuments from './identity/page'
import LegalCompliance from './compliance/page'

interface Tab {
  label: string
  icon: string
}

const tabs: Tab[] = [
  { label: 'Bank Details', icon: '🏦' },
  { label: 'Identity Docs', icon: '🪪' },
  { label: 'Legal Compliance', icon: '📄' }
]

export default function DocumentsPage() {
  const [activeTab, setActiveTab] = useState<number>(0)

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto">
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
        {activeTab === 0 && <BankDetails />}
        {activeTab === 1 && <IdentityDocuments />}
        {activeTab === 2 && <LegalCompliance />}
      </div>
    </div>
  )
}
