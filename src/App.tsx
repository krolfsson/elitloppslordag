import { useCallback } from "react";
import { CustomCursor } from "./components/CustomCursor/CustomCursor";
import { ControlBar } from "./components/ControlBar/ControlBar";
import { Header } from "./components/Header/Header";
import { HelpModal } from "./components/Help/HelpModal";
import { ScoreEditModal } from "./components/ScoreEditModal/ScoreEditModal";
import { ScoreboardTable } from "./components/Scoreboard/ScoreboardTable";
import { SettingsModal } from "./components/Settings/SettingsModal";
import { ToastStack } from "./components/Toast/ToastStack";
import { TotalScorePanel } from "./components/TotalScore/TotalScorePanel";
import { useGameState } from "./hooks/useGameState";
import type { TeamId } from "./types";

function App() {
  const {
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
  } = useGameState();

  const handleCellClick = useCallback(
    (eventId: string, teamId: TeamId) => {
      setEditTarget({ eventId, teamId });
    },
    [setEditTarget],
  );

  const editEvent = editTarget
    ? events.find((e) => e.id === editTarget.eventId) ?? null
    : null;
  const editTeam = editTarget
    ? teams.find((t) => t.id === editTarget.teamId) ?? null
    : null;

  return (
    <div className="app-cursor h-full w-full bg-[#f5f5f7] flex flex-col overflow-hidden">
      <CustomCursor />
      <ToastStack toasts={toasts} />

      <Header
        onSettings={() => setSettingsOpen(true)}
        onHelp={() => setHelpOpen(true)}
      />

      <main className="flex-1 flex gap-4 px-5 pb-2 min-h-0">
        <ScoreboardTable
          events={events}
          teams={teams}
          getPlacements={getPlacements}
          onCellClick={handleCellClick}
        />
        <TotalScorePanel teams={teams} rankings={rankings} totals={totals} />
      </main>

      <ControlBar onReset={resetAllScores} onFullscreen={toggleFullscreen} />

      <ScoreEditModal
        target={editTarget}
        event={editEvent}
        team={editTeam}
        onClose={() => setEditTarget(null)}
        onAdjust={(delta) => {
          if (editTarget) adjustScore(editTarget.eventId, editTarget.teamId, delta);
        }}
        onSet={(score) => {
          if (editTarget) updateScore(editTarget.eventId, editTarget.teamId, score);
        }}
        onReset={() => {
          if (editTarget) updateScore(editTarget.eventId, editTarget.teamId, 0);
        }}
      />

      <SettingsModal
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        teams={teams}
        events={events}
        onRenameTeam={renameTeam}
        onSetTeamEmoji={setTeamEmoji}
        onRenameEvent={renameEvent}
        onSetEventEmoji={setEventEmoji}
        onAddEvent={addEvent}
        onRemoveEvent={removeEvent}
        canRemoveEvent={events.length > 1}
      />

      <HelpModal open={helpOpen} onClose={() => setHelpOpen(false)} />
    </div>
  );
}

export default App;
