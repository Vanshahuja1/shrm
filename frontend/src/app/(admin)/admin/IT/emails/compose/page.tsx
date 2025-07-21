"use client"

import { useState } from "react"
import { Send } from "lucide-react"
import { useRouter } from "next/navigation"

interface Email {
  type: "member_crud" | "increment" | "decrement" | "penalty" | "general"
  recipient: string
  sender: string
  subject: string
  message: string
}

export default function ComposeEmailPage() {
  const router = useRouter()
  const [formData, setFormData] = useState<Email>({
    type: "general",
    recipient: "",
    sender: "admin@oneaimit.com",
    subject: "",
    message: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Sending email:", formData)
    router.push("/admin/IT/emails")
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <button
          onClick={() => router.push("/admin/IT/emails")}
          className="text-blue-600 hover:text-blue-800 font-medium"
        >
          ← Back to Inbox
        </button>
        <h1 className="text-2xl font-bold text-gray-900">Compose Email</h1>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email Type</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as Email["type"] })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="general">General</option>
                <option value="increment">Salary Increment</option>
                <option value="decrement">Salary Decrement</option>
                <option value="penalty">Penalty Notice</option>
                <option value="member_crud">Member Changes</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">From</label>
              <input
                type="email"
                value={formData.sender}
                onChange={(e) => setFormData({ ...formData, sender: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">To</label>
            <input
              type="email"
              value={formData.recipient}
              onChange={(e) => setFormData({ ...formData, recipient: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
            <input
              type="text"
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
            <textarea
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              rows={10}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              <Send size={16} />
              Send Email
            </button>
            <button
              type="button"
              onClick={() => router.push("/admin/IT/emails")}
              className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
