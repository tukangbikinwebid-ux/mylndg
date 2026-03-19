"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import NavigasiHeader from "@/components/cards/NavigasiHeader";
import ContractSection from "@/components/sections/my-account/Contract";
import LoadingScreen from "@/components/ui/LoadingScreen";

export default function ContractPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !user) router.push("/sign-in");
  }, [user, isLoading, router]);

  if (isLoading) return <LoadingScreen />;

  return (
    <div className="min-h-screen">
      <NavigasiHeader title="Kontrak Pinjaman" backUrl="/my-account" />
      <ContractSection />
    </div>
  );
}
