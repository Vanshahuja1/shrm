'use client';

import { useEffect, useState } from 'react';

type JobPosting = {
  id: number;
  title: string;
  department: string;
  location: string;
  openings: number;
  status: 'Open' | 'Closed';
};

type JobForm = {
  title: string;
  department: string;
  location: string;
  openings: string;
  status: 'Open' | 'Closed';
};

export default function JobPostings() {
  const [postings, setPostings] = useState<JobPosting[]>([]);
  const [form, setForm] = useState<JobForm>({
    title: '',
    department: '',
    location: '',
    openings: '',
    status: 'Open',
  });

  useEffect(() => {
    const fetchPostings = async () => {
      try {
        const res = await fetch('/api/recruitment/job-postings');
        if (!res.ok) throw new Error('Failed to fetch');
        const data: JobPosting[] = await res.json();
        setPostings(data);
      } catch {
        const fallback: JobPosting[] = [
          {
            id: 1,
            title: 'Frontend Developer',
            department: 'IT',
            location: 'Remote',
            openings: 2,
            status: 'Open',
          },
          {
            id: 2,
            title: 'HR Manager',
            department: 'HR',
            location: 'Delhi',
            openings: 1,
            status: 'Closed',
          },
        ];
        setPostings(fallback);
      }
    };

    fetchPostings();
  }, []);

  const handleAdd = () => {
    const { title, department, location, openings, status } = form;
    if (!title || !department || !location || !openings) {
      alert('Fill all fields');
      return;
    }

    const newJob: JobPosting = {
      id: Date.now(),
      title,
      department,
      location,
      openings: parseInt(openings, 10),
      status,
    };

    setPostings((prev) => [...prev, newJob]);
    setForm({
      title: '',
      department: '',
      location: '',
      openings: '',
      status: 'Open',
    });
  };

  return (
    <div className="bg-white border border-red-100 rounded-xl p-4 sm:p-6 shadow-sm text-gray-900">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">📢 Job Postings</h2>

      <div className="grid sm:grid-cols-5 gap-3 mb-4">
        <input
          type="text"
          placeholder="Job Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          className="px-2 py-1 border rounded text-sm text-gray-900"
        />
        <input
          type="text"
          placeholder="Department"
          value={form.department}
          onChange={(e) => setForm({ ...form, department: e.target.value })}
          className="px-2 py-1 border rounded text-sm text-gray-900"
        />
        <input
          type="text"
          placeholder="Location"
          value={form.location}
          onChange={(e) => setForm({ ...form, location: e.target.value })}
          className="px-2 py-1 border rounded text-sm text-gray-900"
        />
        <input
          type="number"
          placeholder="Openings"
          value={form.openings}
          onChange={(e) => setForm({ ...form, openings: e.target.value })}
          className="px-2 py-1 border rounded text-sm text-gray-900"
        />
        <select
          value={form.status}
          onChange={(e) =>
            setForm({ ...form, status: e.target.value as 'Open' | 'Closed' })
          }
          className="px-2 py-1 border rounded text-sm text-gray-900"
        >
          <option value="Open">Open</option>
          <option value="Closed">Closed</option>
        </select>
      </div>

      <button
        onClick={handleAdd}
        className="mb-6 bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded text-sm"
      >
        ➕ Add Job Posting
      </button>

      <div className="block sm:hidden space-y-4">
        {postings.map((job) => (
          <div
            key={job.id}
            className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm shadow-sm"
          >
            <p>
              <span className="font-semibold">Title:</span> {job.title}
            </p>
            <p>
              <span className="font-semibold">Department:</span> {job.department}
            </p>
            <p>
              <span className="font-semibold">Location:</span> {job.location}
            </p>
            <p>
              <span className="font-semibold">Openings:</span> {job.openings}
            </p>
            <p>
              <span className="font-semibold">Status:</span>{' '}
              <span
                className={`inline-block mt-1 px-2 py-1 rounded text-xs font-medium ${
                  job.status === 'Open'
                    ? 'bg-green-100 text-green-600'
                    : 'bg-gray-200 text-gray-600'
                }`}
              >
                {job.status}
              </span>
            </p>
            <p className="mt-1">
              <a
                href={`/careers/${job.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-red-700 underline"
              >
                View Link
              </a>
            </p>
          </div>
        ))}
      </div>

      <div className="hidden sm:block overflow-x-auto">
        <table className="min-w-full text-sm border rounded">
          <thead className="bg-red-50 text-gray-800">
            <tr>
              <th className="text-left px-4 py-2 border-b">Title</th>
              <th className="text-left px-4 py-2 border-b">Department</th>
              <th className="text-left px-4 py-2 border-b">Location</th>
              <th className="text-left px-4 py-2 border-b">Openings</th>
              <th className="text-left px-4 py-2 border-b">Status</th>
              <th className="text-left px-4 py-2 border-b">Link</th>
            </tr>
          </thead>
          <tbody>
            {postings.map((job) => (
              <tr key={job.id} className="hover:bg-red-50 text-gray-700">
                <td className="px-4 py-2 border-b">{job.title}</td>
                <td className="px-4 py-2 border-b">{job.department}</td>
                <td className="px-4 py-2 border-b">{job.location}</td>
                <td className="px-4 py-2 border-b">{job.openings}</td>
                <td className="px-4 py-2 border-b">
                  <span
                    className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                      job.status === 'Open'
                        ? 'bg-green-100 text-green-600'
                        : 'bg-gray-200 text-gray-600'
                    }`}
                  >
                    {job.status}
                  </span>
                </td>
                <td className="px-4 py-2 border-b">
                  <a
                    href={`/careers/${job.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-red-700 underline"
                  >
                    View Link
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
