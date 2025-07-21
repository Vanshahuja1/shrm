"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import axios from "@/lib/axiosInstance"

export default function AddDepartmentPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: "",
    head: "",
    budget: "",
    managers: "",
    employees: "",
    interns: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const payload = {
      ...formData,
      budget: Number(formData.budget) || 0,
      managers: Number(formData.managers) || 0,
      employees: Number(formData.employees) || 0,
      interns: Number(formData.interns) || 0,
    }

    try {
      await axios.post("/departments", payload)
      console.log("Department added successfully")
      router.push("/admin/IT/departments")
    } catch (err) {
      console.error("Failed to add department:", err instanceof Error ? err.message : "Unknown error")
      alert("Error creating department. Please try again.")
    }
  }

  return (
    <div className="max-w-3xl mx-auto py-10 space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Add New Department</h1>

      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Department Name</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Enter department name"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Department Head</label>
          <input
            type="text"
            value={formData.head}
            onChange={(e) => setFormData({ ...formData, head: e.target.value })}
            placeholder="Enter department head"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Budget</label>
          <input
            type="number"
            value={formData.budget}
            onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
            placeholder="Enter budget in USD"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Managers</label>
            <input
              type="number"
              value={formData.managers}
              onChange={(e) => setFormData({ ...formData, managers: e.target.value })}
              placeholder="0"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Employees</label>
            <input
              type="number"
              value={formData.employees}
              onChange={(e) => setFormData({ ...formData, employees: e.target.value })}
              placeholder="0"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Interns</label>
            <input
              type="number"
              value={formData.interns}
              onChange={(e) => setFormData({ ...formData, interns: e.target.value })}
              placeholder="0"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Add Department
          </button>
          <button
            type="button"
            onClick={() => router.push("/admin/IT/departments")}
            className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}
