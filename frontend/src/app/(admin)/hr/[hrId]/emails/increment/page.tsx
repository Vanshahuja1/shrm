'use client'

import { useEffect, useState, useCallback } from 'react'
import { useParams } from 'next/navigation'
import axios from "@/lib/axiosInstance"
import { X, ChevronDown } from "lucide-react"

interface Employee {
  id: number
  name: string
  email: string
  organization: string
  department: string
  role: string
}

interface EmailTemplate {
  id: string
  name: string
  subject: string
  message: string
}

const EMAIL_TEMPLATES: EmailTemplate[] = [
  {
    id: 'formal',
    name: 'Formal Template',
    subject: 'Salary Increment Notification - {incrementPercent}% Increase',
    message: `Dear {employeeName},

We are pleased to inform you that effective from {effectiveDate}, your salary has been increased by {incrementPercent}%.

This increment reflects your valuable contribution to the organization and our appreciation for your dedicated service.

If you have any questions regarding this increment, please feel free to reach out to the HR department.

Best regards,
Human Resources Department
{organizationName}`
  },
  {
    id: 'detailed',
    name: 'Detailed Template',
    subject: 'Salary Increment Notification - {incrementPercent}% Effective {effectiveDate}',
    message: `Dear {employeeName},

Subject: Salary Increment Notification

We are delighted to inform you that your performance review has resulted in a salary increment of {incrementPercent}%.

Details:
• Employee Name: {employeeName}
• Department: {department}
• Position: {role}
• Increment Percentage: {incrementPercent}%
• Effective Date: {effectiveDate}

This increment is a testament to your excellent performance, commitment, and contribution to our organization's success.

The updated salary will be reflected in your next payroll cycle. Please update your records accordingly.

Should you have any queries or require clarification, please don't hesitate to contact the HR department.

Congratulations on this well-deserved recognition!

Warm regards,
Human Resources Team
{organizationName}`
  },
  {
    id: 'custom',
    name: 'Custom Template',
    subject: '',
    message: ''
  }
]

export default function IncrementNotificationPage() {
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
  const [sentIds, setSentIds] = useState<number[]>([])
  const [showModal, setShowModal] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState<string>('formal')
  const [showTemplateDropdown, setShowTemplateDropdown] = useState(false)
  const [emailForm, setEmailForm] = useState({
    to: '',
    subject: '',
    message: '',
    incrementPercent: '',
    effectiveDate: new Date().toISOString().split('T')[0]
  })
  const [sending, setSending] = useState(false)

  const getCurrentEmployee = useCallback(() => {
    return employees.find(emp => emp.email === emailForm.to)
  }, [employees, emailForm.to])

  const applyTemplate = useCallback((templateId: string) => {
    const template = EMAIL_TEMPLATES.find(t => t.id === templateId)
    if (!template) return

    const currentEmployee = getCurrentEmployee()
    if (!currentEmployee) return

    // Replace placeholders with actual values
    const replacePlaceholders = (text: string) => {
      return text
        .replace(/{employeeName}/g, currentEmployee.name)
        .replace(/{incrementPercent}/g, emailForm.incrementPercent || '[PERCENTAGE]')
        .replace(/{effectiveDate}/g, emailForm.effectiveDate)
        .replace(/{department}/g, currentEmployee.department)
        .replace(/{role}/g, currentEmployee.role)
        .replace(/{organizationName}/g, currentEmployee.organization)
    }

    setEmailForm(prev => ({
      ...prev,
      subject: replacePlaceholders(template.subject),
      message: replacePlaceholders(template.message)
    }))
  }, [emailForm.incrementPercent, emailForm.effectiveDate, getCurrentEmployee])

  const handleTemplateChange = (templateId: string) => {
    setSelectedTemplate(templateId)
    setShowTemplateDropdown(false)
    
    if (templateId !== 'custom') {
      applyTemplate(templateId)
    } else {
      // Clear for custom template
      setEmailForm(prev => ({
        ...prev,
        subject: '',
        message: ''
      }))
    }
  }


useEffect(() => {
  if (selectedTemplate !== 'custom' && emailForm.incrementPercent) {
    applyTemplate(selectedTemplate)
  }
}, [emailForm.incrementPercent, emailForm.effectiveDate, selectedTemplate, applyTemplate])

  const filtered = employees.filter(
    (emp) =>
      emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.organization.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.role.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="bg-white border border-red-100 rounded-xl p-4 sm:p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900">📈 Salary Increment Notification</h2>
        <div className="text-sm text-gray-500">
          {employees.length} Employees
        </div>
      </div>

      <div className="flex items-center gap-4 mb-6">
        <input
          type="text"
          placeholder="Search employee by name, org, or role"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 px-4 py-2 border border-red-100 rounded-lg text-sm shadow-sm text-gray-900 focus:ring-2 focus:ring-red-500 focus:border-red-500"
        />
      </div>

      <div className="overflow-hidden rounded-lg border border-red-100">
        <table className="min-w-full divide-y divide-red-100">
          <thead className="bg-red-50">
            <tr>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-red-500 uppercase tracking-wider">
                Employee
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-red-500 uppercase tracking-wider">
                Department
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-red-500 uppercase tracking-wider">
                Role
              </th>
              <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-red-500 uppercase tracking-wider">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-red-100">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-sm text-gray-500">
                  {searchTerm ? 'No employees match your search' : 'No employees found'}
                </td>
              </tr>
            ) : (
              filtered.map((emp) => (
                <tr 
                  key={emp.id}
                  className={`hover:bg-red-50 transition-colors ${
                    selectedId === emp.id ? 'bg-red-50' : ''
                  }`}
                >
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{emp.name}</div>
                        <div className="text-sm text-gray-500">{emp.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{emp.department}</div>
                    <div className="text-xs text-gray-500">{emp.organization}</div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                      {emp.role}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                    {sentIds.includes(emp.id) ? (
                      <span className="text-xs text-green-600 flex items-center justify-end gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                        Sent
                      </span>
                    ) : (
                      <button
                        onClick={() => {
                          setSelectedId(emp.id)
                          setEmailForm(prev => ({
                            ...prev,
                            to: emp.email,
                            subject: '',
                            message: '',
                            incrementPercent: '',
                            effectiveDate: new Date().toISOString().split('T')[0]
                          }))
                          setSelectedTemplate('formal')
                          setShowModal(true)
                        }}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-red-500 text-white hover:bg-red-600"
                      >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        Compose
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Email Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-4xl mx-4 relative max-h-[90vh] overflow-y-auto">
            <button 
              onClick={() => setShowModal(false)}
              className="absolute right-4 top-4 p-1 hover:bg-gray-100 rounded-full z-10"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>

            <h3 className="text-lg font-semibold text-gray-900 mb-6">Compose Increment Email</h3>

            <form onSubmit={async (e) => {
              e.preventDefault()
              setSending(true)
              try {
                await axios.post('/mail/send', {
                  type: 'increment',
                  from: hrId,
                  senderId: hrId,
                  to: emailForm.to,
                  recipientId: selectedId,

                  subject: emailForm.subject,
                  message: emailForm.message,
                  incrementPercent: emailForm.incrementPercent,
                  effectiveDate: emailForm.effectiveDate
                })
                
                // Add to sent IDs
                if (selectedId) {
                  setSentIds(prev => [...prev, selectedId])
                }
                
                // Reset and close
                setEmailForm({ to: '', subject: '', message: '', incrementPercent: '', effectiveDate: new Date().toISOString().split('T')[0] })
                setShowModal(false)
                setSelectedId(null)
                setSelectedTemplate('formal')
              } catch (error) {
                console.error('Error sending notification:', error)
                alert('Failed to send notification. Please try again.')
              } finally {
                setSending(false)
              }
            }}>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left Column - Form Fields */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">To:</label>
                    <input
                      type="email"
                      value={emailForm.to}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-gray-50"
                      required
                      readOnly
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Increment %:</label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        step="0.01"
                        placeholder="Enter percentage"
                        value={emailForm.incrementPercent}
                        onChange={(e) => setEmailForm(prev => ({ ...prev, incrementPercent: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Effective Date:</label>
                      <input
                        type="date"
                        value={emailForm.effectiveDate}
                        onChange={(e) => setEmailForm(prev => ({ ...prev, effectiveDate: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email Template:</label>
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => setShowTemplateDropdown(!showTemplateDropdown)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-white text-left flex items-center justify-between"
                      >
                        <span>{EMAIL_TEMPLATES.find(t => t.id === selectedTemplate)?.name}</span>
                        <ChevronDown className="w-4 h-4 text-gray-400" />
                      </button>
                      
                      {showTemplateDropdown && (
                        <div className="absolute z-20 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg">
                          {EMAIL_TEMPLATES.map((template) => (
                            <button
                              key={template.id}
                              type="button"
                              onClick={() => handleTemplateChange(template.id)}
                              className={`w-full px-3 py-2 text-left hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg ${
                                selectedTemplate === template.id ? 'bg-red-50 text-red-700' : 'text-gray-900'
                              }`}
                            >
                              {template.name}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Subject:</label>
                    <input
                      type="text"
                      value={emailForm.subject}
                      onChange={(e) => setEmailForm(prev => ({ ...prev, subject: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      required
                      placeholder="Email subject"
                    />
                  </div>
                </div>

                {/* Right Column - Message */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Message:</label>
                    <textarea
                      value={emailForm.message}
                      onChange={(e) => setEmailForm(prev => ({ ...prev, message: e.target.value }))}
                      rows={16}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 resize-none"
                      required
                      placeholder="Email message"
                    />
                  </div>

                  {selectedTemplate !== 'custom' && (
                    <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded-lg">
                      <p className="font-medium mb-1">Available placeholders:</p>
                      <div className="grid grid-cols-2 gap-1">
                        <span>• {'{employeeName}'}</span>
                        <span>• {'{incrementPercent}'}</span>
                        <span>• {'{effectiveDate}'}</span>
                        <span>• {'{department}'}</span>
                        <span>• {'{role}'}</span>
                        <span>• {'{organizationName}'}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-6 border-t border-gray-200 mt-6">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={sending || !emailForm.incrementPercent || !emailForm.subject || !emailForm.message}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-lg hover:bg-red-600 disabled:bg-red-300"
                >
                  {sending ? 'Sending...' : 'Send Email'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}