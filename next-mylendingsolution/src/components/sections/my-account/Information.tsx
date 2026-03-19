"use client";
import type { User } from "@/types/user";

interface InformationProps { user: User | null; }

export default function InformationSection({ user }: InformationProps) {
  const detail = user?.anggota?.anggota_detail;

  const fields = [
    { label: "Nama Sebenar", value: detail?.full_name },
    { label: "No. IC", value: detail?.ktp_number },
    { label: "Jantina", value: detail?.gender },
    { label: "Tarikh Lahir", value: detail?.birth_date },
    { label: "Pekerjaan", value: detail?.work },
    { label: "Gaji Bulanan", value: detail?.monthly_income ? `RM ${detail.monthly_income}` : undefined },
    { label: "Tujuan Pinjaman", value: detail?.loan_purpose },
    { label: "Alamat", value: detail?.address },
    { label: "Kontak Kecemasan", value: detail?.contact_1_name },
    { label: "No. Kecemasan", value: detail?.contact_1 },
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
