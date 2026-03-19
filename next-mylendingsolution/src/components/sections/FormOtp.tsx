"use client";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";
import AppLogo from "@/components/icons/AppLogo";

export default function FormOtp() {
  const router = useRouter();
  const [digits, setDigits] = useState(Array(6).fill(""));
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resending, setResending] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newDigits = [...digits];
    newDigits[index] = value.slice(-1);
    setDigits(newDigits);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    const otp = newDigits.join("");
    if (otp.length === 6 && newDigits.every((d) => d !== "")) {
      submitOtp(otp);
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const submitOtp = async (otp: string) => {
    setError("");
    setIsSubmitting(true);
    try {
      await apiFetch("/validate-register-otp", { method: "POST", body: { otp } });
      router.push("/");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "OTP tidak sah");
      setDigits(Array(6).fill(""));
      inputRefs.current[0]?.focus();
    } finally {
      setIsSubmitting(false);
    }
  };

  const resendOtp = async () => {
    setResending(true);
    try {
      await apiFetch("/resend-register-otp", { method: "POST" });
    } catch {
      // silent fail
    } finally {
      setResending(false);
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
        <h1 className="text-2xl font-bold text-white">Pengesahan OTP</h1>
        <p className="text-gray-400 text-sm">Masukkan kod 6 digit yang dihantar ke telefon anda</p>
      </div>

      <div className="space-y-6 animate-enter">
        {error && <div className="bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl p-3 text-sm text-center">{error}</div>}

        <div className="flex gap-3 justify-center">
          {digits.map((digit, i) => (
            <input
              key={i}
              ref={(el) => { inputRefs.current[i] = el; }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              className="w-12 h-14 text-center text-xl font-bold rounded-xl modern-input-dark"
            />
          ))}
        </div>

        {isSubmitting && (
          <div className="flex justify-center">
            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        <div className="text-center">
          <button onClick={resendOtp} disabled={resending} className="text-sm text-primary hover:underline disabled:opacity-50">
            {resending ? "Menghantar..." : "Hantar Semula OTP"}
          </button>
        </div>
      </div>
    </div>
  );
}
