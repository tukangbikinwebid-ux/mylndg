"use client";
import { useState, useEffect, useCallback } from "react";
import { getCookie, setCookie, deleteCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import type { User } from "@/types/user";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const getToken = (): string | null => {
    return getCookie("token") as string | null;
  };

  const fetchUser = useCallback(async () => {
    const token = getToken();
    if (!token) {
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        deleteCookie("token");
        setUser(null);
        setIsLoading(false);
        return;
      }

      const data = await res.json();
      setUser(data.data);
    } catch {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    const res = await fetch(`${API_BASE}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Login failed");
    }

    setCookie("token", data.data.token, { maxAge: 60 * 60 * 24 * 30 });
    await fetchUser();
    return data;
  };

  const register = async (payload: {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
    brand_id: number;
  }) => {
    const res = await fetch(`${API_BASE}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Registration failed");
    }

    setCookie("token", data.data.token, { maxAge: 60 * 60 * 24 * 30 });
    return data;
  };

  const logout = () => {
    deleteCookie("token");
    setUser(null);
    router.push("/sign-in");
  };

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  return {
    user,
    isLoading,
    login,
    register,
    logout,
    getToken,
    fetchUser,
  };
}
