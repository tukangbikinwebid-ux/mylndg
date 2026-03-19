"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";
import { isValidPhone, formatPhoneForApi } from "@/lib/utils";
import AppLogo from "@/components/icons/AppLogo";

export default function SignIn() {
  const router = useRouter();
  const { login } = useAuth();

  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!isValidPhone(phone)) {
      setError("Format nombor telefon tidak sah");
      return;
    }

    setIsSubmitting(true);
    try {
      await login(formatPhoneForApi(phone), password);
      router.push("/");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Login gagal");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center p-6">
      {/* Background decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-gray-900 via-gray-900 to-primary/10" />
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl" />
      </div>

      {/* Logo */}
      <div className="text-center mb-8 animate-enter">
        <div className="flex justify-center mb-4">
          <AppLogo width={180} height={54} />
        </div>
        <h1 className="text-2xl font-bold text-white">Welcome Back</h1>
        <p className="text-gray-400 text-sm">Log masuk ke akaun anda</p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4 animate-enter">
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl p-3 text-sm text-center">
            {error}
          </div>
        )}

        <div>
          <label className="text-sm text-gray-400 mb-1 block">Nombor Telefon</label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="01XXXXXXXX"
            className="modern-input-dark w-full"
          />
        </div>

        <div>
          <label className="text-sm text-gray-400 mb-1 block">Kata Laluan</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Masukkan kata laluan"
            className="modern-input-dark w-full"
          />
        </div>

        <div className="text-right">
          <Link href="/forgot-password" className="text-sm text-primary hover:underline">
            Lupa kata laluan?
          </Link>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3 rounded-xl bg-primary text-white font-semibold hover:bg-primary/90 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Memuatkan..." : "Log Masuk"}
        </button>

        <p className="text-center text-sm text-gray-400">
          Belum ada akaun?{" "}
          <Link href="/sign-up" className="text-primary font-semibold hover:underline">
            Daftar
          </Link>
        </p>
      </form>
    </div>
  );
}
