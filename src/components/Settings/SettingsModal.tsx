import { AnimatePresence, motion } from "framer-motion";
import { Plus, Trash2, X } from "lucide-react";
import type { GameEvent, Team, TeamId } from "../../types";
import {
  DEFAULT_EVENT_EMOJI,
  DEFAULT_EVENT_EMOJI_FALLBACK,
  DEFAULT_TEAM_EMOJI,
} from "../../data/defaults";
import { MAX_TEAMS, MIN_TEAMS } from "../../utils/teams";
import { useConfirm } from "../../context/ConfirmContext";
import { EmojiPickerField } from "../emoji/EmojiPickerField";
import { PinkButton } from "../ui/PinkButton";

type SettingsModalProps = {
  open: boolean;
  onClose: () => void;
  teams: Team[];
  events: GameEvent[];
  onRenameTeam: (id: TeamId, name: string) => void;
  onSetTeamEmoji: (id: TeamId, emoji: string) => void;
  onAddTeam: () => void;
  onRemoveTeam: (id: TeamId) => void;
  canAddTeam: boolean;
  canRemoveTeam: boolean;
  onRenameEvent: (id: string, name: string) => void;
  onSetEventEmoji: (id: string, emoji: string) => void;
  onAddEvent: () => void;
  onRemoveEvent: (id: string) => void;
  canRemoveEvent: boolean;
};

export function SettingsModal({
  open,
  onClose,
  teams,
  events,
  onRenameTeam,
  onSetTeamEmoji,
  onAddTeam,
  onRemoveTeam,
  canAddTeam,
  canRemoveTeam,
  onRenameEvent,
  onSetEventEmoji,
  onAddEvent,
  onRemoveEvent,
  canRemoveEvent,
}: SettingsModalProps) {
  const { confirm } = useConfirm();

  if (!open) return null;

  const handleRemoveTeam = async (team: Team) => {
    if (!canRemoveTeam) return;
    const ok = await confirm({
      title: "Ta bort lag?",
      message: `"${team.name}" tas bort och alla poäng för laget försvinner.`,
      confirmLabel: "Ta bort",
      cancelLabel: "Behåll",
      variant: "danger",
    });
    if (ok) onRemoveTeam(team.id);
  };

  const handleRemoveEvent = async (event: GameEvent) => {
    if (!canRemoveEvent) return;
    const ok = await confirm({
      title: "Ta bort gren?",
      message: `"${event.name}" tas bort och alla poäng för grenen försvinner.`,
      confirmLabel: "Ta bort",
      cancelLabel: "Behåll",
      variant: "danger",
    });
    if (ok) onRemoveEvent(event.id);
  };

  const eventEmojiFallback = (event: GameEvent) =>
    DEFAULT_EVENT_EMOJI[event.id] ?? DEFAULT_EVENT_EMOJI_FALLBACK;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="fixed inset-0 z-[7000] flex items-center justify-center bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          onClick={(e) => e.stopPropagation()}
          className="elit-card w-full max-w-lg mx-4 p-6 max-h-[85vh] overflow-y-auto"
        >
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-bulky text-2xl text-elit-pink m-0 uppercase">
              Inställningar
            </h3>
            <button
              type="button"
              onClick={onClose}
              className="interactive w-10 h-10 rounded-full bg-[#f5f5f7] flex items-center justify-center"
            >
              <X size={22} />
            </button>
          </div>

          <section className="mb-6">
            <h4 className="text-label-pink mb-3">Lag</h4>
            <div className="flex flex-col gap-3">
              {teams.map((team, index) => (
                <div
                  key={team.id}
                  className="rounded-xl border-2 border-[#e8e8ed] bg-white p-3 flex flex-col gap-3"
                >
                  <div className="flex items-center gap-2">
                    <span className="elit-badge w-8 h-8 text-sm shrink-0">
                      {index + 1}
                    </span>
                    <input
                      defaultValue={team.name}
                      onBlur={(e) => onRenameTeam(team.id, e.target.value)}
                      className="flex-1 min-w-0 px-3 py-2 rounded-xl border-2 border-[#e8e8ed] text-ink font-bold text-lg
                        focus:border-elit-pink focus:outline-none focus:ring-2 focus:ring-elit-pink/20"
                      style={{ fontFamily: "var(--font-display)" }}
                    />
                    <motion.button
                      type="button"
                      whileHover={{ scale: canRemoveTeam ? 1.08 : 1 }}
                      onClick={() => handleRemoveTeam(team)}
                      disabled={!canRemoveTeam}
                      title={
                        canRemoveTeam
                          ? "Ta bort lag"
                          : `Minst ${MIN_TEAMS} lag måste finnas kvar`
                      }
                      className={`interactive shrink-0 w-10 h-10 rounded-xl flex items-center justify-center transition-colors
                        ${
                          canRemoveTeam
                            ? "text-[#ef4444] hover:bg-[#fef2f2]"
                            : "text-ink-muted/40 cursor-not-allowed"
                        }`}
                    >
                      <Trash2 size={20} />
                    </motion.button>
                  </div>
                  <EmojiPickerField
                    key={`team-${team.id}-${team.emoji}`}
                    value={team.emoji}
                    fallback={DEFAULT_TEAM_EMOJI[team.id]}
                    onChange={(emoji) => onSetTeamEmoji(team.id, emoji)}
                    label="Lag-emoji"
                  />
                </div>
              ))}
            </div>
            {!canRemoveTeam && (
              <p className="text-xs text-ink-muted mt-2 m-0 font-semibold">
                Minst {MIN_TEAMS} lag måste finnas kvar.
              </p>
            )}
            {canAddTeam ? (
              <PinkButton
                icon={<Plus size={20} />}
                onClick={onAddTeam}
                className="w-full mt-3"
              >
                Lägg till lag
              </PinkButton>
            ) : (
              <p className="text-xs text-ink-muted mt-3 m-0 font-semibold">
                Högst {MAX_TEAMS} lag tillåts.
              </p>
            )}
          </section>

          <section className="mb-4">
            <h4 className="text-label-pink mb-3">Grenar</h4>
            <div className="flex flex-col gap-3">
              {events.map((event, index) => (
                <div
                  key={event.id}
                  className="rounded-xl border-2 border-[#e8e8ed] bg-white p-3 flex flex-col gap-3"
                >
                  <div className="flex items-center gap-2">
                    <span className="elit-badge w-8 h-8 text-sm shrink-0">
                      {index + 1}
                    </span>
                    <input
                      defaultValue={event.name}
                      onBlur={(e) => onRenameEvent(event.id, e.target.value)}
                      className="flex-1 min-w-0 px-3 py-2 rounded-xl border-2 border-[#e8e8ed] text-ink font-bold
                        focus:border-elit-pink focus:outline-none"
                      style={{ fontFamily: "var(--font-display)" }}
                    />
                    <motion.button
                      type="button"
                      whileHover={{ scale: canRemoveEvent ? 1.08 : 1 }}
                      onClick={() => handleRemoveEvent(event)}
                      disabled={!canRemoveEvent}
                      title={
                        canRemoveEvent
                          ? "Ta bort gren"
                          : "Minst en gren måste finnas kvar"
                      }
                      className={`interactive shrink-0 w-10 h-10 rounded-xl flex items-center justify-center transition-colors
                        ${
                          canRemoveEvent
                            ? "text-[#ef4444] hover:bg-[#fef2f2]"
                            : "text-ink-muted/40 cursor-not-allowed"
                        }`}
                    >
                      <Trash2 size={20} />
                    </motion.button>
                  </div>
                  <EmojiPickerField
                    key={`event-${event.id}-${event.emoji}`}
                    value={event.emoji}
                    fallback={eventEmojiFallback(event)}
                    onChange={(emoji) => onSetEventEmoji(event.id, emoji)}
                    label="Gren-emoji (visas i poängtabellen)"
                  />
                </div>
              ))}
            </div>
            {!canRemoveEvent && (
              <p className="text-xs text-ink-muted mt-2 m-0 font-semibold">
                Minst en gren måste finnas kvar.
              </p>
            )}
          </section>

          <PinkButton
            icon={<Plus size={20} />}
            onClick={onAddEvent}
            className="w-full"
          >
            Lägg till gren
          </PinkButton>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
