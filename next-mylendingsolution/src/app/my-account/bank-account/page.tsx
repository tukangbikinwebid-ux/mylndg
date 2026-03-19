"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import NavigasiHeader from "@/components/cards/NavigasiHeader";
import BankAccountSection from "@/components/sections/my-account/BankAccount";
import LoadingScreen from "@/components/ui/LoadingScreen";

export default function BankAccountPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !user) router.push("/sign-in");
  }, [user, isLoading, router]);

  if (isLoading) return <LoadingScreen />;

  return (
    <div className="min-h-screen">
      <NavigasiHeader title="Akaun Bank" backUrl="/my-account" />
      <BankAccountSection user={user} />
    </div>
  );
}
