'use client'

import { useState } from 'react'
import CandidateManagement from './candidatemanagement/page'
import InterviewScheduling from './interviewscheduling/page'
import JobPostings from './jobpostings/page'
import OnboardingProcess from './onboardingprocess/page'

const tabs = [
  'Candidate Management',
  'Interview Scheduling',
  'Job Postings',
  'Onboarding Process'
] as const

export default function RecruitmentPage() {
  const [activeTab, setActiveTab] = useState<number>(0)

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto">
      <h1 className="text-xl sm:text-2xl font-bold mb-4 text-gray-900">
        🧾 Recruitment Dashboard
      </h1>

      <div className="flex flex-wrap gap-2 mb-6">
        {tabs.map((tab, index) => (
          <button
            key={index}
            onClick={() => setActiveTab(index)}
            className={`px-4 py-2 rounded-full font-medium text-sm ${
              activeTab === index
                ? 'bg-red-500 text-white hover:bg-red-600'
                : 'bg-red-100 text-red-700 hover:bg-red-50'
            }`}
          >
            {tab === 'Candidate Management' && '🧑‍💼 Candidate Management'}
            {tab === 'Interview Scheduling' && '📅 Interview Scheduling'}
            {tab === 'Job Postings' && '📢 Job Postings'}
            {tab === 'Onboarding Process' && '📝 Onboarding Process'}
          </button>
        ))}
      </div>

      <div className="transition-all">
        {activeTab === 0 && <CandidateManagement />}
        {activeTab === 1 && <InterviewScheduling />}
        {activeTab === 2 && <JobPostings />}
        {activeTab === 3 && <OnboardingProcess />}
      </div>
    </div>
  )
}
