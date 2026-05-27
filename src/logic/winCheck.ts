import type { Player } from "../types";

// Returns the winning side, or null if the game continues.
//
// Rules from spec §6:
//   - Civilians win when remaining_imposters == 0
//   - Imposters win when remaining_imposters >= remaining_civilians
//
// "Remaining" means not kicked. The check runs after every confirmed kick.
export function winCheck(
  players: Player[],
): "civilians" | "imposters" | null {
  const remaining = players.filter((p) => !p.isKicked);
  const imposters = remaining.filter((p) => p.isImposter).length;
  const civilians = remaining.length - imposters;

  if (imposters === 0) return "civilians";
  if (imposters >= civilians) return "imposters";
  return null;
}