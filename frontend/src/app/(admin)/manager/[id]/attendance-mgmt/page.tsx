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

// Type for new manager team attendance API response
interface TeamAttendanceResponse {
  attendanceRecords: Array<{
    attendanceId: string;
    employeeId: string;
    employeeName: string;
    employeeEmail: string;
    employeeRole: string;
    department: string;
    date: string;
    punchIn: string | null;
    punchOut: string | null;
    totalHours: number;
    breakTime: number;
    overtimeHours: number;
    status: string;
    isActive: boolean;
  }>;
  pagination: {
    currentPage: number;
    totalPages: number;
    totalRecords: number;
    recordsPerPage: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
  summary: {
    totalEmployees: number;
    totalRecords: number;
    employeeList: Array<{
      id: string;
      name: string;
      role: string;
    }>;
  };
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
  const [pagination, setPagination] = useState({
    totalPages: 0,
    totalRecords: 0,
    hasNextPage: false,
    hasPreviousPage: false
  });
  const [totalEmployees, setTotalEmployees] = useState(0);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const { id: managerId } = useParams()

  // Helper function to format time display (no timezone conversion - display as-is)
  const formatTimeDisplay = (timeStr: string | null | undefined): string => {
    // Return dash for null, undefined, or empty string
    if (!timeStr || timeStr === '-' || timeStr === 'null') return '-';
    
    try {
      // Just format the time string directly without conversion
      const timeParts = timeStr.split(':');
      if (timeParts.length < 2) return '-';
      
      const hours = timeParts[0].padStart(2, '0');
      const minutes = timeParts[1].padStart(2, '0');
      
      return `${hours}:${minutes}`;
    } catch (error) {
      console.error('Error formatting time:', error, 'Time:', timeStr);
      return '-';
    }
  };

  // Fetch organization attendance using new API endpoint
  // API uses authenticated user's organization from JWT token (no need to pass managerId)
  const fetchTeamAttendance = async (page: number = 1) => {
    setIsLoading(true);
    try {
      // Build query parameters
      const params: any = {
        page: page,
        limit: recordsPerPage,
      };

      // Add filters if they exist
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;
      if (statusFilter) params.status = statusFilter;

      // API returns all employees in the authenticated manager's organization
      const response = await axiosInstance.get<TeamAttendanceResponse>(
        `/attendance/manager/team`,
        { params }
      );

      // Transform API response to match existing AttendanceRecord format
      const transformedRecords: AttendanceRecord[] = response.data.attendanceRecords.map((record) => ({
        date: record.date,
        employee: record.employeeId,
        name: record.employeeName,
        punchIn: record.punchIn || "-",
        punchOut: record.punchOut || "-",
        totalHours: record.totalHours,
        status: record.status as "present" | "absent" | "late" | "half-day",
        regularized: false, // API doesn't provide this yet
      }));

      setAttendanceRecords(transformedRecords);
      
      // Update pagination info
      setPagination({
        totalPages: response.data.pagination.totalPages,
        totalRecords: response.data.pagination.totalRecords,
        hasNextPage: response.data.pagination.hasNextPage,
        hasPreviousPage: response.data.pagination.hasPreviousPage,
      });

      // Build employee map from summary
      const map: Record<string, { id: string; name: string }> = {};
      response.data.summary.employeeList.forEach((emp) => {
        map[emp.id] = { id: emp.id, name: emp.name };
      });
      setEmployeeMap(map);
      setTotalEmployees(response.data.summary.totalEmployees);

    } catch (error) {
      console.error("Error fetching team attendance:", error);
      setAttendanceRecords(mockAttendanceRecords); // Fallback to mock records
      setPagination({
        totalPages: 0,
        totalRecords: 0,
        hasNextPage: false,
        hasPreviousPage: false,
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTeamAttendance(currentPage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, startDate, endDate, statusFilter]);

  // Reset to page 1 when filters change
  const handleFilterChange = () => {
    if (currentPage !== 1) {
      setCurrentPage(1);
    } else {
      fetchTeamAttendance(1);
    }
  };

  // Clear all filters
  const clearFilters = () => {
    setStartDate('');
    setEndDate('');
    setStatusFilter('');
    setCurrentPage(1);
  };

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

      {/* Team Attendance Overview */}
      <div className="bg-white rounded-lg shadow-sm border border-red-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-gray-900">All Employees Attendance</h3>
          <div className="text-sm text-gray-600">
            Total Employees: <span className="font-semibold text-red-600">{totalEmployees}</span>
          </div>
        </div>

        {/* Filters Section */}
        <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Start Date Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Date
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>

            {/* End Date Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                End Date
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              >
                <option value="">All Status</option>
                <option value="present">Present</option>
                <option value="absent">Absent</option>
                <option value="late">Late</option>
                <option value="holiday">Holiday</option>
              </select>
            </div>

            {/* Clear Filters Button */}
            <div className="flex items-end">
              <button
                onClick={clearFilters}
                className="w-full px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
              >
                Clear Filters
              </button>
            </div>
          </div>

          {/* Active Filters Display */}
          {(startDate || endDate || statusFilter) && (
            <div className="mt-3 flex items-center gap-2 text-sm">
              <span className="text-gray-600 font-medium">Active Filters:</span>
              {startDate && (
                <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full">
                  From: {startDate}
                </span>
              )}
              {endDate && (
                <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full">
                  To: {endDate}
                </span>
              )}
              {statusFilter && (
                <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full">
                  Status: {statusFilter}
                </span>
              )}
            </div>
          )}
        </div>
        
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
                  {attendanceRecords.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-gray-500">
                        {totalEmployees === 0 
                          ? "No employees found" 
                          : "No attendance records found"}
                      </td>
                    </tr>
                  ) : (
                    attendanceRecords.map((record: AttendanceRecord, idx: number) => {
                      if (!record.employee) return null;
                      const employeeName = record.name || employeeMap[record.employee]?.name || record.employee || "Unknown";
                      const rowKey = `${record.date}-${record.employee || "unknown"}-${idx}`;
                      const punchInDisplay = formatTimeDisplay(record.punchIn);
                      const punchOutDisplay = formatTimeDisplay(record.punchOut);
                      
                      return (
                        <tr key={rowKey} className="border-b border-gray-100 hover:bg-red-50">
                          <td className="py-3 px-4">{record.date}</td>
                          <td className="py-3 px-4 font-medium">{employeeName}</td>
                          <td className="py-3 px-4">
                            {punchInDisplay === '-' ? (
                              <span className="text-gray-400">-</span>
                            ) : (
                              <span className="font-mono">{punchInDisplay}</span>
                            )}
                          </td>
                          <td className="py-3 px-4">
                            {punchOutDisplay === '-' || punchOutDisplay === 'Invalid Date' ? (
                              <span className="text-gray-400">-</span>
                            ) : (
                              <span className="font-mono">{punchOutDisplay}</span>
                            )}
                          </td>
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
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            {pagination.totalPages > 1 && (
              <div className="flex items-center justify-between mt-4 px-4">
                <div className="text-sm text-gray-600">
                  Showing {((currentPage - 1) * recordsPerPage) + 1} to {Math.min(currentPage * recordsPerPage, pagination.totalRecords)} of {pagination.totalRecords} records
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={!pagination.hasPreviousPage}
                    className={`px-4 py-2 rounded-lg border transition-colors ${
                      !pagination.hasPreviousPage
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-white text-red-600 border-red-200 hover:bg-red-50"
                    }`}
                  >
                    Previous
                  </button>
                  <div className="flex space-x-1">
                    {Array.from({ length: Math.min(pagination.totalPages, 5) }, (_, i) => {
                      // Show pages around current page
                      let pageNum;
                      if (pagination.totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= pagination.totalPages - 2) {
                        pageNum = pagination.totalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }
                      return (
                        <button
                          key={pageNum}
                          onClick={() => setCurrentPage(pageNum)}
                          className={`px-4 py-2 rounded-lg border transition-colors ${
                            currentPage === pageNum
                              ? "bg-red-500 text-white border-red-500"
                              : "bg-white text-red-600 border-red-200 hover:bg-red-50"
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                  </div>
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(pagination.totalPages, prev + 1))}
                    disabled={!pagination.hasNextPage}
                    className={`px-4 py-2 rounded-lg border transition-colors ${
                      !pagination.hasNextPage
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-white text-red-600 border-red-200 hover:bg-red-50"
                    }`}
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
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