// "use client";

// import { useRouter } from "next/navigation";
// import { useState } from "react";
// import { motion } from "framer-motion";
// import { Users, Plus } from "lucide-react";
// import { sampleMembers } from "@/lib/sampleData";
// // import type { OrganizationMember } from "../../types";

// export default function MembersPage() {
//   const [members, setMembers] = useState(sampleMembers);
//   const router = useRouter();

//   return (
//     <div className="space-y-6">
//       <div className="flex justify-between items-center">
//         <div className="flex items-center gap-3">
//           <div className="p-3 bg-blue-100 rounded-lg">
//             <Users className="text-blue-600" size={24} />
//           </div>
//           <div>
//             <h1 className="text-2xl font-bold text-gray-900">Members</h1>
//             <p className="text-gray-600">Manage your organization members</p>
//           </div>
//         </div>
//         <button
//           onClick={() => router.push("/members/add")}
//           className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
//         >
//           <Plus size={20} />
//           Add Member
//         </button>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//         {members.map((member) => (
//           <motion.div
//             key={member.id}
//             whileHover={{ y: -2, scale: 1.01 }}
//             className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 cursor-pointer hover:shadow-md transition-all"
//             onClick={() => router.push(`/members/${member.id}`)}
//           >
//             <div className="flex items-center gap-4 mb-4">
//               <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full flex items-center justify-center text-white font-bold">
//                 {member.name
//                   .split(" ")
//                   .map((n: string) => n[0])
//                   .join("")}
//               </div>
//               <div>
//                 <h3 className="font-bold text-lg text-gray-900">{member.name}</h3>
//                 <p className="text-gray-600">{member.role}</p>
//               </div>
//             </div>
//             <div className="space-y-2 text-sm">
//               <div className="flex justify-between">
//                 <span className="text-gray-600">Department:</span>
//                 <span className="font-semibold text-gray-900">{member.department}</span>
//               </div>
//               <div className="flex justify-between">
//                 <span className="text-gray-600">Salary:</span>
//                 <span className="font-semibold text-green-600">${member.salary.toLocaleString()}</span>
//               </div>
//             </div>
//           </motion.div>
//         ))}
//       </div>
//     </div>
//   );
// }
"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { motion } from "framer-motion"
import { Users, Plus } from "lucide-react"
import { sampleMembers } from "@/lib/sampleData"

export default function MembersPage() {
  const [members, setMembers] = useState(sampleMembers)
  const router = useRouter()

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-100 rounded-lg">
            <Users className="text-blue-600" size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Members</h1>
            <p className="text-gray-600">Manage your organization members</p>
          </div>
        </div>
        <button
          onClick={() => router.push("/admin/IT/members/add")}
          className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus size={18} />
          Add Member
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {members.map((member) => (
          <motion.div
            key={member.id}
            whileHover={{ y: -2, scale: 1.01 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 cursor-pointer hover:shadow-md transition-all"
            onClick={() => router.push(`/admin/IT/members/${member.id}`)}
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-lg">
                {member.name
                  .split(" ")
                  .map((n: string) => n[0])
                  .join("")}
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">{member.name}</h3>
                <p className="text-sm text-gray-600">{member.role}</p>
              </div>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-gray-700">
                <span>Department</span>
                <span className="font-medium text-gray-900">{member.department}</span>
              </div>
              <div className="flex justify-between text-gray-700">
                <span>Salary</span>
                <span className="font-medium text-green-600">
                  ${member.salary.toLocaleString()}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
