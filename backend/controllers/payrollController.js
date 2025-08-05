const { EmployeePayroll, PayrollPeriod, EmployeeJoineesExits } = require('../models/payrollModel');
const { FullAndFinal, PayrollAdjustment, LeaveAttendanceDeduction } = require('../models/payrollAdjustmentModel');
const User = require('../models/userModel');
const Organization = require('../models/organizationModel');

// Employee Payroll Controllers
const getEmployeePayrollRecords = async (req, res) => {
  try {
    // Get organizationId from query params instead of middleware
    const { organizationId, periodId, status, departmentName } = req.query;

    let filter = {};
    
    // Only add organizationId to filter if provided
    if (organizationId && organizationId !== 'default-org') {
      filter.organizationId = organizationId;
    }
    
    if (periodId) filter['payrollPeriod._id'] = periodId;
    if (status) filter.status = status;
    if (departmentName) filter.departmentName = departmentName;

    let payrollRecords = await EmployeePayroll.find(filter)
      .sort({ createdAt: -1 });

    // If no records exist, create some sample data
    if (payrollRecords.length === 0) {
      console.log('No payroll records found, creating sample data...');
      
      // Get some users from the database
      const users = await User.find({}).limit(5);
      
      if (users.length > 0) {
        const samplePayrollRecords = users.map((user, index) => ({
          employeeId: user.id,
          name: user.name,
          payrollPeriod: {
            label: "Aug 2025",
            range: "JUL 26 - AUG 25",
            startDate: new Date(2025, 6, 26),
            endDate: new Date(2025, 7, 25)
          },
          payableDays: `${24 + index}/26`,
          earnings: {
            basicSalary: 50000 + (index * 10000),
            hra: 15000 + (index * 3000),
            conveyanceAllowance: 2000,
            medicalAllowance: 1500,
            specialAllowance: 5000 + (index * 1000),
            bonus: 5000,
            overtime: 2000,
            arrears: 0,
            otherEarnings: 1000
          },
          deductions: {
            pf: 6000 + (index * 1200),
            esi: 750 + (index * 150),
            professionalTax: 200,
            tds: 8000 + (index * 1600),
            loanDeduction: 0,
            leaveDeduction: 0,
            attendanceDeduction: 1000,
            otherDeductions: 500
          },
          departmentName: user.departmentName || 'Engineering',
          designation: user.designation || 'Software Engineer',
          dateOfJoining: user.createdAt || new Date(),
          status: 'draft'
        }));

        // Create the sample records
        payrollRecords = await EmployeePayroll.create(samplePayrollRecords);
        console.log(`Created ${payrollRecords.length} sample payroll records`);
      }
    }

    // Manually populate employee data if needed
    const populatedRecords = await Promise.all(
      payrollRecords.map(async (record) => {
        const employee = await User.findOne({ id: record.employeeId });
        return {
          ...record.toObject(),
          employee: employee ? {
            name: employee.name,
            email: employee.email,
            designation: employee.designation,
            departmentName: employee.departmentName
          } : null
        };
      })
    );

    res.status(200).json({
      success: true,
      data: populatedRecords
    });
  } catch (error) {
    console.error('Error fetching payroll records:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch payroll records',
      details: error.message
    });
  }
};

const createEmployeePayroll = async (req, res) => {
  try {
    const payrollData = req.body;

    const payroll = new EmployeePayroll(payrollData);
    await payroll.save();

    res.status(201).json({
      success: true,
      data: payroll
    });
  } catch (error) {
    console.error('Error creating payroll record:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create payroll record',
      details: error.message
    });
  }
};

const updateEmployeePayroll = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const payroll = await EmployeePayroll.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!payroll) {
      return res.status(404).json({
        success: false,
        error: 'Payroll record not found'
      });
    }

    res.status(200).json({
      success: true,
      data: payroll
    });
  } catch (error) {
    console.error('Error updating payroll record:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update payroll record',
      details: error.message
    });
  }
};

const generatePayslip = async (req, res) => {
  try {
    const { employeeId, month, year } = req.body;

    if (!employeeId) {
      return res.status(400).json({
        success: false,
        error: 'Employee ID is required'
      });
    }

    // Fetch employee details with organization information
    const employee = await User.findOne({ id: employeeId })
      .populate('organizationId', 'name address contactEmail contactPhone website logo')
      .populate('departmentId', 'name');

    if (!employee) {
      return res.status(404).json({
        success: false,
        error: 'Employee not found'
      });
    }

    // Look for existing payroll record
    let payroll = await EmployeePayroll.findOne({
      employeeId,
      'payrollPeriod.label': `${month} ${year}`
    });

    let payrollData;

    if (!payroll) {
      // Create sample payroll data if none exists
      payrollData = {
        _id: new Date().getTime().toString(),
        employeeId: employee.id,
        name: employee.name,
        employee: {
          name: employee.name,
          email: employee.email,
          designation: employee.designation || 'Employee',
          departmentName: employee.departmentId?.name || 'General'
        },
        payrollPeriod: {
          label: `${month || 'August'} ${year || '2025'}`,
          range: `${month || 'AUG'} 01 - ${month || 'AUG'} 31`,
          startDate: new Date(year || 2025, (month === 'January' ? 0 : 7), 1),
          endDate: new Date(year || 2025, (month === 'January' ? 0 : 7), 31)
        },
        payableDays: '30',
        earnings: {
          basicSalary: employee.salary?.basic || 50000,
          hra: employee.salary?.hra || 15000,
          conveyanceAllowance: 2000,
          medicalAllowance: 1500,
          specialAllowance: 5000,
          bonus: 3000,
          overtime: 2000,
          arrears: 0,
          otherEarnings: 1000
        },
        deductions: {
          pf: 6000,
          esi: 750,
          professionalTax: 2500,
          tds: 4000,
          loanDeduction: 0,
          leaveDeduction: 0,
          attendanceDeduction: 0,
          otherDeductions: 500
        },
        totalEarnings: 79500,
        totalDeductions: 13750,
        netPay: 65750,
        departmentName: employee.departmentId?.name || 'General',
        designation: employee.designation || 'Employee',
        dateOfJoining: employee.dateOfJoining || new Date(),
        status: 'processed'
      };
    } else {
      payrollData = {
        ...payroll.toObject(),
        employee: {
          name: employee.name,
          email: employee.email,
          designation: employee.designation,
          departmentName: employee.departmentId?.name
        }
      };
    }

    // Add organization information
    payrollData.organizationName = employee.organizationId?.name || 'Company Name';
    payrollData.organizationDetails = {
      name: employee.organizationId?.name || 'Company Name',
      address: employee.organizationId?.address || '',
      contactEmail: employee.organizationId?.contactEmail || '',
      contactPhone: employee.organizationId?.contactPhone || '',
      website: employee.organizationId?.website || '',
      logo: employee.organizationId?.logo || ''
    };

    res.status(200).json({
      success: true,
      data: payrollData,
      payslipUrl: `/api/payroll/payslip/${payroll?._id || 'sample'}.pdf`
    });
  } catch (error) {
    console.error('Error generating payslip:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate payslip',
      details: error.message
    });
  }
};

// Payroll Period Controllers
const getPayrollPeriods = async (req, res) => {
  try {
    // For now, return all periods without organizationId filter
    // or create some sample periods if none exist
    let periods = await PayrollPeriod.find({})
      .sort({ startDate: -1 });

    // If no periods exist, create some sample ones
    if (periods.length === 0) {
      const samplePeriods = [
        {
          label: "Aug 2025",
          range: "JUL 26 - AUG 25",
          startDate: new Date(2025, 6, 26), // July 26, 2025
          endDate: new Date(2025, 7, 25),   // August 25, 2025
          status: "current",
          active: true
        },
        {
          label: "Jul 2025",
          range: "JUN 26 - JUL 25",
          startDate: new Date(2025, 5, 26), // June 26, 2025
          endDate: new Date(2025, 6, 25),   // July 25, 2025
          status: "completed",
          active: false
        },
        {
          label: "Sep 2025",
          range: "AUG 26 - SEP 25",
          startDate: new Date(2025, 7, 26), // August 26, 2025
          endDate: new Date(2025, 8, 25),   // September 25, 2025
          status: "upcoming",
          active: false
        }
      ];

      // Create a default organization first
      const Organization = require('../models/organizationModel');
      let defaultOrg = await Organization.findOne({ name: 'Default Organization' });
      
      if (!defaultOrg) {
        defaultOrg = new Organization({
          name: 'Default Organization',
          description: 'Default organization for testing'
        });
        await defaultOrg.save();
      }

      // Create sample periods with the default organization
      for (const periodData of samplePeriods) {
        const period = new PayrollPeriod({
          ...periodData,
          organizationId: defaultOrg._id
        });
        await period.save();
        periods.push(period);
      }
    }

    res.status(200).json({
      success: true,
      data: periods
    });
  } catch (error) {
    console.error('Error fetching payroll periods:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch payroll periods',
      details: error.message
    });
  }
};

const createPayrollPeriod = async (req, res) => {
  try {
    // Get organizationId from request body instead of middleware
    const { organizationId, ...periodData } = req.body;
    const orgId = organizationId || 'default-org';
    
    const finalPeriodData = { ...periodData, organizationId: orgId };

    const period = new PayrollPeriod(finalPeriodData);
    await period.save();

    res.status(201).json({
      success: true,
      data: period
    });
  } catch (error) {
    console.error('Error creating payroll period:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create payroll period',
      details: error.message
    });
  }
};

const setActivePayrollPeriod = async (req, res) => {
  try {
    const { id } = req.params;
    // Get organizationId from request body instead of middleware
    const { organizationId } = req.body;
    const orgId = organizationId || 'default-org';

    // Deactivate all periods
    await PayrollPeriod.updateMany(
      { organizationId: orgId },
      { isActive: false }
    );

    // Activate the selected period
    const period = await PayrollPeriod.findOneAndUpdate(
      { _id: id, organizationId: orgId },
      { isActive: true, status: 'current' },
      { new: true }
    );

    if (!period) {
      return res.status(404).json({
        success: false,
        error: 'Payroll period not found'
      });
    }

    res.status(200).json({
      success: true,
      data: period
    });
  } catch (error) {
    console.error('Error setting active payroll period:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to set active payroll period',
      details: error.message
    });
  }
};

// Joinees & Exits Controllers
const getJoineesExits = async (req, res) => {
  try {
    // Get organizationId from query params instead of middleware
    const { organizationId, periodId, status } = req.query;
    const orgId = organizationId || 'default-org';

    let filter = { organizationId: orgId };
    if (periodId) filter.payrollPeriodId = periodId;
    if (status) filter.status = status;

    const joineesExits = await EmployeeJoineesExits.find(filter)
      .sort({ createdAt: -1 });

    // Manually populate employee data
    const populatedJoineesExits = await Promise.all(
      joineesExits.map(async (record) => {
        const employee = await User.findOne({ id: record.employeeId });
        return {
          ...record.toObject(),
          employee: employee ? {
            name: employee.name,
            email: employee.email,
            designation: employee.designation,
            departmentName: employee.departmentName
          } : null
        };
      })
    );

    res.status(200).json({
      success: true,
      data: populatedJoineesExits
    });
  } catch (error) {
    console.error('Error fetching joinees/exits:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch joinees/exits',
      details: error.message
    });
  }
};

const finalizeJoineesExits = async (req, res) => {
  try {
    // Get organizationId from request body instead of middleware
    const { employees, organizationId } = req.body; // Array of employee IDs
    const orgId = organizationId || 'default-org';

    const result = await EmployeeJoineesExits.updateMany(
      { 
        employeeId: { $in: employees },
        organizationId: orgId 
      },
      { 
        finalized: true,
        finalizedAt: new Date()
      }
    );

    res.status(200).json({
      success: true,
      message: `Finalized ${result.modifiedCount} employee records`,
      processedCount: result.modifiedCount
    });
  } catch (error) {
    console.error('Error finalizing joinees/exits:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to finalize joinees/exits',
      details: error.message
    });
  }
};

// Process Payroll
const processPayroll = async (req, res) => {
  try {
    const { periodId, employees } = req.body;

    // Get payroll period first
    const period = await PayrollPeriod.findById(periodId);
    if (!period) {
      return res.status(404).json({
        success: false,
        error: 'Payroll period not found'
      });
    }

    // If no employees provided, get all employees
    let employeeList = employees;
    if (!employeeList || employeeList.length === 0) {
      const allEmployees = await User.find({});
      employeeList = allEmployees.map(emp => emp.id);
    }

    const errors = [];
    let processedCount = 0;

    for (const employeeId of employeeList) {
      try {
        // Get employee details
        const employee = await User.findOne({ id: employeeId });
        if (!employee) {
          errors.push(`Employee ${employeeId} not found`);
          continue;
        }

        // Check if payroll already exists
        const existingPayroll = await EmployeePayroll.findOne({
          employeeId,
          'payrollPeriod.label': period.label
        });

        if (existingPayroll) {
          errors.push(`Payroll already exists for ${employee.name}`);
          continue;
        }

        // Create new payroll record with mock data
        const payrollData = {
          employeeId,
          name: employee.name,
          departmentName: employee.departmentName,
          designation: employee.designation,
          dateOfJoining: employee.joiningDate,
          payrollPeriod: {
            label: period.label,
            range: period.range,
            startDate: period.startDate,
            endDate: period.endDate
          },
          payableDays: "26/30",
          earnings: {
            basicSalary: 50000,
            hra: 10000,
            conveyanceAllowance: 2000,
            medicalAllowance: 3000,
            specialAllowance: 1000,
            overtime: 0,
            bonus: 0
          },
          deductions: {
            pf: 6000,
            esi: 500,
            tds: 2000,
            loanDeduction: 0,
            otherDeductions: 0
          },
          status: 'processed',
          processedAt: new Date()
        };

        const payroll = new EmployeePayroll(payrollData);
        await payroll.save();
        processedCount++;

      } catch (error) {
        errors.push(`Error processing ${employeeId}: ${error.message}`);
      }
    }

    res.status(200).json({
      success: true,
      processedCount,
      errors: errors.length > 0 ? errors : undefined,
      message: `Successfully processed ${processedCount} payroll records`
    });

  } catch (error) {
    console.error('Error processing payroll:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to process payroll',
      details: error.message
    });
  }
};

module.exports = {
  getEmployeePayrollRecords,
  createEmployeePayroll,
  updateEmployeePayroll,
  generatePayslip,
  getPayrollPeriods,
  createPayrollPeriod,
  setActivePayrollPeriod,
  getJoineesExits,
  finalizeJoineesExits,
  processPayroll
};
