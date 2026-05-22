import { motion } from "framer-motion";
import { MedalBadge } from "../Badge/MedalBadge";
import type { Placement } from "../../types";

type TeamCellProps = {
  score: number;
  placement: Placement;
  onClick: () => void;
  popKey: number;
};

export function TeamCell({ score, placement, onClick, popKey }: TeamCellProps) {
  return (
    <motion.button
      type="button"
      data-clickable
      onClick={onClick}
      key={popKey}
      initial={{ scale: 1.08 }}
      animate={{ scale: 1 }}
      transition={{ type: "spring", stiffness: 500, damping: 22 }}
      className="interactive score-cell relative flex items-center justify-center gap-3 w-full min-h-[72px] px-3"
    >
      <span
        className="text-5xl font-black tabular-nums text-ink leading-none"
        style={{ fontFamily: "var(--font-display)" }}
      >
        {score}
      </span>
      <MedalBadge placement={placement} />
    </motion.button>
  );
}
