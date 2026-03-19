"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import NavigasiHeader from "@/components/cards/NavigasiHeader";
import PaymentSection from "@/components/sections/my-account/Payment";
import LoadingScreen from "@/components/ui/LoadingScreen";

export default function PaymentPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !user) router.push("/sign-in");
  }, [user, isLoading, router]);

  if (isLoading) return <LoadingScreen />;

  return (
    <div className="min-h-screen">
      <NavigasiHeader title="Bayaran Balik" backUrl="/my-account" />
      <PaymentSection />
    </div>
  );
}
