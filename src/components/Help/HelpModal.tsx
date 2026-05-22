import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";

type HelpModalProps = {
  open: boolean;
  onClose: () => void;
};

export function HelpModal({ open, onClose }: HelpModalProps) {
  if (!open) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="fixed inset-0 z-[7000] flex items-center justify-center bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          onClick={(e) => e.stopPropagation()}
          className="elit-card w-full max-w-lg mx-4 p-6"
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-bulky text-2xl text-elit-pink m-0 uppercase">Hjälp</h3>
            <button
              type="button"
              onClick={onClose}
              className="interactive w-10 h-10 rounded-full bg-[#f5f5f7] flex items-center justify-center"
            >
              <X size={22} />
            </button>
          </div>

          <ul className="space-y-3 text-ink text-base leading-relaxed m-0 pl-5 font-semibold">
            <li>Klicka på en poängcell för att ändra poäng.</li>
            <li>1:a plats = 3p, 2:a = 2p, 3:e = 1p per gren.</li>
            <li>Placering och totalställning uppdateras automatiskt.</li>
            <li>Poäng sparas i webbläsaren vid refresh.</li>
            <li>I inställningar kan du byta emoji och namn för lag och grenar.</li>
            <li>I inställningar kan du lägga till eller ta bort lag (2–4 st) och grenar.</li>
            <li>Använd Helskärm för TV-läge.</li>
          </ul>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
