import type { CategorySelection, Player, ResolvedPair, WordPair } from "../types";
import { ALL_PAIRS, CATEGORIES } from "../data/wordPairs";

// Picks a pair from the chosen category (or all 90 for "random"), excluding
// any pair IDs in recentPairIds. Then randomly assigns which side of the
// pair is the civilian word and which is the imposter word.
//
// Pure function. Caller is responsible for updating the recentPairIds list
// after this returns.
export function pickPair(
  category: CategorySelection,
  recentPairIds: string[],
  rng: () => number = Math.random,
): ResolvedPair {
  const pool: WordPair[] =
    category === "random"
      ? ALL_PAIRS
      : CATEGORIES.find((c) => c.name === category)?.pairs ?? [];

  if (pool.length === 0) {
    throw new Error(`No pairs found for category: ${category}`);
  }

  // Exclude recent pairs. If recents have eaten the entire pool (shouldn't
  // happen — every category has 15 pairs, recents cap at 5), fall back to
  // the full pool rather than crashing.
  const filtered = pool.filter((p) => !recentPairIds.includes(p.id));
  const candidates = filtered.length > 0 ? filtered : pool;

  const chosen = candidates[Math.floor(rng() * candidates.length)];

  // Randomly flip which side is which.
  const flip = rng() < 0.5;
  return {
    pairId: chosen.id,
    civilianWord: flip ? chosen.imposterWord : chosen.civilianWord,
    imposterWord: flip ? chosen.civilianWord : chosen.imposterWord,
  };
}

// Returns a NEW player array with isImposter set on K randomly chosen players.
// Does not mutate the input. Pure RNG — no anti-streak logic, per spec §8.
export function assignImposters(
  players: Player[],
  imposterCount: number,
  rng: () => number = Math.random,
): Player[] {
  if (imposterCount < 0 || imposterCount > players.length) {
    throw new Error(
      `Invalid imposterCount ${imposterCount} for ${players.length} players`,
    );
  }

  // Fisher–Yates shuffle of indices, take first K.
  const indices = players.map((_, i) => i);
  for (let i = indices.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [indices[i], indices[j]] = [indices[j], indices[i]];
  }
  const imposterIndices = new Set(indices.slice(0, imposterCount));

  return players.map((p, i) => ({
    ...p,
    isImposter: imposterIndices.has(i),
    isKicked: false,
  }));
}