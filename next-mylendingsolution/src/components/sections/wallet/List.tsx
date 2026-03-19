"use client";
import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import { formatCurrency } from "@/lib/utils";
import type { User } from "@/types/user";
import type { Loan, WalletTransaction } from "@/types/loan";

interface WalletListProps {
  user: User | null;
}

export default function WalletList({ user }: WalletListProps) {
  const [latestLoan, setLatestLoan] = useState<Loan | null>(null);
  const [walletTx, setWalletTx] = useState<WalletTransaction | null>(null);
  const [showBalance, setShowBalance] = useState(true);
  const balance = user?.anggota?.balance || 0;

  useEffect(() => {
    apiFetch<{ data: Loan[] }>("/loans?orderBy=updated_at&order=desc&paginate=1")
      .then((res) => { if (res.data?.[0]) setLatestLoan(res.data[0]); })
      .catch(() => {});

    apiFetch<{ data: WalletTransaction[] }>("/wallet/withdraw?orderBy=updated_at")
      .then((res) => { if (res.data?.[0]) setWalletTx(res.data[0]); })
      .catch(() => {});
  }, []);

  return (
    <div className="p-4 space-y-4">
      {/* Balance Card */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary via-primary/80 to-teal-600 p-6 text-white shadow-lg">
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
        <p className="text-sm opacity-80 mb-1">Baki Tersedia</p>
        <div className="flex items-center gap-3">
          <h3 className="text-3xl font-bold">{showBalance ? formatCurrency(balance) : "RM ****"}</h3>
          <button onClick={() => setShowBalance(!showBalance)} className="opacity-70 hover:opacity-100">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              {showBalance ? (
                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
              ) : (
                <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" />
              )}
              {showBalance && (
                <>
                  <path d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10z" />
                </>
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Latest Loan */}
      {latestLoan && (
        <div className="rounded-2xl bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 p-4">
          <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Butiran Pinjaman</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500 dark:text-gray-400">No. Pinjaman</span>
              <span className="text-gray-900 dark:text-white font-medium">#{latestLoan.id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500 dark:text-gray-400">Jumlah</span>
              <span className="text-gray-900 dark:text-white font-medium">{formatCurrency(latestLoan.nominal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500 dark:text-gray-400">Tenor</span>
              <span className="text-gray-900 dark:text-white font-medium">{latestLoan.tenor} bulan</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500 dark:text-gray-400">Status</span>
              <span className={`px-2 py-0.5 rounded-full text-xs ${latestLoan.status === 1 ? "bg-green-500/20 text-green-400" : latestLoan.status === 0 ? "bg-yellow-500/20 text-yellow-400" : "bg-red-500/20 text-red-400"}`}>
                {latestLoan.status_label || "Pending"}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Wallet Transaction */}
      {walletTx && (
        <div className="rounded-2xl bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 p-4">
          <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Withdraw</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500 dark:text-gray-400">Jumlah</span>
              <span className="text-gray-900 dark:text-white font-medium">{formatCurrency(walletTx.amount)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500 dark:text-gray-400">Status</span>
              <span className="text-xs px-2 py-0.5 rounded-full" style={{ color: walletTx.status_color || '#999' }}>
                {walletTx.status_label || "Pending"}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
