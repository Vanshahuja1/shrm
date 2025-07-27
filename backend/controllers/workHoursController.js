const Attendance = require("../models/attendanceModel")
const Task = require("../models/taskModel")
const TaskResponse = require("../models/taskResponseModel")

// Get work hours data
const getWorkHours = async (req, res) => {
  try {
    const { id } = req.params
    const { date = new Date().toISOString().split("T")[0] } = req.query

    const attendance = await Attendance.findOne({ employeeId: id, date })

    if (!attendance) {
      return res.json({
        todayHours: 0,
        requiredHours: 8,
        breakTime: 0,
        overtimeHours: 0,
        taskJustification: [],
        isActive: false,
      })
    }

    // Get task justifications for the day
    const tasks = await Task.find({
      "assignedTo.id": id,
      updatedAt: {
        $gte: new Date(date),
        $lt: new Date(new Date(date).getTime() + 24 * 60 * 60 * 1000),
      },
    })

    const taskJustification = tasks.map((task) => task.title)

    res.json({
      todayHours: attendance.totalHours,
      requiredHours: 8,
      breakTime: attendance.breakTime,
      overtimeHours: attendance.overtimeHours,
      taskJustification,
      isActive: attendance.isActive,
    })
  } catch (error) {
    console.error("Get work hours error:", error)
    res.status(500).json({ error: "Internal server error" })
  }
}

module.exports = {
  getWorkHours,
}
