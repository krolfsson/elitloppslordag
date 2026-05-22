export type TeamId = "blue" | "red" | "green" | "yellow";

export type Team = {
  id: TeamId;
  name: string;
  color: TeamId;
  emoji: string;
};

export type GameEvent = {
  id: string;
  name: string;
  emoji: string;
  scores: Partial<Record<TeamId, number>>;
};

export type Placement = 1 | 2 | 3 | 4 | "tie";

export type EventPlacement = Partial<Record<TeamId, Placement>>;

export type TeamTotal = {
  teamId: TeamId;
  total: number;
  rank: number;
  tiedWith: TeamId[];
};

export type EditTarget = {
  eventId: string;
  teamId: TeamId;
};

export type ToastMessage = {
  id: string;
  text: string;
  teamColor?: TeamId;
};

export type AppState = {
  teams: Team[];
  events: GameEvent[];
};
