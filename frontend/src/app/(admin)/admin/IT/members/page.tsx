"use client"
import { useRouter } from "next/navigation"
import { useEffect, useState, useMemo } from "react"
import { motion } from "framer-motion"
import { Users, Plus, Search, Filter } from "lucide-react"
import { sampleMembers } from "@/lib/sampleData"
import axios from "@/lib/axiosInstance"
import type { OrganizationMember } from "../../types/index"
export default function MembersPage() {

  const fetchMembers = async () => {
    // Fetch members from the backend API using axios
    const response = await axios.get('/IT/org-members')
    return response.data
    const response = await fetch(`http://localhost:5000/api/IT/org-members`)
    if (!response.ok) {
      throw new Error("Failed to fetch members")
    }
    const data = await response.json()
    return data
  }

  useEffect(() => {
    const loadMembers = async () => {
      try {
        const membersData = await fetchMembers()
        setMembers(membersData)
      } catch (error) {
        console.error("Error fetching members:", error)
        // Fallback to sample data if fetch fails
        setMembers(sampleMembers)
      }
    }

    loadMembers()
  }, [])

  const [members, setMembers] = useState<OrganizationMember[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedDepartment, setSelectedDepartment] = useState("all")
  const router = useRouter()

  // Get unique departments for the filter dropdown
  const departments = useMemo(() => {
    const uniqueDepartments = Array.from(new Set(members.map(member => member.department)))
    return uniqueDepartments.sort()
  }, [members])

  // Filter members based on search term and department
  const filteredMembers = useMemo(() => {
    return members.filter(member => {
      const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          member.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          member.contactInfo.email.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesDepartment = selectedDepartment === "all" || member.department === selectedDepartment
      
      return matchesSearch && matchesDepartment
    })
  }, [members, searchTerm, selectedDepartment])

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-100 rounded-lg">
            <Users className="text-blue-600" size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Members</h1>
            <p className="text-gray-600">Manage your organization members</p>
          </div>
        </div>
        <button
          onClick={() => router.push("/admin/IT/members/add")}
          className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus size={18} />
          Add Member
        </button>
      </div>

      {/* Search and Filter Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search members by name, role, or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>

          {/* Department Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="pl-10 pr-8 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white min-w-[200px]"
            >
              <option value="all">All Departments</option>
              {departments.map((department) => (
                <option key={department} value={department}>
                  {department}
                </option>
              ))}
            </select>
          </div>

          {/* Results Count */}
          <div className="text-sm text-gray-600 whitespace-nowrap">
            {filteredMembers.length} of {members.length} members
          </div>
        </div>

        {/* Clear Filters */}
        {(searchTerm || selectedDepartment !== "all") && (
          <div className="mt-4 flex gap-2">
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="text-xs bg-gray-100 text-gray-700 px-3 py-1 rounded-full hover:bg-gray-200"
              >
                Clear search: "{searchTerm}"
              </button>
            )}
            {selectedDepartment !== "all" && (
              <button
                onClick={() => setSelectedDepartment("all")}
                className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full hover:bg-blue-200"
              >
                Clear filter: {selectedDepartment}
              </button>
            )}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMembers.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <Users className="mx-auto text-gray-400 mb-4" size={48} />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No members found</h3>
            <p className="text-gray-600">
              {searchTerm || selectedDepartment !== "all" 
                ? "Try adjusting your search or filter criteria" 
                : "Get started by adding your first member"}
            </p>
            {(!searchTerm && selectedDepartment === "all") && (
              <button
                onClick={() => router.push("/admin/IT/members/add")}
                className="mt-4 inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus size={16} />
                Add First Member
              </button>
            )}
          </div>
        ) : (
          filteredMembers.map((member) => (
            <motion.div
              key={member.id}
              whileHover={{ y: -2, scale: 1.01 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 cursor-pointer hover:shadow-md transition-all"
              onClick={() => router.push(`/admin/IT/members/${member.id}`)}
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-lg">
                  {member.name
                    .split(" ")
                    .map((n: string) => n[0])
                    .join("")}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">{member.name}</h3>
                  <p className="text-sm text-gray-600">{member.role}</p>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-gray-700">
                  <span>Department</span>
                  <span className="font-medium text-gray-900">{member.department}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Salary</span>
                  <span className="font-medium text-green-600">
                    ${member.salary.toLocaleString()}
                  </span>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  )
}
