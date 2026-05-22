type EmojiDisplayProps = {
  emoji: string;
  size?: "sm" | "md" | "lg";
  className?: string;
};

const sizes = {
  sm: "text-2xl w-9 h-9",
  md: "text-3xl w-11 h-11",
  lg: "text-4xl w-14 h-14",
};

export function EmojiDisplay({ emoji, size = "md", className = "" }: EmojiDisplayProps) {
  return (
    <span
      role="img"
      aria-hidden
      className={`inline-flex items-center justify-center shrink-0 leading-none rounded-xl bg-elit-pink-soft ${sizes[size]} ${className}`}
    >
      {emoji}
    </span>
  );
}
