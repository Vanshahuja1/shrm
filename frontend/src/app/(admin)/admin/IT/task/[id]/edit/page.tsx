"use client"

import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import type { Task } from "../../../../types"
import { sampleTasks } from "@/lib/sampleData"

export default function EditTaskPage() {
  const { id } = useParams()
  const router = useRouter()
  const [task, setTask] = useState<Task | null>(null)

  useEffect(() => {
    const found = sampleTasks.find((t) => t.id === Number(id))
    if (found) setTask(found)
    else router.push("/admin/IT/task")
  }, [id])

  const handleChange = (field: keyof Task, value: string) => {
    if (!task) return
    setTask({ ...task, [field]: value })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (task) {
      // Replace with API or state update logic
      console.log("Updated Task:", task)
      router.push(`/admin/IT/task/${task.id}`)
    }
  }

  if (!task) return null

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-4">Edit Task</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 text-sm font-medium">Title</label>
          <input
            type="text"
            value={task.title}
            onChange={(e) => handleChange("title", e.target.value)}
            className="w-full border px-3 py-2 rounded-lg"
            required
          />
        </div>
        <div>
          <label className="block mb-1 text-sm font-medium">Description</label>
          <textarea
            value={task.description}
            onChange={(e) => handleChange("description", e.target.value)}
            rows={3}
            className="w-full border px-3 py-2 rounded-lg"
            required
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 text-sm font-medium">Assigned To</label>
            <input
              type="text"
              value={task.assignedTo}
              onChange={(e) => handleChange("assignedTo", e.target.value)}
              className="w-full border px-3 py-2 rounded-lg"
              required
            />
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium">Assigned By</label>
            <input
              type="text"
              value={task.assignedBy}
              onChange={(e) => handleChange("assignedBy", e.target.value)}
              className="w-full border px-3 py-2 rounded-lg"
              required
            />
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium">Due Date</label>
            <input
              type="date"
              value={task.dueDate}
              onChange={(e) => handleChange("dueDate", e.target.value)}
              className="w-full border px-3 py-2 rounded-lg"
              required
            />
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium">Status</label>
            <select
              value={task.status}
              onChange={(e) => handleChange("status", e.target.value)}
              className="w-full border px-3 py-2 rounded-lg"
            >
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium">Priority</label>
            <select
              value={task.priority}
              onChange={(e) => handleChange("priority", e.target.value)}
              className="w-full border px-3 py-2 rounded-lg"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
        </div>
        <div className="flex gap-4 pt-2">
          <button type="submit" className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700">
            Save Changes
          </button>
          <button
            type="button"
            onClick={() => router.push(`/task/${task.id}`)}
            className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}
