'use client'

import { useState, useEffect } from 'react'
import axios from "@/lib/axiosInstance"
import { Mail, Clock, Archive, Search } from "lucide-react"
import { Input } from "@/components/ui/input"

interface Email {
    _id: string
    type: string
    subject: string
    recipient: string
    recipientId: string
    senderId: string
    message: string
    sender: string
    status: 'sent' | 'pending' | 'failed'
    sentAt: string
}

export default function SentboxPage({ hrId }: { hrId: string }) {
    const [emails, setEmails] = useState<Email[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')

    const filteredEmails = emails.filter(email =>
        email.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        email.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
        email.recipient.toLowerCase().includes(searchTerm.toLowerCase())
    )

    useEffect(() => {
        const fetchSentEmails = async () => {
            try {
                const response = await axios.get(`/mail/sent/${hrId}`)
                setEmails(response.data.emails)
            } catch (error) {
                console.error('Error fetching sent emails:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchSentEmails()
    }, [hrId])

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
            </div>
        )
    }

    return (
        <div className="bg-white border border-red-100 rounded-xl p-4 sm:p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">📤 Sent Emails</h2>
                <div className="text-sm text-gray-500">
                    {emails.length} sent
                </div>
            </div>

            <div className="mb-4 relative">
                <Input
                    type="text"
                    placeholder="Search sent emails..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                />
                <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>

            <div className="space-y-4">
                {filteredEmails.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                        {emails.length === 0 ? 'No sent emails found' : 'No emails match your search'}
                    </div>
                ) : (
                    filteredEmails.map((email) => (
                        <div
                            key={email._id}
                            className="border border-red-100 rounded-lg p-4 hover:bg-red-50 transition-colors"
                        >
                            <div className="flex items-start justify-between mb-2">
                                <div>
                                    <h3 className="font-medium text-gray-900">{email.subject}</h3>
                                    <p className="text-sm text-gray-600">To: {email.recipient}</p>
                                </div>
                                <span className={`px-2 py-1 text-xs rounded-full ${email.status === 'sent' ? 'bg-green-100 text-green-800' :
                                    email.status === 'failed' ? 'bg-red-100 text-red-800' :
                                        'bg-yellow-100 text-yellow-800'
                                    }`}>
                                    {email.status.charAt(0).toUpperCase() + email.status.slice(1)}
                                </span>
                            </div>
                            <p className="text-sm text-gray-600 line-clamp-2 mb-2">{email.message}</p>
                            <div className="flex items-center justify-between text-xs text-gray-500">
                                <div className="flex items-center gap-2">
                                    <Clock className="w-4 h-4" />
                                    {new Date(email.sentAt).toLocaleDateString()}
                                </div>
                                <div className="flex items-center gap-2">
                                    <Mail className="w-4 h-4" />
                                    {email.type}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}
