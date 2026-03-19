"use client";
import { useState } from "react";
import Link from "next/link";
import AppLogo from "@/components/icons/AppLogo";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email.trim()) { setError("Sila masukkan email atau nombor telefon"); return; }

    setIsSubmitting(true);
    try {
      const res = await fetch("https://api.ifc.web.id/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (res.ok) setSuccess(true);
      else setError("Gagal menghantar pautan reset");
    } catch {
      setError("Ralat rangkaian");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center p-6">
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-gray-900 via-gray-900 to-primary/10" />
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl" />
      </div>

      <div className="text-center mb-8 animate-enter">
        <div className="flex justify-center mb-4"><AppLogo width={180} height={54} /></div>
        <h1 className="text-2xl font-bold text-white">Lupa Kata Laluan</h1>
        <p className="text-gray-400 text-sm">Masukkan email untuk menetapkan semula kata laluan</p>
      </div>

      {success ? (
        <div className="text-center animate-enter">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/20 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
          <p className="text-white mb-4">Pautan reset telah dihantar ke email anda</p>
          <Link href="/sign-in" className="text-primary hover:underline">Kembali ke Log Masuk</Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4 animate-enter">
          {error && <div className="bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl p-3 text-sm text-center">{error}</div>}
          <div>
            <label className="text-sm text-gray-400 mb-1 block">Email / Nombor Telefon</label>
            <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="contoh@email.com" className="modern-input-dark w-full" />
          </div>
          <button type="submit" disabled={isSubmitting} className="w-full py-3 rounded-xl bg-primary text-white font-semibold hover:bg-primary/90 transition-all disabled:opacity-50">
            {isSubmitting ? "Menghantar..." : "Hantar Pautan Reset"}
          </button>
          <p className="text-center text-sm text-gray-400">
            <Link href="/sign-in" className="text-primary hover:underline">Kembali ke Log Masuk</Link>
          </p>
        </form>
      )}
    </div>
  );
}
