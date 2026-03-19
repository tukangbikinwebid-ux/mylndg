import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "next-themes";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "My Lending Solution",
  description: "Digital Lending Platform - Penyelesaian Kewangan yang Fleksibel dan Dipercayai",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ms" suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen`}>
        <ThemeProvider attribute="class" defaultTheme="dark">
          <main className="max-w-md mx-auto min-h-screen relative bg-body">
            {children}
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
