"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Plus } from "lucide-react"
import type { Project } from "../../../types"

export default function AddProjectPage() {
  const router = useRouter()

  const [formData, setFormData] = useState<Omit<Project, "id">>({
    name: "",
    description: "",
    departmentsInvolved: [],
    membersInvolved: [],
    startDate: "",
    deadline: "",
    managersInvolved: [],
    completionPercentage: 0,
    amount: 0,
    client: "",
    projectScope: "",
    clientInputs: "",
    skillsRequired: [],
    status: "pending",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("New Project Added:", formData)
    router.push("/admin/IT/projects")
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Add New Project</h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Field
            label="Project Name"
            value={formData.name}
            onChange={(val) => setFormData({ ...formData, name: val })}
          />
          <Field
            label="Client"
            value={formData.client}
            onChange={(val) => setFormData({ ...formData, client: val })}
          />
        </div>

        <TextArea
          label="Description"
          value={formData.description}
          onChange={(val) => setFormData({ ...formData, description: val })}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Field
            label="Amount"
            type="number"
            value={formData.amount}
            onChange={(val) => setFormData({ ...formData, amount: Number(val) })}
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as Project["status"] })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="pending">Pending</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
            </select>
          </div>
          <Field
            label="Start Date"
            type="date"
            value={formData.startDate}
            onChange={(val) => setFormData({ ...formData, startDate: val })}
          />
          <Field
            label="Deadline"
            type="date"
            value={formData.deadline}
            onChange={(val) => setFormData({ ...formData, deadline: val })}
          />
        </div>

        <TextArea
          label="Project Scope"
          value={formData.projectScope}
          onChange={(val) => setFormData({ ...formData, projectScope: val })}
        />

        <TextArea
          label="Client Inputs"
          value={formData.clientInputs}
          onChange={(val) => setFormData({ ...formData, clientInputs: val })}
        />

        <TextArea
          label="Departments (comma-separated)"
          value={formData.departmentsInvolved.join(", ")}
          onChange={(val) =>
            setFormData({ ...formData, departmentsInvolved: val.split(",").map((s) => s.trim()) })
          }
        />

        <TextArea
          label="Skills Required (comma-separated)"
          value={formData.skillsRequired.join(", ")}
          onChange={(val) =>
            setFormData({ ...formData, skillsRequired: val.split(",").map((s) => s.trim()) })
          }
        />

        <TextArea
          label="Members (comma-separated)"
          value={formData.membersInvolved.join(", ")}
          onChange={(val) =>
            setFormData({ ...formData, membersInvolved: val.split(",").map((s) => s.trim()) })
          }
        />

        <TextArea
          label="Managers (comma-separated)"
          value={formData.managersInvolved.join(", ")}
          onChange={(val) =>
            setFormData({ ...formData, managersInvolved: val.split(",").map((s) => s.trim()) })
          }
        />

        <div className="flex gap-4 pt-2">
          <button
            type="submit"
            className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            <Plus size={18} />
            Add Project
          </button>
          <button
            type="button"
            onClick={() => router.push("/admin/IT/projects")}
            className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}

function Field({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string
  value: string | number
  type?: string
  onChange: (val: string) => void
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      />
    </div>
  )
}

function TextArea({
  label,
  value,
  onChange,
}: {
  label: string
  value: string
  onChange: (val: string) => void
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={3}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      />
    </div>
  )
}
