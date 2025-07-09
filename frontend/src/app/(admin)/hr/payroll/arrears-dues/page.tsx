'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardHeader, CardContent, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'

interface Arrear {
  id: number
  name: string
  department: string
  type: 'Arrear' | 'Due'
  reason: string
  period: string
  amount: number
  status: 'Unpaid' | 'Paid'
}

export default function ArrearsDuesPage() {
  const [data, setData] = useState<Arrear[]>([])
  const router = useRouter()

  useEffect(() => {
    const fetchArrears = async () => {
      try {
        const res = await fetch('/api/payroll/arrears-dues')
        const json = await res.json()
        setData(json)
      } catch {
        setData([
          { id: 1, name: 'Ayesha Khan', department: 'Engineering', type: 'Arrear', reason: 'Unpaid Overtime', period: 'May 2025', amount: 2200, status: 'Unpaid' },
          { id: 2, name: 'Rohan Mehta', department: 'Sales', type: 'Due', reason: 'Missed Salary Adjustment', period: 'April 2025', amount: 1500, status: 'Paid' },
          { id: 3, name: 'Neha Reddy', department: 'HR', type: 'Arrear', reason: 'Bonus Recalculation', period: 'March 2025', amount: 800, status: 'Unpaid' }
        ])
      }
    }

    fetchArrears()
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-6xl mx-auto p-6 space-y-6"
    >
      <div className="flex items-center gap-3">
        <Button variant="outline" onClick={() => router.push('/hr/payroll')}>
          <ArrowLeft size={18} className="mr-2" />
          Back to Payroll
        </Button>
        <Typography variant="h5" className="text-red-600 font-bold">📌 Arrears & Dues</Typography>
      </div>

      <Card>
        <CardHeader title="Arrear & Due Records" />
        <CardContent>
          <TableContainer component={Paper}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Department</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Reason</TableCell>
                  <TableCell>Period</TableCell>
                  <TableCell>Amount (₹)</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell>{row.name}</TableCell>
                    <TableCell>{row.department}</TableCell>
                    <TableCell>{row.type}</TableCell>
                    <TableCell>{row.reason}</TableCell>
                    <TableCell>{row.period}</TableCell>
                    <TableCell>₹{row.amount.toLocaleString()}</TableCell>
                    <TableCell className={
                      row.status === 'Paid'
                        ? 'text-green-600'
                        : 'text-yellow-600'
                    }>
                      {row.status}
                    </TableCell>
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
