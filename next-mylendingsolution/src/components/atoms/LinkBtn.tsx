import Link from "next/link";

interface LinkBtnProps {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "outline" | "ghost";
  className?: string;
  onClick?: () => void;
}

const variants: Record<string, string> = {
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
      className={`inline-flex items-center justify-center px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-300 ${variants[variant]} ${className}`}
    >
      {children}
    </Link>
  );
}
