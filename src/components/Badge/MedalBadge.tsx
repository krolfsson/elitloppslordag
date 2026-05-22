import { motion } from "framer-motion";
import type { Placement } from "../../types";

type MedalBadgeProps = {
  placement: Placement;
};

const medalStyles: Record<1 | 2 | 3, string> = {
  1: "bg-elit-pink text-white ring-2 ring-elit-pink/30",
  2: "bg-[#e8e8ed] text-ink ring-2 ring-gray-200",
  3: "bg-elit-pink-light text-elit-pink-dark ring-2 ring-elit-pink/20",
};

export function MedalBadge({ placement }: MedalBadgeProps) {
  if (placement === "tie") {
    return (
      <motion.span
        animate={{ scale: [1, 1.06, 1] }}
        transition={{ repeat: Infinity, duration: 1.2 }}
        className="inline-flex items-center justify-center rounded-full px-2.5 py-1 text-[10px] font-black uppercase
          bg-elit-pink-soft text-elit-pink border border-elit-pink/40"
        style={{ fontFamily: "var(--font-display)" }}
      >
        Lika
      </motion.span>
    );
  }

  const labels = { 1: "1:a", 2: "2:a", 3: "3:a" };

  return (
    <span
      className={`inline-flex w-9 h-9 shrink-0 items-center justify-center rounded-full text-[10px] font-black
        ${medalStyles[placement]}`}
      style={{ fontFamily: "var(--font-display)" }}
    >
      {labels[placement]}
    </span>
  );
}
