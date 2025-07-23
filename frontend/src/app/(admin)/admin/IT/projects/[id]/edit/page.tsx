"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { MultiSelectDropdown } from "@/components/MultiSelectDropdown";
import type { Project } from "../../../../types";
import axios from "@/lib/axiosInstance";

export default function EditProjectPage() {
  const { id } = useParams();
  const router = useRouter();
  const [project, setProject] = useState<Project | null>(null);
  const [allDepartments, setAllDepartments] = useState<any[]>([]);
  const [allMembers, setAllMembers] = useState<any[]>([]);
  const [allManagers, setAllManagers] = useState<any[]>([]);
  // Local state for skills text
  const [skillsText, setSkillsText] = useState<string>("");

  useEffect(() => {
    async function fetchProject() {
      try {
        const res = await axios.get(`/projects/${id}`);
        if (!res.data) {
          router.push("/admin/IT/projects");
        } else {
          setProject(res.data);
          setSkillsText(
            Array.isArray(res.data.skillsRequired)
              ? res.data.skillsRequired.join(", ")
              : ""
          );
        }
      } catch (err) {
        router.push("/admin/IT/projects");
      }
    }
    async function fetchOptions() {
      try {
        const deptRes = await axios.get("/departments");
        setAllDepartments(
          (deptRes.data || []).map((d: any) => ({
            id: d._id || d.id,
            name: d.name,
          }))
        );
        const memberRes = await axios.get("/IT/org-members");
        const members = memberRes.data || [];
        setAllMembers(members);
        setAllManagers(
          members.filter(
            (m: any) =>
              m.role && m.role.toLowerCase().trim() === "manager" && m.name
          )
        );
      } catch (err) {
        setAllDepartments([]);
        setAllMembers([]);
        setAllManagers([]);
      }
    }
    if (id) fetchProject();
    fetchOptions();
  }, [id, router]);

  const handleChange = (key: keyof Project, value: any) => {
    if (!project) return;
    setProject({ ...project, [key]: value });
  };

  const handleSubmit = async () => {
    if (!project) return;
    try {
      await axios.put(`/projects/${id}`, project);
      console.log("Project updated successfully");
      router.push(`/admin/IT/projects/${id}`);
    } catch (err) {
      alert("Failed to update project. Please try again.");
    }
  };

  if (!project) return null;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-1 text-blue-600 hover:text-blue-800 font-medium"
        >
          ← Cancel
        </button>
        <button
          onClick={handleSubmit}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Save Changes
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 space-y-8">
        <h1 className="text-3xl font-bold text-gray-900">Edit Project</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Field
            label="Project Name"
            value={project.name}
            onChange={(val) => handleChange("name", val)}
          />
          <Field
            label="Client"
            value={project.client}
            onChange={(val) => handleChange("client", val)}
          />
          <Field
            label="Start Date"
            value={
              project.startDate
                ? new Date(project.startDate).toISOString().slice(0, 10)
                : ""
            }
            type="date"
            onChange={(val) => handleChange("startDate", val)}
          />
          <Field
            label="Deadline"
            value={
              project.deadline
                ? new Date(project.deadline).toISOString().slice(0, 10)
                : ""
            }
            type="date"
            onChange={(val) => handleChange("deadline", val)}
          />
          <Field
            label="Price"
            value={
              project.amount === undefined ||
              project.amount === null ||
              project.amount === 0
                ? ""
                : project.amount
            }
            type="number"
            placeholder="Enter price"
            onChange={(val) =>
              handleChange("amount", val === "" ? null : Number(val))
            }
          />
          <Field
            label="Completion %"
            value={
              project.completionPercentage === undefined ||
              project.completionPercentage === null
                ? ""
                : project.completionPercentage
            }
            type="number"
            placeholder="Enter completion %"
            onChange={(val) => {
              if (val === "") {
                handleChange("completionPercentage", undefined);
              } else {
                const newVal = Number(val);
                handleChange("completionPercentage", newVal);
              }
            }}
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <select
              value={project.status || "pending"}
              onChange={(e) => handleChange("status", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="pending">Pending</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
              <option value="on-hold">On Hold</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        {/* Project Links (comma-separated URLs) */}
        <TextArea
          label="Project Links (comma-separated URLs)"
          value={Array.isArray(project.links) ? project.links.join(", ") : ""}
          onChange={val => handleChange("links", val.split(",").map(s => s.trim()).filter(Boolean))}
          placeholder="https://example.com, https://another.com"
        />

        <div className="space-y-6">
          <TextArea
            label="Project Scope"
            value={project.projectScope}
            onChange={(val) => handleChange("projectScope", val)}
          />
          <TextArea
            label="Client Inputs"
            value={project.clientInputs}
            onChange={(val) => handleChange("clientInputs", val)}
          />
          <TextArea
            label="Effect Analysis"
            value={project.effectAnalysis || ""}
            onChange={(val) => handleChange("effectAnalysis", val)}
          />
          <MultiSelectDropdown
            label="Departments"
            options={allDepartments}
            selected={(project.departmentsInvolved ?? []).map(
              (name: string) =>
                allDepartments.find((d) => d.name === name) || {
                  id: name,
                  name,
                }
            )}
            onAdd={(d) =>
              handleChange("departmentsInvolved", [
                ...(project.departmentsInvolved ?? []),
                d.name,
              ])
            }
            onRemove={(idx) =>
              handleChange(
                "departmentsInvolved",
                (project.departmentsInvolved ?? []).filter(
                  (_: any, i: number) => i !== idx
                )
              )
            }
            getOptionLabel={(d) => d.name}
            getOptionKey={(d) => d.id}
          />
          <TextArea
            label="Skills Required (comma-separated)"
            value={typeof skillsText === "string" ? skillsText : ""}
            onChange={setSkillsText}
            onBlur={() =>
              handleChange(
                "skillsRequired",
                (typeof skillsText === "string" ? skillsText : "")
                  .split(",")
                  .map((s) => s.trim())
                  .filter(Boolean)
              )
            }
          />
          <MultiSelectDropdown
            label="Members"
            options={allMembers}
            selected={(project.membersInvolved ?? []).map(
              (name: string) =>
                allMembers.find((m) => m.name === name) || { id: name, name }
            )}
            onAdd={(m) =>
              handleChange("membersInvolved", [
                ...(project.membersInvolved ?? []),
                m.name,
              ])
            }
            onRemove={(idx) =>
              handleChange(
                "membersInvolved",
                (project.membersInvolved ?? []).filter(
                  (_: any, i: number) => i !== idx
                )
              )
            }
            getOptionLabel={(m) => m.name}
            getOptionKey={(m) => m.id}
          />
          <MultiSelectDropdown
            label="Managers"
            options={allManagers}
            selected={(project.managersInvolved ?? []).map(
              (name: string) =>
                allManagers.find((m) => m.name === name) || { id: name, name }
            )}
            onAdd={(m) =>
              handleChange("managersInvolved", [
                ...(project.managersInvolved ?? []),
                m.name,
              ])
            }
            onRemove={(idx) =>
              handleChange(
                "managersInvolved",
                (project.managersInvolved ?? []).filter(
                  (_: any, i: number) => i !== idx
                )
              )
            }
            getOptionLabel={(m) => m.name}
            getOptionKey={(m) => m.id}
          />



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
  placeholder,
}: {
  label: string;
  value: string | number;
  type?: string;
  placeholder?: string;
  onChange: (val: string) => void;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      />
    </div>
  );
}

function TextArea({
  label,
  value,
  onChange,
  onBlur,
  placeholder
}: {
  label: string;
  value: string;
  onChange: (val: string) => void;
  onBlur?: () => void;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <textarea
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        placeholder={placeholder}
        rows={3}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        spellCheck={true}
        autoCorrect="on"
        autoComplete="off"
      />
    </div>
  );
}
