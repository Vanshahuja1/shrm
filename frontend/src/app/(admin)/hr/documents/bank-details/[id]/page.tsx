'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

interface BankDetails {
  id: string;
  accountHolder: string;
  accountNumber: string;
  ifsc: string;
  branch: string;
  type: string;
}

export default function BankDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const [showFull, setShowFull] = useState(false);
  const [bank, setBank] = useState<BankDetails | null>(null);

  useEffect(() => {
    const fetchBankDetails = async () => {
      try {
        const res = await fetch(`/api/employees/bank-accounts/${id}`);
        const data: BankDetails = await res.json();
        setBank(data);
      } catch {
        setBank({
          id,
          accountHolder: 'Vansh Ahuja',
          accountNumber: '3591995352',
          ifsc: 'CBIN0284007',
          branch: 'MOOLRAJ INTER COLLEGE RAMNAGAR ROORKEE',
          type: 'Savings',
        });
      }
    };

    fetchBankDetails();
  }, [id]);

  if (!bank) return <p className="text-gray-600">Loading...</p>;

  return (
    <div className="bg-white border border-red-100 shadow-sm rounded-xl p-4 sm:p-6 max-w-xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-900">🏦 Bank Details</h2>
        <Link
          href="/documents/bank-details"
          className="text-sm bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
        >
          ← Back to List
        </Link>
      </div>

      <div className="space-y-2 text-sm text-gray-700">
        <div className="flex items-center gap-2">
          <strong>Account Number:</strong>
          <span>
            {showFull
              ? bank.accountNumber
              : '•••• ' + bank.accountNumber.slice(-4)}
          </span>
          <button
            onClick={() => setShowFull((prev) => !prev)}
            className="text-sm text-red-700 hover:bg-red-50 rounded-full px-1"
            title={showFull ? 'Hide Account Number' : 'Show Account Number'}
          >
            {showFull ? '🙈' : '👁️'}
          </button>
        </div>
        <div>
          <strong>IFSC:</strong> {bank.ifsc}
        </div>
        <div>
          <strong>Branch:</strong> {bank.branch}
        </div>
        <div>
          <strong>Account Type:</strong> {bank.type}
        </div>
      </div>
    </div>
  );
}
