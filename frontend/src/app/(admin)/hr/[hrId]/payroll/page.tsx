"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Play, Eye, RefreshCw, User } from "lucide-react";
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
import axiosInstance from "@/lib/axiosInstance";
import { generatePayslipPDF } from "../../../../../utils/generatePayslipPDF";

interface EmployeePayroll {
  _id: string;
  employeeId: string;
  name: string;
  employee?: {
    name: string;
    email: string;
    designation: string;
    departmentName: string;
  };
  payrollPeriod: {
    label: string;
    range: string;
    startDate: string;
    endDate: string;
  };
  payableDays: string;
  earnings: {
    basicSalary: number;
    hra: number;
    conveyanceAllowance: number;
    medicalAllowance: number;
    specialAllowance: number;
    bonus: number;
    overtime: number;
    arrears: number;
    otherEarnings: number;
  };
  deductions: {
    pf: number;
    esi: number;
    professionalTax: number;
    tds: number;
    loanDeduction: number;
    leaveDeduction: number;
    attendanceDeduction: number;
    otherDeductions: number;
  };
  totalEarnings: number;
  totalDeductions: number;
  netPay: number;
  departmentName: string;
  designation: string;
  dateOfJoining: string;
  status: string;
}

interface PayrollPeriod {
  _id: string;
  label: string;
  range: string;
  startDate: string;
  endDate: string;
  status: string;
  active: boolean;
}

export default function PayrollPage() {
  const { hrId } = useParams();
  const [payrollRecords, setPayrollRecords] = useState<EmployeePayroll[]>([]);
  const [activePeriod, setActivePeriod] = useState<PayrollPeriod | null>(null);
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState(false);

  // Fetch payroll periods
  const fetchPayrollPeriods = async () => {
    try {
      const response = await axiosInstance.get('/payroll/periods');
      if (response.data.success) {
        const active = response.data.data.find((p: PayrollPeriod) => p.active);
        setActivePeriod(active || null);
      }
    } catch (error) {
      console.error('Error fetching payroll periods:', error);
    }
  };

  // Fetch payroll records
  const fetchPayrollRecords = async () => {
    try {
      setLoading(true);
      // Try fetching without any query parameters first
      const response = await axiosInstance.get('/payroll/employees');
      
      if (response.data.success) {
        setPayrollRecords(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching payroll records:', error);
    } finally {
      setLoading(false);
    }
  };

  // Process payroll
  const handleProcessPayroll = async () => {
    try {
      setProcessing(true);
      const response = await axiosInstance.post('/payroll/process', {
        periodId: activePeriod?._id
      });
      
      if (response.data.success) {
        alert('Payroll processed successfully!');
        fetchPayrollRecords();
      }
    } catch (error) {
      console.error('Error processing payroll:', error);
      alert('Failed to process payroll');
    } finally {
      setProcessing(false);
    }
  };

  // Generate payslip
  const handleGeneratePayslip = async (employeeId: string) => {
    try {
      const response = await axiosInstance.post('/payroll/generate-payslip', {
        employeeId,
        month: activePeriod?.label?.split(' ')[0],
        year: activePeriod?.label?.split(' ')[1]
      });
      
      if (response.data.success) {
        // Generate PDF using the utility function
        const payslipData = response.data.data;
        generatePayslipPDF(payslipData);
        
        // Show success message
        alert('Payslip PDF generated and downloaded successfully!');
      }
    } catch (error) {
      console.error('Error generating payslip:', error);
      alert('Failed to generate payslip');
    }
  };

  useEffect(() => {
    fetchPayrollPeriods();
    fetchPayrollRecords(); // Fetch records immediately on load
  }, []);

  useEffect(() => {
    // This effect can be used later if we want to filter by active period
    if (activePeriod) {
      console.log('Active period selected:', activePeriod.label);
    }
  }, [activePeriod]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getMonthName = (label: string) => {
    return label || 'Unknown Period';
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Payroll Management</h1>
          <p className="text-gray-600 mt-1">
            {activePeriod 
              ? `${getMonthName(activePeriod.label)} - HR ID: ${hrId}`
              : 'No active period'
            }
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={fetchPayrollRecords}
            disabled={loading}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button
            variant="outline"
            onClick={() => fetchPayrollRecords()}
            className="flex items-center gap-2"
          >
            <Eye className="w-4 h-4" />
            Preview
          </Button>
          <Button
            onClick={handleProcessPayroll}
            disabled={processing || !activePeriod}
            className="flex items-center gap-2"
          >
            <Play className="w-4 h-4" />
            {processing ? 'Processing...' : 'Run Payroll'}
          </Button>
        </div>
      </div>

      {/* Summary Card */}
      {activePeriod && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Payroll Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-gray-600">Total Employees</p>
                <p className="text-2xl font-bold">{payrollRecords.length}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Earnings</p>
                <p className="text-2xl font-bold text-green-600">
                  {formatCurrency(
                    payrollRecords.reduce((sum, record) => sum + record.totalEarnings, 0)
                  )}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Deductions</p>
                <p className="text-2xl font-bold text-red-600">
                  {formatCurrency(
                    payrollRecords.reduce((sum, record) => sum + record.totalDeductions, 0)
                  )}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Net Payroll</p>
                <p className="text-2xl font-bold text-blue-600">
                  {formatCurrency(
                    payrollRecords.reduce((sum, record) => sum + record.netPay, 0)
                  )}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Payroll Records Table */}
      <Card>
        <CardHeader>
          <CardTitle>Employee Payroll Records</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <RefreshCw className="w-6 h-6 animate-spin" />
              <span className="ml-2">Loading payroll records...</span>
            </div>
          ) : payrollRecords.length === 0 ? (
            <div className="text-center py-8">
              <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No payroll records found</p>
              <p className="text-sm text-gray-500">
                {activePeriod ? 'Process payroll to generate records' : 'Please select an active payroll period'}
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead className="text-right">Payable Days</TableHead>
                  <TableHead className="text-right">Status</TableHead>
                  <TableHead className="text-right">Gross Earnings</TableHead>
                  <TableHead className="text-right">Deductions</TableHead>
                  <TableHead className="text-right">Net Salary</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payrollRecords.map((record) => (
                  <TableRow key={record._id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">
                          {record.employee?.name || record.name || `Employee ${record.employeeId}`}
                        </p>
                        <p className="text-sm text-gray-500">
                          {record.employee?.designation || record.designation || ''}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      {record.employee?.departmentName || record.departmentName || 'N/A'}
                    </TableCell>
                    <TableCell className="text-right">
                      {record.payableDays}
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge
                        variant={record.status === 'processed' ? 'default' : 'secondary'}
                      >
                        {record.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(record.totalEarnings)}
                    </TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(record.totalDeductions)}
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {formatCurrency(record.netPay)}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleGeneratePayslip(record.employeeId)}
                      >
                        PDF Payslip
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
