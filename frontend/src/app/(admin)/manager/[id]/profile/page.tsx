"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { User, Users, Star, Award } from "lucide-react"
import  { ManagerInfo } from "../types";
import { calculatePerformanceMetrics } from "../utils/performance"
import { mockManagerInfo } from "../data/mockData";



export default function ProfileSection() {
  const [manager, setManager] = useState<ManagerInfo | null>(null)
  const { id: managerId } = useParams()
  useEffect(() => {
    // Fetch manager profile data
    const fetchManagerProfile = async () => {
      try {
        const response = await fetch(`/api/manager/${managerId}/profile`)
        if (!response.ok) {
          throw new Error("Failed to fetch manager profile")
        }
        const managerData = await response.json()
        setManager(managerData)
      } catch (error) {
        // console.error("Error fetching manager profile:", error)
        setManager(mockManagerInfo) // Use mock data in case of error
      }
    }

    fetchManagerProfile()
  }, [managerId])

  return (
    <div className="space-y-6">
      {/* Manager Profile Card */}
      <div className="bg-white rounded-lg shadow-sm border border-red-200 p-6">
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-20 h-20 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center">
            <User className="w-10 h-10 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{manager?.name}</h2>
            <p className="text-red-600 font-medium text-lg">{manager?.department}</p>
            <p className="text-gray-600">{manager?.email}</p>
            <p className="text-gray-600">{manager?.phone}</p>
            <p className="text-sm text-gray-500">Employee ID: {manager?.personalInfo?.employeeId}</p>
          </div>
        </div>
      </div>

      {/* Associated Employees */}
      <div className="bg-white rounded-lg shadow-sm border border-red-200 p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
          <Users className="w-6 h-6 text-red-500 mr-2" />
          Associated Employees ({manager?.employees?.length ?? 0})
        </h3>
        <div className="grid gap-4">
          {manager?.employees.map((employee) => {
            const metrics = calculatePerformanceMetrics(employee)
            return (
              <div
                key={employee.id}
                className="border border-red-100 rounded-lg p-4 hover:shadow-md transition-shadow bg-red-50"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-semibold text-gray-900 text-lg">{employee.name}</h4>
                    <p className="text-red-600 font-medium">{employee.position}</p>
                    <p className="text-gray-600">{employee.department}</p>
                    <p className="text-gray-500 text-sm">Joined: {employee.joinDate}</p>
                    <p className="text-gray-600 text-sm">{employee.email}</p>
                  </div>
                  <div className="text-right">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">Performance</p>
                        <div className="flex items-center space-x-1">
                          <Star className="w-4 h-4 text-yellow-500" />
                          <span className="font-medium">{employee.performance}/5</span>
                        </div>
                      </div>
                      <div>
                        <p className="text-gray-600">Attendance</p>
                        <span className="font-medium text-green-600">{employee.attendance}%</span>
                      </div>
                      <div>
                        <p className="text-gray-600">Tasks/Day</p>
                        <span className="font-medium text-blue-600">{employee.tasksPerDay}/5</span>
                      </div>
                      <div>
                        <p className="text-gray-600">Overall</p>
                        <span className="font-medium text-red-600">{metrics.combinedPercentage}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Associated Interns */}
      <div className="bg-white rounded-lg shadow-sm border border-red-200 p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
          <Award className="w-6 h-6 text-red-500 mr-2" />
          Associated Interns ({manager?.interns?.length})
        </h3>
        <div className="grid gap-4">
          {manager?.interns?.map((intern) => (
            <div key={intern.id} className="border border-red-100 rounded-lg p-4 bg-red-50">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-semibold text-gray-900 text-lg">{intern.name}</h4>
                  <p className="text-red-600 font-medium">{intern.department}</p>
                  <p className="text-gray-600">Duration: {intern.duration}</p>
                  <p className="text-gray-500 text-sm">Mentor: {intern.mentor}</p>
                  <p className="text-gray-500 text-sm">
                    {intern.startDate} - {intern.endDate}
                  </p>
                </div>
                <div className="text-right">
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-500" />
                    <span className="font-medium">{intern.performance}/5</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
