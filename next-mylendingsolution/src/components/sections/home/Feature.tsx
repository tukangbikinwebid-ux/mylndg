import Link from "next/link";

const features = [
  {
    href: "/loan",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    label: "Pinjaman",
    color: "from-primary/20 to-primary/5",
  },
  {
    href: "/wallet",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
      </svg>
    ),
    label: "Wallet",
    color: "from-blue-500/20 to-blue-500/5",
  },
  {
    href: "/my-account",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
    label: "Akaun",
    color: "from-purple-500/20 to-purple-500/5",
  },
  {
    href: "/my-account/history-transaction",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
    ),
    label: "Sejarah",
    color: "from-amber-500/20 to-amber-500/5",
  },
];

export default function HomeFeature() {
  return (
    <div className="px-4 mb-6">
      <div className="grid grid-cols-4 gap-3">
        {features.map((f) => (
          <Link
            key={f.href}
            href={f.href}
            className="flex flex-col items-center gap-2 p-3 rounded-2xl bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 hover:border-primary/30 transition-all"
          >
            <div className={`w-12 h-12 flex items-center justify-center rounded-xl bg-gradient-to-br ${f.color} text-primary`}>
              {f.icon}
            </div>
            <span className="text-xs text-gray-600 dark:text-gray-400 text-center">{f.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
