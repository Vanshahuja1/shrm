'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import axios from "@/lib/axiosInstance"

interface Employee {
  id: number
  name: string
  email: string
  organization: string
  department: string
  role: string
}

export default function PenaltyNotificationPage() {
  const params = useParams()
  const [employees, setEmployees] = useState<Employee[]>([])
  const [hrId, setHrId] = useState<string>('')
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    // Get hrId from params
    if (params.hrId) {
      setHrId(params.hrId as string)
    }

    // Mock employees data - replace with actual API call
    const mockEmployees: Employee[] = [
      {
        id: 1,
        name: 'John Doe',
        email: 'john.doe@company.com',
        organization: 'Tech Corp',
        department: 'Engineering',
        role: 'Software Engineer'
      },
      {
        id: 2,
        name: 'Jane Smith',
        email: 'jane.smith@company.com',
        organization: 'Tech Corp',
        department: 'Marketing',
        role: 'Marketing Manager'
      }
    ]
    setEmployees(mockEmployees)
  }, [params.hrId])
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [penalty, setPenalty] = useState('')
  const [reason, setReason] = useState('')
  const [sentIds, setSentIds] = useState<number[]>([])
  const [sending, setSending] = useState(false)

  const filtered = employees.filter(
    (emp) =>
      emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.organization.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.department.toLowerCase().includes(searchTerm.toLowerCase())
  )

  async function handleEmailCompose(emp: Employee, penalty: string, reason: string) {
    setSending(true)
    setSelectedId(emp.id)
    try {
      await axios.post('/mail/send', {
        type: 'general',
        from: hrId,
        senderId: hrId,
        to: emp.email,
        recipientId: emp.id,
        subject: `Penalty Notification - ${emp.name}`,
        text: `You have been assigned a penalty of ${penalty} for the following reason: ${reason}`
      })

      setSentIds(prev => [...prev, emp.id])
      alert(`✅ Email sent to ${emp.name} (${emp.email}) with penalty of ${penalty} for reason: ${reason}`)
      setPenalty('')
      setReason('')
      setSelectedId(null)
    } catch (error) {
      console.error('Error sending notification:', error)
      alert('❌ Failed to send notification. Please try again.')
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="min-h-screen  p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-red-100 mb-8">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 text-red-600">⚠️ Penalty Notification</h2>
          <div className="relative max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search employee by name, org, department, or role..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-red-300 rounded-xl shadow-sm focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-all duration-200"
            />
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map(emp => (
            <div
              key={emp.id}
              className={`relative rounded-2xl border-2 p-6 transition-all duration-300 hover:shadow-lg ${
                sentIds.includes(emp.id)
                  ? 'bg-red-50 border-red-200 shadow-red-100'
                  : 'bg-white border-red-100 hover:border-red-300 hover:shadow-red-100'
              }`}
            >
              {/* Employee Info */}
              <div className="mb-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center text-white font-semibold text-lg">
                    {emp.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-lg">{emp.name}</h3>
                    <p className="text-sm text-gray-600">{emp.email}</p>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex gap-2"><span className="text-gray-600">Organization:</span><span className="font-medium">{emp.organization}</span></div>
                  <div className="flex gap-2"><span className="text-gray-600">Department:</span><span className="font-medium">{emp.department}</span></div>
                  <div className="flex gap-2"><span className="text-gray-600">Role:</span><span className="font-medium">{emp.role}</span></div>
                </div>
              </div>

              {/* Notification */}
              {sentIds.includes(emp.id) ? (
                <div className="flex items-center justify-center gap-2 text-red-700 bg-red-100 rounded-xl py-3 px-4">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="font-medium">Notification Sent</span>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-2">Penalty Amount</label>
                      <input
                        type="number"
                        placeholder="0.00"
                        value={selectedId === emp.id ? penalty : ''}
                        onChange={(e) => { setSelectedId(emp.id); setPenalty(e.target.value) }}
                        className="w-full px-3 py-2 text-sm border border-red-300 rounded-lg focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-all duration-200"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-2">Reason</label>
                      <input
                        type="text"
                        placeholder="Reason..."
                        value={selectedId === emp.id ? reason : ''}
                        onChange={(e) => { setSelectedId(emp.id); setReason(e.target.value) }}
                        className="w-full px-3 py-2 text-sm border border-red-300 rounded-lg focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-all duration-200"
                      />
                    </div>
                  </div>
                  <button
                    onClick={() => handleEmailCompose(emp, penalty, reason)}
                    disabled={selectedId !== emp.id || !penalty || !reason || sending}
                    className={`w-full py-3 px-4 rounded-xl font-medium text-sm transition-all duration-200 flex items-center justify-center gap-2 ${
                      selectedId !== emp.id || !penalty || !reason || sending
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-red-600 text-white hover:bg-red-700 transform hover:-translate-y-0.5 shadow-md hover:shadow-lg'
                    }`}
                  >
                    {sending && selectedId === emp.id ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Sending...
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        Send Penalty Notification
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
