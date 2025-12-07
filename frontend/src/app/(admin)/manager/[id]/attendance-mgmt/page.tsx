"use client"

import { Clock, LogIn, LogOut } from "lucide-react"
import { useState, useEffect } from "react"
import type { AttendanceRecord } from "../types/index"
import { useParams } from "next/navigation"
import { mockAttendanceRecords } from "../data/mockData"
import axiosInstance from "@/lib/axiosInstance";

// Type for manager's attendance data
interface ManagerAttendance {
  isPunchedIn: boolean;
  workStartTime?: string;
  totalWorkHours?: number;
  breakTime?: number;
  overtimeHours?: number;
  hasCompletedWorkToday?: boolean; // New field to track if user completed work today
  lastPunchOutTime?: string; // Track when they last punched out
}

// Type for API response data
interface ApiResponse {
  data?: AttendanceRecord[];
  records?: AttendanceRecord[];
}

export default function AttendanceManagement() {
  // Manager's own attendance state
  const [managerAttendance, setManagerAttendance] = useState<ManagerAttendance | null>(null);
  const [isManagerLoading, setIsManagerLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date())
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([])
  const [employeeMap, setEmployeeMap] = useState<Record<string, { id: string; name: string }>>({});
  const [hasMounted, setHasMounted] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;
  const [isLoading, setIsLoading] = useState(true);

  const { id: managerId } = useParams()

  useEffect(() => {
    if (!managerId) return;
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch manager info (with employees and interns)
        const managerRes = await axiosInstance.get(`/IT/org-members/${managerId}`);
        const managerData = managerRes.data;
        // Collect all employee and intern IDs and build a map for details
        const employees = Array.isArray(managerData.employees) ? managerData.employees : [];
        const interns = Array.isArray(managerData.interns) ? managerData.interns : [];
        const allIds = [...employees.map((e: { id: string }) => e.id), ...interns.map((i: { id: string }) => i.id)];
        // Build a map of id -> { id, name }
        const map: Record<string, { id: string; name: string }> = {};
        employees.forEach((e: { id: string; name: string }) => { map[e.id] = { id: e.id, name: e.name }; });
        interns.forEach((i: { id: string; name: string }) => { map[i.id] = { id: i.id, name: i.name }; });
        setEmployeeMap(map);
        // Fetch attendance for all
        const attendancePromises = allIds.map((empId: string) =>
          axiosInstance.get(`/employees/${empId}/attendance`).then((res: { data: ApiResponse }) => res.data)
        );
        const attendanceResults = await Promise.all(attendancePromises);
        // Flatten and filter attendance records
        const allRecords = attendanceResults.flatMap((raw: ApiResponse) => {
          if (Array.isArray(raw)) return raw as AttendanceRecord[];
          if (raw.records) return raw.records;
          if (raw.data) return raw.data;
          return [];
        });
        setAttendanceRecords(allRecords);
      } catch (error) {
        console.error("Error fetching attendance records:", error);
        setAttendanceRecords(mockAttendanceRecords); // Fallback to mock records
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [managerId]);

  // Update current time every second
  useEffect(() => {
    setHasMounted(true);
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  // Fetch manager's own attendance info
  const fetchManagerAttendance = async () => {
    if (!managerId) return;
    setIsManagerLoading(true);
    try {
      const response = await axiosInstance.get(`/employees/${managerId}/attendance`);
      setManagerAttendance(response.data);
    } catch (error) {
      console.error("Failed to fetch manager attendance:", error);
      setManagerAttendance(null);
    } finally {
      setIsManagerLoading(false);
    }
  };

  useEffect(() => {
    fetchManagerAttendance();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [managerId]);

  // Calculate real-time work hours if punched in
  const calculateCurrentWorkHours = () => {
    if (!managerAttendance?.isPunchedIn || !managerAttendance?.workStartTime) {
      return managerAttendance?.totalWorkHours ?? 0;
    }
    
    // Parse the work start time (assuming it's in IST or local timezone)
    const workStartTime = managerAttendance.workStartTime;
    let startTime: Date;
    
    // Handle different time formats
    if (workStartTime.includes('T')) {
      // ISO format: extract time and create date for today in local timezone
      const timeOnly = workStartTime.split('T')[1].slice(0, 5); // Get HH:MM
      const today = new Date();
      const [hours, minutes] = timeOnly.split(':').map(Number);
      startTime = new Date(today.getFullYear(), today.getMonth(), today.getDate(), hours, minutes);
    } else {
      // Assume it's already a valid date string
      startTime = new Date(workStartTime);
    }
    
    // Calculate hours from work start time to current time (both in local timezone)
    const currentTimeMs = currentTime.getTime();
    const startTimeMs = startTime.getTime();
    const diffMs = currentTimeMs - startTimeMs;
    const diffHours = diffMs / (1000 * 60 * 60);
    
    return Math.max(0, diffHours);
  };

  // Check if user can punch in (not completed work today)
  const canPunchIn = () => {
    if (!managerAttendance) return true;
    
    // If user is currently punched in, they can't punch in again
    if (managerAttendance.isPunchedIn) {
      return false;
    }
    
    // If user has already worked 8+ hours today and is not currently punched in,
    // it means they already completed work and punched out - don't allow punch in again
    if (calculateCurrentWorkHours() >= 8 && !managerAttendance.isPunchedIn) {
      return false;
    }
    
    // Backend-based logic (if available)
    if (managerAttendance.hasCompletedWorkToday) {
      const today = new Date().toDateString();
      const lastPunchOut = managerAttendance.lastPunchOutTime ? new Date(managerAttendance.lastPunchOutTime).toDateString() : null;
      
      // If they completed work today, don't allow punch in
      if (lastPunchOut === today) {
        return false;
      }
    }
    
    return true;
  };

  // Handle punch in/out for manager
  const handleManagerPunchToggle = async () => {
    if (!managerId) return;
    try {
      // Create local timestamp
      const now = new Date();
      const localTimestamp = new Date(now.getTime() - (now.getTimezoneOffset() * 60000)).toISOString();
      
      if (!managerAttendance?.isPunchedIn) {
        // Check if user can punch in
        if (!canPunchIn()) {
          alert("You have already completed your work for today. You cannot punch in again.");
          return;
        }
        
        // Punch in
        console.log(localTimestamp, "Punching in for manager:", managerId);
        await axiosInstance.post(`/employees/${managerId}/attendance`, {
          timestamp: localTimestamp,
        });
      } else {
        // Punch out
        console.log(localTimestamp, "Punching out for manager:", managerId);
        await axiosInstance.post(`/employees/${managerId}/attendance/punch-out`, {
          timestamp: localTimestamp,
        });
      }
      fetchManagerAttendance();
    } catch (error) {
      console.error("Failed to punch in/out:", error);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Attendance Management</h2>

      {/* Last 30 Days Overview */}
      <div className="bg-white rounded-lg shadow-sm border border-red-200 p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Last 30 Days Overview</h3>
        
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="relative w-16 h-16">
              <div className="absolute top-0 left-0 w-full h-full border-4 border-red-200 rounded-full"></div>
              <div className="absolute top-0 left-0 w-full h-full border-4 border-red-500 rounded-full border-t-transparent animate-spin"></div>
            </div>
            <p className="mt-4 text-gray-600 font-medium">Loading attendance records...</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-red-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Date</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Employee/Intern</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Punch In</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Punch Out</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Hours</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {(() => {
                    // Group records by date
                    const groupedByDate = attendanceRecords.reduce((acc, record) => {
                      if (!record.date) return acc;
                      if (!acc[record.date]) acc[record.date] = [];
                      acc[record.date].push(record);
                      return acc;
                    }, {} as Record<string, AttendanceRecord[]>);

                    // Sort dates in descending order (most recent first)
                    const sortedDates = Object.keys(groupedByDate).sort((a, b) => 
                      new Date(b).getTime() - new Date(a).getTime()
                    );

                    // Flatten all records while maintaining date grouping
                    const allRecords = sortedDates.flatMap((date) => 
                      groupedByDate[date].map((record: AttendanceRecord) => record)
                    );

                    // Calculate pagination
                    const startIndex = (currentPage - 1) * recordsPerPage;
                    const endIndex = startIndex + recordsPerPage;
                    const paginatedRecords = allRecords.slice(startIndex, endIndex);

                    if (paginatedRecords.length === 0) {
                      return (
                        <tr>
                          <td colSpan={6} className="py-8 text-center text-gray-500">
                            No attendance records found
                          </td>
                        </tr>
                      );
                    }

                    return paginatedRecords.map((record: AttendanceRecord, idx: number) => {
                      if (!record.employee) return null;
                      const employeeName = employeeMap[record.employee]?.name || record.employee || "Unknown";
                      const rowKey = `${record.date}-${record.employee || "unknown"}-${startIndex + idx}`;
                      return (
                        <tr key={rowKey} className="border-b border-gray-100 hover:bg-red-50">
                          <td className="py-3 px-4">{record.date}</td>
                          <td className="py-3 px-4 font-medium">{employeeName}</td>
                          <td className="py-3 px-4">{record.punchIn}</td>
                          <td className="py-3 px-4">{record.punchOut}</td>
                          <td className="py-3 px-4">{record.totalHours}h</td>
                          <td className="py-3 px-4">
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${
                                record.status === "present"
                                  ? "bg-green-100 text-green-800"
                                  : record.status === "late"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : record.status === "absent"
                                      ? "bg-red-100 text-red-800"
                                      : "bg-blue-100 text-blue-800"
                              }`}
                            >
                              {record.status.toUpperCase()}
                            </span>
                            {record.regularized && (
                              <span className="ml-2 text-xs text-blue-600 font-medium">(Regularized)</span>
                            )}
                          </td>
                        </tr>
                      );
                    });
                  })()}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            {(() => {
              const groupedByDate = attendanceRecords.reduce((acc, record) => {
                if (!record.date) return acc;
                if (!acc[record.date]) acc[record.date] = [];
                acc[record.date].push(record);
                return acc;
              }, {} as Record<string, AttendanceRecord[]>);

              const sortedDates = Object.keys(groupedByDate).sort((a, b) => 
                new Date(b).getTime() - new Date(a).getTime()
              );

              const allRecords = sortedDates.flatMap((date) => 
                groupedByDate[date].map((record: AttendanceRecord) => record)
              );

              const totalRecords = allRecords.length;
              const totalPages = Math.ceil(totalRecords / recordsPerPage);

              if (totalPages <= 1) return null;

              return (
                <div className="flex items-center justify-between mt-4 px-4">
                  <div className="text-sm text-gray-600">
                    Showing {((currentPage - 1) * recordsPerPage) + 1} to {Math.min(currentPage * recordsPerPage, totalRecords)} of {totalRecords} records
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                      className={`px-4 py-2 rounded-lg border transition-colors ${
                        currentPage === 1
                          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                          : "bg-white text-red-600 border-red-200 hover:bg-red-50"
                      }`}
                    >
                      Previous
                    </button>
                    <div className="flex space-x-1">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`px-4 py-2 rounded-lg border transition-colors ${
                            currentPage === page
                              ? "bg-red-500 text-white border-red-500"
                              : "bg-white text-red-600 border-red-200 hover:bg-red-50"
                          }`}
                        >
                          {page}
                        </button>
                      ))}
                    </div>
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                      disabled={currentPage === totalPages}
                      className={`px-4 py-2 rounded-lg border transition-colors ${
                        currentPage === totalPages
                          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                          : "bg-white text-red-600 border-red-200 hover:bg-red-50"
                      }`}
                    >
                      Next
                    </button>
                  </div>
                </div>
              );
            })()}
          </>
        )}
      </div>

      {/* Manager's Own Attendance Section (Red Themed, Employee UI) */}
      <div className="bg-white rounded-lg shadow-sm border border-red-200 p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
          <Clock className="w-6 h-6 text-red-500 mr-2" />
          Punch In/Out System
        </h3>
        <div className="text-center mb-6">
          <div className="w-32 h-32 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Clock className="w-16 h-16 text-white" />
          </div>
          <h4 className="text-4xl font-bold text-gray-900 mb-2">{hasMounted ? currentTime.toLocaleTimeString() : "--:--:--"}</h4>
          <p className="text-gray-600 text-lg">{hasMounted ? currentTime.toLocaleDateString() : "--/--/----"}</p>
          {managerAttendance?.workStartTime && (
            <p className="text-red-600 font-medium mt-2">
              Work started at: {managerAttendance.workStartTime.includes('T') 
                ? managerAttendance.workStartTime.split('T')[1].slice(0, 5)
                : managerAttendance.workStartTime
              }
            </p>
          )}
        </div>

        <div className="flex justify-center mb-6">
          {!managerAttendance?.isPunchedIn ? (
            <button
              onClick={handleManagerPunchToggle}
              className={`px-12 py-4 rounded-lg transition-colors flex items-center space-x-3 text-xl font-semibold ${
                canPunchIn() 
                  ? "bg-green-500 text-white hover:bg-green-600" 
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
              disabled={isManagerLoading || !canPunchIn()}
            >
              <LogIn className="w-8 h-8" />
              <span>Punch In</span>
            </button>
          ) : (
            <button
              onClick={handleManagerPunchToggle}
              disabled={isManagerLoading || calculateCurrentWorkHours() < 8}
              className={`px-12 py-4 rounded-lg transition-colors flex items-center space-x-3 text-xl font-semibold ${
                calculateCurrentWorkHours() >= 8 ? "bg-red-500 text-white hover:bg-red-600" : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              <LogOut className="w-8 h-8" />
              <span>Punch Out</span>
            </button>
          )}
        </div>

        {/* Minimum hours warning */}
        {managerAttendance?.isPunchedIn && calculateCurrentWorkHours() < 8 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
            <div className="flex items-center">
              <span className="text-yellow-800 font-medium">
                Minimum 8 hours required before punch out. Current: {calculateCurrentWorkHours().toFixed(1)} hours
              </span>
            </div>
          </div>
        )}

        {/* Work completed for today warning */}
        {!managerAttendance?.isPunchedIn && calculateCurrentWorkHours() >= 8 && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
            <div className="flex items-center">
              <span className="text-green-800 font-medium">
                ✅ You have already completed your work for today ({calculateCurrentWorkHours().toFixed(1)} hours). 
                You cannot punch in again until tomorrow.
              </span>
            </div>
          </div>
        )}

        {/* Work Hours Display */}
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="bg-red-50 rounded-lg p-4">
            <p className="text-sm text-gray-600">Today&apos;s Hours</p>
            <p className="text-2xl font-bold text-red-600">{calculateCurrentWorkHours().toFixed(1)}h</p>
          </div>
          {/* <div className="bg-green-50 rounded-lg p-4">
            <p className="text-sm text-gray-600">Break Time</p>
            <p className="text-2xl font-bold text-green-600">{managerAttendance?.breakTime ?? 0}m</p>
          </div> */}
          <div className="bg-orange-50 rounded-lg p-4">
            <p className="text-sm text-gray-600">Overtime</p>
            <p className="text-2xl font-bold text-orange-600">{Math.max(0, calculateCurrentWorkHours() - 8).toFixed(1)}h</p>
          </div>
          <div className="bg-purple-50 rounded-lg p-4">
            <p className="text-sm text-gray-600">Required</p>
            <p className="text-2xl font-bold text-purple-600">8.0h</p>
          </div>
        </div>

        {/* Break System (disabled for now) */}
        {/* {managerAttendance?.isPunchedIn && typeof managerId === 'string' && (
          <ManagerBreakSystem managerId={managerId} />
        )} */}
      </div>
    </div>
  );
}

// --- ManagerBreakSystem component definition (disabled for now) ---
/* 
function ManagerBreakSystem({ managerId }: { managerId: string }) {
  const [onBreak, setOnBreak] = useState(false);
  const [breakStart, setBreakStart] = useState<string | null>(null);
  const [breakEnd, setBreakEnd] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleBreakToggle = async () => {
    setLoading(true);
    try {
      if (!onBreak) {
        // Start break
        await axiosInstance.post(`/employees/${managerId}/attendance/breaks`, {
          type: "break1",
          action: "start",
        });
        setBreakStart(new Date().toLocaleTimeString());
        setBreakEnd(null);
        setOnBreak(true);
      } else {
        // End break
        await axiosInstance.post(`/employees/${managerId}/attendance/breaks`, {
          type: "break1",
          action: "end",
        });
        setBreakEnd(new Date().toLocaleTimeString());
        setOnBreak(false);
      }
    } catch (error) {
      console.error("Failed to toggle break:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-6 flex flex-col items-center">
      <button
        onClick={handleBreakToggle}
        className={`px-8 py-3 rounded-lg text-lg font-semibold flex items-center space-x-2 transition-colors shadow-sm border border-red-200 ${
          onBreak
            ? "bg-red-100 text-red-700 hover:bg-red-200"
            : "bg-white text-red-600 hover:bg-red-50"
        }`}
        disabled={loading}
      >
        {onBreak ? "End Break" : "Start Break"}
      </button>
      <div className="mt-2 text-sm text-gray-500">
        {onBreak && breakStart && (
          <span>Break started at: <span className="text-red-600 font-medium">{breakStart}</span></span>
        )}
        {!onBreak && breakEnd && (
          <span>Break ended at: <span className="text-green-600 font-medium">{breakEnd}</span></span>
        )}
      </div>
    </div>
  );
}
*/