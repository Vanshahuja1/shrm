"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Archive, Forward, Reply, Star, Trash2 } from "lucide-react";
import axios from "@/lib/axiosInstance";
import { Email } from "../types"; // Adjust the import based on your project structure


export default function EmailDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [email, setEmail] = useState<Email | null>(null);

  useEffect(() => {
    axios.get(`/mail/${id}`).then(response => {
      console.log("Fetched email:", response.data);
      setEmail(response.data.email);
    }).catch(error => {
      console.error("Error fetching email:", error);
    });
  }, []);
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
                {email.sentAt
                  ? `${new Date(email.sentAt).toLocaleDateString()} at ${new Date(email.sentAt).toLocaleTimeString()}`
                  : "N/A"}
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
