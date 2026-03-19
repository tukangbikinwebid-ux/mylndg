"use client";
import type { User } from "@/types/user";

interface BankAccountProps { user: User | null; }

export default function BankAccountSection({ user }: BankAccountProps) {
  const bank = user?.anggota?.anggota_bank;

  const fields = [
    { label: "Nama Bank", value: bank?.bank_name },
    { label: "Nombor Akaun", value: bank?.account_number },
    { label: "Nama Pemegang", value: bank?.account_name },
  ];

  return (
    <div className="p-4 animate-enter">
      <div className="space-y-3">
        {fields.map((f) => (
          <div key={f.label} className="p-4 rounded-xl bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{f.label}</p>
            <p className="text-sm font-medium text-gray-900 dark:text-white">{f.value || "-"}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
