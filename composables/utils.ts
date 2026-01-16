// composables/utils.ts
export const useFetch = async (options: {
  method: "GET" | "POST" | "PUT" | "DELETE";
  url: string;
  body?: any;
  headers?: { [key: string]: string };
}) => {
  const response = await fetch(options.url, {
    method: options.method,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  return data;
};

// Ambil token dari cookie
export const getCookie = (name: string): string | null => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift() ?? null;
  return null;
};

// Ambil data user dari /me
export const getUserData = async () => {
  const token = getCookie("token");
  if (!token) {
    window.location.href = "/sign-in"; // Redirect jika gagal ambil data
  }

  const data = await useFetch({
    method: "GET",
    url: "https://cms.mysolutionlending.com/api/v1/me",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return data.data; // Sesuai struktur respon
};

export const getSetting = async () => {
  const data = await useFetch({
    method: "GET",
    url: "https://cms.mysolutionlending.com/api/v1/settings",
  });

  return data.data; // Sesuai struktur respon
};
