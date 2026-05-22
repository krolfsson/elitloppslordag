import { motion } from "framer-motion";
import { HelpCircle, Settings } from "lucide-react";
import { OddsTicker } from "./OddsTicker";

type HeaderProps = {
  onSettings: () => void;
  onHelp: () => void;
};

function ElitLogo() {
  return (
    <img
      src="/elitloppslordag-logo.png"
      alt="Elitloppslördag"
      className="h-14 w-auto shrink-0 object-contain"
      draggable={false}
    />
  );
}

export function Header({ onSettings, onHelp }: HeaderProps) {
  return (
    <header className="shrink-0 z-10">
      <OddsTicker />

      {/* Main header card */}
      <div className="px-5 pt-3 pb-3">
        <div className="elit-card px-6 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 min-w-0">
            <ElitLogo />
            <div>
              <h1
                className="text-bulky text-ink m-0 leading-[0.95] text-3xl md:text-4xl lg:text-[2.75rem] uppercase"
                style={{ color: "#1a1a1e" }}
              >
                Elitloppslördag
                <span className="text-elit-pink"> Games</span>
              </h1>
              <p className="text-label-pink mt-1 mb-0">TV-scoreboard • 3 lag • 5 grenar</p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <motion.button
              type="button"
              whileHover={{ scale: 1.05 }}
              onClick={onSettings}
              className="interactive flex items-center gap-2 px-4 py-2.5 rounded-xl bg-elit-pink text-white font-bold text-sm uppercase tracking-wide"
              style={{ fontFamily: "var(--font-display)" }}
            >
              <Settings size={18} strokeWidth={2.5} />
              Inställningar
            </motion.button>
            <motion.button
              type="button"
              whileHover={{ scale: 1.05 }}
              onClick={onHelp}
              className="interactive flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 border-elit-pink text-elit-pink bg-white font-bold text-sm uppercase tracking-wide hover:bg-elit-pink-soft"
              style={{ fontFamily: "var(--font-display)" }}
            >
              <HelpCircle size={18} strokeWidth={2.5} />
              Hjälp
            </motion.button>
          </div>
        </div>
      </div>
    </header>
  );
}
