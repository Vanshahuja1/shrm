// app/hr/leavemanagement/page.tsx
"use client";

import { useEffect, useState } from "react";
import { toast, Toaster } from "react-hot-toast";

interface Leave {
  id: number;
  email: string;
  reason: string;
  dates: string;
  days: number;
  type: "Casual" | "Medical" | "Paternity" | "Maternity" | "LOP";
  status: "Pending" | "Approved" | "Rejected";
  doc?: string;
}

interface Employee {
  name: string;
  department: string;
  organisation: string;
  project: string;
  manager: string;
  email: string;
}

export default function LeaveManagement() {
  const [leaves, setLeaves] = useState<Leave[]>([]);
  const [employeeMap, setEmployeeMap] = useState<Record<string, Employee>>({});
  const [selected, setSelected] = useState<Leave | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [leaveRes, empRes] = await Promise.all([
          fetch("/api/leaves"),
          fetch("/api/employees"),
        ]);
        const leaveData: Leave[] = await leaveRes.json();
        const empData: Employee[] = await empRes.json();
        const map = Object.fromEntries(empData.map((e) => [e.email, e]));
        setLeaves(leaveData.filter((l) => l.status === "Pending"));
        setEmployeeMap(map);
      } catch {
        setLeaves([
          {
            id: 1,
            email: "alice@company.com",
            reason: "Medical surgery recovery",
            dates: "June 3 - June 6",
            days: 4,
            type: "Medical",
            status: "Pending",
            doc: "/docs/medical-alice.pdf",
          },
        ]);
        setEmployeeMap({
          "alice@company.com": {
            name: "Alice Johnson",
            department: "Engineering",
            organisation: "OneAim IT Solutions",
            project: "SHRM Dashboard",
            manager: "Rajiv Mehta",
            email: "alice@company.com",
          },
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleAction = async (id: number, action: "Approved" | "Rejected") => {
    const leave = leaves.find((l) => l.id === id);
    if (!leave) return;

    try {
      await fetch(`/api/leaves/${id}/${action.toLowerCase()}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: leave.email }),
      });

      if (action === "Rejected" || leave.type === "LOP") {
        await fetch("/api/payroll/adjust-lop", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: leave.email, days: leave.days }),
        });
      }

      toast.success(`Leave ${action.toLowerCase()} for ${leave.email}`);
      setLeaves((prev) => prev.filter((l) => l.id !== id));
    } catch {
      toast.error("Failed to process leave action");
    }
  };

  const notifyManager = async (email: string) => {
    try {
      await fetch("/api/notify-manager", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      toast.success("Manager notified");
    } catch {
      toast.error("Failed to notify manager");
    }
  };

  return (
    <div className="bg-white border border-red-100 rounded-xl p-4 shadow-sm">
      <h2 className="text-lg font-semibold mb-4 text-gray-800">
        📝 Leave Requests
      </h2>
      <Toaster position="top-right" />
      {loading ? (
        <p className="text-sm text-gray-500">Loading...</p>
      ) : leaves.length === 0 ? (
        <p className="text-sm text-gray-500 italic">✅ No pending requests</p>
      ) : (
        <ul className="space-y-4">
          {leaves.map((leave) => {
            const emp = employeeMap[leave.email];
            return (
              <li
                key={leave.id}
                onClick={() => setSelected(leave)}
                className="cursor-pointer border border-red-200 p-4 rounded-lg bg-red-50 hover:bg-red-100"
              >
                <p className="font-semibold text-gray-800">
                  {emp?.name || leave.email} — {emp?.department || "N/A"}
                </p>
                <p className="text-sm text-gray-600">
                  {leave.reason} —{" "}
                  <span className="text-red-600">{leave.dates}</span> (
                  {leave.days}d, {leave.type})
                </p>
                <span
                  className={`text-xs font-medium px-2 py-0.5 rounded ${
                    leave.status === "Approved"
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {leave.status === "Approved"
                    ? "✅ Manager Approved"
                    : "📩 Awaiting Manager"}
                </span>
              </li>
            );
          })}
        </ul>
      )}

      {selected && (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center text-gray-900">
          <div className="bg-white rounded-xl p-6 w-[90%] max-w-lg shadow-xl relative">
            <button
              onClick={() => setSelected(null)}
              className="absolute top-2 right-3 text-xl"
            >
              ×
            </button>
            <h3 className="text-lg font-semibold mb-2">📋 Leave Details</h3>
            <div className="text-sm space-y-1 text-gray-700">
              <p>
                <b>Name:</b> {employeeMap[selected.email]?.name}
              </p>
              <p>
                <b>Email:</b> {selected.email}
              </p>
              <p>
                <b>Organisation:</b> {employeeMap[selected.email]?.organisation}
              </p>
              <p>
                <b>Department:</b> {employeeMap[selected.email]?.department}
              </p>
              <p>
                <b>Project:</b> {employeeMap[selected.email]?.project}
              </p>
              <p>
                <b>Manager:</b> {employeeMap[selected.email]?.manager}
              </p>
              <p>
                <b>Leave Type:</b> {selected.type}
              </p>
              <p>
                <b>Dates:</b> {selected.dates} ({selected.days} day
                {selected.days > 1 ? "s" : ""})
              </p>
              <p>
                <b>Reason:</b> {selected.reason}
              </p>
              {selected.type === "Medical" && selected.doc && (
                <button
                  onClick={() =>
                    toast(
                      (t) => (
                        <div className="text-sm max-w-xs">
                          <p className="font-semibold mb-1">
                            🧾 Medical Document
                          </p>
                          <iframe
                            src={selected.doc}
                            className="w-full h-60 border rounded"
                          />
                          <div className="text-right mt-2">
                            <button
                              onClick={() => toast.dismiss(t.id)}
                              className="text-red-500 text-xs underline"
                            >
                              Close
                            </button>
                          </div>
                        </div>
                      ),
                      { duration: 999999 }
                    )
                  }
                  className="text-blue-600 underline text-sm"
                >
                  View Medical Document
                </button>
              )}

            </div>

            <div className="flex gap-2 mt-4">
              <button
                onClick={() => notifyManager(selected.email)}
                className="bg-blue-500 text-white text-sm px-3 py-1 rounded hover:bg-blue-600 ml-auto"
              >
                Notify Manager
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
