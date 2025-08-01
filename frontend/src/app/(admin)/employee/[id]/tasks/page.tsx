"use client";

import { useState, useEffect, useCallback } from "react";
import axiosInstance from "@/lib/axiosInstance";
import { TaskList } from "../components/task-list";
import type { EmployeeTask } from "../../types/employees";
import { useParams } from "next/navigation";

export default function TasksPage() {
  const { id } = useParams();
  const [tasks, setTasks] = useState<EmployeeTask[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTasks = useCallback(async () => {
    try {
      const response = await axiosInstance.get(`/employees/${id}/tasks`);
      setTasks(response.data);
    } catch (error) {
      console.error("Failed to fetch tasks:", error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleTaskResponse = async (
    taskId: number,
    response: string,
    format: "text" | "document",
    documents?: string[]
  ) => {
    try {
      await axiosInstance.post(`/employees/${id}/tasks/${taskId}/response`, {
        response,
        format,
        documents,
      });
      // Refresh tasks after successful response submission
      fetchTasks();
    } catch (error) {
      console.error("Failed to submit task response:", error);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-48 mb-6"></div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-lg p-6 border">
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return <TaskList tasks={tasks} onTaskResponse={handleTaskResponse} />;
}
