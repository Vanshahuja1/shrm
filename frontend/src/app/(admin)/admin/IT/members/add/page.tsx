// "use client";

// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import type { OrganizationMember } from "../../../types";

// export default function AddMemberPage() {
//   const router = useRouter();
//   const [formData, setFormData] = useState<Omit<OrganizationMember, "id">>({
//     name: "",
//     role: "Employee",
//     department: "IT Development",
//     salary: 0,
//     projects: [],
//     experience: "",
//     contactInfo: {
//       email: "",
//       phone: "",
//       address: "",
//     },
//     documents: {
//       pan: "",
//       aadhar: "",
//     },
//     joiningDate: "",
//     performanceMetrics: {
//       tasksPerDay: 0,
//       attendanceScore: 0,
//       managerReviewRating: 0,
//       combinedPercentage: 0,
//     },
//     attendance: {
//       last7Days: [true, true, true, true, true, false, false],
//       todayPresent: true,
//     },
//   });

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     console.log("New Member Data:", formData);
//     router.push("/admin/IT/members");
//   };

//   return (
//     <div className="max-w-4xl mx-auto p-6">
//       <h1 className="text-3xl font-bold mb-6 text-gray-900">Add New Member</h1>
//       <form onSubmit={handleSubmit} className="space-y-6">
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           <input
//             type="text"
//             placeholder="Full Name"
//             value={formData.name}
//             onChange={(e) => setFormData({ ...formData, name: e.target.value })}
//             required
//             className="input"
//           />
//           <input
//             type="email"
//             placeholder="Email"
//             value={formData.contactInfo.email}
//             onChange={(e) => setFormData({
//               ...formData,
//               contactInfo: { ...formData.contactInfo, email: e.target.value },
//             })}
//             required
//             className="input"
//           />
//           <input
//             type="tel"
//             placeholder="Phone"
//             value={formData.contactInfo.phone}
//             onChange={(e) => setFormData({
//               ...formData,
//               contactInfo: { ...formData.contactInfo, phone: e.target.value },
//             })}
//             className="input"
//           />
//           <input
//             type="text"
//             placeholder="Department"
//             value={formData.department}
//             onChange={(e) => setFormData({ ...formData, department: e.target.value })}
//             className="input"
//           />
//           <input
//             type="text"
//             placeholder="Role"
//             value={formData.role}
//             onChange={(e) => setFormData({ ...formData, role: e.target.value as OrganizationMember["role"] })}
//             className="input"
//           />
//           <input
//             type="number"
//             placeholder="Salary"
//             value={formData.salary}
//             onChange={(e) => setFormData({ ...formData, salary: Number(e.target.value) })}
//             className="input"
//           />
//         </div>

//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
//           <textarea
//             value={formData.contactInfo.address}
//             onChange={(e) =>
//               setFormData({
//                 ...formData,
//                 contactInfo: { ...formData.contactInfo, address: e.target.value },
//               })
//             }
//             className="w-full px-3 py-2 border rounded-lg focus:ring focus:ring-blue-500"
//             rows={3}
//           />
//         </div>

//         <div className="flex gap-4">
//           <button
//             type="submit"
//             className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
//           >
//             Add Member
//           </button>
//           <button
//             type="button"
//             onClick={() => router.push("/admin/IT/members")}
//             className="bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600"
//           >
//             Cancel
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// }
// app/admin/IT/members/add/page.tsx
"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import type { OrganizationMember } from "../../../types"

export default function AddMemberPage() {
  const router = useRouter()

  const [formData, setFormData] = useState<Omit<OrganizationMember, "id">>({
    name: "",
    role: "Employee",
    department: "IT Development",
    salary: 0,
    projects: [],
    experience: "",
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
      attendanceScore: 0,
      managerReviewRating: 0,
      combinedPercentage: 0,
    },
    attendance: {
      last7Days: [true, true, true, true, true, false, false],
      todayPresent: true,
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("New Member:", formData)
    router.push("/admin/IT/members")
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Add New Member</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input label="Full Name" value={formData.name} onChange={(val) => setFormData({ ...formData, name: val })} />
          <Input
            label="Email"
            type="email"
            value={formData.contactInfo.email}
            onChange={(val) =>
              setFormData({ ...formData, contactInfo: { ...formData.contactInfo, email: val } })
            }
          />
          <Input
            label="Phone"
            type="tel"
            value={formData.contactInfo.phone}
            onChange={(val) =>
              setFormData({ ...formData, contactInfo: { ...formData.contactInfo, phone: val } })
            }
          />
          <Input
            label="Department"
            value={formData.department}
            onChange={(val) => setFormData({ ...formData, department: val })}
          />
          <Input
            label="Role"
            value={formData.role}
            onChange={(val) => setFormData({ ...formData, role: val as OrganizationMember["role"] })}
          />
          <Input
            label="Salary"
            type="number"
            value={formData.salary}
            onChange={(val) => setFormData({ ...formData, salary: Number(val) })}
          />
        </div>

        <Textarea
          label="Address"
          value={formData.contactInfo.address}
          onChange={(val) =>
            setFormData({ ...formData, contactInfo: { ...formData.contactInfo, address: val } })
          }
        />

        <div className="flex gap-4 pt-4">
          <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
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
  )
}

function Input({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string
  value: string | number
  type?: string
  onChange: (val: string) => void
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
  )
}

function Textarea({
  label,
  value,
  onChange,
}: {
  label: string
  value: string
  onChange: (val: string) => void
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
  )
}
