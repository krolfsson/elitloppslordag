import { useCallback, useEffect, useMemo, useState } from "react";
import {
  DEFAULT_EVENT_EMOJI_FALLBACK,
  DEFAULT_EVENTS,
  DEFAULT_TEAM_EMOJI,
  DEFAULT_TEAMS,
  LEGACY_STORAGE_KEY,
  STORAGE_KEY,
  normalizeEvent,
  normalizeTeam,
} from "../data/defaults";
import { normalizeEmoji } from "../utils/emoji";
import type {
  AppState,
  EditTarget,
  GameEvent,
  Team,
  TeamId,
  ToastMessage,
} from "../types";
import {
  calculateEventPlacements,
  calculateOverallRanking,
  calculateTotals,
  clampScore,
} from "../utils/scoring";

function loadState(): Partial<AppState> | null {
  try {
    const raw =
      localStorage.getItem(STORAGE_KEY) ??
      localStorage.getItem(LEGACY_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as Partial<AppState>;
  } catch {
    return null;
  }
}

function playScoreSound() {
  try {
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.value = 880;
    osc.type = "sine";
    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.15);
  } catch {
    /* audio not available */
  }
}

export function useGameState() {
  const saved = loadState();

  const [teams, setTeams] = useState<Team[]>(() =>
    (saved?.teams ?? DEFAULT_TEAMS).map((t) =>
      normalizeTeam(t as Parameters<typeof normalizeTeam>[0]),
    ),
  );
  const [events, setEvents] = useState<GameEvent[]>(() =>
    (saved?.events ?? DEFAULT_EVENTS).map((e, i) =>
      normalizeEvent(e as Parameters<typeof normalizeEvent>[0], i),
    ),
  );
  const [editTarget, setEditTarget] = useState<EditTarget | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);

  const totals = useMemo(() => calculateTotals(events), [events]);
  const rankings = useMemo(() => calculateOverallRanking(totals), [totals]);

  const saveToStorage = useCallback(() => {
    const state: AppState = { teams, events };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [teams, events]);

  useEffect(() => {
    saveToStorage();
  }, [saveToStorage]);

  const addToast = useCallback((text: string, teamColor?: TeamId) => {
    const id = crypto.randomUUID();
    setToasts((prev) => [...prev, { id, text, teamColor }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 2500);
  }, []);

  const updateScore = useCallback(
    (eventId: string, teamId: TeamId, newScore: number) => {
      const team = teams.find((t) => t.id === teamId);
      setEvents((prev) =>
        prev.map((e) =>
          e.id === eventId
            ? { ...e, scores: { ...e.scores, [teamId]: clampScore(newScore) } }
            : e,
        ),
      );
      playScoreSound();
      addToast(`${team?.name ?? teamId}: ${newScore} poäng!`, teamId);
    },
    [teams, addToast],
  );

  const adjustScore = useCallback(
    (eventId: string, teamId: TeamId, delta: number) => {
      const event = events.find((e) => e.id === eventId);
      if (!event) return;
      const current = event.scores[teamId];
      const next = clampScore(current + delta);
      const team = teams.find((t) => t.id === teamId);
      setEvents((prev) =>
        prev.map((e) =>
          e.id === eventId
            ? { ...e, scores: { ...e.scores, [teamId]: next } }
            : e,
        ),
      );
      playScoreSound();
      const sign = delta > 0 ? `+${delta}` : `${delta}`;
      addToast(`${team?.name ?? teamId} ${sign}!`, teamId);
    },
    [events, teams, addToast],
  );

  const resetAllScores = useCallback(() => {
    setEvents((prev) =>
      prev.map((e) => ({
        ...e,
        scores: { blue: 0, red: 0, green: 0 },
      })),
    );
    addToast("Alla poäng nollställda!");
  }, [addToast]);

  const renameTeam = useCallback((teamId: TeamId, name: string) => {
    setTeams((prev) =>
      prev.map((t) => (t.id === teamId ? { ...t, name: name.trim() || t.name } : t)),
    );
  }, []);

  const setTeamEmoji = useCallback(
    (teamId: TeamId, emoji: string) => {
      const normalized = normalizeEmoji(emoji, DEFAULT_TEAM_EMOJI[teamId]);
      setTeams((prev) =>
        prev.map((t) => (t.id === teamId ? { ...t, emoji: normalized } : t)),
      );
      const team = teams.find((t) => t.id === teamId);
      addToast(`${team?.name ?? "Lag"}: ${normalized}`);
    },
    [teams, addToast],
  );

  const renameEvent = useCallback((eventId: string, name: string) => {
    setEvents((prev) =>
      prev.map((e) =>
        e.id === eventId ? { ...e, name: name.trim() || e.name } : e,
      ),
    );
  }, []);

  const setEventEmoji = useCallback(
    (eventId: string, emoji: string) => {
      const normalized = normalizeEmoji(emoji, DEFAULT_EVENT_EMOJI_FALLBACK);
      setEvents((prev) =>
        prev.map((e) => (e.id === eventId ? { ...e, emoji: normalized } : e)),
      );
      const event = events.find((e) => e.id === eventId);
      addToast(`${event?.name ?? "Gren"}: ${normalized}`);
    },
    [events, addToast],
  );

  const MIN_EVENTS = 1;

  const addEvent = useCallback(() => {
    const id = `gren-${Date.now()}`;
    setEvents((prev) => [
      ...prev,
      {
        id,
        name: `Gren ${prev.length + 1}`,
        emoji: DEFAULT_EVENT_EMOJI_FALLBACK,
        scores: { blue: 0, red: 0, green: 0 },
      },
    ]);
    addToast("Ny gren tillagd!");
  }, [addToast]);

  const removeEvent = useCallback(
    (eventId: string) => {
      const removed = events.find((e) => e.id === eventId);
      if (!removed) return;
      if (events.length <= MIN_EVENTS) {
        addToast("Minst en gren måste finnas kvar!");
        return;
      }
      setEvents((prev) => prev.filter((e) => e.id !== eventId));
      setEditTarget((t) => (t?.eventId === eventId ? null : t));
      addToast(`"${removed.name}" borttagen!`);
    },
    [events, addToast],
  );

  const getPlacements = useCallback(
    (event: GameEvent) => calculateEventPlacements(event),
    [],
  );

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  }, []);

  return {
    teams,
    events,
    editTarget,
    setEditTarget,
    toasts,
    settingsOpen,
    setSettingsOpen,
    helpOpen,
    setHelpOpen,
    totals,
    rankings,
    updateScore,
    adjustScore,
    resetAllScores,
    renameTeam,
    setTeamEmoji,
    renameEvent,
    setEventEmoji,
    addEvent,
    removeEvent,
    getPlacements,
    toggleFullscreen,
  };
}
