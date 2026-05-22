import { motion } from "framer-motion";
import type { ReactNode } from "react";

type PinkButtonProps = {
  children: ReactNode;
  onClick?: () => void;
  icon?: ReactNode;
  variant?: "solid" | "outline" | "ghost";
  className?: string;
  size?: "md" | "lg";
};

export function PinkButton({
  children,
  onClick,
  icon,
  variant = "solid",
  className = "",
  size = "md",
}: PinkButtonProps) {
  const sizeClass =
    size === "lg"
      ? "px-8 py-4 text-base min-h-[64px] rounded-2xl"
      : "px-6 py-3 text-sm min-h-[52px] rounded-xl";

  const variantClass = {
    solid:
      "bg-elit-pink text-white border-2 border-elit-pink hover:bg-elit-pink-dark shadow-[0_4px_16px_#e6007e40]",
    outline:
      "bg-white text-elit-pink border-2 border-elit-pink hover:bg-elit-pink-soft",
    ghost:
      "bg-transparent text-elit-pink border-2 border-transparent hover:bg-elit-pink-soft",
  }[variant];

  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileHover={{ scale: 1.02, y: -1 }}
      whileTap={{ scale: 0.98 }}
      className={`interactive flex items-center justify-center gap-2.5 w-full
        font-extrabold uppercase tracking-wide transition-colors
        ${sizeClass} ${variantClass} ${className}`}
      style={{ fontFamily: "var(--font-display)" }}
    >
      {icon}
      <span>{children}</span>
    </motion.button>
  );
}
