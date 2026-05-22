import { motion } from "framer-motion";
import type { Team, TeamId, TeamTotal } from "../../types";
import { TeamIconDisplay } from "../icons/EventIcons";

type TotalScorePanelProps = {
  teams: Team[];
  rankings: TeamTotal[];
  totals: Partial<Record<TeamId, number>>;
};

const teamAccent: Record<TeamId, { bar: string; bg: string }> = {
  blue: { bar: "bg-team-blue", bg: "bg-[#eff6ff]" },
  red: { bar: "bg-team-red", bg: "bg-[#fef2f2]" },
  green: { bar: "bg-team-green", bg: "bg-[#f0fdf4]" },
  yellow: { bar: "bg-team-yellow", bg: "bg-[#fffbeb]" },
};

function RankCircle({ rank, tied }: { rank: number; tied?: boolean }) {
  const medal =
    rank === 1
      ? "bg-elit-pink text-white"
      : rank === 2
        ? "bg-[#e8e8ed] text-ink"
        : "bg-elit-pink-light text-elit-pink-dark border-2 border-elit-pink/30";

  return (
    <span
      className={`shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-black text-base
        ${medal}`}
      style={{ fontFamily: "var(--font-display)" }}
      title={tied ? "Delad placering" : undefined}
    >
      {rank}
    </span>
  );
}

function StandingRow({
  ranking,
  team,
  total,
  tied,
  compact,
}: {
  ranking: TeamTotal;
  team: Team;
  total: number;
  tied?: boolean;
  compact?: boolean;
}) {
  const accent = teamAccent[ranking.teamId];

  return (
    <motion.div
      layout
      className={`flex items-center gap-3 rounded-xl border-2 border-[#ebebef] overflow-hidden
        ${accent.bg} ${compact ? "px-3 py-2.5" : "px-3 py-3"}`}
    >
      <div className={`w-1 self-stretch shrink-0 rounded-full ${accent.bar}`} />
      <RankCircle rank={ranking.rank} tied={tied} />
      <div className="shrink-0 w-9 flex items-center justify-center">
        <TeamIconDisplay team={team} />
      </div>
      <div className="flex-1 min-w-0">
        <p
          className="text-bulky text-ink m-0 uppercase leading-tight truncate"
          style={{ fontSize: compact ? "0.8rem" : "0.85rem" }}
        >
          {team.name}
        </p>
      </div>
      <div className="shrink-0 text-right tabular-nums">
        <span
          className="text-bulky text-ink leading-none"
          style={{ fontSize: compact ? "2rem" : "2.5rem" }}
        >
          {total}
        </span>
        <span className="text-bulky text-ink-muted text-sm ml-0.5">p</span>
      </div>
    </motion.div>
  );
}

export function TotalScorePanel({
  teams,
  rankings,
  totals,
}: TotalScorePanelProps) {
  const getTeam = (id: TeamId) => teams.find((t) => t.id === id)!;

  const groups: { rank: number; items: TeamTotal[]; tied: boolean }[] = [];
  for (const r of rankings) {
    const last = groups[groups.length - 1];
    if (last && last.rank === r.rank) {
      last.items.push(r);
      last.tied = last.items.length > 1;
    } else {
      groups.push({ rank: r.rank, items: [r], tied: false });
    }
  }
  for (const g of groups) {
    g.tied = g.items.length > 1;
  }

  return (
    <aside className="w-[30%] min-w-[280px] max-w-[360px] shrink-0 flex flex-col elit-card overflow-hidden h-full">
      <div className="px-4 py-3.5 border-b-2 border-elit-pink/15 bg-elit-pink-soft">
        <h2 className="text-bulky text-elit-pink text-lg m-0 uppercase tracking-wide text-center">
          Total poäng
        </h2>
      </div>

      <div className="flex-1 p-3 flex flex-col gap-3 min-h-0 overflow-y-auto">
        {groups.map((group) => (
          <div key={group.rank} className="flex flex-col gap-2">
            {group.tied && (
              <div className="flex items-center justify-center gap-2 py-1">
                <span className="h-px flex-1 bg-elit-pink/25" />
                <span
                  className="px-3 py-1 rounded-full bg-elit-pink text-white text-xs font-black uppercase tracking-wider shrink-0"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  Lika · {group.rank}:a
                </span>
                <span className="h-px flex-1 bg-elit-pink/25" />
              </div>
            )}
            {group.items.map((ranking) => (
              <StandingRow
                key={ranking.teamId}
                ranking={ranking}
                team={getTeam(ranking.teamId)}
                total={totals[ranking.teamId] ?? 0}
                tied={group.tied}
                compact={groups.length > 2 && group.items.length > 1}
              />
            ))}
          </div>
        ))}
      </div>
    </aside>
  );
}
