"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";

const menuItems = [
  {
    href: "/",
    label: "Home",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
      </svg>
    ),
  },
  {
    href: "/wallet",
    label: "Wallet",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
        <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
      </svg>
    ),
  },
  {
    href: "/customer-service",
    label: "CS",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-2 0a6 6 0 00-6-6v1a1 1 0 01-2 0V4a6 6 0 00-6 6h1a1 1 0 110 2H2a6.002 6.002 0 005 5.917V17a1 1 0 102 0v-.083A6.002 6.002 0 0016 12h-1a1 1 0 110-2h1zm-6-3a3 3 0 00-3 3v2a1 1 0 001 1h1v-3a1 1 0 012 0v3h1a1 1 0 001-1v-2a3 3 0 00-3-3z" />
      </svg>
    ),
  },
  {
    href: "/my-account",
    label: "Account",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
      </svg>
    ),
  },
];

export default function NavigasiFooter() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-t border-gray-200 dark:border-white/10">
      <div className="flex justify-around items-center h-16 max-w-md mx-auto">
        {menuItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-1 text-xs transition-colors ${
                isActive ? "text-primary font-semibold" : "text-gray-500 dark:text-gray-400"
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
