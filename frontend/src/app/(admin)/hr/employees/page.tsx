// 'use client';

// import { useState } from 'react';
// import EmployeeRecords from './records/page';
// import PersonalInformation from './personal/page';
// import JoiningExitDates from './joining-exit/page';
// import DepartmentAssignment from './department/page';

// const tabs = [
//   { label: 'Employee Records', icon: '📋' },
//   { label: 'Personal Info', icon: '👤' },
//   { label: 'Joining & Exit Dates', icon: '📅' },
//   { label: 'Department Assignment', icon: '🏢' }
// ];

// export default function EmployeesPage() {
//   const [activeTab, setActiveTab] = useState<number>(0);

//   return (
//     <div className="p-4 sm:p-6 max-w-7xl mx-auto">
//       <h1 className="text-xl sm:text-2xl font-bold mb-4 text-gray-900">
//         👥 Employees
//       </h1>

//       <div className="flex flex-wrap gap-2 mb-6">
//         {tabs.map((tab, index) => (
//           <button
//             key={index}
//             onClick={() => setActiveTab(index)}
//             className={`px-4 py-2 rounded-full font-medium text-sm ${
//               activeTab === index
//                 ? 'bg-red-500 text-white hover:bg-red-600'
//                 : 'bg-red-100 text-red-700 hover:bg-red-50'
//             }`}
//           >
//             {tab.icon} {tab.label}
//           </button>
//         ))}
//       </div>

//       <div className="transition-all">
//         {activeTab === 0 && <EmployeeRecords />}
//         {activeTab === 1 && <PersonalInformation />}
//         {activeTab === 2 && <JoiningExitDates />}
//         {activeTab === 3 && <DepartmentAssignment />}
//       </div>
//     </div>
//   );
// }
"use client";

import { useState } from "react";
import EmployeeRecords from "./records/page";

const tabs = [{ label: "Employee Records", icon: "📋" }];

export default function EmployeesPage() {
  const [activeTab, setActiveTab] = useState<number>(0);
  
  
  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto">
      <h1 className="text-xl sm:text-2xl font-bold mb-4 text-gray-900">
        👥 Employees
      </h1>

      <div className="flex flex-wrap gap-2 mb-6">
        {tabs.map((tab, index) => (
          <button
            key={index}
            onClick={() => setActiveTab(index)}
            className={`px-4 py-2 rounded-full font-medium text-sm ${
              activeTab === index
                ? "bg-red-500 text-white hover:bg-red-600"
                : "bg-red-100 text-red-700 hover:bg-red-50"
            }`}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      <div className="transition-all">
        {activeTab === 0 && <EmployeeRecords />}
      </div>
    </div>
  );
}
