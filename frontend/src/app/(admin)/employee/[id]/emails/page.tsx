// app/admin/IT/emails/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Mail, Send, Archive, Star } from "lucide-react";
import axios from "@/lib/axiosInstance";
import { Email } from "./types"; 

export default function EmailsPage() {  
  const router = useRouter();
  const [emails, setEmails] = useState<Email[]>([]);

  const { id } = useParams();

  useEffect(() => {
    // const fetchEmails = async () => {
    //   try {
    //     // Fetch both received and sent emails in parallel
    //     const [receivedResponse, sentResponse] = await Promise.all([
    //       axios.get(`/mail?recipientId=${id}`),
    //       axios.get(`/mail?senderId=${id}`)
    //     ]);

    //     const receivedEmails = receivedResponse.data.emails || [];
    //     const sentEmails = sentResponse.data.emails || [];

    //     // Combine both arrays of emails
    //     setEmails([...receivedEmails, ...sentEmails]);
    //   } catch (error) {
    //     console.error("Error fetching emails:", error);
    //   }
    // };

    const fetchNamesAndEmails = async () => {
      try {
      // Fetch emails
      const [receivedResponse, sentResponse] = await Promise.all([
        axios.get(`/mail?recipientId=${id}`),
        axios.get(`/mail?senderId=${id}`)
      ]);
      const receivedEmails = receivedResponse.data.emails || [];
      const sentEmails = sentResponse.data.emails || [];
      const allEmails = [...receivedEmails, ...sentEmails];

      // Collect unique user IDs (senders and recipients)
      const userIds = Array.from(
        new Set(
        allEmails
          .map(e => [e.senderId, e.recipientId])
          .flat()
          .filter(Boolean)
        )
      );

      // Fetch user names in parallel
      const usersRes = await Promise.all(
        userIds.map(uid => axios.get(`/user/name/${uid}`))
      );
      const userIdToName: Record<string, string> = {};
      usersRes.forEach((res, idx) => {
        userIdToName[userIds[idx]] = res.data?.name || "";
      });

      // Add senderName and receiverName to each email
      const emailsWithNames = allEmails.map(email => ({
        ...email,
        senderName: userIdToName[email.senderId] || "",
        recipientName: userIdToName[email.recipientId] || ""
      }));

      setEmails(emailsWithNames);
      console.log("Fetched emails with names:", emailsWithNames);
      } catch (error) {
      console.error("Error fetching emails or names:", error);
      }
    };
    fetchNamesAndEmails();

    // fetchEmails();
  }, [id]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Email History</h1>
        <button
          onClick={() => router.push(`/employee/${id}/emails/compose`)}
          className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Compose
        </button>
      </div>


      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
  <StatCard
    icon={<Mail size={24} className="text-blue-600" />}
    label="Received"
    value={emails.filter(e => e.senderId !== id).length}
    color="blue"
  />
  <StatCard
    icon={<Send size={24} className="text-green-600" />}
    label="Sent"
    value={emails.filter(e => e.senderId === id).length}
    color="green"
  />
  <StatCard
    icon={<Archive size={24} className="text-red-600" />}
    label="Failed"
    value={emails.filter(e => e.status === "failed").length}
    color="yellow"
  />
</div>

      {/* Email List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-3">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">All Emails</h2>
        {emails?.map((email : Email) => (
          <div
            key={email._id}
            onClick={() => router.push(`/employee/${id}/emails/${email._id}`)}
            className={`p-4 rounded-lg border transition hover:shadow-sm cursor-pointer ${
              email.isRead ? "bg-gray-50" : "bg-white"
            } ${
              email.senderId === id ? "border-green-200" : "border-blue-200"
            }`}
          >
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-gray-900">{email.subject}</p>
                  <span className={`px-2 py-0.5 text-xs rounded-full ${
                    email.sender === id 
                    ? "bg-green-100 text-green-700"
                    : "bg-blue-100 text-blue-700"
                  }`}>
                    {email.senderId === id ? "Sent" : "Received"}
                  </span>
                </div>
                <p className="text-sm text-gray-600">
                  {email.senderId === id 
                    ? `To: ${email.recipientName || email.recipient}` 
                    : `From: ${email.senderName || email.sender}`}
                </p>
                <p className="text-sm text-gray-400">{email?.sentAt?.toLocaleString()}</p>
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
