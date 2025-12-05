// app/admin/IT/emails/page.tsx
"use client";

//import { useEffect, useState } from "react";
//import { useParams, /* useRouter */ } from "next/navigation";
// import { Mail, Send,  Star, FilterX, Inbox, Users } from "lucide-react";
//import axios from "@/lib/axiosInstance";
//import { Email } from "./types"; 
import { motion } from "framer-motion";
export default function EmailsPage() {  
  // // const router = useRouter();
  // //const [emails, setEmails] = useState<Email[]>([]);
  // // const [loading, setLoading] = useState(true);
  // // const [error, setError] = useState<string | null>(null);
  // //const { id } = useParams();

  // // const [filters, setFilters] = useState({
  // //   category: 'all'  
  // // });

  // // const filteblueEmails = emails.filter(email => {
  // //   if (filters.category !== 'all') {
  // //     if (filters.category === 'sent' && email.senderId !== id) return false;
  // //     if (filters.category === 'received' && email.senderId === id) return false;
  // //     if (filters.category === 'cc' && (!email.cc || !email.cc.includes(String(id)))) return false;
  // //   }
  // //   return true;
  // // }).sort((a, b) => {
  // //   const dateA = new Date(a.sentAt || 0).getTime();
  // //   const dateB = new Date(b.sentAt || 0).getTime();
  // //   return dateB - dateA; // Sort in descending order (most recent first)
  // // });

  // useEffect(() => {
  //   const fetchEmails = async () => {
  //     try {
  //       // setLoading(true);
  //       // setError(null);
        
  //       // Fetch emails with query parameters for both sent and received
  //       const [receivedResponse, sentResponse] = await Promise.all([
  //         axios.get<{ emails: Email[] }>('/mail', {
  //           params: {
  //             recipientId: id
  //           }
  //         }),
  //         axios.get<{ emails: Email[] }>('/mail', {
  //           params: {
  //             senderId: id
  //           }
  //         })
  //       ]);
        
  //       const receivedEmails: Email[] = receivedResponse.data?.emails || [];
  //       const sentEmails: Email[] = sentResponse.data?.emails || [];
        
  //       // Remove duplicates using email _id
  //       const emailMap = new Map<string, Email>();
  //       ;[...receivedEmails, ...sentEmails].forEach((email: Email) => {
  //         if (email._id) {
  //           emailMap.set(String(email._id), email);
  //         }
  //       });

  //       const allEmails = Array.from(emailMap.values());
        
  //       // Collect unique user IDs (senders and recipients)
  //       const userIds = Array.from(
  //         new Set(
  //           allEmails
  //             .map((e: Email) => [e.senderId, e.recipientId])
  //             .flat()
  //             .filter(Boolean)
  //         )
  //       );

  //       // Fetch user names in parallel
  //       const usersRes = await Promise.all(
  //         userIds.map(uid => axios.get<{ name: string }>(`/user/name/${uid}`))
  //       );
        
  //       const userIdToName: Record<string, string> = {};
  //       usersRes.forEach((res, idx) => {
  //         if (userIds[idx]) {
  //           userIdToName[userIds[idx]] = res.data?.name || "";
  //         }
  //       });

  //       // Add senderName and receiverName to each email
  //       const emailsWithNames = allEmails.map((email: Email) => ({
  //         ...email,
  //         senderName: email.senderId ? userIdToName[email.senderId] || "" : "",
  //         recipientName: email.recipientId ? userIdToName[email.recipientId] || "" : ""
  //       }));

  //       setEmails(emailsWithNames);
  //     } catch (err) {
  //       console.error("Error fetching emails:", err);
  //       // setError("Failed to load emails. Please try again.");
  //     } finally {
  //       // setLoading(false);
  //     }
  //   };
    
  //   if (id) {
  //     fetchEmails();
  //   }
  // }, [id, setEmails]);

  // // const formatDate = (dateString: string | Date) => {
  // //   try {
  // //     const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
  // //     return date.toLocaleString();
  // //   } catch  {
  // //     return 'Invalid date';
  // //   }
  // // };

  return (
    
    <div className="flex items-center justify-center min-h-[70vh] bg-white text-gray-800 px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center space-y-4"
      >
        
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-3xl font-semibold tracking-tight"
        >
          Stay Tuned!
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-lg text-gray-500"
        >
          Coming in the next update...
        </motion.p>

        {/* Loading dots animation */}
        <motion.div
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="text-gray-400 text-2xl font-bold"
        >
          • • •
        </motion.div>

      </motion.div>
    </div>
  );
}