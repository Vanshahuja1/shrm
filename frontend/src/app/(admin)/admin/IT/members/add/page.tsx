"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import axios from "@/lib/axiosInstance"
import type { OrganizationMember } from "../../../types"

export default function AddMemberPage() {
  const router = useRouter()

  const [formData, setFormData] = useState<Omit<OrganizationMember, "id">>({
    name: "",
    role: "Employee",
    department: "IT",
    salary: 0,
    projects: [],
    experience: 0,
    contactInfo: {
      email: "",
      phone: "",
      address: "",
    },
    documents: {
      pan: "",
      aadhar: "",
    },
    joiningDate: "",
    performanceMetrics: {
      tasksPerDay: 0,
      attendanceScore: 100,
      managerReviewRating: 0,
      combinedPercentage: 0,
    },
    attendance: {
      last7Days: [true, true, true, true, true, false, false],
      todayPresent: true,
    },
    reportsTo: "",
  })

  const [projectsText, setProjectsText] = useState<string>("")

  const handleProjectsChange = (val: string) => {
    setProjectsText(val);
  };

  const handleProjectsBlur = () => {
    // Process projects when user finishes editing (on blur)
    const projectsList = projectsText.split(",").map(p => p.trim()).filter(p => p);
    setFormData({ ...formData, projects: projectsList });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Process projects one final time before submission
    const projectsList = projectsText.split(",").map(p => p.trim()).filter(p => p);
    const formDataToSubmit = { ...formData, projects: projectsList };
    
    try {
      await axios.post('/IT/org-members', formDataToSubmit);
      console.log("Member added successfully")
      router.push("/admin/IT/members")
    } catch (error) {
      console.error("Error adding member:", error)
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Add New Member</h1>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Basic Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input 
              label="Full Name" 
              value={formData.name} 
              onChange={(val) => setFormData({ ...formData, name: val })} 
            />
            <SelectField
              label="Role"
              value={formData.role}
              options={["manager", "employee", "intern", "hr"]}
              onChange={(val) => setFormData({ ...formData, role: val as OrganizationMember["role"] })}
            />
            <Input
              label="Department"
              value={formData.department}
              onChange={(val) => setFormData({ ...formData, department: val })}
            />
            <FieldWithPrefix
              label="Salary"
              type="number"
              value={formData.salary}
              prefix="$"
              onChange={(val) => setFormData({ ...formData, salary: Number(val) })}
            />
            <Input
              label="Joining Date"
              type="date"
              value={formData.joiningDate}
              onChange={(val) => setFormData({ ...formData, joiningDate: val })}
            />
            <FieldWithSuffix
              label="Experience"
              type="number"
              value={formData.experience}
              suffix="Years"
              onChange={(val) => setFormData({ ...formData, experience: Number(val) })}
            />
            <Input
              label="Reports To"
              value={formData.reportsTo || ""}
              onChange={(val) => setFormData({ ...formData, reportsTo: val })}
            />
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Contact Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Email"
              type="email"
              value={formData.contactInfo.email}
              onChange={(val) =>
                setFormData({ ...formData, contactInfo: { ...formData.contactInfo, email: val } })
              }
            />
            <Input
              label="Phone"
              type="tel"
              value={formData.contactInfo.phone}
              onChange={(val) =>
                setFormData({ ...formData, contactInfo: { ...formData.contactInfo, phone: val } })
              }
            />
          </div>
          <div className="mt-6">
            <Textarea
              label="Address"
              value={formData.contactInfo.address}
              onChange={(val) =>
                setFormData({ ...formData, contactInfo: { ...formData.contactInfo, address: val } })
              }
            />
          </div>
        </div>

        {/* Documents */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Documents</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="PAN Number"
              value={formData.documents.pan}
              onChange={(val) =>
                setFormData({ ...formData, documents: { ...formData.documents, pan: val } })
              }
            />
            <Input
              label="Aadhar Number"
              value={formData.documents.aadhar}
              onChange={(val) =>
                setFormData({ ...formData, documents: { ...formData.documents, aadhar: val } })
              }
            />
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Performance Metrics</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Input
              label="Tasks Per Day"
              type="number"
              value={formData.performanceMetrics.tasksPerDay}
              onChange={(val) =>
                setFormData({
                  ...formData,
                  performanceMetrics: { ...formData.performanceMetrics, tasksPerDay: Number(val) }
                })
              }
            />
            <FieldWithSuffix
              label="Attendance Score"
              type="number"
              value={formData.performanceMetrics.attendanceScore}
              suffix="%"
              onChange={(val) =>
                setFormData({
                  ...formData,
                  performanceMetrics: { ...formData.performanceMetrics, attendanceScore: Number(val) }
                })
              }
            />
            <FieldWithSuffix
              label="Manager Review Rating"
              type="number"
              value={formData.performanceMetrics.managerReviewRating}
              suffix="/5"
              onChange={(val) =>
                setFormData({
                  ...formData,
                  performanceMetrics: { ...formData.performanceMetrics, managerReviewRating: Number(val) }
                })
              }
            />
            <FieldWithSuffix
              label="Combined Performance"
              type="number"
              value={formData.performanceMetrics.combinedPercentage}
              suffix="%"
              onChange={(val) =>
                setFormData({
                  ...formData,
                  performanceMetrics: { ...formData.performanceMetrics, combinedPercentage: Number(val) }
                })
              }
            />
          </div>
        </div>

        {/* Projects */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Projects</h2>
          <TextareaWithBlur
            label="Projects (comma-separated)"
            value={projectsText}
            onChange={handleProjectsChange}
            onBlur={handleProjectsBlur}
          />
          <p className="text-xs text-gray-500 mt-2">Enter project names separated by commas (e.g., "Project A, Project B, Project C")</p>
        </div>

        <div className="flex gap-4 pt-4">
          <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
            Add Member
          </button>
          <button
            type="button"
            onClick={() => router.push("/admin/IT/members")}
            className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}

function Input({
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
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
      />
    </div>
  )
}

function Textarea({
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
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
      />
    </div>
  )
}

function TextareaWithBlur({
  label,
  value,
  onChange,
  onBlur,
}: {
  label: string
  value: string
  onChange: (val: string) => void
  onBlur: () => void
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        rows={3}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        placeholder="Enter project names separated by commas..."
      />
    </div>
  )
}

function SelectField({
  label,
  value,
  options,
  onChange,
}: {
  label: string
  value: string
  options: string[]
  onChange: (val: string) => void
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  )
}

function FieldWithPrefix({
  label,
  value,
  prefix,
  onChange,
  type = "text",
}: {
  label: string
  value: string | number
  prefix: string
  type?: string
  onChange: (val: string | number) => void
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      <div className="relative">
        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm font-medium">
          {prefix}
        </span>
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(type === "number" ? Number(e.target.value) : e.target.value)}
          className="w-full px-3 py-2 pl-8 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        />
      </div>
    </div>
  )
}

function FieldWithSuffix({
  label,
  value,
  suffix,
  onChange,
  type = "text",
}: {
  label: string
  value: string | number
  suffix: string
  type?: string
  onChange: (val: string | number) => void
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      <div className="relative">
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(type === "number" ? Number(e.target.value) : e.target.value)}
          className="w-full px-3 py-2 pr-16 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        />
        <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm font-medium">
          {suffix}
        </span>
      </div>
    </div>
  )
}
