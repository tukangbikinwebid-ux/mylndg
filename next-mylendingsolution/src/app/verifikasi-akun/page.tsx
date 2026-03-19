"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { apiFetch } from "@/lib/api";
import { formatIC, compressImage } from "@/lib/utils";
import NavigasiHeader from "@/components/cards/NavigasiHeader";
import Notification from "@/components/ui/Notification";
import LoadingScreen from "@/components/ui/LoadingScreen";

export default function VerifikasiAkunPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  const [frontKtp, setFrontKtp] = useState("");
  const [backKtp, setBackKtp] = useState("");
  const [selfie, setSelfie] = useState("");

  const [fullName, setFullName] = useState("");
  const [ktpNumber, setKtpNumber] = useState("");
  const [gender, setGender] = useState("");
  const [birthDay, setBirthDay] = useState("");
  const [birthMonth, setBirthMonth] = useState("");
  const [birthYear, setBirthYear] = useState("");
  const [work, setWork] = useState("");
  const [monthlyIncome, setMonthlyIncome] = useState("");
  const [loanPurpose, setLoanPurpose] = useState("");
  const [address, setAddress] = useState("");
  const [emergencyName, setEmergencyName] = useState("");
  const [emergencyPhone, setEmergencyPhone] = useState("");

  const [bankName, setBankName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [accountName, setAccountName] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState<{ message: string; type: "success" | "error" } | null>(null);

  useEffect(() => {
    if (!isLoading && !user) router.push("/sign-in");
  }, [user, isLoading, router]);

  if (isLoading) return <LoadingScreen />;

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, setter: (val: string) => void) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const compressed = await compressImage(file);
      setter(compressed);
    } catch {
      setNotification({ message: "Gagal memproses gambar", type: "error" });
    }
  };

  const handleSubmit = async () => {
    if (!fullName || !ktpNumber || !gender || !bankName || !accountNumber || !accountName) {
      setNotification({ message: "Sila lengkapkan semua medan wajib", type: "error" });
      return;
    }

    setIsSubmitting(true);
    try {
      const birthDate = `${birthYear}-${birthMonth}-${birthDay}`;

      const formData = new FormData();
      formData.append("full_name", fullName);
      formData.append("ktp_number", ktpNumber.replace(/-/g, ""));
      formData.append("gender", gender);
      formData.append("birth_date", birthDate);
      formData.append("work", work);
      formData.append("monthly_income", monthlyIncome);
      formData.append("loan_purpose", loanPurpose);
      formData.append("address", address);
      formData.append("contact_1", emergencyPhone);
      formData.append("contact_1_name", emergencyName);

      if (frontKtp) formData.append("ktp_photo", frontKtp);
      if (backKtp) formData.append("ktp_photo_back", backKtp);
      if (selfie) formData.append("selfie_photo", selfie);

      await apiFetch("/profile/anggota-details", { method: "POST", body: formData, isFormData: true });
      await apiFetch("/profile/anggota-bank", { method: "POST", body: { bank_name: bankName, account_number: accountNumber, account_name: accountName } });

      setNotification({ message: "Semua maklumat berjaya dihantar!", type: "success" });
      setTimeout(() => router.push("/my-account"), 2000);
    } catch (err: unknown) {
      setNotification({ message: err instanceof Error ? err.message : "Gagal menghantar maklumat", type: "error" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const days = Array.from({ length: 31 }, (_, i) => String(i + 1).padStart(2, "0"));
  const months = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"];
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 1940 + 1 }, (_, i) => String(currentYear - i));

  return (
    <div className="min-h-screen pb-8">
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute inset-0 bg-body dark:bg-[#0A052E]" />
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl" />
      </div>

      <NavigasiHeader title="Pengesahan Identiti" backUrl="/" />

      {notification && <Notification message={notification.message} type={notification.type} onClose={() => setNotification(null)} />}

      <div className="p-4 space-y-6 animate-enter">
        {/* Photo uploads */}
        <div>
          <h3 className="text-sm font-semibold text-white mb-3">Upload Dokumen</h3>
          <div className="grid grid-cols-3 gap-3">
            {[
              { id: "front-ktp", label: "KTP Depan", value: frontKtp, setter: setFrontKtp },
              { id: "back-ktp", label: "KTP Belakang", value: backKtp, setter: setBackKtp },
              { id: "selfie", label: "Selfie", value: selfie, setter: setSelfie },
            ].map((item) => (
              <div key={item.id}>
                <div
                  className="upload-box-glossy aspect-square flex items-center justify-center cursor-pointer overflow-hidden"
                  onClick={() => document.getElementById(item.id)?.click()}
                >
                  {item.value ? (
                    <img src={item.value} className="w-full h-full object-cover rounded-xl" alt={item.label} />
                  ) : (
                    <div className="text-center text-gray-400 p-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mx-auto mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span className="text-[10px]">{item.label}</span>
                    </div>
                  )}
                </div>
                <input id={item.id} type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, item.setter)} />
              </div>
            ))}
          </div>
        </div>

        {/* Personal Information */}
        <div>
          <h3 className="text-sm font-semibold text-white mb-3">Maklumat Peribadi</h3>
          <div className="space-y-3">
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Nama Penuh</label>
              <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Masukkan nama penuh" className="modern-input-dark" />
            </div>
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Nombor IC</label>
              <input type="text" value={ktpNumber} onChange={(e) => setKtpNumber(formatIC(e.target.value))} placeholder="XXXXXX-XX-XXXX" className="modern-input-dark" />
            </div>
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Jantina</label>
              <div className="flex gap-4">
                {["Lelaki", "Perempuan"].map((g) => (
                  <label key={g} className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer">
                    <input type="radio" name="gender" value={g} checked={gender === g} onChange={(e) => setGender(e.target.value)} className="accent-primary" />
                    {g}
                  </label>
                ))}
              </div>
            </div>
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Tarikh Lahir</label>
              <div className="grid grid-cols-3 gap-2">
                <select value={birthDay} onChange={(e) => setBirthDay(e.target.value)} className="modern-select-dark">
                  <option value="">Hari</option>
                  {days.map((d) => <option key={d} value={d}>{d}</option>)}
                </select>
                <select value={birthMonth} onChange={(e) => setBirthMonth(e.target.value)} className="modern-select-dark">
                  <option value="">Bulan</option>
                  {months.map((m) => <option key={m} value={m}>{m}</option>)}
                </select>
                <select value={birthYear} onChange={(e) => setBirthYear(e.target.value)} className="modern-select-dark">
                  <option value="">Tahun</option>
                  {years.map((y) => <option key={y} value={y}>{y}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Pekerjaan</label>
              <input type="text" value={work} onChange={(e) => setWork(e.target.value)} placeholder="Masukkan pekerjaan" className="modern-input-dark" />
            </div>
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Pendapatan Bulanan</label>
              <input type="text" value={monthlyIncome} onChange={(e) => setMonthlyIncome(e.target.value)} placeholder="Masukkan pendapatan" className="modern-input-dark" />
            </div>
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Tujuan Pinjaman</label>
              <input type="text" value={loanPurpose} onChange={(e) => setLoanPurpose(e.target.value)} placeholder="Masukkan tujuan" className="modern-input-dark" />
            </div>
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Alamat</label>
              <textarea value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Masukkan alamat" className="modern-input-dark min-h-[80px] resize-none" />
            </div>
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Nama Kontak Kecemasan</label>
              <input type="text" value={emergencyName} onChange={(e) => setEmergencyName(e.target.value)} placeholder="Masukkan nama" className="modern-input-dark" />
            </div>
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Nombor Kontak Kecemasan</label>
              <input type="tel" value={emergencyPhone} onChange={(e) => setEmergencyPhone(e.target.value)} placeholder="Masukkan nombor" className="modern-input-dark" />
            </div>
          </div>
        </div>

        {/* Bank Information */}
        <div>
          <h3 className="text-sm font-semibold text-white mb-3">Maklumat Bank</h3>
          <div className="space-y-3">
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Nama Bank</label>
              <input type="text" value={bankName} onChange={(e) => setBankName(e.target.value)} placeholder="Masukkan nama bank" className="modern-input-dark" />
            </div>
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Nombor Akaun</label>
              <input type="text" value={accountNumber} onChange={(e) => setAccountNumber(e.target.value)} placeholder="Masukkan nombor akaun" className="modern-input-dark" />
            </div>
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Nama Pemegang</label>
              <input type="text" value={accountName} onChange={(e) => setAccountName(e.target.value)} placeholder="Masukkan nama pemegang" className="modern-input-dark" />
            </div>
          </div>
        </div>

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="w-full py-3 rounded-xl bg-primary text-white font-semibold hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Menghantar..." : "Hantar Semua Maklumat"}
        </button>
      </div>
    </div>
  );
}
