import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import { useEffect, useState } from "react";

interface ToastProps {
  message: string;
  type?: "success" | "error" | "info";
  duration?: number;
  onClose?: () => void;
}

export function Toast({ 
  message, 
  type = "info", 
  duration = 3000, 
  onClose 
}: ToastProps) {
  const [isVisible, setIsVisible] = useState(true);

  // Auto-dismiss after duration
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      if (onClose) onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  if (!isVisible) return null;

  return (
    <div
      className={cn(
        "fixed top-4 right-4 z-50 flex items-center p-4 rounded-md shadow-md max-w-md",
        type === "success" && "bg-green-100 text-green-800 border border-green-200",
        type === "error" && "bg-red-100 text-red-800 border border-red-200",
        type === "info" && "bg-blue-100 text-blue-800 border border-blue-200"
      )}
    >
      <div className="flex-1 mr-2">{message}</div>
      <button
        onClick={() => {
          setIsVisible(false);
          if (onClose) onClose();
        }}
        className="text-gray-500 hover:text-gray-700"
      >
        <X size={16} />
      </button>
    </div>
  );
}

// Toast container to manage multiple toasts
export function ToastContainer({ children }: { children: React.ReactNode }) {
  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
      {children}
    </div>
  );
} 