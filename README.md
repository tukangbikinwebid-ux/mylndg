# My Lending Solution - Next.js Duplication Guide

Panduan lengkap untuk menduplikasi aplikasi **My Lending Solution** (Nuxt 3 / Vue 3) ke **Next.js (React)**.

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Tech Stack Mapping](#2-tech-stack-mapping)
3. [Setup Project Next.js](#3-setup-project-nextjs)
4. [Struktur Folder](#4-struktur-folder)
5. [Design System & Styling](#5-design-system--styling)
6. [Komponen (Components)](#6-komponen-components)
7. [Halaman & Routing](#7-halaman--routing)
8. [Autentikasi & Auth Flow](#8-autentikasi--auth-flow)
9. [API Integration](#9-api-integration)
10. [State Management](#10-state-management)
11. [Internationalization (i18n)](#11-internationalization-i18n)
12. [Dark Mode](#12-dark-mode)
13. [Form Handling & Validasi](#13-form-handling--validasi)
14. [Fitur Khusus](#14-fitur-khusus)
15. [Assets & Media](#15-assets--media)
16. [Build & Deployment](#16-build--deployment)
17. [API Reference](#17-api-reference)
18. [Data Models](#18-data-models)

---

## 1. Project Overview

**My Lending Solution** adalah platform pinjaman digital (lending) dengan fitur:

- Login, Register, OTP verification
- Verifikasi akun (upload KTP + selfie + data pribadi + data bank)
- Dashboard utama dengan informasi pinjaman
- Pengajuan pinjaman multi-step (detail, tanda tangan digital, konfirmasi)
- Wallet / saldo & riwayat transaksi
- Manajemen akun (profil, bank, password, kontrak, riwayat, pesan)
- Multi-bahasa (Melayu, English, Chinese)
- Dark/Light mode
- Responsive mobile-first design

**Target:** Malaysia (format telefon MY, mata uang RM, IC number format)

---

## 2. Tech Stack Mapping

| Fitur | Nuxt 3 (Existing) | Next.js (Target) |
|-------|-------------------|-------------------|
| Framework | Nuxt 3 + Vue 3 | Next.js 14+ (App Router) |
| Bahasa | TypeScript | TypeScript |
| Styling | Tailwind CSS 3 | Tailwind CSS 4 |
| Routing | File-based (`pages/`) | File-based (`app/`) |
| State | Vue `ref()` / `computed()` | React `useState` / `useMemo` |
| API Calls | Custom `useFetch` composable | Custom hook / fetch API |
| i18n | `@nuxtjs/i18n` | `next-intl` |
| Dark Mode | `@nuxtjs/color-mode` | `next-themes` |
| Icons | FontAwesome | FontAwesome / `react-icons` |
| Carousel | Swiper | Swiper React |
| Markdown | `vue3-markdown-it` | `react-markdown` |
| Images | `@nuxt/image` | Next.js `<Image />` (built-in) |
| Date | `moment` + `moment-hijri` | `dayjs` + plugin hijri (lebih ringan) |
| SSR Mode | `ssr: false` (static) | Static Export / Client Components |

---

## 3. Setup Project Next.js

### 3.1 Inisialisasi Project

```bash
npx create-next-app@latest mylendingsolution-nextjs \
  --typescript \
  --tailwind \
  --eslint \
  --app \
  --src-dir \
  --import-alias "@/*"

cd mylendingsolution-nextjs
```

### 3.2 Install Dependencies

```bash
# Core
npm install next-intl next-themes cookies-next

# UI & Icons
npm install @fortawesome/fontawesome-svg-core @fortawesome/free-solid-svg-icons @fortawesome/react-fontawesome
# atau alternatif yang lebih ringan:
npm install react-icons

# Carousel
npm install swiper

# Markdown
npm install react-markdown

# Date
npm install dayjs

# Form (opsional, direkomendasikan)
npm install react-hook-form zod @hookform/resolvers
```

### 3.3 Environment Variables

Buat file `.env.local`:

```env
NEXT_PUBLIC_API_BASE_URL=https://cms.berkahcapitalcredit.com/api/v1
NEXT_PUBLIC_CMS_URL=https://cms.berkahcapitalcredit.com
```

---

## 4. Struktur Folder

```
src/
├── app/                              # App Router (halaman)
│   ├── layout.tsx                    # Root layout (html, body, providers)
│   ├── page.tsx                      # Home / Dashboard
│   ├── sign-in/
│   │   └── page.tsx
│   ├── sign-up/
│   │   └── page.tsx
│   ├── forgot-password/
│   │   └── page.tsx
│   ├── kode-otp/
│   │   └── page.tsx
│   ├── verifikasi-akun/
│   │   └── page.tsx
│   ├── loan/
│   │   └── page.tsx
│   ├── maintenance/
│   │   └── page.tsx
│   ├── my-account/
│   │   ├── page.tsx                  # Account menu
│   │   ├── information/page.tsx
│   │   ├── bank-account/page.tsx
│   │   ├── change-password/page.tsx
│   │   ├── contract/page.tsx
│   │   ├── history-transaction/page.tsx
│   │   ├── payment/page.tsx
│   │   ├── message/page.tsx
│   │   └── profile/page.tsx
│   ├── wallet/
│   │   └── page.tsx
│   └── [locale]/                     # i18n routes (opsional)
│       └── ...mirror semua route
│
├── components/
│   ├── atoms/                        # Komponen dasar
│   │   ├── Container.tsx
│   │   ├── LinkBtn.tsx
│   │   ├── NavLink.tsx
│   │   ├── SwiperNavButton.tsx
│   │   └── Title.tsx
│   ├── cards/
│   │   ├── NavigasiHeader.tsx        # Header navigation
│   │   ├── NavigasiFooter.tsx        # Bottom tab bar
│   │   └── KeyBenefit.tsx
│   ├── elements/
│   │   ├── ThemeSwitcher.tsx
│   │   └── DropDown.tsx
│   ├── icons/
│   │   ├── AppLogo.tsx
│   │   ├── NextIco.tsx
│   │   └── PrevIco.tsx
│   ├── sections/
│   │   ├── SignIn.tsx
│   │   ├── SignUp.tsx
│   │   ├── ForgotPassword.tsx
│   │   ├── FormOtp.tsx
│   │   ├── Maintenance.tsx
│   │   ├── home/
│   │   │   ├── Card.tsx
│   │   │   ├── Feature.tsx
│   │   │   ├── History.tsx
│   │   │   └── Slide.tsx
│   │   ├── loan/
│   │   │   └── Form.tsx              # Multi-step loan form
│   │   ├── my-account/
│   │   │   ├── List.tsx
│   │   │   ├── BankAccount.tsx
│   │   │   ├── ChangePassword.tsx
│   │   │   ├── Contract.tsx
│   │   │   ├── HistoryTransaction.tsx
│   │   │   ├── Information.tsx
│   │   │   ├── Message.tsx
│   │   │   ├── Payment.tsx
│   │   │   └── Profile.tsx
│   │   └── wallet/
│   │       └── List.tsx
│   └── ui/                           # Shared UI (opsional)
│       ├── LoadingSpinner.tsx
│       ├── Notification.tsx
│       └── Modal.tsx
│
├── hooks/                            # Custom React hooks
│   ├── useAuth.ts                    # Authentication hook
│   ├── useFetch.ts                   # API fetch hook
│   ├── useSettings.ts               # App settings hook
│   └── useUser.ts                    # User data hook
│
├── lib/                              # Utility functions
│   ├── api.ts                        # API client
│   ├── auth.ts                       # Cookie & token helpers
│   ├── constants.ts                  # App constants
│   └── utils.ts                      # General utilities
│
├── types/                            # TypeScript types
│   ├── user.ts
│   ├── loan.ts
│   ├── settings.ts
│   └── api.ts
│
├── i18n/
│   ├── locales/
│   │   ├── en.json
│   │   ├── my.json
│   │   └── cn.json
│   └── config.ts
│
├── styles/
│   └── globals.css                   # Global styles + CSS variables
│
└── public/
    ├── images/                       # Semua asset gambar
    │   ├── logo-flexyduit.png
    │   ├── background.webp
    │   ├── bank icons (SVG)
    │   ├── country flags (AVIF)
    │   └── ...
    └── favicon.ico
```

---

## 5. Design System & Styling

### 5.1 CSS Variables (`globals.css`)

```css
@import "tailwindcss";

:root {
  --color-primary: 23 185 120;
  --color-secondary: 248 143 194;
  --color-green: 140 214 106;
  --color-bg: 255 255 255;
  --color-border: 255 255 255;
  --color-box: 255 255 255;
  --box-border: 229 231 235;
  --box-sd: 226 232 240 / 0.5;
}

.dark {
  --color-bg: 17 24 39;
  --color-box: 17 26 62;
  --color-border: 243 244 246 / 0.1;
  --box-border: 243 244 246 / 0.1;
  --box-sd: transparent;
}

/* Background utama */
body {
  background-color: rgb(var(--color-bg));
  min-height: 100vh;
}

/* Dark mode background gradient */
.dark body {
  background: #0A052E;
}
```

### 5.2 Tailwind Config (`tailwind.config.ts`)

```typescript
import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        body: "rgb(var(--color-bg) / <alpha-value>)",
        "box-bg": "rgb(var(--color-box) / <alpha-value>)",
        primary: "#00D8A5",
        secondary: "#7E43AD",
        "primary-alt": "#184CFA",
        accent: "#00BDFE",
      },
      zIndex: {
        "60": "60",
        "70": "70",
      },
      screens: {
        xs: "400px",
      },
    },
  },
  plugins: [],
};

export default config;
```

### 5.3 Color Palette

| Nama | Hex | Penggunaan |
|------|-----|------------|
| Primary | `#00D8A5` | Tombol utama, aksen, highlight |
| Secondary | `#7E43AD` | Elemen sekunder |
| Primary Alt | `#184CFA` | Link, badge aktif |
| Accent | `#00BDFE` | Dark mode accent |
| Dark BG | `#0A052E` | Background gelap utama |
| Dark Box | `rgb(17 26 62)` | Card/box di dark mode |
| Light BG | `#F9F9F9` | Background terang |
| Success | `#22C55E` | Status berhasil |
| Error | `#EF4444` | Status error |
| Warning | `#F59E0B` | Status peringatan |

### 5.4 Custom Animations & Styles

```css
/* Fade-in slide-up animation */
@keyframes enter {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.animate-enter {
  animation: enter 0.5s ease-out;
}

/* Glassmorphism card */
.glass-card {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
}

/* Hidden scrollbar */
.invisible-scroll {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.invisible-scroll::-webkit-scrollbar {
  display: none;
}

/* Glossy upload box */
.upload-box-glossy {
  background: linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05));
  backdrop-filter: blur(10px);
  border: 2px dashed rgba(255,255,255,0.2);
  border-radius: 12px;
  transition: all 0.3s ease;
}
.upload-box-glossy:hover {
  border-color: #00D8A5;
}

/* Modern dark input */
.modern-input-dark {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  color: #E2E8F0;
  padding: 12px 16px;
  transition: border-color 0.3s;
}
.modern-input-dark:focus {
  border-color: #00D8A5;
  outline: none;
}

/* Modern dark select */
.modern-select-dark {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  color: #E2E8F0;
  padding: 12px 16px;
}
```

### 5.5 Background Decorative Elements (Dark Mode)

Halaman menggunakan blur gradient circles sebagai dekorasi:

```tsx
{/* Background gradient decoration */}
<div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
  <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl" />
  <div className="absolute top-1/3 -left-40 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl" />
  <div className="absolute -bottom-40 right-1/3 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl" />
</div>
```

---

## 6. Komponen (Components)

### 6.1 Container (`atoms/Container.tsx`)

Wrapper responsif dengan max-width.

```tsx
interface ContainerProps {
  children: React.ReactNode;
  className?: string;
}

export default function Container({ children, className = "" }: ContainerProps) {
  return (
    <div className={`mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 ${className}`}>
      {children}
    </div>
  );
}
```

### 6.2 NavigasiHeader (`cards/NavigasiHeader.tsx`)

Top bar dengan tombol back dan judul halaman.

```tsx
"use client";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

interface NavigasiHeaderProps {
  title: string;
  backUrl?: string;
}

export default function NavigasiHeader({ title, backUrl }: NavigasiHeaderProps) {
  const router = useRouter();

  return (
    <div className="sticky top-0 z-50 flex items-center gap-3 p-4
                    bg-white/80 dark:bg-gray-900/80 backdrop-blur-md
                    border-b border-gray-200 dark:border-white/10">
      <button
        onClick={() => backUrl ? router.push(backUrl) : router.back()}
        className="w-10 h-10 flex items-center justify-center rounded-full
                   bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-white"
      >
        <FontAwesomeIcon icon={faArrowLeft} />
      </button>
      <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
        {title}
      </h1>
    </div>
  );
}
```

### 6.3 NavigasiFooter (`cards/NavigasiFooter.tsx`)

Bottom tab navigation (Home, Wallet, My Account).

```tsx
"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome, faWallet, faUser } from "@fortawesome/free-solid-svg-icons";

const menuItems = [
  { href: "/", icon: faHome, label: "Home" },
  { href: "/wallet", icon: faWallet, label: "Wallet" },
  { href: "/my-account", icon: faUser, label: "My Account" },
];

export default function NavigasiFooter() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50
                    bg-white/90 dark:bg-gray-900/90 backdrop-blur-md
                    border-t border-gray-200 dark:border-white/10
                    flex justify-around items-center h-16 max-w-md mx-auto">
      {menuItems.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center gap-1 text-xs
              ${isActive
                ? "text-primary font-semibold"
                : "text-gray-500 dark:text-gray-400"
              }`}
          >
            <FontAwesomeIcon icon={item.icon} className="text-lg" />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
```

### 6.4 LinkBtn (`atoms/LinkBtn.tsx`)

Tombol dengan beberapa varian.

```tsx
import Link from "next/link";

interface LinkBtnProps {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "outline" | "ghost";
  className?: string;
  onClick?: () => void;
}

const variants = {
  primary: "bg-primary text-white hover:bg-primary/90",
  secondary: "bg-secondary text-white hover:bg-secondary/90",
  outline: "border border-primary text-primary hover:bg-primary/10",
  ghost: "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5",
};

export default function LinkBtn({
  href, children, variant = "primary", className = "", onClick
}: LinkBtnProps) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`inline-flex items-center justify-center px-6 py-3
                  rounded-xl font-semibold text-sm transition-all duration-300
                  ${variants[variant]} ${className}`}
    >
      {children}
    </Link>
  );
}
```

### 6.5 ThemeSwitcher (`elements/ThemeSwitcher.tsx`)

Toggle dark/light mode.

```tsx
"use client";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSun, faMoon } from "@fortawesome/free-solid-svg-icons";

export default function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="w-10 h-10 rounded-full flex items-center justify-center
                 bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-yellow-400
                 transition-colors duration-300"
    >
      <FontAwesomeIcon icon={theme === "dark" ? faSun : faMoon} />
    </button>
  );
}
```

---

## 7. Halaman & Routing

### 7.1 Route Map

| Route | Page File | Deskripsi | Auth |
|-------|-----------|-----------|------|
| `/` | `app/page.tsx` | Dashboard / Home | Ya |
| `/sign-in` | `app/sign-in/page.tsx` | Login | Tidak |
| `/sign-up` | `app/sign-up/page.tsx` | Register | Tidak |
| `/forgot-password` | `app/forgot-password/page.tsx` | Reset password | Tidak |
| `/kode-otp` | `app/kode-otp/page.tsx` | Verifikasi OTP | Partial |
| `/verifikasi-akun` | `app/verifikasi-akun/page.tsx` | Verifikasi identitas | Ya |
| `/loan` | `app/loan/page.tsx` | Pengajuan pinjaman | Ya |
| `/wallet` | `app/wallet/page.tsx` | Saldo & dompet | Ya |
| `/my-account` | `app/my-account/page.tsx` | Menu akun | Ya |
| `/my-account/information` | `app/my-account/information/page.tsx` | Info pribadi | Ya |
| `/my-account/bank-account` | `app/my-account/bank-account/page.tsx` | Info bank | Ya |
| `/my-account/change-password` | `app/my-account/change-password/page.tsx` | Ganti password | Ya |
| `/my-account/contract` | `app/my-account/contract/page.tsx` | Kontrak pinjaman | Ya |
| `/my-account/history-transaction` | `app/my-account/history-transaction/page.tsx` | Riwayat transaksi | Ya |
| `/my-account/payment` | `app/my-account/payment/page.tsx` | Pembayaran | Ya |
| `/my-account/message` | `app/my-account/message/page.tsx` | Pesan | Ya |
| `/my-account/profile` | `app/my-account/profile/page.tsx` | Profil user | Ya |
| `/maintenance` | `app/maintenance/page.tsx` | Mode maintenance | Tidak |

### 7.2 Root Layout (`app/layout.tsx`)

```tsx
import "./globals.css";
import { ThemeProvider } from "next-themes";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "My Lending Solution",
  description: "Digital Lending Platform",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ms" suppressHydrationWarning>
      <body className={`${inter.className} bg-body min-h-screen`}>
        <ThemeProvider attribute="class" defaultTheme="dark">
          <main className="max-w-md mx-auto min-h-screen relative">
            {children}
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
```

> **Catatan:** Semua halaman dibatasi `max-w-md mx-auto` karena ini aplikasi mobile-first.

### 7.3 Contoh Page - Home Dashboard (`app/page.tsx`)

```tsx
"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useSettings } from "@/hooks/useSettings";
import NavigasiFooter from "@/components/cards/NavigasiFooter";
import HomeCard from "@/components/sections/home/Card";
import HomeFeature from "@/components/sections/home/Feature";
import HomeSlide from "@/components/sections/home/Slide";
import HomeHistory from "@/components/sections/home/History";

export default function HomePage() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const { settings, isLoading: settingsLoading } = useSettings();

  useEffect(() => {
    if (settings?.maintenance === 1) {
      router.push("/maintenance");
      return;
    }
    if (!authLoading && !user) {
      router.push("/sign-in");
      return;
    }
    if (user && !user.email_verified_at) {
      router.push("/kode-otp");
      return;
    }
    if (user?.anggota?.status === 0 && !user.anggota?.anggota_detail) {
      router.push("/verifikasi-akun");
    }
  }, [user, settings, authLoading, settingsLoading, router]);

  if (authLoading || settingsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="pb-20">
      {/* Header dengan info user */}
      <div className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Welcome back,</p>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              {user?.anggota?.anggota_detail?.full_name || user?.email}
            </h2>
          </div>
          <img
            src={user?.image ? `${process.env.NEXT_PUBLIC_CMS_URL}/${user.image}` : "/images/default-avatar.png"}
            className="w-12 h-12 rounded-full object-cover"
            alt="Profile"
          />
        </div>
      </div>

      {/* Balance Card */}
      <HomeCard user={user} />

      {/* Feature Menu */}
      <HomeFeature />

      {/* Banner Slide */}
      <HomeSlide />

      {/* Transaction History */}
      <HomeHistory />

      {/* Bottom Navigation */}
      <NavigasiFooter />
    </div>
  );
}
```

---

## 8. Autentikasi & Auth Flow

### 8.1 Flow Diagram

```
User membuka app
    │
    ├── Cek maintenance mode → /maintenance
    │
    ├── Cek token di cookie
    │   ├── Tidak ada token → /sign-in
    │   └── Ada token → Fetch /api/v1/me
    │       ├── Token expired/invalid → /sign-in
    │       ├── Email belum verified → /kode-otp
    │       ├── Akun belum diverifikasi → /verifikasi-akun
    │       └── Semua OK → Dashboard /
    │
    ├── Login → POST /api/v1/login
    │   ├── Berhasil → Set cookie "token" → Redirect /
    │   └── Gagal → Tampilkan error
    │
    ├── Register → POST /api/v1/register
    │   ├── Berhasil → Set cookie "token" → Redirect /kode-otp
    │   └── Gagal → Tampilkan error
    │
    └── OTP Verification → POST /api/v1/validate-register-otp
        ├── Berhasil → Redirect /
        └── Gagal → Tampilkan error
```

### 8.2 Auth Hook (`hooks/useAuth.ts`)

```typescript
"use client";
import { useState, useEffect } from "react";
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

  const fetchUser = async () => {
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
  };

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

    setCookie("token", data.data.token, { maxAge: 60 * 60 * 24 * 30 }); // 30 hari
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
  }, []);

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
```

### 8.3 Contoh Sign In Page (`sections/SignIn.tsx`)

```tsx
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";

export default function SignIn() {
  const router = useRouter();
  const { login } = useAuth();

  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Validasi format telefon Malaysia
  const validatePhone = (value: string) => /^01[0-46-9][0-9]{7,8}$/.test(value);

  // Konversi 0XX ke 60XX untuk API
  const formatPhoneForApi = (value: string) => {
    if (value.startsWith("0")) return "60" + value.slice(1);
    return value;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!validatePhone(phone)) {
      setError("Format nombor telefon tidak sah");
      return;
    }

    setIsSubmitting(true);
    try {
      await login(formatPhoneForApi(phone), password);
      router.push("/");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center p-6
                    bg-gradient-to-b from-gray-900 via-gray-900 to-primary/10">

      {/* Background decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute -top-40 -right-40 w-96 h-96
                        bg-blue-600/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96
                        bg-purple-600/20 rounded-full blur-3xl" />
      </div>

      {/* Logo */}
      <div className="text-center mb-8">
        <img src="/images/logo-flexyduit.png" alt="Logo" className="h-16 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-white">Welcome Back</h1>
        <p className="text-gray-400 text-sm">Log masuk ke akaun anda</p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400
                          rounded-xl p-3 text-sm text-center">
            {error}
          </div>
        )}

        <div>
          <label className="text-sm text-gray-400 mb-1 block">Nombor Telefon</label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="01XXXXXXXX"
            className="modern-input-dark w-full"
          />
        </div>

        <div>
          <label className="text-sm text-gray-400 mb-1 block">Kata Laluan</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Masukkan kata laluan"
            className="modern-input-dark w-full"
          />
        </div>

        <div className="text-right">
          <Link href="/forgot-password" className="text-sm text-primary hover:underline">
            Lupa kata laluan?
          </Link>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3 rounded-xl bg-primary text-white font-semibold
                     hover:bg-primary/90 transition-all duration-300
                     disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Memuatkan..." : "Log Masuk"}
        </button>

        <p className="text-center text-sm text-gray-400">
          Belum ada akaun?{" "}
          <Link href="/sign-up" className="text-primary font-semibold hover:underline">
            Daftar
          </Link>
        </p>
      </form>
    </div>
  );
}
```

---

## 9. API Integration

### 9.1 API Client (`lib/api.ts`)

```typescript
import { getCookie } from "cookies-next";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL!;

interface FetchOptions {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  body?: any;
  headers?: Record<string, string>;
  isFormData?: boolean;
}

export async function apiFetch<T = any>(
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
    body: isFormData ? body : body ? JSON.stringify(body) : undefined,
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || `API Error: ${res.status}`);
  }

  return data;
}
```

### 9.2 API Endpoints Reference

```typescript
// Authentication
apiFetch("/login", { method: "POST", body: { email, password } });
apiFetch("/register", { method: "POST", body: { name, email, password, password_confirmation, brand_id: 2 } });
apiFetch("/resend-register-otp", { method: "POST" });
apiFetch("/validate-register-otp", { method: "POST", body: { otp } });

// User
apiFetch("/me");                    // GET - Current user data
apiFetch("/settings");              // GET - App settings (no auth)

// Profile / Verification
apiFetch("/profile/anggota-details", {
  method: "POST",
  body: formData,     // FormData dengan foto KTP, selfie, dan data pribadi
  isFormData: true,
});
apiFetch("/profile/anggota-bank", {
  method: "POST",
  body: { bank_name, account_number, account_name },
});

// Loans
apiFetch("/loans");                                                       // GET - List loans
apiFetch("/loans?orderBy=updated_at&order=desc&paginate=1");             // GET - Latest loan
apiFetch("/loans", { method: "POST", body: formData, isFormData: true }); // POST - Submit loan

// Wallet
apiFetch("/wallet/withdraw?orderBy=updated_at");  // GET - Wallet transactions
```

---

## 10. State Management

Aplikasi ini **TIDAK** menggunakan Redux/Zustand. Semua state dikelola dengan React hooks.

### 10.1 Pattern: Custom Hooks

```typescript
// hooks/useSettings.ts
"use client";
import { useState, useEffect } from "react";
import { apiFetch } from "@/lib/api";
import type { Settings } from "@/types/settings";

export function useSettings() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    apiFetch("/settings")
      .then((data) => setSettings(data.data))
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, []);

  return { settings, isLoading };
}
```

```typescript
// hooks/useUser.ts
"use client";
import { useState, useEffect } from "react";
import { apiFetch } from "@/lib/api";
import { getCookie } from "cookies-next";
import type { User } from "@/types/user";

export function useUser() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUser = async () => {
    const token = getCookie("token");
    if (!token) {
      setIsLoading(false);
      return;
    }
    try {
      const data = await apiFetch("/me");
      setUser(data.data);
    } catch {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return { user, isLoading, refetch: fetchUser };
}
```

### 10.2 Pattern: Form State

```typescript
// Contoh di komponen form
const [formData, setFormData] = useState({
  full_name: "",
  ktp_number: "",
  gender: "",
  birth_date: "",
  work: "",
  monthly_income: "",
  loan_purpose: "",
  address: "",
  contact_1: "",
  contact_1_name: "",
});

// Update handler
const handleChange = (field: string, value: string) => {
  setFormData((prev) => ({ ...prev, [field]: value }));
};
```

---

## 11. Internationalization (i18n)

### 11.1 Setup `next-intl`

```bash
npm install next-intl
```

### 11.2 Config (`i18n/config.ts`)

```typescript
export const locales = ["my", "en", "cn"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "my";

export const localeNames: Record<Locale, string> = {
  my: "Bahasa Melayu",
  en: "English",
  cn: "中文",
};

export const localeFlags: Record<Locale, string> = {
  my: "/images/flag-my.avif",
  en: "/images/flag-en.avif",
  cn: "/images/flag-cn.avif",
};
```

### 11.3 Lokalisasi Files

Salin file-file berikut dari project asli dan simpan di `src/i18n/locales/`:
- `my.json` (Bahasa Melayu - default)
- `en.json` (English)
- `cn.json` (Chinese)

**Struktur Key:**
```json
{
  "nav-home": "/",
  "nav-wallet": "/wallet",
  "nav-my-account": "/my-account",
  "home": {
    "title": "...",
    "welcome": "..."
  },
  "sign-in": {
    "title": "Log Masuk",
    "phone": "Nombor Telefon",
    "password": "Kata Laluan"
  },
  "loan": { "..." : "..." },
  "wallet": { "..." : "..." },
  "my-account": { "..." : "..." },
  "verification-account": { "..." : "..." }
}
```

### 11.4 Penggunaan di Komponen

```tsx
"use client";
import { useTranslations } from "next-intl";

export default function SignInPage() {
  const t = useTranslations("sign-in");

  return (
    <div>
      <h1>{t("title")}</h1>
      <label>{t("phone")}</label>
      {/* ... */}
    </div>
  );
}
```

### 11.5 Language Switcher

```tsx
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { locales, localeNames, localeFlags } from "@/i18n/config";

export default function LanguageSwitcher() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const changeLocale = (locale: string) => {
    document.cookie = `i18n_locale=${locale};path=/;max-age=31536000`;
    router.refresh();
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button onClick={() => setIsOpen(!isOpen)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg
                         bg-white/10 text-white text-sm">
        <span>Language</span>
      </button>
      {isOpen && (
        <div className="absolute top-full mt-2 right-0 bg-gray-800
                        rounded-xl shadow-lg overflow-hidden z-50">
          {locales.map((locale) => (
            <button
              key={locale}
              onClick={() => changeLocale(locale)}
              className="flex items-center gap-3 px-4 py-3 w-full
                         hover:bg-white/10 text-white text-sm"
            >
              <img src={localeFlags[locale]} className="w-6 h-4 rounded" alt="" />
              <span>{localeNames[locale]}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
```

---

## 12. Dark Mode

### 12.1 Setup

```bash
npm install next-themes
```

### 12.2 Provider di Layout

```tsx
// app/layout.tsx
import { ThemeProvider } from "next-themes";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ms" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="dark">
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
```

### 12.3 Penggunaan di CSS

```
Tailwind utility classes pattern:
- Light: bg-white        → Dark: dark:bg-gray-900
- Light: text-gray-900   → Dark: dark:text-white
- Light: border-gray-200 → Dark: dark:border-white/10
- Light: bg-gray-100     → Dark: dark:bg-white/10
- Light: text-gray-500   → Dark: dark:text-gray-400
```

> **Default mode adalah DARK**. Mayoritas user menggunakan dark mode.

---

## 13. Form Handling & Validasi

### 13.1 Validasi Pattern

```typescript
// Validasi nomor telefon Malaysia
const isValidPhone = (phone: string) => /^01[0-46-9][0-9]{7,8}$/.test(phone);

// Format IC number: XXXXXX-XX-XXXX
const formatIC = (value: string) => {
  const digits = value.replace(/\D/g, "").slice(0, 12);
  if (digits.length <= 6) return digits;
  if (digits.length <= 8) return `${digits.slice(0, 6)}-${digits.slice(6)}`;
  return `${digits.slice(0, 6)}-${digits.slice(6, 8)}-${digits.slice(8)}`;
};

// Format mata uang RM
const formatCurrency = (amount: number) => {
  return `RM ${amount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
};
```

### 13.2 Image Upload dengan Kompresi

```typescript
// Kompresi gambar sebelum upload (max 10MB, iterative quality reduction)
const compressImage = (file: File, maxSizeMB = 10): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const maxDim = 2048;

        let { width, height } = img;
        if (width > maxDim || height > maxDim) {
          const ratio = Math.min(maxDim / width, maxDim / height);
          width *= ratio;
          height *= ratio;
        }

        canvas.width = width;
        canvas.height = height;
        canvas.getContext("2d")!.drawImage(img, 0, 0, width, height);

        let quality = 0.8;
        let result = canvas.toDataURL("image/jpeg", quality);

        // Iterative compression
        while (result.length > maxSizeMB * 1024 * 1024 * 1.37 && quality > 0.1) {
          quality -= 0.1;
          result = canvas.toDataURL("image/jpeg", quality);
        }

        resolve(result);
      };
      img.src = e.target!.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};
```

### 13.3 Contoh Form Upload Verifikasi

```tsx
const [frontKtp, setFrontKtp] = useState<string>("");
const [backKtp, setBackKtp] = useState<string>("");
const [selfie, setSelfie] = useState<string>("");

const handleImageUpload = async (
  e: React.ChangeEvent<HTMLInputElement>,
  setter: (val: string) => void
) => {
  const file = e.target.files?.[0];
  if (!file) return;

  try {
    const compressed = await compressImage(file);
    setter(compressed);
  } catch {
    alert("Gagal memproses gambar");
  }
};

// Di JSX:
<div className="upload-box-glossy p-6 text-center cursor-pointer"
     onClick={() => document.getElementById("front-ktp")?.click()}>
  {frontKtp ? (
    <img src={frontKtp} className="w-full rounded-lg" alt="KTP Depan" />
  ) : (
    <div className="text-gray-400">
      <FontAwesomeIcon icon={faCamera} className="text-3xl mb-2" />
      <p className="text-sm">Upload KTP Depan</p>
    </div>
  )}
  <input
    id="front-ktp"
    type="file"
    accept="image/*"
    className="hidden"
    onChange={(e) => handleImageUpload(e, setFrontKtp)}
  />
</div>
```

---

## 14. Fitur Khusus

### 14.1 Multi-step Loan Form

Form pengajuan pinjaman terdiri dari 3 step:

**Step 1: Detail Pinjaman**
```typescript
// Opsi jumlah pinjaman
const loanAmounts = [5000, 6000, 8000, 10000, 15000, 20000, 25000, 30000,
                     35000, 40000, 45000, 50000, 60000, 70000, 80000,
                     90000, 100000, 150000, 200000];

// Opsi tenor
const tenorOptions = [6, 12, 24, 36, 48, 60, 72];

// Interest rate berdasarkan tenor
const getInterestRate = (tenor: number): number => {
  if (tenor <= 12) return 0.80;
  if (tenor <= 24) return 0.60;
  if (tenor <= 36) return 0.50;
  if (tenor <= 48) return 0.40;
  if (tenor <= 60) return 0.35;
  return 0.30; // 72 bulan
};

// Kalkulasi
const monthlyPrincipal = nominal / tenor;
const monthlyInterest = (nominal * interestRate) / 100;
const monthlyPayment = monthlyPrincipal + monthlyInterest;
```

**Step 2: Tanda Tangan Digital**
```tsx
// Canvas-based signature pad
const canvasRef = useRef<HTMLCanvasElement>(null);
const [isDrawing, setIsDrawing] = useState(false);

const startDraw = (e: React.MouseEvent<HTMLCanvasElement>) => {
  const ctx = canvasRef.current?.getContext("2d");
  if (!ctx) return;
  setIsDrawing(true);
  ctx.beginPath();
  ctx.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
};

const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
  if (!isDrawing) return;
  const ctx = canvasRef.current?.getContext("2d");
  if (!ctx) return;
  ctx.lineWidth = 2;
  ctx.lineCap = "round";
  ctx.strokeStyle = "#00D8A5";
  ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
  ctx.stroke();
};

const stopDraw = () => setIsDrawing(false);

const clearSignature = () => {
  const ctx = canvasRef.current?.getContext("2d");
  if (ctx) ctx.clearRect(0, 0, canvasRef.current!.width, canvasRef.current!.height);
};

// Di JSX:
<canvas
  ref={canvasRef}
  width={350}
  height={200}
  className="border border-white/20 rounded-xl bg-white/5 cursor-crosshair"
  onMouseDown={startDraw}
  onMouseMove={draw}
  onMouseUp={stopDraw}
  onMouseLeave={stopDraw}
/>
```

**Step 3: Konfirmasi & Submit**
```typescript
const submitLoan = async () => {
  const signatureData = canvasRef.current?.toDataURL("image/png");

  const formData = new FormData();
  formData.append("nominal", nominal.toString());
  formData.append("tenor", tenor.toString());
  formData.append("interest_rate", interestRate.toString());
  formData.append("signature", signatureData!);

  await apiFetch("/loans", { method: "POST", body: formData, isFormData: true });
};
```

### 14.2 OTP Input (6 digit)

```tsx
"use client";
import { useState, useRef } from "react";

export default function OtpInput({ onComplete }: { onComplete: (otp: string) => void }) {
  const [digits, setDigits] = useState(Array(6).fill(""));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newDigits = [...digits];
    newDigits[index] = value.slice(-1);
    setDigits(newDigits);

    // Auto-focus ke input berikutnya
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Jika semua terisi, trigger onComplete
    const otp = newDigits.join("");
    if (otp.length === 6 && newDigits.every(d => d !== "")) {
      onComplete(otp);
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  return (
    <div className="flex gap-3 justify-center">
      {digits.map((digit, i) => (
        <input
          key={i}
          ref={(el) => { inputRefs.current[i] = el; }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={digit}
          onChange={(e) => handleChange(i, e.target.value)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          className="w-12 h-14 text-center text-xl font-bold rounded-xl
                     modern-input-dark focus:ring-2 focus:ring-primary"
        />
      ))}
    </div>
  );
}
```

### 14.3 Loan Status Badge

```typescript
// Status mapping dari API
const loanStatusMap: Record<number, { label: string; color: string }> = {
  [-1]: { label: "Ditolak", color: "bg-red-500/20 text-red-400" },
  [0]:  { label: "Dalam Proses", color: "bg-yellow-500/20 text-yellow-400" },
  [1]:  { label: "Diluluskan", color: "bg-green-500/20 text-green-400" },
  [2]:  { label: "Ditolak", color: "bg-red-500/20 text-red-400" },
};
```

---

## 15. Assets & Media

### 15.1 File yang Perlu Disalin

Salin semua file dari `public/images/` project asli ke `public/images/` di project Next.js:

```
public/
├── images/
│   ├── logo-flexyduit.png           # Logo utama
│   ├── FlexyDuit-flat-transparent-logo.avif
│   ├── background.webp              # Background image
│   ├── maintenance.png              # Halaman maintenance
│   ├── icon-*.svg                   # Icon-icon fitur
│   ├── bank-*.svg                   # Logo bank
│   ├── flag-my.avif                 # Flag Malaysia
│   ├── flag-en.avif                 # Flag UK
│   ├── flag-cn.avif                 # Flag China
│   └── ...                          # Asset lainnya
└── favicon.ico
```

### 15.2 Penggunaan Next.js Image

```tsx
import Image from "next/image";

// Untuk gambar lokal:
<Image src="/images/logo-flexyduit.png" alt="Logo" width={160} height={48} priority />

// Untuk gambar dari CMS (perlu config):
<Image
  src={`${process.env.NEXT_PUBLIC_CMS_URL}/${user.image}`}
  alt="Profile"
  width={48}
  height={48}
  className="rounded-full object-cover"
/>
```

Tambahkan domain CMS di `next.config.ts`:

```typescript
// next.config.ts
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cms.berkahcapitalcredit.com",
      },
    ],
  },
};

export default nextConfig;
```

---

## 16. Build & Deployment

### 16.1 Development

```bash
npm run dev
# Buka http://localhost:3000
```

### 16.2 Build untuk Production

```bash
# Build standar (SSR)
npm run build

# ATAU static export (sama seperti Nuxt generate)
# Tambahkan di next.config.ts: output: "export"
npm run build
```

### 16.3 next.config.ts Lengkap

```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Untuk static export (seperti Nuxt SSR false):
  // output: "export",

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cms.berkahcapitalcredit.com",
      },
    ],
    // Jika pakai static export:
    // unoptimized: true,
  },

  // Redirect rules
  async redirects() {
    return [
      {
        source: "/kode-otp",
        destination: "/my/kode-otp",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
```

### 16.4 Script di package.json

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  }
}
```

---

## 17. API Reference

### Base URL
```
https://cms.berkahcapitalcredit.com/api/v1
```

### Headers Standard
```
Content-Type: application/json
Authorization: Bearer {token}
```

### Response Format
```json
{
  "data": { },
  "message": "Success",
  "status": 200
}
```

### Endpoints

| Method | Endpoint | Auth | Body | Deskripsi |
|--------|----------|------|------|-----------|
| POST | `/login` | - | `{ email, password }` | Login user |
| POST | `/register` | - | `{ name, email, password, password_confirmation, brand_id }` | Register user |
| POST | `/resend-register-otp` | Bearer | - | Kirim ulang OTP |
| POST | `/validate-register-otp` | Bearer | `{ otp }` | Validasi OTP |
| GET | `/me` | Bearer | - | Data user saat ini |
| GET | `/settings` | - | - | Pengaturan aplikasi |
| POST | `/profile/anggota-details` | Bearer | FormData (foto + data) | Simpan data pribadi |
| POST | `/profile/anggota-bank` | Bearer | `{ bank_name, account_number, account_name }` | Simpan data bank |
| GET | `/loans` | Bearer | - | Daftar pinjaman |
| POST | `/loans` | Bearer | FormData (loan + signature) | Submit pinjaman baru |
| GET | `/wallet/withdraw` | Bearer | `?orderBy=updated_at` | Riwayat wallet |

---

## 18. Data Models

### 18.1 TypeScript Types (`types/`)

```typescript
// types/user.ts
export interface User {
  id: number;
  email: string;
  image: string;
  email_verified_at: string | null;
  anggota: Anggota | null;
}

export interface Anggota {
  status: number;             // 1=approved, -1=rejected, 0=pending
  balance: number;
  can_withdraw: number;
  credit_score: number;
  second_loan: number;        // 0 atau 1
  anggota_detail: AnggotaDetail | null;
  anggota_bank: AnggotaBank | null;
}

export interface AnggotaDetail {
  ktp_number: string;
  full_name: string;
  gender: string;
  birth_place: string;
  birth_date: string;
  work: string;
  monthly_income: number;
  loan_purpose: string;
  address: string;
  contact_1: string;          // Nama emergency contact
  contact_1_name: string;     // Nomor emergency contact
}

export interface AnggotaBank {
  bank_name: string;
  account_number: string;
  account_name: string;
}
```

```typescript
// types/settings.ts
export interface Settings {
  maintenance: number;        // 0=normal, 1=maintenance
  tagline: string;
  background_login: string;
  term_of_service: string;    // Markdown content
}
```

```typescript
// types/loan.ts
export interface Loan {
  id: number;
  nominal: number;
  tenor: number;
  interest_rate: number;
  monthly_payment: number;
  status: number;             // -1=rejected, 0=pending, 1=approved, 2=rejected
  status_color: string;
  status_label: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export interface WalletTransaction {
  id: number;
  amount: number;
  status: number;
  status_color: string;
  status_label: string;
  description: string;
  created_at: string;
}
```

---

## Quick Start Checklist

- [ ] Setup Next.js project dengan TypeScript + Tailwind
- [ ] Install semua dependencies
- [ ] Setup environment variables (`.env.local`)
- [ ] Salin semua asset (`public/images/`)
- [ ] Salin translation files (`i18n/locales/`)
- [ ] Setup `globals.css` dengan CSS variables
- [ ] Setup `tailwind.config.ts`
- [ ] Buat `next.config.ts` (images, redirects)
- [ ] Buat `app/layout.tsx` dengan ThemeProvider
- [ ] Buat types (`types/user.ts`, `types/loan.ts`, dll)
- [ ] Buat API client (`lib/api.ts`)
- [ ] Buat auth hook (`hooks/useAuth.ts`)
- [ ] Buat settings hook (`hooks/useSettings.ts`)
- [ ] Buat atom components (Container, LinkBtn, dll)
- [ ] Buat NavigasiHeader & NavigasiFooter
- [ ] Buat halaman Sign In
- [ ] Buat halaman Sign Up
- [ ] Buat halaman OTP
- [ ] Buat halaman Verifikasi Akun
- [ ] Buat halaman Home / Dashboard
- [ ] Buat halaman Loan (multi-step)
- [ ] Buat halaman Wallet
- [ ] Buat halaman My Account + sub-pages
- [ ] Buat halaman Maintenance
- [ ] Setup i18n multi-bahasa
- [ ] Test semua flow dari login sampai loan submission
- [ ] Build & deploy

---

## Vue → React Cheat Sheet

| Vue 3 | React (Next.js) |
|-------|-----------------|
| `ref(value)` | `useState(value)` |
| `computed(() => ...)` | `useMemo(() => ..., [deps])` |
| `watch(source, cb)` | `useEffect(() => { cb() }, [source])` |
| `onMounted(() => ...)` | `useEffect(() => { ... }, [])` |
| `v-if="condition"` | `{condition && <Component />}` |
| `v-for="item in items"` | `{items.map(item => <Component key={...} />)}` |
| `v-model="value"` | `value={value} onChange={(e) => setValue(e.target.value)}` |
| `v-show="condition"` | `className={condition ? "" : "hidden"}` |
| `@click="handler"` | `onClick={handler}` |
| `@submit.prevent` | `onSubmit={(e) => { e.preventDefault(); ... }}` |
| `:class="{ active: isActive }"` | `className={isActive ? "active" : ""}` |
| `$emit('event', data)` | `onEvent(data)` (prop callback) |
| `defineProps<{ ... }>()` | `interface Props { ... }` |
| `<NuxtLink to="/">` | `<Link href="/">` |
| `useRouter().push()` | `useRouter().push()` |
| `useRoute().params` | `useParams()` |
| `<NuxtImg>` | `<Image />` (next/image) |
| `useI18n().t()` | `useTranslations()` (next-intl) |
