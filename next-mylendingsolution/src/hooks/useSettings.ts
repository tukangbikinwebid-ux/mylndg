"use client";
import { useState, useEffect } from "react";
import type { Settings } from "@/types/settings";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

export function useSettings() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE}/settings`)
      .then((res) => res.json())
      .then((data) => setSettings(data.data))
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, []);

  return { settings, isLoading };
}
