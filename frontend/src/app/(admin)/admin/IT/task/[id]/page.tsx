"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter, notFound } from "next/navigation"
import { CheckCircle, AlertCircle, Clock, Edit, Trash2 } from "lucide-react"
import type { Task } from "../../../types"
import { sampleTasks } from "@/lib/sampleData"

export default function TaskDetailPage() {
  const { id } = useParams()
  const router = useRouter()
  const [task, setTask] = useState<Task | null>(null)

  useEffect(() => {
    const found = sampleTasks.find((t) => t.id === Number(id))
    if (found) setTask(found)
    else notFound()
  }, [id])

  const getStatusColor = (status: Task["status"]) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "in-progress":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "completed":
        return "bg-green-100 text-green-800 border-green-200"
    }
  }

  const getStatusIcon = (status: Task["status"]) => {
    switch (status) {
      case "pending":
        return <Clock className="text-yellow-600" size={20} />
      case "in-progress":
        return <AlertCircle className="text-blue-600" size={20} />
      case "completed":
        return <CheckCircle className="text-green-600" size={20} />
    }
  }

  if (!task) return null

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="flex items-center justify-between">
        <button
          onClick={() => router.push("/admin/IT/task")}
          className="text-blue-600 hover:text-blue-800 text-sm"
        >
          ← Back to Tasks
        </button>

        <div className="flex gap-2">
          <button
            onClick={() => router.push(`/admin/IT/task/${task.id}/edit`)}
            className="flex items-center gap-1 text-white bg-blue-600 px-4 py-1.5 rounded-lg text-sm hover:bg-blue-700"
          >
            <Edit size={16} />
            Edit
          </button>
          <button
            onClick={() => router.push(`/admin/IT/task/${task.id}/delete`)}
            className="flex items-center gap-1 text-white bg-red-600 px-4 py-1.5 rounded-lg text-sm hover:bg-red-700"
          >
            <Trash2 size={16} />
            Delete
          </button>
        </div>
      </div>

      <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{task.title}</h1>
          <p className="text-gray-700">{task.description}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-sm text-gray-600 mb-1">Assigned To</p>
            <p className="text-lg font-semibold text-gray-900">{task.assignedTo}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Assigned By</p>
            <p className="text-lg font-semibold text-gray-900">{task.assignedBy}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Due Date</p>
            <p className="text-lg font-semibold text-gray-900">{task.dueDate}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Status</p>
            <div className="flex items-center gap-2 mt-1">
              {getStatusIcon(task.status)}
              <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(task.status)}`}>
                {task.status}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
