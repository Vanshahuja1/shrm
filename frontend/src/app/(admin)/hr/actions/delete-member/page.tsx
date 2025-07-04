"use client";

import { useEffect, useState, ChangeEvent } from "react";

interface Employee {
  id: number;
  name: string;
  department: string;
  organization: string;
  role: string;
}

export default function DeleteMemberPage() {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [confirmId, setConfirmId] = useState<number | null>(null);
  const [deletedIds, setDeletedIds] = useState<number[]>([]);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await fetch("/api/employees/all");
        const data = await res.json();
        setEmployees(data);
      } catch {
        setEmployees([
          {
            id: 1,
            name: "Vansh Ahuja",
            department: "IT",
            organization: "Tech",
            role: "Engineer",
          },
          {
            id: 2,
            name: "Neha Reddy",
            department: "HR",
            organization: "Admin",
            role: "Executive",
          },
        ]);
      }
    };

    fetchEmployees();
  }, []);

  const handleDelete = async (id: number) => {
    try {
      await fetch(`/api/employees/${id}`, { method: "DELETE" });
      setDeletedIds((prev) => [...prev, id]);
      setConfirmId(null);
    } catch {
      alert("❌ Failed to delete. Please try again.");
    }
  };

  return (
    <div className="bg-white border border-red-100 shadow-sm rounded-xl p-4 sm:p-6 text-gray-900">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        🗑️ Delete Member
      </h2>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by name or organization..."
          value={searchTerm}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setSearchTerm(e.target.value)
          }
          className="w-full sm:w-64 px-3 py-2 border border-red-100 rounded text-sm shadow-sm"
        />
      </div>

      <div className="hidden sm:block overflow-x-auto">
        <table className="min-w-full text-sm border rounded">
          <thead className="bg-red-50 text-gray-800">
            <tr>
              <th className="text-left px-4 py-2 border-b">S.no</th>
              <th className="text-left px-4 py-2 border-b">Name</th>
              <th className="text-left px-4 py-2 border-b">Organization</th>
              <th className="text-left px-4 py-2 border-b">Department</th>
              <th className="text-left px-4 py-2 border-b">Role</th>
              <th className="text-left px-4 py-2 border-b">Action</th>
            </tr>
          </thead>
          <tbody>
            {employees
              .filter(
                (emp) =>
                  emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  emp.organization
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase())
              )
              .map((emp, index) => (
                <tr
                  key={emp.id}
                  className="hover:bg-red-50 text-gray-800 transition"
                >
                  <td className="px-4 py-2 border-b">{index + 1}</td>
                  <td className="px-4 py-2 border-b">{emp.name}</td>
                  <td className="px-4 py-2 border-b">{emp.organization}</td>
                  <td className="px-4 py-2 border-b">{emp.department}</td>
                  <td className="px-4 py-2 border-b">{emp.role}</td>
                  <td className="px-4 py-2 border-b">
                    {deletedIds.includes(emp.id) ? (
                      <span className="text-xs text-gray-500">Deleted</span>
                    ) : confirmId === emp.id ? (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleDelete(emp.id)}
                          className="text-xs bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded"
                        >
                          Confirm
                        </button>
                        <button
                          onClick={() => setConfirmId(null)}
                          className="text-xs bg-gray-300 text-gray-700 px-2 py-1 rounded"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setConfirmId(emp.id)}
                        className="text-xs bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                      >
                        Delete
                      </button>
                    )}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      <div className="sm:hidden space-y-4">
        {employees
          .filter(
            (emp) =>
              emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
              emp.organization.toLowerCase().includes(searchTerm.toLowerCase())
          )
          .map((emp, index) => (
            <div
              key={emp.id}
              className="border border-red-100 rounded-xl p-4 shadow-sm bg-white text-gray-800"
            >
              <p className="font-medium text-sm text-gray-900">
                {index + 1} — {emp.name}
              </p>
              <p className="text-sm">Org: {emp.organization}</p>
              <p className="text-sm">Dept: {emp.department}</p>
              <p className="text-sm">Role: {emp.role}</p>

              <div className="mt-3">
                {deletedIds.includes(emp.id) ? (
                  <span className="text-xs text-gray-500">Deleted</span>
                ) : confirmId === emp.id ? (
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={() => handleDelete(emp.id)}
                      className="text-xs bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
                    >
                      Confirm
                    </button>
                    <button
                      onClick={() => setConfirmId(null)}
                      className="text-xs bg-gray-300 text-gray-700 px-3 py-1 rounded"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setConfirmId(emp.id)}
                    className="text-xs bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
