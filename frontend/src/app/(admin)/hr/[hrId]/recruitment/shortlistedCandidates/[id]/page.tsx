'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';


const fallbackDetails = {
  id: 'noel-jones',
  name: 'Noel Jones',
  email: 'noel@dp.com',
  jobTitle: 'Analyst',
  appliedDate: '2024-06-01',
  screeningScore: 89,
  interviewScheduled: '2024-06-05',
  recruiterAssigned: 'John Mathew',
  source: 'LinkedIn',
  notes: 'Top 10% profile',
  portfolioLink: 'https://portfolio.noel.com',
  resumeLink: 'https://resume.noel.com',
  location: 'Remote',
  expectedSalary: '$55,000',
  currentCompany: 'Delta Inc.',
};

export default function ShortlistedDetailPage() {
  const { id } = useParams();
  const [candidate, setCandidate] = useState(fallbackDetails);

  useEffect(() => {
    async function fetchCandidate() {
      try {
        const res = await fetch(`/api/shortlisted/${id}`);
        const data = await res.json();
        setCandidate(data);
      } catch {
        setCandidate(fallbackDetails);
      }
    }
    fetchCandidate();
  }, [id]);

  return (
    <div className="min-h-screen bg-gray-50 p-6 space-y-6">
      <div className="text-sm mb-2">
        <Link
          href="/hr/recruitment/shortlistedCandidates"
          className="text-blue-600 underline"
        >
          ← Back to Shortlisted Candidates
        </Link>
      </div>

      <h1 className="text-2xl font-bold text-contrast">Candidate Details: {candidate.name}</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-contrast">
        <p><strong>Email:</strong> {candidate.email}</p>
        <p><strong>Job Title:</strong> {candidate.jobTitle}</p>
        <p><strong>Applied Date:</strong> {candidate.appliedDate}</p>
        <p><strong>Screening Score:</strong> {candidate.screeningScore}</p>
        <p><strong>Interview Scheduled:</strong> {candidate.interviewScheduled}</p>
        <p><strong>Recruiter Assigned:</strong> {candidate.recruiterAssigned}</p>
        <p><strong>Source:</strong> {candidate.source}</p>
        <p><strong>Notes:</strong> {candidate.notes}</p>
        <p><strong>Portfolio:</strong> <a href={candidate.portfolioLink} className="text-blue-600 underline" target="_blank">View</a></p>
        <p><strong>Resume:</strong> <a href={candidate.resumeLink} className="text-blue-600 underline" target="_blank">Download</a></p>
        <p><strong>Location:</strong> {candidate.location}</p>
        <p><strong>Expected Salary:</strong> {candidate.expectedSalary}</p>
        <p><strong>Current Company:</strong> {candidate.currentCompany}</p>
      </div>
    </div>
  );
}
