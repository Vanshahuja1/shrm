"use client"

import { useState, useEffect, use } from "react"
import { TaskList } from "../components/task-list"
import type { EmployeeTask } from "@/types/employee"

export default function TasksPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [tasks, setTasks] = useState<EmployeeTask[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTasks()
  }, [id])

  const fetchTasks = async () => {
    try {
      const response = await fetch(`/api/employees/${id}/tasks`)
      if (response.ok) {
        const data = await response.json()
        setTasks(data)
      }
    } catch (error) {
      console.error("Failed to fetch tasks:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleTaskResponse = async (
    taskId: number,
    response: string,
    format: "text" | "document",
    documents?: string[],
  ) => {
    try {
      const apiResponse = await fetch(`/api/employees/${id}/tasks/${taskId}/response`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          response,
          format,
          documents,
        }),
      })

      if (apiResponse.ok) {
        // Refresh tasks after successful response submission
        fetchTasks()
      }
    } catch (error) {
      console.error("Failed to submit task response:", error)
    }
  }

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
    )
  }

  return <TaskList tasks={tasks} onTaskResponse={handleTaskResponse} />
}
