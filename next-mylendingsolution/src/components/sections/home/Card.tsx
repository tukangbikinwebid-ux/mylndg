"use client";
import type { User } from "@/types/user";
import { formatCurrency } from "@/lib/utils";
import Link from "next/link";

interface HomeCardProps {
  user: User | null;
}

export default function HomeCard({ user }: HomeCardProps) {
  const balance = user?.anggota?.balance || 0;

  return (
    <div className="mx-4 mb-6">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary via-primary/80 to-teal-600 p-6 text-white shadow-lg">
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
        <div className="relative z-10">
          <p className="text-sm opacity-80 mb-1">Baki Tersedia</p>
          <h3 className="text-3xl font-bold mb-4">{formatCurrency(balance)}</h3>
          <Link
            href="/loan"
            className="inline-flex items-center gap-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm px-4 py-2 rounded-xl text-sm font-medium transition-all"
          >
            Ajukan Pinjaman
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}
