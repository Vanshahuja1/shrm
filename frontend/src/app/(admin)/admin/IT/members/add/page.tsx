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
  // const [supervisors, setSupervisors] = useState<OrganizationMember[]>([]);
  const [allEmployees, setAllEmployees] = useState<OrganizationMember[]>([]);
  const [allInterns, setAllInterns] = useState<OrganizationMember[]>([]);
  const [allManagers, setAllManagers] = useState<OrganizationMember[]>([]);
  const [selectedManagerId, setSelectedManagerId] = useState<string>("");
  const [selectedManagerName, setSelectedManagerName] = useState<string>("");
  const [formData, setFormData] = useState<
    (Omit<OrganizationMember, "id" | "salary" | "upperManager"> & {
      salary: string;
    }) & {
      employees?: OrganizationMember[];
      interns?: OrganizationMember[];
    }
  >({
    name: "",
    role: "Manager",
    department: "IT",
    salary: "",
    projects: [],
    experience: 0,
    contactInfo: {
      email: "",
      phone: "",
      address: "",
    },
    documents: {
      pan: "",
      aadhar: "",
    },
    joiningDate: "",
    performanceMetrics: {
      tasksPerDay: 0,
      attendanceScore: 100,
      managerReviewRating: 0,
      combinedPercentage: 0,
    },
    attendance: {
      last7Days: [true, true, true, true, true, false, false],
      todayPresent: true,
    },
    employees: [],
    interns: [],
  });

  const [projectsText, setProjectsText] = useState<string>("");

  // Fetch employees and interns on component mount
  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const response = await axiosInstance.get("/IT/org-members/empInfo");
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
      } catch (error) {
        console.error("Error fetching members:", error);
        setAllEmployees([]);
        setAllInterns([]);
        setAllManagers([]);
      }
    };
    fetchMembers();
  }, []);

  const handleProjectsChange = (val: string) => {
    setProjectsText(val);
    // Process projects immediately
    const projectsList = val
      .split(",")
      .map((p) => p.trim())
      .filter((p) => p);
    setFormData({ ...formData, projects: projectsList });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Process projects one final time before submission
    const projectsList = projectsText
      .split(",")
      .map((p) => p.trim())
      .filter((p) => p);

    const formDataToSubmit: Record<string, unknown> = {
      ...formData,
      projects: projectsList,
      salary:
        typeof formData.salary === "string"
          ? (formData.salary as string).trim() === ""
            ? undefined
            : Number(formData.salary)
          : formData.salary,
    };

    // Only add upperManager if employee/intern and a manager is selected
    if (
      ["employee", "intern"].includes(formData.role.toLowerCase()) &&
      selectedManagerId
    ) {
      formDataToSubmit.upperManager = selectedManagerId;
      formDataToSubmit.upperManagerName = selectedManagerName;
    }
    if (formData.role === "Manager") {
      const employees = (formData.employees || []).map((e) => ({
        id: e.id,
        upperManager: formDataToSubmit.id, // or leave as undefined if not available yet
      }));
      const interns = (formData.interns || []).map((i) => ({
        id: i.id,
        upperManager: formDataToSubmit.id, // or leave as undefined if not available yet
      }));
      formDataToSubmit.employees = employees;
      formDataToSubmit.interns = interns;
    }

    try {
      await axiosInstance.post("/IT/org-members", formDataToSubmit);
      console.log("Member added successfully");
      router.push("/admin/IT/members");
    } catch (error) {
      console.error("Error adding member:", error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Add New Member</h1>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Basic Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Full Name"
              value={formData.name}
              onChange={(val) => setFormData({ ...formData, name: val })}
            />
            <SelectField
              label="Role"
              value={formData.role}
              options={["Manager", "Employee", "Intern", "Head"]}
              onChange={(val) => {
                setFormData({
                  ...formData,
                  role: val as OrganizationMember["role"],
                  employees:
                    val === "Manager" ? formData.employees || [] : undefined,
                  interns:
                    val === "Manager" ? formData.interns || [] : undefined,
                });
                if (val === "Employee" || val === "Intern")
                  setSelectedManagerId("");
              }}
            />
            {/* Show manager selection if role is employee or intern */}
            {formData.role &&
              ["Employee", "Intern"].includes(formData.role) && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Manager
                  </label>
                  <select
                    value={selectedManagerId}
                    onChange={(e) => {
                      const selectedId = e.target.value;
                      const selected = allManagers.find(
                        (m) => String(m.id) === selectedId
                      );
                      setSelectedManagerId(selectedId);
                      setSelectedManagerName(selected?.name || "");

                      // Update formData with both manager ID and name
                      setFormData((prev) => ({
                        ...prev,
                        upperManager: selectedId,
                        upperManagerName: selected?.name || "",
                      }));
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Select Manager</option>
                    {allManagers.map((m) => (
                      <option key={m.id} value={String(m.id)}>
                        {m.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

            <Input
              label="Department"
              value={formData.department}
              onChange={(val) => setFormData({ ...formData, department: val })}
            />
            <FieldWithPrefix
              label="Salary"
              type="number"
              min={0}
              value={formData.salary}
              prefix="$"
              onChange={(val) =>
                setFormData({ ...formData, salary: String(val) })
              }
            />
            <Input
              label="Joining Date"
              type="date"
              value={formData.joiningDate}
              onChange={(val) => setFormData({ ...formData, joiningDate: val })}
            />
            <FieldWithSuffix
              label="Experience"
              min={0}
              type="number"
              value={formData.experience}
              suffix="Years"
              onChange={(val) =>
                setFormData({ ...formData, experience: Number(val) })
              }
            />
          </div>

          {/* Show employee/intern selection if role is manager */}
          {formData.role === "Manager" && (
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Employees Under Manager
                </label>
                <MultiSelectDropdown
                  items={allEmployees}
                  selectedItems={formData.employees || []}
                  onAdd={(emp) =>
                    setFormData({
                      ...formData,
                      employees: [...(formData.employees || []), emp],
                    })
                  }
                  onRemove={(idx) =>
                    setFormData({
                      ...formData,
                      employees: (formData.employees || []).filter(
                        (_, i) => i !== idx
                      ),
                    })
                  }
                  getOptionLabel={(item) => item.name}
                  getOptionKey={(item) => item.id}
                  placeholder="Add Employee"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Interns Under Manager
                </label>
                <MultiSelectDropdown
                  items={allInterns}
                  selectedItems={formData.interns || []}
                  onAdd={(intern) =>
                    setFormData({
                      ...formData,
                      interns: [...(formData.interns || []), intern],
                    })
                  }
                  onRemove={(idx) =>
                    setFormData({
                      ...formData,
                      interns: (formData.interns || []).filter(
                        (_, i) => i !== idx
                      ),
                    })
                  }
                  getOptionLabel={(item) => item.name}
                  getOptionKey={(item) => item.id}
                  placeholder="Add Intern"
                />
              </div>
            </div>
          )}
        </div>

        {/* Contact Information */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Contact Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Email"
              type="email"
              value={formData.contactInfo.email}
              onChange={(val) =>
                setFormData({
                  ...formData,
                  contactInfo: { ...formData.contactInfo, email: val },
                })
              }
            />
            <Input
              label="Phone"
              type="tel"
              value={formData.contactInfo.phone}
              onChange={(val) =>
                setFormData({
                  ...formData,
                  contactInfo: { ...formData.contactInfo, phone: val },
                })
              }
            />
          </div>
          <div className="mt-6">
            <Textarea
              label="Address"
              value={formData.contactInfo.address}
              onChange={(val) =>
                setFormData({
                  ...formData,
                  contactInfo: { ...formData.contactInfo, address: val },
                })
              }
            />
          </div>
        </div>

        {/* Documents */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Documents
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="PAN Number"
              value={formData.documents.pan}
              onChange={(val) =>
                setFormData({
                  ...formData,
                  documents: { ...formData.documents, pan: val },
                })
              }
            />
            <Input
              label="Aadhar Number"
              value={formData.documents.aadhar}
              onChange={(val) =>
                setFormData({
                  ...formData,
                  documents: { ...formData.documents, aadhar: val },
                })
              }
            />
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Performance Metrics
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Input
              label="Tasks Per Day"
              type="number"
              min={0}
              value={formData.performanceMetrics.tasksPerDay}
              onChange={(val) =>
                setFormData({
                  ...formData,
                  performanceMetrics: {
                    ...formData.performanceMetrics,
                    tasksPerDay: Number(val),
                  },
                })
              }
            />
            <FieldWithSuffix
              label="Attendance Score"
              type="number"
              min={0}
              max={100}
              value={formData.performanceMetrics.attendanceScore}
              suffix="%"
              onChange={(val) =>
                setFormData({
                  ...formData,
                  performanceMetrics: {
                    ...formData.performanceMetrics,
                    attendanceScore: Number(val),
                  },
                })
              }
            />
            <FieldWithSuffix
              label="Manager Review Rating"
              type="number"
              min={0}
              max={5}
              value={formData.performanceMetrics.managerReviewRating}
              suffix="/5"
              onChange={(val) =>
                setFormData({
                  ...formData,
                  performanceMetrics: {
                    ...formData.performanceMetrics,
                    managerReviewRating: Number(val),
                  },
                })
              }
            />
            <FieldWithSuffix
              label="Combined Performance"
              type="number"
              value={formData.performanceMetrics.combinedPercentage}
              suffix="%"
              min={0}
              max={100}
              onChange={(val) =>
                setFormData({
                  ...formData,
                  performanceMetrics: {
                    ...formData.performanceMetrics,
                    combinedPercentage: Number(val),
                  },
                })
              }
            />
          </div>
        </div>

        {/* Projects */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Projects</h2>
          <Textarea
            label="Projects (comma-separated)"
            value={projectsText}
            onChange={handleProjectsChange}
            placeholder="Enter project names separated by commas..."
          />
          <p className="text-xs text-gray-500 mt-2">
            Enter project names separated by commas (e.g., &quot;Project A,
            Project B, Project C&quot;)
          </p>
        </div>

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
