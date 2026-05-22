import type { GameEvent, Team, TeamId } from "../types";

export const TEAM_SLOTS: TeamId[] = ["blue", "red", "green", "yellow"];
export const MIN_TEAMS = 2;
export const MAX_TEAMS = 4;

export function teamIdsFrom(teams: Team[]): TeamId[] {
  return teams.map((t) => t.id);
}

export function createEmptyScores(
  teamIds: TeamId[],
): Partial<Record<TeamId, number>> {
  return Object.fromEntries(teamIds.map((id) => [id, 0])) as Partial<
    Record<TeamId, number>
  >;
}

export function syncEventScores(
  scores: Partial<Record<TeamId, number>> | undefined,
  teamIds: TeamId[],
): Partial<Record<TeamId, number>> {
  const synced = createEmptyScores(teamIds);
  for (const id of teamIds) {
    synced[id] = scores?.[id] ?? 0;
  }
  return synced;
}

export function stripTeamFromScores(
  scores: Partial<Record<TeamId, number>>,
  teamId: TeamId,
): Partial<Record<TeamId, number>> {
  const next = { ...scores };
  delete next[teamId];
  return next;
}

export function syncAllEventScores(
  events: GameEvent[],
  teamIds: TeamId[],
): GameEvent[] {
  return events.map((e) => ({
    ...e,
    scores: syncEventScores(e.scores, teamIds),
  }));
}

export function nextAvailableTeamSlot(teams: Team[]): TeamId | null {
  return TEAM_SLOTS.find((id) => !teams.some((t) => t.id === id)) ?? null;
}
