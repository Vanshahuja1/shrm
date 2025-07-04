"use client"

import { motion } from "framer-motion"
import { Users, Briefcase, TrendingUp, Building, Calendar, CheckCircle } from "lucide-react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Cell,
} from "recharts"

const monthlyData = [
  { month: "Jan", revenue: 2100000, employees: 235, projects: 15, attendance: 92 },
  { month: "Feb", revenue: 2300000, employees: 240, projects: 16, attendance: 94 },
  { month: "Mar", revenue: 2200000, employees: 242, projects: 17, attendance: 89 },
  { month: "Apr", revenue: 2500000, employees: 245, projects: 18, attendance: 96 },
  { month: "May", revenue: 2400000, employees: 247, projects: 18, attendance: 93 },
  { month: "Jun", revenue: 2600000, employees: 247, projects: 20, attendance: 95 },
]

const departmentData = [
  { name: "IT Development", value: 35, color: "#3B82F6" },
  { name: "HR", value: 15, color: "#10B981" },
  { name: "Business Development", value: 25, color: "#8B5CF6" },
  { name: "IT/CS Management", value: 25, color: "#F59E0B" },
]

export default function Overview() {
  const stats = [
    { title: "Total Employees", value: "247", change: "+12%", icon: Users, color: "blue" },
    { title: "Active Projects", value: "20", change: "+5%", icon: Briefcase, color: "green" },
    { title: "Monthly Revenue", value: "$2.6M", change: "+18%", icon: TrendingUp, color: "purple" },
    { title: "Departments", value: "4", change: "0%", icon: Building, color: "orange" },
    { title: "Tasks Completed", value: "156", change: "+23%", icon: CheckCircle, color: "emerald" },
    { title: "Avg Attendance", value: "95%", change: "+2%", icon: Calendar, color: "red" },
  ]

  const colorClasses = {
    blue: "bg-blue-50 text-blue-700 border-blue-200",
    green: "bg-green-50 text-green-700 border-green-200",
    purple: "bg-purple-50 text-purple-700 border-purple-200",
    orange: "bg-orange-50 text-orange-700 border-orange-200",
    emerald: "bg-emerald-50 text-emerald-700 border-emerald-200",
    red: "bg-red-50 text-red-700 border-red-200",
  }

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <motion.div
              key={index}
              whileHover={{ y: -2, scale: 1.01 }}
              className={`p-6 rounded-xl border-2 ${colorClasses[stat.color]} bg-white shadow-sm`}
            >
              <div className="flex items-center justify-between mb-4">
                <div
                  className={`p-3 rounded-lg ${colorClasses[stat.color].replace("border-", "bg-").replace("-200", "-100")}`}
                >
                  <Icon size={24} />
                </div>
                <span
                  className={`text-sm font-semibold px-2 py-1 rounded-full ${
                    stat.change.startsWith("+") ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {stat.change}
                </span>
              </div>
              <p className="text-3xl font-bold mb-1 text-gray-900">{stat.value}</p>
              <p className="text-sm text-gray-600">{stat.title}</p>
            </motion.div>
          )
        })}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-xl font-bold mb-4 text-gray-900">Revenue & Growth Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip
                formatter={(value, name) => [
                  name === "revenue" ? `$${value.toLocaleString()}` : value,
                  name === "revenue" ? "Revenue" : name === "employees" ? "Employees" : "Attendance %",
                ]}
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                }}
              />
              <Line type="monotone" dataKey="revenue" stroke="#3B82F6" strokeWidth={3} />
              <Line type="monotone" dataKey="attendance" stroke="#10B981" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Department Distribution */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-xl font-bold mb-4 text-gray-900">Department Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <PieChart data={departmentData} cx="50%" cy="50%" outerRadius={80} dataKey="value">
                {departmentData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </PieChart>
              <Tooltip formatter={(value) => [`${value}%`, "Percentage"]} />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap gap-3 mt-4">
            {departmentData.map((dept, index) => (
              <div key={index} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: dept.color }}></div>
                <span className="text-sm text-gray-600">{dept.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Employee Performance Chart */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h3 className="text-xl font-bold mb-4 text-gray-900">Monthly Performance Metrics</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={monthlyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="month" stroke="#6b7280" />
            <YAxis stroke="#6b7280" />
            <Tooltip />
            <Bar dataKey="employees" fill="#3B82F6" name="Employees" radius={[4, 4, 0, 0]} />
            <Bar dataKey="projects" fill="#8B5CF6" name="Projects" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
