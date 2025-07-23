"use client"

import { useState, useEffect } from "react"
import { Plus, X } from "lucide-react"
import { sampleMembers } from "@/lib/sampleData"
import { useRouter } from "next/navigation"
import axios from "@/lib/axiosInstance"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

type RoleKey = "managers" | "employees" | "interns";
type FormData = {
  name: string;
  head: string;
  budget: string;
  managers: any[];
  employees: any[];
  interns: any[];
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
  const [orgMembers, setOrgMembers] = useState<any[]>([])

  // Fetch organization members on component mount
  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const res = await axios.get("/IT/org-members/empInfo");
        console.log("Fetched employee info:", res.data);
        setOrgMembers(res.data);
      } catch (err) {
        console.error("Failed to fetch organization members:", err);
        setOrgMembers(sampleMembers);
      }
    };
    fetchMembers();
  }, []);

  // Get all assigned member IDs across all roles
  const getAssignedMemberIds = () => {
    const assignedIds = new Set();
    [...formData.managers, ...formData.employees, ...formData.interns].forEach(member => {
      assignedIds.add(member.id);
    });
    return assignedIds;
  };

  // Get available members for a specific role (excluding already assigned ones)
  const getAvailableMembersForRole = (targetRole: string) => {
    const assignedIds = getAssignedMemberIds();
    return orgMembers.filter(member => 
      member.role.toLowerCase() === targetRole.toLowerCase() && 
      !assignedIds.has(member.id)
    );
  };

  const handleSelectMember = (role: string, member: any) => {
    const key = (role.toLowerCase() + 's') as RoleKey;
    setFormData(prev => ({
      ...prev,
      [key]: [...prev[key], member]
    }));
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
          <Select value={formData.head} onValueChange={(value) => setFormData({ ...formData, head: value })}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select department head" />
            </SelectTrigger>
            <SelectContent>
              {orgMembers.map((member) => (
                <SelectItem key={member.id} value={member.name}>
                  <div className="flex flex-col">
                    <span className="font-medium">{member.name}</span>
                    <span className="text-xs text-gray-500">{member.role} • {member.department}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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
          {/* Managers */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 flex items-center">
              Managers
              <Select onValueChange={(value) => {
                const member = orgMembers.find(m => m.id === value);
                if (member) handleSelectMember("Manager", member);
              }}>
                <SelectTrigger className="ml-2 w-8 h-8 p-0">
                  <Plus size={16} />
                </SelectTrigger>
                <SelectContent>
                  {getAvailableMembersForRole("Manager").length === 0 ? (
                    <SelectItem value="none" disabled>No available managers</SelectItem>
                  ) : (
                    getAvailableMembersForRole("Manager").map((m: any) => (
                      <SelectItem key={m.id} value={m.id}>
                        <div className="flex flex-col">
                          <span className="font-medium">{m.name}</span>
                          <span className="text-xs text-gray-500">{m.department} • {m.organization}</span>
                        </div>
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </label>
            <div className="flex flex-wrap gap-1 mb-2">
              {formData.managers.map((m: any, idx: number) => (
                <span key={idx} className="bg-blue-100 text-blue-800 px-2 py-1 rounded flex items-center text-xs">
                  {m.name}
                  <button type="button" className="ml-1" onClick={() => handleRemoveMember("Manager", idx)}><X size={12} /></button>
                </span>
              ))}
            </div>
          </div>
          {/* Employees */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 flex items-center">
              Employees
              <Select onValueChange={(value) => {
                const member = orgMembers.find(m => m.id === value);
                if (member) handleSelectMember("Employee", member);
              }}>
                <SelectTrigger className="ml-2 w-8 h-8 p-0">
                  <Plus size={16} />
                </SelectTrigger>
                <SelectContent>
                  {getAvailableMembersForRole("Employee").length === 0 ? (
                    <SelectItem value="none" disabled>No available employees</SelectItem>
                  ) : (
                    getAvailableMembersForRole("Employee").map((m: any) => (
                      <SelectItem key={m.id} value={m.id}>
                        <div className="flex flex-col">
                          <span className="font-medium">{m.name}</span>
                          <span className="text-xs text-gray-500">{m.department} • {m.organization}</span>
                        </div>
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </label>
            <div className="flex flex-wrap gap-1 mb-2">
              {formData.employees.map((m: any, idx: number) => (
                <span key={idx} className="bg-green-100 text-green-800 px-2 py-1 rounded flex items-center text-xs">
                  {m.name}
                  <button type="button" className="ml-1" onClick={() => handleRemoveMember("Employee", idx)}><X size={12} /></button>
                </span>
              ))}
            </div>
          </div>
          {/* Interns */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 flex items-center">
              Interns
              <Select onValueChange={(value) => {
                const member = orgMembers.find(m => m.id === value);
                if (member) handleSelectMember("Intern", member);
              }}>
                <SelectTrigger className="ml-2 w-8 h-8 p-0">
                  <Plus size={16} />
                </SelectTrigger>
                <SelectContent>
                  {getAvailableMembersForRole("Intern").length === 0 ? (
                    <SelectItem value="none" disabled>No available interns</SelectItem>
                  ) : (
                    getAvailableMembersForRole("Intern").map((m: any) => (
                      <SelectItem key={m.id} value={m.id}>
                        <div className="flex flex-col">
                          <span className="font-medium">{m.name}</span>
                          <span className="text-xs text-gray-500">{m.department} • {m.organization}</span>
                        </div>
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </label>
            <div className="flex flex-wrap gap-1 mb-2">
              {formData.interns.map((m: any, idx: number) => (
                <span key={idx} className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded flex items-center text-xs">
                  {m.name}
                  <button type="button" className="ml-1" onClick={() => handleRemoveMember("Intern", idx)}><X size={12} /></button>
                </span>
              ))}
            </div>
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
 