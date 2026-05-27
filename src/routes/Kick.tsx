import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGameStore } from "../store/gameStore";

export default function Kick() {
  const navigate = useNavigate();
  const players = useGameStore((s) => s.players);
  const phase = useGameStore((s) => s.phase);
  const kickPlayer = useGameStore((s) => s.kickPlayer);
  const setCurrentRoute = useGameStore((s) => s.setCurrentRoute);

  // Local UI state: which player is the user currently confirming a kick on?
  // Stored as ID, not name, so duplicate-handling is impossible-by-design
  // (also, the spec disallows duplicate names anyway).
  const [pendingKickId, setPendingKickId] = useState<string | null>(null);

  // Update resume snapshot route on mount.
  useEffect(() => {
    setCurrentRoute("/kick");
  }, [setCurrentRoute]);

  // Defensive: refresh-mid-game lands here with no state, bail to Home.
  // Phase 3 resume modal will intercept this case earlier.
  useEffect(() => {
    if (players.length === 0 || (phase !== "kick" && phase !== "won")) {
      navigate("/", { replace: true });
    }
  }, [players.length, phase, navigate]);

  if (players.length === 0) return null;

  // Remaining players, in reveal/entry order. Kicked players are removed
  // from the list entirely per spec §5 — "not grayed out or struck through."
  const remaining = players.filter((p) => !p.isKicked);

  // Find the pending player's display name (the dialog needs it).
  const pendingPlayer = pendingKickId
    ? players.find((p) => p.id === pendingKickId)
    : null;

  const handleConfirm = () => {
    if (!pendingKickId) return;
    const winner = kickPlayer(pendingKickId);
    setPendingKickId(null);
    if (winner) {
      // Game ended. kickPlayer already cleared gameInProgress and set
      // phase to "won". Navigate to Win.
      navigate("/win");
    }
    // If no winner, stay on Kick — the next render will show remaining
    // players minus the one we just kicked.
  };

  return (
    <div className="min-h-screen flex flex-col px-4 py-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-2">Tap to kick</h1>
      <p className="text-sm text-gray-500 mb-6">
        {remaining.length} players remaining.
      </p>

      <div className="flex flex-col gap-2">
        {remaining.map((player) => (
          <button
            key={player.id}
            onClick={() => setPendingKickId(player.id)}
            className="block w-full rounded-2xl border border-gray-200 bg-white px-5 py-4 text-left text-lg active:scale-[0.98] transition"
          >
            {player.name}
          </button>
        ))}
      </div>

      {/* Confirmation dialog. Buttons are flipped from the original tap
          location: tap was somewhere in the player list; dialog buttons
          are at the bottom of the screen. Spec §13.6: "Confirm is not
          under the original tap location." */}
      {pendingPlayer && (
        <div
          className="fixed inset-0 flex items-end justify-center bg-black/40 sm:items-center"
          onClick={() => setPendingKickId(null)}
        >
          <div
            className="w-full max-w-md rounded-t-3xl bg-white p-6 sm:rounded-3xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-6 text-center text-xl font-semibold">
              Kick {pendingPlayer.name}?
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setPendingKickId(null)}
                className="flex-1 rounded-2xl bg-gray-100 px-6 py-4 font-semibold text-gray-700 active:scale-[0.98]"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                className="flex-1 rounded-2xl bg-red-600 px-6 py-4 font-semibold text-white active:scale-[0.98]"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}