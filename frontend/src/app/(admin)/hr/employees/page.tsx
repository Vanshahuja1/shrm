"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface EmployeeRecord {
  id: number;
  name: string;
  employeeId: string;
  email: string;
  phone: string;
  designation: string;
  department?: string;
  joinedDate?: string;
  status: "Active" | "On Leave" | "Inactive";
}

export default function EmployeeRecords() {
  const [records, setRecords] = useState<EmployeeRecord[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "All" | "Active" | "On Leave" | "Inactive"
  >("All");
  const router = useRouter();

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await fetch("/api/employees");
        const data: EmployeeRecord[] = await res.json();
        // Merge with localStorage data if present
        const localEmps = JSON.parse(
          localStorage.getItem("employeeList") || "[]"
        );
        setRecords([...localEmps, ...data]);
      } catch {
        // fallback to mock data
        const mockData = [
          {
            id: 1,
            name: "Alice Sharma",
            employeeId: "EMP001",
            email: "alice@company.com",
            phone: "9876543210",
            designation: "Frontend Developer",
            status: "Active",
            department: "Engineering",
            joinedDate: "2023-01-15",
          },
          {
            id: 2,
            name: "Bob Verma",
            employeeId: "EMP002",
            email: "bob@company.com",
            phone: "9876543211",
            designation: "HR Manager",
            status: "On Leave",
            department: "Human Resources",
            joinedDate: "2022-11-20",
          },
          {
            id: 3,
            name: "Neha Reddy",
            employeeId: "EMP003",
            email: "neha@company.com",
            phone: "9876543212",
            designation: "Manager",
            status: "Inactive",
            department: "Sales",
            joinedDate: "2021-05-10",
          },
        ];
        const localEmps = JSON.parse(
          localStorage.getItem("employeeList") || "[]"
        );
        setRecords([...localEmps, ...mockData]);
      }
    };

    fetchEmployees();
  }, []);

  const filteredRecords = records.filter((emp) => {
    const matchesSearch = emp.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "All" || emp.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleRowClick = (employeeId: string) => {
    router.push(`/hr/employees/${employeeId}`);
  };

  return (
    <div className="bg-white border rounded-xl shadow-sm">
      {/* Header Section */}
      <div className="px-6 py-4 border-b">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
            <span className="text-red-600">📋</span> Employee Records
          </h2>
          <Link href="/hr/employees/add">
            <button className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md text-sm font-medium transition-colors flex items-center gap-2">
              <span>+</span> Add Employee
            </button>
          </Link>
        </div>

        {/* Search and Filter */}
        <div className="mt-4 flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
            />
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              
            </span>
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
            className="w-full sm:w-48 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
          >
            <option value="All">All Statuses</option>
            <option value="Active">Active</option>
            <option value="On Leave">On Leave</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Table Section */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead>
            <tr className="bg-gray-50 text-gray-600">
              
              <th className="px-6 py-3 border-b border-gray-200 font-medium">Employee</th>
              <th className="px-6 py-3 border-b border-gray-200 font-medium">Email Address</th>
              <th className="px-6 py-3 border-b border-gray-200 font-medium">Department</th>
              <th className="px-6 py-3 border-b border-gray-200 font-medium">Job Title</th>
              <th className="px-6 py-3 border-b border-gray-200 font-medium">Joined Date</th>
              <th className="px-6 py-3 border-b border-gray-200 font-medium">Status</th>
              <th className="px-6 py-3 border-b border-gray-200 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredRecords.map((emp, index) => (
              <tr
                key={emp.id}
                className="hover:bg-[#FDD0C4] transition-colors cursor-pointer"
                onClick={() => handleRowClick(emp.employeeId)}
              >
                
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 flex-shrink-0 rounded-full bg-red-100 flex items-center justify-center">
                      <span className="font-medium text-red-700">{emp.name.charAt(0)}</span>
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{emp.name}</div>
                      <div className="text-gray-500 text-xs">{emp.employeeId}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                  {emp.email}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                  {emp.department || "N/A"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                  {emp.designation}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                  {emp.joinedDate ? new Date(emp.joinedDate).toLocaleDateString() : "—"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      emp.status === "Active"
                        ? "bg-green-100 text-green-800"
                        : emp.status === "On Leave"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {emp.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    <button
                      className="text-gray-400 hover:text-gray-600 transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        // handle edit
                      }}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                    </button>
                    <button
                      className="text-gray-400 hover:text-red-600 transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        // handle delete
                      }}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile View */}
      <div className="sm:hidden divide-y divide-gray-200">
        {filteredRecords.map((emp) => (
          <div
            key={emp.id}
            className="p-4 hover:bg-gray-50 transition-colors cursor-pointer"
            onClick={() => handleRowClick(emp.employeeId)}
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
                <span className="font-medium text-red-700">{emp.name.charAt(0)}</span>
              </div>
              <div>
                <div className="font-medium text-gray-900">{emp.name}</div>
                <div className="text-gray-500 text-sm">{emp.employeeId}</div>
              </div>
            </div>
            <div className="ml-13 space-y-1 text-sm">
              <div className="text-gray-600">{emp.email}</div>
              <div className="text-gray-600">{emp.designation} • {emp.department || "No Department"}</div>
              <div className="flex items-center justify-between mt-2">
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    emp.status === "Active"
                      ? "bg-green-100 text-green-800"
                      : emp.status === "On Leave"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {emp.status}
                </span>
                <div className="flex items-center gap-3">
                  <button
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      // handle edit
                    }}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </button>
                  <button
                    className="text-gray-400 hover:text-red-600 transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      // handle delete
                    }}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
