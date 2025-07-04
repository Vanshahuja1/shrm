'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import SalaryProcessing from './salary/page'
import DeductionProcessing from './deduction/page'
import IncrementProcessing from './increment/page'
import BonusIncentives from './bonus/page'

type TabKey = 'salary' | 'increment' | 'deduction' | 'bonus'

const tabs: { key: TabKey; label: string }[] = [
  { key: 'salary', label: '💰 Salary Processing' },
  { key: 'increment', label: '📈 Increment' },
  { key: 'deduction', label: '📉 Deductions' },
  { key: 'bonus', label: '🎁 Bonus & Incentives' }
]

export default function PayrollPage() {
  const [tab, setTab] = useState<TabKey>('salary')

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      className="p-4 sm:p-6 max-w-7xl mx-auto"
    >
      <h1 className="text-2xl sm:text-3xl font-bold text-red-600 mb-6 tracking-tight drop-shadow-sm">
        Payroll Management
      </h1>

      <div className="flex flex-wrap gap-3 sm:gap-4 mb-6">
        {tabs.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`px-4 py-2 rounded-full font-medium text-sm transition ${
              tab === key
                ? 'bg-red-500 text-white shadow-md'
                : 'bg-red-100 text-red-600 hover:bg-red-200'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <motion.div
        key={tab}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -16 }}
        transition={{ duration: 0.5 }}
      >
        {{
          salary: <SalaryProcessing />,
          increment: <IncrementProcessing />,
          deduction: <DeductionProcessing />,
          bonus: <BonusIncentives />
        }[tab]}
      </motion.div>
    </motion.div>
  )
}
