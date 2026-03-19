"use client";
import { useState, useEffect, useCallback } from "react";
import { apiFetch } from "@/lib/api";
import { getCookie } from "cookies-next";
import type { User } from "@/types/user";

export function useUser() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUser = useCallback(async () => {
    const token = getCookie("token");
    if (!token) {
      setIsLoading(false);
      return;
    }
    try {
      const data = await apiFetch<{ data: User }>("/me");
      setUser(data.data);
    } catch {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  return { user, isLoading, refetch: fetchUser };
}
