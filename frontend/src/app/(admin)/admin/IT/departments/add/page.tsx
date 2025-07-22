"use client"

import { useState } from "react"

type RoleKey = "managers" | "employees" | "interns";
type FormData = {
  name: string;
  head: string;
  budget: string;
  managers: any[];
  employees: any[];
  interns: any[];
};
import { ChevronDown, Plus, X } from "lucide-react"
import { sampleMembers } from "@/lib/sampleData"
import { useRouter } from "next/navigation"
import axios from "@/lib/axiosInstance"

export default function AddDepartmentPage() {
  const router = useRouter()
  const [formData, setFormData] = useState<FormData>({
    name: "",
    head: "",
    budget: "",
    managers: [],
    employees: [],
    interns: [],
  })
  const [orgMembers, setOrgMembers] = useState<any[]>([])

  // Dropdown state for each role
  const [showManagerDropdown, setShowManagerDropdown] = useState(false)
  const [showEmployeeDropdown, setShowEmployeeDropdown] = useState(false)
  const [showInternDropdown, setShowInternDropdown] = useState(false)

  const handleAddMember = async (role: string) => {
    if (orgMembers.length === 0) {
      try {
        const res = await axios.get("/organization-members");
        setOrgMembers(res.data);
      } catch (err) {
        setOrgMembers(sampleMembers);
      }
    }
    if (role === "Manager") setShowManagerDropdown(true);
    if (role === "Employee") setShowEmployeeDropdown(true);
    if (role === "Intern") setShowInternDropdown(true);
  };

  const handleSelectMember = (role: string, member: any) => {
    const key = (role.toLowerCase() + 's') as RoleKey;
    setFormData(prev => ({
      ...prev,
      [key]: [...prev[key], member]
    }));
    if (role === "Manager") setShowManagerDropdown(false);
    if (role === "Employee") setShowEmployeeDropdown(false);
    if (role === "Intern") setShowInternDropdown(false);
  };

  const handleRemoveMember = (role: string, idx: number) => {
    const key = (role.toLowerCase() + 's') as RoleKey;
    setFormData(prev => ({
      ...prev,
      [key]: prev[key].filter((_: any, i: number) => i !== idx)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const payload = {
      ...formData,
      budget: Number(formData.budget) || 0,
      managers: formData.managers.map((m: any) => m.id),
      employees: formData.employees.map((m: any) => m.id),
      interns: formData.interns.map((m: any) => m.id),
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
          <div className="relative">
            <select
              value={formData.head}
              onClick={async () => {
                if (orgMembers.length === 0) {
                  try {
                    const res = await axios.get("/organization-members");
                    setOrgMembers(res.data);
                  } catch (err) {
                    // fallback to sample data (only names of employees)
                    setOrgMembers(sampleMembers.filter(m => m.role === "Employee").map(m => ({ name: m.name })));
                  }
                }
              }}
              onChange={e => setFormData({ ...formData, head: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 appearance-none"
              required
            >
              <option value="" disabled>Select department head</option>
              {orgMembers.map((member, idx) => (
                <option key={idx} value={member.name}>{member.name}</option>
              ))}
            </select>
            <span className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <ChevronDown size={20} />
            </span>
          </div>
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
          {/* Managers */}
          <div>
            <label className=" text-sm font-medium text-gray-700 mb-2 flex items-center">Managers
              <button type="button" className="ml-2 p-1" onClick={() => handleAddMember("Manager")}> <Plus size={18} /> </button>
            </label>
            <div className="flex flex-wrap gap-1 mb-2">
              {formData.managers.map((m: any, idx: number) => (
                <span key={idx} className="bg-blue-100 text-blue-800 px-2 py-1 rounded flex items-center text-xs">
                  {m.name}
                  <button type="button" className="ml-1" onClick={() => handleRemoveMember("Manager", idx)}><X size={12} /></button>
                </span>
              ))}
            </div>
            {showManagerDropdown && (
              <div className="absolute z-10 bg-white border rounded shadow p-2 mt-1 max-h-40 overflow-y-auto">
                {orgMembers.filter(m => m.role === "Manager").map((m: any) => (
                  <div key={m.id} className="cursor-pointer hover:bg-blue-100 px-2 py-1" onClick={() => handleSelectMember("Manager", m)}>{m.name}</div>
                ))}
              </div>
            )}
          </div>
          {/* Employees */}
          <div>
            <label className=" text-sm font-medium text-gray-700 mb-2 flex items-center">Employees
              <button type="button" className="ml-2 p-1" onClick={() => handleAddMember("Employee")}> <Plus size={18} /> </button>
            </label>
            <div className="flex flex-wrap gap-1 mb-2">
              {formData.employees.map((m: any, idx: number) => (
                <span key={idx} className="bg-green-100 text-green-800 px-2 py-1 rounded flex items-center text-xs">
                  {m.name}
                  <button type="button" className="ml-1" onClick={() => handleRemoveMember("Employee", idx)}><X size={12} /></button>
                </span>
              ))}
            </div>
            {showEmployeeDropdown && (
              <div className="absolute z-10 bg-white border rounded shadow p-2 mt-1 max-h-40 overflow-y-auto">
                {orgMembers.filter(m => m.role === "Employee").map((m: any) => (
                  <div key={m.id} className="cursor-pointer hover:bg-green-100 px-2 py-1" onClick={() => handleSelectMember("Employee", m)}>{m.name}</div>
                ))}
              </div>
            )}
          </div>
          {/* Interns */}
          <div>
            <label className=" text-sm font-medium text-gray-700 mb-2 flex items-center">Interns
              <button type="button" className="ml-2 p-1" onClick={() => handleAddMember("Intern")}> <Plus size={18} /> </button>
            </label>
            <div className="flex flex-wrap gap-1 mb-2">
              {formData.interns.map((m: any, idx: number) => (
                <span key={idx} className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded flex items-center text-xs">
                  {m.name}
                  <button type="button" className="ml-1" onClick={() => handleRemoveMember("Intern", idx)}><X size={12} /></button>
                </span>
              ))}
            </div>
            {showInternDropdown && (
              <div className="absolute z-10 bg-white border rounded shadow p-2 mt-1 max-h-40 overflow-y-auto">
                {orgMembers.filter(m => m.role === "Intern").map((m: any) => (
                  <div key={m.id} className="cursor-pointer hover:bg-yellow-100 px-2 py-1" onClick={() => handleSelectMember("Intern", m)}>{m.name}</div>
                ))}
              </div>
            )}
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
