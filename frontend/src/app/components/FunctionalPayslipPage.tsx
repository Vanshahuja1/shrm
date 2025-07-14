import React, { useState, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  RefreshCw,
  Download,
  Printer,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

interface PayslipData {
  employee: {
    id: string;
    empNo: string;
    name: string;
    department?: string;
    dateOfJoining?: string;
    designation?: string;
  };
  company: {
    name: string;
    address: string;
  };
  paymentDetails: {
    paymentMode: string;
    bankName: string;
    bankIFSC: string;
    bankAccount: string;
  };
  identifiers: {
    pan: string;
    uan: string;
    pfNumber: string;
    payCycleDate: string;
  };
  salaryDetails: {
    actualPayableDays: number;
    totalWorkingDays: number;
    lossOfPayDays: number;
    daysPayable: number;
  };
  earnings: {
    basic: number;
    hra: number;
    communicationReimbursement: number;
    professionalReimbursement: number;
    ltc: number;
    specialAllowance: number;
    total: number;
  };
  contributions: {
    pfEmployee: number;
    total: number;
  };
  deductions: {
    professionalTax: number;
    pfEmployee: number;
    total: number;
  };
  netSalary: number;
  netSalaryInWords: string;
}
export interface PayslipEmployee {
  id: string;
  empNo: string;
  name: string;
  payableDays: string;
  totalEarnings: number;
  totalDeductions: number;
  netPay: number;
  department: string;
  dateOfJoining: string;
  designation: string;
}

interface FunctionalPayslipPageProps {
  employee: PayslipEmployee | null;
}

const FunctionalPayslipPage: React.FC<FunctionalPayslipPageProps> = ({
  employee,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [showPayslipDialog, setShowPayslipDialog] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const payslipRef = useRef<HTMLDivElement>(null);

  const payslipData: PayslipData = {
    employee: {
      name: employee?.name || "",
      empNo: employee?.id || "",
      dateOfJoining: employee?.dateOfJoining || "Apr 1, 2021",
      department: employee?.department || "Engineering",
      designation: employee?.designation || "Software Engineer",
      id: "",
    },
    company: {
      name: "Keka Technologies Private Limited",
      address:
        "Plot no. 104, Kavuri Hills, Madhapur\nHyderabad Telangana, 500033",
    },
    paymentDetails: {
      paymentMode: "Bank Transfer",
      bankName: "ICICI Bank",
      bankIFSC: "KBKH0000167",
      bankAccount: "101287000434233",
    },
    identifiers: {
      pan: "AHQP8098T",
      uan: "100549985354",
      pfNumber: "APHYD19875344334434438845",
      payCycleDate: "26 Mar - 25 Apr",
    },
    salaryDetails: {
      actualPayableDays: 31,
      totalWorkingDays: 31,
      lossOfPayDays: 0,
      daysPayable: 31,
    },
    earnings: {
      basic: 45000,
      hra: 20000,
      communicationReimbursement: 2000,
      professionalReimbursement: 2000,
      ltc: 2000,
      specialAllowance: 25000,
      total: 96000,
    },
    contributions: {
      pfEmployee: 3000,
      total: 3000,
    },
    deductions: {
      professionalTax: 200,
      pfEmployee: 2085,
      total: 2285,
    },
    netSalary: 90715,
    netSalaryInWords: "Ninety Thousand & Seven Hundred Fifteen Rupees Only",
  };

  const handlePrint = () => {
    setIsLoading(true);
    setTimeout(() => {
      const printWindow = window.open("", "_blank");
      if (printWindow) {
        const printContent = payslipRef.current?.innerHTML || "";
        printWindow.document.write(`
          <html>
            <head>
              <title>Payslip April 2021</title>
              <style>
                body { font-family: Arial, sans-serif; margin: 20px; }
                .print-container { max-width: 800px; margin: 0 auto; }
                .header { display: flex; justify-content: space-between; margin-bottom: 20px; }
                .company-logo { font-size: 24px; font-weight: bold; color: #f59e0b; }
                .employee-section { margin-bottom: 20px; }
                .details-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px; margin-bottom: 20px; }
                .detail-item { }
                .detail-label { font-size: 12px; color: #666; margin-bottom: 2px; }
                .detail-value { font-weight: 500; }
                .earnings-section { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px; }
                .earnings-column { background: #f9f9f9; padding: 15px; border-radius: 8px; }
                .earnings-row { display: flex; justify-content: space-between; margin-bottom: 8px; }
                .total-row { border-top: 1px solid #ddd; padding-top: 8px; font-weight: bold; }
                .net-salary { background: #dbeafe; padding: 15px; border-radius: 8px; margin-bottom: 15px; }
                .net-salary-amount { font-size: 20px; font-weight: bold; }
                .footer-note { font-size: 12px; color: #666; font-style: italic; }
                @media print {
                  body { margin: 0; }
                  .print-container { max-width: none; }
                }
              </style>
            </head>
            <body>
              <div class="print-container">
                ${printContent}
              </div>
            </body>
          </html>
        `);
        printWindow.document.close();
        printWindow.print();
        printWindow.close();
      }
      setIsLoading(false);
    }, 1000);
  };

  const handleDownload = () => {
    setIsLoading(true);
    setTimeout(() => {
      const element = document.createElement("a");
      const htmlContent = `
        <html>
          <head>
            <title>Payslip April 2021</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 20px; }
              .container { max-width: 800px; margin: 0 auto; }
              .header { display: flex; justify-content: space-between; margin-bottom: 20px; }
              .company-logo { font-size: 24px; font-weight: bold; color: #f59e0b; }
              .employee-section { margin-bottom: 20px; }
              .details-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px; margin-bottom: 20px; }
              .detail-item { }
              .detail-label { font-size: 12px; color: #666; margin-bottom: 2px; }
              .detail-value { font-weight: 500; }
              .earnings-section { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px; }
              .earnings-column { background: #f9f9f9; padding: 15px; border-radius: 8px; }
              .earnings-row { display: flex; justify-content: space-between; margin-bottom: 8px; }
              .total-row { border-top: 1px solid #ddd; padding-top: 8px; font-weight: bold; }
              .net-salary { background: #dbeafe; padding: 15px; border-radius: 8px; margin-bottom: 15px; }
              .net-salary-amount { font-size: 20px; font-weight: bold; }
              .footer-note { font-size: 12px; color: #666; font-style: italic; }
            </style>
          </head>
          <body>
            <div class="container">
              ${payslipRef.current?.innerHTML || ""}
            </div>
          </body>
        </html>
      `;

      const file = new Blob([htmlContent], { type: "text/html" });
      element.href = URL.createObjectURL(file);
      element.download = "Payslip_April_2021.html";
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
      URL.revokeObjectURL(element.href);
      setIsLoading(false);
    }, 1000);
  };

  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => {
      // Simulate data refresh
      window.location.reload();
    }, 1000);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < 2) setCurrentPage(currentPage + 1);
  };

  return (
    <Dialog open={showPayslipDialog} onOpenChange={setShowPayslipDialog}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0 outline-none border-none rounded-lg shadow-lg">
        <DialogHeader className="sticky top-0 z-10 bg-white px-6 py-4">
          <DialogTitle className="text-lg font-semibold text-gray-900">
            Employee Payslip – April 2021
          </DialogTitle>
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 text-gray-500 hover:text-black"
            onClick={() => setShowPayslipDialog(false)}
          >
            ✕
          </Button>
        </DialogHeader>

        <div className="bg-white rounded-b-lg p-6">
          <Card className="w-full shadow-none border-none">
            {/* Top Header */}
            <CardHeader className="bg-gray-800 text-white rounded-t-lg">
              <div className="flex justify-between items-center px-6 py-4">
                <div>
                  <h2 className="text-lg font-semibold">April 2021</h2>
                  <span className="text-sm text-gray-300">1 / 2</span>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={handleRefresh}
                    disabled={isLoading}
                    variant="ghost"
                    className="text-white hover:bg-gray-700"
                  >
                    <RefreshCw
                      className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`}
                    />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={handleDownload}
                    disabled={isLoading}
                    className="text-white hover:bg-gray-700"
                  >
                    <Download className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={handlePrint}
                    disabled={isLoading}
                    className="text-white hover:bg-gray-700"
                  >
                    <Printer className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>

            {/* Payslip Body */}
            <CardContent className="space-y-8 p-6">
              {/* Company + Employee Details */}
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-2xl font-bold">Payslip</h1>
                  <p className="text-sm text-gray-600 mt-1">
                    Keka Technologies Pvt Ltd
                  </p>
                  <p className="text-xs text-gray-500">
                    Plot no. 104, Kavuri Hills, Hyderabad, TS 500033
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-xl font-bold text-amber-500">
                    ONE AIM IT SOLUTIONS
                  </span>
                </div>
              </div>

              {/* Employee Summary */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">EMP NO</span>
                  <p className="font-medium">1012852</p>
                </div>
                <div>
                  <span className="text-gray-500">DOJ</span>
                  <p className="font-medium">Sep 12, 2017</p>
                </div>
                <div>
                  <span className="text-gray-500">Department</span>
                  <p className="font-medium">User Experience</p>
                </div>
                <div>
                  <span className="text-gray-500">Designation</span>
                  <p className="font-medium">Sr. UX Designer</p>
                </div>
              </div>

              {/* Banking Details */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Mode</span>
                  <p className="font-medium">Bank Transfer</p>
                </div>
                <div>
                  <span className="text-gray-500">Bank</span>
                  <p className="font-medium">ICICI Bank</p>
                </div>
                <div>
                  <span className="text-gray-500">IFSC</span>
                  <p className="font-medium">KBKH0000167</p>
                </div>
                <div>
                  <span className="text-gray-500">Account</span>
                  <p className="font-medium">101287000434233</p>
                </div>
              </div>

              {/* Identifiers */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8 text-sm break-words">
                <div>
                  <p className="text-gray-500 text-xs mb-1">PAN</p>
                  <p className="font-medium break-all">
                    {payslipData.identifiers.pan}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs mb-1">UAN</p>
                  <p className="font-medium break-all">
                    {payslipData.identifiers.uan}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs mb-1">PF Number</p>
                  <p className="font-medium break-all">
                    {payslipData.identifiers.pfNumber}
                  </p>
                </div>
                <div className="sm:col-span-2 lg:col-span-1">
                  <p className="text-gray-500 text-xs mb-1">Pay Cycle Date</p>
                  <p className="font-medium">
                    {payslipData.identifiers.payCycleDate}
                  </p>
                </div>
              </div>

              {/* Salary Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Actual Days</span>
                  <p className="font-medium">31</p>
                </div>
                <div>
                  <span className="text-gray-500">Working Days</span>
                  <p className="font-medium">31</p>
                </div>
                <div>
                  <span className="text-gray-500">LOP</span>
                  <p className="font-medium">0</p>
                </div>
                <div>
                  <span className="text-gray-500">Payable Days</span>
                  <p className="font-medium">31</p>
                </div>
              </div>

              {/* Earnings & Deductions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                  <h3 className="font-semibold mb-2">Earnings</h3>
                  {[
                    ["Basic", 45000],
                    ["HRA", 20000],
                    ["Comm. Reimburse.", 2000],
                    ["Prof. Reimburse.", 2000],
                    ["LTC", 2000],
                    ["Special Allow.", 25000],
                  ].map(([label, value]) => (
                    <div className="flex justify-between text-sm" key={label}>
                      <span>{label}</span>
                      <span>₹ {(value as number).toLocaleString()}</span>
                    </div>
                  ))}
                  <div className="flex justify-between font-bold border-t pt-2">
                    <span>Total Earnings</span>
                    <span>₹ 96,000</span>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                    <h3 className="font-semibold mb-2">Contribution</h3>
                    <div className="flex justify-between text-sm">
                      <span>PF</span>
                      <span>₹ 3000</span>
                    </div>
                    <div className="flex justify-between font-bold border-t pt-2">
                      <span>Total</span>
                      <span>₹ 3000</span>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                    <h3 className="font-semibold mb-2">Deductions</h3>
                    <div className="flex justify-between text-sm">
                      <span>Prof. Tax</span>
                      <span>₹ 200</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>PF</span>
                      <span>₹ 2085</span>
                    </div>
                    <div className="flex justify-between font-bold border-t pt-2">
                      <span>Total</span>
                      <span>₹ 2285</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Net Salary */}
              <div className="bg-blue-50 p-4 rounded-lg text-sm">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold">Net Salary</span>
                  <span className="text-lg font-bold">₹ 90,715</span>
                </div>
                <p className="text-gray-600 italic text-xs">
                  Ninety Thousand & Seven Hundred Fifteen Rupees Only
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FunctionalPayslipPage;
