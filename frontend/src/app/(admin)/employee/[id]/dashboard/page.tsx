"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { PersonalDashboard } from "../components/personal-dashboard";
import type { EmployeeInfo, AttendanceRecord } from "../../types/employees";
import axios from "@/lib/axiosInstance";

export default function DashboardPage() {
  const { id } = useParams();
  const [employeeInfo, setEmployeeInfo] = useState<EmployeeInfo | null>(null);
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

   const fetchData = async () => {
  try {
    const [employeeRes, attendanceRes] = await Promise.all([
      axios.get(`/employees/${id}`),
      axios.get(`/employees/${id}/attendance`),
    ]);
    setEmployeeInfo(employeeRes.data);
    
    // 👇 FIX HERE
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

  if (loading || !employeeInfo) {
    return <div className="animate-pulse">Loading dashboard...</div>;
  }

  return (
    <PersonalDashboard
      employeeInfo={employeeInfo}
      attendanceRecords={attendanceRecords}
    />
  );
}
