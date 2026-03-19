"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import NavigasiHeader from "@/components/cards/NavigasiHeader";
import NavigasiFooter from "@/components/cards/NavigasiFooter";
import AccountList from "@/components/sections/my-account/List";
import LoadingScreen from "@/components/ui/LoadingScreen";

export default function MyAccountPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !user) router.push("/sign-in");
  }, [user, isLoading, router]);

  if (isLoading) return <LoadingScreen />;

  return (
    <div className="min-h-screen pb-20">
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute inset-0 bg-body dark:bg-[#0A052E]" />
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl" />
      </div>
      <NavigasiHeader title="Akaun Saya" backUrl="/" />
      <AccountList user={user} />
      <NavigasiFooter />
    </div>
  );
}
