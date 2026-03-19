import Image from "next/image";

interface AppLogoProps {
  className?: string;
  width?: number;
  height?: number;
}

export default function AppLogo({ className = "", width = 160, height = 48 }: AppLogoProps) {
  return (
    <Image
      src="/logo-flexyduit.png"
      alt="My Lending Solution"
      width={width}
      height={height}
      className={className}
      priority
    />
  );
}
