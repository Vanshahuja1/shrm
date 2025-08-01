'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

const fallbackHired = [
  {
    id: 'cameron-riley',
    name: 'Cameron Riley',
    email: 'cameron@acr.com',
    jobTitle: 'Process Associate',
    appliedDate: '2024-06-10',
    status: 'Hired',
  },
  {
    id: 'sara-mills',
    name: 'Sara Mills',
    email: 'sara@xyz.com',
    jobTitle: 'UI Designer',
    appliedDate: '2024-06-15',
    status: 'Hired',
  },
];

export default function HiredCandidatesPage() {
  const [candidates, setCandidates] = useState(fallbackHired);
  const router = useRouter();

  useEffect(() => {
    async function fetchHired() {
      try {
        const res = await fetch('/api/hired');
        const data = await res.json();
        setCandidates(data);
      } catch {
        setCandidates(fallbackHired);
      }
    }
    fetchHired();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-6 space-y-6">
      <div className="text-sm">
        <Link href="/hr/recruitment" className="text-blue-600 underline">
          ← Back to Recruitment Dashboard
        </Link>
      </div>

      <h1 className="text-2xl font-bold text-contrast">Hired Candidates</h1>
      <div className="overflow-x-auto">
        <table className="w-full text-sm table-fixed border-collapse">
          <thead>
            <tr className="bg-primary text-white">
              <th className="px-4 py-2 text-left w-12">#</th>
              <th className="px-4 py-2 text-left pl-6">Name</th>
              <th className="px-4 py-2 text-left">Email</th>
              <th className="px-4 py-2 text-left">Job Title</th>
              <th className="px-4 py-2 text-left">Applied Date</th>
            </tr>
          </thead>
          <tbody>
            {candidates.map((c, index) => (
              <motion.tr
                key={index}
                className="cursor-pointer hover:bg-[#FDD0C4] transition-colors"
                whileHover={{ y: -2 }}
                onClick={() =>
                  router.push(`/hr/recruitment/hiredCandidates/${c.id}`)
                }
              >
                <td className="px-4 py-2 border-b text-contrast font-medium">{index + 1}</td>
                <td className="px-4 py-2 border-b text-contrast">{c.name}</td>
                <td className="px-4 py-2 border-b text-contrast">{c.email}</td>
                <td className="px-4 py-2 border-b text-contrast">{c.jobTitle}</td>
                <td className="px-4 py-2 border-b text-contrast">{c.appliedDate}</td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
