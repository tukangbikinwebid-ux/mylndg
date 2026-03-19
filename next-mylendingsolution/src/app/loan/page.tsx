"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useSettings } from "@/hooks/useSettings";
import NavigasiHeader from "@/components/cards/NavigasiHeader";
import NavigasiFooter from "@/components/cards/NavigasiFooter";
import LoanForm from "@/components/sections/loan/Form";
import LoadingScreen from "@/components/ui/LoadingScreen";

export default function LoanPage() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const { settings, isLoading: settingsLoading } = useSettings();

  useEffect(() => {
    if (authLoading || settingsLoading) return;
    if (!user) { router.push("/sign-in"); return; }
    if (settings?.maintenance === 1) { router.push("/maintenance"); return; }
  }, [user, settings, authLoading, settingsLoading, router]);

  if (authLoading || settingsLoading) return <LoadingScreen />;

  return (
    <div className="min-h-screen pb-20">
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute inset-0 bg-body dark:bg-[#0A052E]" />
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl" />
      </div>
      <NavigasiHeader title="Pinjaman" backUrl="/" />
      <LoanForm settings={settings} />
      <NavigasiFooter />
    </div>
  );
}
