"use client";
import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import { formatCurrency } from "@/lib/utils";
import type { Loan } from "@/types/loan";

export default function PaymentSection() {
  const [loans, setLoans] = useState<Loan[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    apiFetch<{ data: Loan[] }>("/loans?orderBy=updated_at&order=desc")
      .then((res) => setLoans((res.data || []).filter((l) => l.status === 1)))
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) return <div className="p-4 text-center text-gray-400">Memuatkan...</div>;

  return (
    <div className="p-4 animate-enter">
      {loans.length === 0 ? (
        <div className="text-center py-12 text-gray-400 text-sm">Tiada tagihan aktif</div>
      ) : (
        <div className="space-y-3">
          {loans.map((loan) => (
            <div key={loan.id} className="p-4 rounded-xl bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-400">No. Dokumen</span>
                <span className="text-sm text-white font-medium">#{loan.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-400">Jumlah</span>
                <span className="text-sm text-white font-medium">{formatCurrency(loan.nominal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-400">Tenor</span>
                <span className="text-sm text-white font-medium">{loan.tenor} bulan</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-400">Bayaran Bulanan</span>
                <span className="text-sm text-primary font-bold">{formatCurrency(loan.monthly_payment)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
