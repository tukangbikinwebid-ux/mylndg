"use client";
import { useRouter } from "next/navigation";

interface NavigasiHeaderProps {
  title: string;
  backUrl?: string;
}

export default function NavigasiHeader({ title, backUrl }: NavigasiHeaderProps) {
  const router = useRouter();

  return (
    <div className="sticky top-0 z-50 flex items-center gap-3 p-4 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-white/10">
      <button
        onClick={() => (backUrl ? router.push(backUrl) : router.back())}
        className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-white"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
        </svg>
      </button>
      <h1 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h1>
    </div>
  );
}
