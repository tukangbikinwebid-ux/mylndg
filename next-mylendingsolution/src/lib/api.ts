import { getCookie } from "cookies-next";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL!;

interface FetchOptions {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  body?: unknown;
  headers?: Record<string, string>;
  isFormData?: boolean;
}

export async function apiFetch<T = Record<string, unknown>>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<T> {
  const { method = "GET", body, headers = {}, isFormData = false } = options;

  const token = getCookie("token") as string | undefined;

  const defaultHeaders: Record<string, string> = {};

  if (token) {
    defaultHeaders["Authorization"] = `Bearer ${token}`;
  }

  if (!isFormData) {
    defaultHeaders["Content-Type"] = "application/json";
  }

  const res = await fetch(`${API_BASE}${endpoint}`, {
    method,
    headers: { ...defaultHeaders, ...headers },
    body: isFormData ? (body as FormData) : body ? JSON.stringify(body) : undefined,
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || `API Error: ${res.status}`);
  }

  return data;
}
