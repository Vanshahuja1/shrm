import React, { useState } from "react";
import { Plus, Database, Edit, FileText } from "lucide-react";

type Project = {
  id: number;
  name: string;
  description: string;
  progress: number;
  employees: string[];
  startDate: string;
  endDate: string;
  status: "ongoing" | "completed" | "paused";
  priority: "high" | "medium" | "low";
  budget: number;
  actualCost: number;
};

type ProjectUpdate = {
  projectId: number;
  projectName: string;
  oldProgress: number;
  newProgress: number;
  updatedBy: string;
  timestamp: string;
};

type EmployeeResponse = {
  taskId: number;
  taskTitle: string;
  employee: string;
  rating: number;
  ratedBy: string;
  timestamp: string;
};

type AttendanceData = {
  employee: string;
  date: string;
  action: string;
  reason: string;
  approvedBy: string;
  timestamp: string;
};

type AdminData = {
  projectUpdates: ProjectUpdate[];
  employeeResponses: EmployeeResponse[];
  attendanceData: AttendanceData[];
  performanceMetrics: unknown[];
};


type OutgoingProjectsProps = {
  managerName : string;
};

const OutgoingProjects : React.FC<OutgoingProjectsProps> = ({ managerName }) => {
    const [showNewProject, setShowNewProject] = useState(false);
    const [ongoingProjects, setOngoingProjects] = useState<Project[]>([
        {
          id: 1,
          name: "E-commerce Platform Redesign",
          description:
            "Complete overhaul of the company's e-commerce platform with modern UI/UX",
          progress: 65,
          employees: ["Alice Smith", "Bob Wilson", "Carol Davis"],
          startDate: "2024-01-15",
          endDate: "2024-08-15",
          status: "ongoing",
          priority: "high",
          budget: 150000,
          actualCost: 95000,
        },
        {
          id: 2,
          name: "Mobile App Development",
          description: "Native mobile app for iOS and Android platforms",
          progress: 30,
          employees: ["Emma Brown", "David Lee"],
          startDate: "2024-03-01",
          endDate: "2024-10-01",
          status: "ongoing",
          priority: "medium",
          budget: 120000,
          actualCost: 35000,
        },
      ]);

      const [adminData, setAdminData] = useState<AdminData>({
          projectUpdates: [],
          employeeResponses: [],
          attendanceData: [],
          performanceMetrics: [],
        });
      const handleProgressChange = (projectId: number, newProgress: number) => {
    setOngoingProjects(
      ongoingProjects.map((project) => {
        if (project.id === projectId) {
          const updatedProject = { ...project, progress: newProgress };
          // Send data to admin
          setAdminData((prev) => ({
            ...prev,
            projectUpdates: [
              ...prev.projectUpdates,
              {
                projectId,
                projectName: project.name,
                oldProgress: project.progress,
                newProgress,
                updatedBy: managerName,
                timestamp: new Date().toISOString(),
              },
            ],
          }));
          return updatedProject;
        }
        return project;
      })
    );
  };
    return (
         <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Ongoing Projects</h2>
        <button
          onClick={() => setShowNewProject(true)}
          className="bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600 transition-colors flex items-center space-x-2 font-medium"
        >
          <Plus className="w-5 h-5" />
          <span>Add New Project</span>
        </button>
      </div>

      <div className="grid gap-6">
        {ongoingProjects.map((project) => (
          <div
            key={project.id}
            className="bg-white rounded-lg shadow-sm border border-red-200 p-6"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-gray-900">
                  {project.name}
                </h3>
                <p className="text-gray-600 mt-2">{project.description}</p>
                <div className="flex items-center space-x-4 mt-3 text-sm">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      project.priority === "high"
                        ? "bg-red-100 text-red-800"
                        : project.priority === "medium"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-green-100 text-green-800"
                    }`}
                  >
                    {project.priority.toUpperCase()} Priority
                  </span>
                  <span className="text-gray-500">
                    {project.startDate} - {project.endDate}
                  </span>
                  <span className="text-gray-600">
                    Budget: ${project.budget.toLocaleString()} | Spent: $
                    {project.actualCost.toLocaleString()}
                  </span>
                </div>
              </div>
              <div className="text-right ml-6">
                <span className="text-4xl font-bold text-red-500">
                  {project.progress}%
                </span>
                <p className="text-sm text-gray-600 mt-1">Completion</p>
              </div>
            </div>

            {/* Progress Bar with Adjustment */}
            <div className="mb-4">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Adjust Completion Progress</span>
                <span>{project.progress}%</span>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                value={project.progress}
                onChange={(e) =>
                  handleProgressChange(
                    project.id,
                    Number.parseInt(e.target.value)
                  )
                }
                className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, #ef4444 0%, #ef4444 ${project.progress}%, #e5e7eb ${project.progress}%, #e5e7eb 100%)`,
                }}
              />
            </div>

            {/* Team Members */}
            <div className="mb-4">
              <span className="text-sm font-medium text-gray-700">
                Team Members:
              </span>
              <div className="flex flex-wrap gap-2 mt-2">
                {project.employees.map((employee, index) => (
                  <span
                    key={index}
                    className="bg-red-50 text-red-700 px-3 py-1 rounded-full text-sm border border-red-200 font-medium"
                  >
                    {employee}
                  </span>
                ))}
              </div>
            </div>

            {/* Project Management Actions */}
            <div className="flex space-x-3 pt-4 border-t border-red-100">
              <button className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors text-sm font-medium">
                <Database className="w-4 h-4 inline mr-1" />
                Send to Admin
              </button>
              <button className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors text-sm font-medium">
                <Edit className="w-4 h-4 inline mr-1" />
                Edit Project
              </button>
              <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium">
                <FileText className="w-4 h-4 inline mr-1" />
                Generate Report
              </button>
            </div>
          </div>
        ))}
      </div>
         {showNewProject && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg">
            <h3 className="text-xl font-semibold mb-4">Add New Project</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Project Name
                </label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="Enter project name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                  rows={3}
                  placeholder="Enter project description"
                />
              </div>
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
                  Budget
                </label>
                <input
                  type="number"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="Enter budget amount"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowNewProject(false)}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowNewProject(false)}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
              >
                Add Project
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
    )
}




export default OutgoingProjects;