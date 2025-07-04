'use client'

import { useState, useEffect } from 'react'

interface EmployeeDoc {
  id: number
  name: string
  organization: string
  department: string
  role: string
  documents: {
    pan: string
    aadhaar: string
    photo: string
    signature: string
  }
}

interface ModalDoc {
  type: string
  url: string
  name: string
}

export default function IdentityDocuments() {
  const [employees, setEmployees] = useState<EmployeeDoc[]>([])
  const [modalDoc, setModalDoc] = useState<ModalDoc | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/employees/identity-docs')
        const data: EmployeeDoc[] = await res.json()
        setEmployees(data)
      } catch {
        const fallback: EmployeeDoc[] = [
          {
            id: 1,
            name: 'Vansh Ahuja',
            organization: 'HR',
            department: 'Compliance',
            role: 'Executive',
            documents: {
              pan: '/docs/pan-vansh.png',
              aadhaar: '/docs/aadhaar-vansh.png',
              photo: '/docs/photo-vansh.jpg',
              signature: '/docs/signature-vansh.png'
            }
          },
          {
            id: 2,
            name: 'Neha Reddy',
            organization: 'IT',
            department: 'Development',
            role: 'Engineer',
            documents: {
              pan: '/docs/pan-neha.png',
              aadhaar: '/docs/aadhaar-neha.png',
              photo: '/docs/photo-neha.jpg',
              signature: '/docs/signature-neha.png'
            }
          }
        ]
        setEmployees(fallback)
        fallback.forEach(emp => {
          Object.values(emp.documents).forEach(url => {
            const img = new Image()
            img.src = url
          })
        })
      }
    }

    fetchData()
  }, [])

  return (
    <div className="bg-white border border-red-100 shadow-sm rounded-xl p-4 sm:p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">🪪 Identity Documents</h2>

      <div className="hidden sm:block overflow-x-auto">
        <table className="min-w-full text-sm border rounded">
          <thead className="bg-red-50 text-gray-800">
            <tr>
              <th className="text-left px-4 py-2 border-b">S.no</th>
              <th className="text-left px-4 py-2 border-b">Name</th>
              <th className="text-left px-4 py-2 border-b">Organization</th>
              <th className="text-left px-4 py-2 border-b">Department</th>
              <th className="text-left px-4 py-2 border-b">Role</th>
              <th className="text-left px-4 py-2 border-b">PAN</th>
              <th className="text-left px-4 py-2 border-b">Aadhaar</th>
              <th className="text-left px-4 py-2 border-b">Photo</th>
              <th className="text-left px-4 py-2 border-b">Signature</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((emp, index) => (
              <tr key={emp.id} className="hover:bg-red-50 text-gray-700">
                <td className="px-4 py-2 border-b">{index + 1}</td>
                <td className="px-4 py-2 border-b">{emp.name}</td>
                <td className="px-4 py-2 border-b">{emp.organization}</td>
                <td className="px-4 py-2 border-b">{emp.department}</td>
                <td className="px-4 py-2 border-b">{emp.role}</td>
                {['pan', 'aadhaar', 'photo', 'signature'].map((type) => (
                  <td key={type} className="px-4 py-2 border-b">
                    <button
                      onClick={() =>
                        setModalDoc({ type, url: emp.documents[type as keyof typeof emp.documents], name: emp.name })
                      }
                      className="bg-red-500 text-white px-3 py-1 rounded text-xs hover:bg-red-600"
                    >
                      View
                    </button>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="sm:hidden space-y-4">
        {employees.map((emp, index) => (
          <div
            key={emp.id}
            className="border border-red-100 shadow-sm bg-white rounded-xl p-4 text-gray-800"
          >
            <p className="text-sm font-medium text-gray-900">
              {index + 1} — {emp.name}
            </p>
            <p className="text-sm text-gray-700">Org: {emp.organization}</p>
            <p className="text-sm text-gray-700">Dept: {emp.department}</p>
            <p className="text-sm text-gray-700">Role: {emp.role}</p>

            <div className="mt-3 grid grid-cols-2 gap-2">
              {['pan', 'aadhaar', 'photo', 'signature'].map((type) => (
                <button
                  key={type}
                  onClick={() =>
                    setModalDoc({ type, url: emp.documents[type as keyof typeof emp.documents], name: emp.name })
                  }
                  className="bg-red-500 text-white px-3 py-1 rounded text-xs hover:bg-red-600"
                >
                  View {type.charAt(0).toUpperCase() + type.slice(1)}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {modalDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-xl p-4 w-full max-w-md shadow-lg relative">
            <button
              onClick={() => setModalDoc(null)}
              className="absolute top-2 right-3 text-red-600 text-lg hover:scale-110"
            >
              ×
            </button>
            <h3 className="text-gray-900 font-semibold mb-2">
              {modalDoc.type.toUpperCase()} for {modalDoc.name}
            </h3>
            <div className="border border-red-100 rounded shadow-sm mb-3">
              <img
                src={modalDoc.url}
                alt={modalDoc.type}
                className="w-full rounded object-contain max-h-[400px]"
              />
            </div>
            <a
              href={modalDoc.url}
              download
              className="text-sm bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600 block text-center"
            >
              ⬇️ Download
            </a>
          </div>
        </div>
      )}
    </div>
  )
}
