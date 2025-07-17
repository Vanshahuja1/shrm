import React, { useState } from 'react';
import { User, Users, Award, Star } from 'lucide-react';

type Employee = {
  id: number
  name: string
  department: string
  position: string
  email: string
  phone: string
  joinDate: string
  performance: number
  attendance: number
  tasksPerDay: number
  managerRating: number
}

type Intern = {
  id: number
  name: string
  department: string
  duration: string
  mentor: string
  performance: number
  startDate: string
  endDate: string
}
type ManagerInfo = {
  id: string
  name: string
  department: string
  email: string
  phone: string
  employees: Employee[]
  interns: Intern[]
  bankDetails: {
    accountNumber: string
    bankName: string
    ifsc: string
    branch: string
  }
  salary: {
    basic: number
    allowances: number
    total: number
    lastAppraisal: string
  }
  personalInfo: {
    address: string
    emergencyContact: string
    dateOfBirth: string
    employeeId: string
  }
}



type ManagerProfileProps = {
  managerInfo: ManagerInfo
};

const ManagerProfile: React.FC<ManagerProfileProps> = ({ managerInfo }) => {
    const calculatePerformanceMetrics = (employee: Employee) => {
    const tasksScore = (employee.tasksPerDay / 5) * 100
    const attendanceScore = employee.attendance
    const managerReviewScore = (employee.managerRating / 5) * 100
    const combinedPercentage = (tasksScore + attendanceScore + managerReviewScore) / 3

    return {
      tasksScore,
      attendanceScore,
      managerReviewScore,
      combinedPercentage: Math.round(combinedPercentage),
    }
  }
  return (
    <div className="space-y-6">
      {/* Manager Profile Card */}
      <div className="bg-white rounded-lg shadow-sm border border-red-200 p-6">
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-20 h-20 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center">
            <User className="w-10 h-10 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{managerInfo.name}</h2>
            <p className="text-red-600 font-medium text-lg">{managerInfo.department}</p>
            <p className="text-gray-600">{managerInfo.email}</p>
            <p className="text-gray-600">{managerInfo.phone}</p>
            <p className="text-sm text-gray-500">Employee ID: {managerInfo.personalInfo.employeeId}</p>
          </div>
        </div>
      </div>

      {/* Associated Employees */}
      <div className="bg-white rounded-lg shadow-sm border border-red-200 p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
          <Users className="w-6 h-6 text-red-500 mr-2" />
          Associated Employees ({managerInfo.employees.length})
        </h3>
        <div className="grid gap-4">
          {managerInfo.employees.map((employee) => {
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
          Associated Interns ({managerInfo.interns.length})
        </h3>
        <div className="grid gap-4">
          {managerInfo.interns.map((intern) => (
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
  );
};
export default ManagerProfile;