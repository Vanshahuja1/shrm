"use client"

import { useEffect, useState } from "react"
import { Send } from "lucide-react"
import { useParams, useRouter } from "next/navigation"
import axios from "@/lib/axiosInstance"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"

type EmailTemplate = {
    subject: string;
    message: string;
}

const emailTemplates: Record<NonNullable<Email["type"]>, EmailTemplate> = {
    general: {
        subject: "General Notice",
        message: `Dear [Employee Name],

I hope this email finds you well.

[Your message here]

Best regards,
HR Department`
    },
    increment: {
        subject: "Salary Increment Notification",
        message: `Dear [Employee Name],

We are pleased to inform you that your salary has been reviewed and an increment has been approved.

Details:
- Effective Date: [Date]
- Previous Salary: [Previous Amount]
- New Salary: [New Amount]
- Increment Amount: [Amount]
- Increment Percentage: [Percentage]%

This increment reflects our recognition of your valuable contributions and consistent performance.

Please note that all other terms and conditions of your employment remain unchanged.

If you have any questions, please feel free to contact the HR department.

Best regards,
HR Department`
    },
    decrement: {
        subject: "Salary Adjustment Notice",
        message: `Dear [Employee Name],

This letter serves as formal notification regarding an adjustment to your salary structure.

Details:
- Effective Date: [Date]
- Current Salary: [Current Amount]
- Adjusted Salary: [New Amount]
- Adjustment Amount: [Amount]

Reason for Adjustment:
[Specify reason]

If you would like to discuss this matter further, please schedule an appointment with HR.

Best regards,
HR Department`
    },
    penalty: {
        subject: "Notice of Disciplinary Action",
        message: `Dear [Employee Name],

This notice is to formally document a disciplinary action.

Incident Details:
- Date of Incident: [Date]
- Nature of Violation: [Specify violation]
- Policy Reference: [Policy number/name]

Penalty Details:
- Type of Action: [Warning/Monetary Penalty/Suspension]
- Penalty Amount (if applicable): [Amount]
- Duration (if applicable): [Duration]

Please schedule a meeting with HR within the next 48 hours to discuss this matter.

You have the right to appeal this decision within [X] days of receiving this notice.

Regards,
HR Department`
    },
    member_crud: {
        subject: "Staff Update Notification",
        message: `Dear Team,

This is to inform you of the following organizational update:

Employee Details:
- Name: [Employee Name]
- Department: [Department]
- Position: [Position]
- Type of Change: [New Joining/Promotion/Transfer/Exit]
- Effective Date: [Date]

Additional Information:
[Specific details about the change]

Please update your records accordingly.

Best regards,
HR Department`
    }
}

type Email = {
    _id?: number;
    type?: "member_crud" | "increment" | "decrement" | "penalty" | "general";
    recipient?: string;
    sender?: string;
    subject?: string;
    message?: string;
    sentAt?: string;
    status?: "sent" | "pending" | "failed" | "draft";
    isRead?: boolean;
    isStarred?: boolean;
    attachments?: string[];
    recipientEmail?: string; // Optional for "other" recipient
};



export default function ComposeEmailPage() {
    const router = useRouter()
    const [formData, setFormData] = useState<Email>({
        type: "general",
        recipient: "",
        sender: "",
        subject: emailTemplates.general.subject,
        message: emailTemplates.general.message,
        recipientEmail: "",
    })

    const [errors, setErrors] = useState({
        sender: "",
        recipient: "",
        subject: "",
        message: "",
        recipientEmail: "",
    })

    const { hrId } = useParams()
    const [loading, setLoading] = useState(false)

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
    }, [hrId])

    useEffect(() => {
        const fetchEmployee = async () => {
            try {
                const response = await axios.get(`/IT/org-members/${hrId}`)
                setFormData(prev => ({
                    ...prev,
                    sender: response.data.contactInfo.email || "",
                }))
            }
            catch (error) {
                console.error("Error fetching employee data:", error)
            }
        }
        fetchEmployee()
    }, [hrId])


    const validateForm = () => {
        let isValid = true;
        const newErrors = {
            sender: "",
            recipient: "",
            subject: "",
            message: "",
            recipientEmail: "",
        };

        // Validate sender
        if (!formData?.sender?.trim()) {
            newErrors.sender = "Sender email is required";
            isValid = false;
        } else if (!/\S+@\S+\.\S+/.test(formData.sender)) {
            newErrors.sender = "Please enter a valid email address";
            isValid = false;
        }

        // Validate recipient
        if (!formData.recipient) {
            newErrors.recipient = "Please select a recipient";
            isValid = false;
        }

        // Validate recipient email if "other" is selected
        if (formData.recipient === "other" && !formData.recipientEmail?.trim()) {
            newErrors.recipientEmail = "Recipient email is required";
            isValid = false;
        } else if (formData.recipient === "other" && !/\S+@\S+\.\S+/.test(formData.recipientEmail || "")) {
            newErrors.recipientEmail = "Please enter a valid email address";
            isValid = false;
        }

        // Validate subject
        if (!formData?.subject?.trim()) {
            newErrors.subject = "Subject is required";
            isValid = false;
        }

        // Validate message
        if (!formData?.message?.trim()) {
            newErrors.message = "Message is required";
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setLoading(true);

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
            senderId: hrId, // Assuming admin is sending the email
            recipientId: recipientId,
            subject: formData.subject,
            text: formData.message,
        })
            .then(() => {
                router.push(`/hr/${hrId}/emails`)
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
                    onClick={() => router.back()}
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
                        <div className="flex flex-col gap-2">
                            <div className="flex gap-2">
                                <Select
                                    value={formData.recipient}
                                    onValueChange={(value) => setFormData({ ...formData, recipient: value })}
                                >
                                    <SelectTrigger className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${errors.recipient ? 'border-red-500' : 'border-gray-300'
                                        }`}>
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
                                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${errors.recipientEmail ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                        autoComplete="off"
                                    />
                                )}
                            </div>
                            {errors.recipient && (
                                <p className="text-sm text-red-500">{errors.recipient}</p>
                            )}
                            {errors.recipientEmail && formData.recipient === "other" && (
                                <p className="text-sm text-red-500">{errors.recipientEmail}</p>
                            )}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                        <input
                            type="text"
                            value={formData.subject || ''}
                            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${errors.subject ? 'border-red-500' : 'border-gray-300'
                                }`}
                        />
                        {errors.subject && (
                            <p className="mt-1 text-sm text-red-500">{errors.subject}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                        <textarea
                            value={formData.message || ''}
                            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                            rows={10}
                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${errors.message ? 'border-red-500' : 'border-gray-300'
                                }`}
                        />
                        {errors.message && (
                            <p className="mt-1 text-sm text-red-500">{errors.message}</p>
                        )}
                    </div>

                    <div className="flex gap-4">
                        <button
                            type="submit"
                            className="flex items-center gap-2 bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700"
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
                            onClick={() => router.push(`/hr/${hrId}/emails`)}
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
