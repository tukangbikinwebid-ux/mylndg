interface TitleProps {
  children: React.ReactNode;
  className?: string;
}

export default function Title({ children, className = "" }: TitleProps) {
  return (
    <h2 className={`text-2xl font-bold text-gray-900 dark:text-white ${className}`}>
      {children}
    </h2>
  );
}
