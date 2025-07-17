"use client";

import React, { useState, useEffect } from "react";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  FunnelChart,
  Funnel,
  LabelList,
} from "recharts";
import {
  Users,
  UserCheck,
  UserPlus,
  UserX,
  Clock,
  DollarSign,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useRouter } from "next/navigation";

const pieColors = [
  "#4FC3F7",
  "#81C784",
  "#FFB74D",
  "#F06292",
  "#9575CD",
  "#4DB6AC",
];

const departmentData = [
  { name: "Accounts", value: 12 },
  { name: "IT", value: 8 },
  { name: "Marketing", value: 21 },
  { name: "Operations", value: 20 },
  { name: "HR", value: 18 },
  { name: "Analytics", value: 21 },
];

const sourceData = [
  { name: "Social Media", value: 22 },
  { name: "Job Boards", value: 32 },
  { name: "Referrals", value: 27 },
  { name: "Direct Apply", value: 20 },
];

const departmentBarData = [
  { department: "Accounts", applications: 20 },
  { department: "IT", applications: 8 },
  { department: "Marketing", applications: 12 },
  { department: "Operations", applications: 21 },
  { department: "HR", applications: 18 },
  { department: "Analytics", applications: 21 },
];

const funnelData = [
  { name: "Application", value: 31, fill: "#81C784" },
  { name: "Screening", value: 24, fill: "#4FC3F7" },
  { name: "Interview", value: 24, fill: "#FFB74D" },
  { name: "Hired", value: 21, fill: "#F06292" },
];

const StatCard = ({
  title,
  value,
  icon: Icon,
  color,
  onClick,
  className = "",
}: {
  title: string;
  value: string | number;
  icon: any;
  color: string;
  onClick?: () => void;
  className?: string;
}) => (
  <Card
    className={`bg-white shadow-lg cursor-pointer ${className}`}
    onClick={onClick ?? (() => {})}
  >
    <CardContent className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold" style={{ color }}>
            {value}
          </p>
        </div>
        <div
          className="p-2 rounded-full"
          style={{ backgroundColor: `${color}20` }}
        >
          <Icon size={24} style={{ color }} />
        </div>
      </div>
    </CardContent>
  </Card>
);

export default function HRDashboard() {
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();

  useEffect(() => setIsClient(true), []);
  if (!isClient) return null;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              KPI Dashboard for HR Recruitment Process
            </h1>
            <p className="text-gray-600 mt-2">
              Chart auto-updates via linked data source.
            </p>
          </div>
          <div className="text-sm text-gray-600">
            <Users size={20} className="inline text-blue-600 mr-1" />
            Team | Period: Q3 2020
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 mb-8">
        <StatCard
          title="Total Applicants"
          value="100"
          icon={Users}
          color="#212121"
          onClick={() => router.push("/hr/recruitment/applicants")}
          className="transition-shadow duration-200 hover:shadow-[0_0_12px_rgba(0,0,0,0.4)]"
        />
        <StatCard
          title="Shortlisted Candidates"
          value="92"
          icon={UserCheck}
          color="#1976D2"
          onClick={() => router.push("/hr/recruitment/shortlistedCandidates")}
          className="transition-shadow duration-200 hover:shadow-[0_0_12px_rgba(25,118,210,0.5)]"
        />
        <StatCard
          title="Hired Candidates"
          value="18"
          icon={UserPlus}
          color="#388E3C"
          onClick={() => router.push("/hr/recruitment/hiredCandidates")}
          className="transition-shadow duration-200 hover:shadow-[0_0_12px_rgba(25,118,210,0.5)]"
        />
        <StatCard
          title="Rejected Candidates"
          value="8"
          icon={UserX}
          color="#D32F2F"
          onClick={() => router.push("/hr/recruitment/rejectedCandidates")}
          className="transition-shadow duration-200 hover:shadow-[0_0_12px_rgba(0,0,0,0.4)]"
        />
        <StatCard
          title="Time to hire"
          value="15 days"
          icon={Clock}
          color="#7B1FA2"
        />
        <StatCard
          title="Cost to hire"
          value="$ 175"
          icon={DollarSign}
          color="#FF8F00"
          onClick={() => router.push("/hr/recruitment/cost")}
          className="transition-shadow duration-200 hover:shadow-[0_0_12px_rgba(0,0,0,0.4)]"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <Card className="bg-white shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900">
              Open position by department
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={departmentData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {departmentData.map((_, i) => (
                      <Cell key={i} fill={pieColors[i % pieColors.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 space-y-2">
              {departmentData.map((item, i) => (
                <div key={i} className="flex items-center space-x-2 text-sm">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: pieColors[i % pieColors.length] }}
                  ></div>
                  <span>
                    {item.name} {item.value} posts
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Bar Chart */}
        <Card className="bg-white shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900">
              Application Received By Source
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer>
                <BarChart data={sourceData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis type="category" dataKey="name" width={100} />
                  <Tooltip />
                  <Bar dataKey="value" fill="#42A5F5" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Recruitment Funnel */}
        <Card className="bg-white shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900">
              Recruitment Stages Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  layout="vertical"
                  data={[
                    {
                      Application: 31,
                      Interview: 24,
                      Hired: 21,
                    },
                  ]}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis type="category" dataKey={() => "Stages"} hide />
                  <Tooltip />
                  <Bar dataKey="Application" stackId="a" fill="#81C784" />
                  <Bar dataKey="Interview" stackId="a" fill="#4FC3F7" />
                  <Bar dataKey="Hired" stackId="a" fill="#F06292" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Color Legend */}
            <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-2 text-sm text-gray-700">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#81C784]"></div>
                <span>Application</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#4FC3F7]"></div>
                <span>Interview</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#F06292]"></div>
                <span>Hired</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Department Bar Chart */}
      <Card className="bg-white shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900">
            Application Received by Department
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer>
              <BarChart data={departmentBarData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="department" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="applications" fill="#42A5F5" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
