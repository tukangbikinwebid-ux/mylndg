"use client";
import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import { formatCurrency } from "@/lib/utils";
import type { Loan } from "@/types/loan";

export default function HistoryTransactionSection() {
  const [loans, setLoans] = useState<Loan[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    apiFetch<{ data: Loan[] }>("/loans?orderBy=updated_at&order=desc")
      .then((res) => setLoans(res.data || []))
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) return <div className="p-4 text-center text-gray-400">Memuatkan...</div>;

  return (
    <div className="p-4 animate-enter">
      {loans.length === 0 ? (
        <div className="text-center py-12 text-gray-400 text-sm">Tiada sejarah transaksi</div>
      ) : (
        <div className="space-y-3">
          {loans.map((loan) => (
            <div key={loan.id} className="flex items-center justify-between p-4 rounded-xl bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10">
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">{formatCurrency(loan.nominal)}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{loan.tenor} bulan • {new Date(loan.created_at).toLocaleDateString()}</p>
              </div>
              <span className={`text-xs px-3 py-1 rounded-full ${loan.status === 1 ? "bg-green-500/20 text-green-400" : loan.status === 0 ? "bg-yellow-500/20 text-yellow-400" : "bg-red-500/20 text-red-400"}`}>
                {loan.status_label || "Pending"}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
