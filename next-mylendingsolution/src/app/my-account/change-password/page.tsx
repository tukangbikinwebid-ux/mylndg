"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import NavigasiHeader from "@/components/cards/NavigasiHeader";
import ChangePasswordSection from "@/components/sections/my-account/ChangePassword";
import LoadingScreen from "@/components/ui/LoadingScreen";

export default function ChangePasswordPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !user) router.push("/sign-in");
  }, [user, isLoading, router]);

  if (isLoading) return <LoadingScreen />;

  return (
    <div className="min-h-screen">
      <NavigasiHeader title="Ubah Kata Laluan" backUrl="/my-account" />
      <ChangePasswordSection />
    </div>
  );
}
