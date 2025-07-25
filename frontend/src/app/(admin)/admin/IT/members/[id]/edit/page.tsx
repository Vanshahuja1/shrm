"use client";

import { useEffect, useState } from "react";
import { MultiSelectDropdown } from "@/components/MultiSelectDropdown";
import { useParams, useRouter } from "next/navigation";
import axios from "@/lib/axiosInstance";
import type { OrganizationMember } from "../../../../types";

export default function EditMemberPage() {
  const { id } = useParams();
  const router = useRouter();
  const [member, setMember] = useState<OrganizationMember | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [projectsText, setProjectsText] = useState<string>("");
  const [allEmployees, setAllEmployees] = useState<OrganizationMember[]>([]);
  const [allInterns, setAllInterns] = useState<OrganizationMember[]>([]);
  const [allManagers, setAllManagers] = useState<OrganizationMember[]>([]);

  useEffect(() => {
    const fetchMember = async () => {
      try {
        const response = await axios.get(`/IT/org-members/${id}`);
        const data = response.data;
        setMember(data);
        setProjectsText(
          Array.isArray(data.projects) ? data.projects.join(", ") : ""
        );
      } catch (error) {
        console.error("Error fetching member:", error);
        router.push("/admin/IT/members");
      } finally {
        setLoading(false);
      }
    };

    const fetchMembers = async () => {
      try {
        const response = await axios.get("/IT/org-members/empInfo");
        const allMembers = response.data;
        setAllEmployees(
          allMembers.filter(
            (m: OrganizationMember) => m.role.toLowerCase() === "employee"
          )
        );
        setAllInterns(
          allMembers.filter(
            (m: OrganizationMember) => m.role.toLowerCase() === "intern"
          )
        );
        setAllManagers(
          allMembers.filter(
            (m: OrganizationMember) => m.role.toLowerCase() === "manager"
          )
        );
      } catch {
        console.log("Error fetching organization members, using sample data");
      }
    };

    fetchMember();
    fetchMembers();
  }, [id, router]);

  // Helper functions (single set only)
  const handleChange = <K extends keyof OrganizationMember>(
    key: K,
    value: OrganizationMember[K]
  ) => {
    if (!member) return;
    setMember({ ...member, [key]: value });
  };

  const handleContactChange = (
    key: keyof OrganizationMember["contactInfo"],
    value: string
  ) => {
    if (!member) return;
    setMember({
      ...member,
      contactInfo: { ...member.contactInfo, [key]: value },
    });
  };

  // Helper functions (single set only)
  const handleDocumentChange = (
    key: keyof OrganizationMember["documents"],
    value: string
  ) => {
    if (!member) return;
    setMember({
      ...member,
      documents: { ...member.documents, [key]: value },
    });
  };

  const handlePerformanceChange = (
    key: keyof OrganizationMember["performanceMetrics"],
    value: number
  ) => {
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
    const projectsList = projectsText
      .split(",")
      .map((p) => p.trim())
      .filter((p) => p);
    handleChange("projects", projectsList);
  };

  const handleSubmit = async () => {
    if (!member) return;
    const projectsList = projectsText
      .split(",")
      .map((p) => p.trim())
      .filter((p) => p);
    let memberToSubmit = {
      id: member.id,
      name: member.name,
      role: member.role,
      department: member.department,
      salary: member.salary,
      projects: projectsList,
      experience:
        typeof member.experience === "string"
          ? member.experience
          : String(member.experience),
      contactInfo: {
        email: member.contactInfo?.email || "",
        phone: member.contactInfo?.phone || "",
        address: member.contactInfo?.address || "",
      },
      documents: {
        pan: member.documents?.pan || "",
        aadhar: member.documents?.aadhar || "",
      },
      joiningDate: member.joiningDate,
      performanceMetrics: {
        tasksPerDay: member.performanceMetrics?.tasksPerDay || 0,
        attendanceScore: member.performanceMetrics?.attendanceScore || 0,
        managerReviewRating:
          member.performanceMetrics?.managerReviewRating || 0,
        combinedPercentage: member.performanceMetrics?.combinedPercentage || 0,
      },
      attendance: {
        todayPresent: member.attendance?.todayPresent ?? true,
      },
    };
    // If manager, add employees/interns arrays of IDs only if present
    if (member.role === "Manager") {
      type ManagerWithMembers = OrganizationMember & {
        employees?: OrganizationMember[];
        interns?: OrganizationMember[];
      };
      const manager = member as ManagerWithMembers;
      const employees = Array.isArray(manager.employees)
        ? manager.employees.map((e) => ({
            id: e.id,
            upperManager: member.name,
          }))
        : undefined;
      const interns = Array.isArray(manager.interns)
        ? manager.interns.map((i) => ({ id: i.id, upperManager: member.name }))
        : undefined;
      memberToSubmit = {
        ...memberToSubmit,
        ...(employees ? { employees } : {}),
        ...(interns ? { interns } : {}),
      };
    }
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
      setError(
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message || "Failed to update member"
      );
    } finally {
      setSaving(false);
    }
  };

  // Helper field components (must be above usage)
  function Field({
    label,
    value,
    onChange,
    type = "text",
  }: {
    label: string;
    value: string | number;
    onChange: (val: string) => void;
    type?: string;
  }) {
    return (
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
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
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
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
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
        <div className="relative">
          <input
            type={type}
            value={value}
            onChange={(e) =>
              onChange(
                type === "number" ? Number(e.target.value) : e.target.value
              )
            }
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
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm font-medium">
            {prefix}
          </span>
          <input
            type={type}
            value={value}
            onChange={(e) =>
              onChange(
                type === "number" ? Number(e.target.value) : e.target.value
              )
            }
            className="w-full px-3 py-2 pl-8 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
    );
  }

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
          <Field
            label="Name"
            value={member.name}
            onChange={(val: string) => handleChange("name", val)}
          />
          <SelectField
            label="Role"
            value={member.role}
            options={["Manager", "Employee", "Intern", "Head"]}
            onChange={(val: string) =>
              handleChange("role", val as OrganizationMember["role"])
            }
          />
          <Field
            label="Department"
            value={member.department}
            onChange={(val: string) => handleChange("department", val)}
          />
          {["employee", "intern"].includes(member.role.toLowerCase()) && (
            <SelectField
              label="Manager"
              value={member.upperManager || ""}
              options={allManagers.map((m) => String(m.id))}
              onChange={(val: string) => handleChange("upperManager", val)}
            />
          )}
          <FieldWithPrefix
            label="Salary"
            value={member.salary}
            type="number"
            prefix="$"
            onChange={(val: string | number) =>
              handleChange("salary", Number(val))
            }
          />
          <Field
            label="Joining Date"
            value={member.joiningDate}
            type="date"
            onChange={(val: string) => handleChange("joiningDate", val)}
          />
          <FieldWithSuffix
            label="Experience"
            value={
              typeof member.experience === "string"
                ? parseInt(member.experience) || 0
                : member.experience
            }
            type="number"
            suffix="Years"
            onChange={(val: string | number) =>
              handleChange("experience", Number(val))
            }
          />
          <Field
            label="Email"
            value={member.contactInfo.email}
            onChange={(val: string) => handleContactChange("email", val)}
          />
          <Field
            label="Phone"
            value={member.contactInfo.phone}
            onChange={(val: string) => handleContactChange("phone", val)}
          />
        </div>

        <textarea
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          placeholder="Address"
          value={member.contactInfo.address}
          onChange={(e) => handleContactChange("address", e.target.value)}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Field
            label="PAN Number"
            value={member.documents.pan}
            onChange={(val: string) => handleDocumentChange("pan", val)}
          />
          <Field
            label="Aadhar Number"
            value={member.documents.aadhar}
            onChange={(val: string) => handleDocumentChange("aadhar", val)}
          />
        </div>

        {/* Performance Metrics */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Performance Metrics
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Field
              label="Tasks Per Day"
              value={member.performanceMetrics.tasksPerDay}
              type="number"
              onChange={(val: string | number) =>
                handlePerformanceChange("tasksPerDay", Number(val))
              }
            />
            <FieldWithSuffix
              label="Attendance Score"
              value={member.performanceMetrics.attendanceScore}
              type="number"
              suffix="%"
              onChange={(val: string | number) =>
                handlePerformanceChange("attendanceScore", Number(val))
              }
            />
            <FieldWithSuffix
              label="Manager Review Rating"
              value={member.performanceMetrics.managerReviewRating}
              type="number"
              suffix="/5"
              onChange={(val: string | number) =>
                handlePerformanceChange("managerReviewRating", Number(val))
              }
            />
            <FieldWithSuffix
              label="Combined Performance"
              value={member.performanceMetrics.combinedPercentage}
              type="number"
              suffix="%"
              onChange={(val: string | number) =>
                handlePerformanceChange("combinedPercentage", Number(val))
              }
            />
          </div>
        </div>

        {/* Projects */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Projects</h3>
          <textarea
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="Projects (comma-separated)"
            value={projectsText}
            onChange={(e) => handleProjectsChange(e.target.value)}
            onBlur={handleProjectsBlur}
          />
          <p className="text-xs text-gray-500">
            Enter project names separated by commas (e.g., &quot;Project A,
            Project B, Project C&quot;)
          </p>
        </div>

        {/* If manager, show employee/intern selection */}
        {member.role.toLowerCase() === "manager" &&
          (() => {
            type ManagerWithMembers = OrganizationMember & {
              employees?: OrganizationMember[];
              interns?: OrganizationMember[];
            };
            const manager = member as ManagerWithMembers;
            return (
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <MultiSelectDropdown
                  label="Employees Under Manager"
                  options={allEmployees}
                  selected={
                    Array.isArray(manager.employees) ? manager.employees : []
                  }
                  getOptionLabel={(emp) => emp.name}
                  getOptionKey={(emp) => emp.id}
                  onAdd={(emp) =>
                    setMember((prev) =>
                      prev
                        ? {
                            ...prev,
                            employees: [
                              ...((prev as ManagerWithMembers).employees || []),
                              emp,
                            ],
                          }
                        : prev
                    )
                  }
                  onRemove={(idx: number) =>
                    setMember((prev) =>
                      prev
                        ? {
                            ...prev,
                            employees: (
                              (prev as ManagerWithMembers).employees || []
                            ).filter((_, i) => i !== idx),
                          }
                        : prev
                    )
                  }
                />
                <MultiSelectDropdown
                  label="Interns Under Manager"
                  options={allInterns}
                  selected={
                    Array.isArray(manager.interns) ? manager.interns : []
                  }
                  getOptionLabel={(intern) => intern.name}
                  getOptionKey={(intern) => intern.id}
                  onAdd={(intern) =>
                    setMember((prev) =>
                      prev
                        ? {
                            ...prev,
                            interns: [
                              ...((prev as ManagerWithMembers).interns || []),
                              intern,
                            ],
                          }
                        : prev
                    )
                  }
                  onRemove={(idx: number) =>
                    setMember((prev) =>
                      prev
                        ? {
                            ...prev,
                            interns: (
                              (prev as ManagerWithMembers).interns || []
                            ).filter((_, i) => i !== idx),
                          }
                        : prev
                    )
                  }
                />
              </div>
            );
          })()}
      </div>
    </div>
  );
}
