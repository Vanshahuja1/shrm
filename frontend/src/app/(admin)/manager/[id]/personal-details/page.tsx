"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  Mail,
  Phone,
  MapPin,
  TrendingUp,
  Clock,
  Award,
  Target,
  UserIcon,
} from "lucide-react";
import axios from "@/lib/axiosInstance";
import type { OrganizationMember } from "@/types";

export default function ManagerPersonalDetailsPage() {
  const { id } = useParams();
  const [manager, setManager] = useState<OrganizationMember | null>(null);

  useEffect(() => {
    const fetchManager = async () => {
      try {
        const response = await axios.get(`/IT/org-members/${id}`);
        setManager(response.data);
      } catch (error) {
        console.error("Error fetching manager:", error);
      }
    };
    fetchManager();
  }, [id]);

  if (!manager) return <p className="text-center text-gray-500">Loading...</p>;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="bg-white rounded-xl shadow-sm border border-red-200 p-8 space-y-8">
        {/* Header */}
        <div className="flex items-center gap-6">
          <div className="w-24 h-24 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
            {manager.name
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{manager.name}</h1>
            <p className="text-xl text-red-600 font-medium">
              {manager.role} – {manager.department}
            </p>
          </div>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <InfoCard
            title="Tasks/Day"
            value={`${manager.performanceMetrics.tasksPerDay}/5`}
            icon={<Target />}
            color="blue"
            theme="red"
          />
          <InfoCard
            title="Attendance"
            value={`${manager.performanceMetrics.attendanceScore}%`}
            icon={<Clock />}
            color="green"
            theme="red"
          />
          <InfoCard
            title="Manager Rating"
            value={`${manager.performanceMetrics.managerReviewRating}/5`}
            icon={<Award />}
            color="purple"
            theme="red"
          />
          <InfoCard
            title="Performance"
            value={`${manager.performanceMetrics.combinedPercentage}%`}
            icon={<TrendingUp />}
            color="orange"
            theme="red"
          />
        </div>

        {/* Contact + Professional Info */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-900">Contact Info</h2>
            <div className="flex items-center gap-3">
              <Mail className="text-gray-500" size={20} />
              {manager.contactInfo.email}
            </div>
            <div className="flex items-center gap-3">
              <Phone className="text-gray-500" size={20} />
              {manager.contactInfo.phone}
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="text-gray-500" size={20} />
              {manager.contactInfo.address}
            </div>
            {manager.upperManager && (
              <div className="flex items-center gap-3">
                <UserIcon className="text-gray-500" size={20} />
                Reports to: {manager.upperManager}
              </div>
            )}
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-900">Professional Info</h2>
            <div className="p-4 rounded-lg bg-green-50 border border-green-200 text-green-700 font-semibold">
              Salary: ${manager.salary.toLocaleString()}
            </div>
            <div className="p-4 rounded-lg bg-red-50 border border-red-200 text-red-700 font-semibold">
              Joining Date: {manager.joiningDate}
            </div>
            <div className="p-4 rounded-lg bg-purple-50 border border-purple-200 text-purple-700 font-semibold">
              Experience: {manager.experience}
            </div>
          </div>
        </div>

        {/* Documents */}
        <div className="space-y-2">
          <h2 className="text-xl font-bold text-gray-900">Documents</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <p className="font-semibold text-gray-700 mb-1">PAN</p>
              <p className="text-lg font-mono text-yellow-800">
                {manager.documents.pan}
              </p>
            </div>
            <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
              <p className="font-semibold text-gray-700 mb-1">Aadhar</p>
              <p className="text-lg font-mono text-orange-800">
                {manager.documents.aadhar}
              </p>
            </div>
          </div>
        </div>

        {/* Projects */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Projects</h2>
          <div className="flex flex-wrap gap-2">
            {manager.projects.map((project: string, index: number) => (
              <span
                key={index}
                className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium"
              >
                {project}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// InfoCard component
function InfoCard({
  title,
  value,
  icon,
  color,
  theme = "red",
}: {
  title: string;
  value: string;
  icon: React.ReactNode;
  color: "blue" | "green" | "purple" | "orange";
  theme?: "red" | "default";
}) {
  const themeMap = {
    red: {
      blue: "bg-blue-50 text-blue-600 border-red-200",
      green: "bg-green-50 text-green-600 border-red-200",
      purple: "bg-purple-50 text-purple-600 border-red-200",
      orange: "bg-orange-50 text-orange-600 border-red-200",
    },
    default: {
      blue: "bg-blue-50 text-blue-600 border-blue-200",
      green: "bg-green-50 text-green-600 border-green-200",
      purple: "bg-purple-50 text-purple-600 border-purple-200",
      orange: "bg-orange-50 text-orange-600 border-orange-200",
    },
  };
  const bgMap = themeMap[theme][color];

  return (
    <div className={`p-4 rounded-lg border ${bgMap}`}>
      <div className="flex items-center gap-2 mb-1 text-sm font-medium">
        {icon}
        {title}
      </div>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}
