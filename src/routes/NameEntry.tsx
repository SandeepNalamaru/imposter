import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useGameStore } from "../store/gameStore";
import { useSettingsStore } from "../store/settingsStore";
import type { Player } from "../types";

const MAX_NAME_LENGTH = 20;

// IDs are tied to row position. The id pattern is "p-<index>" so backing
// out, editing a name, and coming forward again keeps the same ID — which
// is what Reorder needs to preserve order across name edits (spec §13.4).
// Adding/removing players changes the slot count and naturally resets.
function rowId(index: number): string {
  return `p-${index}`;
}

export default function NameEntry() {
  const navigate = useNavigate();
  const playerCount = useSettingsStore((s) => s.lastPlayerCount);
  const lastPlayerNames = useSettingsStore((s) => s.lastPlayerNames);
  const setLastPlayerNames = useSettingsStore((s) => s.setLastPlayerNames);
  const setPlayers = useGameStore((s) => s.setPlayers);

  // Defensive: if the user hit /names with no prior setup (e.g. typed it
  // into the URL bar), kick back to Home.
  const category = useGameStore((s) => s.category);
  useEffect(() => {
    if (!category) navigate("/", { replace: true });
  }, [category, navigate]);

  // Build the initial name array from persisted names, padded/truncated to
  // playerCount. Pre-fill rule from spec §13.3: "If last game had more names
  // than current N, use the first N. If fewer, pre-fill what we have and
  // leave the rest blank."
  const [names, setNames] = useState<string[]>(() => {
    const padded = [...lastPlayerNames];
    while (padded.length < playerCount) padded.push("");
    return padded.slice(0, playerCount);
  });

  // If playerCount changes while we're on this screen (shouldn't happen
  // via normal flow, but defensive), resize the names array.
  useEffect(() => {
    setNames((prev) => {
      if (prev.length === playerCount) return prev;
      const next = [...prev];
      while (next.length < playerCount) next.push("");
      return next.slice(0, playerCount);
    });
  }, [playerCount]);

  const [showValidationError, setShowValidationError] = useState<string | null>(null);

  // Validation. Returns the first issue (for tap-on-disabled-Next feedback),
  // or null if everything's good.
  const validationError = useMemo((): string | null => {
    const trimmed = names.map((n) => n.trim());

    // Empty check
    const firstEmpty = trimmed.findIndex((n) => n.length === 0);
    if (firstEmpty !== -1) {
      return `Player ${firstEmpty + 1} is empty`;
    }

    // Duplicate check (case-insensitive)
    const lowered = trimmed.map((n) => n.toLowerCase());
    for (let i = 0; i < lowered.length; i++) {
      const dupIdx = lowered.indexOf(lowered[i], i + 1);
      if (dupIdx !== -1) {
        return `Two players share the name ${trimmed[i]}`;
      }
    }

    return null;
  }, [names]);

  const handleChange = (index: number, value: string) => {
    // 20-char cap is enforced at the maxLength attribute level too, but
    // belt-and-suspenders here for IME and paste cases.
    const capped = value.slice(0, MAX_NAME_LENGTH);
    setNames((prev) => {
      const next = [...prev];
      next[index] = capped;
      return next;
    });
    // Clear any showing error as soon as they type — gives them quiet feedback.
    if (showValidationError) setShowValidationError(null);
  };

  const handleClearAll = () => {
    setNames(Array(playerCount).fill(""));
    setShowValidationError(null);
  };

  const handleNext = () => {
    if (validationError) {
      // Tap-on-disabled-Next: surface the issue.
      setShowValidationError(validationError);
      return;
    }
    const trimmed = names.map((n) => n.trim());
    // Persist for next game's pre-fill.
    setLastPlayerNames(trimmed);
    // Build Player objects and stash on gameStore. isImposter / isKicked
    // get set later — defaults here are fine.
    const players: Player[] = trimmed.map((name, i) => ({
      id: rowId(i),
      name,
      isImposter: false,
      isKicked: false,
    }));
    setPlayers(players);
    navigate("/reorder");
  };

  return (
    <div className="min-h-screen flex flex-col px-4 py-6 max-w-md mx-auto">
      <div className="flex items-center mb-6">
        <Link to="/setup" className="text-blue-600">
          ← Back
        </Link>
      </div>

      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">Who's playing?</h2>
        <button
          onClick={handleClearAll}
          className="text-sm text-gray-500 underline"
        >
          Clear all
        </button>
      </div>

      <div className="flex flex-col gap-2">
        {names.map((name, i) => (
          <input
            key={rowId(i)}
            type="text"
            inputMode="text"
            enterKeyHint="next"
            maxLength={MAX_NAME_LENGTH}
            placeholder={`Player ${i + 1}`}
            value={name}
            onChange={(e) => handleChange(i, e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg text-base"
          />
        ))}
      </div>

      {showValidationError && (
        <p className="text-red-600 text-sm mt-3 text-center">
          {showValidationError}
        </p>
      )}

      <button
        onClick={handleNext}
        disabled={!!validationError}
        className="mt-auto w-full py-4 bg-blue-600 text-white rounded-lg text-lg font-medium disabled:opacity-40 active:scale-[0.98] transition"
      >
        Next
      </button>
    </div>
  );
}