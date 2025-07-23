const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  assignedTo: {
    id: String,
    name: String,
  },
  assignedBy: {
    id: String,
    name: String,
  },
  dueDate: { type: String, required: true },
  status: {
    type: String,
    enum: ["pending", "in-progress", "completed"],
    default: "pending",
  },
  priority: {
    type: String,
    enum: ["low", "medium", "high"],
    default: "medium",
  },
});

const Task = mongoose.model("Task", TaskSchema);

module.exports = Task;
