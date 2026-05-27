// Shared types for the whole app. Keep this file dependency-free.

export type CategoryName =
  | "Generic"
  | "Animals"
  | "Food & Drink"
  | "History & Famous People"
  | "Places & Travel"
  | "Spicy";

// "random" is a runtime selector, not a stored category. Tracked here as a
// separate string so the game-setup flow can carry it through without us
// pretending it's a 7th category in the data.
export type CategorySelection = CategoryName | "random";

export interface WordPair {
  id: string;              // stable, e.g. "ani-07". Used for recent-pair soft-bias.
  civilianWord: string;
  imposterWord: string;
}

export interface Category {
  name: CategoryName;
  pairs: WordPair[];
}

export interface Player {
  id: string;              // stable internal ID, assigned at Name Entry
  name: string;            // up to 20 chars
  isImposter: boolean;     // assigned at Start Game
  isKicked: boolean;
}

// The "resolved" pair for a game — civ/imp sides already assigned.
// Note: civilianWord and imposterWord here may differ from the pair's
// declared sides in wordPairs.ts, since we randomize which side is which
// per round.
export interface ResolvedPair {
  pairId: string;
  civilianWord: string;
  imposterWord: string;
}

export type GamePhase = "reveal" | "kick" | "won";

export interface GameState {
  category: CategorySelection;
  pair: ResolvedPair;
  players: Player[];
  playerOrder: string[];          // player IDs in reveal/pass order
  currentRevealIndex: number;     // index into playerOrder
  phase: GamePhase;
  winner: "civilians" | "imposters" | null;
  // For resume: the route the user was on when the game was last interacted with.
  // Set on every navigate; on resume, we navigate here.
  currentRoute: string;
}

export interface PersistedState {
  schemaVersion: number;
  toggleImpostersKnowEachOther: boolean;
  lastPlayerCount: number;
  lastImposterCount: number;
  lastPlayerNames: string[];
  recentPairIds: string[];        // rolling last 5
  gameInProgress: GameState | null;
}