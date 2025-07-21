"use client"

import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import type { Project } from "../../../../types"
import { sampleProjects } from "@/lib/sampleData"

export default function EditProjectPage() {
  const { id } = useParams()
  const router = useRouter()
  const [project, setProject] = useState<Project | null>(null)

  useEffect(() => {
    const current = sampleProjects.find((p) => p.id === Number(id));
    if (!current) router.push("/admin/IT/projects");
    else setProject(current);
  }, [id, router])

  const handleChange = (key: keyof Project, value: any) => {
    if (!project) return
    setProject({ ...project, [key]: value })
  }

  const handleSubmit = () => {
    const current = sampleProjects.find((p) => p.id === Number(id))
    console.log(current);
    if (!current) router.push(`/admin/IT/projects/${project!.id}`)
    else {
        setProject(current)
        router.push(`/admin/IT/projects/${project!.id}`)
    }

  }

  if (!project) return null

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-1 text-blue-600 hover:text-blue-800 font-medium"
        >
          ← Cancel
        </button>
        <button
          onClick={handleSubmit}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Save Changes
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 space-y-8">
        <h1 className="text-3xl font-bold text-gray-900">Edit Project</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Field label="Project Name" value={project.name} onChange={(val) => handleChange("name", val)} />
          <Field label="Client" value={project.client} onChange={(val) => handleChange("client", val)} />
          <Field label="Start Date" value={project.startDate} type="date" onChange={(val) => handleChange("startDate", val)} />
          <Field label="Deadline" value={project.deadline} type="date" onChange={(val) => handleChange("deadline", val)} />
          <Field label="Price" value={project.amount} type="number" onChange={(val) => handleChange("amount", Number(val))} />
          <Field
            label="Completion %"
            value={project.completionPercentage}
            type="number"
            onChange={(val) => handleChange("completionPercentage", Number(val))}
          />
        </div>

        <div className="space-y-6">
          <TextArea label="Project Scope" value={project.projectScope} onChange={(val) => handleChange("projectScope", val)} />
          <TextArea label="Client Inputs" value={project.clientInputs} onChange={(val) => handleChange("clientInputs", val)} />
          <TextArea label="Effect Analysis" value={project.effectAnalysis || ""} onChange={(val) => handleChange("effectAnalysis", val)} />
          <TextArea
            label="Departments (comma-separated)"
            value={project.departmentsInvolved.join(", ")}
            onChange={(val) =>
              handleChange("departmentsInvolved", val.split(",").map((s) => s.trim()))
            }
          />
          <TextArea
            label="Skills Required (comma-separated)"
            value={project.skillsRequired.join(", ")}
            onChange={(val) =>
              handleChange("skillsRequired", val.split(",").map((s) => s.trim()))
            }
          />
          <TextArea
            label="Members (comma-separated)"
            value={project.membersInvolved.join(", ")}
            onChange={(val) =>
              handleChange("membersInvolved", val.split(",").map((s) => s.trim()))
            }
          />
          <TextArea
            label="Managers (comma-separated)"
            value={project.managersInvolved.join(", ")}
            onChange={(val) =>
              handleChange("managersInvolved", val.split(",").map((s) => s.trim()))
            }
          />
        </div>
      </div>
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
// 