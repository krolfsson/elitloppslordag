import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle, Trash2 } from "lucide-react";
import { useEffect } from "react";
import { PinkButton } from "./PinkButton";

export type ConfirmVariant = "default" | "danger";

type ConfirmDialogProps = {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: ConfirmVariant;
  onConfirm: () => void;
  onCancel: () => void;
};

export function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = "Bekräfta",
  cancelLabel = "Avbryt",
  variant = "default",
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const isDanger = variant === "danger";

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel();
      if (e.key === "Enter") onConfirm();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onCancel, onConfirm]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[8000] flex items-center justify-center p-4 bg-[#1a1a1e]/50 backdrop-blur-sm"
          onClick={onCancel}
        >
          <motion.div
            role="alertdialog"
            aria-labelledby="confirm-title"
            aria-describedby="confirm-message"
            initial={{ scale: 0.9, opacity: 0, y: 12 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.92, opacity: 0, y: 8 }}
            transition={{ type: "spring", stiffness: 400, damping: 28 }}
            onClick={(e) => e.stopPropagation()}
            className="elit-card w-full max-w-md p-6 text-center shadow-[0_24px_60px_#e6007e25]"
          >
            <div
              className={`mx-auto mb-4 w-16 h-16 rounded-2xl flex items-center justify-center
                ${isDanger ? "bg-[#fff7ed] border-2 border-[#ff8c00]/40" : "bg-elit-pink-soft border-2 border-elit-pink/30"}`}
            >
              {isDanger ? (
                <AlertTriangle className="w-9 h-9 text-[#ff8c00]" strokeWidth={2.5} />
              ) : (
                <span className="text-4xl leading-none" role="img" aria-hidden>
                  🐴
                </span>
              )}
            </div>

            <h2
              id="confirm-title"
              className="text-bulky text-2xl text-ink m-0 mb-2 uppercase tracking-wide"
            >
              {title}
            </h2>
            <p
              id="confirm-message"
              className="text-ink/80 font-semibold text-base leading-relaxed m-0 mb-6"
            >
              {message}
            </p>

            <div className="flex flex-col-reverse sm:flex-row gap-3">
              <PinkButton
                variant="outline"
                onClick={onCancel}
                className="flex-1 min-w-0 !px-4 !text-sm whitespace-nowrap"
              >
                {cancelLabel}
              </PinkButton>
              {isDanger ? (
                <button
                  type="button"
                  onClick={onConfirm}
                  className="interactive flex-1 min-w-0 flex items-center justify-center gap-2 rounded-2xl border-[3px] border-[#ff8c00]
                    bg-gradient-to-b from-[#ff8c0030] to-[#ff8c0008] text-[#ff8c00] font-extrabold uppercase tracking-wide
                    min-h-[52px] px-4 text-sm whitespace-nowrap hover:bg-[#ff8c00] hover:text-white transition-colors glow-orange"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  <Trash2 size={20} className="shrink-0" />
                  <span>{confirmLabel}</span>
                </button>
              ) : (
                <PinkButton
                  onClick={onConfirm}
                  className="flex-1 min-w-0 !px-4 !text-sm whitespace-nowrap"
                >
                  {confirmLabel}
                </PinkButton>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
