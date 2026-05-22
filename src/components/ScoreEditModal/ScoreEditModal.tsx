import { AnimatePresence, motion } from "framer-motion";
import { Minus, Plus, X } from "lucide-react";
import { useConfirm } from "../../context/ConfirmContext";
import type { GameEvent, Team, TeamId } from "../../types";
import { PinkButton } from "../ui/PinkButton";

type ScoreEditModalProps = {
  target: { eventId: string; teamId: TeamId } | null;
  event: GameEvent | null;
  team: Team | null;
  onClose: () => void;
  onAdjust: (delta: number) => void;
  onSet: (score: number) => void;
  onReset: () => void;
};

export function ScoreEditModal({
  target,
  event,
  team,
  onClose,
  onAdjust,
  onSet,
  onReset,
}: ScoreEditModalProps) {
  const { confirm } = useConfirm();

  if (!target || !event || !team) return null;

  const score = event.scores[team.id];

  const handleResetCell = async () => {
    const ok = await confirm({
      title: "Nollställ cell?",
      message: `Sätt ${team.name}s poäng i ${event.name} till 0?`,
      confirmLabel: "Nollställ",
      cancelLabel: "Avbryt",
      variant: "danger",
    });
    if (ok) onReset();
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[7000] flex items-center justify-center bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="elit-card w-full max-w-md mx-4 p-6 border-elit-pink/30"
        >
          <button
            type="button"
            onClick={onClose}
            className="interactive absolute top-4 right-4 w-10 h-10 rounded-full bg-[#f5f5f7] flex items-center justify-center text-ink-muted hover:bg-elit-pink-soft hover:text-elit-pink"
          >
            <X size={22} />
          </button>

          <p className="text-label-pink m-0 mb-1">Ändra poäng</p>
          <h3 className="text-bulky text-2xl text-ink m-0 mb-0">{event.name}</h3>
          <p className="text-bulky text-elit-pink text-lg mb-6">{team.name}</p>

          <div className="flex items-center justify-center gap-6 mb-6">
            <motion.button
              type="button"
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              onClick={() => onAdjust(-1)}
              className="interactive w-16 h-16 rounded-2xl border-2 border-[#e8e8ed] bg-white flex items-center justify-center hover:border-elit-pink hover:bg-elit-pink-soft"
            >
              <Minus size={32} className="text-elit-pink" strokeWidth={3} />
            </motion.button>

            <motion.span
              key={score}
              initial={{ scale: 1.3 }}
              animate={{ scale: 1 }}
              className="text-bulky text-7xl text-ink tabular-nums"
            >
              {score}
            </motion.span>

            <motion.button
              type="button"
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              onClick={() => onAdjust(1)}
              className="interactive w-16 h-16 rounded-2xl bg-elit-pink flex items-center justify-center hover:bg-elit-pink-dark shadow-[0_4px_16px_#e6007e50]"
            >
              <Plus size={32} className="text-white" strokeWidth={3} />
            </motion.button>
          </div>

          <div className="grid grid-cols-3 gap-2 mb-3">
            {[1, 2, 3].map((n) => (
              <PinkButton key={n} variant="outline" onClick={() => onSet(n)}>
                Sätt {n}
              </PinkButton>
            ))}
          </div>

          <PinkButton variant="ghost" onClick={handleResetCell} className="w-full">
            Nollställ cell
          </PinkButton>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
