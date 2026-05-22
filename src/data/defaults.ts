import type { GameEvent, Team, TeamId } from "../types";
import {
  MAX_TEAMS,
  MIN_TEAMS,
  TEAM_SLOTS,
  createEmptyScores,
  syncEventScores,
  teamIdsFrom,
} from "../utils/teams";

export const DEFAULT_TEAM_EMOJI: Record<TeamId, string> = {
  blue: "💙",
  red: "💛",
  green: "🩵",
  yellow: "💜",
};

export const DEFAULT_TEAM_NAMES: Record<TeamId, string> = {
  blue: "LAG ADIELSSON",
  red: "LAG GOOP",
  green: "LAG KIHLSTRÖM",
  yellow: "LAG 4",
};

export const TEAM_EMOJI_SUGGESTIONS = [
  "💙",
  "💛",
  "🩵",
  "💜",
  "❤️",
  "💚",
  "🐴",
  "🏆",
  "🎉",
  "⚡",
  "🎯",
  "🍻",
  "⚽",
  "🌽",
  "👑",
];

export const DEFAULT_EVENT_EMOJI: Record<string, string> = {
  ol: "🍻",
  fotboll: "⚽",
  trav: "🐴",
  geografi: "🗺️",
  cornhole: "🌽",
};

export const DEFAULT_EVENT_EMOJI_FALLBACK = "🎮";

export const EVENT_EMOJI_SUGGESTIONS = [
  "🍻",
  "⚽",
  "🐴",
  "🗺️",
  "🌽",
  "🎯",
  "🎮",
  "🏆",
  "🎤",
  "🎬",
  "🎲",
  "🧠",
  "🎵",
  "💃",
  "🔔",
];

export const DEFAULT_TEAMS: Team[] = [
  { id: "blue", name: "LAG ADIELSSON", color: "blue", emoji: "💙" },
  { id: "red", name: "LAG GOOP", color: "red", emoji: "💛" },
  { id: "green", name: "LAG KIHLSTRÖM", color: "green", emoji: "🩵" },
];

const DEFAULT_TEAMS_BY_SLOT: Record<TeamId, Team> = {
  blue: DEFAULT_TEAMS[0],
  red: DEFAULT_TEAMS[1],
  green: DEFAULT_TEAMS[2],
  yellow: {
    id: "yellow",
    name: DEFAULT_TEAM_NAMES.yellow,
    color: "yellow",
    emoji: DEFAULT_TEAM_EMOJI.yellow,
  },
};

export const DEFAULT_EVENTS: GameEvent[] = [
  {
    id: "ol",
    name: "Öl",
    emoji: "🍻",
    scores: createEmptyScores(teamIdsFrom(DEFAULT_TEAMS)),
  },
  {
    id: "fotboll",
    name: "Fotboll",
    emoji: "⚽",
    scores: createEmptyScores(teamIdsFrom(DEFAULT_TEAMS)),
  },
  {
    id: "trav",
    name: "Trav",
    emoji: "🐴",
    scores: createEmptyScores(teamIdsFrom(DEFAULT_TEAMS)),
  },
  {
    id: "geografi",
    name: "Geografi",
    emoji: "🗺️",
    scores: createEmptyScores(teamIdsFrom(DEFAULT_TEAMS)),
  },
  {
    id: "cornhole",
    name: "Cornhole",
    emoji: "🌽",
    scores: createEmptyScores(teamIdsFrom(DEFAULT_TEAMS)),
  },
];

export const STORAGE_KEY = "elitloppslordag-games-v2";
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
  const base = DEFAULT_TEAMS_BY_SLOT[raw.id];
  const fromIcon: Record<string, string> = {
    star: "💙",
    flame: "💛",
    leaf: "🩵",
  };
  const emoji =
    raw.emoji ??
    (raw.icon ? fromIcon[raw.icon] : undefined) ??
    DEFAULT_TEAM_EMOJI[raw.id] ??
    "⭐";

  return {
    id: raw.id,
    name: raw.name?.trim() || base?.name || DEFAULT_TEAM_NAMES[raw.id] || "Nytt lag",
    color: raw.id,
    emoji,
  };
}

/** Säkerställ 2–4 giltiga lag i rätt ordning */
export function normalizeTeamsList(raw?: Partial<Team>[]): Team[] {
  const source = raw?.length ? raw : DEFAULT_TEAMS;
  const seen = new Set<TeamId>();
  const teams: Team[] = [];

  for (const item of source) {
    if (!item.id || !TEAM_SLOTS.includes(item.id as TeamId) || seen.has(item.id as TeamId)) {
      continue;
    }
    const id = item.id as TeamId;
    seen.add(id);
    teams.push(normalizeTeam({ ...item, id }));
    if (teams.length >= MAX_TEAMS) break;
  }

  for (const slot of TEAM_SLOTS) {
    if (teams.length >= MIN_TEAMS) break;
    if (!seen.has(slot)) {
      seen.add(slot);
      teams.push(DEFAULT_TEAMS_BY_SLOT[slot]);
    }
  }

  return teams
    .sort((a, b) => TEAM_SLOTS.indexOf(a.id) - TEAM_SLOTS.indexOf(b.id))
    .slice(0, MAX_TEAMS);
}

/** Migrera sparade grenar utan emoji (äldre `icon`-fält) */
export function normalizeEvent(
  raw: Partial<GameEvent> & { id: string; icon?: string },
  index: number,
  teamIds: TeamId[],
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
    scores: syncEventScores(raw.scores, teamIds),
  };
}
