'use client'

import { useEffect, useState } from 'react'

type PerformanceReview = {
  id: number
  name: string
  rating: number
  feedback: string
}

export default function PerformanceReports() {
  const [reviews, setReviews] = useState<PerformanceReview[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPerformance = async () => {
      try {
        const res = await fetch('/api/reports/performance')
        if (!res.ok) throw new Error('Failed to fetch')
        const json: PerformanceReview[] = await res.json()
        setReviews(json)
      } catch {
        setReviews([
          { id: 1, name: 'Ayesha Khan', rating: 4.6, feedback: 'Excellent team player' },
          { id: 2, name: 'Rohan Mehta', rating: 2.9, feedback: 'Needs to improve deadlines' }
        ])
      } finally {
        setLoading(false)
      }
    }

    fetchPerformance()
  }, [])

  if (loading) return <p className="text-gray-500">Loading performance data...</p>

  return (
    <div className="bg-white border rounded-xl p-6 shadow text-gray-800">
      <h2 className="text-xl font-bold mb-4">📈 Performance Reports</h2>

      {/* Mobile View */}
      <div className="block sm:hidden space-y-4">
        {reviews.map((r) => (
          <div
            key={r.id}
            className="bg-gray-50 border border-gray-200 rounded-xl p-4 shadow-sm text-sm"
          >
            <p><span className="font-semibold">Name:</span> {r.name}</p>
            <p>
              <span className="font-semibold">Rating:</span>{' '}
              <span
                className={`font-medium ${
                  r.rating < 3
                    ? 'text-red-600'
                    : r.rating < 4
                    ? 'text-yellow-600'
                    : 'text-green-700'
                }`}
              >
                {r.rating}
              </span>
            </p>
            <p><span className="font-semibold">Feedback:</span> {r.feedback}</p>
          </div>
        ))}
      </div>

      {/* Desktop Table */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="w-full text-sm border rounded min-w-[500px]">
          <thead className="bg-gray-100">
            <tr>
              <th className="text-left px-4 py-2 border-b">Employee</th>
              <th className="text-left px-4 py-2 border-b">Rating</th>
              <th className="text-left px-4 py-2 border-b">Feedback</th>
            </tr>
          </thead>
          <tbody>
            {reviews.map((r) => (
              <tr key={r.id} className="hover:bg-gray-50">
                <td className="px-4 py-2 border-b">{r.name}</td>
                <td
                  className={`px-4 py-2 border-b font-medium ${
                    r.rating < 3
                      ? 'text-red-600'
                      : r.rating < 4
                      ? 'text-yellow-600'
                      : 'text-green-700'
                  }`}
                >
                  {r.rating}
                </td>
                <td className="px-4 py-2 border-b">{r.feedback}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
