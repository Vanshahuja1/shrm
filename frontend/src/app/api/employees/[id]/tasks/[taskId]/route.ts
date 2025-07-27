import { type NextRequest, NextResponse } from "next/server"

// GET /api/employees/[id]/tasks - Get all tasks for employee
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const tasks = await getEmployeeTasks(params.id)
    return NextResponse.json(tasks)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch tasks" }, { status: 500 })
  }
}

// POST /api/employees/[id]/tasks - Create new task
export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const newTask = await createTask(params.id, body)
    return NextResponse.json(newTask, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to create task" }, { status: 500 })
  }
}

async function getEmployeeTasks(employeeId: string) {
  // Your database query here
  return [
    {
      id: 1,
      title: "Implement User Authentication",
      description: "Create a secure login system with JWT tokens",
      priority: "high",
      status: "in-progress",
      dueDate: "2024-07-20",
      dueTime: "17:00",
      assignedBy: "Jane Smith",
      createdAt: "2024-07-15 09:00:00",
      weightage: 8,
    },
  ]
}

async function createTask(employeeId: string, taskData: any) {
  // Your database insert here
  return { id: Date.now(), ...taskData }
}
