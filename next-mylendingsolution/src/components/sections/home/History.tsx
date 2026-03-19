"use client";
import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import { formatCurrency } from "@/lib/utils";
import type { Loan } from "@/types/loan";
import Link from "next/link";

export default function HomeHistory() {
  const [loans, setLoans] = useState<Loan[]>([]);

  useEffect(() => {
    apiFetch<{ data: Loan[] }>("/loans?orderBy=updated_at&order=desc&paginate=5")
      .then((res) => setLoans(res.data || []))
      .catch(() => {});
  }, []);

  if (loans.length === 0) {
    return (
      <div className="px-4 mb-6">
        <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-3">Riwayat Pinjaman</h3>
        <div className="text-center py-8 text-gray-400 text-sm">Tiada rekod pinjaman</div>
      </div>
    );
  }

  return (
    <div className="px-4 mb-6">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-base font-semibold text-gray-900 dark:text-white">Riwayat Pinjaman</h3>
        <Link href="/my-account/history-transaction" className="text-xs text-primary">Lihat Semua</Link>
      </div>
      <div className="space-y-3">
        {loans.map((loan) => (
          <div key={loan.id} className="flex items-center justify-between p-4 rounded-xl bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10">
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">{formatCurrency(loan.nominal)}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{loan.tenor} bulan</p>
            </div>
            <span className={`text-xs px-3 py-1 rounded-full ${loan.status === 1 ? "bg-green-500/20 text-green-400" : loan.status === 0 ? "bg-yellow-500/20 text-yellow-400" : "bg-red-500/20 text-red-400"}`}>
              {loan.status_label || (loan.status === 1 ? "Diluluskan" : loan.status === 0 ? "Dalam Proses" : "Ditolak")}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
