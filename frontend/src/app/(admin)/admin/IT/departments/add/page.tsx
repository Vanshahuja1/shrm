"use client"

import { useState, useEffect } from "react"
import { ChevronDown } from "lucide-react"
import { sampleMembers } from "@/lib/sampleData"
import { useRouter } from "next/navigation"
import axios from "@/lib/axiosInstance"
import { MultiSelectDropdown } from "@/components/MultiSelectDropdown"

type Member = {
  id: string;
  name: string;
  role: string;
};
type FormData = {
  name: string;
  head: string;
  budget: string;
  managers: Member[];
  employees: Member[];
  interns: Member[];
};

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
  const [orgMembers, setOrgMembers] = useState<Member[]>([])
  const fetchOrgMembers = async () => {
    try {
      const res = await axios.get("/IT/org-members");
      setOrgMembers(res.data);
    } catch{
      setOrgMembers(sampleMembers.map(m => ({ id: String(m.id), name: m.name, role: m.role })));
    }
  };

  // Fetch organization members on component mount
  useEffect(() => {
    fetchOrgMembers();
  }, []);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const payload = {
      ...formData,
      budget: Number(formData.budget) || 0,
      managers: formData.managers,
      employees: formData.employees,
      interns: formData.interns,
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
                    const res = await axios.get("/org-members");
                    setOrgMembers(res.data);
                  } catch {
                    // fallback to sample data (only names of employees)
                    setOrgMembers(sampleMembers.filter(m => m.role === "Employee").map(m => ({ id: String(m.id), name: m.name, role: m.role })));
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
            min={0}
            onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
            placeholder="Enter budget in USD"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <MultiSelectDropdown
            label="Managers"
            options={orgMembers.filter(m => m.role === "manager")}
            selected={formData.managers}
            onAdd={m => setFormData(prev => ({ ...prev, managers: [...prev.managers, m] }))}
            onRemove={idx => setFormData(prev => ({ ...prev, managers: prev.managers.filter((_, i) => i !== idx) }))}
            getOptionLabel={m => m.name}
            getOptionKey={m => m.id}
            buttonLabel="Add"
            onDropdownOpen={fetchOrgMembers}
          />
          <MultiSelectDropdown
            label="Employees"
            options={orgMembers.filter(m => m.role === "employee")}
            selected={formData.employees}
            onAdd={m => setFormData(prev => ({ ...prev, employees: [...prev.employees, m] }))}
            onRemove={idx => setFormData(prev => ({ ...prev, employees: prev.employees.filter((_, i) => i !== idx) }))}
            getOptionLabel={m => m.name}
            getOptionKey={m => m.id}
            buttonLabel="Add"
            onDropdownOpen={fetchOrgMembers}
          />
          <MultiSelectDropdown
            label="Interns"
            options={orgMembers.filter(m => m.role === "intern")}
            selected={formData.interns}
            onAdd={m => setFormData(prev => ({ ...prev, interns: [...prev.interns, m] }))}
            onRemove={idx => setFormData(prev => ({ ...prev, interns: prev.interns.filter((_, i) => i !== idx) }))}
            getOptionLabel={m => m.name}
            getOptionKey={m => m.id}
            buttonLabel="Add"
            onDropdownOpen={fetchOrgMembers}
          />
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
  );
}
 