"use client";
import { useState } from "react";
import { apiFetch } from "@/lib/api";
import Notification from "@/components/ui/Notification";

export default function ChangePasswordSection() {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setNotification({ message: "Kata laluan tidak sepadan", type: "error" });
      return;
    }
    setIsSubmitting(true);
    try {
      await apiFetch("/profile/change-password", {
        method: "POST",
        body: { old_password: oldPassword, password: newPassword, password_confirmation: confirmPassword },
      });
      setNotification({ message: "Kata laluan berjaya ditukar", type: "success" });
      setOldPassword(""); setNewPassword(""); setConfirmPassword("");
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
          <label className="text-sm text-gray-400 mb-1 block">Kata Laluan Lama</label>
          <input type="password" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} className="modern-input-dark w-full" placeholder="Masukkan kata laluan lama" />
        </div>
        <div>
          <label className="text-sm text-gray-400 mb-1 block">Kata Laluan Baharu</label>
          <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="modern-input-dark w-full" placeholder="Masukkan kata laluan baharu" />
        </div>
        <div>
          <label className="text-sm text-gray-400 mb-1 block">Sahkan Kata Laluan</label>
          <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="modern-input-dark w-full" placeholder="Sahkan kata laluan baharu" />
        </div>
        <button type="submit" disabled={isSubmitting} className="w-full py-3 rounded-xl bg-primary text-white font-semibold disabled:opacity-50">
          {isSubmitting ? "Menyimpan..." : "Simpan"}
        </button>
      </form>
    </div>
  );
}
