import { useEffect, useState, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { useSettingsStore } from "../store/settingsStore";
import { useGameStore } from "../store/gameStore";

interface ResumeGateProps {
  children: ReactNode;
}

// ResumeGate intercepts on app mount. If settingsStore has a gameInProgress
// snapshot, it shows a modal asking whether to resume. Yes → hydrate game
// state, navigate to the saved route. No → wipe state, let the app render
// whatever the URL says.
//
// While prompting, children render is suppressed to prevent a flash of the
// landed route (which might be Home, or might be a stale URL the user had
// open). Once the user picks, gate releases.
//
// Must be rendered INSIDE the router (uses useNavigate). App.tsx wires
// it as the element of a layout route or wraps it inside RouterProvider's
// element tree.
export default function ResumeGate({ children }: ResumeGateProps) {
  const navigate = useNavigate();
  const gameInProgress = useSettingsStore((s) => s.gameInProgress);
  const setGameInProgress = useSettingsStore((s) => s.setGameInProgress);
  const hydrateFromSnapshot = useGameStore((s) => s.hydrateFromSnapshot);
  const resetGame = useGameStore((s) => s.resetGame);

  // On the very first render, snapshot the gameInProgress value. We do NOT
  // want to re-trigger the prompt later — for example, if mid-game the user
  // taps Home (which causes gameInProgress to update via snapshotToSettings),
  // ResumeGate has already released and shouldn't re-prompt. So we read the
  // value once at mount and freeze it.
  const [initialSnapshot] = useState(() => gameInProgress);
  const [decided, setDecided] = useState(initialSnapshot === null);

  // If there was no game in progress at mount, release immediately.
  // (decided was already set to true above, but useEffect to be safe.)
  useEffect(() => {
    if (initialSnapshot === null) {
      setDecided(true);
    }
  }, [initialSnapshot]);

  const handleYes = () => {
    if (!initialSnapshot) {
      setDecided(true);
      return;
    }
    // Hydrate FIRST so the destination screen's guards see real state when
    // they mount. Then navigate. Both calls are synchronous from React's
    // POV, so by the time navigate triggers the rerender, the store is
    // already populated.
    hydrateFromSnapshot(initialSnapshot);
    navigate(initialSnapshot.currentRoute, { replace: true });
    setDecided(true);
  };

  const handleNo = () => {
    // Wipe the snapshot and any stale game state.
    setGameInProgress(null);
    resetGame();
    setDecided(true);
    // Leave navigation alone — user stays wherever the URL landed. If the URL
    // is a mid-game route like /reveal/3, that route's own defensive guard
    // will bounce to Home now that there's no game state.
  };

  if (!decided && initialSnapshot) {
    return (
      <div
        className="fixed inset-0 flex items-center justify-center bg-black/60 z-50 px-4"
        role="dialog"
        aria-modal="true"
        aria-label="Resume game"
      >
        <div className="w-full max-w-sm bg-white rounded-2xl p-6">
          <h2 className="text-xl font-bold text-center mb-2">Resume game?</h2>
          <p className="text-sm text-gray-500 text-center mb-6">
            You have a game in progress.
          </p>
          <div className="flex flex-col gap-2">
            <button
              onClick={handleYes}
              className="w-full py-4 bg-blue-600 text-white rounded-lg text-lg font-medium active:scale-[0.98] transition"
            >
              Yes, resume
            </button>
            <button
              onClick={handleNo}
              className="w-full py-4 bg-gray-100 text-gray-700 rounded-lg text-lg font-medium active:scale-[0.98] transition"
            >
              No, start over
            </button>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}