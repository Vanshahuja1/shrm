"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import axios from "@/lib/axiosInstance"
import { Edit, ArrowLeft } from "lucide-react"

export default function DepartmentDetailPage() {
  const { id } = useParams()
  const router = useRouter()
  const [dept, setDept] = useState<any>(null)
  const [editData, setEditData] = useState<any>(null)
  const [isEditing, setIsEditing] = useState(false)

  useEffect(() => {
    axios.get(`/departments/${id}`).then((res) => {
      setDept(res.data)
      setEditData(res.data)
    })
  }, [id])

  const handleUpdate = async () => {
    await axios.put(`/departments/${id}`, editData)
    setDept(editData)
    setIsEditing(false)
  }

  if (!dept) return <div className="p-6 text-gray-600">Loading...</div>

  return (
    <div className="max-w-3xl mx-auto py-10 space-y-6">
      <div className="flex items-center justify-between">
        <button
          onClick={() => router.push("/admin/IT/departments")}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium"
        >
          <ArrowLeft size={16} />
          Back to Departments
        </button>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          <Edit size={16} />
          {isEditing ? "Cancel" : "Edit"}
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 space-y-6">
        {isEditing ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Department Name</label>
              <input
                value={editData.name || ""}
                onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Department Head</label>
              <input
                value={editData.head || ""}
                onChange={(e) => setEditData({ ...editData, head: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Budget</label>
              <input
                type="number"
                value={editData.budget || 0}
                onChange={(e) => setEditData({ ...editData, budget: Number(e.target.value) })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              {["managers", "employees", "interns"].map((field) => (
                <div key={field}>
                  <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">{field}</label>
                  <input
                    type="number"
                    value={editData[field] || 0}
                    onChange={(e) => setEditData({ ...editData, [field]: Number(e.target.value) })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              ))}
            </div>
            <div className="flex gap-4 pt-4">
              <button onClick={handleUpdate} className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
                Save Changes
              </button>
              {/* <button onClick={() => setIsEditing(false)} className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700">
                Cancel
              </button> */}
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{dept.name}</h1>
              <p className="text-gray-600">Department Head: {dept.head}</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard label="Managers" value={dept.managers} color="blue" />
              <StatCard label="Employees" value={dept.employees} color="green" />
              <StatCard label="Interns" value={dept.interns} color="purple" />
              <StatCard label="Budget" value={`$${(dept.budget || 0).toLocaleString()}`} color="orange" />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function StatCard({ label, value, color }: { label: string; value: any; color: string }) {
  const colorMap = {
    blue: "text-blue-600 bg-blue-50 border-blue-200",
    green: "text-green-600 bg-green-50 border-green-200",
    purple: "text-purple-600 bg-purple-50 border-purple-200",
    orange: "text-orange-600 bg-orange-50 border-orange-200",
  } as Record<string, string>

  return (
    <div className={`p-4 rounded-lg border ${colorMap[color]}`}>
      <p className={`text-2xl font-bold ${colorMap[color].split(" ")[0]}`}>{value}</p>
      <p className={`${colorMap[color].split(" ")[0]} text-sm`}>{label}</p>
    </div>
  )
}
