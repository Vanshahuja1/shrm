"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Archive, Forward, Reply, Star, Trash2 } from "lucide-react";

interface Email {
  id: number;
  type: "member_crud" | "increment" | "decrement" | "penalty" | "general";
  recipient: string;
  sender: string;
  subject: string;
  message: string;
  timestamp: string;
  status: "sent" | "pending" | "failed" | "draft";
  isRead: boolean;
  isStarred: boolean;
  attachments?: string[];
}

const sampleEmails: Email[] = [
  {
    id: 1,
    type: "increment",
    recipient: "john.doe@oneaimit.com",
    sender: "hr@oneaimit.com",
    subject: "Salary Increment Notification",
    message: "Your salary has been increased by $5,000.",
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
    subject: "New Employee Added",
    message: "A new employee Jane Smith has been added.",
    timestamp: "2024-01-14T14:20:00Z",
    status: "sent",
    isRead: false,
    isStarred: true,
  },
];

export default function EmailDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [email, setEmail] = useState<Email | null>(null);

  useEffect(() => {
    const found = sampleEmails.find((e) => e.id === Number(id));
    if (found) setEmail(found);
  }, [id]);

  if (!email) {
    return <p className="text-center mt-12 text-gray-500">Email not found</p>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <button
          onClick={() => router.push("/admin/IT/emails")}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium"
        >
          ← Back to Inbox
        </button>
        <div className="flex gap-2">
          <button className="p-2 text-gray-400 hover:text-yellow-500">
            <Star size={20} />
          </button>
          <button className="p-2 text-gray-400 hover:text-blue-600">
            <Reply size={20} />
          </button>
          <button className="p-2 text-gray-400 hover:text-blue-600">
            <Forward size={20} />
          </button>
          <button className="p-2 text-gray-400 hover:text-red-600">
            <Trash2 size={20} />
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <div className="border-b border-gray-200 pb-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">{email.subject}</h1>

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
                {new Date(email.timestamp).toLocaleDateString()} at {new Date(email.timestamp).toLocaleTimeString()}
              </p>
            </div>
            <div>
              <span className="font-semibold text-gray-700">Type:</span>
              <p className="text-gray-900">{email.type}</p>
            </div>
          </div>
        </div>

        <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
          {email.message}
        </div>

        {email.attachments && email.attachments.length > 0 && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-3">Attachments</h3>
            <div className="space-y-2">
              {email.attachments.map((file, index) => (
                <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                  <Archive size={16} className="text-gray-400" />
                  <span className="text-sm text-gray-700">{file}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
