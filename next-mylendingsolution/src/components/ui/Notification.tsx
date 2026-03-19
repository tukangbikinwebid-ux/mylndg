"use client";
import { useEffect } from "react";

interface NotificationProps {
  message: string;
  type?: "success" | "error" | "info";
  onClose: () => void;
  duration?: number;
}

const typeStyles = {
  success: "bg-green-500/10 border-green-500/30 text-green-400",
  error: "bg-red-500/10 border-red-500/30 text-red-400",
  info: "bg-blue-500/10 border-blue-500/30 text-blue-400",
};

export default function Notification({ message, type = "info", onClose, duration = 3500 }: NotificationProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  return (
    <div className={`fixed top-4 left-1/2 -translate-x-1/2 z-70 max-w-sm w-full mx-4 px-4 py-3 rounded-xl border text-sm text-center animate-enter ${typeStyles[type]}`}>
      {message}
    </div>
  );
}
