import { useEffect } from "react";
import { SettingsContent } from "../routes/Settings";

interface SettingsModalProps {
  open: boolean;
  onClose: () => void;
  // Whether to surface the Restart row. True when used from Reveal/Kick.
  showRestart: boolean;
}

export default function SettingsModal({
  open,
  onClose,
  showRestart,
}: SettingsModalProps) {
  // Lock background scroll while open. Without this, on iOS Safari the page
  // underneath scrolls when you swipe inside the sheet near its edges.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  // Escape-to-close on desktop. Cheap accessibility win.
  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 flex items-end sm:items-center justify-center bg-black/40 z-40"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Settings"
    >
      <div
        className="w-full max-w-md bg-gray-50 rounded-t-3xl sm:rounded-3xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-200 sticky top-0 bg-gray-50">
          <h2 className="text-lg font-bold">Settings</h2>
          <button
            onClick={onClose}
            aria-label="Close settings"
            className="w-9 h-9 flex items-center justify-center text-gray-500 text-2xl active:scale-90 transition"
          >
            ×
          </button>
        </div>

        <div className="p-4">
          <SettingsContent
            showRestart={showRestart}
            onDestructiveComplete={onClose}
          />
        </div>
      </div>
    </div>
  );
}