import { User, CreditCard, DollarSign, TrendingUp } from "lucide-react"
import type { ManagerInfo } from "./types"

interface PersonalDetailsProps {
  managerInfo: ManagerInfo
}

export default function PersonalDetails({ managerInfo }: PersonalDetailsProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Personal Details</h2>

      {/* Profile Information */}
      <div className="bg-white rounded-lg shadow-sm border border-red-200 p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
          <User className="w-6 h-6 text-red-500 mr-2" />
          Profile Information
        </h3>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <p className="text-gray-900 font-medium">{managerInfo.name}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Employee ID</label>
            <p className="text-gray-900 font-medium">{managerInfo.personalInfo.employeeId}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
            <p className="text-gray-900 font-medium">{managerInfo.department}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
            <p className="text-gray-900 font-medium">{managerInfo.personalInfo.dateOfBirth}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <p className="text-gray-900 font-medium">{managerInfo.email}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
            <p className="text-gray-900 font-medium">{managerInfo.phone}</p>
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
            <p className="text-gray-900 font-medium">{managerInfo.personalInfo.address}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Emergency Contact</label>
            <p className="text-gray-900 font-medium">{managerInfo.personalInfo.emergencyContact}</p>
          </div>
        </div>
      </div>

      {/* Bank Details */}
      <div className="bg-white rounded-lg shadow-sm border border-red-200 p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
          <CreditCard className="w-6 h-6 text-red-500 mr-2" />
          Bank Details
        </h3>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Account Number</label>
            <p className="text-gray-900 font-medium">{managerInfo.bankDetails.accountNumber}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Bank Name</label>
            <p className="text-gray-900 font-medium">{managerInfo.bankDetails.bankName}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">IFSC Code</label>
            <p className="text-gray-900 font-medium">{managerInfo.bankDetails.ifsc}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Branch</label>
            <p className="text-gray-900 font-medium">{managerInfo.bankDetails.branch}</p>
          </div>
        </div>
      </div>

      {/* Salary Information */}
      <div className="bg-white rounded-lg shadow-sm border border-red-200 p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
          <DollarSign className="w-6 h-6 text-red-500 mr-2" />
          Salary Information
        </h3>
        <div className="grid grid-cols-3 gap-6">
          <div className="text-center">
            <label className="block text-sm font-medium text-gray-700 mb-2">Basic Salary</label>
            <p className="text-3xl font-bold text-gray-900">${managerInfo.salary.basic.toLocaleString()}</p>
          </div>
          <div className="text-center">
            <label className="block text-sm font-medium text-gray-700 mb-2">Allowances</label>
            <p className="text-3xl font-bold text-gray-900">${managerInfo.salary.allowances.toLocaleString()}</p>
          </div>
          <div className="text-center">
            <label className="block text-sm font-medium text-gray-700 mb-2">Total Salary</label>
            <p className="text-3xl font-bold text-red-600">${managerInfo.salary.total.toLocaleString()}</p>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-red-100">
          <p className="text-sm text-gray-600">
            Last Appraisal: <span className="font-medium">{managerInfo.salary.lastAppraisal}</span>
          </p>
        </div>
      </div>

      {/* Appraisal Requests */}
      <div className="bg-white rounded-lg shadow-sm border border-red-200 p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
          <TrendingUp className="w-6 h-6 text-red-500 mr-2" />
          Appraisal Requests
        </h3>
        <div className="bg-red-50 rounded-lg p-4 mb-4">
          <p className="text-red-700 mb-2">
            <strong>Next Appraisal Due:</strong> December 2024
          </p>
          <p className="text-gray-600 text-sm">
            You can request an appraisal review based on your performance metrics and achievements.
          </p>
        </div>
        <button className="bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600 transition-colors font-medium">
          <TrendingUp className="w-5 h-5 inline mr-2" />
          Request Appraisal Review
        </button>
      </div>
    </div>
  )
}
