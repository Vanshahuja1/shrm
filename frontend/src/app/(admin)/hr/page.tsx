// 'use client'

// import { motion } from 'framer-motion'
// import ModuleCard from '../../components/ModuleCard'

// export default function HRDashboardPage() {
//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 24 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.6, ease: 'easeOut' }}
//       className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-gray-800"
//     >
//       <ModuleCard title="Attendance" href="/hr/attendance" />
//       <ModuleCard title="Payroll" href="/hr/payroll" />
//       <ModuleCard title="Recruitment" href="/hr/recruitment" />
//       <ModuleCard title="Compliance and Documentation" href="/hr/documents" />
//       <ModuleCard title="Notifications" href="/hr/notifications" />
//       <ModuleCard title="HR Actions" href="/hr/actions" />
//       <ModuleCard title="Employees" href="/hr/employees" />
//       <ModuleCard title="Policies" href="/hr/policies" />
//       <ModuleCard title="Reports" href="/hr/reports" />
//     </motion.div>
//   )
// }
// src/app/hr/page.tsx
// import { redirect } from 'next/navigation'

// export default function HRDashboardRedirect() {
//   redirect('/hr/attendance')
// }
'use client'

import { motion } from 'framer-motion'

export default function HRDashboardIntroPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="max-w-4xl mx-auto px-6 py-10 text-gray-800"
    >
      <h1 className="text-3xl font-bold mb-4">👋 Welcome to the HR Dashboard</h1>

      <p className="mb-6 text-gray-600 text-base leading-relaxed">
        This dashboard provides HR personnel with a centralized interface to manage all core operations —
        from attendance tracking and payroll processing to recruitment workflows and documentation.
        Use the sidebar to access different modules.
      </p>

      <ul className="space-y-2 text-sm list-disc list-inside text-gray-700">
        <li>Monitor and track daily employee attendance records</li>
        <li>View and manage payroll, salary structures, and payouts</li>
        <li>Handle end-to-end recruitment and onboarding procedures</li>
        <li>Issue, update, and maintain HR and compliance documents</li>
        <li>Access consolidated reports for performance, attendance, and HR actions</li>
      </ul>

      <div className="mt-8 text-sm text-gray-500">
        Use the left sidebar to begin navigating through available HR modules.
      </div>
    </motion.div>
  )
}

