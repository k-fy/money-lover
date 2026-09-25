'use client';

import type { FilterType } from '@/app/types/transaction';

const TABS: { value: FilterType; label: string }[] = [
  { value: 'all', label: 'Semua' },
  { value: 'income', label: 'Pemasukan' },
  { value: 'expense', label: 'Pengeluaran' },
];

interface Props {
  value: FilterType;
  onChange: (value: FilterType) => void;
}

export default function FilterTabs({ value, onChange }: Props) {
  return (
    <div className="inline-flex rounded-lg border border-gray-200 bg-gray-50 p-1">
      {TABS.map((tab) => (
        <button
          key={tab.value}
          onClick={() => onChange(tab.value)}
          className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
            value === tab.value
              ? 'bg-white text-indigo-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
