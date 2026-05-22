import type { Team, TeamId } from "../../types";
import { EmojiDisplay } from "../emoji/EmojiDisplay";

const TEAM_NUM: Record<TeamId, number> = { blue: 1, red: 2, green: 3 };

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
  teamId,
  size = "md",
}: {
  teamId: TeamId;
  size?: "sm" | "md" | "lg";
}) {
  const dim =
    size === "lg"
      ? "w-12 h-12 text-xl"
      : size === "sm"
        ? "w-8 h-8 text-sm"
        : "w-10 h-10 text-base";
  return <span className={`elit-badge ${dim}`}>{TEAM_NUM[teamId]}</span>;
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
