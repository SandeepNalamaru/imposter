// src/lib/sizing.ts
// Tier-based row sizing for player lists (NameEntry, Reorder).
// Same N → same tier across both screens for visual consistency.
//
// Tiers picked for "comfortable padding even if some scrolling kicks in"
// per Conv 7 design discussion. Compact tier (9-12) still well above the
// 44/48px touch-target minimum.

export interface ListSizing {
  rowClass: string;   // vertical padding inside each row
  textClass: string;  // font size for the name text
  gapClass: string;   // gap between rows
}

export function sizingFor(n: number): ListSizing {
  if (n <= 5) {
    // Spacious: 3-5 players
    return {
      rowClass: "py-5",
      textClass: "text-2xl",
      gapClass: "gap-4",
    };
  }
  if (n <= 8) {
    // Normal: 6-8 players
    return {
      rowClass: "py-4",
      textClass: "text-xl",
      gapClass: "gap-3",
    };
  }
  // Compact: 9-12 players (scrollable, still comfortable)
  return {
    rowClass: "py-3",
    textClass: "text-lg",
    gapClass: "gap-2",
  };
}