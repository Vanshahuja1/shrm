"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Mail, Send, Inbox, SendIcon as Sent, Archive, Trash2, Search, Filter, Plus, Eye, Reply, Forward, Star } from 'lucide-react'

interface Email {
  id: number
  type: "member_crud" | "increment" | "decrement" | "penalty" | "general"
  recipient: string
  sender: string
  subject: string
  message: string
  timestamp: string
  status: "sent" | "pending" | "failed" | "draft"
  isRead: boolean
  isStarred: boolean
  attachments?: string[]
}

const sampleEmails: Email[] = [
  {
    id: 1,
    type: "increment",
    recipient: "john.doe@oneaimit.com",
    sender: "hr@oneaimit.com",
    subject: "Salary Increment Notification",
    message: "Dear John, We are pleased to inform you that your salary has been increased by $5,000 effective immediately. This increment reflects your excellent performance and dedication to the company.",
    timestamp: "2024-01-15T10:30:00Z",
    status: "sent",
    isRead: true,
    isStarred: false,
  },
  {
    id: 2,
    type: "member_crud",
    recipient: "hr@oneaimit.com",
    sender: "admin@oneaimit.com",
    subject: "New Employee Added - Jane Smith",
    message: "A new employee Jane Smith has been added to the IT Development department. Please process the onboarding documentation.",
    timestamp: "2024-01-14T14:20:00Z",
    status: "sent",
    isRead: false,
    isStarred: true,
  },
  {
    id: 3,
    type: "penalty",
    recipient: "mike.johnson@oneaimit.com",
    sender: "hr@oneaimit.com",
    subject: "Penalty Deduction Notice",
    message: "Dear Mike, This is to inform you that a penalty of $500 has been deducted from your salary due to repeated tardiness. Please ensure punctuality going forward.",
    timestamp: "2024-01-13T09:15:00Z",
    status: "sent",
    isRead: true,
    isStarred: false,
  },
]

export default function EmailSystem() {
  const [emails, setEmails] = useState(sampleEmails)
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null)
  const [currentView, setCurrentView] = useState<"inbox" | "sent" | "drafts" | "compose">("inbox")
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")

  const filteredEmails = emails.filter((email) => {
    const matchesSearch =
      email.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      email.recipient.toLowerCase().includes(searchTerm.toLowerCase()) ||
      email.sender.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = typeFilter === "all" || email.type === typeFilter
    return matchesSearch && matchesType
  })

  const getEmailTypeColor = (type: Email["type"]) => {
    switch (type) {
      case "increment":
        return "bg-green-100 text-green-800 border-green-200"
      case "decrement":
        return "bg-red-100 text-red-800 border-red-200"
      case "penalty":
        return "bg-orange-100 text-orange-800 border-orange-200"
      case "member_crud":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "general":
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getStatusColor = (status: Email["status"]) => {
    switch (status) {
      case "sent":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "failed":
        return "bg-red-100 text-red-800"
      case "draft":
        return "bg-gray-100 text-gray-800"
    }
  }

  const markAsRead = (id: number) => {
    setEmails(emails.map((email) => (email.id === id ? { ...email, isRead: true } : email)))
  }

  const toggleStar = (id: number) => {
    setEmails(emails.map((email) => (email.id === id ? { ...email, isStarred: !email.isStarred } : email)))
  }

  if (selectedEmail) {
    return (
      <EmailDetail
        email={selectedEmail}
        onBack={() => setSelectedEmail(null)}
        onMarkAsRead={markAsRead}
        onToggleStar={toggleStar}
      />
    )
  }

  if (currentView === "compose") {
    return (
      <ComposeEmail
        onBack={() => setCurrentView("inbox")}
        onSend={(emailData) => {
          const newEmail: Email = {
            id: Math.max(...emails.map((e) => e.id)) + 1,
            ...emailData,
            timestamp: new Date().toISOString(),
            status: "sent",
            isRead: false,
            isStarred: false,
          }
          setEmails([newEmail, ...emails])
          setCurrentView("inbox")
        }}
      />
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900"></h1>
          <p className="text-gray-600"></p>
        </div>
        <button
          onClick={() => setCurrentView("compose")}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus size={20} />
          Compose Email
        </button>
      </div>

      {/* Navigation */}
      <div className="flex gap-4 border-b border-gray-200">
        {[
          { id: "inbox", label: "Inbox", icon: Inbox },
          { id: "sent", label: "Sent", icon: Sent },
          { id: "drafts", label: "Drafts", icon: Archive },
        ].map((item) => {
          const Icon = item.icon
          return (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.id as any)}
              className={`flex items-center gap-2 px-4 py-2 border-b-2 transition-colors ${
                currentView === item.id
                  ? "border-blue-600 text-blue-600 font-semibold"
                  : "border-transparent text-gray-600 hover:text-gray-900"
              }`}
            >
              <Icon size={20} />
              {item.label}
            </button>
          )
        })}
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search emails..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="all">All Types</option>
          <option value="increment">Salary Increment</option>
          <option value="decrement">Salary Decrement</option>
          <option value="penalty">Penalty</option>
          <option value="member_crud">Member Changes</option>
          <option value="general">General</option>
        </select>
      </div>

      {/* Email Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Mail className="text-blue-600" size={24} />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{emails.length}</p>
              <p className="text-gray-600">Total Emails</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-green-100 rounded-lg">
              <Send className="text-green-600" size={24} />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {emails.filter((e) => e.status === "sent").length}
              </p>
              <p className="text-gray-600">Sent</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-yellow-100 rounded-lg">
              <Archive className="text-yellow-600" size={24} />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {emails.filter((e) => !e.isRead).length}
              </p>
              <p className="text-gray-600">Unread</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-purple-100 rounded-lg">
              <Star className="text-purple-600" size={24} />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {emails.filter((e) => e.isStarred).length}
              </p>
              <p className="text-gray-600">Starred</p>
            </div>
          </div>
        </div>
      </div>

      {/* Email List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">
            {currentView.charAt(0).toUpperCase() + currentView.slice(1)}
          </h3>
          <div className="space-y-3">
            {filteredEmails.map((email) => (
              <motion.div
                key={email.id}
                whileHover={{ scale: 1.01 }}
                className={`p-4 border rounded-lg cursor-pointer transition-all ${
                  email.isRead ? "bg-gray-50 border-gray-200" : "bg-white border-blue-200 shadow-sm"
                }`}
                onClick={() => {
                  setSelectedEmail(email)
                  markAsRead(email.id)
                }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="flex items-center gap-2">
                        {email.isStarred && <Star className="text-yellow-500 fill-current" size={16} />}
                        <span className={`font-semibold ${email.isRead ? "text-gray-700" : "text-gray-900"}`}>
                          {currentView === "sent" ? email.recipient : email.sender}
                        </span>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getEmailTypeColor(email.type)}`}>
                        {email.type.replace("_", " ")}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(email.status)}`}>
                        {email.status}
                      </span>
                    </div>
                    <h4 className={`font-semibold mb-1 ${email.isRead ? "text-gray-700" : "text-gray-900"}`}>
                      {email.subject}
                    </h4>
                    <p className="text-gray-600 text-sm line-clamp-2">{email.message}</p>
                  </div>
                  <div className="text-right ml-4">
                    <p className="text-sm text-gray-500">
                      {new Date(email.timestamp).toLocaleDateString()}
                    </p>
                    <p className="text-xs text-gray-400">
                      {new Date(email.timestamp).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// Email Detail Component
function EmailDetail({
  email,
  onBack,
  onMarkAsRead,
  onToggleStar,
}: {
  email: Email
  onBack: () => void
  onMarkAsRead: (id: number) => void
  onToggleStar: (id: number) => void
}) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <button onClick={onBack} className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium">
          ← Back to Emails
        </button>
        <div className="flex gap-2">
          <button
            onClick={() => onToggleStar(email.id)}
            className={`p-2 rounded-lg transition-colors ${
              email.isStarred ? "text-yellow-500 bg-yellow-50" : "text-gray-400 hover:text-yellow-500"
            }`}
          >
            <Star size={20} className={email.isStarred ? "fill-current" : ""} />
          </button>
          <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors">
            <Reply size={20} />
          </button>
          <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors">
            <Forward size={20} />
          </button>
          <button className="p-2 text-gray-400 hover:text-red-600 transition-colors">
            <Trash2 size={20} />
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <div className="border-b border-gray-200 pb-6 mb-6">
          <div className="flex items-start justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-900">{email.subject}</h1>
            <div className="flex gap-2">
              <span className={`px-3 py-1 rounded-full text-sm font-medium border ${
                email.type === "increment" ? "bg-green-100 text-green-800 border-green-200" :
                email.type === "decrement" ? "bg-red-100 text-red-800 border-red-200" :
                email.type === "penalty" ? "bg-orange-100 text-orange-800 border-orange-200" :
                email.type === "member_crud" ? "bg-blue-100 text-blue-800 border-blue-200" :
                "bg-gray-100 text-gray-800 border-gray-200"
              }`}>
                {email.type.replace("_", " ")}
              </span>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                email.status === "sent" ? "bg-green-100 text-green-800" :
                email.status === "pending" ? "bg-yellow-100 text-yellow-800" :
                email.status === "failed" ? "bg-red-100 text-red-800" :
                "bg-gray-100 text-gray-800"
              }`}>
                {email.status}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-semibold text-gray-700">From:</span>
              <p className="text-gray-900">{email.sender}</p>
            </div>
            <div>
              <span className="font-semibold text-gray-700">To:</span>
              <p className="text-gray-900">{email.recipient}</p>
            </div>
            <div>
              <span className="font-semibold text-gray-700">Date:</span>
              <p className="text-gray-900">
                {new Date(email.timestamp).toLocaleDateString()} at{" "}
                {new Date(email.timestamp).toLocaleTimeString()}
              </p>
            </div>
            <div>
              <span className="font-semibold text-gray-700">Type:</span>
              <p className="text-gray-900">{email.type.replace("_", " ")}</p>
            </div>
          </div>
        </div>

        <div className="prose max-w-none">
          <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">{email.message}</div>
        </div>

        {email.attachments && email.attachments.length > 0 && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-3">Attachments</h3>
            <div className="space-y-2">
              {email.attachments.map((attachment, index) => (
                <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                  <Archive size={16} className="text-gray-400" />
                  <span className="text-sm text-gray-700">{attachment}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// Compose Email Component
function ComposeEmail({
  onBack,
  onSend,
}: {
  onBack: () => void
  onSend: (email: Omit<Email, "id" | "timestamp" | "status" | "isRead" | "isStarred">) => void
}) {
  const [formData, setFormData] = useState({
    type: "general" as Email["type"],
    recipient: "",
    sender: "admin@oneaimit.com",
    subject: "",
    message: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSend(formData)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <button onClick={onBack} className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium">
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
              placeholder="recipient@oneaimit.com"
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
              onClick={onBack}
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
