"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { OrganizationMember } from "../../../../../../../types";
import axiosInstance from "../../../../../../../lib/axiosInstance";

// Component interfaces
interface FieldProps {
  label: string;
  name?: string;
  type?: string;
  value: string | number;
  onChange: (value: string) => void;
  required?: boolean;
  placeholder?: string;
  min?: number;
  max?: number;
}

interface SelectFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
  required?: boolean;
}

// Custom form components
const Input: React.FC<FieldProps> = ({
  label,
  name,
  type = "text",
  value,
  onChange,
  required,
  placeholder,
}) => (
  <div className="mb-4">
    <label className="block text-sm font-medium text-gray-700 mb-2">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      required={required}
      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
    />
  </div>
);

const SelectField: React.FC<SelectFieldProps> = ({
  label,
  value,
  onChange,
  options,
  required,
}) => (
  <div className="mb-4">
    <label className="block text-sm font-medium text-gray-700 mb-2">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      required={required}
      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
    >
      <option value="">Select {label}</option>
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  </div>
);

const FieldWithPrefix: React.FC<FieldProps & { prefix: string }> = ({
  label,
  name,
  type = "text",
  value,
  onChange,
  required,
  prefix,
}) => (
  <div className="mb-4">
    <label className="block text-sm font-medium text-gray-700 mb-2">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <div className="flex">
      <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
        {prefix}
      </span>
      <input
        type={type}
        name={name}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        className="flex-1 px-3 py-2 border border-gray-300 rounded-r-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
      />
    </div>
  </div>
);

const FieldWithSuffix: React.FC<FieldProps & { suffix: string }> = ({
  label,
  name,
  type = "text",
  value,
  onChange,
  required,
  suffix,
}) => (
  <div className="mb-4">
    <label className="block text-sm font-medium text-gray-700 mb-2">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <div className="flex">
      <input
        type={type}
        name={name}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
      />
      <span className="inline-flex items-center px-3 rounded-r-md border border-l-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
        {suffix}
      </span>
    </div>
  </div>
);

const Textarea: React.FC<FieldProps> = ({
  label,
  name,
  value,
  onChange,
  required,
  placeholder,
}) => (
  <div className="mb-4">
    <label className="block text-sm font-medium text-gray-700 mb-2">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <textarea
      name={name}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      required={required}
      rows={3}
      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
    />
  </div>
);

// MultiSelectDropdown component interface
interface MultiSelectDropdownProps {
  items: OrganizationMember[];
  selectedItems: OrganizationMember[];
  onAdd: (item: OrganizationMember) => void;
  onRemove: (index: number) => void;
  getOptionLabel: (item: OrganizationMember) => string;
  getOptionKey: (item: OrganizationMember) => string | number;
  placeholder: string;
}

const MultiSelectDropdown: React.FC<MultiSelectDropdownProps> = ({
  items,
  selectedItems,
  onAdd,
  onRemove,
  getOptionLabel,
  getOptionKey,
  placeholder,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <div className="min-h-[40px] p-2 border border-gray-300 rounded-md bg-white">
        <div className="flex flex-wrap gap-1 mb-2">
          {selectedItems.map((item, index) => (
            <span
              key={getOptionKey(item)}
              className="bg-blue-100 text-blue-800 px-2 py-1 rounded-md text-sm flex items-center"
            >
              {getOptionLabel(item)}
              <button
                type="button"
                onClick={() => onRemove(index)}
                className="ml-1 text-blue-600 hover:text-blue-800"
              >
                ×
              </button>
            </span>
          ))}
        </div>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-1 text-gray-500 text-sm"
        >
          <span className="text-lg font-bold">+</span>
          {placeholder}
        </button>
      </div>
      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-48 overflow-y-auto">
          {items
            .filter(
              (item) =>
                !selectedItems.some(
                  (selected) => getOptionKey(selected) === getOptionKey(item)
                )
            )
            .map((item) => (
              <button
                key={getOptionKey(item)}
                type="button"
                onClick={() => {
                  onAdd(item);
                  setIsOpen(false);
                }}
                className="w-full text-left px-3 py-2 hover:bg-gray-100"
              >
                {getOptionLabel(item)}
              </button>
            ))}
        </div>
      )}
    </div>
  );
};

export default function AddMemberPage() {
  const router = useRouter();

  const [allEmployees, setAllEmployees] = useState<OrganizationMember[]>([]);
  const [allInterns, setAllInterns] = useState<OrganizationMember[]>([]);
  const [allManagers, setAllManagers] = useState<OrganizationMember[]>([]);

  const [name, setName] = useState("");
  const [role, setRole] = useState<OrganizationMember["role"]>("Manager");
  const [department, setDepartment] = useState("IT");
  const [salary, setSalary] = useState("");
  const [experience, setExperience] = useState<number | string>(0);
  const [joiningDate, setJoiningDate] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [pan, setPan] = useState("");
  const [aadhar, setAadhar] = useState("");
  const [tasksPerDay, setTasksPerDay] = useState(0);
  const [attendanceScore, setAttendanceScore] = useState(100);
  const [managerReviewRating, setManagerReviewRating] = useState(0);
  const [combinedPercentage, setCombinedPercentage] = useState(0);
  const [projectsText, setProjectsText] = useState("");
  const [selectedManagerId, setSelectedManagerId] = useState("");
  const [selectedManagerName, setSelectedManagerName] = useState("");

  const [employeesUnderManager, setEmployeesUnderManager] = useState<OrganizationMember[]>([]);
  const [internsUnderManager, setInternsUnderManager] = useState<OrganizationMember[]>([]);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const response = await axiosInstance.get("/IT/org-members/empInfo");
        const allMembers = response.data;
        setAllEmployees(allMembers.filter((m: OrganizationMember) => m.role.toLowerCase() === "employee"));
        setAllInterns(allMembers.filter((m: OrganizationMember) => m.role.toLowerCase() === "intern"));
        setAllManagers(allMembers.filter((m: OrganizationMember) => m.role.toLowerCase() === "manager"));
      } catch (err) {
        console.error("Failed to fetch members", err);
      }
    };
    fetchMembers();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const projectsList = projectsText
      .split(",")
      .map((p) => p.trim())
      .filter(Boolean);

    const formDataToSubmit: Record<string, any> = {
      name,
      role,
      department,
      salary: salary.trim() === "" ? undefined : Number(salary),
      experience: Number(experience),
      projects: projectsList,
      joiningDate,
      contactInfo: {
        email,
        phone,
        address,
      },
      documents: {
        pan,
        aadhar,
      },
      performanceMetrics: {
        tasksPerDay,
        attendanceScore,
        managerReviewRating,
        combinedPercentage,
      },
      attendance: {
        last7Days: [true, true, true, true, true, false, false],
        todayPresent: true,
      },
    };

    if (email) {
      formDataToSubmit.email = email;
    }

    if (["employee", "intern"].includes(role.toLowerCase()) && selectedManagerId) {
      formDataToSubmit.upperManager = selectedManagerId;
      formDataToSubmit.upperManagerName = selectedManagerName;
    }

    if (role === "Manager") {
      formDataToSubmit.employees = employeesUnderManager.map((e) => ({ id: e.id }));
      formDataToSubmit.interns = internsUnderManager.map((i) => ({ id: i.id }));
    }

    try {
      await axiosInstance.post("/IT/org-members", formDataToSubmit);
      router.push("/admin/IT/members");
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Add New Member</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <div className="grid md:grid-cols-2 gap-4">
          <Input label="Full Name" value={name} onChange={setName} />
          <SelectField
            label="Role"
            value={role}
            options={["Manager", "Employee", "Intern", "Head"]}
            onChange={(val) => {
              setRole(val as OrganizationMember["role"]);
              if (val === "Employee" || val === "Intern") {
                setSelectedManagerId("");
              }
            }}
          />
          {["Employee", "Intern"].includes(role) && (
            <select
              required
              value={selectedManagerId}
              onChange={(e) => {
                const id = e.target.value;
                const mgr = allManagers.find((m) => String(m.id) === id);
                setSelectedManagerId(id);
                setSelectedManagerName(mgr?.name || "");
              }}
              className="w-full p-2 border rounded"
            >
              <option value="">Select Manager</option>
              {allManagers.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
            </select>
          )}
          <Input label="Department" value={department} onChange={setDepartment} />
          <FieldWithPrefix label="Salary" prefix="$" type="number" value={salary} onChange={setSalary} />
          <Input label="Joining Date" type="date" value={joiningDate} onChange={setJoiningDate} />
          <FieldWithSuffix label="Experience" suffix="Years" type="number" value={experience} onChange={setExperience} />
        </div>

        {/* Contact Info */}
        <div className="grid md:grid-cols-2 gap-4">
          <Input label="Email" type="email" value={email} onChange={setEmail} />
          <Input label="Phone" type="tel" value={phone} onChange={setPhone} />
          <Textarea label="Address" value={address} onChange={setAddress} />
        </div>

        {/* Documents */}
        <div className="grid md:grid-cols-2 gap-4">
          <Input label="PAN Number" value={pan} onChange={setPan} />
          <Input label="Aadhar Number" value={aadhar} onChange={setAadhar} />
        </div>

        {/* Performance */}
        <div className="grid md:grid-cols-4 gap-4">
          <Input label="Tasks Per Day" type="number" value={tasksPerDay} onChange={(v) => setTasksPerDay(Number(v))} />
          <FieldWithSuffix label="Attendance Score" suffix="%" type="number" value={attendanceScore} onChange={(v) => setAttendanceScore(Number(v))} />
          <FieldWithSuffix label="Manager Review Rating" suffix="/5" type="number" value={managerReviewRating} onChange={(v) => setManagerReviewRating(Number(v))} />
          <FieldWithSuffix label="Combined Performance" suffix="%" type="number" value={combinedPercentage} onChange={(v) => setCombinedPercentage(Number(v))} />
        </div>

        {/* Projects */}
        <Textarea
          label="Projects (comma-separated)"
          value={projectsText}
          onChange={setProjectsText}
          placeholder="Project A, Project B, ..."
        />

        {/* Subordinates */}
        {role === "Manager" && (
          <div className="grid md:grid-cols-2 gap-4">
            <MultiSelectDropdown
              items={allEmployees}
              selectedItems={employeesUnderManager}
              onAdd={(item) => setEmployeesUnderManager((prev) => [...prev, item])}
              onRemove={(idx) =>
                setEmployeesUnderManager((prev) => prev.filter((_, i) => i !== idx))
              }
              getOptionLabel={(m) => m.name}
              getOptionKey={(m) => m.id}
              placeholder="Add Employee"
            />
            <MultiSelectDropdown
              items={allInterns}
              selectedItems={internsUnderManager}
              onAdd={(item) => setInternsUnderManager((prev) => [...prev, item])}
              onRemove={(idx) =>
                setInternsUnderManager((prev) => prev.filter((_, i) => i !== idx))
              }
              getOptionLabel={(m) => m.name}
              getOptionKey={(m) => m.id}
              placeholder="Add Intern"
            />
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Add Member
          </button>
          <button
            type="button"
            onClick={() => router.push("/admin/IT/members")}
            className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
