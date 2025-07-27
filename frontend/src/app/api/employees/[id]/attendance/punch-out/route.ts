import { type NextRequest, NextResponse } from "next/server"

// POST /api/employees/[id]/attendance/punch-out - Punch out
export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const punchOut = await recordPunchOut(params.id, body.timestamp)
    return NextResponse.json(punchOut)
  } catch (error) {
    return NextResponse.json({ error: "Failed to punch out" }, { status: 500 })
  }
}

async function recordPunchOut(employeeId: string, timestamp: string) {
  // Your database update here
  return {
    employeeId,
    punchOut: timestamp,
    totalHours: 8.5,
  }
}
