import { useMemo, useState } from "react";
import type { GameEvent, Team, TeamId } from "../../types";
import type { EventPlacement } from "../../types";
import {
  EventEmojiDisplay,
  EventNumberBadge,
  TeamIconDisplay,
  TeamNumberBadge,
} from "../icons/EventIcons";
import { TeamCell } from "./TeamCell";

type ScoreboardTableProps = {
  events: GameEvent[];
  teams: Team[];
  getPlacements: (event: GameEvent) => EventPlacement;
  onCellClick: (eventId: string, teamId: TeamId) => void;
};

const teamHeaderBg: Record<TeamId, string> = {
  blue: "bg-[#eff6ff]",
  red: "bg-[#fef2f2]",
  green: "bg-[#f0fdf4]",
  yellow: "bg-[#fffbeb]",
};

export function ScoreboardTable({
  events,
  teams,
  getPlacements,
  onCellClick,
}: ScoreboardTableProps) {
  const [popKeys, setPopKeys] = useState<Record<string, number>>({});

  const placementsMap = useMemo(
    () => Object.fromEntries(events.map((e) => [e.id, getPlacements(e)])),
    [events, getPlacements],
  );

  const handleCellClick = (eventId: string, teamId: TeamId) => {
    const key = `${eventId}-${teamId}`;
    setPopKeys((prev) => ({ ...prev, [key]: (prev[key] ?? 0) + 1 }));
    onCellClick(eventId, teamId);
  };

  return (
    <div className="elit-card flex-1 min-w-0 flex flex-col overflow-hidden h-full">
      <div className="px-5 py-3 border-b-2 border-elit-pink/15 flex items-center justify-between">
        <h2 className="text-bulky text-xl text-ink m-0 uppercase">Poäng per gren</h2>
        <span className="text-label-pink">Klicka på en cell för att ändra</span>
      </div>

      <div className="flex flex-1 min-h-0 gap-0 p-4">
        {/* Events column */}
        <div className="flex flex-col shrink-0 w-[210px] lg:w-[240px] pr-4">
          <div className="h-14 shrink-0" aria-hidden />
          <div className="flex flex-col gap-2 flex-1">
            {events.map((event, index) => (
              <div
                key={event.id}
                className="flex items-center gap-3 min-h-[72px] border-b border-[#f5f5f7] last:border-0"
              >
                <EventNumberBadge n={index + 1} />
                <EventEmojiDisplay emoji={event.emoji} />
                <span
                  className="text-bulky text-ink text-sm lg:text-base leading-tight"
                >
                  {event.name}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Team columns */}
        {teams.map((team, teamIndex) => (
          <div
            key={team.id}
            className="flex-1 flex flex-col min-w-0 px-2"
          >
            <div
              className={`h-14 flex items-center justify-center gap-2 rounded-t-xl mb-2 ${teamHeaderBg[team.id]}`}
            >
              <TeamNumberBadge n={teamIndex + 1} size="sm" />
              <TeamIconDisplay team={team} />
              <span
                className="text-bulky text-ink text-sm lg:text-base uppercase"
              >
                {team.name}
              </span>
            </div>
            <div className="flex flex-col gap-2 flex-1">
              {events.map((event) => (
                <TeamCell
                  key={event.id}
                  score={event.scores[team.id] ?? 0}
                  placement={placementsMap[event.id]?.[team.id] ?? "tie"}
                  onClick={() => handleCellClick(event.id, team.id)}
                  popKey={popKeys[`${event.id}-${team.id}`] ?? 0}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
