'use client'

import { useState } from 'react'
import DeleteMember from './delete-member/page'
import DeductionPage from './deduction/page'
import IncrementDecrementPage from './increment-decrement/page'
import PenaltyPage from './penalty/page'

const tabs = ['Delete Member', 'Deduction', 'Increment-Decrement', 'Penalty']

export default function ActionsPage() {
  const [activeTab, setActiveTab] = useState<number>(0)

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto">
      <h1 className="text-xl sm:text-2xl font-bold mb-4 text-gray-900">⚙️ HR Actions</h1>

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
            {tab === 'Delete Member' && '🗑️ Delete Member'}
            {tab === 'Deduction' && '➖ Deduction'}
            {tab === 'Increment-Decrement' && '🔁 Increment-Decrement'}
            {tab === 'Penalty' && '🚫 Penalty'}
          </button>
        ))}
      </div>

      <div className="transition-all">
        {activeTab === 0 && <DeleteMember />}
        {activeTab === 1 && <DeductionPage />}
        {activeTab === 2 && <IncrementDecrementPage />}
        {activeTab === 3 && <PenaltyPage />}
      </div>
    </div>
  )
}
