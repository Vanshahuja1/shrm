const User = require('../models/userModel');
const Attendance = require('../models/attendanceModel');
const { EmployeePayroll } = require('../models/payrollModel');

class PayrollCalculationService {
  
  /**
   * Calculate payslip based on attendance and user salary data
   * @param {string} employeeId - Employee ID
   * @param {Date} startDate - Payroll period start date
   * @param {Date} endDate - Payroll period end date
   * @param {Object} customAdjustments - HR custom adjustments (optional)
   * @param {Object} allowanceConfig - Allowance configuration (optional)
   * @param {Object} attendanceConfig - Attendance deduction configuration (optional)
   * @returns {Object} Calculated payroll data
   */
  async calculatePayslip(employeeId, startDate, endDate, customAdjustments = {}, allowanceConfig = {}, attendanceConfig = {}) {
    try {
      // Get employee data with salary information
      const employee = await User.findOne({ id: employeeId })
        .populate('organizationId', 'name')
        .populate('departmentId', 'name');

      if (!employee) {
        throw new Error('Employee not found');
      }

      // Get attendance data for the period
      const attendanceData = await this.getAttendanceData(employeeId, startDate, endDate);
      
      // Calculate working days in the period
      const totalWorkingDays = this.calculateWorkingDays(startDate, endDate);
      
      console.log('Payslip calculation started:', {
        employeeId,
        employeeName: employee.name,
        period: `${startDate.toISOString().split('T')[0]} to ${endDate.toISOString().split('T')[0]}`,
        totalWorkingDays,
        attendanceData
      });
      
      // Calculate earnings based on attendance and salary
      const earnings = this.calculateEarnings(employee, attendanceData, totalWorkingDays, customAdjustments.earnings, allowanceConfig, attendanceConfig);
      
      // Calculate deductions
      const deductions = this.calculateDeductions(employee, earnings, attendanceData, customAdjustments.deductions, attendanceConfig);
      
      // Calculate totals
      const totalEarnings = Object.values(earnings).reduce((sum, val) => sum + (val || 0), 0);
      const totalDeductions = Object.values(deductions).reduce((sum, val) => sum + (val || 0), 0);
      const netPay = totalEarnings - totalDeductions;

      return {
        employeeId: employee.id,
        name: employee.name,
        employee: {
          name: employee.name,
          email: employee.email,
          designation: employee.designation,
          departmentName: employee.departmentId?.name || 'N/A'
        },
        payrollPeriod: {
          startDate,
          endDate,
          label: this.formatPeriodLabel(startDate, endDate),
          range: this.formatPeriodRange(startDate, endDate)
        },
        payableDays: `${attendanceData.presentDays}/${totalWorkingDays}`,
        earnings,
        deductions,
        totalEarnings,
        totalDeductions,
        netPay,
        attendanceData: {
          totalWorkingDays,
          presentDays: attendanceData.presentDays,
          absentDays: attendanceData.absentDays, // Use actual absent days from attendance records
          halfDays: attendanceData.halfDays,
          overtimeHours: attendanceData.overtimeHours,
          lateComings: attendanceData.lateComings
        },
        departmentName: employee.departmentId?.name || 'N/A',
        designation: employee.designation || 'Employee',
        dateOfJoining: employee.joiningDate,
        status: 'draft'
      };

    } catch (error) {
      console.error('Error calculating payslip:', error);
      throw error;
    }
  }

  /**
   * Get attendance data for an employee within a date range
   */
  async getAttendanceData(employeeId, startDate, endDate) {
    const attendanceRecords = await Attendance.find({
      employeeId,
      date: {
        $gte: startDate.toISOString().split('T')[0],
        $lte: endDate.toISOString().split('T')[0]
      }
    });

    // Calculate total working days first
    const totalWorkingDays = this.calculateWorkingDays(startDate, endDate);

    let presentDays = 0;
    let explicitAbsentDays = 0;
    let halfDays = 0;
    let overtimeHours = 0;
    let lateComings = 0;

    // Process attendance records
    attendanceRecords.forEach(record => {
      switch (record.status) {
        case 'present':
          presentDays++;
          break;
        case 'absent':
          explicitAbsentDays++;
          break;
        case 'late':
          presentDays++;
          lateComings++;
          break;
        case 'holiday':
          // Don't count holidays in absent or present days
          break;
      }

      // Check for half days (less than 4 hours worked)
      if (record.totalHours > 0 && record.totalHours < 4) {
        halfDays++;
        presentDays--; // Remove from full present days
      }

      // Add overtime hours
      if (record.overtimeHours > 0) {
        overtimeHours += record.overtimeHours;
      }
    });

    // Calculate actual absent days: total working days minus present days minus holidays
    const holidayRecords = attendanceRecords.filter(record => record.status === 'holiday').length;
    const actualWorkingDays = totalWorkingDays - holidayRecords;
    const absentDays = Math.max(0, actualWorkingDays - presentDays - halfDays);

    console.log('Attendance calculation debug:', {
      employeeId,
      totalWorkingDays,
      holidayRecords,
      actualWorkingDays,
      presentDays,
      halfDays,
      explicitAbsentDays,
      calculatedAbsentDays: absentDays,
      attendanceRecordsCount: attendanceRecords.length
    });

    return {
      presentDays,
      absentDays, // Use calculated absent days instead of explicit ones
      halfDays,
      overtimeHours,
      lateComings
    };
  }

  /**
   * Calculate working days between two dates (excluding only Sundays)
   */
  calculateWorkingDays(startDate, endDate) {
    let workingDays = 0;
    const currentDate = new Date(startDate);
    
    while (currentDate <= endDate) {
      const dayOfWeek = currentDate.getDay();
      // Skip only Sundays (0 = Sunday), include Saturday (6 = Saturday) as working day
      if (dayOfWeek !== 0) {
        workingDays++;
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    return workingDays;
  }

  /**
   * Calculate earnings based on salary and attendance
   */
  calculateEarnings(employee, attendanceData, totalWorkingDays, customEarnings = {}, allowanceConfig = {}, attendanceConfig = {}) {
    const baseSalary = employee.salary || 0;
    
    // Check if attendance-based calculation is enabled
    const isAttendanceBasedCalculationEnabled = attendanceConfig.enabled !== false; // Default to true if not specified
    
    // Calculate basic salary based on attendance configuration
    let basicSalary;
    
    if (customEarnings.basicSalary !== undefined) {
      // Custom basic salary override
      basicSalary = customEarnings.basicSalary;
    } else if (isAttendanceBasedCalculationEnabled) {
      // Calculate per-day salary and multiply by attendance
      const perDaySalary = baseSalary / totalWorkingDays;
      basicSalary = Math.round(perDaySalary * (attendanceData.presentDays + (attendanceData.halfDays * 0.5)));
      
      console.log('Attendance-based salary calculation:', {
        employeeId: employee.id,
        baseSalary,
        perDaySalary,
        presentDays: attendanceData.presentDays,
        halfDays: attendanceData.halfDays,
        calculatedBasicSalary: basicSalary,
        attendanceBasedEnabled: isAttendanceBasedCalculationEnabled
      });
    } else {
      // Use full base salary when attendance-based calculation is disabled
      basicSalary = baseSalary;
      
      console.log('Fixed salary calculation (attendance disabled):', {
        employeeId: employee.id,
        baseSalary,
        basicSalary,
        attendanceBasedEnabled: isAttendanceBasedCalculationEnabled
      });
    }

    // Calculate allowances with configuration
    let hra = 0;
    if (allowanceConfig.hra && allowanceConfig.hra.enabled) {
      if (allowanceConfig.hra.method === 'percentage') {
        hra = Math.round(basicSalary * (allowanceConfig.hra.value / 100));
      } else {
        hra = allowanceConfig.hra.value;
      }
    } else if (customEarnings.hra !== undefined) {
      hra = customEarnings.hra;
    } else {
      hra = Math.round(basicSalary * 0.30); // Default 30% of basic salary
    }

    let conveyanceAllowance = 0;
    if (allowanceConfig.conveyance && allowanceConfig.conveyance.enabled) {
      if (allowanceConfig.conveyance.method === 'percentage') {
        conveyanceAllowance = Math.round(basicSalary * (allowanceConfig.conveyance.value / 100));
      } else {
        conveyanceAllowance = allowanceConfig.conveyance.value;
      }
    } else if (customEarnings.conveyanceAllowance !== undefined) {
      conveyanceAllowance = customEarnings.conveyanceAllowance;
    } else {
      conveyanceAllowance = 2000; // Default fixed amount
    }

    let medicalAllowance = 0;
    if (allowanceConfig.medical && allowanceConfig.medical.enabled) {
      if (allowanceConfig.medical.method === 'percentage') {
        medicalAllowance = Math.round(basicSalary * (allowanceConfig.medical.value / 100));
      } else {
        medicalAllowance = allowanceConfig.medical.value;
      }
    } else if (customEarnings.medicalAllowance !== undefined) {
      medicalAllowance = customEarnings.medicalAllowance;
    } else {
      medicalAllowance = 1500; // Default fixed amount
    }

    let specialAllowance = 0;
    if (allowanceConfig.special && allowanceConfig.special.enabled) {
      if (allowanceConfig.special.method === 'percentage') {
        specialAllowance = Math.round(basicSalary * (allowanceConfig.special.value / 100));
      } else {
        specialAllowance = allowanceConfig.special.value;
      }
    } else if (customEarnings.specialAllowance !== undefined) {
      specialAllowance = customEarnings.specialAllowance;
    } else {
      specialAllowance = Math.round(basicSalary * 0.10); // Default 10% of basic salary
    }

    // Calculate overtime (if any)
    const overtimeRate = (baseSalary / totalWorkingDays) / 8; // Per hour rate
    const overtime = customEarnings.overtime !== undefined 
      ? customEarnings.overtime 
      : Math.round(overtimeRate * attendanceData.overtimeHours);

    return {
      basicSalary,
      hra,
      conveyanceAllowance,
      medicalAllowance,
      specialAllowance,
      bonus: customEarnings.bonus || 0,
      overtime,
      arrears: customEarnings.arrears || 0,
      otherEarnings: customEarnings.otherEarnings || 0
    };
  }

  /**
   * Calculate deductions
   */
  calculateDeductions(employee, earnings, attendanceData, customDeductions = {}, attendanceConfig = {}) {
    const basicSalary = earnings.basicSalary;

    // PF calculation (12% of basic salary)
    const pf = customDeductions.pf !== undefined 
      ? customDeductions.pf 
      : Math.round(basicSalary * 0.12);

    // ESI calculation (0.75% of gross salary, applicable if gross < 25000)
    const grossSalary = Object.values(earnings).reduce((sum, val) => sum + (val || 0), 0);
    const esi = customDeductions.esi !== undefined 
      ? customDeductions.esi 
      : (grossSalary <= 25000 ? Math.round(grossSalary * 0.0075) : 0);

    // Professional Tax (varies by state, default 200)
    const professionalTax = customDeductions.professionalTax !== undefined 
      ? customDeductions.professionalTax 
      : 200;

    // TDS calculation (basic calculation, can be customized)
    const tds = customDeductions.tds !== undefined 
      ? customDeductions.tds 
      : (grossSalary > 50000 ? Math.round(grossSalary * 0.05) : 0);

    // Check if attendance-based deduction is enabled
    const isAttendanceDeductionEnabled = attendanceConfig.enabled !== false; // Default to true if not specified
    
    let attendanceDeduction = 0;
    
    if (isAttendanceDeductionEnabled) {
      // Attendance deduction for absent days
      const perDaySalary = employee.salary / 26; // Assuming 26 working days per month
      const baseAttendanceDeduction = Math.round(perDaySalary * attendanceData.absentDays);
      
      // Debug logging
      console.log('Deduction calculation debug:', {
        employeeId: employee.id,
        employeeName: employee.name,
        employeeSalary: employee.salary,
        perDaySalary,
        absentDays: attendanceData.absentDays,
        presentDays: attendanceData.presentDays,
        baseAttendanceDeduction,
        customAttendanceDeduction: customDeductions.attendanceDeduction,
        attendanceDeductionEnabled: isAttendanceDeductionEnabled,
        customDeductionsProvided: customDeductions
      });
      
      // Late coming penalty (configurable based on attendance config)
      const shouldIncludeLatePenalty = attendanceConfig.includeLatePenalty !== false; // Default to true
      const lateComingPenalty = shouldIncludeLatePenalty ? (attendanceData.lateComings * 100) : 0; // Rs. 100 per late coming
      
      // Calculate total attendance deduction
      const totalAttendanceDeduction = baseAttendanceDeduction + lateComingPenalty;
      
      // Apply custom deduction if provided, otherwise use calculated value
      attendanceDeduction = customDeductions.attendanceDeduction !== undefined 
        ? customDeductions.attendanceDeduction 
        : totalAttendanceDeduction;

      console.log('Final attendance deduction:', {
        baseAttendanceDeduction,
        lateComingPenalty,
        totalAttendanceDeduction,
        finalAttendanceDeduction: attendanceDeduction,
        wasCustomOverride: customDeductions.attendanceDeduction !== undefined,
        attendanceDeductionEnabled: isAttendanceDeductionEnabled,
        includeLatePenalty: attendanceConfig.includeLatePenalty !== false
      });
    } else {
      // Attendance-based deduction is disabled
      attendanceDeduction = customDeductions.attendanceDeduction || 0;
      
      console.log('Attendance deduction disabled:', {
        employeeId: employee.id,
        employeeName: employee.name,
        attendanceDeductionEnabled: isAttendanceDeductionEnabled,
        finalAttendanceDeduction: attendanceDeduction,
        customOverride: customDeductions.attendanceDeduction
      });
    }

    return {
      pf,
      esi,
      professionalTax,
      tds,
      loanDeduction: customDeductions.loanDeduction || 0,
      leaveDeduction: customDeductions.leaveDeduction || 0,
      attendanceDeduction, // Use the final calculated or custom value based on attendance config
      otherDeductions: customDeductions.otherDeductions || 0
    };
  }

  /**
   * Format period label
   */
  formatPeriodLabel(startDate, endDate) {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
                   'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${months[endDate.getMonth()]} ${endDate.getFullYear()}`;
  }

  /**
   * Format period range
   */
  formatPeriodRange(startDate, endDate) {
    const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 
                   'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
    
    const startDay = startDate.getDate().toString().padStart(2, '0');
    const endDay = endDate.getDate().toString().padStart(2, '0');
    const startMonth = months[startDate.getMonth()];
    const endMonth = months[endDate.getMonth()];
    
    return `${startMonth} ${startDay} - ${endMonth} ${endDay}`;
  }

  /**
   * Save or update payslip in database
   */
  async savePayslip(payslipData, hrUserId) {
    try {
      const existingPayslip = await EmployeePayroll.findOne({
        employeeId: payslipData.employeeId,
        'payrollPeriod.startDate': payslipData.payrollPeriod.startDate,
        'payrollPeriod.endDate': payslipData.payrollPeriod.endDate
      });

      if (existingPayslip) {
        // Update existing payslip
        Object.assign(existingPayslip, payslipData);
        
        // Add to edit history
        existingPayslip.editHistory.push({
          field: 'full_payslip',
          oldValue: 'previous_calculation',
          newValue: 'recalculated',
          editedBy: hrUserId,
          editedAt: new Date()
        });

        await existingPayslip.save();
        return existingPayslip;
      } else {
        // Create new payslip
        const newPayslip = new EmployeePayroll(payslipData);
        await newPayslip.save();
        return newPayslip;
      }
    } catch (error) {
      console.error('Error saving payslip:', error);
      throw error;
    }
  }
}

module.exports = new PayrollCalculationService();
