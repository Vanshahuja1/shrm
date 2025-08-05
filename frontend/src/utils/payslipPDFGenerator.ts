import jsPDF from 'jspdf';

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
  status: 'draft' | 'in_process' | 'pending' | 'paid';
  departmentName: string;
  designation: string;
  attendanceData?: {
    totalWorkingDays: number;
    presentDays: number;
    absentDays: number;
    halfDays: number;
    overtimeHours: number;
    lateComings: number;
  };
  createdAt: string;
  updatedAt: string;
}

interface EmployeeDetails {
  _id: string
  id: string
  name: string
  email: string
  phone: string
  role: "intern" | "employee" | "manager" | "hr" | "admin"
  currentAddress: string
  dateOfBirth:
  | {
    $date: string
  }
  | string
  performance: number
  joiningDate:
  | {
    $date: string
  }
  | string
  currentProjects: string[]
  pastProjects: string[]
  attendanceCount30Days: number
  taskCountPerDay: number
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  tasks: any[]
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  responses: any[]
  managers: string[]
  photo: string
  upperManager: string
  salary: number
  adharCard: string
  panCard: string
  experience: number
  projects: string[]
  organizationName: string
  departmentName: string
  designation: string
  isActive: boolean
  organizationId: {
    $oid: string
  }
  departmentId: {
    $oid: string
  }
  documents: {
    aadharFront?: string
    aadharBack?: string
    panCard?: string
    resume?: string
    experienceLetter?: string
    passbookPhoto?: string
    tenthMarksheet?: string
    twelfthMarksheet?: string
    degreeMarksheet?: string
    policy?: string
  }
  bankDetails: {
    accountHolder: string
    accountNumber: string
    ifsc: string
    branch: string
    accountType: "CURRENT" | "SAVING"
  }
  workLog: {
    hoursWorked: number
  }
  passwordChangedAt: {
    $date: string
  }
  createdAt: {
    $date: string
  }
  updatedAt: {
    $date: string
  }
  lastLogin?: {
    $date: string
  }
  managerName?: string
 
}

export const generateCustomPayslipPDF = (payslipData: EmployeePayroll , EmployeeDetails :EmployeeDetails  ): void => {
  const pdf = new jsPDF('p', 'mm', 'a4');
  const pageWidth = pdf.internal.pageSize.getWidth();
  let yPosition = 20;
  
  // Colors
  const primaryColor = [41, 128, 185]; // Blue
  const darkColor = [44, 62, 80]; // Dark blue-gray
  const lightGray = [236, 240, 241]; // Light gray
  const successColor = [39, 174, 96]; // Green
  const dangerColor = [231, 76, 60]; // Red

  // Helper functions
  const formatCurrency = (amount: number): string => {
    return `Rs. ${new Intl.NumberFormat('en-IN', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)}`;
  };

  const addText = (text: string, x: number, y: number, options: {
    size?: number;
    style?: 'normal' | 'bold';
    color?: number[];
    align?: 'left' | 'center' | 'right';
  } = {}) => {
    const { size = 10, style = 'normal', color = darkColor, align = 'left' } = options;
    
    pdf.setFontSize(size);
    pdf.setFont('helvetica', style);
    pdf.setTextColor(color[0], color[1], color[2]);
    
    if (align === 'center') {
      pdf.text(text, x, y, { align: 'center' });
    } else if (align === 'right') {
      pdf.text(text, x, y, { align: 'right' });
    } else {
      pdf.text(text, x, y);
    }
  };

  const addLine = (x1: number, y1: number, x2: number, y2: number, color = lightGray) => {
    pdf.setDrawColor(color[0], color[1], color[2]);
    pdf.setLineWidth(0.5);
    pdf.line(x1, y1, x2, y2);
  };

  const addRect = (x: number, y: number, width: number, height: number, fillColor?: number[]) => {
    if (fillColor) {
      pdf.setFillColor(fillColor[0], fillColor[1], fillColor[2]);
      pdf.rect(x, y, width, height, 'F');
    } else {
      pdf.setDrawColor(lightGray[0], lightGray[1], lightGray[2]);
      pdf.rect(x, y, width, height);
    }
  };

  // Header Section
  addRect(0, 0, pageWidth, 35, primaryColor);
  addText('PAYSLIP', pageWidth / 2, 15, { 
    size: 20, 
    style: 'bold', 
    color: [255, 255, 255], 
    align: 'center' 
  });
  addText(EmployeeDetails.organizationName || 'SHRM Organization', pageWidth / 2, 25, { 
    size: 12, 
    color: [255, 255, 255], 
    align: 'center' 
  });

  yPosition = 50;

  // Company Information
  addText('Company Information', 15, yPosition, { size: 12, style: 'bold' });
  yPosition += 8;
  addText(EmployeeDetails.organizationName || 'SHRM Organization', 15, yPosition);
  yPosition += 5;
  addText('Organization Address, City, State - PIN', 15, yPosition);
  yPosition += 5;
  addText('Email: hr@organization.com | Phone: +91-XXXXXXXXXX', 15, yPosition);
  yPosition += 15;

  // Employee Information Section
  addRect(10, yPosition - 5, pageWidth - 20, 8, lightGray);
  addText('EMPLOYEE INFORMATION', 15, yPosition, { size: 11, style: 'bold' });
  yPosition += 10;

  // Employee details in two columns
  const leftCol = 15;
  const rightCol = pageWidth / 2 + 10;
  
  addText(`Employee Name: ${EmployeeDetails.name}`, leftCol, yPosition, { style: 'bold' });
  addText(`Employee ID: ${EmployeeDetails.id}`, rightCol, yPosition);
  yPosition += 7;
  
  addText(`Department: ${EmployeeDetails.departmentName}`, leftCol, yPosition);
  addText(`Designation: ${EmployeeDetails.designation}`, rightCol, yPosition);
  yPosition += 7;
  
  addText(`Email: ${EmployeeDetails.email}`, leftCol, yPosition);
  addText(`Phone: ${EmployeeDetails.phone}`, rightCol, yPosition);
  yPosition += 7;
  
  // Format and display joining date
  let joiningDate = '';
  if (EmployeeDetails.joiningDate) {
    if (typeof EmployeeDetails.joiningDate === 'string') {
      joiningDate = new Date(EmployeeDetails.joiningDate).toLocaleDateString('en-IN');
    } else if (EmployeeDetails.joiningDate.$date) {
      joiningDate = new Date(EmployeeDetails.joiningDate.$date).toLocaleDateString('en-IN');
    }
  }
  
  if (joiningDate) {
    addText(`Joining Date: ${joiningDate}`, leftCol, yPosition);
  }
  
  // Add bank details
  if (EmployeeDetails.bankDetails?.accountNumber) {
    addText(`Bank A/C: ${EmployeeDetails.bankDetails.accountNumber}`, rightCol, yPosition);
  }
  yPosition += 7;
  
  if (EmployeeDetails.bankDetails?.ifsc) {
    addText(`IFSC: ${EmployeeDetails.bankDetails.ifsc}`, leftCol, yPosition);
  }
  
  if (EmployeeDetails.panCard) {
    addText(`PAN: ${EmployeeDetails.panCard}`, rightCol, yPosition);
  }
  yPosition += 7;
  
  // Add base salary
  if (EmployeeDetails.salary) {
    addText(`Base Salary: Rs. ${new Intl.NumberFormat('en-IN').format(EmployeeDetails.salary)}`, leftCol, yPosition);
  }
  yPosition += 15;

  // Payroll Period Section
  addRect(10, yPosition - 5, pageWidth - 20, 8, lightGray);
  addText('PAYROLL PERIOD', 15, yPosition, { size: 11, style: 'bold' });
  yPosition += 10;
  
  addText(`Period: ${payslipData.payrollPeriod.label}`, leftCol, yPosition);
  addText(`Date Range: ${payslipData.payrollPeriod.range}`, rightCol, yPosition);
  yPosition += 7;
  
  addText(`Payable Days: ${payslipData.payableDays}`, leftCol, yPosition);
  if (payslipData.attendanceData) {
    addText(`Present Days: ${payslipData.attendanceData.presentDays}`, rightCol, yPosition);
    yPosition += 7;
    addText(`Working Days: ${payslipData.attendanceData.totalWorkingDays}`, leftCol, yPosition);
    addText(`Absent Days: ${payslipData.attendanceData.absentDays}`, rightCol, yPosition);
  }
  yPosition += 15;

  // Earnings Section
  addRect(10, yPosition - 5, pageWidth - 20, 8, [46, 204, 113]);
  addText('EARNINGS', 15, yPosition, { size: 11, style: 'bold', color: [255, 255, 255] });
  yPosition += 12;

  const earningsItems = [
    { label: 'Basic Salary', amount: payslipData.earnings.basicSalary },
    { label: 'HRA', amount: payslipData.earnings.hra },
    { label: 'Conveyance Allowance', amount: payslipData.earnings.conveyanceAllowance },
    { label: 'Medical Allowance', amount: payslipData.earnings.medicalAllowance },
    { label: 'Special Allowance', amount: payslipData.earnings.specialAllowance },
    { label: 'Bonus', amount: payslipData.earnings.bonus },
    { label: 'Overtime', amount: payslipData.earnings.overtime },
    { label: 'Arrears', amount: payslipData.earnings.arrears },
    { label: 'Other Earnings', amount: payslipData.earnings.otherEarnings },
  ];

  earningsItems.forEach(item => {
    if (item.amount > 0) {
      addText(item.label, leftCol, yPosition);
      addText(formatCurrency(item.amount), rightCol + 50, yPosition, { align: 'right' });
      yPosition += 6;
    }
  });

  // Total Earnings
  addLine(leftCol, yPosition, pageWidth - 15, yPosition);
  yPosition += 5;
  addText('Total Earnings', leftCol, yPosition, { style: 'bold' });
  addText(formatCurrency(payslipData.totalEarnings), rightCol + 50, yPosition, { 
    style: 'bold', 
    color: successColor, 
    align: 'right' 
  });
  yPosition += 15;

  // Deductions Section
  addRect(10, yPosition - 5, pageWidth - 20, 8, [231, 76, 60]);
  addText('DEDUCTIONS', 15, yPosition, { size: 11, style: 'bold', color: [255, 255, 255] });
  yPosition += 12;

  const deductionItems = [
    { label: 'Provident Fund (PF)', amount: payslipData.deductions.pf },
    { label: 'ESI', amount: payslipData.deductions.esi },
    { label: 'Professional Tax', amount: payslipData.deductions.professionalTax },
    { label: 'TDS', amount: payslipData.deductions.tds },
    { label: 'Loan Deduction', amount: payslipData.deductions.loanDeduction },
    { label: 'Leave Deduction', amount: payslipData.deductions.leaveDeduction },
    { 
      label: `Attendance Deduction (${payslipData.attendanceData?.absentDays || 0} absent${(payslipData.attendanceData?.lateComings || 0) > 0 ? `, ${payslipData.attendanceData?.lateComings} late` : ''})`, 
      amount: payslipData.deductions.attendanceDeduction 
    },
    { label: 'Other Deductions', amount: payslipData.deductions.otherDeductions },
  ];

  deductionItems.forEach(item => {
    if (item.amount > 0 || item.label.includes('Attendance Deduction')) {
      addText(item.label, leftCol, yPosition);
      addText(formatCurrency(item.amount), rightCol + 50, yPosition, { align: 'right' });
      yPosition += 6;
    }
  });

  // Add attendance deduction explanation if there are absent days or late comings
  if (payslipData.attendanceData && (payslipData.attendanceData.absentDays > 0 || (payslipData.attendanceData.lateComings || 0) > 0)) {
    yPosition += 3;
    addText('Attendance Calculation:', leftCol, yPosition, { size: 8, style: 'bold' });
    yPosition += 4;
    
    const perDayAmount = Math.round((EmployeeDetails.salary || 0) / 26);
    const absentDeduction = perDayAmount * payslipData.attendanceData.absentDays;
    const lateDeduction = (payslipData.attendanceData.lateComings || 0) * 100;
    const totalCalculated = absentDeduction + lateDeduction;
    
    if (payslipData.attendanceData.absentDays > 0) {
      addText(
        `Absent Days: Rs.${perDayAmount.toLocaleString('en-IN')} × ${payslipData.attendanceData.absentDays} days = Rs.${absentDeduction.toLocaleString('en-IN')}`, 
        leftCol, 
        yPosition, 
        { size: 7, color: [100, 100, 100] }
      );
      yPosition += 4;
    }
    
    if ((payslipData.attendanceData.lateComings || 0) > 0) {
      addText(
        `Late Coming Penalty: Rs.100 × ${payslipData.attendanceData.lateComings} = Rs.${lateDeduction.toLocaleString('en-IN')}`, 
        leftCol, 
        yPosition, 
        { size: 7, color: [100, 100, 100] }
      );
      yPosition += 4;
    }
    
    addText(
      `Total Calculated: Rs.${totalCalculated.toLocaleString('en-IN')}`, 
      leftCol, 
      yPosition, 
      { size: 7, style: 'bold', color: [80, 80, 80] }
    );
    yPosition += 6;
    
    if (payslipData.deductions.attendanceDeduction === 0 && totalCalculated > 0) {
      addText('Note: Attendance deduction waived by HR', leftCol, yPosition, { size: 7, color: [200, 100, 0] });
      yPosition += 6;
    }
  }

  // Total Deductions
  addLine(leftCol, yPosition, pageWidth - 15, yPosition);
  yPosition += 5;
  addText('Total Deductions', leftCol, yPosition, { style: 'bold' });
  addText(formatCurrency(payslipData.totalDeductions), rightCol + 50, yPosition, { 
    style: 'bold', 
    color: dangerColor, 
    align: 'right' 
  });
  yPosition += 15;

  // Net Pay Section
  addRect(10, yPosition - 5, pageWidth - 20, 15, primaryColor);
  addText('NET PAY', 15, yPosition + 5, { size: 14, style: 'bold', color: [255, 255, 255] });
  addText(formatCurrency(payslipData.netPay), pageWidth - 15, yPosition + 5, { 
    size: 14, 
    style: 'bold', 
    color: [255, 255, 255], 
    align: 'right' 
  });
  yPosition += 25;

  // Footer
  addLine(15, yPosition, pageWidth - 15, yPosition);
  yPosition += 8;
  addText('This is a computer-generated payslip and does not require a signature.', 
    pageWidth / 2, yPosition, { size: 9, align: 'center', color: [149, 165, 166] });
  yPosition += 5;
  addText(`Generated on: ${new Date().toLocaleDateString('en-IN')}`, 
    pageWidth / 2, yPosition, { size: 8, align: 'center', color: [149, 165, 166] });

  // Save the PDF
  const fileName = `Payslip_${EmployeeDetails.name.replace(/\s+/g, '_')}_${payslipData.payrollPeriod.label.replace(/\s+/g, '_')}.pdf`;
  pdf.save(fileName);
};
