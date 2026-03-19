"use client";
import { useState } from "react";
import { apiFetch } from "@/lib/api";
import type { User } from "@/types/user";
import Notification from "@/components/ui/Notification";

interface ProfileProps { user: User | null; }

export default function ProfileSection({ user }: ProfileProps) {
  const [name, setName] = useState(user?.anggota?.anggota_detail?.full_name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await apiFetch("/profile", { method: "POST", body: { name, email } });
      setNotification({ message: "Profil berjaya dikemas kini", type: "success" });
    } catch (err: unknown) {
      setNotification({ message: err instanceof Error ? err.message : "Gagal", type: "error" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-4 animate-enter">
      {notification && <Notification message={notification.message} type={notification.type} onClose={() => setNotification(null)} />}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-sm text-gray-400 mb-1 block">Nama</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="modern-input-dark w-full" />
        </div>
        <div>
          <label className="text-sm text-gray-400 mb-1 block">E-mel</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="modern-input-dark w-full" />
        </div>
        <button type="submit" disabled={isSubmitting} className="w-full py-3 rounded-xl bg-primary text-white font-semibold disabled:opacity-50">
          {isSubmitting ? "Menyimpan..." : "Simpan"}
        </button>
      </form>
    </div>
  );
}
