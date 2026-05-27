import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { PersistedState, GameState } from "../types";
import { CURRENT_SCHEMA_VERSION, migrateState } from "../logic/migrateState";

// Defaults for first-ever launch.
const DEFAULTS: PersistedState = {
  schemaVersion: CURRENT_SCHEMA_VERSION,
  toggleImpostersKnowEachOther: false,
  lastPlayerCount: 5,
  lastImposterCount: 1,
  lastPlayerNames: [],
  recentPairIds: [],
  gameInProgress: null,
};

interface SettingsActions {
  setToggleImpostersKnowEachOther: (v: boolean) => void;
  setLastPlayerCount: (n: number) => void;
  setLastImposterCount: (n: number) => void;
  setLastPlayerNames: (names: string[]) => void;
  pushRecentPairId: (id: string) => void;
  setGameInProgress: (g: GameState | null) => void;
  clearSavedNames: () => void;
}

export const useSettingsStore = create<PersistedState & SettingsActions>()(
  persist(
    (set) => ({
      ...DEFAULTS,

      setToggleImpostersKnowEachOther: (v) =>
        set({ toggleImpostersKnowEachOther: v }),

      setLastPlayerCount: (n) => set({ lastPlayerCount: n }),

      setLastImposterCount: (n) => set({ lastImposterCount: n }),

      setLastPlayerNames: (names) => set({ lastPlayerNames: names }),

      // Push a new pair ID onto the recent list, drop the oldest if over 5.
      pushRecentPairId: (id) =>
        set((state) => {
          const next = [id, ...state.recentPairIds.filter((x) => x !== id)];
          return { recentPairIds: next.slice(0, 5) };
        }),

      setGameInProgress: (g) => set({ gameInProgress: g }),

      clearSavedNames: () => set({ lastPlayerNames: [] }),
    }),
    {
      name: "imposter-settings",
      storage: createJSONStorage(() => localStorage),
      version: CURRENT_SCHEMA_VERSION,
      // Zustand calls this when the stored version differs from the current.
      // We delegate to our migrateState — same shape it expects.
      migrate: (persisted, _version) => {
        const migrated = migrateState(persisted);
        return migrated ?? DEFAULTS;
      },
    },
  ),
);