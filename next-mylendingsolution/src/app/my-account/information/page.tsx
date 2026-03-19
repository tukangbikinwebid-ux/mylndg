"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import NavigasiHeader from "@/components/cards/NavigasiHeader";
import InformationSection from "@/components/sections/my-account/Information";
import LoadingScreen from "@/components/ui/LoadingScreen";

export default function InformationPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !user) router.push("/sign-in");
  }, [user, isLoading, router]);

  if (isLoading) return <LoadingScreen />;

  return (
    <div className="min-h-screen">
      <NavigasiHeader title="Maklumat Peribadi" backUrl="/my-account" />
      <InformationSection user={user} />
    </div>
  );
}
