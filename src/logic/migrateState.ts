import type { PersistedState } from "../types";

export const CURRENT_SCHEMA_VERSION = 1;

// Migrate a persisted blob from an older schema version to the current one.
//
// For M2 there's only version 1, so this is a no-op. The scaffold is here
// because adding the version field and the migration entry point AFTER
// shipping persistence is much more painful than starting with both.
//
// When the schema changes:
//   1. Bump CURRENT_SCHEMA_VERSION.
//   2. Add a case to the switch below that transforms the previous shape.
//   3. Fall through (no `break`) so chained migrations run in order.
//
// Returns the migrated state, or null if the blob is unrecoverable.
export function migrateState(
  blob: unknown,
): PersistedState | null {
  if (!blob || typeof blob !== "object") return null;

  // Cast to any for the migration switch — we're literally migrating shapes.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let state = blob as any;

  // Anything without a schemaVersion is pre-versioning — treat as v0 and
  // start migrating from there. Currently no v0→v1 migration to do.
  const version: number =
    typeof state.schemaVersion === "number" ? state.schemaVersion : 0;

  switch (version) {
    case 0:
      state = { ...state, schemaVersion: 1 };
    // falls through
    case 1:
      // current; nothing to do
      break;
    default:
      // Newer-than-current version. Could happen if a user downgrades.
      // Safest move: reject and let the app start fresh.
      return null;
  }

  // Minimal shape check on the result. If anything required is missing,
  // bail rather than crashing later.
  if (
    typeof state.toggleImpostersKnowEachOther !== "boolean" ||
    typeof state.lastPlayerCount !== "number" ||
    typeof state.lastImposterCount !== "number" ||
    !Array.isArray(state.lastPlayerNames) ||
    !Array.isArray(state.recentPairIds)
  ) {
    return null;
  }

  return state as PersistedState;
}