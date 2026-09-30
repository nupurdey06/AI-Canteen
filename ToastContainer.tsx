import React from "react";
import { ToastMessage } from "../types";
import { Check, X } from "lucide-react";

interface ToastContainerProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null;

  return (
    <div
      id="canteen-toast-container"
      className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm pointer-events-none"
    >
      {toasts.map((t) => (
        <div
          key={t.id}
          className="pointer-events-auto bg-[#FBF6EC] text-[#2A2420] border-2 border-[#2A2420] p-3 shadow-lg flex items-center justify-between gap-3 font-body text-xs animate-in fade-in slide-in-from-bottom-2 duration-200"
        >
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full bg-[#E3A008] text-[#2A2420] flex items-center justify-center shrink-0 text-xs font-bold">
              <Check className="w-3 h-3" />
            </div>
            <span className="font-medium">{t.text}</span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {t.actionLabel && t.onAction && (
              <button
                onClick={() => {
                  t.onAction?.();
                  onDismiss(t.id);
                }}
                className="underline text-[11px] font-bold text-[#C1442D] hover:text-[#9c301c] cursor-pointer"
              >
                {t.actionLabel}
              </button>
            )}
            <button
              onClick={() => onDismiss(t.id)}
              className="text-[#2A2420]/60 hover:text-[#2A2420] p-0.5 cursor-pointer"
              aria-label="Dismiss"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};
