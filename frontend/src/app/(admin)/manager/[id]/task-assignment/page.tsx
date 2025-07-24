"use client"

import { Plus, Mail, MessageSquare, FileText, Star } from "lucide-react"
import { useParams, useRouter } from "next/navigation"
import type { Task } from "../types";
import { useEffect, useState } from "react";
import { mockTasks } from "../data/mockData";
export default function TaskAssignment() {
  const [tasks, setTasks] = useState<Task[]>([])
  const { id: managerId } = useParams()
  const router = useRouter()

  useEffect(() => {
    // Fetch tasks for the manager
    const fetchTasks = async () => {
      try {
        const response = await fetch(`/api/manager/${managerId}/tasks`)
        if (!response.ok) {
          throw new Error("Failed to fetch tasks")
        }
        const data = await response.json()
        setTasks(data)
      } catch (error) {
        console.error("Error fetching tasks:", error)
        setTasks(mockTasks) 
      }
    }

    fetchTasks()
  }, [managerId])


  function onTaskRating(taskId: number, responseId: number, star: number): void {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === taskId
          ? {
              ...task,
              responses: task.responses.map(response =>
                response.id === responseId
                  ? { ...response, rating: star }
                  : response
              ),
            }
          : task
      )
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Task Assignment</h2>
        <button
          onClick={()=>{
            router.push(`/manager/${managerId}/task-assignment/add`)
          }}
          className="bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600 transition-colors flex items-center space-x-2 font-medium"
        >
          <Plus className="w-5 h-5" />
          <span>Assign New Task</span>
        </button>
      </div>

      {/* Email System Status */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center space-x-2">
          <Mail className="w-5 h-5 text-blue-500" />
          <span className="font-medium text-blue-900">Email System Active</span>
          <span className="text-blue-700">- Automatic notifications sent for task assignments</span>
        </div>
      </div>

      <div className="grid gap-6">
        {tasks.map((task) => (
          <div key={task.id} className="bg-white rounded-lg shadow-sm border border-red-200 p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-gray-900">{task.title}</h3>
                <p className="text-gray-600 mt-2">{task.description}</p>
                <div className="grid grid-cols-2 gap-4 mt-4 text-sm">
                  <div>
                    <span className="text-gray-600">Department:</span>
                    <span className="ml-2 font-medium text-red-600">{task.department}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Team:</span>
                    <span className="ml-2 font-medium text-blue-600">{task.team}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Assigned to:</span>
                    <span className="ml-2 font-medium text-green-600">{task.assignedTo}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Created:</span>
                    <span className="ml-2 text-gray-500">{task.createdAt}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-4 mt-3">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      task.priority === "high"
                        ? "bg-red-100 text-red-800"
                        : task.priority === "medium"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-green-100 text-green-800"
                    }`}
                  >
                    {task.priority.toUpperCase()} Priority
                  </span>
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-medium">
                    Weight: {task.weightage}/10
                  </span>
                  <span className="text-gray-500 text-sm">
                    Due: {task.dueDate} at {task.dueTime}
                  </span>
                  {task.emailSent && (
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                      <Mail className="w-3 h-3 inline mr-1" />
                      Email Sent
                    </span>
                  )}
                </div>
              </div>
              <div className="text-right ml-6">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    task.status === "completed"
                      ? "bg-green-100 text-green-800"
                      : task.status === "in-progress"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {task.status.replace("-", " ").toUpperCase()}
                </span>
              </div>
            </div>

            {/* Task Responses */}
            {task.responses.length > 0 && (
              <div className="border-t border-red-100 pt-4">
                <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                  <MessageSquare className="w-5 h-5 text-red-500 mr-2" />
                  Employee Responses:
                </h4>
                {task.responses.map((response) => (
                  <div key={response.id} className="bg-red-50 rounded-lg p-4 mb-3">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-red-700">{response.employee}</span>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            response.format === "document" ? "bg-blue-100 text-blue-800" : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {response.format.toUpperCase()}
                        </span>
                      </div>
                      <span className="text-xs text-gray-500">{response.timestamp}</span>
                    </div>
                    <p className="text-gray-700 mb-3">{response.response}</p>

                    {/* Document attachments */}
                    {response.documents && response.documents.length > 0 && (
                      <div className="mb-3">
                        <span className="text-sm text-gray-600">Attachments:</span>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {response.documents.map((doc, index) => (
                            <span
                              key={index}
                              className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs flex items-center"
                            >
                              <FileText className="w-3 h-3 mr-1" />
                              {doc}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Performance Rating */}
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-600">Rate Performance (1-5):</span>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          onClick={() => onTaskRating(task.id, response.id, star)}
                          className={`w-5 h-5 transition-colors ${
                            response.rating && star <= response.rating ? "text-yellow-500" : "text-gray-300"
                          }`}
                        >
                          <Star className="w-full h-full fill-current" />
                        </button>
                      ))}
                      {response.rating && (
                        <span className="text-sm text-gray-600 ml-2 font-medium">{response.rating}/5</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
