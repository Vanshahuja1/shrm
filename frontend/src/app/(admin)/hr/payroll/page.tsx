// "use client";

// import { useState } from "react";
// import { motion } from "framer-motion";
// import {
//   CalendarDays,
//   Users,
//   CheckCircle,
//   Info,
//   AlertTriangle,
//   FileText,
//   Play,
//   Eye,
//   Plus,
// } from "lucide-react";
// import {
//   ResponsiveContainer,
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   Tooltip,
//   Legend,
//   PieChart,
//   Pie,
//   Cell,
// } from "recharts";

// import Link from "next/link";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import {
//   Dialog,
//   DialogHeader,
//   DialogTitle,
//   DialogContent,
// } from "@/components/ui/dialog";
// import { formatCurrency } from "@/src/app/components/lib/utils";
// import FunctionalPayslipPage from "@/src/app/components/FunctionalPayslipPage";

// interface EmployeeRecord {
//   id: string;
//   name: string;
//   payableDays: string;
//   totalEarnings: number;
//   totalDeductions: number;
//   netPay: number;
//   department?: string;
//   dateOfJoining?: string;
//   designation?: string;
// }

// const periods = [
//   { label: "Apr 2020", range: "MAR 26 - APR 25", status: "completed" },
//   {
//     label: "May 2020",
//     range: "APR 26 - MAY 25",
//     status: "completed",
//     active: true,
//   },
//   { label: "Jun 2020", range: "MAY 26 - JUN 25", status: "completed" },
//   { label: "Jul 2020", range: "JUN 26 - JUL 25", status: "completed" },
//   { label: "Aug 2020", range: "JUL 26 - AUG 25", status: "current" },
//   { label: "Sep 2020", range: "AUG 26 - SEP 25", status: "upcoming" },
//   { label: "Oct 2020", range: "SEP 26 - OCT 25", status: "upcoming" },
// ];

// const modules = [
//   {
//     title: "Leave, attendance & daily wages",
//     href: "/hr/payroll/leave-deductions",
//     icon: <CalendarDays size={18} />,
//   },
//   {
//     title: "New joinees & exits",
//     href: "/hr/payroll/joinees-exit",
//     icon: <Users size={18} />,
//   },
//   {
//     title: "Bonus, salary revisions & overtime",
//     href: "/hr/payroll/bonuses-revisions",
//     icon: <FileText size={18} />,
//   },
//   {
//     title: "Reimbursement, adhoc payments, deductions",
//     href: "/hr/payroll/adhoc-expenses",
//     icon: <Info size={18} />,
//   },
//   {
//     title: "Arrears & dues",
//     href: "/hr/payroll/arrears-dues",
//     icon: <AlertTriangle size={18} />,
//   },
//   {
//     title: "Review all employees",
//     href: "/hr/payroll/review-all-employees",
//     icon: <CheckCircle size={18} />,
//   },
// ];

// export default function PayrollPage() {
//   const [showPayslip, setShowPayslip] = useState(false);
//   const [selectedEmployee, setSelectedEmployee] =
//     useState<EmployeeRecord | null>(null);
//   const [employees, setEmployees] = useState<EmployeeRecord[]>([
//     {
//       id: "1",
//       name: "Frank Smith",
//       payableDays: "25/28",
//       totalEarnings: 64532,
//       totalDeductions: 3850,
//       netPay: 60682,
//     },
//     {
//       id: "2",
//       name: "San Joseph",
//       payableDays: "26/28",
//       totalEarnings: 72580,
//       totalDeductions: 4780,
//       netPay: 67800,
//     },
//   ]);
//   const [showAddDialog, setShowAddDialog] = useState(false);
//   const [newEmployee, setNewEmployee] = useState({
//     name: "",
//     payableDays: "",
//     totalEarnings: "",
//     totalDeductions: "",
//     netPay: "",
//   });

//   const dummyEmployees: EmployeeRecord[] = [
//     {
//       id: "1",
//       name: "Frank Smith",
//       payableDays: "25/28",
//       totalEarnings: 64532,
//       totalDeductions: 3850,
//       netPay: 60682,
//     },
//     {
//       id: "2",
//       name: "San Joseph",
//       payableDays: "26/28",
//       totalEarnings: 72580,
//       totalDeductions: 4780,
//       netPay: 67800,
//     },
//     {
//       id: "3",
//       name: "Ami Patel",
//       payableDays: "28/28",
//       totalEarnings: 80000,
//       totalDeductions: 5000,
//       netPay: 75000,
//     },
//     {
//       id: "4",
//       name: "John Doe",
//       payableDays: "27/28",
//       totalEarnings: 70000,
//       totalDeductions: 4000,
//       netPay: 66000,
//     },
//     {
//       id: "5",
//       name: "Meera Nair",
//       payableDays: "28/28",
//       totalEarnings: 92400,
//       totalDeductions: 6200,
//       netPay: 86200,
//     },
//     {
//       id: "6",
//       name: "Rajeev Menon",
//       payableDays: "26/28",
//       totalEarnings: 78500,
//       totalDeductions: 4800,
//       netPay: 73700,
//     },
//     {
//       id: "7",
//       name: "Sara Ali",
//       payableDays: "28/28",
//       totalEarnings: 88000,
//       totalDeductions: 5600,
//       netPay: 82400,
//     },
//     {
//       id: "8",
//       name: "Manoj Desai",
//       payableDays: "27/28",
//       totalEarnings: 66900,
//       totalDeductions: 3700,
//       netPay: 63200,
//     },
//     {
//       id: "9",
//       name: "Nisha Rao",
//       payableDays: "28/28",
//       totalEarnings: 90000,
//       totalDeductions: 6000,
//       netPay: 84000,
//     },
//     {
//       id: "10",
//       name: "Karan Bedi",
//       payableDays: "26/28",
//       totalEarnings: 75400,
//       totalDeductions: 4900,
//       netPay: 70500,
//     },
//   ];
//   const [showInsights, setShowInsights] = useState(false);
//   const departmentStats = [
//     { department: "Engineering", employees: 5, salary: 450000, projects: 12 },
//     { department: "HR", employees: 3, salary: 180000, projects: 4 },
//     { department: "Sales", employees: 4, salary: 220000, projects: 9 },
//   ];

//   const fetchPayrollData = async (url: string, fallback: EmployeeRecord[]) => {
//     try {
//       const res = await fetch(url);
//       const json = await res.json();
//       setEmployees(json);
//     } catch (err) {
//       console.error(`${url} failed:`, err);
//       setEmployees(fallback);
//     }
//   };

//   const handleRunPayroll = () => {
//     fetchPayrollData("/api/payroll/run", dummyEmployees);
//   };

//   const handlePreviewOutput = () => {
//     fetchPayrollData("/api/payroll/preview", dummyEmployees);
//   };

//   const handleAddEmployee = () => {
//     setShowAddDialog(true);
//   };

//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 12 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.5 }}
//       className="max-w-7xl mx-auto p-4 sm:p-6 text-gray-800"
//     >
//       <div className="flex flex-wrap gap-3 mb-6">
//         {periods.map((p, idx) => (
//           <div
//             key={idx}
//             className={`px-3 py-2 text-xs rounded border text-center min-w-[110px] ${
//               p.active
//                 ? "bg-red-600 text-white font-semibold shadow-sm"
//                 : p.status === "completed"
//                   ? "bg-green-100 text-green-800"
//                   : p.status === "current"
//                     ? "bg-blue-100 text-blue-700"
//                     : "bg-gray-100 text-gray-600"
//             }`}
//           >
//             <p className="font-medium">{p.label}</p>
//             <p className="text-[11px]">{p.range}</p>
//           </div>
//         ))}
//       </div>

//       {/* Header */}
//       <div className="flex justify-between items-center mb-4">
//         <div>
//           <h1 className="text-3xl font-bold text-gray-900">Run Payroll</h1>
//           <div className="flex gap-1 mt-2">
//             {[...Array(5)].map((_, i) => (
//               <div key={i} className="w-2 h-2 bg-red-400 rounded-full"></div>
//             ))}
//           </div>
//         </div>
//         <div className="flex gap-3">
//           <Button
//             variant="outline"
//             onClick={handlePreviewOutput}
//             className="flex items-center gap-2"
//           >
//             <Eye className="w-4 h-4" /> Preview Output
//           </Button>
//           <Button
//             onClick={handleRunPayroll}
//             className="flex items-center gap-2"
//           >
//             <Play className="w-4 h-4" /> Run Payroll
//           </Button>
//         </div>
//       </div>

//       {/* Summary Card */}
//       <div
//         className="bg-white border rounded-xl p-4 shadow-sm mb-6 cursor-pointer"
//         onClick={() => setShowInsights(!showInsights)}
//       >
//         <h2 className="font-bold text-lg text-gray-900 mb-1">
//           May 2020 Payroll
//         </h2>
//         <p className="text-sm text-gray-500 mb-4">Apr 26 - May 25 (31 days)</p>

//         <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm text-gray-700">
//           <div>
//             <p className="font-semibold text-sm">Total Payroll Cost</p>
//             <p className="text-lg text-red-600 font-bold mt-1">₹1,66,90,591</p>
//           </div>
//           <div>
//             <p>Fixed Components</p>
//             <p className="font-medium">₹1,46,44,508</p>
//           </div>
//           <div>
//             <p>Variable Components</p>
//             <p className="font-medium">₹10,74,373</p>
//           </div>
//           <div>
//             <p>Reimbursements</p>
//             <p className="font-medium">₹9,60,710</p>
//           </div>
//         </div>

//         <div className="grid grid-cols-3 gap-4 mt-6 text-sm text-gray-600 border-t pt-4">
//           <div>
//             <span className="font-semibold">Calendar Days:</span> 31
//           </div>
//           <div>
//             <span className="font-semibold">Employees:</span> 240{" "}
//             <span className="text-green-500">+12</span>{" "}
//             <span className="text-red-500">-4</span>
//           </div>
//           <div>
//             <span className="font-semibold">Payroll Processed:</span> 234 / 240
//           </div>
//         </div>
//       </div>
//       {showInsights && (
//         <motion.div
//           initial={{ opacity: 0, y: 10 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.4 }}
//           className="bg-white border rounded-xl p-6 shadow-sm mb-6"
//         >
//           <h3 className="text-lg font-semibold text-gray-900 mb-4">
//             📊 Department Breakdown
//           </h3>
//           <div className="grid sm:grid-cols-2 gap-6">
//             <div className="h-64">
//               <ResponsiveContainer width="100%" height="100%">
//                 <BarChart
//                   data={departmentStats}
//                   margin={{ top: 16, right: 16, bottom: 0, left: 0 }}
//                 >
//                   <XAxis dataKey="department" />
//                   <YAxis />
//                   <Tooltip
//                     formatter={(val: number, name: string) => {
//                       if (name === "Salary Paid")
//                         return [`₹${val.toLocaleString()}`, name];
//                       return [val.toLocaleString(), name];
//                     }}
//                   />
//                   <Legend />
//                   <Bar dataKey="salary" fill="#f87171" name="Salary Paid" />
//                   <Bar
//                     dataKey="projects"
//                     fill="#60a5fa"
//                     name="Projects Completed"
//                   />
//                   <Bar dataKey="employees" fill="#34d399" name="Employees" />
//                 </BarChart>
//               </ResponsiveContainer>
//             </div>
//             <div className="h-64">
//               <ResponsiveContainer width="100%" height="100%">
//                 <PieChart>
//                   <Pie
//                     data={departmentStats}
//                     dataKey="employees"
//                     nameKey="department"
//                     cx="50%"
//                     cy="50%"
//                     outerRadius={80}
//                     label={({ name, percent }) =>
//                       `${name} ${(percent * 100).toFixed(0)}%`
//                     }
//                   >
//                     {departmentStats.map((entry, index) => (
//                       <Cell
//                         key={`cell-${index}`}
//                         fill={["#34d399", "#60a5fa", "#f87171"][index % 3]}
//                       />
//                     ))}
//                   </Pie>
//                   <Tooltip
//                     formatter={(val: number, name: string, props) => [
//                       `${val} Employees`,
//                       props.payload.department,
//                     ]}
//                   />
//                 </PieChart>
//               </ResponsiveContainer>
//             </div>
//           </div>
//         </motion.div>
//       )}

//       {/* Payroll Register Table */}
//       <Card className="bg-white mb-6">
//         <CardHeader>
//           <div className="flex justify-between items-center">
//             <CardTitle className="text-lg font-semibold text-gray-900">
//               Pay Register May 2020
//             </CardTitle>
//             <Button variant="outline" size="sm" onClick={handleAddEmployee}>
//               <Plus className="w-4 h-4" />
//             </Button>
//           </div>
//         </CardHeader>
//         <CardContent>
//           <Table>
//             <TableHeader>
//               <TableRow>
//                 <TableHead className="w-16 text-center">S.No</TableHead>
//                 <TableHead className="w-[200px]">Employee</TableHead>
//                 <TableHead className="text-center">Payable Days</TableHead>
//                 <TableHead className="text-center">Total Earnings</TableHead>
//                 <TableHead className="text-center">Total Deductions</TableHead>
//                 <TableHead className="text-center">Net Pay</TableHead>
//               </TableRow>
//             </TableHeader>
//             <TableBody>
//               {employees.map((employee: EmployeeRecord, index: number) => (
//                 <TableRow
//                   key={employee.id}
//                   className="hover:bg-gray-50 cursor-pointer"
//                   onClick={() => {
//                     setSelectedEmployee(employee);
//                     setShowPayslip(true);
//                   }}
//                 >
//                   <TableCell className="text-center font-medium">
//                     {index + 1}
//                   </TableCell>

//                   <TableCell className="font-medium">
//                     <div className="flex items-center gap-3">
//                       <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
//                         <span className="text-xs font-medium text-green-600">
//                           {employee.name
//                             .split(" ")
//                             .map((n) => n[0])
//                             .join("")}
//                         </span>
//                       </div>
//                       {employee.name}
//                     </div>
//                   </TableCell>
//                   <TableCell className="text-center">
//                     {employee.payableDays}
//                   </TableCell>
//                   <TableCell className="text-center">
//                     {formatCurrency(employee.totalEarnings)}
//                   </TableCell>
//                   <TableCell className="text-center">
//                     {formatCurrency(employee.totalDeductions)}
//                   </TableCell>
//                   <TableCell className="text-center">
//                     <Badge
//                       variant="outline"
//                       className="text-blue-600 border-blue-200"
//                     >
//                       {formatCurrency(employee.netPay)}
//                     </Badge>
//                   </TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         </CardContent>
//       </Card>

//       {/* Modules */}
//       <div className="grid sm:grid-cols-2 gap-4 mb-6">
//         {modules.map((m, i) => (
//           <Link
//             key={i}
//             href={m.href}
//             className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg shadow-sm hover:bg-red-100 transition"
//           >
//             <div className="text-red-600">{m.icon}</div>
//             <div className="text-sm text-gray-800 font-medium">{m.title}</div>
//           </Link>
//         ))}
//       </div>

//       {/* Activity Log */}
//       <div className="bg-white border rounded-xl p-4 shadow-sm">
//         <p className="text-sm font-semibold text-gray-700 mb-2">
//           📜 Activity Log
//         </p>
//         <ul className="space-y-2 text-sm text-gray-700">
//           <li>
//             <span className="font-semibold">Higashi Mako</span> ran payroll for
//             137 employees —{" "}
//             <span className="text-xs text-gray-500">Aug 31, 04:28 PM</span>
//           </li>
//           <li>
//             <span className="font-semibold">Sebastian Westergren</span> reviewed
//             salary sheets —{" "}
//             <span className="text-xs text-gray-500">Aug 31, 04:28 PM</span>
//           </li>
//         </ul>
//       </div>
//       <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
//         <DialogContent className="sm:max-w-md">
//           <DialogHeader>
//             <DialogTitle>Add New Employee</DialogTitle>
//           </DialogHeader>
//           <div className="space-y-3">
//             {[
//               "name",
//               "payableDays",
//               "totalEarnings",
//               "totalDeductions",
//               "netPay",
//             ].map((field) => (
//               <div key={field} className="flex flex-col gap-1">
//                 <label className="text-sm capitalize">
//                   {field.replace(/([A-Z])/g, " $1")}
//                 </label>
//                 <input
//                   type="text"
//                   className="border px-2 py-1 rounded text-sm"
//                   value={newEmployee[field as keyof typeof newEmployee]}
//                   onChange={(e) =>
//                     setNewEmployee({ ...newEmployee, [field]: e.target.value })
//                   }
//                 />
//               </div>
//             ))}
//           </div>
//           <div className="mt-4 flex justify-end gap-2">
//             <Button variant="outline" onClick={() => setShowAddDialog(false)}>
//               Cancel
//             </Button>
//             <Button
//               onClick={() => {
//                 setEmployees((prev) => [
//                   ...prev,
//                   {
//                     id: (prev.length + 1).toString(),
//                     name: newEmployee.name,
//                     payableDays: newEmployee.payableDays,
//                     totalEarnings: Number(newEmployee.totalEarnings),
//                     totalDeductions: Number(newEmployee.totalDeductions),
//                     netPay: Number(newEmployee.netPay),
//                   },
//                 ]);
//                 setShowAddDialog(false);
//                 setNewEmployee({
//                   name: "",
//                   payableDays: "",
//                   totalEarnings: "",
//                   totalDeductions: "",
//                   netPay: "",
//                 });
//               }}
//             >
//               Save
//             </Button>
//           </div>
//         </DialogContent>
//       </Dialog>
//       <Dialog open={showPayslip} onOpenChange={setShowPayslip}>
//         <DialogContent className="sm:max-w-6xl p-0 overflow-hidden">
//           <FunctionalPayslipPage
//   employee={{
//     id: selectedEmployee?.id || '',
//     empNo: selectedEmployee?.id || '',
//     name: selectedEmployee?.name || '',
//     department: selectedEmployee?.department || 'Engineering',
//     dateOfJoining: selectedEmployee?.dateOfJoining || 'Apr 1, 2021',
//     designation: selectedEmployee?.designation || 'Software Engineer',
//     payableDays: selectedEmployee?.payableDays || '30/30',
//     totalEarnings: selectedEmployee?.totalEarnings || 0,
//     totalDeductions: selectedEmployee?.totalDeductions || 0,
//     netPay: selectedEmployee?.netPay || 0,
//   }}
// />

//         </DialogContent>
//       </Dialog>
//     </motion.div>
//   );
// }
"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  CalendarDays,
  Users,
  CheckCircle,
  Info,
  AlertTriangle,
  FileText,
  Play,
  Eye,
  Plus,
  X,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogContent,
  DialogClose,
} from "@/components/ui/dialog";
import { formatCurrency } from "@/src/app/components/lib/utils";
import FunctionalPayslipPage from "@/src/app/components/FunctionalPayslipPage";

interface EmployeeRecord {
  id: string;
  name: string;
  payableDays: string;
  totalEarnings: number;
  totalDeductions: number;
  netPay: number;
  department?: string;
  dateOfJoining?: string;
  designation?: string;
}

const periods = [
  { label: "Apr 2020", range: "MAR 26 - APR 25", status: "completed" },
  {
    label: "May 2020",
    range: "APR 26 - MAY 25",
    status: "completed",
    active: true,
  },
  { label: "Jun 2020", range: "MAY 26 - JUN 25", status: "completed" },
  { label: "Jul 2020", range: "JUN 26 - JUL 25", status: "completed" },
  { label: "Aug 2020", range: "JUL 26 - AUG 25", status: "current" },
  { label: "Sep 2020", range: "AUG 26 - SEP 25", status: "upcoming" },
  { label: "Oct 2020", range: "SEP 26 - OCT 25", status: "upcoming" },
];

const modules = [
  {
    title: "Leave, attendance & daily wages",
    href: "/hr/payroll/leave-deductions",
    icon: <CalendarDays size={18} />,
  },
  {
    title: "New joinees & exits",
    href: "/hr/payroll/joinees-exit",
    icon: <Users size={18} />,
  },
  {
    title: "Bonus, salary revisions & overtime",
    href: "/hr/payroll/bonuses-revisions",
    icon: <FileText size={18} />,
  },
  {
    title: "Reimbursement, adhoc payments, deductions",
    href: "/hr/payroll/adhoc-expenses",
    icon: <Info size={18} />,
  },
  {
    title: "Arrears & dues",
    href: "/hr/payroll/arrears-dues",
    icon: <AlertTriangle size={18} />,
  },
  {
    title: "Review all employees",
    href: "/hr/payroll/review-all-employees",
    icon: <CheckCircle size={18} />,
  },
];

export default function PayrollPage() {
  const [showPayslip, setShowPayslip] = useState(false);
  const [selectedEmployee, setSelectedEmployee] =
    useState<EmployeeRecord | null>(null);
  const [employees, setEmployees] = useState<EmployeeRecord[]>([
  {
    id: "1",
    name: "Frank Smith",
    payableDays: "25/28",
    totalEarnings: 64532,
    totalDeductions: 3850,
    netPay: 60682,
    department: "Engineering",
    dateOfJoining: "Sep 12, 2017",
    designation: "Sr. UX Designer",
  },
  {
    id: "2",
    name: "San Joseph",
    payableDays: "26/28",
    totalEarnings: 72580,
    totalDeductions: 4780,
    netPay: 67800,
    department: "Sales",
    dateOfJoining: "Mar 15, 2018",
    designation: "Sales Manager",
  },
]);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newEmployee, setNewEmployee] = useState({
    name: "",
    payableDays: "",
    totalEarnings: "",
    totalDeductions: "",
    netPay: "",
  });

  const dummyEmployees: EmployeeRecord[] = [
    {
      id: "1",
      name: "Frank Smith",
      payableDays: "25/28",
      totalEarnings: 64532,
      totalDeductions: 3850,
      netPay: 60682,
    },
    {
      id: "2",
      name: "San Joseph",
      payableDays: "26/28",
      totalEarnings: 72580,
      totalDeductions: 4780,
      netPay: 67800,
    },
    {
      id: "3",
      name: "Ami Patel",
      payableDays: "28/28",
      totalEarnings: 80000,
      totalDeductions: 5000,
      netPay: 75000,
    },
    {
      id: "4",
      name: "John Doe",
      payableDays: "27/28",
      totalEarnings: 70000,
      totalDeductions: 4000,
      netPay: 66000,
    },
    {
      id: "5",
      name: "Meera Nair",
      payableDays: "28/28",
      totalEarnings: 92400,
      totalDeductions: 6200,
      netPay: 86200,
    },
    {
      id: "6",
      name: "Rajeev Menon",
      payableDays: "26/28",
      totalEarnings: 78500,
      totalDeductions: 4800,
      netPay: 73700,
    },
    {
      id: "7",
      name: "Sara Ali",
      payableDays: "28/28",
      totalEarnings: 88000,
      totalDeductions: 5600,
      netPay: 82400,
    },
    {
      id: "8",
      name: "Manoj Desai",
      payableDays: "27/28",
      totalEarnings: 66900,
      totalDeductions: 3700,
      netPay: 63200,
    },
    {
      id: "9",
      name: "Nisha Rao",
      payableDays: "28/28",
      totalEarnings: 90000,
      totalDeductions: 6000,
      netPay: 84000,
    },
    {
      id: "10",
      name: "Karan Bedi",
      payableDays: "26/28",
      totalEarnings: 75400,
      totalDeductions: 4900,
      netPay: 70500,
    },
  ];
  const [showInsights, setShowInsights] = useState(false);
  const departmentStats = [
    { department: "Engineering", employees: 5, salary: 450000, projects: 12 },
    { department: "HR", employees: 3, salary: 180000, projects: 4 },
    { department: "Sales", employees: 4, salary: 220000, projects: 9 },
  ];

  const fetchPayrollData = async (url: string, fallback: EmployeeRecord[]) => {
    try {
      const res = await fetch(url);
      const json = await res.json();
      setEmployees(json);
    } catch (err) {
      console.error(`${url} failed:`, err);
      setEmployees(fallback);
    }
  };

  const handleRunPayroll = () => {
    fetchPayrollData("/api/payroll/run", dummyEmployees);
  };

  const handlePreviewOutput = () => {
    fetchPayrollData("/api/payroll/preview", dummyEmployees);
  };

  const handleAddEmployee = () => {
    setShowAddDialog(true);
  };

  // Fixed: Properly handle payslip dialog closing
  const handlePayslipClose = () => {
    setShowPayslip(false);
    setSelectedEmployee(null);
  };

  // Fixed: Properly handle add dialog closing
  const handleAddDialogClose = () => {
    setShowAddDialog(false);
    setNewEmployee({
      name: "",
      payableDays: "",
      totalEarnings: "",
      totalDeductions: "",
      netPay: "",
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-7xl mx-auto p-4 sm:p-6 text-gray-800"
    >
      <div className="flex flex-wrap gap-3 mb-6">
        {periods.map((p, idx) => (
          <div
            key={idx}
            className={`px-3 py-2 text-xs rounded border text-center min-w-[110px] ${
              p.active
                ? "bg-red-600 text-white font-semibold shadow-sm"
                : p.status === "completed"
                  ? "bg-green-100 text-green-800"
                  : p.status === "current"
                    ? "bg-blue-100 text-blue-700"
                    : "bg-gray-100 text-gray-600"
            }`}
          >
            <p className="font-medium">{p.label}</p>
            <p className="text-[11px]">{p.range}</p>
          </div>
        ))}
      </div>

      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Run Payroll</h1>
          <div className="flex gap-1 mt-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="w-2 h-2 bg-red-400 rounded-full"></div>
            ))}
          </div>
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={handlePreviewOutput}
            className="flex items-center gap-2"
          >
            <Eye className="w-4 h-4" /> Preview Output
          </Button>
          <Button
            onClick={handleRunPayroll}
            className="flex items-center gap-2"
          >
            <Play className="w-4 h-4" /> Run Payroll
          </Button>
        </div>
      </div>

      {/* Summary Card */}
      <div
        className="bg-white border rounded-xl p-4 shadow-sm mb-6 cursor-pointer"
        onClick={() => setShowInsights(!showInsights)}
      >
        <h2 className="font-bold text-lg text-gray-900 mb-1">
          May 2020 Payroll
        </h2>
        <p className="text-sm text-gray-500 mb-4">Apr 26 - May 25 (31 days)</p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm text-gray-700">
          <div>
            <p className="font-semibold text-sm">Total Payroll Cost</p>
            <p className="text-lg text-red-600 font-bold mt-1">₹1,66,90,591</p>
          </div>
          <div>
            <p>Fixed Components</p>
            <p className="font-medium">₹1,46,44,508</p>
          </div>
          <div>
            <p>Variable Components</p>
            <p className="font-medium">₹10,74,373</p>
          </div>
          <div>
            <p>Reimbursements</p>
            <p className="font-medium">₹9,60,710</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mt-6 text-sm text-gray-600 border-t pt-4">
          <div>
            <span className="font-semibold">Calendar Days:</span> 31
          </div>
          <div>
            <span className="font-semibold">Employees:</span> 240{" "}
            <span className="text-green-500">+12</span>{" "}
            <span className="text-red-500">-4</span>
          </div>
          <div>
            <span className="font-semibold">Payroll Processed:</span> 234 / 240
          </div>
        </div>
      </div>
      {showInsights && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-white border rounded-xl p-6 shadow-sm mb-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            📊 Department Breakdown
          </h3>
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={departmentStats}
                  margin={{ top: 16, right: 16, bottom: 0, left: 0 }}
                >
                  <XAxis dataKey="department" />
                  <YAxis />
                  <Tooltip
                    formatter={(val: number, name: string) => {
                      if (name === "Salary Paid")
                        return [`₹${val.toLocaleString()}`, name];
                      return [val.toLocaleString(), name];
                    }}
                  />
                  <Legend />
                  <Bar dataKey="salary" fill="#f87171" name="Salary Paid" />
                  <Bar
                    dataKey="projects"
                    fill="#60a5fa"
                    name="Projects Completed"
                  />
                  <Bar dataKey="employees" fill="#34d399" name="Employees" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={departmentStats}
                    dataKey="employees"
                    nameKey="department"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                  >
                    {departmentStats.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={["#34d399", "#60a5fa", "#f87171"][index % 3]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(val: number, name: string, props) => [
                      `${val} Employees`,
                      props.payload.department,
                    ]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </motion.div>
      )}

      {/* Payroll Register Table */}
      <Card className="bg-white mb-6">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg font-semibold text-gray-900">
              Pay Register May 2020
            </CardTitle>
            <Button variant="outline" size="sm" onClick={handleAddEmployee}>
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-16 text-center">S.No</TableHead>
                <TableHead className="w-[200px]">Employee</TableHead>
                <TableHead className="text-center">Payable Days</TableHead>
                <TableHead className="text-center">Total Earnings</TableHead>
                <TableHead className="text-center">Total Deductions</TableHead>
                <TableHead className="text-center">Net Pay</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {employees.map((employee: EmployeeRecord, index: number) => (
                <TableRow
                  key={employee.id}
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() => {
                    setSelectedEmployee(employee);
                    setShowPayslip(true);
                  }}
                >
                  <TableCell className="text-center font-medium">
                    {index + 1}
                  </TableCell>

                  <TableCell className="font-medium">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                        <span className="text-xs font-medium text-green-600">
                          {employee.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </span>
                      </div>
                      {employee.name}
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    {employee.payableDays}
                  </TableCell>
                  <TableCell className="text-center">
                    {formatCurrency(employee.totalEarnings)}
                  </TableCell>
                  <TableCell className="text-center">
                    {formatCurrency(employee.totalDeductions)}
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge
                      variant="outline"
                      className="text-blue-600 border-blue-200"
                    >
                      {formatCurrency(employee.netPay)}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Modules */}
      <div className="grid sm:grid-cols-2 gap-4 mb-6">
        {modules.map((m, i) => (
          <Link
            key={i}
            href={m.href}
            className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg shadow-sm hover:bg-red-100 transition"
          >
            <div className="text-red-600">{m.icon}</div>
            <div className="text-sm text-gray-800 font-medium">{m.title}</div>
          </Link>
        ))}
      </div>

      {/* Activity Log */}
      <div className="bg-white border rounded-xl p-4 shadow-sm">
        <p className="text-sm font-semibold text-gray-700 mb-2">
          📜 Activity Log
        </p>
        <ul className="space-y-2 text-sm text-gray-700">
          <li>
            <span className="font-semibold">Higashi Mako</span> ran payroll for
            137 employees —{" "}
            <span className="text-xs text-gray-500">Aug 31, 04:28 PM</span>
          </li>
          <li>
            <span className="font-semibold">Sebastian Westergren</span> reviewed
            salary sheets —{" "}
            <span className="text-xs text-gray-500">Aug 31, 04:28 PM</span>
          </li>
        </ul>
      </div>

      {/* Fixed: Add Employee Dialog */}
      <Dialog open={showAddDialog} onOpenChange={handleAddDialogClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Employee</DialogTitle>
            <DialogClose asChild>
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
                onClick={handleAddDialogClose}
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Close</span>
              </Button>
            </DialogClose>
          </DialogHeader>
          <div className="space-y-3">
            {[
              "name",
              "payableDays",
              "totalEarnings",
              "totalDeductions",
              "netPay",
            ].map((field) => (
              <div key={field} className="flex flex-col gap-1">
                <label className="text-sm capitalize">
                  {field.replace(/([A-Z])/g, " $1")}
                </label>
                <input
                  type="text"
                  className="border px-2 py-1 rounded text-sm"
                  value={newEmployee[field as keyof typeof newEmployee]}
                  onChange={(e) =>
                    setNewEmployee({ ...newEmployee, [field]: e.target.value })
                  }
                />
              </div>
            ))}
          </div>
          <div className="mt-4 flex justify-end gap-2">
            <Button variant="outline" onClick={handleAddDialogClose}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                setEmployees((prev) => [
                  ...prev,
                  {
                    id: (prev.length + 1).toString(),
                    name: newEmployee.name,
                    payableDays: newEmployee.payableDays,
                    totalEarnings: Number(newEmployee.totalEarnings),
                    totalDeductions: Number(newEmployee.totalDeductions),
                    netPay: Number(newEmployee.netPay),
                  },
                ]);
                handleAddDialogClose();
              }}
            >
              Save
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Fixed: Payslip Dialog */}
     <Dialog open={showPayslip} onOpenChange={setShowPayslip}> {/* Simplified onOpenChange */}
  <DialogContent
    className="sm:max-w-4xl max-h-[90vh] p-0 flex justify-center items-center"
    style={{ zIndex: 1000 }}
  >
    <div className="w-full h-full flex justify-center items-center">
      <div className="w-full max-w-3xl p-4 bg-transparent"> {/* Removed bg-white, reduced padding */}
        <DialogHeader className="flex-shrink-0 px-4 py-2 border-b">
          <DialogTitle>Employee Payslip</DialogTitle>
          <DialogClose asChild>
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-2 top-2 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
              onClick={handlePayslipClose}
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </Button>
          </DialogClose>
        </DialogHeader>
        <div className="overflow-auto max-h-[calc(90vh-60px)] bg-white rounded-b-lg"> {/* Moved bg-white here, adjusted height */}
          {selectedEmployee && (
            <FunctionalPayslipPage
              employee={{
                id: selectedEmployee.id,
                empNo: selectedEmployee.id,
                name: selectedEmployee.name,
                department: selectedEmployee.department || "Engineering",
                dateOfJoining: selectedEmployee.dateOfJoining || "Apr 1, 2021",
                designation: selectedEmployee.designation || "Software Engineer",
                payableDays: selectedEmployee.payableDays,
                totalEarnings: selectedEmployee.totalEarnings,
                totalDeductions: selectedEmployee.totalDeductions,
                netPay: selectedEmployee.netPay,
              }}
            />
          )}
        </div>
      </div>
    </div>
  </DialogContent>
</Dialog>
    </motion.div>
  );
}
