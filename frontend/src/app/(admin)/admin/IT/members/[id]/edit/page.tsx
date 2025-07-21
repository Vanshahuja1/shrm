"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import type { OrganizationMember } from "../../../../types";
import { sampleMembers } from "@/lib/sampleData";

export default function EditMemberPage() {
  const { id } = useParams();
  const router = useRouter();
  const [member, setMember] = useState<OrganizationMember | null>(null);

  useEffect(() => {
    const found = sampleMembers.find((m) => m.id === Number(id));
    if (!found) router.push("/admin/IT/members");
    else setMember(found);
  }, [id, router]);

  const handleChange = (key: keyof OrganizationMember, value: any) => {
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

  const handleSubmit = () => {
    console.log("Updated Member", member);
    router.push(`/admin/IT/members/${member!.id}`);
  };

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
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
        >
          Save Changes
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 space-y-8">
        <h1 className="text-3xl font-bold text-gray-900">Edit Member</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Field label="Name" value={member.name} onChange={(val) => handleChange("name", val)} />
          <Field label="Role" value={member.role} onChange={(val) => handleChange("role", val)} />
          <Field label="Department" value={member.department} onChange={(val) => handleChange("department", val)} />
          <Field label="Salary" value={member.salary} type="number" onChange={(val) => handleChange("salary", Number(val))} />
          <Field label="Joining Date" value={member.joiningDate} type="date" onChange={(val) => handleChange("joiningDate", val)} />
          <Field label="Experience" value={member.experience} onChange={(val) => handleChange("experience", val)} />
          <Field label="Email" value={member.contactInfo.email} onChange={(val) => handleContactChange("email", val)} />
          <Field label="Phone" value={member.contactInfo.phone} onChange={(val) => handleContactChange("phone", val)} />
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
