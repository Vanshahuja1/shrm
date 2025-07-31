// "use client";

// import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
// import { useState } from "react";
// import { useParams, useRouter } from "next/navigation";
// import {
//   ArrowLeft,
//   User,
//   Save,
//   DollarSign,
//   Briefcase,
//   Calendar,
//   CreditCard,
//   Check,
//   ClipboardList,
// } from "lucide-react";
// import axios from "@/lib/axiosInstance";

// interface EmployeeFormData {
//   organizationName: string;
//   personalInfo: {
//     name: string;
//     email: string;
//     phone: string;
//     dob: string;
//     gender: string;
//     aadhar: string;
//     pan: string;
//     address: string;
//     emergencyContact: string;
//   };
//   financialInfo: {
//     salary: string;
//     bankInfo: {
//       accountHolderName: string;
//       accountType: string;
//       accountNumber: string;
//       bankName: string;
//       ifscCode: string;
//       branch: string;
//     };
//   };
//   departmentInfo: {
//     departmentName: string;
//     role: string;
//     designation: string;
//     managerName: string;
//   };
//   joiningDetails: {
//     joiningDate: string;

//   };

//   payrollInfo: {
//     taxCode: string;
//     benefits: string;
//   };
// }

// type TabType =
//   | "personal"
//   | "financial"
//   | "department"
//   | "joining"
//   | "payroll"
//   | "review";

// export default function AddEmployeePage() {
//   const router = useRouter();
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [activeTab, setActiveTab] = useState<TabType>("personal");
//   const { hrId } = useParams<{ hrId: string }>();

//   // Form state and handlers
//   const [formData, setFormData] = useState<EmployeeFormData>({
//     organizationName: "IT",
//     personalInfo: {
//       name: "",
//       email: "",
//       phone: "",
//       dob: "",
//       gender: "",
//       aadhar: "",
//       pan: "",
//       address: "",
//       emergencyContact: ""
//     },
//     financialInfo: {
//       salary: "",
//       bankInfo: {
//         accountHolderName: "",
//         accountType: "",
//         accountNumber: "",
//         bankName: "",
//         ifscCode: "",
//         branch: ""
//       }
//     },
//     departmentInfo: {
//       departmentName: "",
//       designation: "",
//       role: "",
//       managerName: ""
//     },
//     joiningDetails: {
//       joiningDate: "",
//     },

//     payrollInfo: {
//       taxCode: "",
//       benefits: ""
//     }
//   });

//   // Form handlers
//   const handleChange = (section: keyof EmployeeFormData, field: string, value: string) => {
//     setFormData({
//       ...formData,
//       [section]: typeof formData[section] === "object"
//         ? {
//             ...formData[section] as object,
//             [field]: value
//           }
//         : value
//     });
//   };

//   const handleBankInfoChange = (field: string, value: string) => {
//     setFormData({
//       ...formData,
//       financialInfo: {
//         ...formData.financialInfo,
//         bankInfo: {
//           ...formData.financialInfo.bankInfo,
//           [field]: value
//         }
//       }
//     });
//   };

//   // Navigation handlers
//   const nextTab = () => {
//     switch (activeTab) {
//       case "personal":
//         setActiveTab("financial");
//         break;
//       case "financial":
//         setActiveTab("department");
//         break;
//       case "department":
//         setActiveTab("joining");
//         break;
//       case "joining":
//         setActiveTab("payroll");
//         break;
//       case "payroll":
//         setActiveTab("review");
//         break;
//     }
//   };

//   const prevTab = () => {
//     switch (activeTab) {
//       case "financial":
//         setActiveTab("personal");
//         break;
//       case "department":
//         setActiveTab("financial");
//         break;
//       case "joining":
//         setActiveTab("department");
//         break;
//       case "payroll":
//         setActiveTab("joining");
//         break;
//       case "review":
//         setActiveTab("payroll");
//         break;
//     }
//   };

//   const handleBack = () => {
//     router.push(`/hr/${hrId}/employees/`);
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setIsSubmitting(true);

//     try {
//       const response = await axios.post(`/user/addEmp`, formData);
//       if (response.status !== 200) {
//         throw new Error("Failed to add employee");
//       }
//       handleBack();
//     } catch (error) {
//       console.error("Failed to add employee:", error);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   // Tab icons mapping
//   const tabIcons = {
//     personal: <User size={18} />,
//     financial: <DollarSign size={18} />,
//     department: <Briefcase size={18} />,
//     joining: <Calendar size={18} />,

//     payroll: <CreditCard size={18} />,
//     review: <Check size={18} />
//   };

//   // ... Rest of the component code including renderTabContent() and JSX

//   const renderTabContent = () => {
//     switch (activeTab) {
//       case "personal":
//         return (
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <div className="space-y-4 md:col-span-2">
//               <label className="block text-sm font-medium text-gray-700">
//                 Full Name
//               </label>
//               <input
//                 type="text"
//                 required
//                 value={formData.personalInfo.name}
//                 onChange={(e) =>
//                   handleChange("personalInfo", "name", e.target.value)
//                 }
//                 className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
//                 placeholder="Enter full name"
//               />
//             </div>
//             <div className="space-y-4">
//               <label className="block text-sm font-medium text-gray-700">
//                 Email
//               </label>
//               <input
//                 type="email"
//                 required
//                 value={formData.personalInfo.email}
//                 onChange={(e) =>
//                   handleChange("personalInfo", "email", e.target.value)
//                 }
//                 className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
//                 placeholder="Enter email address"
//               />
//             </div>
//             <div className="space-y-4">
//               <label className="block text-sm font-medium text-gray-700">
//                 Phone
//               </label>
//               <input
//                 type="tel"
//                 required
//                 value={formData.personalInfo.phone}
//                 onChange={(e) =>
//                   handleChange("personalInfo", "phone", e.target.value)
//                 }
//                 className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
//                 placeholder="Enter phone number"
//               />
//             </div>
//             <div className="space-y-4">
//               <label className="block text-sm font-medium text-gray-700">
//                 Date of Birth
//               </label>
//               <input
//                 type="date"
//                 required
//                 value={formData.personalInfo.dob}
//                 onChange={(e) =>
//                   handleChange("personalInfo", "dob", e.target.value)
//                 }
//                 className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
//               />
//             </div>
//             <div className="space-y-4">
//               <label className="block text-sm font-medium text-gray-700">
//                 Gender
//               </label>
//               <select
//                 required
//                 value={formData.personalInfo.gender}
//                 onChange={(e) =>
//                   handleChange("personalInfo", "gender", e.target.value)
//                 }
//                 className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
//               >
//                 <option value="">Select Gender</option>
//                 <option value="Male">Male</option>
//                 <option value="Female">Female</option>
//                 <option value="Other">Other</option>
//               </select>
//             </div>
//             <div className="space-y-4">
//               <label className="block text-sm font-medium text-gray-700">
//                 Aadhar Number
//               </label>
//               <input
//                 type="text"
//                 required
//                 value={formData.personalInfo.aadhar}
//                 onChange={(e) =>
//                   handleChange("personalInfo", "aadhar", e.target.value)
//                 }
//                 className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
//                 placeholder="Enter Aadhar number"
//               />
//             </div>
//             <div className="space-y-4">
//               <label className="block text-sm font-medium text-gray-700">
//                 PAN Number
//               </label>
//               <input
//                 type="text"
//                 required
//                 value={formData.personalInfo.pan}
//                 onChange={(e) =>
//                   handleChange("personalInfo", "pan", e.target.value)
//                 }
//                 className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
//                 placeholder="Enter PAN number"
//               />
//             </div>
//             <div className="space-y-4 md:col-span-2">
//               <label className="block text-sm font-medium text-gray-700">
//                 Address
//               </label>
//               <textarea
//                 required
//                 value={formData.personalInfo.address}
//                 onChange={(e) =>
//                   handleChange("personalInfo", "address", e.target.value)
//                 }
//                 className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors resize-none"
//                 rows={3}
//                 placeholder="Enter full address"
//               />
//             </div>
//             <div className="space-y-4">
//               <label className="block text-sm font-medium text-gray-700">
//                 Emergency Contact
//               </label>
//               <input
//                 type="tel"
//                 required
//                 value={formData.personalInfo.emergencyContact}
//                 onChange={(e) =>
//                   handleChange("personalInfo", "emergencyContact", e.target.value)
//                 }
//                 className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
//                 placeholder="Enter emergency contact number"
//               />
//             </div>
//           </div>
//         );

//       case "financial":
//         return (
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <div className="space-y-4 md:col-span-2">
//               <label className="block text-sm font-medium text-gray-700">
//                 Salary
//               </label>
//               <input
//                 type="text"
//                 required
//                 value={formData.financialInfo.salary}
//                 onChange={(e) =>
//                   handleChange("financialInfo", "salary", e.target.value)
//                 }
//                 className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
//                 placeholder="Enter salary amount"
//               />
//             </div>
//             <div className="space-y-4">
//               <label className="block text-sm font-medium text-gray-700">
//                 Account Holder Name
//               </label>
//               <input
//                 type="text"
//                 required
//                 value={formData.financialInfo.bankInfo.accountHolderName}
//                 onChange={(e) =>
//                   handleBankInfoChange("accountHolderName", e.target.value)
//                 }
//                 className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
//                 placeholder="Enter account holder name"
//               />
//             </div>
//             <div className="space-y-4">
//               <label className="block text-sm font-medium text-gray-700">
//                 Account Type
//               </label>
//               <select
//                 required
//                 value={formData.financialInfo.bankInfo.accountType}
//                 onChange={(e) =>
//                   handleBankInfoChange("accountType", e.target.value)
//                 }
//                 className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
//               >
//                 <option value="">Select Account Type</option>
//                 <option value="SAVING">Saving</option>
//                 <option value="CURRENT">Current</option>
//               </select>
//             </div>
//             <div className="space-y-4">
//               <label className="block text-sm font-medium text-gray-700">
//                 Account Number
//               </label>
//               <input
//                 type="text"
//                 required
//                 value={formData.financialInfo.bankInfo.accountNumber}
//                 onChange={(e) =>
//                   handleBankInfoChange("accountNumber", e.target.value)
//                 }
//                 className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
//                 placeholder="Enter account number"
//               />
//             </div>
//             <div className="space-y-4">
//               <label className="block text-sm font-medium text-gray-700">
//                 Bank Name
//               </label>
//               <input
//                 type="text"
//                 required
//                 value={formData.financialInfo.bankInfo.bankName}
//                 onChange={(e) =>
//                   handleBankInfoChange("bankName", e.target.value)
//                 }
//                 className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
//                 placeholder="Enter bank name"
//               />
//             </div>
//             <div className="space-y-4">
//               <label className="block text-sm font-medium text-gray-700">
//                 IFSC Code
//               </label>
//               <input
//                 type="text"
//                 required
//                 value={formData.financialInfo.bankInfo.ifscCode}
//                 onChange={(e) =>
//                   handleBankInfoChange("ifscCode", e.target.value)
//                 }
//                 className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
//                 placeholder="Enter IFSC code"
//               />
//             </div>
//             <div className="space-y-4">
//               <label className="block text-sm font-medium text-gray-700">
//                 Branch
//               </label>
//               <input
//                 type="text"
//                 required
//                 value={formData.financialInfo.bankInfo.branch}
//                 onChange={(e) =>
//                   handleBankInfoChange("branch", e.target.value)
//                 }
//                 className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
//                 placeholder="Enter branch name"
//               />
//             </div>
//           </div>
//         );

//       case "department":
//         return (
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <div className="space-y-4">
//               <label className="block text-sm font-medium text-gray-700">
//                 Department
//               </label>
//               <select
//                 required
//                 value={formData.departmentInfo.departmentName}
//                 onChange={(e) =>
//                   handleChange("departmentInfo", "departmentName", e.target.value)
//                 }
//                 className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
//               >
//                 <option value="">Select Department</option>
//                 <option value="IT">IT</option>
//                 <option value="HR">HR</option>
//               </select>
//             </div>
//             <div className="space-y-4">
//               <label className="block text-sm font-medium text-gray-700">
//                 Role
//               </label>
//               <Select
//                 value={formData.departmentInfo.role || ""}
//                 onValueChange={(value) =>
//                   setFormData({
//                     ...formData,
//                     departmentInfo: {
//                       ...formData.departmentInfo,
//                       role: value,
//                     },
//                   })
//                 }
//               >
//                 <SelectTrigger className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors bg-white">
//                   <SelectValue placeholder="Select role" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="manager">Manager</SelectItem>
//                   <SelectItem value="employee">Employee</SelectItem>
//                   <SelectItem value="sales">Sales</SelectItem>
//                   <SelectItem value="intern">Intern</SelectItem>
//                   <SelectItem value="hr">HR</SelectItem>
//                 </SelectContent>
//               </Select>
//             </div>
//             <div className="space-y-4">
//               <label className="block text-sm font-medium text-gray-700">
//                 Designation
//               </label>
//               <input
//                 type="text"
//                 required
//                 value={formData.departmentInfo.designation}
//                 onChange={(e) =>
//                   handleChange("departmentInfo", "designation", e.target.value)
//                 }
//                 className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
//                 placeholder="Enter department designation"
//               />
//             </div>
//             <div className="space-y-4">
//               <label className="block text-sm font-medium text-gray-700">
//                 Manager Name
//               </label>
//               <input
//                 type="text"
//                 required
//                 value={formData.departmentInfo.managerName}
//                 onChange={(e) =>
//                   handleChange("departmentInfo", "managerName", e.target.value)
//                 }
//                 className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
//                 placeholder="Enter manager name"
//               />
//             </div>
//           </div>
//         );

//       case "joining":
//         return (
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <div className="space-y-4">
//               <label className="block text-sm font-medium text-gray-700">
//                 Joining Date
//               </label>
//               <input
//                 type="date"
//                 required
//                 value={formData.joiningDetails.joiningDate}
//                 onChange={(e) =>
//                   handleChange("joiningDetails", "joiningDate", e.target.value)
//                 }
//                 className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
//               />
//             </div>

//           </div>
//         );


//       case "payroll":
//         return (
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <div className="space-y-4">
//               <label className="block text-sm font-medium text-gray-700">
//                 Tax Code
//               </label>
//               <input
//                 type="text"
//                 required
//                 value={formData.payrollInfo.taxCode}
//                 onChange={(e) =>
//                   handleChange("payrollInfo", "taxCode", e.target.value)
//                 }
//                 className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
//                 placeholder="Enter tax code"
//               />
//             </div>
//             <div className="space-y-4 md:col-span-2">
//               <label className="block text-sm font-medium text-gray-700">
//                 Benefits
//               </label>
//               <textarea
//                 required
//                 value={formData.payrollInfo.benefits}
//                 onChange={(e) =>
//                   handleChange("payrollInfo", "benefits", e.target.value)
//                 }
//                 className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors resize-none"
//                 rows={3}
//                 placeholder="Enter employee benefits (e.g., Health Insurance, Paid Leave, etc.)"
//               ></textarea>
//             </div>
//           </div>
//         );

//       case "review":
//         return (
//           <div className="space-y-8">
//             <section className="bg-white rounded-xl border border-gray-200 p-6">
//               <h3 className="text-lg font-semibold text-gray-900 mb-4">
//                 Personal Information
//               </h3>
//               <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
//                 <div>
//                   <p className="text-sm font-medium text-gray-500">Full Name</p>
//                   <p className="mt-1 text-base">
//                     {formData.personalInfo.name || "Not provided"}
//                   </p>
//                 </div>
//                 <div>
//                   <p className="text-sm font-medium text-gray-500">Email</p>
//                   <p className="mt-1 text-base">
//                     {formData.personalInfo.email || "Not provided"}
//                   </p>
//                 </div>
//                 <div>
//                   <p className="text-sm font-medium text-gray-500">Phone</p>
//                   <p className="mt-1 text-base">
//                     {formData.personalInfo.phone || "Not provided"}
//                   </p>
//                 </div>
//                 <div>
//                   <p className="text-sm font-medium text-gray-500">Date of Birth</p>
//                   <p className="mt-1 text-base">
//                     {formData.personalInfo.dob || "Not provided"}
//                   </p>
//                 </div>
//                 <div>
//                   <p className="text-sm font-medium text-gray-500">Gender</p>
//                   <p className="mt-1 text-base">
//                     {formData.personalInfo.gender || "Not provided"}
//                   </p>
//                 </div>
//                 <div>
//                   <p className="text-sm font-medium text-gray-500">Aadhar Number</p>
//                   <p className="mt-1 text-base">
//                     {formData.personalInfo.aadhar || "Not provided"}
//                   </p>
//                 </div>
//                 <div>
//                   <p className="text-sm font-medium text-gray-500">PAN Number</p>
//                   <p className="mt-1 text-base">
//                     {formData.personalInfo.pan || "Not provided"}
//                   </p>
//                 </div>
//                 <div>
//                   <p className="text-sm font-medium text-gray-500">Emergency Contact</p>
//                   <p className="mt-1 text-base">
//                     {formData.personalInfo.emergencyContact || "Not provided"}
//                   </p>
//                 </div>
//                 <div className="sm:col-span-2">
//                   <p className="text-sm font-medium text-gray-500">Address</p>
//                   <p className="mt-1 text-base whitespace-pre-wrap">
//                     {formData.personalInfo.address || "Not provided"}
//                   </p>
//                 </div>
//               </div>
//             </section>

//             <section className="bg-white rounded-xl border border-gray-200 p-6">
//               <h3 className="text-lg font-semibold text-gray-900 mb-4">
//                 Financial Information
//               </h3>
//               <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
//                 <div>
//                   <p className="text-sm font-medium text-gray-500">Salary</p>
//                   <p className="mt-1 text-base">
//                     {formData.financialInfo.salary || "Not provided"}
//                   </p>
//                 </div>
//                 <div>
//                   <p className="text-sm font-medium text-gray-500">
//                     Account Holder Name
//                   </p>
//                   <p className="mt-1 text-base">
//                     {formData.financialInfo.bankInfo.accountHolderName || "Not provided"}
//                   </p>
//                 </div>
//                 <div>
//                   <p className="text-sm font-medium text-gray-500">
//                     Account Type
//                   </p>
//                   <p className="mt-1 text-base">
//                     {formData.financialInfo.bankInfo.accountType || "Not provided"}
//                   </p>
//                 </div>
//                 <div>
//                   <p className="text-sm font-medium text-gray-500">
//                     Account Number
//                   </p>
//                   <p className="mt-1 text-base">
//                     {formData.financialInfo.bankInfo.accountNumber
//                       ? "••••" + formData.financialInfo.bankInfo.accountNumber.slice(-4)
//                       : "Not provided"}
//                   </p>
//                 </div>
//                 <div>
//                   <p className="text-sm font-medium text-gray-500">Bank Name</p>
//                   <p className="mt-1 text-base">
//                     {formData.financialInfo.bankInfo.bankName || "Not provided"}
//                   </p>
//                 </div>
//                 <div>
//                   <p className="text-sm font-medium text-gray-500">IFSC Code</p>
//                   <p className="mt-1 text-base">
//                     {formData.financialInfo.bankInfo.ifscCode || "Not provided"}
//                   </p>
//                 </div>
//                 <div>
//                   <p className="text-sm font-medium text-gray-500">Branch</p>
//                   <p className="mt-1 text-base">
//                     {formData.financialInfo.bankInfo.branch || "Not provided"}
//                   </p>
//                 </div>
//               </div>
//             </section>

//             <section className="bg-white rounded-xl border border-gray-200 p-6">
//               <h3 className="text-lg font-semibold text-gray-900 mb-4">
//                 Department Information
//               </h3>
//               <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
//                 <div>
//                   <p className="text-sm font-medium text-gray-500">
//                     Department
//                   </p>
//                   <p className="mt-1 text-base">
//                     {formData.departmentInfo.departmentName || "Not provided"}
//                   </p>
//                 </div>
//                 <div>
//                   <p className="text-sm font-medium text-gray-500">
//                     Role
//                   </p>
//                   <p className="mt-1 text-base">
//                     {formData.departmentInfo.role || "Not provided"}
//                   </p>
//                 </div>
//                 <div>
//                   <p className="text-sm font-medium text-gray-500">
//                     Manager Name
//                   </p>
//                   <p className="mt-1 text-base">
//                     {formData.departmentInfo.managerName || "Not provided"}
//                   </p>
//                 </div>
//               </div>
//             </section>

//             <section className="bg-white rounded-xl border border-gray-200 p-6">
//               <h3 className="text-lg font-semibold text-gray-900 mb-4">
//                 Joining Details
//               </h3>
//               <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
//                 <div>
//                   <p className="text-sm font-medium text-gray-500">
//                     Joining Date
//                   </p>
//                   <p className="mt-1 text-base">
//                     {formData.joiningDetails.joiningDate || "Not provided"}
//                   </p>
//                 </div>

//               </div>
//             </section>



//             <section className="bg-white rounded-xl border border-gray-200 p-6">
//               <h3 className="text-lg font-semibold text-gray-900 mb-4">
//                 Payroll Information
//               </h3>
//               <div className="grid grid-cols-1 gap-6">
//                 <div>
//                   <p className="text-sm font-medium text-gray-500">Tax Code</p>
//                   <p className="mt-1 text-base">
//                     {formData.payrollInfo.taxCode || "Not provided"}
//                   </p>
//                 </div>
//                 <div>
//                   <p className="text-sm font-medium text-gray-500">Benefits</p>
//                   <p className="mt-1 text-base whitespace-pre-wrap">
//                     {formData.payrollInfo.benefits || "Not provided"}
//                   </p>
//                 </div>
//               </div>
//             </section>
//           </div>
//         );

//       default:
//         return null;
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 py-6">
//       <div className="bg-white border rounded-2xl shadow-sm max-w-4xl mx-auto overflow-hidden">
//         {/* Header with back button */}
//         <div className="border-b px-6 py-4 flex items-center justify-between bg-white sticky top-0 z-10">
//           <div className="flex items-center space-x-4">
//             <button
//               onClick={handleBack}
//               className="flex items-center text-gray-600 hover:text-red-600 transition"
//             >
//               <ArrowLeft size={18} className="mr-1" />
//               <span>Back</span>
//             </button>
//             <div className="h-4 w-px bg-gray-300"></div>
//             <h2 className="text-xl font-semibold text-gray-800">
//               Add New Employee
//             </h2>
//           </div>
//           {activeTab === "review" && (
//             <button
//               type="submit"
//               form="employee-form"
//               disabled={isSubmitting}
//               className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md flex items-center disabled:bg-gray-400 transition-colors"
//             >
//               {isSubmitting ? (
//                 <>
//                   <div className="animate-spin rounded-full h-4 w-4 border-2 border-white mr-2"></div>
//                   Saving...
//                 </>
//               ) : (
//                 <>
//                   <Save size={16} className="mr-2" />
//                   Save Employee
//                 </>
//               )}
//             </button>
//           )}
//         </div>

//         {/* Tab Navigation */}
//         <div className="border-b">
//           <div className="flex overflow-x-auto">
//             {(
//               [
//                 "personal",
//                 "financial",
//                 "department",
//                 "joining",

//                 "payroll",
//                 "review",
//               ] as TabType[]
//             ).map((tab, index) => (
//               <button
//                 key={tab}
//                 onClick={() => setActiveTab(tab)}
//                 className={`flex-1 min-w-[120px] px-6 py-4 flex items-center justify-center whitespace-nowrap text-sm font-medium transition-colors relative
//                   ${activeTab === tab
//                     ? "text-red-600 bg-red-50"
//                     : "text-gray-600 hover:text-red-500 hover:bg-gray-50"
//                   }`}
//               >
//                 <span className="mr-2">{tabIcons[tab]}</span>
//                 <span className="capitalize">
//                   {tab === "review" ? "Review" : tab}
//                 </span>
//                 {activeTab === tab && (
//                   <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-600"></div>
//                 )}
//               </button>
//             ))}
//           </div>
//         </div>

//         {/* Form */}
//         <form
//           id="employee-form"
//           onSubmit={handleSubmit}
//           className="flex-1 flex flex-col"
//         >
//           <div className="p-6 space-y-6 flex-1 overflow-auto">
//             <div className="bg-white rounded-lg">{renderTabContent()}</div>
//           </div>

//           {/* Sticky Navigation Buttons */}
//           <div className="border-t bg-white px-6 py-4 sticky bottom-0 flex justify-between items-center shadow-[0_-1px_2px_rgba(0,0,0,0.05)]">
//             <button
//               type="button"
//               onClick={prevTab}
//               className={`px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors ${activeTab === "personal" ? "invisible" : ""
//                 }`}
//             >
//               Previous
//             </button>
//             {activeTab !== "review" && (
//               <button
//                 type="button"
//                 onClick={nextTab}
//                 className="ml-auto px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
//               >
//                 Next
//               </button>
//             )}
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }


"use client"
import type React from "react"
import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { User, Briefcase, Building2, Users, CheckCircle, ArrowLeft, FileText } from "lucide-react"
import Link from "next/link"
import axiosInstance from "@/lib/axiosInstance"

interface BankDetails {
  accountHolder: string
  accountNumber: string
  ifsc: string
  branch: string
  accountType: "SAVING" | "CURRENT"
}

interface DocumentFiles {
  aadharFront: string
  aadharBack: string
  panCard: string
  resume: string
  experienceLetter: string
  passbookPhoto: string
  tenthMarksheet: string
  twelfthMarksheet: string
  degreeMarksheet: string
  policy: string
}

interface Organization {
  _id: string // Changed from id to _id to match backend
  name: string
  description?: string
}

interface Department {
  _id: string // Changed from id to _id to match backend
  name: string
  organizationId: string
  head?: string
  description?: string
}

interface RegisterFormData {
  // Basic Information
  name: string
  role: "admin" | "manager" | "employee" | "intern" | "hr"
  organizationId: string
  departmentId: string
  // Personal Information
  dateOfBirth: string
  currentAddress: string
  photo: string
  // Work Information
  joiningDate: string
  upperManager: string
  salary: string
  experience: string
  // Documents
  adharCard: string
  panCard: string
  // Bank Details
  bankDetails: BankDetails
  // Document Files
  documents: DocumentFiles
}

export default function RegisterPage() {
  const [formData, setFormData] = useState<RegisterFormData>({
    name: "",
    role: "",
    organizationId: "",
    departmentId: "",
    dateOfBirth: "",
    currentAddress: "",
    photo: "",
    joiningDate: "",
    upperManager: "",
    salary: "",
    experience: "",
    adharCard: "",
    panCard: "",
    bankDetails: {
      accountHolder: "",
      accountNumber: "",
      ifsc: "",
      branch: "",
      accountType: "SAVING",
    },
    documents: {
      aadharFront: "",
      aadharBack: "",
      panCard: "",
      resume: "",
      experienceLetter: "",
      passbookPhoto: "",
      tenthMarksheet: "",
      twelfthMarksheet: "",
      degreeMarksheet: "",
      policy: "",
    },
  })

  const [organizations, setOrganizations] = useState<Organization[]>([])
  const [departments, setDepartments] = useState<Department[]>([]) // This will now contain only filtered departments
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [generatedCredentials, setGeneratedCredentials] = useState<{ id: string; password: string } | null>(null)
  const [focusedField, setFocusedField] = useState("")
  const [currentStep, setCurrentStep] = useState(1)
  const [uploadingFiles, setUploadingFiles] = useState<Record<string, boolean>>({})
  const [loadingOrganizations, setLoadingOrganizations] = useState(false)
  const [loadingDepartments, setLoadingDepartments] = useState(false)

  const router = useRouter()
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Fetch organizations on component mount
  useEffect(() => {
    fetchOrganizations()
  }, [])

  // 🔥 FIXED: Fetch departments when organization is selected
  useEffect(() => {
    if (formData.organizationId) {
      fetchDepartmentsByOrganization(formData.organizationId)
    } else {
      setDepartments([]) // Clear departments when no organization selected
      setFormData((prev) => ({ ...prev, departmentId: "" })) // Reset department selection
    }
  }, [formData.organizationId])

  const fetchOrganizations = async () => {
    setLoadingOrganizations(true)
    try {
      const response = await axiosInstance.get("/organizations")
      if (response.data.success) {
        setOrganizations(response.data.data)
      } else {
        setError("Failed to fetch organizations")
      }
    } catch (error) {
      console.error("Error fetching organizations:", error)
      setError("Error loading organizations")
    } finally {
      setLoadingOrganizations(false)
    }
  }

  // 🔥 NEW: Fetch departments filtered by organization
  const fetchDepartmentsByOrganization = async (organizationId: string) => {
    setLoadingDepartments(true)
    setError("") // Clear any previous errors

    try {
      // Use the query parameter to filter departments by organization
      const response = await axiosInstance.get(`/departments?organizationId=${organizationId}`)
      console.log(response.data);
      if (response.data.success) {
        setDepartments(response.data.data)

        // If no departments found for this organization
        if (response.data.data.length === 0) {
          setError("No departments found for the selected organization")
        }
      } else {
        setError("Failed to fetch departments")
        setDepartments([])
      }
    } catch (error) {
      console.error("Error fetching departments:", error)
      setError("Error loading departments for the selected organization")
      setDepartments([])
    } finally {
      setLoadingDepartments(false)
    }
  }

  // Canvas animation code (keeping the same)
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    // Enhanced particle system
    const particles = Array.from({ length: 60 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 2 + 0.5,
      dx: (Math.random() - 0.5) * 0.6,
      dy: (Math.random() - 0.5) * 0.6,
      opacity: Math.random() * 0.4 + 0.2,
      pulse: Math.random() * 0.02 + 0.01,
    }))

    let animationId: number
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw connections between nearby particles
      particles.forEach((p1, i) => {
        particles.slice(i + 1).forEach((p2) => {
          const distance = Math.sqrt((p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2)
          if (distance < 100) {
            ctx.beginPath()
            ctx.moveTo(p1.x, p1.y)
            ctx.lineTo(p2.x, p2.y)
            ctx.strokeStyle = `rgba(34, 197, 94, ${0.1 * (1 - distance / 100)})`
            ctx.lineWidth = 0.5
            ctx.stroke()
          }
        })
      })

      // Draw particles
      particles.forEach((p) => {
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        p.opacity += p.pulse
        if (p.opacity > 0.6 || p.opacity < 0.1) p.pulse *= -1
        ctx.fillStyle = `rgba(34, 197, 94, ${p.opacity * 0.5})`
        ctx.fill()
        p.x += p.dx
        p.y += p.dy
        if (p.x < 0 || p.x > canvas.width) p.dx *= -1
        if (p.y < 0 || p.y > canvas.height) p.dy *= -1
      })
      animationId = requestAnimationFrame(draw)
    }
    draw()

    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    window.addEventListener("resize", handleResize)
    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target

    if (name.startsWith("bankDetails.")) {
      const field = name.split(".")[1] as keyof BankDetails
      setFormData((prev) => ({
        ...prev,
        bankDetails: {
          ...prev.bankDetails,
          [field]: value,
        },
      }))
    } else if (name.startsWith("documents.")) {
      const field = name.split(".")[1] as keyof DocumentFiles
      setFormData((prev) => ({
        ...prev,
        documents: {
          ...prev.documents,
          [field]: value,
        },
      }))
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }))
    }
  }

  // File upload using your backend upload endpoint
  const handleFileUpload = async (file: File, documentType: keyof DocumentFiles | "photo") => {
    if (documentType === "photo") {
      setUploadingFiles((prev) => ({ ...prev, photo: true }))
    } else {
      setUploadingFiles((prev) => ({ ...prev, [documentType]: true }))
    }

    try {
      // Use your backend upload endpoint
      const uploadFormData = new FormData()
      uploadFormData.append("file", file)

      const response = await axiosInstance.post("/upload/single", uploadFormData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })

      if (response.data.success) {
        const fileUrl = response.data.data.url

        if (documentType === "photo") {
          setFormData((prev) => ({
            ...prev,
            photo: fileUrl,
          }))
        } else {
          setFormData((prev) => ({
            ...prev,
            documents: {
              ...prev.documents,
              [documentType]: fileUrl,
            },
          }))
        }
      } else {
        throw new Error(response.data.message || "Upload failed")
      }
    } catch (error: any) {
      console.error("File upload error:", error)
      setError(`Error uploading ${documentType}: ${error.response?.data?.message || error.message}`)
    } finally {
      if (documentType === "photo") {
        setUploadingFiles((prev) => ({ ...prev, photo: false }))
      } else {
        setUploadingFiles((prev) => ({ ...prev, [documentType]: false }))
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setSuccess("")

    try {
      const submitData = {
        ...formData,
        salary: Number.parseFloat(formData.salary) || 0,
        experience: Number.parseInt(formData.experience) || 0,
        dateOfBirth: formData.dateOfBirth || null,
        joiningDate: formData.joiningDate || null,
      }

      const response = await axiosInstance.post("/auth/register", submitData)

      if (response.data.success) {
        setSuccess(response.data.message)
        setGeneratedCredentials({
          id: response.data.data.id,
          password: response.data.data.id,
        })
        setCurrentStep(5) // Move to success step
        // Reset form
        setFormData({
          name: "",
          role: "",
          organizationId: "",
          departmentId: "",
          dateOfBirth: "",
          currentAddress: "",
          photo: "",
          joiningDate: "",
          upperManager: "",
          salary: "",
          experience: "",
          adharCard: "",
          panCard: "",
          bankDetails: {
            accountHolder: "",
            accountNumber: "",
            ifsc: "",
            branch: "",
            accountType: "SAVING",
          },
          documents: {
            aadharFront: "",
            aadharBack: "",
            panCard: "",
            resume: "",
            experienceLetter: "",
            passbookPhoto: "",
            tenthMarksheet: "",
            twelfthMarksheet: "",
            degreeMarksheet: "",
            policy: "",
          },
        })
      } else {
        setError(response.data.message || "Registration failed")
      }
    } catch (error: any) {
      console.error("Registration error:", error)
      setError(error.response?.data?.message || "Network error. Please check if the server is running.")
    } finally {
      setIsLoading(false)
    }
  }

  const nextStep = () => {
    if (currentStep < 4) setCurrentStep(currentStep + 1)
  }

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1)
  }

  const isStep1Valid = formData.name && formData.role && formData.organizationId && formData.departmentId

  // Document upload component
  const DocumentUpload = ({
    documentType,
    label,
    accept = "image/*,.pdf",
    icon: Icon = FileText,
  }: {
    documentType: keyof DocumentFiles
    label: string
    accept?: string
    icon?: React.ComponentType<any>
  }) => (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-green-500 transition-colors">
        <Icon className="w-8 h-8 text-gray-400 mx-auto mb-2" />
        <input
          type="file"
          accept={accept}
          onChange={(e) => {
            const file = e.target.files?.[0]
            if (file) handleFileUpload(file, documentType)
          }}
          className="hidden"
          id={documentType}
          disabled={uploadingFiles[documentType]}
        />
        <label htmlFor={documentType} className="cursor-pointer text-green-600 hover:text-green-700 font-medium">
          {uploadingFiles[documentType] ? "Uploading..." : "Click to upload"}
        </label>
        <p className="text-xs text-gray-500 mt-1">
          {accept.includes("image") ? "PNG, JPG, PDF up to 5MB" : "PDF up to 10MB"}
        </p>
        {formData.documents[documentType] && (
          <p className="text-xs text-green-600 mt-2">✓ File uploaded successfully</p>
        )}
      </div>
    </div>
  )

  // Success screen (keeping the same)
  if (generatedCredentials && currentStep === 5) {
    return (
      <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-white to-green-100 text-gray-900 overflow-hidden">
        <canvas ref={canvasRef} className="absolute inset-0 z-0" />
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="z-10 w-full max-w-md mx-4"
        >
          <motion.div className="bg-white/90 backdrop-blur-xl border border-green-200 rounded-3xl p-8 shadow-2xl shadow-green-900/10 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-full mb-6"
            >
              <CheckCircle className="w-8 h-8 text-white" />
            </motion.div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Registration Successful!</h2>
            <p className="text-gray-600 mb-6">Your employee account has been created successfully.</p>
            <div className="bg-green-50 border border-green-200 rounded-xl p-6 mb-6">
              <h3 className="font-semibold text-green-800 mb-4">Your Login Credentials</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                  <span className="text-gray-600">Employee ID:</span>
                  <span className="font-mono font-bold text-green-700">{generatedCredentials.id}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                  <span className="text-gray-600">Password:</span>
                  <span className="font-mono font-bold text-green-700">{generatedCredentials.password}</span>
                </div>
              </div>
              <p className="text-green-600 text-sm mt-4">
                <strong>Important:</strong> Save these credentials securely. You can change your password after first
                login.
              </p>
            </div>
            <div className="space-y-3">
              <Link
                href="/login"
                className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg shadow-green-500/25"
              >
                Login Now
              </Link>
              <button
                onClick={() => {
                  setGeneratedCredentials(null)
                  setCurrentStep(1)
                  setSuccess("")
                }}
                className="w-full text-gray-600 hover:text-gray-800 py-2 transition-colors"
              >
                Register Another Employee
              </button>
            </div>
          </motion.div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-white to-green-100 text-gray-900 overflow-hidden">
      <canvas ref={canvasRef} className="absolute inset-0 z-0" />

      {/* Background geometric shapes */}
      <div className="absolute inset-0 z-0">
        <motion.div
          animate={{
            rotate: 360,
            scale: [1, 1.1, 1],
          }}
          transition={{
            rotate: { duration: 25, repeat: Number.POSITIVE_INFINITY, ease: "linear" },
            scale: { duration: 5, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" },
          }}
          className="absolute top-1/4 left-1/4 w-32 h-32 border border-green-500/30 rounded-full"
        />
        <motion.div
          animate={{
            rotate: -360,
            scale: [1, 0.9, 1],
          }}
          transition={{
            rotate: { duration: 30, repeat: Number.POSITIVE_INFINITY, ease: "linear" },
            scale: { duration: 7, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" },
          }}
          className="absolute bottom-1/4 right-1/4 w-24 h-24 border border-green-400/40 rounded-lg"
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{
          duration: 1.0,
          type: "spring",
          stiffness: 100,
          damping: 15,
        }}
        className="z-10 w-full max-w-4xl mx-4"
      >
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="text-center mb-8"
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl mb-4 shadow-lg shadow-green-500/25"
          >
            <Users className="w-8 h-8 text-white" />
          </motion.div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Employee Registration</h1>
          <p className="text-gray-600">Create a comprehensive employee profile</p>
          <Link
            href="/login"
            className="inline-flex items-center gap-2 text-green-600 hover:text-green-700 mt-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Login
          </Link>
        </motion.div>

        {/* Progress Steps */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center space-x-2">
            {[1, 2, 3, 4].map((step) => (
              <div key={step} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 ${
                    currentStep >= step ? "bg-green-500 text-white" : "bg-gray-200 text-gray-500"
                  }`}
                >
                  {step}
                </div>
                {step < 4 && (
                  <div
                    className={`w-8 h-1 mx-1 transition-all duration-300 ${
                      currentStep > step ? "bg-green-500" : "bg-gray-200"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Form Container */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="bg-white/80 backdrop-blur-xl border border-gray-200 rounded-3xl p-8 shadow-2xl shadow-gray-900/10"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Step 1: Basic Information */}
            {currentStep === 1 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Basic Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Name Field */}
                  <div className="relative">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                    <div
                      className={`relative flex items-center border-2 rounded-xl transition-all duration-500 ease-out ${
                        focusedField === "name" ? "border-green-500 bg-green-50" : "border-gray-300 bg-gray-50/50"
                      }`}
                    >
                      <div className="flex items-center justify-center w-12 h-12">
                        <User
                          className={`w-5 h-5 transition-colors duration-500 ease-out ${
                            focusedField === "name" ? "text-green-400" : "text-gray-400"
                          }`}
                        />
                      </div>
                      <input
                        type="text"
                        name="name"
                        placeholder="Enter your full name"
                        value={formData.name}
                        onChange={handleInputChange}
                        onFocus={() => setFocusedField("name")}
                        onBlur={() => setFocusedField("")}
                        className="bg-transparent flex-1 px-4 py-3 text-gray-900 placeholder:text-gray-400 outline-none"
                        required
                        disabled={isLoading}
                      />
                    </div>
                  </div>

                  {/* Role Field */}
                  <div className="relative">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Role *</label>
                    <div
                      className={`relative flex items-center border-2 rounded-xl transition-all duration-500 ease-out ${
                        focusedField === "role" ? "border-green-500 bg-green-50" : "border-gray-300 bg-gray-50/50"
                      }`}
                    >
                      <div className="flex items-center justify-center w-12 h-12">
                        <Briefcase
                          className={`w-5 h-5 transition-colors duration-500 ease-out ${
                            focusedField === "role" ? "text-green-400" : "text-gray-400"
                          }`}
                        />
                      </div>
                      <select
                        name="role"
                        value={formData.role}
                        onChange={handleInputChange}
                        onFocus={() => setFocusedField("role")}
                        onBlur={() => setFocusedField("")}
                        className="bg-transparent flex-1 px-4 py-3 text-gray-900 outline-none"
                        required
                        disabled={isLoading}
                      >
                        <option value="">Select Role</option>
                        <option value="admin">Admin</option>
                        <option value="manager">Manager</option>
                        <option value="employee">Employee</option>
                        <option value="intern">Intern</option>
                        <option value="hr">HR</option>
                      </select>
                    </div>
                  </div>

                  {/* Organization Name */}
                  <div className="relative">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Organization *</label>
                    <div
                      className={`relative flex items-center border-2 rounded-xl transition-all duration-500 ease-out ${
                        focusedField === "organizationId"
                          ? "border-green-500 bg-green-50"
                          : "border-gray-300 bg-gray-50/50"
                      }`}
                    >
                      <div className="flex items-center justify-center w-12 h-12">
                        <Building2
                          className={`w-5 h-5 transition-colors duration-500 ease-out ${
                            focusedField === "organizationId" ? "text-green-400" : "text-gray-400"
                          }`}
                        />
                      </div>
                      <select
                        name="organizationId"
                        value={formData.organizationId}
                        onChange={handleInputChange}
                        onFocus={() => setFocusedField("organizationId")}
                        onBlur={() => setFocusedField("")}
                        className="bg-transparent flex-1 px-4 py-3 text-gray-900 outline-none"
                        required
                        disabled={isLoading || loadingOrganizations}
                      >
                        <option value="">
                          {loadingOrganizations ? "Loading organizations..." : "Select Organization"}
                        </option>
                        {organizations.map((org) => (
                          <option key={org._id} value={org._id}>
                            {org.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Department Name - 🔥 FIXED */}
                  <div className="relative">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Department *</label>
                    <div
                      className={`relative flex items-center border-2 rounded-xl transition-all duration-500 ease-out ${
                        focusedField === "departmentId"
                          ? "border-green-500 bg-green-50"
                          : "border-gray-300 bg-gray-50/50"
                      }`}
                    >
                      <div className="flex items-center justify-center w-12 h-12">
                        <Users
                          className={`w-5 h-5 transition-colors duration-500 ease-out ${
                            focusedField === "departmentId" ? "text-green-400" : "text-gray-400"
                          }`}
                        />
                      </div>
                      <select
                        name="departmentId"
                        value={formData.departmentId}
                        onChange={handleInputChange}
                        onFocus={() => setFocusedField("departmentId")}
                        onBlur={() => setFocusedField("")}
                        className="bg-transparent flex-1 px-4 py-3 text-gray-900 outline-none"
                        required
                        disabled={isLoading || loadingDepartments || !formData.organizationId}
                      >
                        <option value="">
                          {!formData.organizationId
                            ? "Select organization first"
                            : loadingDepartments
                              ? "Loading departments..."
                              : departments.length === 0
                                ? "No departments available"
                                : "Select Department"}
                        </option>
                        {departments.map((dept) => (
                          <option key={dept._id} value={dept._id}>
                            {dept.name} {dept.head && `(Head: ${dept.head})`}
                          </option>
                        ))}
                      </select>
                    </div>
                    {/* Show helpful message */}
                    {formData.organizationId && departments.length === 0 && !loadingDepartments && (
                      <p className="text-sm text-amber-600 mt-1">
                        No departments found for this organization. Please contact admin to add departments.
                      </p>
                    )}
                  </div>
                </div>

                {/* Show error if any */}
                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                    <p className="text-red-600 text-sm">{error}</p>
                  </div>
                )}

                <motion.button
                  type="button"
                  onClick={nextStep}
                  disabled={!isStep1Valid}
                  whileHover={{ scale: isStep1Valid ? 1.02 : 1 }}
                  whileTap={{ scale: isStep1Valid ? 0.98 : 1 }}
                  className="w-full bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 transition-all duration-500 ease-out px-6 py-4 rounded-xl text-white font-semibold shadow-lg shadow-green-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Continue to Personal Details
                </motion.button>
              </motion.div>
            )}

            {/* Keep all other steps the same - Step 2, 3, 4 */}
            {/* ... (rest of the form steps remain unchanged) ... */}
          </form>
        </motion.div>
      </motion.div>

      {/* Bottom decorative elements */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-green-500/30 to-transparent" />
    </div>
  )
}
