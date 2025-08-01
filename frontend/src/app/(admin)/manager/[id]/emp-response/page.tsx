"use client";
import { Eye, Download, Star } from "lucide-react";
import type { Task } from "../types";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import axiosInstance from "@/lib/axiosInstance";
import { mockTasks } from "../data/mockData";

export default function EmployeeResponse() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const { id: managerId } = useParams();
  useEffect(() => {
    // Fetch all employee/intern task responses for this manager
    const fetchData = async () => {
      try {
        // 1. Get all employees and interns for this manager
        const orgRes = await axiosInstance.get(`/IT/org-members/${managerId}`);
        const orgData = orgRes.data;
        const employees = Array.isArray(orgData.employees) ? orgData.employees : [];
        const interns = Array.isArray(orgData.interns) ? orgData.interns : [];
        const allIds = [
          ...employees.map((e: { id: string }) => e.id),
          ...interns.map((i: { id: string }) => i.id),
        ];

        // 2. Fetch tasks for each employee/intern
        const allTasks: Task[] = [];
        await Promise.all(
          allIds.map(async (empId: string) => {
            try {
              const res = await axiosInstance.get(`/employees/${empId}/tasks`);
              if (Array.isArray(res.data)) {
                allTasks.push(...res.data);
              }
            } catch {}
          })
        );
        setTasks(allTasks);
      } catch {
        setTasks(mockTasks); // Fallback to mock data
      }
    };
    fetchData();
  }, [managerId]);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Employee Responses</h2>

      {/* All Responses View */}
      <div className="bg-white rounded-lg shadow-sm border border-red-200 p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
          <Eye className="w-6 h-6 text-red-500 mr-2" />
          View All Responses
        </h3>
        <div className="space-y-4">
          {tasks
            .filter(
              (task) =>
                Array.isArray(task.responses) && task.responses.length > 0
            )
            .map((task) => (
              <div
                key={task.id}
                className="border border-red-100 rounded-lg p-4"
              >
                <h4 className="font-medium text-gray-900 mb-2">{task.title}</h4>
                <p className="text-sm text-gray-600 mb-3">
                  Assigned to:{" "}
                  {typeof task.assignedTo === "object" && task.assignedTo.name
                    ? task.assignedTo.name
                    : String(task.assignedTo)}
                </p>
                {(task.responses ?? []).map((response) => (
                  <div
                    key={response.id}
                    className="bg-red-50 rounded-lg p-3 mb-2"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-medium text-red-700">
                        {response.employee}
                      </span>
                      <div className="flex items-center space-x-2">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            response.format === "document"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {response.format.toUpperCase()}
                        </span>
                        <span className="text-xs text-gray-500">
                          {response.timestamp}
                        </span>
                      </div>
                    </div>
                    <p className="text-gray-700 text-sm mb-2">
                      {response.response}
                    </p>
                    {response.documents && response.documents.length > 0 && (
                      <div className="mb-2">
                        <span className="text-xs text-gray-600">
                          Documents:
                        </span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {response.documents.map((doc, index) => (
                            <span
                              key={index}
                              className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs flex items-center"
                            >
                              <Download className="w-3 h-3 mr-1" />
                              {doc}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    {response.rating && (
                      <div className="flex items-center space-x-1">
                        <span className="text-xs text-gray-600">Rating:</span>
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`w-3 h-3 ${
                                star <= response.rating!
                                  ? "text-yellow-500 fill-current"
                                  : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-xs text-gray-600">
                          ({response.rating}/5)
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
