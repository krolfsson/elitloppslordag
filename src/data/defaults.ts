import type { GameEvent, Team, TeamId } from "../types";

export const DEFAULT_TEAM_EMOJI: Record<TeamId, string> = {
  blue: "⭐",
  red: "🔥",
  green: "🌿",
};

export const TEAM_EMOJI_SUGGESTIONS = [
  "⭐",
  "🔥",
  "🌿",
  "💙",
  "❤️",
  "💚",
  "🐴",
  "🏆",
  "🎉",
  "⚡",
  "🎯",
  "🎵",
  "🧠",
  "👑",
  "🍀",
];

export const DEFAULT_EVENT_EMOJI: Record<string, string> = {
  quiz: "🧠",
  "gissa-laten": "🎵",
  prickskytte: "🎯",
  memory: "🃏",
  finalduell: "⚔️",
};

export const DEFAULT_EVENT_EMOJI_FALLBACK = "🎮";

export const EVENT_EMOJI_SUGGESTIONS = [
  "🧠",
  "🎵",
  "🎯",
  "🃏",
  "⚔️",
  "🎮",
  "🐴",
  "🏆",
  "🎤",
  "🎬",
  "🍻",
  "⚽",
  "🎲",
  "💃",
  "🔔",
];

export const DEFAULT_TEAMS: Team[] = [
  { id: "blue", name: "Lag Blå", color: "blue", emoji: "⭐" },
  { id: "red", name: "Lag Röd", color: "red", emoji: "🔥" },
  { id: "green", name: "Lag Grön", color: "green", emoji: "🌿" },
];

export const DEFAULT_EVENTS: GameEvent[] = [
  {
    id: "quiz",
    name: "Quiz",
    emoji: "🧠",
    scores: { blue: 3, red: 2, green: 1 },
  },
  {
    id: "gissa-laten",
    name: "Gissa låten",
    emoji: "🎵",
    scores: { blue: 2, red: 3, green: 1 },
  },
  {
    id: "prickskytte",
    name: "Prickskytte",
    emoji: "🎯",
    scores: { blue: 1, red: 2, green: 3 },
  },
  {
    id: "memory",
    name: "Memory",
    emoji: "🃏",
    scores: { blue: 3, red: 1, green: 2 },
  },
  {
    id: "finalduell",
    name: "Finalduell",
    emoji: "⚔️",
    scores: { blue: 2, red: 3, green: 1 },
  },
];

export const STORAGE_KEY = "elitloppslordag-games-v1";
export const LEGACY_STORAGE_KEY = "hemmakampen-state-v1";

const ICON_TO_EMOJI: Record<string, string> = {
  brain: "🧠",
  music: "🎵",
  target: "🎯",
  cards: "🃏",
  swords: "⚔️",
};

/** Migrera sparade lag utan emoji (äldre `icon`-fält) */
export function normalizeTeam(
  raw: Partial<Team> & { id: TeamId; icon?: string },
): Team {
  const base = DEFAULT_TEAMS.find((t) => t.id === raw.id)!;
  const fromIcon: Record<string, string> = {
    star: "⭐",
    flame: "🔥",
    leaf: "🌿",
  };
  const emoji =
    raw.emoji ??
    (raw.icon ? fromIcon[raw.icon] : undefined) ??
    DEFAULT_TEAM_EMOJI[raw.id];

  return {
    id: raw.id,
    name: raw.name?.trim() || base.name,
    color: raw.id,
    emoji,
  };
}

/** Migrera sparade grenar utan emoji (äldre `icon`-fält) */
export function normalizeEvent(
  raw: Partial<GameEvent> & { id: string; icon?: string },
  index: number,
): GameEvent {
  const base = DEFAULT_EVENTS.find((e) => e.id === raw.id);
  const emoji =
    raw.emoji ??
    (raw.icon ? ICON_TO_EMOJI[raw.icon] : undefined) ??
    DEFAULT_EVENT_EMOJI[raw.id] ??
    DEFAULT_EVENT_EMOJI_FALLBACK;

  return {
    id: raw.id,
    name: raw.name?.trim() || base?.name || `Gren ${index + 1}`,
    emoji,
    scores: raw.scores ?? { blue: 0, red: 0, green: 0 },
  };
}
