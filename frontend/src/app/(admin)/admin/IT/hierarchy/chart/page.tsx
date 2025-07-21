"use client"

import { motion } from "framer-motion"
import { Award, UserCheck } from "lucide-react"

const hierarchy = {
  head: "Alice Johnson",
  department: "IT Development",
  managers: [
    { id: 1, name: "John Smith", reports: ["Emily Clark", "Robert King"], performance: 88 },
    { id: 2, name: "Sara Bell", reports: ["Tina Ray"], performance: 91 },
  ],
  employees: [
    { id: 3, name: "Emily Clark", reportsTo: "John Smith", performance: 85 },
    { id: 4, name: "Robert King", reportsTo: "John Smith", performance: 80 },
    { id: 5, name: "Tina Ray", reportsTo: "Sara Bell", performance: 83 },
  ],
  interns: [
    { id: 6, name: "Leo Nash", reportsTo: "Emily Clark", performance: 75 },
    { id: 7, name: "Ava Moon", reportsTo: "Robert King", performance: 78 },
  ],
}

export default function ChartSection() {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
      <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">Organizational Chart</h3>

      <div className="flex justify-center mb-8">
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-gradient-to-br from-blue-600 to-blue-700 text-white p-6 rounded-xl text-center min-w-[200px] shadow-lg"
        >
          <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-3">
            <Award size={24} />
          </div>
          <h3 className="font-bold text-lg">{hierarchy.head}</h3>
          <p className="text-blue-100">Department Head</p>
          <p className="text-blue-200 text-sm mt-1">{hierarchy.department}</p>
        </motion.div>
      </div>

      {/* Managers */}
      <HierarchyLevel title="Managers" members={hierarchy.managers} color="red" />

      {/* Employees */}
      <HierarchyLevel title="Employees" members={hierarchy.employees} color="green" />

      {/* Interns */}
      <HierarchyLevel title="Interns" members={hierarchy.interns} color="purple" />
    </div>
  )
}

function HierarchyLevel({
  title,
  members,
  color,
}: {
  title: string
  members: any[]
  color: string
}) {
  return (
    <div className="mb-8">
      <h4 className="text-lg font-semibold text-gray-700 mb-4 text-center">{title} ({members.length})</h4>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 max-w-6xl mx-auto">
        {members.map((m) => (
          <motion.div
            key={m.id}
            whileHover={{ scale: 1.05 }}
            className={`bg-${color}-50 border-2 border-${color}-200 p-3 rounded-lg text-center`}
          >
            <div className={`w-10 h-10 bg-${color}-500 rounded-full flex items-center justify-center mx-auto mb-2 text-white text-sm font-bold`}>
              {m.name.split(" ").map((n: string) => n[0]).join("")}
            </div>
            <p className={`font-semibold text-${color}-800 text-sm`}>{m.name}</p>
            <p className={`text-${color}-600 text-xs`}>{m.reportsTo ? `→ ${m.reportsTo}` : title}</p>
            <p className={`text-${color}-500 text-xs`}>{m.performance}%</p>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
