"use client"

import { useEffect, useState } from "react"
import { Send } from "lucide-react"
import { useRouter } from "next/navigation"
import { Email } from "../types" // Assuming you have an Email type defined
import axios from "@/lib/axiosInstance"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"

type EmailTemplate = {
    subject: string;
    message: string;
}

const emailTemplates: Record<NonNullable<Email["type"]>, EmailTemplate> = {
    general: {
        subject: "IT Department Notice",
        message: `Dear [Recipient Name],

I hope this email finds you well.

[Your message here]

Best regards,
IT Department
OneAim IT Solutions`
    },
    increment: {
        subject: "System Access Level Update",
        message: `Dear [Recipient Name],

This is to inform you about an update to your system access privileges.

Details:
- Previous Access Level: [Previous Level]
- New Access Level: [New Level]
- Effective From: [Date]
- Affected Systems: [System Names]

New Capabilities:
[List new features/access granted]

Please log out and log back in for the changes to take effect.

For any questions or assistance, please contact the IT Help Desk.

Best regards,
IT Department
OneAim IT Solutions`
    },
    decrement: {
        subject: "System Access Modification Notice",
        message: `Dear [Recipient Name],

This is to notify you about a modification to your system access rights.

Details:
- Current Access Level: [Current Level]
- Modified Access Level: [New Level]
- Effective From: [Date]
- Affected Systems: [System Names]

Changes in Access:
[List modified/removed access rights]

Reason for Modification:
[Specify reason]

If you believe this change affects your work, please discuss with your supervisor.

Best regards,
IT Department
OneAim IT Solutions`
    },
    penalty: {
        subject: "IT Policy Violation Notice",
        message: `Dear [Recipient Name],

This notice is regarding a violation of IT policies and security protocols.

Incident Details:
- Date of Incident: [Date]
- Nature of Violation: [Specify violation]
- Policy Reference: [Policy number/name]

Impact:
[Description of security/system impact]

Required Actions:
1. [Action item 1]
2. [Action item 2]
3. Complete mandatory security training by [Date]

Please schedule a meeting with IT Department to discuss this matter.

Best regards,
IT Department
OneAim IT Solutions`
    },
    member_crud: {
        subject: "IT System Access Update",
        message: `Dear Team,

This is to inform you about the following IT system access update:

User Details:
- Name: [User Name]
- Department: [Department]
- Employee ID: [Employee ID]
- Type of Change: [New Access/Modification/Revocation]
- Effective Date: [Date]

Systems Affected:
- [System 1]
- [System 2]
- [System 3]

Additional Information:
[Specific details about system access changes]

For any technical assistance, contact the IT Help Desk.

Best regards,
IT Department
OneAim IT Solutions`
    }
}




export default function ComposeEmailPage() {
  const router = useRouter()
  const [formData, setFormData] = useState<Email>({
    type: "general",
    recipient: "",
    sender: "admin@oneaimit.com",
    subject: emailTemplates.general.subject,
    message: emailTemplates.general.message,
    recipientEmail: "",
  })
  const [loading, setLoading] = useState(false) // Add loading state

  const [members, setMembers] = useState<{ id: string; email: string, name: string }[]>([])

  const fetchMembers = async () => {
    try {
      const response = await axios.get("/IT/org-members/empInfo")
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

    // Find the selected member to get their ID
    let recipientId = "";
    if (formData.recipient !== "other") {
      const selectedMember = members.find(member => member.email === formData.recipient);
      recipientId = selectedMember?.id || "";
    }

    axios.post("/mail/send", {
      type: formData.type,
      to: recipient,
      from: formData.sender,
      senderId: "ADM101", // Assuming admin is sending the email
      recipientId: recipientId,
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
                onChange={(e) => {
                  const newType = e.target.value as NonNullable<Email["type"]>;
                  if (newType && newType in emailTemplates) {
                    const template = emailTemplates[newType];
                    setFormData(prev => ({
                      ...prev,
                      type: newType,
                      subject: template.subject,
                      message: template.message
                    }));
                  }
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="general">General Notice</option>
                <option value="increment">System Access Upgrade</option>
                <option value="decrement">Access Modification</option>
                <option value="penalty">Policy Violation</option>
                <option value="member_crud">System Access Update</option>
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
