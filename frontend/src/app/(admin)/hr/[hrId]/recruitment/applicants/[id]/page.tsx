'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import toast, { Toaster } from 'react-hot-toast';

const fallbackDetails = {
  id: 'cameron-riley',
  name: 'Cameron Riley',
  email: 'cameron@acr.com',
  jobTitle: 'Process Associate',
  appliedDate: 'XX/XX/XXXX',
  shortlisted: true,
  screeningScore: 87,
  interviewScheduled: null as string | null,
  recruiterAssigned: '',
  status: 'Application',
  source: 'LinkedIn',
  notes: 'Strong communication skills, quick learner',
  portfolioLink: 'https://portfolio.cameron.dev',
  resumeLink: 'https://resume.cameron.dev',
  location: 'New York, USA',
  expectedSalary: '$60,000/year',
  currentCompany: 'ABC Inc.',
};

export default function ApplicantDetailPage() {
  const { id } = useParams();
 const [applicant, setApplicant] = useState(fallbackDetails);


  const [interviewDate, setInterviewDate] = useState('');
  const [recruiter, setRecruiter] = useState('');

  useEffect(() => {
    async function fetchApplicant() {
      try {
        const res = await fetch(`/api/applicants/${id}`);
        const data = await res.json();
        setApplicant(data);
      } catch {
        setApplicant(fallbackDetails);
      }
    }
    fetchApplicant();
  }, [id]);

  const handleScheduleInterview = () => {
    if (!interviewDate || !recruiter) {
      toast.error('Please fill both fields');
      return;
    }

    setApplicant((prev) => ({
      ...prev,
      interviewScheduled: interviewDate,
      recruiterAssigned: recruiter,
      status: 'Interview Scheduled',
    }));

    toast.success('Interview scheduled successfully!');
    setInterviewDate('');
    setRecruiter('');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 space-y-6">
      <Toaster position="top-right" />
      
      <div className="text-sm mb-2">
        <Link
          href="/hr/recruitment"
          className="inline-flex items-center gap-1 text-sm font-medium text-blue-600 underline"
        >
          ← Back to Recruitment Dashboard
        </Link>
      </div>

      <h1 className="text-2xl font-bold text-contrast">Candidate Profile: {applicant.name}</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-contrast">
        <p><strong>Email:</strong> {applicant.email}</p>
        <p><strong>Job Title:</strong> {applicant.jobTitle}</p>
        <p><strong>Applied Date:</strong> {applicant.appliedDate}</p>
        <p><strong>Shortlisted:</strong> {applicant.shortlisted ? 'Yes' : 'No'}</p>
        <p><strong>Screening Score:</strong> {applicant.screeningScore}</p>
        <p><strong>Status:</strong> {applicant.status}</p>
        <p><strong>Interview Scheduled:</strong> {applicant.interviewScheduled ?? '❌ Not Scheduled'}</p>
        <p><strong>Recruiter Assigned:</strong> {applicant.recruiterAssigned || '❌ Not Assigned'}</p>
        <p><strong>Source:</strong> {applicant.source}</p>
        <p><strong>Notes:</strong> {applicant.notes}</p>
        <p><strong>Portfolio:</strong> <a href={applicant.portfolioLink} className="text-blue-600 underline" target="_blank">View</a></p>
        <p><strong>Resume:</strong> <a href={applicant.resumeLink} className="text-blue-600 underline" target="_blank">Download</a></p>
        <p><strong>Location:</strong> {applicant.location}</p>
        <p><strong>Expected Salary:</strong> {applicant.expectedSalary}</p>
        <p><strong>Current Company:</strong> {applicant.currentCompany}</p>
      </div>

      {applicant.interviewScheduled === null && (
        <div className="mt-8 p-4 bg-white border rounded-lg shadow space-y-4">
          <h2 className="text-lg font-semibold text-contrast">📅 Schedule Interview</h2>
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <input
              type="datetime-local"
              value={interviewDate}
              onChange={(e) => setInterviewDate(e.target.value)}
              className="border px-3 py-2 rounded w-full md:w-1/2 text-sm"
            />
            <input
              type="text"
              placeholder="Recruiter Name"
              value={recruiter}
              onChange={(e) => setRecruiter(e.target.value)}
              className="border px-3 py-2 rounded w-full md:w-1/2 text-sm"
            />
            <button
              onClick={handleScheduleInterview}
              className="bg-primary text-white px-4 py-2 rounded text-sm hover:bg-red-700 transition"
            >
              Schedule
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
