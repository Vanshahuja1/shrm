import React, { useState } from "react";
import { Plus, Send, Mail, MessageSquare, FileText, Star } from "lucide-react";
type Task = {
  id: number;
  title: string;
  description: string;
  assignedTo: string;
  assignedBy: string;
  department: string;
  team: string;
  priority: "high" | "medium" | "low";
  weightage: number;
  dueDate: string;
  dueTime: string;
  status: "pending" | "in-progress" | "completed";
  responses: TaskResponse[];
  emailSent: boolean;
  createdAt: string;
};
type TaskResponse = {
  id: number;
  employee: string;
  response: string;
  timestamp: string;
  rating?: number;
  documents?: string[];
  format: "text" | "document";
};
type ManagerInfo = {
  id: string;
  name: string;
  department: string;
  email: string;
  phone: string;
  employees: Employee[];
  interns: Intern[];
  bankDetails: {
    accountNumber: string;
    bankName: string;
    ifsc: string;
    branch: string;
  };
  salary: {
    basic: number;
    allowances: number;
    total: number;
    lastAppraisal: string;
  };
  personalInfo: {
    address: string;
    emergencyContact: string;
    dateOfBirth: string;
    employeeId: string;
  };
};
type Employee = {
  id: number;
  name: string;
  department: string;
  position: string;
  email: string;
  phone: string;
  joinDate: string;
  performance: number;
  attendance: number;
  tasksPerDay: number;
  managerRating: number;
};

type Intern = {
  id: number;
  name: string;
  department: string;
  duration: string;
  mentor: string;
  performance: number;
  startDate: string;
  endDate: string;
};
const TaskAssignmentsPage: React.FC<{
  managerInfo: ManagerInfo;
  setAdminData: (updater: (prev: any) => any) => void;
}> = ({ managerInfo, setAdminData }) => {
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: 1,
      title: "Review Q2 Performance Reports",
      description:
        "Analyze and review quarterly performance metrics for all team members",
      assignedTo: "Alice Smith",
      assignedBy: "Sarah Johnson",
      department: "Frontend",
      team: "Development Team A",
      priority: "high",
      weightage: 8,
      dueDate: "2024-07-15",
      dueTime: "17:00",
      status: "in-progress",
      emailSent: true,
      createdAt: "2024-07-10 09:00 AM",
      responses: [
        {
          id: 1,
          employee: "Alice Smith",
          response:
            "Started working on the performance analysis. Found some interesting trends in productivity metrics. Will complete detailed report by tomorrow.",
          timestamp: "2024-07-10 10:30 AM",
          rating: 4,
          format: "text",
        },
      ],
    },
    {
      id: 2,
      title: "Update Security Protocols",
      description:
        "Review and update all security protocols for the development environment",
      assignedTo: "Carol Davis",
      assignedBy: "Sarah Johnson",
      department: "DevOps",
      team: "Infrastructure Team",
      priority: "high",
      weightage: 9,
      dueDate: "2024-07-12",
      dueTime: "16:00",
      status: "completed",
      emailSent: true,
      createdAt: "2024-07-08 11:00 AM",
      responses: [
        {
          id: 2,
          employee: "Carol Davis",
          response:
            "Completed security protocol updates. All firewall rules updated and documented. Security audit passed successfully.",
          timestamp: "2024-07-11 14:30 PM",
          rating: 5,
          format: "document",
          documents: ["security_audit_report.pdf", "updated_protocols.docx"],
        },
      ],
    },
  ]);
  const handleTaskRating = (
    taskId: number,
    responseId: number,
    rating: number
  ) => {
    setTasks(
      tasks.map((task) => {
        if (task.id === taskId) {
          const updatedTask = {
            ...task,
            responses: task.responses.map((response) =>
              response.id === responseId ? { ...response, rating } : response
            ),
          };
          // Send data to admin
          setAdminData((prev) => ({
            ...prev,
            employeeResponses: [
              ...prev.employeeResponses,
              {
                taskId,
                taskTitle: task.title,
                employee: task.assignedTo,
                rating,
                ratedBy: managerInfo.name,
                timestamp: new Date().toISOString(),
              },
            ],
          }));
          return updatedTask;
        }
        return task;
      })
    );
  };
  const [showNewTask, setShowNewTask] = useState(false);
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Task Assignment</h2>
        <button
          onClick={() => setShowNewTask(true)}
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
          <span className="text-blue-700">
            - Automatic notifications sent for task assignments
          </span>
        </div>
      </div>

      <div className="grid gap-6">
        {tasks.map((task) => (
          <div
            key={task.id}
            className="bg-white rounded-lg shadow-sm border border-red-200 p-6"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-gray-900">
                  {task.title}
                </h3>
                <p className="text-gray-600 mt-2">{task.description}</p>
                <div className="grid grid-cols-2 gap-4 mt-4 text-sm">
                  <div>
                    <span className="text-gray-600">Department:</span>
                    <span className="ml-2 font-medium text-red-600">
                      {task.department}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">Team:</span>
                    <span className="ml-2 font-medium text-blue-600">
                      {task.team}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">Assigned to:</span>
                    <span className="ml-2 font-medium text-green-600">
                      {task.assignedTo}
                    </span>
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
                  <div
                    key={response.id}
                    className="bg-red-50 rounded-lg p-4 mb-3"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-red-700">
                          {response.employee}
                        </span>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            response.format === "document"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {response.format.toUpperCase()}
                        </span>
                      </div>
                      <span className="text-xs text-gray-500">
                        {response.timestamp}
                      </span>
                    </div>
                    <p className="text-gray-700 mb-3">{response.response}</p>

                    {/* Document attachments */}
                    {response.documents && response.documents.length > 0 && (
                      <div className="mb-3">
                        <span className="text-sm text-gray-600">
                          Attachments:
                        </span>
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
                      <span className="text-sm text-gray-600">
                        Rate Performance (1-5):
                      </span>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          onClick={() =>
                            handleTaskRating(task.id, response.id, star)
                          }
                          className={`w-5 h-5 transition-colors ${
                            response.rating && star <= response.rating
                              ? "text-yellow-500"
                              : "text-gray-300"
                          }`}
                        >
                          <Star className="w-full h-full fill-current" />
                        </button>
                      ))}
                      {response.rating && (
                        <span className="text-sm text-gray-600 ml-2 font-medium">
                          {response.rating}/5
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {showNewTask && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg">
            <h3 className="text-xl font-semibold mb-4">Assign New Task</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Task Title
                </label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="Enter task title"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                  rows={3}
                  placeholder="Enter task description"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Department
                  </label>
                  <select className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500">
                    <option value="">Select Department</option>
                    <option value="Frontend">Frontend</option>
                    <option value="Backend">Backend</option>
                    <option value="DevOps">DevOps</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Team
                  </label>
                  <select className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500">
                    <option value="">Select Team</option>
                    <option value="Development Team A">
                      Development Team A
                    </option>
                    <option value="Infrastructure Team">
                      Infrastructure Team
                    </option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Assign to Member
                </label>
                <select className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500">
                  <option value="">Select Member</option>
                  {managerInfo.employees.map((employee) => (
                    <option key={employee.id} value={employee.name}>
                      {employee.name} - {employee.department}
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Priority
                  </label>
                  <select className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500">
                    <option value="high">High Priority</option>
                    <option value="medium">Medium Priority</option>
                    <option value="low">Low Priority</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Weightage (1-10)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="5"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Due Date
                  </label>
                  <input
                    type="date"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Due Time
                  </label>
                  <input
                    type="time"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowNewTask(false)}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowNewTask(false);
                  // Here you would normally send email notification
                }}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 flex items-center space-x-2"
              >
                <Send className="w-4 h-4" />
                <span>Assign & Send Email</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskAssignmentsPage;
