import { AnimatePresence, motion } from "framer-motion";
import type { ToastMessage } from "../../types";

type ToastStackProps = {
  toasts: ToastMessage[];
};

export function ToastStack({ toasts }: ToastStackProps) {
  return (
    <div className="fixed top-24 right-6 z-[8000] flex flex-col gap-2 pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, x: 60, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 30 }}
            className="px-5 py-3 rounded-2xl bg-elit-pink text-white font-bold text-base shadow-[0_8px_24px_#e6007e50]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {toast.text}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
