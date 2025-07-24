// app/admin/IT/emails/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, Send, Archive, Star } from "lucide-react";
import axios from "@/lib/axiosInstance";
import { Email } from "./types"; 

export default function EmailsPage() {
  const router = useRouter();
  const [emails, setEmails] = useState<Email[]>([]);

  useEffect(() => {
  axios.get("/mail").then(response => {
    setEmails(response.data.emails || []);
  });
}, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Inbox</h1>
        <button
          onClick={() => router.push("/admin/IT/emails/compose")}
          className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Compose
        </button>
      </div>


      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard icon={<Mail size={24} className="text-blue-600" />} label="Total" value={emails.length} color="blue" />
        <StatCard icon={<Send size={24} className="text-green-600" />} label="Sent" value={emails?.filter(e => e.status === "sent").length} color="green" />
        <StatCard icon={<Archive size={24} className="text-yellow-600" />} label="Unread" value={emails?.filter(e => !e.isRead).length} color="yellow" />
        <StatCard icon={<Star size={24} className="text-purple-600" />} label="Starred" value={emails?.filter(e => e.isStarred).length} color="purple" />
      </div>

      {/* Email List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-3">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Emails</h2>
        {emails?.map((email) => (
          <div
            key={email._id}
            onClick={() => router.push(`/admin/IT/emails/${email._id}`)}
            className={`p-4 rounded-lg border transition hover:shadow-sm cursor-pointer ${email.isRead ? "bg-gray-50 border-gray-200" : "bg-white border-blue-200"
              }`}
          >
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <p className="font-semibold text-gray-900">{email.subject}</p>
                <p className="text-sm text-gray-600">To: {email.recipient}</p>
                <p className="text-sm text-gray-400">{email.sentAt.toLocaleString()}</p>
              </div>
              {email.isStarred && <Star className="text-yellow-500 fill-current" size={18} />}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  color: "blue" | "green" | "yellow" | "purple";
}) {
  const colorMap = {
    blue: "bg-blue-100 text-blue-600",
    green: "bg-green-100 text-green-600",
    yellow: "bg-yellow-100 text-yellow-600",
    purple: "bg-purple-100 text-purple-600",
  }[color];

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200">
      <div className="flex items-center gap-3">
        <div className={`p-3 rounded-lg ${colorMap}`}>{icon}</div>
        <div>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          <p className="text-gray-600">{label}</p>
        </div>
      </div>
    </div>
  );
}
