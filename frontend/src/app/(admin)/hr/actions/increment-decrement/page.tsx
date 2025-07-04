"use client";

import { useEffect, useState, ChangeEvent } from "react";

interface Employee {
  id: number;
  name: string;
  department: string;
  organization: string;
  role: string;
  salary?: number;
}

export default function IncrementDecrementPage() {
  const [confirmingId, setConfirmingId] = useState<number | null>(null);
  const [currentSalaryMap, setCurrentSalaryMap] = useState<Record<number, number>>({});
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [percentMap, setPercentMap] = useState<Record<number, string>>({});
  const [actionMap, setActionMap] = useState<Record<number, string>>({});
  const [updatedIds, setUpdatedIds] = useState<number[]>([]);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await fetch("/api/employees/all");
        const data: Employee[] = await res.json();
        setEmployees(data);
        const map: Record<number, number> = {};
        data.forEach((emp) => {
          map[emp.id] = emp.salary ?? 0;
        });
        setCurrentSalaryMap(map);
      } catch {
        setEmployees([
          {
            id: 1,
            name: "Vansh Ahuja",
            department: "IT",
            organization: "Tech",
            role: "Developer",
            salary: 0,
          },
          {
            id: 2,
            name: "Neha Reddy",
            department: "HR",
            organization: "Admin",
            role: "Manager",
            salary: 0,
          },
        ]);
      }
    };

    fetchEmployees();
  }, []);

  const handleUpdate = async (id: number) => {
    const percent = parseFloat(percentMap[id]);
    const action = actionMap[id];

    if (!percent || percent <= 0) return alert("Enter valid %");
    if (!action) return alert("Choose Increment or Decrement");

    try {
      await fetch(`/api/payroll/update-salary`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, percent, type: action }),
      });
      setUpdatedIds((prev) => [...prev, id]);
      setConfirmingId(null);
    } catch {
      alert("Update failed");
    }
  };

  return (
    <div className="bg-white border border-red-100 shadow-sm rounded-xl p-4 sm:p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        🔄 Salary Increment / Decrement
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
              <th className="text-left px-4 py-2 border-b">Action</th>
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
                  {updatedIds.includes(emp.id) ? (
                    <span className="text-xs text-gray-500">Updated</span>
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
                        className="w-20 px-2 py-1 border rounded text-sm"
                      />
                      <select
                        value={actionMap[emp.id] || ""}
                        onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                          setActionMap((prev) => ({
                            ...prev,
                            [emp.id]: e.target.value,
                          }))
                        }
                        className="px-2 py-1 border rounded text-sm"
                      >
                        <option value="">Select</option>
                        <option value="increment">Increment</option>
                        <option value="decrement">Decrement</option>
                      </select>
                      {currentSalaryMap[emp.id] &&
                        percentMap[emp.id] &&
                        actionMap[emp.id] && (
                          <p className="text-xs text-gray-600">
                            New Salary: ₹{" "}
                            {actionMap[emp.id] === "increment"
                              ? (
                                  currentSalaryMap[emp.id] *
                                  (1 + parseFloat(percentMap[emp.id]) / 100)
                                ).toFixed(2)
                              : (
                                  currentSalaryMap[emp.id] *
                                  (1 - parseFloat(percentMap[emp.id]) / 100)
                                ).toFixed(2)}
                          </p>
                        )}
                      <button
                        onClick={() => setConfirmingId(emp.id)}
                        className="text-xs bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                      >
                        Apply
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
            className="border border-red-100 rounded-xl p-4 text-gray-800 bg-white shadow-sm"
          >
            <p className="font-medium text-sm text-gray-900">
              {index + 1} — {emp.name}
            </p>
            <p className="text-sm">Org: {emp.organization}</p>
            <p className="text-sm">Dept: {emp.department}</p>
            <p className="text-sm">Role: {emp.role}</p>

            {updatedIds.includes(emp.id) ? (
              <p className="text-xs text-gray-500 mt-2">Updated</p>
            ) : (
              <div className="flex flex-col gap-2 mt-3">
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
                  className="px-2 py-1 border rounded text-sm"
                />
                <select
                  value={actionMap[emp.id] || ""}
                  onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                    setActionMap((prev) => ({
                      ...prev,
                      [emp.id]: e.target.value,
                    }))
                  }
                  className="px-2 py-1 border rounded text-sm"
                >
                  <option value="">Select</option>
                  <option value="increment">Increment</option>
                  <option value="decrement">Decrement</option>
                </select>
                {currentSalaryMap[emp.id] &&
                  percentMap[emp.id] &&
                  actionMap[emp.id] && (
                    <p className="text-xs text-gray-600">
                      New Salary: ₹{" "}
                      {actionMap[emp.id] === "increment"
                        ? (
                            currentSalaryMap[emp.id] *
                            (1 + parseFloat(percentMap[emp.id]) / 100)
                          ).toFixed(2)
                        : (
                            currentSalaryMap[emp.id] *
                            (1 - parseFloat(percentMap[emp.id]) / 100)
                          ).toFixed(2)}
                    </p>
                  )}
                <button
                  onClick={() => setConfirmingId(emp.id)}
                  className="text-xs bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded w-fit"
                >
                  Apply
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {confirmingId && (
        <div className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center">
          <div className="bg-white border border-red-100 rounded-xl p-6 shadow-lg w-[90%] max-w-sm text-center">
            <p className="text-gray-800 font-medium mb-2">Confirm Action</p>
            <p className="text-sm text-gray-600 mb-4">
              Are you sure you want to update salary of{" "}
              <strong>
                {employees.find((e) => e.id === confirmingId)?.name}
              </strong>
              ?
            </p>
            <div className="flex justify-center gap-3">
              <button
                onClick={() => handleUpdate(confirmingId)}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded text-sm"
              >
                Yes
              </button>
              <button
                onClick={() => setConfirmingId(null)}
                className="bg-gray-200 text-gray-700 px-4 py-1 rounded text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
