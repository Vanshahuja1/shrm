'use client'

import { useState, useEffect } from 'react'

type ProgressStep =
  | 'Resume Received'
  | 'Forwarded to Manager'
  | 'Selected by Manager'
  | 'Rejected by Manager'
  | 'Selection Mail Sent'
  | 'Docs Received'
  | 'LOI Sent'
  | 'Policy Sent'
  | 'Signed Policy Received'
  | 'Offer Sent'
  | 'Completed'

type Candidate = {
  id: number
  name: string
  email: string
  status: string
  progress: ProgressStep[]
}

export default function OnboardingProcess() {
  const [candidates, setCandidates] = useState<Candidate[]>([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/recruitment/onboarding')
        if (!res.ok) throw new Error('Failed to fetch')
        const data: Candidate[] = await res.json()
        setCandidates(data)
      } catch {
        setCandidates([
          {
            id: 1,
            name: 'Vansh Ahuja',
            email: 'vansh@company.com',
            status: 'Docs Received',
            progress: [
              'Resume Received',
              'Forwarded to Manager',
              'Selected by Manager',
              'Selection Mail Sent',
              'Docs Received',
              'LOI Sent'
            ]
          },
          {
            id: 2,
            name: 'Neha Reddy',
            email: 'neha@company.com',
            status: 'Pending Manager Approval',
            progress: ['Resume Received', 'Forwarded to Manager']
          }
        ])
      }
    }

    fetchData()
  }, [])

  const nextSteps: Record<ProgressStep, ProgressStep | string> = {
    'Resume Received': 'Forwarded to Manager',
    'Forwarded to Manager': 'Selected by Manager',
    'Selected by Manager': 'Selection Mail Sent',
    'Rejected by Manager': 'Send Rejection Mail',
    'Selection Mail Sent': 'Docs Received',
    'Docs Received': 'LOI Sent',
    'LOI Sent': 'Policy Sent',
    'Policy Sent': 'Signed Policy Received',
    'Signed Policy Received': 'Offer Sent',
    'Offer Sent': 'Completed',
    'Completed': ''
  }

  return (
    <div className="bg-white border border-red-100 shadow-sm rounded-xl p-4 sm:p-6 text-gray-900">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">📝 Onboarding Tracker</h2>

      {/* Mobile View */}
      <div className="block sm:hidden space-y-4">
        {candidates.map((c) => {
          const current = c.progress[c.progress.length - 1]
          const next = nextSteps[current as ProgressStep]

          return (
            <div key={c.id} className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm shadow-sm">
              <p><span className="font-semibold">Name:</span> {c.name}</p>
              <p><span className="font-semibold">Email:</span> {c.email}</p>
              <p className="mt-1">
                <span className="inline-block px-2 py-1 rounded text-xs font-medium bg-yellow-100 text-yellow-700">
                  {c.status}
                </span>
              </p>
              <ul className="list-disc list-inside text-xs text-gray-600 mt-2">
                {c.progress.map((step, i) => (
                  <li key={i}>{step}</li>
                ))}
              </ul>
              <div className="mt-3">
                {next ? (
                  <button
                    onClick={() =>
                      setCandidates(prev =>
                        prev.map(x =>
                          x.id === c.id
                            ? {
                                ...x,
                                progress: [...x.progress, next as ProgressStep],
                                status: next === 'Completed' ? 'Completed' : next
                              }
                            : x
                        )
                      )
                    }
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-xs w-full"
                  >
                    {next}
                  </button>
                ) : (
                  <span className="text-xs text-green-600">✔ All steps done</span>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Desktop View */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="min-w-full text-sm border rounded">
          <thead className="bg-red-50 text-gray-800">
            <tr>
              <th className="text-left px-4 py-2 border-b">Name</th>
              <th className="text-left px-4 py-2 border-b">Email</th>
              <th className="text-left px-4 py-2 border-b">Status</th>
              <th className="text-left px-4 py-2 border-b">Progress</th>
              <th className="text-left px-4 py-2 border-b">Action</th>
            </tr>
          </thead>
          <tbody>
            {candidates.map((c) => {
              const current = c.progress[c.progress.length - 1]
              const next = nextSteps[current as ProgressStep]

              return (
                <tr key={c.id} className="hover:bg-red-50 text-gray-700">
                  <td className="px-4 py-2 border-b">{c.name}</td>
                  <td className="px-4 py-2 border-b">{c.email}</td>
                  <td className="px-4 py-2 border-b">
                    <span className="inline-block text-xs px-2 py-1 rounded bg-yellow-100 text-yellow-700">
                      {c.status}
                    </span>
                  </td>
                  <td className="px-4 py-2 border-b">
                    <ul className="list-disc list-inside text-xs text-gray-600">
                      {c.progress.map((step, i) => (
                        <li key={i}>{step}</li>
                      ))}
                    </ul>
                  </td>
                  <td className="px-4 py-2 border-b">
                    {next ? (
                      <button
                        onClick={() =>
                          setCandidates(prev =>
                            prev.map(x =>
                              x.id === c.id
                                ? {
                                    ...x,
                                    progress: [...x.progress, next as ProgressStep],
                                    status: next === 'Completed' ? 'Completed' : next
                                  }
                                : x
                            )
                          )
                        }
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-xs"
                      >
                        {next}
                      </button>
                    ) : (
                      <span className="text-xs text-green-600">✔ All steps done</span>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
