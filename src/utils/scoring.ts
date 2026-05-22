import type {
  EventPlacement,
  GameEvent,
  Placement,
  TeamId,
  TeamTotal,
} from "../types";

export function calculateEventPlacements(
  event: GameEvent,
  teamIds: TeamId[],
): EventPlacement {
  const entries = teamIds
    .map((id) => ({
      teamId: id,
      score: event.scores[id] ?? 0,
    }))
    .sort((a, b) => b.score - a.score);

  const placements: EventPlacement = {};
  const groups: { score: number; teams: TeamId[] }[] = [];

  for (const entry of entries) {
    const last = groups[groups.length - 1];
    if (last && last.score === entry.score) {
      last.teams.push(entry.teamId);
    } else {
      groups.push({ score: entry.score, teams: [entry.teamId] });
    }
  }

  let rank = 1;
  for (const group of groups) {
    const placement: Placement =
      group.teams.length > 1
        ? "tie"
        : (Math.min(rank, 4) as 1 | 2 | 3 | 4);
    for (const teamId of group.teams) {
      placements[teamId] = placement;
    }
    rank += group.teams.length;
  }

  return placements;
}

export function calculateTotals(
  events: GameEvent[],
  teamIds: TeamId[],
): Partial<Record<TeamId, number>> {
  const totals = Object.fromEntries(teamIds.map((id) => [id, 0])) as Partial<
    Record<TeamId, number>
  >;
  for (const event of events) {
    for (const id of teamIds) {
      totals[id] = (totals[id] ?? 0) + (event.scores[id] ?? 0);
    }
  }
  return totals;
}

export function calculateOverallRanking(
  totals: Partial<Record<TeamId, number>>,
  teamIds: TeamId[],
): TeamTotal[] {
  const entries = teamIds
    .map((id) => ({
      teamId: id,
      total: totals[id] ?? 0,
    }))
    .sort((a, b) => b.total - a.total);

  const result: TeamTotal[] = [];
  let rank = 1;

  for (let i = 0; i < entries.length; i++) {
    const current = entries[i];
    const tiedWith: TeamId[] = [current.teamId];

    let j = i + 1;
    while (j < entries.length && entries[j].total === current.total) {
      tiedWith.push(entries[j].teamId);
      j++;
    }

    for (const entry of entries.slice(i, j)) {
      result.push({
        teamId: entry.teamId,
        total: entry.total,
        rank,
        tiedWith: tiedWith.filter((id) => id !== entry.teamId),
      });
    }

    rank += j - i;
    i = j - 1;
  }

  return result;
}

export function getPlacementLabel(placement: Placement): string {
  if (placement === "tie") return "LIKA";
  if (placement === 1) return "1:a";
  if (placement === 2) return "2:a";
  if (placement === 3) return "3:a";
  return "4:a";
}

export function getTieMessage(
  rankings: TeamTotal[],
  teams: { id: TeamId; name: string }[],
): string | null {
  const leaders = rankings.filter((r) => r.rank === 1);
  if (leaders.length <= 1) return null;

  const names = leaders.map((l) => {
    const team = teams.find((t) => t.id === l.teamId);
    const short = team?.name.replace("Lag ", "") ?? l.teamId;
    return short;
  });

  if (names.length === 2) {
    return `${names[0].toUpperCase()} OCH ${names[1].toUpperCase()} DELAR FÖRSTA PLATS!`;
  }
  return `${names.join(", ").toUpperCase()} DELAR FÖRSTA PLATS!`;
}

export function clampScore(score: number): number {
  return Math.max(0, Math.min(99, score));
}
