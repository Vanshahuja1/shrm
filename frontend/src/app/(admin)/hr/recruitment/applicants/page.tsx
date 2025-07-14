"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";

const fallbackData = [
  {
    id: 1,
    name: "Cameron Riley",
    email: "cameron@acr.com",
    jobTitle: "Process Associate",
    appliedDate: "XX/XX/XXXX",
    status: "Hired",
  },
  {
    id: 2,
    name: "Bev Davis",
    email: "davis@fgl.com",
    jobTitle: "Executive Officer",
    appliedDate: "XX/XX/XXXX",
    status: "Applications",
  },
  {
    id: 3,
    name: "Noel Jones",
    email: "noel@dp.com",
    jobTitle: "Analyst",
    appliedDate: "XX/XX/XXXX",
    status: "Application",
  },
  {
    id: 4,
    name: "Robin Macdonald",
    email: "Text Here",
    jobTitle: "Text Here",
    appliedDate: "XX/XX/XXXX",
    status: "Text Here",
  },
  {
    id: 5,
    name: "River Henderson",
    email: "Text Here",
    jobTitle: "Text Here",
    appliedDate: "XX/XX/XXXX",
    status: "Text Here",
  },
];

export default function ApplicantsPage() {
  const [applicants, setApplicants] = useState(fallbackData);
  const router = useRouter();

  useEffect(() => {
    async function fetchApplicants() {
      try {
        const res = await fetch("/api/applicants");
        const data = await res.json();
        setApplicants(data);
      } catch (err) {
        setApplicants(fallbackData);
      }
    }
    fetchApplicants();
  }, []);

  return (
    <div className="min-h-screen bg-neutral p-6">
      <div className="text-sm text-accent mb-4">
        <Link
          href="/hr/recruitment"
          className="inline-flex items-center gap-1 text-sm font-medium text-primary underline "
        >
          ← Back to Recruitment Dashboard
        </Link>
      </div>

      <Card className="bg-white shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-contrast">
            Application Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm table-fixed border-collapse">
              <thead>
                <tr className="bg-primary text-white">
                  <th className="px-4 py-2 text-left w-12">S.No.</th>
                  <th className="px-4 py-2 text-left pl-6">Application Name</th>
                  <th className="px-4 py-2 text-left">Email</th>
                  <th className="px-4 py-2 text-left">Job Title</th>
                  <th className="px-4 py-2 text-left">Job Applied Date</th>
                  <th className="px-4 py-2 text-left">Current Status</th>
                </tr>
              </thead>
              <tbody>
                {applicants.map((applicant, index) => (
                  <motion.tr
                    key={index}
                    className="cursor-pointer hover:bg-[#FDD0C4] transition-colors"
                    whileHover={{ y: -2 }}
                    onClick={() =>
                      router.push(`/hr/recruitment/applicants/${applicant.id}`)
                    }
                  >
                    <td className="px-4 py-2 border-b text-contrast font-medium">
                      {index + 1}
                    </td>
                    <td className="px-4 py-2 border-b text-contrast">
                      {applicant.name}
                    </td>
                    <td className="px-4 py-2 border-b text-contrast">
                      {applicant.email}
                    </td>
                    <td className="px-4 py-2 border-b text-contrast">
                      {applicant.jobTitle}
                    </td>
                    <td className="px-4 py-2 border-b text-contrast">
                      {applicant.appliedDate}
                    </td>
                    <td className="px-4 py-2 border-b">
                      <Badge variant="secondary">{applicant.status}</Badge>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
