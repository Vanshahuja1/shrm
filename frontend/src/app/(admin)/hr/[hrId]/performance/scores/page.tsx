"use client"

import React, { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Progress } from "@/components/ui/progress"
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Star,
  Search,
  AlertCircle
} from "lucide-react"
import { toast } from "react-hot-toast"

interface PerformanceScore {
  _id: string
  employeeId: {
    id: string
    name: string
    email: string
    department: string
    role: string
  }
  evaluationPeriod: {
    year: number
    quarter: string
  }
  scores: {
    taskDelivery: number
    qualityOfWork: number
    teamCollaboration: number
    efficiency: number
    totalScore: number
  }
  category: "FEE" | "EE" | "AE" | "BE" | "PE"
  status: "draft" | "submitted" | "reviewed" | "approved"
  managerEvaluation?: {
    managerId: string
    comments: string
    rating: number
    evaluatedAt: Date
  }
  selfAssessment?: {
    comments: string
    rating: number
    submittedAt: Date
  }
  createdAt: string
  updatedAt: string
}

interface Employee {
  id: string
  name: string
  email: string
  department: string
  role: string
}

export default function PerformanceScoreManagement() {
  const [performanceScores, setPerformanceScores] = useState<PerformanceScore[]>([])
  const [employees, setEmployees] = useState<Employee[]>([])
  const [loading, setLoading] = useState(true)
  const [createLoading, setCreateLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [selectedScore, setSelectedScore] = useState<PerformanceScore | null>(null)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  // Edit form state
  const [editFormData, setEditFormData] = useState({
    taskDelivery: 0,
    qualityOfWork: 0,
    teamCollaboration: 0,
    efficiency: 0,
    status: "" as "draft" | "submitted" | "reviewed" | "approved"
  })

  // Form state
  const [formData, setFormData] = useState({
    employeeId: "",
    year: new Date().getFullYear(),
    quarter: `Q${Math.ceil((new Date().getMonth() + 1) / 3)}`,
    taskDelivery: 0,
    qualityOfWork: 0,
    teamCollaboration: 0,
    efficiency: 0
  })

  const fetchPerformanceScores = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Using mock data since API is not working
      console.log("Using mock data for performance scores")
      
      const mockScores: PerformanceScore[] = [
        {
          _id: "score1",
          employeeId: {
            id: "EMP001",
            name: "Alice Johnson",
            email: "alice.johnson@company.com",
            department: "Engineering",
            role: "Senior Developer"
          },
          evaluationPeriod: {
            year: 2024,
            quarter: "Q1"
          },
          scores: {
            taskDelivery: 92,
            qualityOfWork: 89,
            teamCollaboration: 95,
            efficiency: 88,
            totalScore: 91
          },
          category: "FEE",
          status: "approved",
          managerEvaluation: {
            managerId: "MGR001",
            comments: "Excellent performance, great team player",
            rating: 91,
            evaluatedAt: new Date("2024-03-15")
          },
          createdAt: "2024-01-15T10:30:00Z",
          updatedAt: "2024-03-15T14:20:00Z"
        },
        {
          _id: "score2",
          employeeId: {
            id: "EMP002",
            name: "Bob Smith",
            email: "bob.smith@company.com",
            department: "Sales",
            role: "Sales Manager"
          },
          evaluationPeriod: {
            year: 2024,
            quarter: "Q1"
          },
          scores: {
            taskDelivery: 88,
            qualityOfWork: 85,
            teamCollaboration: 90,
            efficiency: 87,
            totalScore: 87
          },
          category: "EE",
          status: "reviewed",
          managerEvaluation: {
            managerId: "MGR002",
            comments: "Good performance, meets expectations",
            rating: 87,
            evaluatedAt: new Date("2024-03-14")
          },
          createdAt: "2024-01-10T09:15:00Z",
          updatedAt: "2024-03-14T11:30:00Z"
        },
        {
          _id: "score3",
          employeeId: {
            id: "EMP003",
            name: "Carol Davis",
            email: "carol.davis@company.com",
            department: "Marketing",
            role: "Marketing Specialist"
          },
          evaluationPeriod: {
            year: 2024,
            quarter: "Q1"
          },
          scores: {
            taskDelivery: 82,
            qualityOfWork: 80,
            teamCollaboration: 85,
            efficiency: 78,
            totalScore: 81
          },
          category: "AE",
          status: "submitted",
          selfAssessment: {
            comments: "I believe I performed well this quarter",
            rating: 83,
            submittedAt: new Date("2024-03-10")
          },
          createdAt: "2024-01-08T08:45:00Z",
          updatedAt: "2024-03-10T16:20:00Z"
        },
        {
          _id: "score4",
          employeeId: {
            id: "EMP004",
            name: "David Wilson",
            email: "david.wilson@company.com",
            department: "HR",
            role: "HR Coordinator"
          },
          evaluationPeriod: {
            year: 2024,
            quarter: "Q1"
          },
          scores: {
            taskDelivery: 75,
            qualityOfWork: 78,
            teamCollaboration: 80,
            efficiency: 76,
            totalScore: 77
          },
          category: "BE",
          status: "draft",
          createdAt: "2024-01-12T12:00:00Z",
          updatedAt: "2024-01-12T12:00:00Z"
        }
      ]
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500))
      
      setPerformanceScores(mockScores)
      toast.success("Performance scores loaded successfully!")
      
    } catch (error: unknown) {
      console.error("Failed to fetch performance scores:", error)
      const errorMessage = error instanceof Error ? error.message : "Failed to fetch performance scores"
      setError(errorMessage)
      toast.error("Failed to load performance scores")
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchEmployees = useCallback(async () => {
    try {
      // Using mock data since API is not working
      console.log("Using mock data for employees")
      
      const mockEmployees: Employee[] = [
        {
          id: "EMP001",
          name: "Alice Johnson",
          email: "alice.johnson@company.com",
          department: "Engineering",
          role: "Senior Developer"
        },
        {
          id: "EMP002",
          name: "Bob Smith",
          email: "bob.smith@company.com",
          department: "Sales",
          role: "Sales Manager"
        },
        {
          id: "EMP003",
          name: "Carol Davis",
          email: "carol.davis@company.com",
          department: "Marketing",
          role: "Marketing Specialist"
        },
        {
          id: "EMP004",
          name: "David Wilson",
          email: "david.wilson@company.com",
          department: "HR",
          role: "HR Coordinator"
        },
        {
          id: "EMP005",
          name: "Eva Brown",
          email: "eva.brown@company.com",
          department: "Finance",
          role: "Financial Analyst"
        },
        {
          id: "EMP006",
          name: "Frank Miller",
          email: "frank.miller@company.com",
          department: "IT",
          role: "System Administrator"
        },
        {
          id: "EMP007",
          name: "Grace Lee",
          email: "grace.lee@company.com",
          department: "Operations",
          role: "Operations Manager"
        }
      ]
      
      setEmployees(mockEmployees)
      
    } catch (error: unknown) {
      console.error("Failed to fetch employees:", error)
      toast.error("Failed to load employees")
    }
  }, [])

  useEffect(() => {
    fetchPerformanceScores()
    fetchEmployees()
  }, [fetchPerformanceScores, fetchEmployees])

  const handleCreateScore = async () => {
    try {
      setCreateLoading(true)
      const totalScore = Math.round(
        (formData.taskDelivery * 0.4) + 
        (formData.qualityOfWork * 0.3) + 
        (formData.teamCollaboration * 0.2) + 
        (formData.efficiency * 0.1)
      )

      // Simulate API delay and create new score with mock data
      await new Promise(resolve => setTimeout(resolve, 800))
      
      const selectedEmployee = employees.find(emp => emp.id === formData.employeeId)
      
      if (!selectedEmployee) {
        toast.error("Please select a valid employee")
        return
      }

      const newScore: PerformanceScore = {
        _id: `score_${Date.now()}`,
        employeeId: selectedEmployee,
        evaluationPeriod: {
          year: formData.year,
          quarter: formData.quarter
        },
        scores: {
          taskDelivery: formData.taskDelivery,
          qualityOfWork: formData.qualityOfWork,
          teamCollaboration: formData.teamCollaboration,
          efficiency: formData.efficiency,
          totalScore
        },
        category: totalScore >= 90 ? "FEE" : totalScore >= 80 ? "EE" : totalScore >= 70 ? "AE" : totalScore >= 60 ? "BE" : "PE",
        status: "draft",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }

      // Add to the current scores list
      setPerformanceScores(prev => [newScore, ...prev])
      
      toast.success("Performance score created successfully!")
      setIsCreateDialogOpen(false)
      resetForm()
    } catch (error: unknown) {
      console.error("Failed to create performance score:", error)
      const errorMessage = error instanceof Error ? error.message : "Failed to create performance score"
      toast.error(errorMessage)
    } finally {
      setCreateLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({
      employeeId: "",
      year: new Date().getFullYear(),
      quarter: `Q${Math.ceil((new Date().getMonth() + 1) / 3)}`,
      taskDelivery: 0,
      qualityOfWork: 0,
      teamCollaboration: 0,
      efficiency: 0
    })
  }

  const handleEditScore = (score: PerformanceScore) => {
    setSelectedScore(score)
    setEditFormData({
      taskDelivery: score.scores.taskDelivery,
      qualityOfWork: score.scores.qualityOfWork,
      teamCollaboration: score.scores.teamCollaboration,
      efficiency: score.scores.efficiency,
      status: score.status
    })
    setIsEditDialogOpen(true)
  }

  const handleUpdateScore = async () => {
    if (!selectedScore) return

    try {
      setCreateLoading(true)
      
      const totalScore = Math.round(
        (editFormData.taskDelivery * 0.4) + 
        (editFormData.qualityOfWork * 0.3) + 
        (editFormData.teamCollaboration * 0.2) + 
        (editFormData.efficiency * 0.1)
      )

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500))

      const updatedScore: PerformanceScore = {
        ...selectedScore,
        scores: {
          taskDelivery: editFormData.taskDelivery,
          qualityOfWork: editFormData.qualityOfWork,
          teamCollaboration: editFormData.teamCollaboration,
          efficiency: editFormData.efficiency,
          totalScore
        },
        category: totalScore >= 90 ? "FEE" : totalScore >= 80 ? "EE" : totalScore >= 70 ? "AE" : totalScore >= 60 ? "BE" : "PE",
        status: editFormData.status,
        updatedAt: new Date().toISOString()
      }

      // Update the scores list
      setPerformanceScores(prev => 
        prev.map(score => score._id === selectedScore._id ? updatedScore : score)
      )

      toast.success("Performance score updated successfully!")
      setIsEditDialogOpen(false)
      setSelectedScore(null)
    } catch (error: unknown) {
      console.error("Failed to update performance score:", error)
      toast.error("Failed to update performance score")
    } finally {
      setCreateLoading(false)
    }
  }

  const handleDeleteScore = (score: PerformanceScore) => {
    setSelectedScore(score)
    setIsDeleteDialogOpen(true)
  }

  const confirmDeleteScore = async () => {
    if (!selectedScore) return

    try {
      setCreateLoading(true)
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300))

      // Remove from the scores list
      setPerformanceScores(prev => 
        prev.filter(score => score._id !== selectedScore._id)
      )

      toast.success("Performance score deleted successfully!")
      setIsDeleteDialogOpen(false)
      setSelectedScore(null)
    } catch (error: unknown) {
      console.error("Failed to delete performance score:", error)
      toast.error("Failed to delete performance score")
    } finally {
      setCreateLoading(false)
    }
  }

  const getCategoryColor = (category: string) => {
    const colors = {
      FEE: "bg-green-500 text-white",
      EE: "bg-blue-500 text-white",
      AE: "bg-yellow-500 text-black",
      BE: "bg-orange-500 text-white",
      PE: "bg-red-500 text-white"
    }
    return colors[category as keyof typeof colors] || "bg-gray-500 text-white"
  }

  const getStatusColor = (status: string) => {
    const colors = {
      draft: "bg-gray-100 text-gray-800",
      submitted: "bg-yellow-100 text-yellow-800",
      reviewed: "bg-blue-100 text-blue-800",
      approved: "bg-green-100 text-green-800"
    }
    return colors[status as keyof typeof colors] || "bg-gray-100 text-gray-800"
  }

  const filteredScores = performanceScores.filter(score => {
    const matchesSearch = score.employeeId.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         score.employeeId.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || score.status === statusFilter
    const matchesCategory = categoryFilter === "all" || score.category === categoryFilter
    
    return matchesSearch && matchesStatus && matchesCategory
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Data</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={() => fetchPerformanceScores()}>
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Performance Scores</h1>
          <p className="text-gray-600 mt-1">Manage employee performance evaluations</p>
        </div>
        
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Performance Score
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create Performance Score</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="employee">Employee</Label>
                  <Select value={formData.employeeId} onValueChange={(value) => setFormData({...formData, employeeId: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select employee" />
                    </SelectTrigger>
                    <SelectContent>
                      {employees.map(employee => (
                        <SelectItem key={employee.id} value={employee.id}>
                          {employee.name} - {employee.department}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="quarter">Quarter</Label>
                  <Select value={formData.quarter} onValueChange={(value) => setFormData({...formData, quarter: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Q1">Q1</SelectItem>
                      <SelectItem value="Q2">Q2</SelectItem>
                      <SelectItem value="Q3">Q3</SelectItem>
                      <SelectItem value="Q4">Q4</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="taskDelivery">Task Delivery (40%)</Label>
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    value={formData.taskDelivery}
                    onChange={(e) => setFormData({...formData, taskDelivery: parseInt(e.target.value) || 0})}
                  />
                </div>
                
                <div>
                  <Label htmlFor="qualityOfWork">Quality of Work (30%)</Label>
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    value={formData.qualityOfWork}
                    onChange={(e) => setFormData({...formData, qualityOfWork: parseInt(e.target.value) || 0})}
                  />
                </div>
                
                <div>
                  <Label htmlFor="teamCollaboration">Team Collaboration (20%)</Label>
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    value={formData.teamCollaboration}
                    onChange={(e) => setFormData({...formData, teamCollaboration: parseInt(e.target.value) || 0})}
                  />
                </div>
                
                <div>
                  <Label htmlFor="efficiency">Efficiency (10%)</Label>
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    value={formData.efficiency}
                    onChange={(e) => setFormData({...formData, efficiency: parseInt(e.target.value) || 0})}
                  />
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium mb-2">Calculated Total Score</h4>
                <div className="text-2xl font-bold text-blue-600">
                  {Math.round(
                    (formData.taskDelivery * 0.4) + 
                    (formData.qualityOfWork * 0.3) + 
                    (formData.teamCollaboration * 0.2) + 
                    (formData.efficiency * 0.1)
                  )}%
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)} disabled={createLoading}>
                  Cancel
                </Button>
                <Button onClick={handleCreateScore} disabled={createLoading}>
                  {createLoading ? (
                    <div className="flex items-center space-x-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Creating...</span>
                    </div>
                  ) : (
                    "Create Score"
                  )}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <div className="flex space-x-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search employees..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="submitted">Submitted</SelectItem>
            <SelectItem value="reviewed">Reviewed</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
          </SelectContent>
        </Select>
        
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="FEE">FEE</SelectItem>
            <SelectItem value="EE">EE</SelectItem>
            <SelectItem value="AE">AE</SelectItem>
            <SelectItem value="BE">BE</SelectItem>
            <SelectItem value="PE">PE</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Performance Scores Table */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Scores ({filteredScores.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee</TableHead>
                <TableHead>Period</TableHead>
                <TableHead>Total Score</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredScores.map((score) => (
                <TableRow key={score._id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{score.employeeId.name}</div>
                      <div className="text-sm text-gray-600">{score.employeeId.department}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {score.evaluationPeriod.quarter} {score.evaluationPeriod.year}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">{score.scores.totalScore}%</span>
                      <Progress value={score.scores.totalScore} className="w-16" />
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getCategoryColor(score.category)}>
                      {score.category}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={getStatusColor(score.status)}>
                      {score.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => {
                          setSelectedScore(score)
                          setIsViewDialogOpen(true)
                        }}
                        title="View Details"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleEditScore(score)}
                        title="Edit Score"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleDeleteScore(score)}
                        title="Delete Score"
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* View Performance Score Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Performance Score Details</DialogTitle>
          </DialogHeader>
          {selectedScore && (
            <div className="space-y-6">
              {/* Employee Info */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium mb-2">Employee Information</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm text-gray-600">Name:</span>
                    <div className="font-medium">{selectedScore.employeeId.name}</div>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Department:</span>
                    <div className="font-medium">{selectedScore.employeeId.department}</div>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Role:</span>
                    <div className="font-medium">{selectedScore.employeeId.role}</div>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Period:</span>
                    <div className="font-medium">
                      {selectedScore.evaluationPeriod.quarter} {selectedScore.evaluationPeriod.year}
                    </div>
                  </div>
                </div>
              </div>

              {/* Score Breakdown */}
              <div>
                <h4 className="font-medium mb-4">Score Breakdown</h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span>Task Delivery (40%)</span>
                    <div className="flex items-center space-x-2">
                      <Progress value={selectedScore.scores.taskDelivery} className="w-32" />
                      <span className="font-medium w-12">{selectedScore.scores.taskDelivery}%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Quality of Work (30%)</span>
                    <div className="flex items-center space-x-2">
                      <Progress value={selectedScore.scores.qualityOfWork} className="w-32" />
                      <span className="font-medium w-12">{selectedScore.scores.qualityOfWork}%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Team Collaboration (20%)</span>
                    <div className="flex items-center space-x-2">
                      <Progress value={selectedScore.scores.teamCollaboration} className="w-32" />
                      <span className="font-medium w-12">{selectedScore.scores.teamCollaboration}%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Efficiency (10%)</span>
                    <div className="flex items-center space-x-2">
                      <Progress value={selectedScore.scores.efficiency} className="w-32" />
                      <span className="font-medium w-12">{selectedScore.scores.efficiency}%</span>
                    </div>
                  </div>
                  <div className="border-t pt-3">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Total Score</span>
                      <div className="flex items-center space-x-2">
                        <Badge className={getCategoryColor(selectedScore.category)}>
                          {selectedScore.category}
                        </Badge>
                        <span className="text-xl font-bold">{selectedScore.scores.totalScore}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Manager Evaluation */}
              {selectedScore.managerEvaluation && (
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">Manager Evaluation</h4>
                  <div className="space-y-2">
                    <div>
                      <span className="text-sm text-gray-600">Rating:</span>
                      <div className="flex items-center space-x-1">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            className={`h-4 w-4 ${i < selectedScore.managerEvaluation!.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                          />
                        ))}
                      </div>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Comments:</span>
                      <div className="mt-1">{selectedScore.managerEvaluation.comments}</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Self Assessment */}
              {selectedScore.selfAssessment && (
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">Self Assessment</h4>
                  <div className="space-y-2">
                    <div>
                      <span className="text-sm text-gray-600">Rating:</span>
                      <div className="flex items-center space-x-1">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            className={`h-4 w-4 ${i < selectedScore.selfAssessment!.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                          />
                        ))}
                      </div>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Comments:</span>
                      <div className="mt-1">{selectedScore.selfAssessment.comments}</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Performance Score Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Performance Score</DialogTitle>
            <DialogDescription>
              Update performance scores for {selectedScore?.employeeId.name}
            </DialogDescription>
          </DialogHeader>
          
          {selectedScore && (
            <div className="space-y-4">
              {/* Employee Info (Read-only) */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium mb-2">Employee Information</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Name:</span>
                    <div className="font-medium">{selectedScore.employeeId.name}</div>
                  </div>
                  <div>
                    <span className="text-gray-600">Department:</span>
                    <div className="font-medium">{selectedScore.employeeId.department}</div>
                  </div>
                  <div>
                    <span className="text-gray-600">Period:</span>
                    <div className="font-medium">
                      {selectedScore.evaluationPeriod.quarter} {selectedScore.evaluationPeriod.year}
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-600">Current Status:</span>
                    <Badge variant="outline" className={getStatusColor(selectedScore.status)}>
                      {selectedScore.status}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Editable Scores */}
              <div className="space-y-4">
                <div>
                  <Label htmlFor="editTaskDelivery">Task Delivery (40%)</Label>
                  <Input
                    id="editTaskDelivery"
                    type="number"
                    min="0"
                    max="100"
                    value={editFormData.taskDelivery}
                    onChange={(e) => setEditFormData({...editFormData, taskDelivery: parseInt(e.target.value) || 0})}
                  />
                </div>
                
                <div>
                  <Label htmlFor="editQualityOfWork">Quality of Work (30%)</Label>
                  <Input
                    id="editQualityOfWork"
                    type="number"
                    min="0"
                    max="100"
                    value={editFormData.qualityOfWork}
                    onChange={(e) => setEditFormData({...editFormData, qualityOfWork: parseInt(e.target.value) || 0})}
                  />
                </div>
                
                <div>
                  <Label htmlFor="editTeamCollaboration">Team Collaboration (20%)</Label>
                  <Input
                    id="editTeamCollaboration"
                    type="number"
                    min="0"
                    max="100"
                    value={editFormData.teamCollaboration}
                    onChange={(e) => setEditFormData({...editFormData, teamCollaboration: parseInt(e.target.value) || 0})}
                  />
                </div>
                
                <div>
                  <Label htmlFor="editEfficiency">Efficiency (10%)</Label>
                  <Input
                    id="editEfficiency"
                    type="number"
                    min="0"
                    max="100"
                    value={editFormData.efficiency}
                    onChange={(e) => setEditFormData({...editFormData, efficiency: parseInt(e.target.value) || 0})}
                  />
                </div>

                <div>
                  <Label htmlFor="editStatus">Status</Label>
                  <Select value={editFormData.status} onValueChange={(value: "draft" | "submitted" | "reviewed" | "approved") => setEditFormData({...editFormData, status: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="submitted">Submitted</SelectItem>
                      <SelectItem value="reviewed">Reviewed</SelectItem>
                      <SelectItem value="approved">Approved</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Updated Total Score Preview */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium mb-2">Updated Total Score</h4>
                <div className="flex items-center justify-between">
                  <div className="text-2xl font-bold text-blue-600">
                    {Math.round(
                      (editFormData.taskDelivery * 0.4) + 
                      (editFormData.qualityOfWork * 0.3) + 
                      (editFormData.teamCollaboration * 0.2) + 
                      (editFormData.efficiency * 0.1)
                    )}%
                  </div>
                  <Badge className={getCategoryColor(
                    Math.round(
                      (editFormData.taskDelivery * 0.4) + 
                      (editFormData.qualityOfWork * 0.3) + 
                      (editFormData.teamCollaboration * 0.2) + 
                      (editFormData.efficiency * 0.1)
                    ) >= 90 ? "FEE" : 
                    Math.round(
                      (editFormData.taskDelivery * 0.4) + 
                      (editFormData.qualityOfWork * 0.3) + 
                      (editFormData.teamCollaboration * 0.2) + 
                      (editFormData.efficiency * 0.1)
                    ) >= 80 ? "EE" : 
                    Math.round(
                      (editFormData.taskDelivery * 0.4) + 
                      (editFormData.qualityOfWork * 0.3) + 
                      (editFormData.teamCollaboration * 0.2) + 
                      (editFormData.efficiency * 0.1)
                    ) >= 70 ? "AE" : 
                    Math.round(
                      (editFormData.taskDelivery * 0.4) + 
                      (editFormData.qualityOfWork * 0.3) + 
                      (editFormData.teamCollaboration * 0.2) + 
                      (editFormData.efficiency * 0.1)
                    ) >= 60 ? "BE" : "PE"
                  )}>
                    {Math.round(
                      (editFormData.taskDelivery * 0.4) + 
                      (editFormData.qualityOfWork * 0.3) + 
                      (editFormData.teamCollaboration * 0.2) + 
                      (editFormData.efficiency * 0.1)
                    ) >= 90 ? "FEE" : 
                    Math.round(
                      (editFormData.taskDelivery * 0.4) + 
                      (editFormData.qualityOfWork * 0.3) + 
                      (editFormData.teamCollaboration * 0.2) + 
                      (editFormData.efficiency * 0.1)
                    ) >= 80 ? "EE" : 
                    Math.round(
                      (editFormData.taskDelivery * 0.4) + 
                      (editFormData.qualityOfWork * 0.3) + 
                      (editFormData.teamCollaboration * 0.2) + 
                      (editFormData.efficiency * 0.1)
                    ) >= 70 ? "AE" : 
                    Math.round(
                      (editFormData.taskDelivery * 0.4) + 
                      (editFormData.qualityOfWork * 0.3) + 
                      (editFormData.teamCollaboration * 0.2) + 
                      (editFormData.efficiency * 0.1)
                    ) >= 60 ? "BE" : "PE"}
                  </Badge>
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setIsEditDialogOpen(false)} disabled={createLoading}>
                  Cancel
                </Button>
                <Button onClick={handleUpdateScore} disabled={createLoading}>
                  {createLoading ? (
                    <div className="flex items-center space-x-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Updating...</span>
                    </div>
                  ) : (
                    "Update Score"
                  )}
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Performance Score</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this performance score? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          
          {selectedScore && (
            <div className="space-y-4">
              <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                <div className="flex items-center space-x-2 mb-2">
                  <Trash2 className="h-5 w-5 text-red-600" />
                  <span className="font-medium text-red-900">Performance Score Details</span>
                </div>
                <div className="text-sm text-red-700 space-y-1">
                  <p><strong>Employee:</strong> {selectedScore.employeeId.name}</p>
                  <p><strong>Department:</strong> {selectedScore.employeeId.department}</p>
                  <p><strong>Period:</strong> {selectedScore.evaluationPeriod.quarter} {selectedScore.evaluationPeriod.year}</p>
                  <p><strong>Total Score:</strong> {selectedScore.scores.totalScore}%</p>
                  <p><strong>Category:</strong> {selectedScore.category}</p>
                  <p><strong>Status:</strong> {selectedScore.status}</p>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)} disabled={createLoading}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDeleteScore} disabled={createLoading}>
              {createLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Deleting...</span>
                </div>
              ) : (
                "Delete Score"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
