"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "@/lib/axiosInstance";
import type { OrganizationMember } from "../../../../types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function EditMemberPage() {
  const { id } = useParams();
  const router = useRouter();
  const [member, setMember] = useState<OrganizationMember | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [projectsText, setProjectsText] = useState<string>("");
  const [supervisors, setSupervisors] = useState<Array<{id: string, name: string, role: string, department: string}>>([]);

  useEffect(() => {
    const fetchMember = async () => {
      try {
        const response = await axios.get(`/IT/org-members/${id}`);
        const data = response.data;
        setMember(data);
        // Set the projects text for editing
        setProjectsText(Array.isArray(data.projects) ? data.projects.join(", ") : "");
      } catch (error) {
        console.error("Error fetching member:", error);
        router.push("/admin/IT/members");
      } finally {
        setLoading(false);
      }
    };

    const fetchSupervisors = async () => {
      try {
        const response = await axios.get('/IT/org-members/empInfo');
        const employees = response.data;
        // Filter to get potential supervisors (managers and hr, excluding current member)
        const potentialSupervisors = employees.filter((emp: {id: string, name: string, role: string, department: string}) => 
          (emp.role === 'manager' || emp.role === 'hr' ) && emp.id !== id
        );
        setSupervisors(potentialSupervisors);
      } catch (error) {
        console.error("Error fetching supervisors:", error);
      }
    };
    
    if (id) {
      fetchMember();
      fetchSupervisors();
    }
  }, [id, router]);

  const handleChange = (key: keyof OrganizationMember, value: string | number | string[]) => {
    if (!member) return;
    setMember({ ...member, [key]: value });
  };

  const handleContactChange = (key: keyof OrganizationMember["contactInfo"], value: string) => {
    if (!member) return;
    setMember({
      ...member,
      contactInfo: { ...member.contactInfo, [key]: value },
    });
  };

  const handleDocumentChange = (key: keyof OrganizationMember["documents"], value: string) => {
    if (!member) return;
    setMember({
      ...member,
      documents: { ...member.documents, [key]: value },
    });
  };

  const handlePerformanceChange = (key: keyof OrganizationMember["performanceMetrics"], value: number) => {
    if (!member) return;
    setMember({
      ...member,
      performanceMetrics: { ...member.performanceMetrics, [key]: value },
    });
  };

  const handleProjectsChange = (val: string) => {
    setProjectsText(val);
  };

  const handleProjectsBlur = () => {
    // Process projects when user finishes editing (on blur)
    const projectsList = projectsText.split(",").map(p => p.trim()).filter(p => p);
    handleChange("projects", projectsList);
  };

  const handleSubmit = async () => {
    if (!member) return;
    
    // Process projects one final time before submission
    const projectsList = projectsText.split(",").map(p => p.trim()).filter(p => p);
    const memberToSubmit = { ...member, projects: projectsList };
    
    setSaving(true);
    setError(null);
    setSuccess(null);
    
    try {
      await axios.put(`/IT/org-members/${id}`, memberToSubmit);
      setSuccess("Member updated successfully!");
      setTimeout(() => {
        router.push(`/admin/IT/members/${id}`);
      }, 1500);
    } catch (error: unknown) {
      console.error("Error updating member:", error);
      setError((error as {response?: {data?: {message?: string}}})?.response?.data?.message || "Failed to update member");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="text-center text-gray-500">Loading...</p>;

  if (!member) return null;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <button
          onClick={() => router.back()}
          className="text-blue-600 hover:text-blue-800 font-medium"
        >
          ← Cancel
        </button>
        <button
          onClick={handleSubmit}
          disabled={saving}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 space-y-8">
        <h1 className="text-3xl font-bold text-gray-900">Edit Member</h1>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
            {success}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Field label="Name" value={member.name} onChange={(val) => handleChange("name", val)} />
          <SelectField 
            label="Role" 
            value={member.role} 
            options={["manager", "employee", "intern", "hr"]}
            onChange={(val) => handleChange("role", val)} 
          />
          <Field label="Department" value={member.department} onChange={(val) => handleChange("department", val)} />
          <FieldWithPrefix 
            label="Salary" 
            value={member.salary} 
            type="number" 
            prefix="$"
            onChange={(val) => handleChange("salary", Number(val))} 
          />
          <Field label="Joining Date" value={member.joiningDate} type="date" onChange={(val) => handleChange("joiningDate", val)} />
          <FieldWithSuffix 
            label="Experience" 
            value={typeof member.experience === 'string' ? parseInt(member.experience) || 0 : member.experience} 
            type="number" 
            suffix="Years"
            onChange={(val) => handleChange("experience", Number(val))} 
          />
          <Field label="Email" value={member.contactInfo.email} onChange={(val) => handleContactChange("email", val)} />
          <Field label="Phone" value={member.contactInfo.phone} onChange={(val) => handleContactChange("phone", val)} />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Reports To</label>
            <Select 
              value={member.upperManager || "none"} 
              onValueChange={(value) => handleChange("upperManager", value === "none" ? "" : value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select supervisor" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">
                  <span className="text-gray-500">No supervisor</span>
                </SelectItem>
                {supervisors.map((supervisor) => (
                  <SelectItem key={supervisor.id} value={supervisor.name}>
                    <div className="flex flex-col">
                      <span className="font-medium">{supervisor.name}</span>
                      <span className="text-xs text-gray-500 capitalize">
                        {supervisor.role} • {supervisor.department}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <TextArea
          label="Address"
          value={member.contactInfo.address}
          onChange={(val) => handleContactChange("address", val)}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Field label="PAN Number" value={member.documents.pan} onChange={(val) => handleDocumentChange("pan", val)} />
          <Field label="Aadhar Number" value={member.documents.aadhar} onChange={(val) => handleDocumentChange("aadhar", val)} />
        </div>

        {/* Performance Metrics */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Performance Metrics</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Field 
              label="Tasks Per Day" 
              value={member.performanceMetrics.tasksPerDay} 
              type="number" 
              onChange={(val) => handlePerformanceChange("tasksPerDay", Number(val))} 
            />
            <FieldWithSuffix 
              label="Attendance Score" 
              value={member.performanceMetrics.attendanceScore} 
              type="number" 
              suffix="%"
              onChange={(val) => handlePerformanceChange("attendanceScore", Number(val))} 
            />
            <FieldWithSuffix 
              label="Manager Review Rating" 
              value={member.performanceMetrics.managerReviewRating} 
              type="number" 
              suffix="/5"
              onChange={(val) => handlePerformanceChange("managerReviewRating", Number(val))} 
            />
            <FieldWithSuffix 
              label="Combined Performance" 
              value={member.performanceMetrics.combinedPercentage} 
              type="number" 
              suffix="%"
              onChange={(val) => handlePerformanceChange("combinedPercentage", Number(val))} 
            />
          </div>
        </div>

        {/* Projects */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Projects</h3>
          <TextAreaWithBlur
            label="Projects (comma-separated)"
            value={projectsText}
            onChange={handleProjectsChange}
            onBlur={handleProjectsBlur}
          />
          <p className="text-xs text-gray-500">Enter project names separated by commas (e.g., &quot;Project A, Project B, Project C&quot;)</p>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string | number;
  type?: string;
  onChange: (val: string) => void;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
}

function TextArea({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (val: string) => void;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={3}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
}

function TextAreaWithBlur({
  label,
  value,
  onChange,
  onBlur,
}: {
  label: string;
  value: string;
  onChange: (val: string) => void;
  onBlur: () => void;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        rows={3}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        placeholder="Enter project names separated by commas..."
      />
    </div>
  );
}

function SelectField({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (val: string) => void;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}

function FieldWithSuffix({
  label,
  value,
  suffix,
  onChange,
  type = "text",
}: {
  label: string;
  value: string | number;
  suffix: string;
  type?: string;
  onChange: (val: string | number) => void;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      <div className="relative">
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(type === "number" ? Number(e.target.value) : e.target.value)}
          className="w-full px-3 py-2 pr-16 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        />
        <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm font-medium">
          {suffix}
        </span>
      </div>
    </div>
  );
}

function FieldWithPrefix({
  label,
  value,
  prefix,
  onChange,
  type = "text",
}: {
  label: string;
  value: string | number;
  prefix: string;
  type?: string;
  onChange: (val: string | number) => void;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      <div className="relative">
        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm font-medium">
          {prefix}
        </span>
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(type === "number" ? Number(e.target.value) : e.target.value)}
          className="w-full px-3 py-2 pl-8 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        />
      </div>
    </div>
  );
}
