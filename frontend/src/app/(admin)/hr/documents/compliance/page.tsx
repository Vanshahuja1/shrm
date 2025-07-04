'use client'

import { useEffect, useState } from 'react'

interface ComplianceRecord {
  id: number
  name: string
  email: string
  status: 'Pending' | 'Submitted' | 'Verified'
  document: string | null
}

export default function LegalCompliance() {
  const [records, setRecords] = useState<ComplianceRecord[]>([])
  const [sentMailIds, setSentMailIds] = useState<number[]>([])

  useEffect(() => {
    const fetchComplianceData = async () => {
      try {
        const res = await fetch('/api/employees/compliance')
        const data: ComplianceRecord[] = await res.json()
        setRecords(data)
      } catch {
        setRecords([
          {
            id: 1,
            name: 'Vansh Ahuja',
            email: 'vansh@company.com',
            status: 'Pending',
            document: null
          },
          {
            id: 2,
            name: 'Neha Reddy',
            email: 'neha@company.com',
            status: 'Submitted',
            document: '/docs/compliance-neha.pdf'
          }
        ])
      }
    }

    fetchComplianceData()
  }, [])

  return (
    <div className="bg-white border border-red-100 shadow-sm rounded-xl p-4 sm:p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">📄 Legal Compliance</h2>

      <div className="hidden sm:block overflow-x-auto">
        <table className="min-w-full text-sm border rounded">
          <thead className="bg-red-50 text-gray-800">
            <tr>
              <th className="text-left px-4 py-2 border-b">S no.</th>
              <th className="text-left px-4 py-2 border-b">Name</th>
              <th className="text-left px-4 py-2 border-b">Email</th>
              <th className="text-left px-4 py-2 border-b">Status</th>
              <th className="text-left px-4 py-2 border-b">View</th>
              <th className="text-left px-4 py-2 border-b">Send Mail</th>
            </tr>
          </thead>
          <tbody>
            {records.map((emp, index) => (
              <tr key={emp.id} className="hover:bg-red-50 text-gray-700">
                <td className="px-4 py-2 border-b">{index + 1}</td>
                <td className="px-4 py-2 border-b">{emp.name}</td>
                <td className="px-4 py-2 border-b">{emp.email}</td>
                <td className="px-4 py-2 border-b">
                  <span
                    className={`inline-block px-2 py-1 rounded text-xs ${
                      emp.status === 'Verified'
                        ? 'bg-green-50 text-green-600'
                        : emp.status === 'Submitted'
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {emp.status}
                  </span>
                </td>
                <td className="px-4 py-2 border-b">
                  {emp.status === 'Submitted' && emp.document ? (
                    <a
                      href={emp.document}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                    >
                      View
                    </a>
                  ) : (
                    '—'
                  )}
                </td>
                <td className="px-4 py-2 border-b">
                  <button
                    onClick={() => {
                      setSentMailIds((prev) => [...prev, emp.id])
                      setTimeout(() => {
                        alert(`✅ Mail sent to ${emp.email}`)
                      }, 100)
                    }}
                    disabled={sentMailIds.includes(emp.id)}
                    className={`px-3 py-1 rounded text-xs ${
                      sentMailIds.includes(emp.id)
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-green-500 hover:bg-green-600 text-white'
                    }`}
                  >
                    {sentMailIds.includes(emp.id) ? 'Sent' : 'Send Mail'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="sm:hidden space-y-4">
        {records.map((emp, index) => (
          <div
            key={emp.id}
            className="border border-red-100 shadow-sm bg-white rounded-xl p-4 text-gray-800"
          >
            <p className="text-sm font-medium text-gray-900">
              {index + 1} — {emp.name}
            </p>
            <p className="text-sm text-gray-700">{emp.email}</p>
            <p className="text-sm">
              <span
                className={`inline-block mt-1 px-2 py-1 rounded text-xs ${
                  emp.status === 'Verified'
                    ? 'bg-green-50 text-green-600'
                    : emp.status === 'Submitted'
                    ? 'bg-yellow-100 text-yellow-700'
                    : 'bg-red-100 text-red-700'
                }`}
              >
                {emp.status}
              </span>
            </p>

            <div className="mt-3 space-y-2 mx-2">
              {emp.status === 'Submitted' && emp.document ? (
                <a
                  href={emp.document}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block bg-red-500 hover:bg-red-600 text-white text-xs px-3 py-1 rounded"
                >
                  View Document
                </a>
              ) : (
                <p className="text-sm">No document submitted</p>
              )}

              <button
                onClick={() => {
                  setSentMailIds((prev) => [...prev, emp.id])
                  setTimeout(() => {
                    alert(`✅ Mail sent to ${emp.email}`)
                  }, 100)
                }}
                disabled={sentMailIds.includes(emp.id)}
                className={`mt-2 px-3 py-1 rounded text-xs w-fit ${
                  sentMailIds.includes(emp.id)
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-green-500 hover:bg-green-600 text-white'
                }`}
              >
                {sentMailIds.includes(emp.id) ? 'Sent' : 'Send Mail'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
