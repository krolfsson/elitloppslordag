export type TeamId = "blue" | "red" | "green";

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
  scores: Record<TeamId, number>;
};

export type Placement = 1 | 2 | 3 | "tie";

export type EventPlacement = Record<TeamId, Placement>;

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
