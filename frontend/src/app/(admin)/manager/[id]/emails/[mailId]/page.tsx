"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Archive } from "lucide-react";
import axios from "@/lib/axiosInstance";
import { Email } from "../types";

export default function EmailDetailPage() {
  const { mailId } = useParams();
  const router = useRouter();
  const [email, setEmail] = useState<Email | null>(null);
  const [senderName, setSenderName] = useState("");
  const [recipientName, setRecipientName] = useState("");

  useEffect(() => {
    if (!mailId) return;

    axios
      .get(`/mail/${mailId}`)
      .then(async (response) => {
        const emailData = response.data.email;
        setEmail(emailData);

        try {
          const [senderRes, recipientRes] = await Promise.all([
            axios.get(`/user/name/${emailData.senderId}`),
            axios.get(`/user/name/${emailData.recipientId}`),
          ]);

          setSenderName(senderRes.data.name || emailData.sender);
          setRecipientName(recipientRes.data.name || emailData.recipient);
        } catch (nameErr) {
          console.error("Error fetching names:", nameErr);
          // Fallback to IDs
          setSenderName(emailData.sender);
          setRecipientName(emailData.recipient);
        }
      })
      .catch((error) => {
        console.error("Error fetching email:", error);
      });
  }, [mailId]);

  if (!email) {
    return <p className="text-center mt-12 text-gray-500">Email not found</p>;
  }

  return (
  <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
    {/* Back Button */}
    <div className="flex items-center">
      <button
        onClick={() => router.back()}
        className="text-sm flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium transition"
      >
        ← Back to Inbox
      </button>
    </div>

    {/* Email Container */}
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 sm:p-10 space-y-8">
      {/* Email Header */}
      <div className="space-y-6 border-b border-gray-100 pb-6">
        <h1 className="text-3xl font-semibold text-gray-900">{email.subject}</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm sm:text-base">
          <div className="space-y-1">
            <span className="block text-gray-500 font-medium">From:</span>
            <div className="space-y-0.5">
              <p className="text-gray-800 font-semibold">{senderName}</p>
              <p className="text-gray-600 text-sm">{email.sender}</p>
            </div>
          </div>
          <div className="space-y-1">
            <span className="block text-gray-500 font-medium">To:</span>
            <div className="space-y-0.5">
              <p className="text-gray-800 font-semibold">{recipientName}</p>
              <p className="text-gray-600 text-sm">{email.recipient}</p>
            </div>
          </div>
          <div className="space-y-1">
            <span className="block text-gray-500 font-medium">Date:</span>
            <p className="text-gray-800">
              {email.sentAt
                ? `${new Date(email.sentAt).toLocaleDateString()} at ${new Date(email.sentAt).toLocaleTimeString()}`
                : "N/A"}
            </p>
          </div>
          <div className="space-y-1">
            <span className="block text-gray-500 font-medium">Type:</span>
            <p className="text-gray-800 capitalize">{email.type}</p>
          </div>
        </div>
      </div>

      {/* Email Body */}
      <div className="text-gray-700 text-base sm:text-lg leading-relaxed whitespace-pre-wrap">
        {email.message}
      </div>
    </div>
  </div>
);

}
