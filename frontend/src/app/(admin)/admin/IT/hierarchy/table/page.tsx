"use client"

const members = [
  { id: 1, name: "John Smith", role: "Manager", reportsTo: "", email: "john@org.com", performance: 88, present: true },
  { id: 2, name: "Sara Bell", role: "Manager", reportsTo: "", email: "sara@org.com", performance: 91, present: true },
  { id: 3, name: "Emily Clark", role: "Employee", reportsTo: "John Smith", email: "emily@org.com", performance: 85, present: false },
  { id: 4, name: "Robert King", role: "Employee", reportsTo: "John Smith", email: "robert@org.com", performance: 80, present: true },
  { id: 5, name: "Tina Ray", role: "Employee", reportsTo: "Sara Bell", email: "tina@org.com", performance: 83, present: true },
  { id: 6, name: "Leo Nash", role: "Intern", reportsTo: "Emily Clark", email: "leo@org.com", performance: 75, present: true },
  { id: 7, name: "Ava Moon", role: "Intern", reportsTo: "Robert King", email: "ava@org.com", performance: 78, present: false },
]

export default function TableSection() {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-xl font-bold text-gray-900 mb-4">Reporting Structure</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Role</th>
              <th className="px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Reports To</th>
              <th className="px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Performance</th>
              <th className="px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Attendance</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {members.map((m) => (
              <tr key={m.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">{m.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">{m.role}</td>
                <td className="px-6 py-4 whitespace-nowrap">{m.reportsTo || "Dept Head"}</td>
                <td className="px-6 py-4 whitespace-nowrap">{m.performance}%</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${m.present ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                    {m.present ? "Present" : "Absent"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
