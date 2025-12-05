const Attendance = require("../models/attendanceModel");
const User = require("../models/userModel");

// Get attendance records
const getAttendanceRecords = async (req, res) => {
  try {
    const { id } = req.params;
    const { startDate, endDate, tzOffset } = req.query;

    const query = { employeeId: id };

    if (startDate && endDate) {
      query.date = { $gte: startDate, $lte: endDate };
    } else {
      // Default to last 30 days based on client timezone
      const now = new Date();
      const offsetMs = tzOffset ? parseInt(tzOffset, 10) * 60 * 1000 : 0;
      const clientNow = new Date(now.getTime() - offsetMs);
      const thirtyDaysAgo = new Date(clientNow);
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      const todayStr = clientNow.toISOString().split("T")[0];
      const startDateDefault = thirtyDaysAgo.toISOString().split("T")[0];

      query.date = { $gte: startDateDefault, $lte: todayStr };
    }

    // Fetch user name
    const user = await User.findOne({ id }).select("name");
    const employeeName = user ? user.name : "";

    const records = await Attendance.find(query).sort({ date: -1 });

    const attendanceRecords = records.map((record) => ({
      date: record.date,
      punchIn: record.punchIn
        ? record.punchIn.toTimeString().slice(0, 5)
        : null,
      punchOut: record.punchOut
        ? record.punchOut.toTimeString().slice(0, 5)
        : null,
      totalHours: record.totalHours,
      status: record.status,
      employee: id,
      name: employeeName,
    }));

    // Check if currently punched in using client timezone
    const now = new Date();
    const offsetMs2 = tzOffset ? parseInt(tzOffset, 10) * 60 * 1000 : 0;
    const clientNow = new Date(now.getTime() - offsetMs2);
    const today = clientNow.toISOString().split("T")[0];
    const todayRecord = await Attendance.findOne({
      employeeId: id,
      date: today,
    });

    // Auto-cap any active break that exceeded its allowed duration
    if (todayRecord && Array.isArray(todayRecord.breaks)) {
      const typeLimits = { break1: 15, break2: 15, lunch: 30 } // minutes
      const active = todayRecord.breaks.find((b) => b && !b.endTime)
      if (active && active.startTime) {
        const allowedMin = typeLimits[active.type] || 0
        const elapsedMs = clientNow.getTime() - new Date(active.startTime).getTime()
        const elapsedMin = Math.floor(elapsedMs / (1000 * 60))
        if (allowedMin > 0 && elapsedMin >= allowedMin) {
          const cappedEnd = new Date(new Date(active.startTime).getTime() + allowedMin * 60 * 1000)
          active.endTime = cappedEnd
          active.duration = allowedMin
          todayRecord.breakTime = todayRecord.breaks.reduce((t, b) => t + (b.duration || 0), 0)
          await todayRecord.save()
        }
      }
    }

    // Compute live total hours if active (exclude accumulated and ongoing break time)
    let totalWorkHours = todayRecord?.totalHours || 0;
    if (todayRecord?.isActive && todayRecord.punchIn) {
      const workingMs = clientNow.getTime() - new Date(todayRecord.punchIn).getTime();
      let totalBreakMinutes = todayRecord.breakTime || 0;
      const activeBreak = (todayRecord.breaks || []).find((b) => !b.endTime);
      if (activeBreak && activeBreak.startTime) {
        const ongoingBreakMs = clientNow.getTime() - new Date(activeBreak.startTime).getTime();
        totalBreakMinutes += Math.max(0, Math.floor(ongoingBreakMs / (1000 * 60)));
      }
      const breakHrs = totalBreakMinutes / 60;
      const workingHrs = workingMs / (1000 * 60 * 60);
      totalWorkHours = Math.max(0, parseFloat((workingHrs - breakHrs).toFixed(2)));
    }

    res.json({
      records: attendanceRecords,
      isPunchedIn: todayRecord?.isActive || false,
      workStartTime: todayRecord?.punchIn ? todayRecord.punchIn.toISOString() : null,
      totalWorkHours,
      breakTime: todayRecord?.breakTime || 0,
      overtimeHours: todayRecord?.overtimeHours || 0,
      breakSessions: todayRecord?.breaks || [], // Add break sessions to response
    });
  } catch (error) {
    console.error("Get attendance records error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Punch in
const punchIn = async (req, res) => {
  try {
    const { id } = req.params;
    const { timestamp, tzOffset } = req.body;

    const now = new Date();
    const offsetMs = tzOffset ? parseInt(tzOffset, 10) * 60 * 1000 : 0;
    const clientNow = new Date(now.getTime() - offsetMs);
    const today = clientNow.toISOString().split("T")[0];
    const punchInTime = timestamp ? new Date(timestamp) : clientNow;

    // Check if already punched in today
    let attendance = await Attendance.findOne({ employeeId: id, date: today });

    if (attendance && attendance.isActive) {
      return res.status(400).json({ error: "Already punched in today" });
    }

    if (attendance) {
      // Update existing record
      attendance.punchIn = punchInTime;
      attendance.isActive = true;
      attendance.status = "present";
    } else {
      // Create new record
      attendance = new Attendance({
        employeeId: id,
        date: today,
        punchIn: punchInTime,
        isActive: true,
        status: "present",
        breaks: [], // Initialize empty breaks array
      });
    }

    await attendance.save();

    res.status(201).json({
      id: attendance._id,
      employeeId: attendance.employeeId,
      punchIn: attendance.punchIn.toISOString(),
      date: attendance.date,
    });
  } catch (error) {
    console.error("Punch in error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Punch out
const punchOut = async (req, res) => {
  try {
    const { id } = req.params;
    const { timestamp, tzOffset } = req.body;

    const now = new Date();
    const offsetMs = tzOffset ? parseInt(tzOffset, 10) * 60 * 1000 : 0;
    const clientNow = new Date(now.getTime() - offsetMs);
    const today = clientNow.toISOString().split("T")[0];
    const punchOutTime = timestamp ? new Date(timestamp) : clientNow;

    const attendance = await Attendance.findOne({
      employeeId: id,
      date: today,
    });

    if (!attendance || !attendance.isActive) {
      return res.status(400).json({ error: "Not punched in today" });
    }

    // Auto-end any active break before punching out
    if (attendance.breaks && attendance.breaks.length > 0) {
      const typeLimits = { break1: 15, break2: 15, lunch: 30 };
      const activeBreak = attendance.breaks.find((b) => b && !b.endTime);
      
      if (activeBreak && activeBreak.startTime) {
        const allowedMin = typeLimits[activeBreak.type] || 0;
        const cappedEnd = new Date(new Date(activeBreak.startTime).getTime() + allowedMin * 60 * 1000);
        activeBreak.endTime = cappedEnd;
        activeBreak.duration = allowedMin;
        attendance.breakTime = attendance.breaks.reduce((t, b) => t + (b.duration || 0), 0);
      }
    }

    attendance.punchOut = punchOutTime;
    attendance.isActive = false;
    attendance.calculateHours();

    await attendance.save();

    res.json({
      employeeId: attendance.employeeId,
      punchOut: attendance.punchOut.toISOString(),
      totalHours: attendance.totalHours,
    });
  } catch (error) {
    console.error("Punch out error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Handle breaks
const handleBreak = async (req, res) => {
  try {
    const { id } = req.params;
    const { type, action, tzOffset } = req.body; // action: 'start' or 'end'

    const now = new Date();
    const offsetMs = tzOffset ? parseInt(tzOffset, 10) * 60 * 1000 : 0;
    const clientNow = new Date(now.getTime() - offsetMs);
    const today = clientNow.toISOString().split("T")[0];
    const attendance = await Attendance.findOne({
      employeeId: id,
      date: today,
    });

    if (!attendance || !attendance.isActive) {
      return res.status(400).json({ error: "Not punched in today" });
    }

    if (action === "start") {
      // Disallow starting a break if this type was already used or is active
      const existingOfType = (attendance.breaks || []).find((b) => b.type === type)
      if (existingOfType && !existingOfType.endTime) {
        return res.status(400).json({ error: "This break is already active" })
      }
      if (existingOfType && existingOfType.endTime) {
        return res.status(400).json({ error: "This break was already used today" })
      }
      
      // Start break
      attendance.breaks.push({
        type,
        startTime: clientNow,
      });
    } else if (action === "end") {
      // End break
      const activeBreak = attendance.breaks.find(
        (b) => b.type === type && !b.endTime
      );

      if (activeBreak) {
        // Cap the break to its maximum allowed duration
        const typeLimits = { break1: 15, break2: 15, lunch: 30 };
        const allowedMin = typeLimits[type] || 0;
        const elapsedMs = clientNow.getTime() - new Date(activeBreak.startTime).getTime();
        const elapsedMin = Math.floor(elapsedMs / (1000 * 60));
        
        // Use the actual duration but cap it at the maximum
        const actualDuration = Math.min(elapsedMin, allowedMin);
        const endTime = new Date(new Date(activeBreak.startTime).getTime() + actualDuration * 60 * 1000);
        
        activeBreak.endTime = endTime;
        activeBreak.duration = actualDuration;

        // Update total break time
        attendance.breakTime = attendance.breaks.reduce(
          (total, b) => total + (b.duration || 0),
          0
        );
      }
    }

    await attendance.save();

    res.json({
      id: Date.now(),
      employeeId: id,
      type,
      action,
      timestamp: clientNow.toISOString(),
      breaks: attendance.breaks, // Return updated breaks
    });
  } catch (error) {
    console.error("Handle break error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get today's breaks
const getTodayBreaks = async (req, res) => {
  try {
    const { id } = req.params;
    const { tzOffset } = req.query;
    const now = new Date();
    const offsetMs = tzOffset ? parseInt(tzOffset, 10) * 60 * 1000 : 0;
    const clientNow = new Date(now.getTime() - offsetMs);
    const today = clientNow.toISOString().split("T")[0];

    const attendance = await Attendance.findOne({
      employeeId: id,
      date: today,
    });

    // Auto-cap any active break that exceeded its allowed duration
    if (attendance && Array.isArray(attendance.breaks)) {
      const typeLimits = { break1: 15, break2: 15, lunch: 30 }
      const active = attendance.breaks.find((b) => b && !b.endTime)
      if (active && active.startTime) {
        const allowedMin = typeLimits[active.type] || 0
        const elapsedMs = clientNow.getTime() - new Date(active.startTime).getTime()
        const elapsedMin = Math.floor(elapsedMs / (1000 * 60))
        if (allowedMin > 0 && elapsedMin >= allowedMin) {
          const cappedEnd = new Date(new Date(active.startTime).getTime() + allowedMin * 60 * 1000)
          active.endTime = cappedEnd
          active.duration = allowedMin
          attendance.breakTime = attendance.breaks.reduce((t, b) => t + (b.duration || 0), 0)
          await attendance.save()
        }
      }
    }

    res.json(attendance?.breaks || []);
  } catch (error) {
    console.error("Get today breaks error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getStats = async (req, res) => {
  try {
    const { id } = req.params;
    const { tzOffset } = req.query;
    const now = new Date();
    const offsetMs = tzOffset ? parseInt(tzOffset, 10) * 60 * 1000 : 0;
    const clientNow = new Date(now.getTime() - offsetMs);
    const today = clientNow.toISOString().split("T")[0];
    const attendance = await Attendance.findOne({
      employeeId: id,
      date: today,
    });

    const isPunchedIn = attendance ? attendance.isActive : false;
    console.log("isPunchedIn:", isPunchedIn);
    res.json({ isPunchedIn, attendanceRecord: attendance });
  } catch (error) {
    console.error("Check if punched in error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getTodaysAttendance = async (req, res) => {
  try {
    const { hrId } = req.params;
    const today = new Date().toISOString().split("T")[0];

    // Find HR's organization
    const hr = await User.findOne({ id: hrId });
    if (!hr) {
      return res.status(404).json({ error: "HR not found" });
    }

    const organization = hr.organizationId;
    console.log("HR's organization:", organization);

    // Find employees in the same organization
    const employees = await User.find({
      organizationId: organization,
      role: { $in: ["employee", "hr", "manager", "intern"] },
    });
    console.log("Employees in organization:", employees);

    console.log("Employees in organization:", employees);

    // Fetch attendance records for today
    const attendanceRecords = await Promise.all(
      employees.map(async (emp) => {
        const attendance = await Attendance.findOne({
          employeeId: emp.id,
          date: today,
        });

        return {
          employeeInfo: emp.employeeInfo, // Using virtual field
          attendance: attendance
            ? {
                date: attendance.date,
                punchIn: attendance.punchIn
                  ? attendance.punchIn.toTimeString().slice(0, 5)
                  : null,
                punchOut: attendance.punchOut
                  ? attendance.punchOut.toTimeString().slice(0, 5)
                  : null,
                totalHours: attendance.totalHours,
                status: attendance.status,
              }
            : null,
        };
      })
    );

    res.json({
      attendanceRecords,
    });
  } catch (error) {
    console.error("Get today's attendance error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getAttendanceByEmpId = async (req, res) => {
  try {
    const { id } = req.params;

    // Fetch all attendance records for the employee
    const attendanceRecords = await Attendance.find({ employeeId: id }).sort({
      date: -1,
    });

    if (!attendanceRecords || attendanceRecords.length === 0) {
      return res.status(404).json({ error: "No attendance records found" });
    }

    // Fetch employee information
    const employee = await User.findOne({ id });
    if (!employee) {
      return res.status(404).json({ error: "Employee not found" });
    }

    res.json({
      employeeInfo: employee.employeeInfo, // Using virtual field
      attendanceRecords: attendanceRecords.map((record) => ({
        date: record.date,
        punchIn: record.punchIn
          ? record.punchIn.toTimeString().slice(0, 5)
          : null,
        punchOut: record.punchOut
          ? record.punchOut.toTimeString().slice(0, 5)
          : null,
        totalHours: record.totalHours,
        status: record.status,
        breakTime: record.breakTime,
      })),
    });
  } catch (error) {
    console.error("Get attendance by employee ID error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  getAttendanceRecords,
  punchIn,
  punchOut,
  handleBreak,
  getTodayBreaks,
  getTodaysAttendance,
  getAttendanceByEmpId,
  getStats,
};