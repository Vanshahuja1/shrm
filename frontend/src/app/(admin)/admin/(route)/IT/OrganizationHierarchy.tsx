"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Building, Users, Award, UserCheck, Target, ChevronDown, ChevronRight } from 'lucide-react'
import { sampleDepartments, sampleMembers } from "./SampleData";
import type { Department, OrganizationMember } from "../types";

export default function OrganizationHierarchy() {
  const [selectedDepartment, setSelectedDepartment] = useState(sampleDepartments[0]?.id || null)
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set())

  const selectedDept = sampleDepartments.find((d) => d.id === selectedDepartment)

  const toggleNode = (nodeId: string) => {
    const newExpanded = new Set(expandedNodes)
    if (newExpanded.has(nodeId)) {
      newExpanded.delete(nodeId)
    } else {
      newExpanded.add(nodeId)
    }
    setExpandedNodes(newExpanded)
  }

  const getReportingStructure = () => {
    if (!selectedDept) return null

    const managers = sampleMembers.filter(
      (m) => m.department === selectedDept.name && m.role === "Manager"
    )
    const employees = sampleMembers.filter(
      (m) => m.department === selectedDept.name && m.role === "Employee"
    )
    const interns = sampleMembers.filter(
      (m) => m.department === selectedDept.name && m.role === "Intern"
    )

    return { managers, employees, interns }
  }

  const structure = getReportingStructure()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900"></h1>
          
        </div>
        <select
          value={selectedDepartment}
          onChange={(e) => setSelectedDepartment(Number(e.target.value))}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          {sampleDepartments.map((dept) => (
            <option key={dept.id} value={dept.id}>
              {dept.name}
            </option>
          ))}
        </select>
      </div>

      {/* Department Overview */}
      {selectedDept && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{selectedDept.name}</h2>
              <p className="text-gray-600">Department Head: {selectedDept.head}</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-green-600">${selectedDept.budget.toLocaleString()}</p>
              <p className="text-gray-600">Annual Budget</p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg text-center border border-blue-200">
              <p className="text-2xl font-bold text-blue-600">{selectedDept.managers}</p>
              <p className="text-blue-800 font-medium">Managers</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg text-center border border-green-200">
              <p className="text-2xl font-bold text-green-600">{selectedDept.employees}</p>
              <p className="text-green-800 font-medium">Employees</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg text-center border border-purple-200">
              <p className="text-2xl font-bold text-purple-600">{selectedDept.interns}</p>
              <p className="text-purple-800 font-medium">Interns</p>
            </div>
            <div className="bg-orange-50 p-4 rounded-lg text-center border border-orange-200">
              <p className="text-2xl font-bold text-orange-600">
                {selectedDept.managers + selectedDept.employees + selectedDept.interns}
              </p>
              <p className="text-orange-800 font-medium">Total</p>
            </div>
          </div>
        </div>
      )}

      {/* Hierarchy Visualization */}
      {selectedDept && structure && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">Organizational Chart</h3>

          {/* Department Head */}
          <div className="flex justify-center mb-8">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-gradient-to-br from-blue-600 to-blue-700 text-white p-6 rounded-xl text-center min-w-[200px] shadow-lg"
            >
              <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-3">
                <Award size={24} />
              </div>
              <h3 className="font-bold text-lg">{selectedDept.head}</h3>
              <p className="text-blue-100">Department Head</p>
              <p className="text-blue-200 text-sm mt-1">{selectedDept.name}</p>
            </motion.div>
          </div>

          {/* Connection Line */}
          <div className="flex justify-center mb-6">
            <div className="w-px h-8 bg-gray-300"></div>
          </div>

          {/* Managers Level */}
          {structure.managers.length > 0 && (
            <div className="mb-8">
              <h4 className="text-lg font-semibold text-gray-700 mb-4 text-center">
                Managers ({structure.managers.length})
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
                {structure.managers.map((manager) => (
                  <motion.div
                    key={manager.id}
                    whileHover={{ scale: 1.02 }}
                    className="bg-red-50 border-2 border-red-200 p-4 rounded-lg cursor-pointer"
                    onClick={() => toggleNode(`manager-${manager.id}`)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center">
                        <UserCheck size={20} className="text-white" />
                      </div>
                      {expandedNodes.has(`manager-${manager.id}`) ? (
                        <ChevronDown size={16} className="text-gray-400" />
                      ) : (
                        <ChevronRight size={16} className="text-gray-400" />
                      )}
                    </div>
                    <p className="font-semibold text-red-800">{manager.name}</p>
                    <p className="text-red-600 text-sm">{manager.role}</p>
                    <p className="text-red-500 text-xs">
                      Performance: {manager.performanceMetrics.combinedPercentage}%
                    </p>

                    {/* Manager's Direct Reports */}
                    {expandedNodes.has(`manager-${manager.id}`) && (
                      <div className="mt-4 pt-4 border-t border-red-200">
                        <p className="text-xs text-red-600 mb-2">Direct Reports:</p>
                        <div className="space-y-2">
                          {structure.employees
                            .filter((emp) => emp.reportsTo === manager.name)
                            .map((employee) => (
                              <div key={employee.id} className="bg-white p-2 rounded border">
                                <p className="text-xs font-medium text-gray-800">{employee.name}</p>
                                <p className="text-xs text-gray-600">{employee.role}</p>
                              </div>
                            ))}
                        </div>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Connection Lines */}
          {structure.employees.length > 0 && (
            <div className="flex justify-center mb-6">
              <div className="w-px h-8 bg-gray-300"></div>
            </div>
          )}

          {/* Employees Level */}
          {structure.employees.length > 0 && (
            <div className="mb-8">
              <h4 className="text-lg font-semibold text-gray-700 mb-4 text-center">
                Employees ({structure.employees.length})
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 max-w-6xl mx-auto">
                {structure.employees.map((employee) => (
                  <motion.div
                    key={employee.id}
                    whileHover={{ scale: 1.05 }}
                    className="bg-green-50 border-2 border-green-200 p-3 rounded-lg text-center"
                  >
                    <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-2 text-white text-sm font-bold">
                      {employee.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </div>
                    <p className="font-semibold text-green-800 text-sm">{employee.name}</p>
                    <p className="text-green-600 text-xs">{employee.role}</p>
                    <p className="text-green-500 text-xs">
                      {employee.performanceMetrics.combinedPercentage}%
                    </p>
                    {employee.reportsTo && (
                      <p className="text-green-400 text-xs mt-1">→ {employee.reportsTo}</p>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Connection Lines */}
          {structure.interns.length > 0 && (
            <div className="flex justify-center mb-6">
              <div className="w-px h-8 bg-gray-300"></div>
            </div>
          )}

          {/* Interns Level */}
          {structure.interns.length > 0 && (
            <div>
              <h4 className="text-lg font-semibold text-gray-700 mb-4 text-center">
                Interns ({structure.interns.length})
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 max-w-4xl mx-auto">
                {structure.interns.map((intern) => (
                  <motion.div
                    key={intern.id}
                    whileHover={{ scale: 1.05 }}
                    className="bg-purple-50 border-2 border-purple-200 p-3 rounded-lg text-center"
                  >
                    <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-2 text-white text-sm font-bold">
                      {intern.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </div>
                    <p className="font-semibold text-purple-800 text-sm">{intern.name}</p>
                    <p className="text-purple-600 text-xs">{intern.role}</p>
                    <p className="text-purple-500 text-xs">
                      {intern.performanceMetrics.combinedPercentage}%
                    </p>
                    {intern.reportsTo && (
                      <p className="text-purple-400 text-xs mt-1">→ {intern.reportsTo}</p>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Reporting Structure Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Reporting Structure</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Employee
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Reports To
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Performance
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Attendance
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {structure &&
                [...structure.managers, ...structure.employees, ...structure.interns].map((member) => (
                  <tr key={member.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold mr-3">
                          {member.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">{member.name}</div>
                          <div className="text-sm text-gray-500">{member.contactInfo.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          member.role === "Manager"
                            ? "bg-red-100 text-red-800"
                            : member.role === "Employee"
                            ? "bg-green-100 text-green-800"
                            : "bg-purple-100 text-purple-800"
                        }`}
                      >
                        {member.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {member.reportsTo || "Department Head"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: `${member.performanceMetrics.combinedPercentage}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-600">{member.performanceMetrics.combinedPercentage}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          member.attendance.todayPresent
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {member.attendance.todayPresent ? "Present" : "Absent"}
                      </span>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
