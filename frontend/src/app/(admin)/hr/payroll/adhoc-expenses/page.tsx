'use client'

import { useEffect, useState } from 'react'
import { Card, CardHeader, CardContent, Typography, Table, TableHead, TableRow, TableCell, TableBody, TableContainer, Paper } from '@mui/material'
import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'

interface AdhocPayment {
  id: number
  name: string
  department: string
  reason: string
  amount: number
  type: 'Reimbursement' | 'Adhoc Payment' | 'Deduction'
  status: 'Pending' | 'Approved' | 'Rejected'
}

export default function AdhocExpensesPage() {
  const [data, setData] = useState<AdhocPayment[]>([])
  const router = useRouter()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/payroll/adhoc-expenses')
        const json = await res.json()
        setData(json)
      } catch {
        setData([
          { id: 1, name: 'Rohan Mehta', department: 'Sales', reason: 'Travel Reimbursement', amount: 2400, type: 'Reimbursement', status: 'Pending' },
          { id: 2, name: 'Ayesha Khan', department: 'HR', reason: 'Phone Bill', amount: 800, type: 'Adhoc Payment', status: 'Approved' },
          { id: 3, name: 'Neha Reddy', department: 'IT', reason: 'Policy Violation', amount: 1000, type: 'Deduction', status: 'Rejected' }
        ])
      }
    }
    fetchData()
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-6xl mx-auto p-6 space-y-6"
    >
      <div className="flex items-center gap-3">
        <Button variant="outline" onClick={() => router.push('/hr/payroll')}>
          <ArrowLeft size={18} className="mr-2" />
          Back to Payroll
        </Button>
        <Typography variant="h5" className="text-red-600 font-bold">💼 Reimbursements & Adhoc Expenses</Typography>
      </div>

      <Card>
        <CardHeader title="Expense Summary" />
        <CardContent>
          <TableContainer component={Paper}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Department</TableCell>
                  <TableCell>Reason</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Amount (₹)</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>{item.department}</TableCell>
                    <TableCell>{item.reason}</TableCell>
                    <TableCell>{item.type}</TableCell>
                    <TableCell className={
                      item.status === 'Approved'
                        ? 'text-green-600'
                        : item.status === 'Rejected'
                        ? 'text-red-600'
                        : 'text-yellow-600'
                    }>
                      {item.status}
                    </TableCell>
                    <TableCell>₹{item.amount.toLocaleString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </motion.div>
  )
}
