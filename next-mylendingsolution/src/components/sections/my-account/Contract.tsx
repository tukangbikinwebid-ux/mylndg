"use client";
import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import { formatCurrency } from "@/lib/utils";
import type { Loan } from "@/types/loan";

export default function ContractSection() {
  const [loans, setLoans] = useState<Loan[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    apiFetch<{ data: Loan[] }>("/loans")
      .then((res) => setLoans(res.data || []))
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) return <div className="p-4 text-center text-gray-400">Memuatkan...</div>;

  return (
    <div className="p-4 animate-enter">
      {loans.length === 0 ? (
        <div className="text-center py-12 text-gray-400 text-sm">Tiada kontrak pinjaman</div>
      ) : (
        <div className="space-y-3">
          {loans.map((loan) => (
            <div key={loan.id} className="p-4 rounded-xl bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-semibold text-gray-900 dark:text-white">#{loan.id}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full ${loan.status === 1 ? "bg-green-500/20 text-green-400" : loan.status === 0 ? "bg-yellow-500/20 text-yellow-400" : "bg-red-500/20 text-red-400"}`}>
                  {loan.status_label || "Pending"}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Jumlah</span>
                <span className="text-white">{formatCurrency(loan.nominal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Tenor</span>
                <span className="text-white">{loan.tenor} bulan</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
