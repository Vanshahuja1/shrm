'use client'

import { useEffect, useState } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography
} from '@mui/material'
import { ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'

type EmployeeSalary = {
  id: number
  name: string
  department: string
  prevMonthSalary: number
  currentMonthSalary: number
}

export default function ReviewAllEmployeesPage() {
  const [data, setData] = useState<EmployeeSalary[]>([])
  const router = useRouter()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/payroll/salary-review')
        const json = await res.json()
        setData(json)
      } catch {
        setData([
          {
            id: 1,
            name: 'Ayesha Khan',
            department: 'Engineering',
            prevMonthSalary: 64000,
            currentMonthSalary: 66000
          },
          {
            id: 2,
            name: 'Rohan Mehta',
            department: 'HR',
            prevMonthSalary: 58000,
            currentMonthSalary: 58000
          },
          {
            id: 3,
            name: 'Neha Reddy',
            department: 'Sales',
            prevMonthSalary: 60000,
            currentMonthSalary: 59000
          }
        ])
      }
    }

    fetchData()
  }, [])

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      <div className="flex items-center gap-2">
        <ArrowLeft className="cursor-pointer text-red-500" onClick={() => router.push('/hr/payroll')} />
        <Typography variant="h5" className="text-red-600 font-semibold">
          📊 Salary Review & Comparison
        </Typography>
      </div>

      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Employee</TableCell>
              <TableCell>Department</TableCell>
              <TableCell>Previous Month</TableCell>
              <TableCell>Current Month</TableCell>
              <TableCell>Difference</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((emp) => {
              const diff = emp.currentMonthSalary - emp.prevMonthSalary
              const color = diff > 0 ? 'text-green-600' : diff < 0 ? 'text-red-600' : 'text-gray-600'

              return (
                <TableRow key={emp.id}>
                  <TableCell>{emp.name}</TableCell>
                  <TableCell>{emp.department}</TableCell>
                  <TableCell>₹{emp.prevMonthSalary.toLocaleString()}</TableCell>
                  <TableCell>₹{emp.currentMonthSalary.toLocaleString()}</TableCell>
                  <TableCell className={`font-medium ${color}`}>
                    {diff === 0 ? 'No Change' : `${diff > 0 ? '+' : ''}₹${diff.toLocaleString()}`}
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  )
}
