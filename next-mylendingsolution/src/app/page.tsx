"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useSettings } from "@/hooks/useSettings";
import NavigasiFooter from "@/components/cards/NavigasiFooter";
import HomeCard from "@/components/sections/home/Card";
import HomeFeature from "@/components/sections/home/Feature";
import HomeSlide from "@/components/sections/home/Slide";
import HomeHistory from "@/components/sections/home/History";
import HomeInformation from "@/components/sections/home/Information";
import LoadingScreen from "@/components/ui/LoadingScreen";
import ThemeSwitcher from "@/components/elements/ThemeSwitcher";
import { CMS_URL } from "@/lib/constants";

export default function HomePage() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const { settings, isLoading: settingsLoading } = useSettings();

  useEffect(() => {
    if (settingsLoading || authLoading) return;

    if (settings?.maintenance === 1) {
      router.push("/maintenance");
      return;
    }
    if (!user) {
      router.push("/sign-in");
      return;
    }
    if (!user.email_verified_at) {
      router.push("/kode-otp");
      return;
    }
    if (user.anggota?.status === 0 && !user.anggota?.anggota_detail) {
      router.push("/verifikasi-akun");
    }
  }, [user, settings, authLoading, settingsLoading, router]);

  if (authLoading || settingsLoading) return <LoadingScreen />;
  if (!user) return <LoadingScreen />;

  const profileImage = user.image ? `${CMS_URL}/${user.image}` : null;

  return (
    <div className="pb-20 min-h-screen">
      {/* Background decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute inset-0 bg-body dark:bg-[#0A052E]" />
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -left-40 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center overflow-hidden flex-shrink-0">
            {profileImage ? (
              <img src={profileImage} className="w-full h-full object-cover" alt="Profile" />
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
            )}
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Welcome back,</p>
            <h2 className="text-base font-bold text-gray-900 dark:text-white">
              {user.anggota?.anggota_detail?.full_name || user.email}
            </h2>
          </div>
        </div>
        <ThemeSwitcher />
      </div>

      {/* Balance Card */}
      <HomeCard user={user} />

      {/* Feature Menu */}
      <HomeFeature />

      {/* Banner Slide */}
      <HomeSlide />

      {/* Transaction History */}
      <HomeHistory />

      {/* About */}
      <HomeInformation />

      {/* Bottom Navigation */}
      <NavigasiFooter />
    </div>
  );
}
