"use client"

import { useState } from "react"

const departments = [
  { id: 1, name: "IT Development", head: "Alice Johnson", managers: 2, employees: 8, interns: 3, budget: 1500000 },
  { id: 2, name: "HR", head: "Bob Smith", managers: 1, employees: 5, interns: 1, budget: 750000 },
]

export default function StatsSection() {
  const [selectedId, setSelectedId] = useState<number>(departments[0].id)
  const dept = departments.find((d) => d.id === selectedId)!

  return (
    <>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <select
          value={selectedId}
          onChange={(e) => setSelectedId(Number(e.target.value))}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          {departments.map((dept) => (
            <option key={dept.id} value={dept.id}>
              {dept.name}
            </option>
          ))}
        </select>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{dept.name}</h2>
            <p className="text-gray-600">Department Head: {dept.head}</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-green-600">${dept.budget.toLocaleString()}</p>
            <p className="text-gray-600">Annual Budget</p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatsCard label="Managers" value={dept.managers} color="blue" />
          <StatsCard label="Employees" value={dept.employees} color="green" />
          <StatsCard label="Interns" value={dept.interns} color="purple" />
          <StatsCard label="Total" value={dept.managers + dept.employees + dept.interns} color="orange" />
        </div>
      </div>
    </>
  )
}

function StatsCard({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className={`bg-${color}-50 p-4 rounded-lg text-center border border-${color}-200`}>
      <p className={`text-2xl font-bold text-${color}-600`}>{value}</p>
      <p className={`text-${color}-800 font-medium`}>{label}</p>
    </div>
  )
}
