"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { PersonalDashboard } from "../components/personal-dashboard";
import { EmployeeEditForm } from "../components/employee-edit-form";
import { useNotification } from "../components/notification";
import type { EmployeeInfo, AttendanceRecord } from "../../types/employees";
import axios from "@/lib/axiosInstance";

interface EmployeeUpdatePayload {
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  dateOfBirth?: string;
  emergencyContact?: string;
}

export default function DashboardPage() {
  const { id } = useParams();
  const router = useRouter();
  const [employeeInfo, setEmployeeInfo] = useState<EmployeeInfo | null>(null);
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [pwLoading, setPwLoading] = useState(false);
  const { showNotification, NotificationComponent } = useNotification();

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        const [employeeRes, attendanceRes] = await Promise.all([
          axios.get(`/employees/${id}`),
          axios.get(`/employees/${id}/attendance`),
        ]);
        setEmployeeInfo(employeeRes.data);
        
        // Handle different response formats
        const rawAttendance = attendanceRes.data;
        const records = Array.isArray(rawAttendance)
          ? rawAttendance
          : rawAttendance.records || rawAttendance.data || [];

        setAttendanceRecords(records);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleSaveEmployee = async (updatedData: Partial<EmployeeInfo>) => {
    if (!id) return;

    setUpdateLoading(true);
    try {
      // Map the frontend data structure to backend expected format
      const updatePayload: EmployeeUpdatePayload = {};
      
      if (updatedData.name) updatePayload.name = updatedData.name;
      if (updatedData.email) updatePayload.email = updatedData.email;
      if (updatedData.phone) updatePayload.phone = updatedData.phone;
      
      if (updatedData.personalInfo) {
        if (updatedData.personalInfo.address) updatePayload.address = updatedData.personalInfo.address;
        if (updatedData.personalInfo.dateOfBirth) updatePayload.dateOfBirth = updatedData.personalInfo.dateOfBirth;
        if (updatedData.personalInfo.emergencyContact) updatePayload.emergencyContact = updatedData.personalInfo.emergencyContact;
      }

      // Update employee via API
      const response = await axios.put(`/user/${id}`, updatePayload);
      
      if (response.data.success) {
        // Update local state with new data
        setEmployeeInfo(prev => prev ? { ...prev, ...updatedData } : null);
        setIsEditing(false);
        showNotification("success", "Employee details updated successfully!");
      }
    } catch (error) {
      console.error("Failed to update employee:", error);
      showNotification("error", "Failed to update employee details. Please try again.");
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  const handleLogout = () => {
    try {
      // Clear any client-side state if used
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
        sessionStorage.clear();
      }
    } catch {}
    router.push("/login");
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword) {
      showNotification("error", "Please fill both fields");
      return;
    }
    setPwLoading(true);
    try {
      await axios.patch(`/auth/change-password`, {
        currentPassword,
        newPassword,
      });
      showNotification("success", "Password changed successfully");
      setShowChangePassword(false);
      setCurrentPassword("");
      setNewPassword("");
    } catch (error: any) {
      const msg = error?.response?.data?.message || "Failed to change password";
      showNotification("error", msg);
    } finally {
      setPwLoading(false);
    }
  };

  if (loading || !employeeInfo) {
    return <div className="animate-pulse">Loading dashboard...</div>;
  }

  if (isEditing) {
    return (
      <>
        {NotificationComponent}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">Edit Employee Details</h2>
          </div>
          <EmployeeEditForm
            employeeInfo={employeeInfo}
            onSave={handleSaveEmployee}
            onCancel={handleCancelEdit}
            isLoading={updateLoading}
          />
        </div>
      </>
    );
  }

  return (
    <>
      {NotificationComponent}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Personal Dashboard</h2>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center space-x-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              <span>Edit</span>
            </button>
            <button
              onClick={() => setShowChangePassword(true)}
              className="px-4 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              Change Password
            </button>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Logout
            </button>
          </div>
        </div>
        <PersonalDashboard
          employeeInfo={employeeInfo}
          attendanceRecords={attendanceRecords}
        />
      </div>

      {showChangePassword && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
            <h3 className="text-xl font-semibold mb-4">Change Password</h3>
            <form onSubmit={handleChangePassword} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowChangePassword(false)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
                  disabled={pwLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-60"
                  disabled={pwLoading}
                >
                  {pwLoading ? "Saving..." : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
