"use client";

import { useEffect, useState, ChangeEvent } from "react";

interface Employee {
  id: number;
  name: string;
  department: string;
  organization: string;
  role: string;
}

export default function DeductionPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [percentMap, setPercentMap] = useState<Record<number, string>>({});
  const [reasonMap, setReasonMap] = useState<Record<number, string>>({});
  const [deductedIds, setDeductedIds] = useState<number[]>([]);

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
            role: "Developer",
          },
          {
            id: 2,
            name: "Neha Reddy",
            department: "HR",
            organization: "Admin",
            role: "Manager",
          },
        ]);
      }
    };

    fetchEmployees();
  }, []);

  const handleDeduct = async (id: number) => {
    const percent = parseFloat(percentMap[id]);
    const reason = reasonMap[id]?.trim();
    if (!percent || percent <= 0) return alert("Enter valid percentage");
    if (!reason) return alert("Enter reason for deduction");

    try {
      await fetch(`/api/payroll/deduct`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, percent, reason }),
      });

      setDeductedIds((prev) => [...prev, id]);
      setPercentMap((prev) => ({ ...prev, [id]: "" }));
    } catch {
      alert("Deduction failed");
    }
  };

  return (
    <div className="bg-white border border-red-100 shadow-sm rounded-xl p-4 sm:p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        💸 Deduct Salary
      </h2>
      <div className="hidden sm:block overflow-x-auto">
        <table className="min-w-full text-sm border rounded">
          <thead className="bg-red-50 text-gray-800">
            <tr>
              <th className="text-left px-4 py-2 border-b">S.no</th>
              <th className="text-left px-4 py-2 border-b">Name</th>
              <th className="text-left px-4 py-2 border-b">Org</th>
              <th className="text-left px-4 py-2 border-b">Dept</th>
              <th className="text-left px-4 py-2 border-b">Role</th>
              <th className="text-left px-4 py-2 border-b">Deduct</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((emp, index) => (
              <tr key={emp.id} className="hover:bg-red-50 text-gray-800">
                <td className="px-4 py-2 border-b">{index + 1}</td>
                <td className="px-4 py-2 border-b">{emp.name}</td>
                <td className="px-4 py-2 border-b">{emp.organization}</td>
                <td className="px-4 py-2 border-b">{emp.department}</td>
                <td className="px-4 py-2 border-b">{emp.role}</td>
                <td className="px-4 py-2 border-b">
                  {deductedIds.includes(emp.id) ? (
                    <span className="text-xs text-gray-500">Applied</span>
                  ) : (
                    <div className="flex gap-2">
                      <input
                        type="number"
                        placeholder="%"
                        value={percentMap[emp.id] || ""}
                        onChange={(e: ChangeEvent<HTMLInputElement>) =>
                          setPercentMap((prev) => ({
                            ...prev,
                            [emp.id]: e.target.value,
                          }))
                        }
                        className="w-20 px-2 py-1 rounded border text-sm"
                      />
                      <input
                        type="text"
                        placeholder="Reason"
                        value={reasonMap[emp.id] || ""}
                        onChange={(e: ChangeEvent<HTMLInputElement>) =>
                          setReasonMap((prev) => ({
                            ...prev,
                            [emp.id]: e.target.value,
                          }))
                        }
                        className="w-40 px-2 py-1 rounded border text-sm"
                      />
                      <button
                        onClick={() => handleDeduct(emp.id)}
                        className="text-xs bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                      >
                        Deduct
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="sm:hidden space-y-4">
        {employees.map((emp, index) => (
          <div
            key={emp.id}
            className="border border-red-100 rounded-xl p-4 shadow-sm text-gray-800"
          >
            <p className="font-medium text-sm text-gray-900">
              {index + 1} — {emp.name}
            </p>
            <p className="text-sm">Org: {emp.organization}</p>
            <p className="text-sm">Dept: {emp.department}</p>
            <p className="text-sm">Role: {emp.role}</p>

            <div className="mt-3">
              {deductedIds.includes(emp.id) ? (
                <span className="text-xs text-gray-500">Applied</span>
              ) : (
                <div className="flex flex-col gap-2">
                  <input
                    type="number"
                    placeholder="%"
                    value={percentMap[emp.id] || ""}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      setPercentMap((prev) => ({
                        ...prev,
                        [emp.id]: e.target.value,
                      }))
                    }
                    className="px-2 py-1 rounded border text-sm"
                  />
                  <input
                    type="text"
                    placeholder="Reason"
                    value={reasonMap[emp.id] || ""}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      setReasonMap((prev) => ({
                        ...prev,
                        [emp.id]: e.target.value,
                      }))
                    }
                    className="px-2 py-1 rounded border text-sm"
                  />
                  <button
                    onClick={() => handleDeduct(emp.id)}
                    className="text-xs bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded w-fit"
                  >
                    Deduct
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
