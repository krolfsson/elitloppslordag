import type { Team } from "../../types";
import { EmojiDisplay } from "../emoji/EmojiDisplay";

export function EventEmojiDisplay({
  emoji,
  size = "md",
}: {
  emoji: string;
  size?: "sm" | "md" | "lg";
}) {
  return <EmojiDisplay emoji={emoji} size={size} />;
}

export function TeamIconDisplay({
  team,
  size = "md",
}: {
  team: Team;
  size?: "sm" | "md" | "lg";
}) {
  return <EmojiDisplay emoji={team.emoji} size={size} />;
}

export function TeamNumberBadge({
  n,
  size = "md",
}: {
  n: number;
  size?: "sm" | "md" | "lg";
}) {
  const dim =
    size === "lg"
      ? "w-12 h-12 text-xl"
      : size === "sm"
        ? "w-8 h-8 text-sm"
        : "w-10 h-10 text-base";
  return <span className={`elit-badge ${dim}`}>{n}</span>;
}

export function EventNumberBadge({
  n,
  size = "md",
}: {
  n: number;
  size?: "sm" | "md";
}) {
  const dim = size === "sm" ? "w-9 h-9 text-sm" : "w-11 h-11 text-lg";
  return <span className={`elit-badge ${dim}`}>{n}</span>;
}
