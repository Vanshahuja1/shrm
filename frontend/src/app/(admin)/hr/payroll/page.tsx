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
  Building,
  Calendar,
  DollarSign,
  Download,
  UserCheck,
  UserMinus,
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
import html2canvas from "html2canvas-pro";
import { jsPDF } from "jspdf";

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

interface FullAndFinalRecord {
  id: string;
  name: string;
  department: string;
  designation: string;
  joiningDate: string;
  exitDate: string;
  status: "pending" | "approved" | "processing" | "paid";
  settlements: {
    salary: number;
    gratuity: number;
    leaveEncashment: number;
    bonus: number;
    deductions: number;
    otherAllowances?: number;
    noticePeriodRecovery?: number;
    total: number;
  };
  documents: {
    type: string;
    status: "pending" | "received" | "verified";
  }[];
  remarks?: string;
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
  const [showFullAndFinalDialog, setShowFullAndFinalDialog] = useState(false);
  const [selectedEmployee, setSelectedEmployee] =
    useState<EmployeeRecord | null>(null);
  const [selectedFullAndFinalEmployee, setSelectedFullAndFinalEmployee] =
    useState<FullAndFinalRecord | null>(null);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
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

  const [fullAndFinalRecords] = useState<FullAndFinalRecord[]>([
    {
      id: "F001",
      name: "Rahul Sharma",
      department: "Engineering",
      designation: "Senior Developer",
      joiningDate: "Apr 15, 2018",
      exitDate: "Jun 30, 2025",
      status: "pending",
      settlements: {
        salary: 85000,
        gratuity: 124000,
        leaveEncashment: 45000,
        bonus: 25000,
        otherAllowances: 12000,
        noticePeriodRecovery: 8000,
        deductions: 18000,
        total: 265000,
      },
      documents: [
        { type: "Resignation Letter", status: "received" },
        { type: "No Dues Certificate", status: "pending" },
        { type: "Exit Interview", status: "pending" },
      ],
      remarks: "Pending IT equipment return",
    },
    {
      id: "F002",
      name: "Priya Patel",
      department: "HR",
      designation: "HR Manager",
      joiningDate: "Jan 10, 2019",
      exitDate: "Jul 15, 2025",
      status: "approved",
      settlements: {
        salary: 72000,
        gratuity: 98000,
        leaveEncashment: 36000,
        bonus: 20000,
        otherAllowances: 8000,
        noticePeriodRecovery: 0,
        deductions: 12500,
        total: 221500,
      },
      documents: [
        { type: "Resignation Letter", status: "received" },
        { type: "No Dues Certificate", status: "verified" },
        { type: "Exit Interview", status: "received" },
      ],
    },
    {
      id: "F003",
      name: "Arjun Nair",
      department: "Sales",
      designation: "Sales Executive",
      joiningDate: "Mar 22, 2020",
      exitDate: "Aug 05, 2025",
      status: "processing",
      settlements: {
        salary: 58000,
        gratuity: 45000,
        leaveEncashment: 30000,
        bonus: 15000,
        otherAllowances: 5000,
        noticePeriodRecovery: 15000,
        deductions: 9500,
        total: 128500,
      },
      documents: [
        { type: "Resignation Letter", status: "received" },
        { type: "No Dues Certificate", status: "received" },
        { type: "Exit Interview", status: "verified" },
      ],
      remarks: "Pending commission calculations",
    },
  ]);

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

  // Handle full and final dialog close
  const handleFullAndFinalClose = () => {
    setShowFullAndFinalDialog(false);
    setSelectedFullAndFinalEmployee(null);
  };

  // Handle CSV export for full and final settlements
  const handleExportCSV = () => {
    if (!fullAndFinalRecords || fullAndFinalRecords.length === 0) {
      alert("No data to export");
      return;
    }

    try {
      // CSV header
      const headers = [
        "ID",
        "Name",
        "Department",
        "Designation",
        "Joining Date",
        "Exit Date",
        "Status",
        "Salary up to Last Working Day",
        "Leave Encashment",
        "Bonus / Incentives",
        "Gratuity",
        "Other Allowances",
        "Notice Period Recovery",
        "Deductions (PF, Tax, etc.)",
        "Net Amount Payable",
        "Remarks",
      ];

      // Function to escape CSV values properly
      interface EscapeCSV {
        (value: string | number | null | undefined): string;
      }

      const escapeCSV: EscapeCSV = (value) => {
        if (value === null || value === undefined) {
          return "";
        }

        const stringValue = String(value);

        // If the value contains quotes, commas, or newlines, it needs to be quoted
        if (/[",\n\r]/.test(stringValue)) {
          return `"${stringValue.replace(/"/g, '""')}"`;
        }

        return stringValue;
      };

      // Convert data to CSV rows
      const csvRows = fullAndFinalRecords.map((record) => {
        return [
          escapeCSV(record.id),
          escapeCSV(record.name),
          escapeCSV(record.department),
          escapeCSV(record.designation),
          escapeCSV(record.joiningDate),
          escapeCSV(record.exitDate),
          escapeCSV(record.status),
          escapeCSV(record.settlements?.salary || 0),
          escapeCSV(record.settlements?.leaveEncashment || 0),
          escapeCSV(record.settlements?.bonus || 0),
          escapeCSV(record.settlements?.gratuity || 0),
          escapeCSV(record.settlements?.otherAllowances || 0),
          escapeCSV(record.settlements?.noticePeriodRecovery || 0),
          escapeCSV(record.settlements?.deductions || 0),
          escapeCSV(record.settlements?.total || 0),
          escapeCSV(record.remarks || ""),
        ];
      });

      // Combine headers and rows
      const csvContent = [
        headers.map((header) => escapeCSV(header)).join(","),
        ...csvRows.map((row) => row.join(",")),
      ].join("\n");

      // Create a Blob with the CSV content
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });

      // Create a download link
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);

      // Set link properties
      link.setAttribute("href", url);
      link.setAttribute(
        "download",
        `Full_And_Final_Settlements_${new Date().toISOString().split("T")[0]}.csv`
      );
      link.style.visibility = "hidden";

      // Add to document, trigger click to download, and clean up
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Show success message
      const successToast = document.createElement("div");
      successToast.className =
        "fixed bottom-4 right-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-md shadow-md";
      successToast.style.zIndex = "9999";
      successToast.innerHTML = `
        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
            </svg>
            <span>CSV exported successfully!</span>
          </div>
        </div>
      `;
      document.body.appendChild(successToast);

      // Remove toast after 3 seconds
      setTimeout(() => {
        document.body.removeChild(successToast);
      }, 3000);
    } catch (error) {
      console.error("Error exporting CSV:", error);
      alert("Failed to export CSV. Please try again.");
    }
  };

  // Handle PDF download for full and final settlement
  const handleDownloadSettlementPDF = async () => {
    if (!selectedFullAndFinalEmployee) return;

    setIsGeneratingPDF(true);

    try {
      // Create a temporary div to hold the content we want to convert to PDF
      const settlementElement = document.getElementById("settlement-content");

      if (!settlementElement) {
        console.error("Settlement content element not found");
        return;
      }

      // Create a completely new element with styles optimized for PDF output
      const pdfContainer = document.createElement("div");
      pdfContainer.style.width = "794px"; // A4 width in pixels at 96 DPI (210mm)
      pdfContainer.style.position = "absolute";
      pdfContainer.style.left = "-9999px";
      pdfContainer.style.top = "0";
      pdfContainer.style.backgroundColor = "#ffffff";
      pdfContainer.style.padding = "40px";
      pdfContainer.style.fontSize = "12pt";
      pdfContainer.style.fontFamily = "Arial, sans-serif";

      // Clone the content for the PDF
      const employeeData = selectedFullAndFinalEmployee;

      // Generate clean HTML for the PDF with consistent styling
      pdfContainer.innerHTML = `
        <div style="text-align: center; margin-bottom: 20px;">
          <h1 style="color: #000066; font-size: 24pt; margin-bottom: 5px;">FULL AND FINAL SETTLEMENT</h1>
          <h2 style="color: #444; font-size: 16pt; font-weight: normal;">${employeeData.name} - ${employeeData.designation}</h2>
        </div>
        
        <div style="display: flex; justify-content: space-between; margin-bottom: 30px; border-bottom: 1px solid #eee; padding-bottom: 20px;">
          <div style="display: flex; align-items: center;">
            <div style="width: 60px; height: 60px; border-radius: 50%; background-color: #e6f0ff; display: flex; align-items: center; justify-content: center; margin-right: 20px;">
              <span style="color: #0055cc; font-size: 20pt; font-weight: bold;">${employeeData.name
                .split(" ")
                .map((n) => n[0])
                .join("")}</span>
            </div>
            <div>
              <h3 style="margin: 0; font-size: 18pt;">${employeeData.name}</h3>
              <p style="margin: 5px 0 0; color: #555;">${employeeData.designation} • ${employeeData.department}</p>
            </div>
          </div>
          <div style="background-color: ${
            employeeData.status === "pending"
              ? "#fff8e6"
              : employeeData.status === "approved"
                ? "#eefbf0"
                : employeeData.status === "processing"
                  ? "#e6f4ff"
                  : "#f5e6ff"
          }; padding: 8px 16px; border-radius: 4px; color: ${
            employeeData.status === "pending"
              ? "#805b10"
              : employeeData.status === "approved"
                ? "#186429"
                : employeeData.status === "processing"
                  ? "#0c5689"
                  : "#5c1e99"
          }; font-weight: bold;">
            ${employeeData.status.toUpperCase()}
          </div>
        </div>
        
        <div style="display: flex; gap: 30px;">
          <div style="flex: 1;">
            <h3 style="font-size: 16pt; margin-top: 0; margin-bottom: 15px;">Employment Details</h3>
            <div style="background-color: #f9f9f9; padding: 20px; border-radius: 6px;">
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px 0; color: #666;">Employee ID</td>
                  <td style="padding: 8px 0; text-align: right; font-weight: bold;">${employeeData.id}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #666;">Date of Joining</td>
                  <td style="padding: 8px 0; text-align: right; font-weight: bold;">${employeeData.joiningDate}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #666;">Date of Exit</td>
                  <td style="padding: 8px 0; text-align: right; font-weight: bold;">${employeeData.exitDate}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #666;">Total Tenure</td>
                  <td style="padding: 8px 0; text-align: right; font-weight: bold;">
                    ${(() => {
                      const start = new Date(employeeData.joiningDate);
                      const end = new Date(employeeData.exitDate);
                      const diffTime = Math.abs(
                        end.getTime() - start.getTime()
                      );
                      const diffDays = Math.ceil(
                        diffTime / (1000 * 60 * 60 * 24)
                      );
                      const years = Math.floor(diffDays / 365);
                      const months = Math.floor((diffDays % 365) / 30);
                      return `${years} years, ${months} months`;
                    })()}
                  </td>
                </tr>
              </table>
            </div>
            
            <h3 style="font-size: 16pt; margin-top: 25px; margin-bottom: 15px;">Required Documents</h3>
            <div style="background-color: #f9f9f9; padding: 15px; border-radius: 6px;">
              ${employeeData.documents
                .map(
                  (doc) => `
                <div style="display: flex; justify-content: space-between; padding: 10px; margin-bottom: 5px; background-color: #f0f0f0; border-radius: 4px;">
                  <span>${doc.type}</span>
                  <span style="background-color: ${
                    doc.status === "pending"
                      ? "#fff8e6"
                      : doc.status === "received"
                        ? "#e6f4ff"
                        : "#eefbf0"
                  }; padding: 4px 10px; border-radius: 4px; font-size: 10pt; color: ${
                    doc.status === "pending"
                      ? "#805b10"
                      : doc.status === "received"
                        ? "#0c5689"
                        : "#186429"
                  };">${doc.status}</span>
                </div>
              `
                )
                .join("")}
            </div>
          </div>
          
          <div style="flex: 1;">
            <h3 style="font-size: 16pt; margin-top: 0; margin-bottom: 15px;">Settlement Calculation</h3>
            <div style="background-color: #f9f9f9; padding: 20px; border-radius: 6px;">
              <table style="width: 100%; border-collapse: collapse;">
                <tr style="border-bottom: 1px solid #e0e0e0;">
                  <td style="padding: 10px 0; color: #666;">Salary up to ${employeeData.exitDate}</td>
                  <td style="padding: 10px 0; text-align: right; font-weight: bold;">₹${employeeData.settlements.salary.toLocaleString()}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; color: #666;">Leave Encashment</td>
                  <td style="padding: 10px 0; text-align: right; font-weight: bold;">₹${employeeData.settlements.leaveEncashment.toLocaleString()}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; color: #666;">Bonus / Incentives</td>
                  <td style="padding: 10px 0; text-align: right; font-weight: bold;">₹${employeeData.settlements.bonus.toLocaleString()}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; color: #666;">Gratuity (if applicable)</td>
                  <td style="padding: 10px 0; text-align: right; font-weight: bold;">₹${employeeData.settlements.gratuity.toLocaleString()}</td>
                </tr>
                <tr style="border-bottom: 1px solid #e0e0e0;">
                  <td style="padding: 10px 0; color: #666;">Other Allowances</td>
                  <td style="padding: 10px 0; text-align: right; font-weight: bold;">₹${(employeeData.settlements.otherAllowances || 0).toLocaleString()}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; font-weight: bold;">Total Payable</td>
                  <td style="padding: 10px 0; text-align: right; font-weight: bold;">₹${(
                    (employeeData.settlements.salary || 0) +
                    (employeeData.settlements.leaveEncashment || 0) +
                    (employeeData.settlements.bonus || 0) +
                    (employeeData.settlements.gratuity || 0) +
                    (employeeData.settlements.otherAllowances || 0)
                  ).toLocaleString()}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; color: #d32f2f;">Less: Notice Period Recovery</td>
                  <td style="padding: 10px 0; text-align: right; font-weight: bold; color: #d32f2f;">- ₹${(employeeData.settlements.noticePeriodRecovery || 0).toLocaleString()}</td>
                </tr>
                <tr style="border-bottom: 1px solid #e0e0e0;">
                  <td style="padding: 10px 0; color: #d32f2f;">Less: Deductions (PF, Tax, etc.)</td>
                  <td style="padding: 10px 0; text-align: right; font-weight: bold; color: #d32f2f;">- ₹${(employeeData.settlements.deductions || 0).toLocaleString()}</td>
                </tr>
                <tr>
                  <td style="padding: 15px 0; font-weight: bold; font-size: 14pt;">Net Amount Payable</td>
                  <td style="padding: 15px 0; text-align: right; font-weight: bold; font-size: 14pt; color: #0055cc;">₹${employeeData.settlements.total.toLocaleString()}</td>
                </tr>
              </table>
            </div>
            
            ${
              employeeData.remarks
                ? `
              <div style="margin-top: 25px;">
                <h3 style="font-size: 16pt; margin-top: 0; margin-bottom: 15px;">Remarks</h3>
                <div style="background-color: #fffbeb; padding: 15px; border-radius: 6px; border: 1px solid #fef3c7; color: #92400e;">
                  ${employeeData.remarks}
                </div>
              </div>
            `
                : ""
            }
          </div>
        </div>
        
        <div style="margin-top: 40px; text-align: center; border-top: 1px solid #eee; padding-top: 20px;">
          <p>This document is computer generated and does not require a signature.</p>
          <p style="margin-top: 5px; color: #666;">Generated on ${new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</p>
        </div>
      `;

      // Add the container to the document body
      document.body.appendChild(pdfContainer);

      // Define margins for better document layout
      const margins = {
        left: 15, // left margin in mm
        right: 15, // right margin in mm
        top: 15, // top margin in mm
        bottom: 15, // bottom margin in mm
      };

      // Calculate dimensions to fit A4 page
      const pageWidth = 210; // A4 width in mm
      const pageHeight = 297; // A4 height in mm

      // Use html2canvas with optimal settings
      const canvas = await html2canvas(pdfContainer, {
        scale: 2, // Higher scale for better quality
        logging: false,
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#ffffff",
        onclone: function (clonedDoc) {
          // We can make any adjustments to the cloned document before rendering
          const element = clonedDoc.body.firstChild as HTMLElement;
          if (element) {
            element.style.width = "794px"; // Ensure exact width
            element.style.padding = "40px";
          }
        },
      });

      // Calculate the scaling needed to fit the content on the page
      const pdfWidth = pageWidth - margins.left - margins.right;
      const pdfHeight = pageHeight - margins.top - margins.bottom;
      const canvasRatio = canvas.height / canvas.width;
      const pageRatio = pdfHeight / pdfWidth;

      let imgWidth, imgHeight;

      // Check if content needs to be scaled down to fit the page
      if (canvasRatio > pageRatio) {
        // Content is taller than the page ratio
        imgHeight = pdfHeight;
        imgWidth = imgHeight / canvasRatio;
      } else {
        // Content is wider than the page ratio
        imgWidth = pdfWidth;
        imgHeight = imgWidth * canvasRatio;
      }

      // Create PDF document
      const pdf = new jsPDF("p", "mm", "a4");

      // Get the canvas as a data URL with high quality
      const imageData = canvas.toDataURL("image/png", 1.0);

      // Get PDF dimensions minus margins
      const availableWidth = pageWidth - margins.left - margins.right;
      const availableHeight = pageHeight - margins.top - margins.bottom - 25; // Extra space for headers/footers

      // Calculate dimensions to fit content proportionally (object-contain style)
      const contentRatio = canvas.height / canvas.width;
      let finalWidth, finalHeight;

      if (availableHeight / availableWidth > contentRatio) {
        // Available space is taller than content ratio - fit to width
        finalWidth = availableWidth;
        finalHeight = finalWidth * contentRatio;
      } else {
        // Available space is wider than content ratio - fit to height
        finalHeight = availableHeight;
        finalWidth = finalHeight / contentRatio;
      }

      // Center the content horizontally
      const xOffset = margins.left + (availableWidth - finalWidth) / 2;

      // Add the image with object-contain behavior
      pdf.addImage(
        imageData,
        "PNG",
        xOffset,
        margins.top,
        finalWidth,
        finalHeight,
        undefined,
        "FAST"
      );

      // If content is very tall, it might need to be split across pages
      if (finalHeight > availableHeight) {
        // The content is too tall for a single page
        // jsPDF automatically handles splitting across pages when using addImage with "none" or "FAST"
        // so we don't need to manually handle pagination
        console.log("Content is tall and may be split across multiple pages");
      }

      // Count how many pages we have
      const totalPages = pdf.getNumberOfPages();

      // Add footer with date and page number on all pages
      for (let i = 1; i <= totalPages; i++) {
        pdf.setPage(i);

        // Add footer border line
        pdf.setDrawColor(200, 200, 200);
        pdf.line(
          margins.left,
          pageHeight - margins.bottom - 10,
          pageWidth - margins.right,
          pageHeight - margins.bottom - 10
        );

        // Add footer text
        pdf.setFontSize(10);
        pdf.setTextColor(100, 100, 100);
        pdf.text(
          `Generated on: ${new Date().toLocaleDateString()}`,
          margins.left,
          pageHeight - margins.bottom - 5
        );
        pdf.text(
          `Page ${i} of ${totalPages}`,
          pageWidth - margins.right - 25,
          pageHeight - margins.bottom - 5
        );
      }

      // Add company header on all pages
      for (let i = 1; i <= totalPages; i++) {
        pdf.setPage(i);

        // Add colored rectangle for header background
        pdf.setFillColor(240, 249, 255); // Light blue background
        pdf.rect(0, 0, pageWidth, 20, "F");

        // Add company header with better styling
        pdf.setFontSize(12);
        pdf.setTextColor(0, 0, 128); // Dark blue for company name
        pdf.text("COMPANY LETTERHEAD", 105, 12, { align: "center" });
      }

      // Generate the PDF with a descriptive filename
      pdf.save(
        `Settlement_${selectedFullAndFinalEmployee.id}_${selectedFullAndFinalEmployee.name.replace(/\s+/g, "_")}_${new Date().toISOString().split("T")[0]}.pdf`
      );

      // Clean up - remove the temporary container
      document.body.removeChild(pdfContainer);

      // Show success message
      const successToast = document.createElement("div");
      successToast.className =
        "fixed bottom-4 right-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-md shadow-md";
      successToast.style.zIndex = "9999";
      successToast.innerHTML = `
        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
            </svg>
            <span>PDF downloaded successfully!</span>
          </div>
        </div>
      `;
      document.body.appendChild(successToast);

      // Remove toast after 3 seconds
      setTimeout(() => {
        document.body.removeChild(successToast);
      }, 3000);
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Failed to generate PDF. Please try again.");
    } finally {
      setIsGeneratingPDF(false);
    }
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
                      `${name} ${((percent ?? 0) * 100).toFixed(0)}%`
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

      {/* Full and Final Settlement */}
      <Card className="bg-white mb-6">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg font-semibold text-gray-900">
              Full and Final Settlement Requests
            </CardTitle>
            <div className="flex gap-2 items-center">
              <Button
                variant="outline"
                size="sm"
                onClick={handleExportCSV}
                className="flex items-center gap-1 text-xs"
              >
                <FileText className="h-3 w-3" />
                Export All
              </Button>
              <Badge className="bg-red-100 text-red-800 hover:bg-red-200">
                {fullAndFinalRecords.length} Pending
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-16">ID</TableHead>
                <TableHead>Employee</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Exit Date</TableHead>
                <TableHead>Settlement Amount</TableHead>
                <TableHead className="text-center">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {fullAndFinalRecords.map((record) => (
                <TableRow
                  key={record.id}
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() => {
                    setSelectedFullAndFinalEmployee(record);
                    setShowFullAndFinalDialog(true);
                  }}
                >
                  <TableCell className="font-medium">{record.id}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                        <span className="text-xs font-medium text-blue-600">
                          {record.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </span>
                      </div>
                      {record.name}
                    </div>
                  </TableCell>
                  <TableCell>{record.department}</TableCell>
                  <TableCell>{record.exitDate}</TableCell>
                  <TableCell>
                    {formatCurrency(record.settlements.total)}
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge
                      variant="outline"
                      className={`
                        ${record.status === "pending" ? "text-amber-600 border-amber-200" : ""}
                        ${record.status === "approved" ? "text-green-600 border-green-200" : ""}
                        ${record.status === "processing" ? "text-blue-600 border-blue-200" : ""}
                        ${record.status === "paid" ? "text-purple-600 border-purple-200" : ""}
                      `}
                    >
                      {record.status.charAt(0).toUpperCase() +
                        record.status.slice(1)}
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
      <Dialog open={showPayslip} onOpenChange={setShowPayslip}>
        {" "}
        {/* Simplified onOpenChange */}
        <DialogContent
          className="sm:max-w-4xl max-h-[90vh] p-0 flex justify-center items-center"
          style={{ zIndex: 1000 }}
        >
          <div className="w-full h-full flex justify-center items-center">
            <div className="w-full max-w-3xl p-4 bg-transparent">
              {" "}
              {/* Removed bg-white, reduced padding */}
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
              <div className="overflow-auto max-h-[calc(90vh-60px)] bg-white rounded-b-lg">
                {" "}
                {/* Moved bg-white here, adjusted height */}
                {selectedEmployee && (
                  <FunctionalPayslipPage
                    employee={{
                      id: selectedEmployee.id,
                      empNo: selectedEmployee.id,
                      name: selectedEmployee.name,
                      department: selectedEmployee.department || "Engineering",
                      dateOfJoining:
                        selectedEmployee.dateOfJoining || "Apr 1, 2021",
                      designation:
                        selectedEmployee.designation || "Software Engineer",
                      payableDays: selectedEmployee.payableDays,
                      totalEarnings: selectedEmployee.totalEarnings,
                      totalDeductions: selectedEmployee.totalDeductions,
                      netPay: selectedEmployee.netPay,
                    }}
                    onClose={handlePayslipClose}
                  />
                )}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Full and Final Settlement Dialog */}
      <Dialog
        open={showFullAndFinalDialog}
        onOpenChange={setShowFullAndFinalDialog}
      >
        <DialogContent
          className="sm:max-w-4xl max-h-[90vh] p-0"
          style={{ zIndex: 1000 }}
        >
          <div className="w-full h-full">
            <div className="w-full p-0 bg-transparent">
              <DialogHeader className="flex-shrink-0 px-6 py-4 border-b bg-blue-50">
                <DialogTitle className="text-xl">
                  Full and Final Settlement
                </DialogTitle>
                <DialogClose asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
                    onClick={handleFullAndFinalClose}
                  >
                    <X className="h-4 w-4" />
                    <span className="sr-only">Close</span>
                  </Button>
                </DialogClose>
              </DialogHeader>
              <div className="overflow-auto max-h-[calc(90vh-80px)] bg-white rounded-b-lg p-6">
                {selectedFullAndFinalEmployee && (
                  <div className="space-y-8" id="settlement-content">
                    {/* Employee Details Section */}
                    <div className="flex items-center justify-between pb-6 border-b">
                      <div className="flex items-center space-x-4">
                        <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-xl font-semibold">
                          {selectedFullAndFinalEmployee.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </div>
                        <div>
                          <h3 className="text-xl font-bold">
                            {selectedFullAndFinalEmployee.name}
                          </h3>
                          <p className="text-gray-600">
                            {selectedFullAndFinalEmployee.designation} •{" "}
                            {selectedFullAndFinalEmployee.department}
                          </p>
                        </div>
                      </div>
                      <div>
                        <Badge
                          className={`px-3 py-1 text-sm font-medium ${
                            selectedFullAndFinalEmployee.status === "pending"
                              ? "bg-amber-100 text-amber-800"
                              : selectedFullAndFinalEmployee.status ===
                                  "approved"
                                ? "bg-green-100 text-green-800"
                                : selectedFullAndFinalEmployee.status ===
                                    "processing"
                                  ? "bg-blue-100 text-blue-800"
                                  : "bg-purple-100 text-purple-800"
                          }`}
                        >
                          {selectedFullAndFinalEmployee.status.toUpperCase()}
                        </Badge>
                      </div>
                    </div>

                    {/* Tenure Details */}
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-6">
                        <div>
                          <h4 className="text-lg font-semibold mb-4">
                            Employment Details
                          </h4>
                          <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                            <div className="flex justify-between">
                              <span className="text-gray-600">Employee ID</span>
                              <span className="font-medium">
                                {selectedFullAndFinalEmployee.id}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">
                                Date of Joining
                              </span>
                              <span className="font-medium">
                                {selectedFullAndFinalEmployee.joiningDate}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">
                                Date of Exit
                              </span>
                              <span className="font-medium">
                                {selectedFullAndFinalEmployee.exitDate}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">
                                Total Tenure
                              </span>
                              <span className="font-medium">
                                {(() => {
                                  const start = new Date(
                                    selectedFullAndFinalEmployee.joiningDate
                                  );
                                  const end = new Date(
                                    selectedFullAndFinalEmployee.exitDate
                                  );
                                  const diffTime = Math.abs(
                                    end.getTime() - start.getTime()
                                  );
                                  const diffDays = Math.ceil(
                                    diffTime / (1000 * 60 * 60 * 24)
                                  );
                                  const years = Math.floor(diffDays / 365);
                                  const months = Math.floor(
                                    (diffDays % 365) / 30
                                  );
                                  return `${years} years, ${months} months`;
                                })()}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div>
                          <h4 className="text-lg font-semibold mb-4">
                            Required Documents
                          </h4>
                          <div className="space-y-2">
                            {selectedFullAndFinalEmployee.documents.map(
                              (doc, idx) => (
                                <div
                                  key={idx}
                                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                                >
                                  <span>{doc.type}</span>
                                  <Badge
                                    className={`${
                                      doc.status === "pending"
                                        ? "bg-amber-100 text-amber-800"
                                        : doc.status === "received"
                                          ? "bg-blue-100 text-blue-800"
                                          : "bg-green-100 text-green-800"
                                    }`}
                                  >
                                    {doc.status}
                                  </Badge>
                                </div>
                              )
                            )}
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-lg font-semibold mb-4">
                          Settlement Calculation
                        </h4>
                        <div className="bg-gray-50 rounded-lg p-5">
                          <div className="space-y-4">
                            <div className="flex justify-between items-center pb-2 border-b border-gray-200">
                              <span className="text-gray-600">
                                Salary up to{" "}
                                {selectedFullAndFinalEmployee.exitDate}
                              </span>
                              <span className="font-medium">
                                {formatCurrency(
                                  selectedFullAndFinalEmployee.settlements
                                    .salary
                                )}
                              </span>
                            </div>
                            <div className="flex justify-between items-center pb-2">
                              <span className="text-gray-600">
                                Leave Encashment
                              </span>
                              <span className="font-medium">
                                {formatCurrency(
                                  selectedFullAndFinalEmployee.settlements
                                    .leaveEncashment
                                )}
                              </span>
                            </div>
                            <div className="flex justify-between items-center pb-2">
                              <span className="text-gray-600">
                                Bonus / Incentives
                              </span>
                              <span className="font-medium">
                                {formatCurrency(
                                  selectedFullAndFinalEmployee.settlements.bonus
                                )}
                              </span>
                            </div>
                            <div className="flex justify-between items-center pb-2">
                              <span className="text-gray-600">
                                Gratuity (if applicable)
                              </span>
                              <span className="font-medium">
                                {formatCurrency(
                                  selectedFullAndFinalEmployee.settlements
                                    .gratuity
                                )}
                              </span>
                            </div>
                            <div className="flex justify-between items-center pb-2 border-b border-gray-200">
                              <span className="text-gray-600">
                                Other Allowances
                              </span>
                              <span className="font-medium">
                                {formatCurrency(
                                  selectedFullAndFinalEmployee.settlements
                                    .otherAllowances || 0
                                )}
                              </span>
                            </div>
                            <div className="flex justify-between items-center pb-2 font-medium">
                              <span>Total Payable</span>
                              <span>
                                {formatCurrency(
                                  (selectedFullAndFinalEmployee.settlements
                                    .salary || 0) +
                                    (selectedFullAndFinalEmployee.settlements
                                      .leaveEncashment || 0) +
                                    (selectedFullAndFinalEmployee.settlements
                                      .bonus || 0) +
                                    (selectedFullAndFinalEmployee.settlements
                                      .gratuity || 0) +
                                    (selectedFullAndFinalEmployee.settlements
                                      .otherAllowances || 0)
                                )}
                              </span>
                            </div>
                            <div className="flex justify-between items-center pb-2 text-red-600">
                              <span>Less: Notice Period Recovery</span>
                              <span>
                                -{" "}
                                {formatCurrency(
                                  selectedFullAndFinalEmployee.settlements
                                    .noticePeriodRecovery || 0
                                )}
                              </span>
                            </div>
                            <div className="flex justify-between items-center pb-2 text-red-600 border-b border-gray-200">
                              <span>Less: Deductions (PF, Tax, etc.)</span>
                              <span>
                                -{" "}
                                {formatCurrency(
                                  selectedFullAndFinalEmployee.settlements
                                    .deductions || 0
                                )}
                              </span>
                            </div>
                            <div className="flex justify-between items-center pt-2">
                              <span className="text-lg font-bold">
                                Net Amount Payable
                              </span>
                              <span className="text-lg font-bold text-blue-600">
                                {formatCurrency(
                                  selectedFullAndFinalEmployee.settlements.total
                                )}
                              </span>
                            </div>
                          </div>
                        </div>

                        {selectedFullAndFinalEmployee.remarks && (
                          <div className="mt-6">
                            <h4 className="text-lg font-semibold mb-2">
                              Remarks
                            </h4>
                            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-sm text-yellow-800">
                              {selectedFullAndFinalEmployee.remarks}
                            </div>
                          </div>
                        )}

                        <div className="mt-8 space-y-3">
                          <Button className="w-full bg-blue-600 hover:bg-blue-700">
                            Approve Settlement
                          </Button>
                          <div className="grid grid-cols-2 gap-3">
                            <Button
                              variant="outline"
                              onClick={handleDownloadSettlementPDF}
                              className="flex items-center justify-center gap-2"
                              disabled={isGeneratingPDF}
                            >
                              {isGeneratingPDF ? (
                                <>
                                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-b-transparent"></div>
                                  Generating...
                                </>
                              ) : (
                                <>
                                  <Download className="h-4 w-4" />
                                  Download PDF
                                </>
                              )}
                            </Button>
                            <Button
                              variant="outline"
                              onClick={() => {
                                if (selectedFullAndFinalEmployee) {
                                  // Export just this employee's data
                                  const headers = [
                                    "ID",
                                    "Name",
                                    "Department",
                                    "Designation",
                                    "Joining Date",
                                    "Exit Date",
                                    "Status",
                                    "Salary up to Last Working Day",
                                    "Leave Encashment",
                                    "Bonus / Incentives",
                                    "Gratuity",
                                    "Other Allowances",
                                    "Notice Period Recovery",
                                    "Deductions (PF, Tax, etc.)",
                                    "Net Amount Payable",
                                    "Remarks",
                                  ];

                                  // Function to escape CSV values properly
                                  interface EscapeCSV {
                                    (value: string | number | null | undefined): string;
                                  }

                                  const escapeCSV: EscapeCSV = (value) => {
                                    if (value === null || value === undefined) return "";
                                    const stringValue = String(value);
                                    if (/[",\n\r]/.test(stringValue)) {
                                      return `"${stringValue.replace(/"/g, '""')}"`;
                                    }
                                    return stringValue;
                                  };

                                  const employee = selectedFullAndFinalEmployee;
                                  const rowData = [
                                    escapeCSV(employee.id),
                                    escapeCSV(employee.name),
                                    escapeCSV(employee.department),
                                    escapeCSV(employee.designation),
                                    escapeCSV(employee.joiningDate),
                                    escapeCSV(employee.exitDate),
                                    escapeCSV(employee.status),
                                    escapeCSV(
                                      employee.settlements?.salary || 0
                                    ),
                                    escapeCSV(
                                      employee.settlements?.leaveEncashment || 0
                                    ),
                                    escapeCSV(employee.settlements?.bonus || 0),
                                    escapeCSV(
                                      employee.settlements?.gratuity || 0
                                    ),
                                    escapeCSV(
                                      employee.settlements?.otherAllowances || 0
                                    ),
                                    escapeCSV(
                                      employee.settlements
                                        ?.noticePeriodRecovery || 0
                                    ),
                                    escapeCSV(
                                      employee.settlements?.deductions || 0
                                    ),
                                    escapeCSV(employee.settlements?.total || 0),
                                    escapeCSV(employee.remarks || ""),
                                  ];

                                  const csvContent = [
                                    headers
                                      .map((header) => escapeCSV(header))
                                      .join(","),
                                    rowData.join(","),
                                  ].join("\n");

                                  const blob = new Blob([csvContent], {
                                    type: "text/csv;charset=utf-8;",
                                  });
                                  const link = document.createElement("a");
                                  const url = URL.createObjectURL(blob);

                                  link.setAttribute("href", url);
                                  link.setAttribute(
                                    "download",
                                    `Settlement_${employee.id}_${employee.name.replace(/\s+/g, "_")}.csv`
                                  );
                                  link.style.visibility = "hidden";

                                  document.body.appendChild(link);
                                  link.click();
                                  document.body.removeChild(link);

                                  // Success notification
                                  const successToast =
                                    document.createElement("div");
                                  successToast.className =
                                    "fixed bottom-4 right-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-md shadow-md";
                                  successToast.style.zIndex = "9999";
                                  successToast.innerHTML = `
                              <div class="flex items-center">
                                <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
                                </svg>
                                <span>CSV exported successfully!</span>
                              </div>
                            `;
                                  document.body.appendChild(successToast);
                                  setTimeout(
                                    () =>
                                      document.body.removeChild(successToast),
                                    3000
                                  );
                                }
                              }}
                            >
                              <FileText className="h-4 w-4 mr-2" />
                              Export CSV
                            </Button>
                          </div>
                          <Button variant="outline" className="w-full">
                            Update Status
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
