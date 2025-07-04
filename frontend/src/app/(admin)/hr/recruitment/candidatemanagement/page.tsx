'use client';

import { JSX, useEffect, useState } from 'react';

type OnboardingDocs = {
  aadhar: boolean;
  pan: boolean;
  experience: boolean;
  certification: boolean;
  marksheet: boolean;
};

type Candidate = {
  id: number;
  name: string;
  email: string;
  docsSent: string[];
  docsReceived: string[];
  onboardingDocs: OnboardingDocs;
};

type MailLog = {
  [key: string]: string;
};

type ModalData = {
  name: string;
  docs: OnboardingDocs;
} | null;

export default function CandidateManagement(): JSX.Element {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [mailLog, setMailLog] = useState<MailLog>({});
  const [modalData, setModalData] = useState<ModalData>(null);

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        const res = await fetch('/api/recruitment/candidates');
        if (!res.ok) throw new Error('Failed to fetch');
        const data: Candidate[] = await res.json();
        setCandidates(data);
      } catch {
        const fallback: Candidate[] = [
          {
            id: 1,
            name: 'Vansh Ahuja',
            email: 'vansh@company.com',
            docsSent: ['Acknowledgement', 'LOI'],
            docsReceived: ['Signed Policy'],
            onboardingDocs: {
              aadhar: true,
              pan: true,
              experience: false,
              certification: true,
              marksheet: true,
            },
          },
          {
            id: 2,
            name: 'Neha Reddy',
            email: 'neha@company.com',
            docsSent: [],
            docsReceived: [],
            onboardingDocs: {
              aadhar: false,
              pan: false,
              experience: false,
              certification: false,
              marksheet: false,
            },
          },
        ];
        setCandidates(fallback);
      }
    };

    fetchCandidates();
  }, []);

  const handleMail = async (
    candidateId: number,
    email: string,
    label: string,
    type: 'send-mail' | 'request-doc'
  ) => {
    const key = `${candidateId}-${type}-${label}`;
    await fetch(`/api/recruitment/${type}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ to: email, type: label }),
    });
    const now = new Date().toLocaleString();
    setMailLog((prev) => ({ ...prev, [key]: now }));
    alert(`📤 ${type === 'send-mail' ? 'Mail sent' : 'Request sent'} for ${label} to ${email}`);
  };

  return (
    <div className="bg-white border border-red-100 shadow-sm rounded-xl p-4 sm:p-6 text-gray-900">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        🧑‍💼 Candidate Document Tracking
      </h2>

      {/* Mobile View */}
      <div className="block sm:hidden space-y-4">
        {candidates.map((c) => (
          <div
            key={c.id}
            className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm shadow-sm"
          >
            <p><span className="font-semibold">Name:</span> {c.name}</p>
            <p><span className="font-semibold">Email:</span> {c.email}</p>
            <div className="mt-2 space-y-1">
              {['Acknowledgement', 'LOI', 'Offer Letter'].map((label) => (
                <div key={label} className="flex justify-between items-center">
                  <span>{label}</span>
                  <button
                    disabled={!!mailLog[`${c.id}-send-mail-${label}`]}
                    className={`text-xs ml-2 px-2 py-0.5 rounded ${
                      mailLog[`${c.id}-send-mail-${label}`]
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-blue-500 text-white hover:bg-blue-600'
                    }`}
                    onClick={() => handleMail(c.id, c.email, label, 'send-mail')}
                  >
                    {mailLog[`${c.id}-send-mail-${label}`] ? 'Sent' : 'Send'}
                  </button>
                </div>
              ))}
              {['Signed Policy'].map((label) => (
                <div key={label} className="flex justify-between items-center">
                  <span>{label}</span>
                  <button
                    disabled={!!mailLog[`${c.id}-request-doc-${label}`]}
                    className={`text-xs ml-2 px-2 py-0.5 rounded ${
                      mailLog[`${c.id}-request-doc-${label}`]
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-green-500 text-white hover:bg-green-600'
                    }`}
                    onClick={() => handleMail(c.id, c.email, label, 'request-doc')}
                  >
                    {mailLog[`${c.id}-request-doc-${label}`] ? 'Requested' : 'Request'}
                  </button>
                </div>
              ))}
            </div>
            <div className="mt-3">
              <button
                onClick={() => setModalData({ name: c.name, docs: c.onboardingDocs })}
                className="bg-red-500 hover:bg-red-600 text-white text-xs px-3 py-1 rounded w-full"
              >
                View Status
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop View */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="min-w-full text-sm border rounded">
          <thead className="bg-red-50 text-gray-800">
            <tr>
              <th className="text-left px-4 py-2 border-b">Name</th>
              <th className="text-left px-4 py-2 border-b">Email</th>
              <th className="text-left px-4 py-2 border-b">Actions</th>
              <th className="text-left px-4 py-2 border-b">Onboarding</th>
            </tr>
          </thead>
          <tbody>
            {candidates.map((c) => (
              <tr key={c.id} className="hover:bg-red-50 text-gray-700">
                <td className="px-4 py-2 border-b">{c.name}</td>
                <td className="px-4 py-2 border-b">{c.email}</td>
                <td className="px-4 py-2 border-b">
                  <div className="space-y-1">
                    {['Acknowledgement', 'LOI', 'Offer Letter'].map((label) => (
                      <div key={label} className="flex justify-between items-center">
                        <span>{label}</span>
                        <button
                          disabled={!!mailLog[`${c.id}-send-mail-${label}`]}
                          className={`text-xs ml-2 px-2 py-0.5 rounded ${
                            mailLog[`${c.id}-send-mail-${label}`]
                              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                              : 'bg-blue-500 text-white hover:bg-blue-600'
                          }`}
                          onClick={() => handleMail(c.id, c.email, label, 'send-mail')}
                        >
                          {mailLog[`${c.id}-send-mail-${label}`] ? 'Sent' : 'Send'}
                        </button>
                      </div>
                    ))}
                    {['Signed Policy'].map((label) => (
                      <div key={label} className="flex justify-between items-center">
                        <span>{label}</span>
                        <button
                          disabled={!!mailLog[`${c.id}-request-doc-${label}`]}
                          className={`text-xs ml-2 px-2 py-0.5 rounded ${
                            mailLog[`${c.id}-request-doc-${label}`]
                              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                              : 'bg-green-500 text-white hover:bg-green-600'
                          }`}
                          onClick={() => handleMail(c.id, c.email, label, 'request-doc')}
                        >
                          {mailLog[`${c.id}-request-doc-${label}`] ? 'Requested' : 'Request'}
                        </button>
                      </div>
                    ))}
                  </div>
                </td>
                <td className="px-4 py-2 border-b">
                  <button
                    onClick={() => setModalData({ name: c.name, docs: c.onboardingDocs })}
                    className="bg-red-500 hover:bg-red-600 text-white text-xs px-3 py-1 rounded"
                  >
                    View Status
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {modalData && (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center">
          <div className="bg-white p-5 rounded-xl shadow-xl w-[90%] max-w-md relative">
            <button
              onClick={() => setModalData(null)}
              className="absolute top-2 right-3 text-xl text-red-600"
            >
              ×
            </button>
            <h3 className="text-lg font-semibold mb-3 text-gray-800">
              📋 Onboarding Docs for {modalData.name}
            </h3>
            <ul className="space-y-1 text-sm text-gray-700">
              {Object.entries(modalData.docs).map(([key, val]) => (
                <li key={key}>
                  <span className="font-medium capitalize">
                    {key.replace(/([A-Z])/g, ' $1')}:
                  </span>{' '}
                  {val ? (
                    <span className="text-green-600">✅ Received</span>
                  ) : (
                    <span className="text-red-600">❌ Missing</span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
