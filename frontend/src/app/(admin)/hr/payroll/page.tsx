'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { CalendarDays, Users, CheckCircle, Info, AlertTriangle, FileText } from 'lucide-react'
import Link from 'next/link'

const periods = [
  { label: 'Apr 2020', range: 'MAR 26 - APR 25', status: 'completed' },
  { label: 'May 2020', range: 'APR 26 - MAY 25', status: 'completed', active: true },
  { label: 'Jun 2020', range: 'MAY 26 - JUN 25', status: 'completed' },
  { label: 'Jul 2020', range: 'JUN 26 - JUL 25', status: 'completed' },
  { label: 'Aug 2020', range: 'JUL 26 - AUG 25', status: 'current' },
  { label: 'Sep 2020', range: 'AUG 26 - SEP 25', status: 'upcoming' },
  { label: 'Oct 2020', range: 'SEP 26 - OCT 25', status: 'upcoming' },
]

const modules = [
  { title: 'Leave, attendance & daily wages', href: '/hr/payroll/leave-deductions', icon: <CalendarDays size={18} /> },
  { title: 'New joinees & exits', href: '/hr/payroll/joinees-exit', icon: <Users size={18} /> },
  { title: 'Bonus, salary revisions & overtime', href: '/hr/payroll/bonuses-revisions', icon: <FileText size={18} /> },
  { title: 'Reimbursement, adhoc payments, deductions', href: '/hr/payroll/adhoc-expenses', icon: <Info size={18} /> },
  { title: 'Arrears & dues', href: '/hr/payroll/arrears-dues', icon: <AlertTriangle size={18} /> },
  { title: 'Review all employees', href: '/hr/payroll/review-all-employees', icon: <CheckCircle size={18} /> },
]

export default function PayrollPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-7xl mx-auto p-4 sm:p-6 text-gray-800"
    >
      {/* Period Selector */}
      <div className="flex flex-wrap gap-3 mb-6">
        {periods.map((p, idx) => (
          <div
            key={idx}
            className={`px-3 py-2 text-xs rounded border text-center min-w-[110px] ${
              p.active
                ? 'bg-red-600 text-white font-semibold shadow-sm'
                : p.status === 'completed'
                ? 'bg-green-100 text-green-800'
                : p.status === 'current'
                ? 'bg-blue-100 text-blue-700'
                : 'bg-gray-100 text-gray-600'
            }`}
          >
            <p className="font-medium">{p.label}</p>
            <p className="text-[11px]">{p.range}</p>
          </div>
        ))}
      </div>

      {/* Summary Card */}
      <div className="bg-white border rounded-xl p-4 shadow-sm mb-6">
        <h2 className="font-bold text-lg text-gray-900 mb-1">May 2020 Payroll</h2>
        <p className="text-sm text-gray-500 mb-4">Apr 26 - May 25 (31 days)</p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm text-gray-700">
          <div>
            <p className="font-semibold text-sm">Total Payroll Cost</p>
            <p className="text-lg text-red-600 font-bold mt-1">₹1,66,90,591</p>
          </div>
          <div>
            <p>Fixed Components</p>
            <p className="font-medium">₹1,46,44,508</p>
          </div>
          <div>
            <p>Variable Components</p>
            <p className="font-medium">₹10,74,373</p>
          </div>
          <div>
            <p>Reimbursements</p>
            <p className="font-medium">₹9,60,710</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mt-6 text-sm text-gray-600 border-t pt-4">
          <div><span className="font-semibold">Calendar Days:</span> 31</div>
          <div><span className="font-semibold">Employees:</span> 240 <span className="text-green-500">+12</span> <span className="text-red-500">-4</span></div>
          <div><span className="font-semibold">Payroll Processed:</span> 234 / 240</div>
        </div>
      </div>

      {/* Modules */}
      <div className="grid sm:grid-cols-2 gap-4 mb-6">
        {modules.map((m, i) => (
          <Link
            key={i}
            href={m.href}
            className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg shadow-sm hover:bg-red-100 transition"
          >
            <div className="text-red-600">{m.icon}</div>
            <div className="text-sm text-gray-800 font-medium">{m.title}</div>
          </Link>
        ))}
      </div>

      {/* Activity Log */}
      <div className="bg-white border rounded-xl p-4 shadow-sm">
        <p className="text-sm font-semibold text-gray-700 mb-2">📜 Activity Log</p>
        <ul className="space-y-2 text-sm text-gray-700">
          <li><span className="font-semibold">Higashi Mako</span> ran payroll for 137 employees — <span className="text-xs text-gray-500">Aug 31, 04:28 PM</span></li>
          <li><span className="font-semibold">Sebastian Westergren</span> reviewed salary sheets — <span className="text-xs text-gray-500">Aug 31, 04:28 PM</span></li>
        </ul>
      </div>
    </motion.div>
  )
}
