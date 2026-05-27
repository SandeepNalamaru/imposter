import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGameStore } from "../store/gameStore";
import SettingsGear from "../components/SettingsGear";
import SettingsModal from "../components/SettingsModal";
import { sizingFor } from "../lib/sizing";

export default function Kick() {
  const navigate = useNavigate();
  const players = useGameStore((s) => s.players);
  const phase = useGameStore((s) => s.phase);
  const kickPlayer = useGameStore((s) => s.kickPlayer);
  const setCurrentRoute = useGameStore((s) => s.setCurrentRoute);

  const [pendingKickId, setPendingKickId] = useState<string | null>(null);
  const [settingsOpen, setSettingsOpen] = useState(false);

  useEffect(() => {
    setCurrentRoute("/kick");
  }, [setCurrentRoute]);

  // Defensive: refresh-mid-game lands here with no state, bail to Home.
  useEffect(() => {
    if (players.length === 0 || (phase !== "kick" && phase !== "won")) {
      navigate("/", { replace: true });
    }
  }, [players.length, phase, navigate]);

  if (players.length === 0) return null;

  const remaining = players.filter((p) => !p.isKicked);
  const pendingPlayer = pendingKickId
    ? players.find((p) => p.id === pendingKickId)
    : null;

  const handleConfirm = () => {
    if (!pendingKickId) return;
    const winner = kickPlayer(pendingKickId);
    setPendingKickId(null);
    if (winner) {
      navigate("/win");
    }
  };

  // Sizing scales with REMAINING players, not starting count. As players
  // get kicked the surviving rows breathe more — visual reward for the
  // game narrowing down.
  const sizing = sizingFor(remaining.length);

  return (
    <div className="min-h-screen flex flex-col px-4 py-6 max-w-md mx-auto">
      <div className="flex items-center mb-2">
        <h1 className="text-2xl font-bold">Tap to kick</h1>
        <div className="ml-auto">
          <SettingsGear onClick={() => setSettingsOpen(true)} />
        </div>
      </div>
      <p className="text-base text-gray-500 mb-6">
        {remaining.length} players remaining.
      </p>

      <div className={`flex flex-col ${sizing.gapClass}`}>
        {remaining.map((player) => (
          <button
            key={player.id}
            onClick={() => setPendingKickId(player.id)}
            className={`block w-full rounded-2xl border border-gray-200 bg-white px-5 ${sizing.rowClass} text-center font-medium ${sizing.textClass} active:scale-[0.98] transition`}
          >
            {player.name}
          </button>
        ))}
      </div>

      {pendingPlayer && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black/40 z-50 p-4"
          onClick={() => setPendingKickId(null)}
        >
          <div
            className="w-full max-w-md rounded-3xl bg-white p-6"
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

      <SettingsModal
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        showRestart={true}
      />
    </div>
  );
}