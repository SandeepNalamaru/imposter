import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useGameStore } from "../store/gameStore";
import { useSettingsStore } from "../store/settingsStore";
import { sizingFor } from "../lib/sizing";
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

  // Refs array for Enter-to-next focus chaining. Resized as playerCount changes.
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);
  useEffect(() => {
    inputRefs.current = inputRefs.current.slice(0, playerCount);
  }, [playerCount]);

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

  // Enter key behavior: advance to next input. On the last input, blur to
  // dismiss the keyboard (user reviews list, then taps Next themselves).
  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number,
  ) => {
    if (e.key !== "Enter") return;
    e.preventDefault();
    const nextInput = inputRefs.current[index + 1];
    if (nextInput) {
      nextInput.focus();
    } else {
      e.currentTarget.blur();
    }
  };

  // Scroll the focused row into view so the on-screen keyboard doesn't
  // hide it. block:"center" keeps the row comfortably above the keyboard
  // on most phones at N=12.
  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.scrollIntoView({ block: "center", behavior: "smooth" });
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

  const sizing = sizingFor(playerCount);

  return (
    <div className="min-h-screen flex flex-col px-4 py-6 pb-28 max-w-md mx-auto">
      <div className="flex items-center mb-6">
        <Link
          to="/setup"
          className="px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 text-sm font-medium active:scale-[0.98] transition"
        >
          ← Back
        </Link>
      </div>

      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">Who's playing?</h2>
        <button
          onClick={handleClearAll}
          className="text-sm text-gray-500 underline"
        >
          Clear all
        </button>
      </div>

      <div className={`flex flex-col ${sizing.gapClass}`}>
        {names.map((name, i) => (
          <input
            key={rowId(i)}
            ref={(el) => {
              inputRefs.current[i] = el;
            }}
            type="text"
            inputMode="text"
            enterKeyHint={i === playerCount - 1 ? "done" : "next"}
            maxLength={MAX_NAME_LENGTH}
            placeholder={`Player ${i + 1}`}
            value={name}
            onChange={(e) => handleChange(i, e.target.value)}
            onKeyDown={(e) => handleKeyDown(e, i)}
            onFocus={handleFocus}
            className={`w-full px-4 text-center ${sizing.rowClass} ${sizing.textClass} border border-gray-300 rounded-lg`}
          />
        ))}
      </div>

      {showValidationError && (
        <p className="text-red-600 text-sm mt-3 text-center">
          {showValidationError}
        </p>
      )}

      <div
        className="fixed bottom-0 left-0 right-0 px-4 pt-3 pb-6 bg-white border-t border-gray-100"
        style={{ paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 1.5rem)" }}
      >
        <div className="max-w-md mx-auto">
          <button
            onClick={handleNext}
            disabled={!!validationError}
            className="w-full py-4 bg-blue-600 text-white rounded-lg text-lg font-medium disabled:opacity-40 active:scale-[0.98] transition"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}