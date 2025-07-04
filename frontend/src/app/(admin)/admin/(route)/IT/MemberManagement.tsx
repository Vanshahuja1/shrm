"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import {
  Users,
  Search,
  Plus,
  Edit,
  Trash2,
  Mail,
  Phone,
  MapPin,
  DollarSign,
  Award,
  TrendingUp,
  UserCheck,
  Clock,
  Target,
} from "lucide-react"
import { sampleMembers } from "./SampleData"
import type { OrganizationMember } from "../types"

export default function MemberManagement() {
  const [members, setMembers] = useState(sampleMembers)
  const [selectedMember, setSelectedMember] = useState<OrganizationMember | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [departmentFilter, setDepartmentFilter] = useState("all")
  const [roleFilter, setRoleFilter] = useState("all")
  const [showAddForm, setShowAddForm] = useState(false)

  const filteredMembers = members.filter((member) => {
    const matchesSearch =
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.contactInfo.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesDepartment = departmentFilter === "all" || member.department === departmentFilter
    const matchesRole = roleFilter === "all" || member.role === roleFilter
    return matchesSearch && matchesDepartment && matchesRole
  })

  const handleDeleteMember = (id: number) => {
    setMembers(members.filter((member) => member.id !== id))
    // Here you would also send HR notification email
  }

  const handleSalaryAction = (id: number, action: "increment" | "decrement" | "penalty", amount: number) => {
    setMembers(
      members.map((member) =>
        member.id === id
          ? {
              ...member,
              salary: action === "increment" ? member.salary + amount : member.salary - amount,
            }
          : member,
      ),
    )
    // Here you would send HR notification email
  }

  if (selectedMember) {
    return (
      <MemberDetail
        member={selectedMember}
        onBack={() => setSelectedMember(null)}
        onUpdate={(updated) => {
          setMembers(members.map((m) => (m.id === updated.id ? updated : m)))
          setSelectedMember(null)
        }}
        onDelete={handleDeleteMember}
        onSalaryAction={handleSalaryAction}
      />
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Member Management</h1>
          <p className="text-gray-600">Manage your organization members</p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus size={20} />
          Add Member
        </button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search members..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <select
          value={departmentFilter}
          onChange={(e) => setDepartmentFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="all">All Departments</option>
          <option value="IT Development">IT Development</option>
          <option value="HR">HR</option>
          <option value="Business Development">Business Development</option>
          <option value="IT/CS Management">IT/CS Management</option>
        </select>
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="all">All Roles</option>
          <option value="Manager">Manager</option>
          <option value="Employee">Employee</option>
          <option value="Intern">Intern</option>
        </select>
      </div>

      {/* Member Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Users className="text-blue-600" size={24} />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{members.length}</p>
              <p className="text-gray-600">Total Members</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-green-100 rounded-lg">
              <UserCheck className="text-green-600" size={24} />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{members.filter((m) => m.role === "Manager").length}</p>
              <p className="text-gray-600">Managers</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-purple-100 rounded-lg">
              <DollarSign className="text-purple-600" size={24} />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                ${Math.round(members.reduce((sum, m) => sum + m.salary, 0) / members.length).toLocaleString()}
              </p>
              <p className="text-gray-600">Avg Salary</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-orange-100 rounded-lg">
              <TrendingUp className="text-orange-600" size={24} />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {Math.round(
                  members.reduce((sum, m) => sum + m.performanceMetrics.combinedPercentage, 0) / members.length,
                )}
                %
              </p>
              <p className="text-gray-600">Avg Performance</p>
            </div>
          </div>
        </div>
      </div>

      {/* Members Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMembers.map((member) => (
          <motion.div
            key={member.id}
            whileHover={{ y: -2, scale: 1.01 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 cursor-pointer hover:shadow-md transition-all"
            onClick={() => setSelectedMember(member)}
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full flex items-center justify-center text-white font-bold">
                {member.name
                  .split(" ")
                  .map((n: string) => n[0])
                  .join("")}
              </div>
              <div>
                <h3 className="font-bold text-lg text-gray-900">{member.name}</h3>
                <p className="text-gray-600">{member.role}</p>
              </div>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Department:</span>
                <span className="font-semibold text-gray-900">{member.department}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Salary:</span>
                <span className="font-semibold text-green-600">${member.salary.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Performance:</span>
                <span className="font-semibold text-blue-600">{member.performanceMetrics.combinedPercentage}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Attendance:</span>
                <span className={`font-semibold ${member.attendance.todayPresent ? "text-green-600" : "text-red-600"}`}>
                  {member.attendance.todayPresent ? "Present" : "Absent"}
                </span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Mail size={16} className="text-gray-400" />
                  <span className="text-sm text-gray-600 truncate">{member.contactInfo.email}</span>
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      setSelectedMember(member)
                    }}
                    className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                  >
                    <Edit size={14} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDeleteMember(member.id)
                    }}
                    className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Add Member Modal */}
      {showAddForm && (
        <AddMemberModal
          onClose={() => setShowAddForm(false)}
          onAdd={(newMember) => {
            const id = Math.max(...members.map((m) => m.id)) + 1
            setMembers([...members, { ...newMember, id }])
            setShowAddForm(false)
          }}
        />
      )}
    </div>
  )
}

// Member Detail Component
function MemberDetail({
  member,
  onBack,
  onUpdate,
  onDelete,
  onSalaryAction,
}: {
  member: OrganizationMember
  onBack: () => void
  onUpdate: (member: OrganizationMember) => void
  onDelete: (id: number) => void
  onSalaryAction: (id: number, action: "increment" | "decrement" | "penalty", amount: number) => void
}) {
  const [isEditing, setIsEditing] = useState(false)
  const [editData, setEditData] = useState(member)
  const [showSalaryModal, setShowSalaryModal] = useState(false)

  const handleSave = () => {
    onUpdate(editData)
    setIsEditing(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <button onClick={onBack} className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium">
          ← Back to Members
        </button>
        <div className="flex gap-2">
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            <Edit size={16} />
            {isEditing ? "Cancel" : "Edit"}
          </button>
          <button
            onClick={() => setShowSalaryModal(true)}
            className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
          >
            <DollarSign size={16} />
            Salary Actions
          </button>
          <button
            onClick={() => onDelete(member.id)}
            className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
          >
            <Trash2 size={16} />
            Delete
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        {isEditing ? (
          <MemberEditForm
            member={editData}
            onChange={setEditData}
            onSave={handleSave}
            onCancel={() => setIsEditing(false)}
          />
        ) : (
          <MemberDetailView member={member} />
        )}
      </div>

      {/* Salary Action Modal */}
      {showSalaryModal && (
        <SalaryActionModal member={member} onClose={() => setShowSalaryModal(false)} onAction={onSalaryAction} />
      )}
    </div>
  )
}

// Member Detail View
function MemberDetailView({ member }: { member: OrganizationMember }) {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-6">
        <div className="w-24 h-24 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full flex items-center justify-center text-white text-2xl font-bold">
          {member.name
            .split(" ")
            .map((n: string) => n[0])
            .join("")}
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{member.name}</h1>
          <p className="text-xl text-gray-600">
            {member.role} - {member.department}
          </p>
          <div className="flex items-center gap-4 mt-3">
            <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
              Performance: {member.performanceMetrics.combinedPercentage}%
            </span>
            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
              {member.experience} Experience
            </span>
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                member.attendance.todayPresent ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
              }`}
            >
              {member.attendance.todayPresent ? "Present Today" : "Absent Today"}
            </span>
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <div className="flex items-center gap-2 mb-2">
            <Target className="text-blue-600" size={20} />
            <span className="text-blue-800 font-semibold">Tasks/Day</span>
          </div>
          <p className="text-2xl font-bold text-blue-600">{member.performanceMetrics.tasksPerDay}/5</p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="text-green-600" size={20} />
            <span className="text-green-800 font-semibold">Attendance</span>
          </div>
          <p className="text-2xl font-bold text-green-600">{member.performanceMetrics.attendanceScore}%</p>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
          <div className="flex items-center gap-2 mb-2">
            <Award className="text-purple-600" size={20} />
            <span className="text-purple-800 font-semibold">Manager Rating</span>
          </div>
          <p className="text-2xl font-bold text-purple-600">{member.performanceMetrics.managerReviewRating}/5</p>
        </div>
        <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="text-orange-600" size={20} />
            <span className="text-orange-800 font-semibold">Combined %</span>
          </div>
          <p className="text-2xl font-bold text-orange-600">{member.performanceMetrics.combinedPercentage}%</p>
        </div>
      </div>

      {/* Attendance Chart */}
      <div className="bg-gray-50 p-6 rounded-lg">
        <h3 className="text-lg font-bold mb-4 text-gray-900">Last 7 Days Attendance</h3>
        <div className="flex gap-2">
          {member.attendance.last7Days.map((present, index) => (
            <div
              key={index}
              className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold ${
                present ? "bg-green-500" : "bg-red-500"
              }`}
            >
              {index + 1}
            </div>
          ))}
        </div>
        <div className="flex gap-2 mt-2 text-xs text-gray-600">
          {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, index) => (
            <div key={index} className="w-8 text-center">
              {day}
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Contact Information */}
        <div className="space-y-6">
          <h3 className="text-xl font-bold text-gray-900 border-b border-gray-200 pb-2">Contact Information</h3>
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <Mail className="text-gray-500" size={20} />
              <span className="text-gray-700">{member.contactInfo.email}</span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <Phone className="text-gray-500" size={20} />
              <span className="text-gray-700">{member.contactInfo.phone}</span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <MapPin className="text-gray-500" size={20} />
              <span className="text-gray-700">{member.contactInfo.address}</span>
            </div>
            {member.reportsTo && (
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <UserCheck className="text-gray-500" size={20} />
                <span className="text-gray-700">Reports to: {member.reportsTo}</span>
              </div>
            )}
          </div>
        </div>

        {/* Professional Details */}
        <div className="space-y-6">
          <h3 className="text-xl font-bold text-gray-900 border-b border-gray-200 pb-2">Professional Details</h3>
          <div className="space-y-4">
            <div className="p-4 bg-green-50 rounded-lg">
              <p className="font-semibold text-gray-700 mb-1">Monthly Salary</p>
              <p className="text-2xl font-bold text-green-600">${member.salary.toLocaleString()}</p>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg">
              <p className="font-semibold text-gray-700 mb-1">Joining Date</p>
              <p className="text-lg font-semibold text-blue-600">{member.joiningDate}</p>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <p className="font-semibold text-gray-700 mb-1">Experience</p>
              <p className="text-lg font-semibold text-purple-600">{member.experience}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Documents */}
      <div>
        <h3 className="text-xl font-bold text-gray-900 mb-4">Documents</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
            <p className="font-semibold text-gray-700 mb-1">PAN Number</p>
            <p className="text-lg font-mono text-yellow-800">{member.documents.pan}</p>
          </div>
          <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
            <p className="font-semibold text-gray-700 mb-1">Aadhar Number</p>
            <p className="text-lg font-mono text-orange-800">{member.documents.aadhar}</p>
          </div>
        </div>
      </div>

      {/* Projects */}
      <div>
        <h3 className="text-xl font-bold text-gray-900 mb-4">Current Projects</h3>
        <div className="flex flex-wrap gap-2">
          {member.projects.map((project, index) => (
            <span key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
              {project}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

// Member Edit Form
function MemberEditForm({
  member,
  onChange,
  onSave,
  onCancel,
}: {
  member: OrganizationMember
  onChange: (member: OrganizationMember) => void
  onSave: () => void
  onCancel: () => void
}) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Edit Member</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
          <input
            type="text"
            value={member.name}
            onChange={(e) => onChange({ ...member, name: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
          <select
            value={member.role}
            onChange={(e) => onChange({ ...member, role: e.target.value as OrganizationMember["role"] })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="Manager">Manager</option>
            <option value="Employee">Employee</option>
            <option value="Intern">Intern</option>
            <option value="Head">Head</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
          <select
            value={member.department}
            onChange={(e) => onChange({ ...member, department: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="IT Development">IT Development</option>
            <option value="HR">HR</option>
            <option value="Business Development">Business Development</option>
            <option value="IT/CS Management">IT/CS Management</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Salary</label>
          <input
            type="number"
            value={member.salary}
            onChange={(e) => onChange({ ...member, salary: Number(e.target.value) })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
          <input
            type="email"
            value={member.contactInfo.email}
            onChange={(e) =>
              onChange({
                ...member,
                contactInfo: { ...member.contactInfo, email: e.target.value },
              })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
          <input
            type="tel"
            value={member.contactInfo.phone}
            onChange={(e) =>
              onChange({
                ...member,
                contactInfo: { ...member.contactInfo, phone: e.target.value },
              })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
        <textarea
          value={member.contactInfo.address}
          onChange={(e) =>
            onChange({
              ...member,
              contactInfo: { ...member.contactInfo, address: e.target.value },
            })
          }
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="flex gap-4">
        <button onClick={onSave} className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700">
          Save Changes
        </button>
        <button onClick={onCancel} className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700">
          Cancel
        </button>
      </div>
    </div>
  )
}

// Salary Action Modal
function SalaryActionModal({
  member,
  onClose,
  onAction,
}: {
  member: OrganizationMember
  onClose: () => void
  onAction: (id: number, action: "increment" | "decrement" | "penalty", amount: number) => void
}) {
  const [action, setAction] = useState<"increment" | "decrement" | "penalty">("increment")
  const [amount, setAmount] = useState(0)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onAction(member.id, action, amount)
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Salary Action for {member.name}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Action Type</label>
            <select
              value={action}
              onChange={(e) => setAction(e.target.value as "increment" | "decrement" | "penalty")}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="increment">Salary Increment</option>
              <option value="decrement">Salary Decrement</option>
              <option value="penalty">Penalty Deduction</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Amount ($)</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="text-sm text-gray-600">
            Current Salary: ${member.salary.toLocaleString()}
            <br />
            New Salary: ${(action === "increment" ? member.salary + amount : member.salary - amount).toLocaleString()}
          </div>
          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              className={`flex-1 text-white py-2 rounded-lg ${
                action === "increment" ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"
              }`}
            >
              Apply {action}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-600 text-white py-2 rounded-lg hover:bg-gray-700"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// Add Member Modal
function AddMemberModal({
  onClose,
  onAdd,
}: {
  onClose: () => void
  onAdd: (member: Omit<OrganizationMember, "id">) => void
}) {
  const [formData, setFormData] = useState<Omit<OrganizationMember, "id">>({
    name: "",
    role: "Employee",
    department: "IT Development",
    salary: 0,
    projects: [],
    experience: "",
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
      attendanceScore: 0,
      managerReviewRating: 0,
      combinedPercentage: 0,
    },
    attendance: {
      last7Days: [true, true, true, true, true, false, false],
      todayPresent: true,
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onAdd(formData)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Add New Member</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value as OrganizationMember["role"] })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="Manager">Manager</option>
                <option value="Employee">Employee</option>
                <option value="Intern">Intern</option>
                <option value="Head">Head</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
              <select
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="IT Development">IT Development</option>
                <option value="HR">HR</option>
                <option value="Business Development">Business Development</option>
                <option value="IT/CS Management">IT/CS Management</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Salary</label>
              <input
                type="number"
                value={formData.salary}
                onChange={(e) => setFormData({ ...formData, salary: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input
                type="email"
                value={formData.contactInfo.email}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    contactInfo: { ...formData.contactInfo, email: e.target.value },
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
              <input
                type="tel"
                value={formData.contactInfo.phone}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    contactInfo: { ...formData.contactInfo, phone: e.target.value },
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Joining Date</label>
              <input
                type="date"
                value={formData.joiningDate}
                onChange={(e) => setFormData({ ...formData, joiningDate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Experience</label>
              <input
                type="text"
                value={formData.experience}
                onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., 3 years"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
            <textarea
              value={formData.contactInfo.address}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  contactInfo: { ...formData.contactInfo, address: e.target.value },
                })
              }
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">PAN Number</label>
              <input
                type="text"
                value={formData.documents.pan}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    documents: { ...formData.documents, pan: e.target.value },
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Aadhar Number</label>
              <input
                type="text"
                value={formData.documents.aadhar}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    documents: { ...formData.documents, aadhar: e.target.value },
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <button type="submit" className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">
              Add Member
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-600 text-white py-2 rounded-lg hover:bg-gray-700"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
