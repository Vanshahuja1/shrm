"use client"

import { useEffect, useState } from "react"
import { Send } from "lucide-react"
import { useRouter } from "next/navigation"
import { Email } from "../types" // Assuming you have an Email type defined
import axios from "@/lib/axiosInstance"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"



export default function ComposeEmailPage() {
  const router = useRouter()
  const [formData, setFormData] = useState<Email>({
    type: "general",
    recipient: "",
    sender: "admin@oneaimit.com",
    subject: "",
    message: "",
    recipientEmail: "",
  })
  const [loading, setLoading] = useState(false) // Add loading state

  const [members, setMembers] = useState<{ id: string; email: string, name: string }[]>([])

  const fetchMembers = async () => {
    try {
      const response = await axios.get("/IT/org-members//empInfo")
      setMembers(response.data)
    } catch (error) {
      console.error("Error fetching members:", error)
    }
  }

  useEffect(() => {
    fetchMembers()
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true) // Start loading

    const recipient =
      formData.recipient === "other"
        ? formData.recipientEmail
        : formData.recipient;

    axios.post("/mail/send", {
      type: formData.type,
      to: recipient,
      from: formData.sender,
      subject: formData.subject,
      text: formData.message,
    })
      .then(() => {
        router.push("/admin/IT/emails")
      })
      .catch((error) => {
        console.error("Error sending email:", error)
      })
      .finally(() => {
        setLoading(false) // Stop loading
      })
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
            <div className="flex gap-2">
              <Select
                value={formData.recipient}
                onValueChange={(value) => setFormData({ ...formData, recipient: value })}
              >
                <SelectTrigger className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                  <SelectValue placeholder="Select recipient" />
                </SelectTrigger>
                <SelectContent>
                  {members.map((member) => (
                    <SelectItem key={member.id} value={member.email || member.id}>
                      {member.name ? (
                        <>
                          {member.name} ({member.email}){" "}
                          <span className="text-gray-500">[{member.id}]</span>
                        </>
                      ) : (
                        <>
                          {member.email || member.id} <span className="text-gray-500">[{member.id}]</span>
                        </>
                      )}
                    </SelectItem>
                  ))}
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
              {formData.recipient === "other" && (
                <input
                  type="email"
                  placeholder="Enter recipient email"
                  value={formData.recipientEmail || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, recipientEmail: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  autoComplete="off"
                  required
                />
              )}
            </div>
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
              disabled={loading} // Disable while loading
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-4 w-4 mr-2 text-white" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  Sending...
                </>
              ) : (
                <>
                  <Send size={16} />
                  Send Email
                </>
              )}
            </button>
            <button
              type="button"
              onClick={() => router.push("/admin/IT/emails")}
              className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700"
              disabled={loading} // Optionally disable cancel while loading
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
