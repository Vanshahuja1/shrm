export interface OrganizationMember {
  id: number | string
  name: string
  role: "Manager" | "Employee" | "Intern" | "Head"
  department: string
  salary: number
  projects: string[]
  experience: string | number
  contactInfo: {
    email: string
    phone: string
    address: string
  }
  documents: {
    pan: string
    aadhar: string
  }
  joiningDate: string
  performanceMetrics: {
    tasksPerDay: number
    attendanceScore: number
    managerReviewRating: number
    combinedPercentage: number
  }
  attendance: {
    last7Days: boolean[]
    todayPresent: boolean
  }
  reportsTo?: string
}

export interface Department {
  id: number | string
  name: string
  head: string
  budget: number
  managers: any[]
  employees: any[]
  interns: any[]
  members: OrganizationMember[]
}

export interface Project {
  id: number
  name: string
  description: string
  departmentsInvolved: string[]
  membersInvolved: string[]
  startDate: string
  deadline: string
  managersInvolved: string[]
  completionPercentage: number
  amount: number
  client: string
  projectScope: string
  clientInputs: string
  skillsRequired: string[]
  showcaseLink?: string
  effectAnalysis?: string
  status: "active" | "completed" | "on-hold" | "cancelled" | "pending"
  priority?: "Low" | "Medium" | "High" | "Urgent"
  category?: string
  technologiesUsed?: string[]
  clientSatisfactionRating?: number
  roi?: number
  budgetAllocated?: number
  actualSpent?: number
  estimatedHours?: number
  actualHours?: number
  riskAssessment?: "Low" | "Medium" | "High"
  projectLead?: string
  milestonesAchieved?: string[]
  lessonsLearned?: string
  clientFeedback?: string
}

export interface Task {
  id: number
  title: string
  description: string
  assignedTo: string
  assignedBy: string
  dueDate: string
  status: "pending" | "in-progress" | "completed" | "overdue"
  priority: "low" | "medium" | "high" | "urgent"
  project?: string
}
