"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import type { User } from "@/types/user";
import { CMS_URL } from "@/lib/constants";

interface AccountListProps {
  user: User | null;
}

const menuItems = [
  { href: "/my-account/profile", label: "Edit Profil", icon: "👤" },
  { href: "/my-account/change-password", label: "Ubah Kata Laluan", icon: "🔒" },
  { href: "/my-account/information", label: "Maklumat Peribadi", icon: "📋" },
  { href: "/my-account/bank-account", label: "Akaun Bank", icon: "🏦" },
  { href: "/my-account/contract", label: "Kontrak Pinjaman", icon: "📄" },
  { href: "/my-account/payment", label: "Bayaran Balik", icon: "💳" },
  { href: "/my-account/history-transaction", label: "Sejarah Transaksi", icon: "📊" },
  { href: "/my-account/message", label: "Pesan", icon: "✉️" },
];

export default function AccountList({ user }: AccountListProps) {
  const { logout } = useAuth();
  const router = useRouter();
  const detail = user?.anggota?.anggota_detail;
  const profileImage = user?.image ? `${CMS_URL}/${user.image}` : null;

  return (
    <div className="p-4 space-y-4 animate-enter">
      {/* Profile Card */}
      <div className="flex items-center gap-4 p-4 rounded-2xl bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10">
        <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center overflow-hidden flex-shrink-0">
          {profileImage ? (
            <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
            </svg>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-semibold text-gray-900 dark:text-white truncate">
            {detail?.full_name || user?.email || "User"}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{user?.email}</p>
          {user?.anggota && (
            <div className="flex items-center gap-2 mt-1">
              <span className={`text-xs px-2 py-0.5 rounded-full ${user.anggota.status === 1 ? "bg-green-500/20 text-green-400" : user.anggota.status === 0 ? "bg-yellow-500/20 text-yellow-400" : "bg-red-500/20 text-red-400"}`}>
                {user.anggota.status === 1 ? "Disahkan" : user.anggota.status === 0 ? "Menunggu" : "Ditolak"}
              </span>
              {user.anggota.credit_score > 0 && (
                <span className="text-xs text-gray-400">Score: {user.anggota.credit_score}</span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Menu Items */}
      <div className="space-y-2">
        {menuItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex items-center gap-3 p-4 rounded-xl bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 hover:border-primary/30 transition-all"
          >
            <span className="text-lg">{item.icon}</span>
            <span className="flex-1 text-sm font-medium text-gray-900 dark:text-white">{item.label}</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
          </Link>
        ))}
      </div>

      {/* Logout */}
      <button
        onClick={logout}
        className="w-full flex items-center justify-center gap-2 p-4 rounded-xl border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-all"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
        </svg>
        <span className="font-medium">Keluar</span>
      </button>
    </div>
  );
}
