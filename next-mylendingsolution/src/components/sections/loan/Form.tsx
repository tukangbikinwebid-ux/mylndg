"use client";
import { useState, useRef, useEffect } from "react";
import { apiFetch } from "@/lib/api";
import { formatCurrency, getInterestRate, loanAmounts, tenorOptions } from "@/lib/utils";
import type { Settings } from "@/types/settings";
import ReactMarkdown from "react-markdown";
import dayjs from "dayjs";

interface LoanFormProps {
  settings: Settings | null;
}

export default function LoanForm({ settings }: LoanFormProps) {
  const [step, setStep] = useState(1);
  const [nominal, setNominal] = useState(loanAmounts[0]);
  const [tenor, setTenor] = useState(tenorOptions[0]);
  const [agreedTerm, setAgreedTerm] = useState(false);
  const [showContract, setShowContract] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  // Signature canvas
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  const interestRate = getInterestRate(tenor);
  const monthlyPrincipal = nominal / tenor;
  const monthlyInterest = (nominal * interestRate) / 100;
  const monthlyPayment = monthlyPrincipal + monthlyInterest;

  // Canvas drawing
  const getPos = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    if ("touches" in e) {
      return { x: e.touches[0].clientX - rect.left, y: e.touches[0].clientY - rect.top };
    }
    return { x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY };
  };

  const startDraw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    setIsDrawing(true);
    const pos = getPos(e);
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    const pos = getPos(e);
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.strokeStyle = "#00D8A5";
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
  };

  const stopDraw = () => setIsDrawing(false);

  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const handleSubmit = async () => {
    setError("");
    setIsSubmitting(true);
    try {
      const signatureData = canvasRef.current?.toDataURL("image/png");
      const formData = new FormData();
      formData.append("nominal", nominal.toString());
      formData.append("tenor", tenor.toString());
      formData.append("interest_rate", interestRate.toString());
      if (signatureData) formData.append("signature", signatureData);

      await apiFetch("/loans", { method: "POST", body: formData, isFormData: true });
      setSubmitted(true);
      setStep(3);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Gagal menghantar permohonan");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Touch events need preventing default for canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const prevent = (e: TouchEvent) => e.preventDefault();
    canvas.addEventListener("touchstart", prevent, { passive: false });
    canvas.addEventListener("touchmove", prevent, { passive: false });
    return () => {
      canvas.removeEventListener("touchstart", prevent);
      canvas.removeEventListener("touchmove", prevent);
    };
  }, [step]);

  if (submitted) {
    return (
      <div className="p-6 text-center animate-enter">
        <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-primary/20 flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-primary" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-white mb-2">Permohonan Berjaya!</h3>
        <p className="text-gray-400 text-sm mb-4">Permohonan pinjaman anda telah berjaya dihantar. Sila tunggu kelulusan.</p>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-6 animate-enter">
      {/* Step indicators */}
      <div className="flex items-center justify-center gap-2 mb-4">
        {[1, 2].map((s) => (
          <div key={s} className={`w-3 h-3 rounded-full transition-all ${step >= s ? "bg-primary" : "bg-white/10"}`} />
        ))}
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl p-3 text-sm text-center">{error}</div>
      )}

      {step === 1 && (
        <div className="space-y-6">
          {/* Loan Amount */}
          <div>
            <label className="text-sm text-gray-400 mb-2 block">Jumlah Pinjaman</label>
            <select value={nominal} onChange={(e) => setNominal(Number(e.target.value))} className="modern-select-dark w-full">
              {loanAmounts.map((a) => (
                <option key={a} value={a}>RM {a.toLocaleString()}</option>
              ))}
            </select>
          </div>

          {/* Tenor */}
          <div>
            <label className="text-sm text-gray-400 mb-2 block">Tempoh Pinjaman (bulan)</label>
            <select value={tenor} onChange={(e) => setTenor(Number(e.target.value))} className="modern-select-dark w-full">
              {tenorOptions.map((t) => (
                <option key={t} value={t}>{t} bulan</option>
              ))}
            </select>
          </div>

          {/* Summary Card */}
          <div className="rounded-xl bg-white/5 border border-white/10 p-4 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Jumlah Pinjaman</span>
              <span className="text-white font-medium">{formatCurrency(nominal)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Tempoh Pinjaman</span>
              <span className="text-white font-medium">{tenor} bulan</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Kadar faedah bulanan</span>
              <span className="text-white font-medium">{interestRate}%</span>
            </div>
            <hr className="border-white/10" />
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Prinsipal bulanan</span>
              <span className="text-white font-medium">{formatCurrency(monthlyPrincipal)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Faedah bulanan</span>
              <span className="text-white font-medium">{formatCurrency(monthlyInterest)}</span>
            </div>
            <div className="flex justify-between text-sm font-bold">
              <span className="text-primary">Amortisasi bulanan</span>
              <span className="text-primary">{formatCurrency(monthlyPayment)}</span>
            </div>
            <p className="text-xs text-gray-500">(*Anggaran, tertakluk kepada kontrak)</p>
          </div>

          {/* T&C */}
          <label className="flex items-start gap-3 text-sm text-gray-400 cursor-pointer">
            <input type="checkbox" checked={agreedTerm} onChange={(e) => setAgreedTerm(e.target.checked)} className="mt-1 accent-primary" />
            <span>
              Saya mengesahkan bahawa maklumat yang diberikan adalah benar dan saya bersetuju dengan{" "}
              <button type="button" onClick={() => setShowContract(true)} className="text-primary underline">Terma dan Syarat</button>{" "}
              yang ditetapkan.
            </span>
          </label>

          <button
            onClick={() => setStep(2)}
            disabled={!agreedTerm}
            className="w-full py-3 rounded-xl bg-primary text-white font-semibold hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Teruskan
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-6">
          <div className="rounded-xl bg-white/5 border border-white/10 p-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">Jumlah Pinjaman</span>
              <span className="text-white font-medium">{formatCurrency(nominal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Tempoh Pinjaman</span>
              <span className="text-white font-medium">{tenor} bulan</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Tarikh Permohonan</span>
              <span className="text-white font-medium">{dayjs().format("DD/MM/YYYY")}</span>
            </div>
          </div>

          {/* Signature */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm text-gray-400">Tanda Tangan</label>
              <button onClick={clearSignature} className="text-xs text-red-400 hover:text-red-300">Hapus</button>
            </div>
            <canvas
              ref={canvasRef}
              width={340}
              height={180}
              className="w-full border border-white/20 rounded-xl bg-white/5 cursor-crosshair touch-none"
              onMouseDown={startDraw}
              onMouseMove={draw}
              onMouseUp={stopDraw}
              onMouseLeave={stopDraw}
              onTouchStart={startDraw}
              onTouchMove={draw}
              onTouchEnd={stopDraw}
            />
            <p className="text-xs text-gray-500 mt-2">Tandatangan digital ini menggantikan tandatangan fizikal.</p>
          </div>

          <div className="flex gap-3">
            <button onClick={() => setStep(1)} className="flex-1 py-3 rounded-xl border border-white/10 text-white font-semibold hover:bg-white/5 transition-all">
              Kembali
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex-1 py-3 rounded-xl bg-primary text-white font-semibold hover:bg-primary/90 transition-all disabled:opacity-50"
            >
              {isSubmitting ? "Menghantar..." : "Hantar"}
            </button>
          </div>
        </div>
      )}

      {/* Contract Modal */}
      {showContract && (
        <div className="fixed inset-0 z-60 bg-black/60 flex items-end sm:items-center justify-center p-4">
          <div className="bg-gray-900 rounded-t-2xl sm:rounded-2xl w-full max-w-md max-h-[80vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-white">Terma dan Syarat</h3>
              <button onClick={() => setShowContract(false)} className="text-gray-400 hover:text-white">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="prose prose-invert prose-sm max-w-none">
              {settings?.term_of_service ? (
                <ReactMarkdown>{settings.term_of_service}</ReactMarkdown>
              ) : (
                <p className="text-gray-400">Tiada terma dan syarat tersedia.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
