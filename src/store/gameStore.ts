import { create } from "zustand";
import type {
  CategorySelection,
  GamePhase,
  GameState,
  Player,
  ResolvedPair,
} from "../types";
import { pickPair, assignImposters } from "../logic/assignRoles";
import { winCheck } from "../logic/winCheck";
import { useSettingsStore } from "./settingsStore";

// gameStore holds the ACTIVE game. It's intentionally NOT wrapped in persist —
// the snapshot for "Resume game?" lives in settingsStore.gameInProgress and is
// synced via setGameInProgress() at meaningful state transitions.
//
// On a fresh load, this store starts empty. If there's a gameInProgress in
// settingsStore and the user says Yes to resume, App.tsx will hydrate this
// store from that snapshot.

interface GameStoreState {
  category: CategorySelection | null;
  pair: ResolvedPair | null;
  players: Player[];
  playerOrder: string[];
  currentRevealIndex: number;
  phase: GamePhase | null;
  winner: "civilians" | "imposters" | null;
  currentRoute: string;
}

interface GameStoreActions {
  // Setup phase
  setCategory: (c: CategorySelection) => void;
  setPlayers: (players: Player[]) => void;
  setPlayerOrder: (ids: string[]) => void;

  // Start the actual game. Picks the pair, assigns imposters, snapshots
  // to settingsStore.gameInProgress, sets phase to "reveal".
  startGame: (imposterCount: number) => void;

  // Reveal phase

  advanceReveal: () => void;            // bump currentRevealIndex
  retreatReveal: () => void;            // decrement currentRevealIndex (cross-player Back)
  startKickPhase: () => void;           // phase: reveal → kick

  // Kick phase. Returns the winner if the kick ended the game, else null.
  kickPlayer: (playerId: string) => "civilians" | "imposters" | null;

  // Resume / reset
  hydrateFromSnapshot: (snapshot: GameState) => void;
  setCurrentRoute: (route: string) => void;
  resetGame: () => void;
}

const INITIAL_STATE: GameStoreState = {
  category: null,
  pair: null,
  players: [],
  playerOrder: [],
  currentRevealIndex: 0,
  phase: null,
  winner: null,
  currentRoute: "/",
};

// Helper: snapshot the current store state into settingsStore.gameInProgress.
// Called at every meaningful transition so resume always has a fresh blob.
// Only snapshots when there's a real game in flight (phase set, players exist).
function snapshotToSettings(state: GameStoreState) {
  if (!state.phase || !state.pair || state.players.length === 0) {
    useSettingsStore.getState().setGameInProgress(null);
    return;
  }
  const snapshot: GameState = {
    category: state.category ?? "random",
    pair: state.pair,
    players: state.players,
    playerOrder: state.playerOrder,
    currentRevealIndex: state.currentRevealIndex,
    phase: state.phase,
    winner: state.winner,
    currentRoute: state.currentRoute,
  };
  useSettingsStore.getState().setGameInProgress(snapshot);
}

export const useGameStore = create<GameStoreState & GameStoreActions>()(
  (set, get) => ({
    ...INITIAL_STATE,

    setCategory: (c) => set({ category: c }),

    setPlayers: (players) => set({ players }),

    setPlayerOrder: (ids) => set({ playerOrder: ids }),

    startGame: (imposterCount) => {
      const { category, players } = get();
      if (!category) throw new Error("startGame called with no category");

      const settings = useSettingsStore.getState();

      // 1. Pick the pair (uses soft-bias against recent pairs).
      const pair = pickPair(category, settings.recentPairIds);

      // 2. Update recent pairs.
      settings.pushRecentPairId(pair.pairId);

      // 3. Assign imposters.
      const playersWithRoles = assignImposters(players, imposterCount);

      // 4. If no explicit order set, default to entry order.
      const order =
        get().playerOrder.length === playersWithRoles.length
          ? get().playerOrder
          : playersWithRoles.map((p) => p.id);

      set({
        pair,
        players: playersWithRoles,
        playerOrder: order,
        currentRevealIndex: 0,
        phase: "reveal",
        winner: null,
      });

      snapshotToSettings(get());
    },

    advanceReveal: () => {
      set((s) => ({ currentRevealIndex: s.currentRevealIndex + 1 }));
      snapshotToSettings(get());
    },

    retreatReveal: () => {
      // Guard against going below 0. The Reveal component already gates
      // the Back button on Player 1's Pre-reveal so this should be
      // unreachable, but belt-and-suspenders here keeps the store sane.
      set((s) => ({
        currentRevealIndex: Math.max(0, s.currentRevealIndex - 1),
      }));
      snapshotToSettings(get());
    },

    startKickPhase: () => {
      set({ phase: "kick" });
      snapshotToSettings(get());
    },

    kickPlayer: (playerId) => {
      const updated = get().players.map((p) =>
        p.id === playerId ? { ...p, isKicked: true } : p,
      );
      const winner = winCheck(updated);

      set({
        players: updated,
        phase: winner ? "won" : "kick",
        winner,
      });

      // If the game just ended, clear the resume snapshot — Win screen is the
      // clean exit. If it didn't, refresh the snapshot.
      if (winner) {
        useSettingsStore.getState().setGameInProgress(null);
      } else {
        snapshotToSettings(get());
      }

      return winner;
    },

    hydrateFromSnapshot: (snapshot) => {
      set({
        category: snapshot.category,
        pair: snapshot.pair,
        players: snapshot.players,
        playerOrder: snapshot.playerOrder,
        currentRevealIndex: snapshot.currentRevealIndex,
        phase: snapshot.phase,
        winner: snapshot.winner,
        currentRoute: snapshot.currentRoute,
      });
    },

    setCurrentRoute: (route) => {
      set({ currentRoute: route });
      // Only snapshot if there's a game in flight; setCurrentRoute fires on
      // every screen mount, including the Home screen pre-game.
      const s = get();
      if (s.phase && s.phase !== "won") {
        snapshotToSettings(s);
      }
    },

    resetGame: () => {
      set(INITIAL_STATE);
      useSettingsStore.getState().setGameInProgress(null);
    },
  }),
);