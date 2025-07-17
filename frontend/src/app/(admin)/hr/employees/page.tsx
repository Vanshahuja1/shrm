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
    <div className="p-4 sm:p-6 max-w-7xl mx-auto">
      <h1 className="text-xl sm:text-2xl font-bold mb-4 text-gray-900">
        👥 Employees
      </h1>

      <div className="flex flex-wrap gap-2 mb-6">
        {tabs.map((tab, index) => (
          <button
            key={index}
            onClick={() => setActiveTab(index)}
            className={`px-4 py-2 rounded-full font-medium text-sm ${
              activeTab === index
                ? "bg-red-500 text-white hover:bg-red-600"
                : "bg-red-100 text-red-700 hover:bg-red-50"
            }`}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
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
