import type {
  EventPlacement,
  GameEvent,
  Placement,
  TeamId,
  TeamTotal,
} from "../types";

const TEAM_IDS: TeamId[] = ["blue", "red", "green"];

export function calculateEventPlacements(event: GameEvent): EventPlacement {
  const entries = TEAM_IDS.map((id) => ({
    teamId: id,
    score: event.scores[id],
  })).sort((a, b) => b.score - a.score);

  const placements: EventPlacement = { blue: 3, red: 3, green: 3 };
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
      group.teams.length > 1 ? "tie" : (rank as 1 | 2 | 3);
    for (const teamId of group.teams) {
      placements[teamId] = placement;
    }
    rank += group.teams.length;
  }

  return placements;
}

export function calculateTotals(events: GameEvent[]): Record<TeamId, number> {
  const totals: Record<TeamId, number> = { blue: 0, red: 0, green: 0 };
  for (const event of events) {
    for (const id of TEAM_IDS) {
      totals[id] += event.scores[id];
    }
  }
  return totals;
}

export function calculateOverallRanking(
  totals: Record<TeamId, number>,
): TeamTotal[] {
  const entries = TEAM_IDS.map((id) => ({
    teamId: id,
    total: totals[id],
  })).sort((a, b) => b.total - a.total);

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
  return "3:a";
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
