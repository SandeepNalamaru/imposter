import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useGameStore } from "../store/gameStore";
import { useSettingsStore } from "../store/settingsStore";
import SettingsGear from "../components/SettingsGear";
import SettingsModal from "../components/SettingsModal";

type RevealState = "pre" | "revealed" | "hidden";

export default function Reveal() {
  const navigate = useNavigate();
  const { playerIndex } = useParams<{ playerIndex: string }>();
  const idx = Number(playerIndex);

  const pair = useGameStore((s) => s.pair);
  const players = useGameStore((s) => s.players);
  const playerOrder = useGameStore((s) => s.playerOrder);
  const phase = useGameStore((s) => s.phase);
  const advanceReveal = useGameStore((s) => s.advanceReveal);
  const startKickPhase = useGameStore((s) => s.startKickPhase);
  const setCurrentRoute = useGameStore((s) => s.setCurrentRoute);
  const impostersKnowEachOther = useSettingsStore(
    (s) => s.toggleImpostersKnowEachOther,
  );

  // Three-state local machine. Reset effect needed because React Router
  // reuses the component instance when only the route param changes.
  const [state, setState] = useState<RevealState>("pre");

  useEffect(() => {
    setState("pre");
  }, [idx]);

  // Settings modal open/close state.
  const [settingsOpen, setSettingsOpen] = useState(false);

  useEffect(() => {
    setCurrentRoute(`/reveal/${idx}`);
  }, [idx, setCurrentRoute]);

  // Only bail when there's literally no game. Not when phase has legitimately
  // moved past "reveal" (e.g. startKickPhase just fired).
  useEffect(() => {
    if (!pair || players.length === 0 || phase === null) {
      navigate("/", { replace: true });
    }
  }, [pair, players.length, phase, navigate]);

  useEffect(() => {
    if (!Number.isInteger(idx) || idx < 0 || idx >= playerOrder.length) {
      if (playerOrder.length > 0) navigate("/reveal/0", { replace: true });
    }
  }, [idx, playerOrder.length, navigate]);

  // visibilitychange: snap to Hidden if page goes hidden while Revealed.
  useEffect(() => {
    if (state !== "revealed") return;

    const handleVisibility = () => {
      if (document.hidden) {
        setState("hidden");
      }
    };

    document.addEventListener("visibilitychange", handleVisibility);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibility);
  }, [state]);

  if (!pair || players.length === 0 || phase !== "reveal") return null;
  if (idx < 0 || idx >= playerOrder.length) return null;

  const currentPlayerId = playerOrder[idx];
  const currentPlayer = players.find((p) => p.id === currentPlayerId);
  if (!currentPlayer) return null;

  const isLast = idx === playerOrder.length - 1;
  const nextPlayer = !isLast
    ? players.find((p) => p.id === playerOrder[idx + 1])
    : null;

  const word = currentPlayer.isImposter ? pair.imposterWord : pair.civilianWord;

  const allImposters = players.filter((p) => p.isImposter);
  const showOtherImposters =
    impostersKnowEachOther &&
    currentPlayer.isImposter &&
    allImposters.length >= 2;
  const otherImposterNames = allImposters
    .filter((p) => p.id !== currentPlayer.id)
    .map((p) => p.name)
    .join(", ");

  const handleTapBody = () => {
    if (state === "pre") setState("revealed");
    else if (state === "revealed") setState("hidden");
  };

  const handleNext = () => {
    if (isLast) {
      startKickPhase();
      navigate("/kick");
    } else {
      advanceReveal();
      navigate(`/reveal/${idx + 1}`);
    }
  };

  return (
    <div className="min-h-screen flex flex-col px-4 py-6 max-w-md mx-auto">
      <div className="flex items-center mb-8">
        <span className="text-sm text-gray-500">
          Player {idx + 1} of {playerOrder.length}
        </span>
        <div className="ml-auto">
          <SettingsGear onClick={() => setSettingsOpen(true)} />
        </div>
      </div>

      <div
        onClick={state !== "hidden" ? handleTapBody : undefined}
        className="flex-1 flex flex-col items-center justify-center text-center"
        style={{ cursor: state !== "hidden" ? "pointer" : "default" }}
      >
        {state === "pre" && (
          <div className="px-6">
            <p className="text-2xl">
              <span className="font-bold">{currentPlayer.name}</span>,
              <br />
              tap to reveal your word.
            </p>
          </div>
        )}

        {state === "revealed" && (
          <div className="px-6">
            <p className="text-5xl font-bold mb-6 break-words">{word}</p>

            {showOtherImposters && (
              <p className="text-sm text-gray-500 mt-4">
                Other imposters: {otherImposterNames}
              </p>
            )}

            <p className="text-gray-400 text-sm mt-8">Tap to hide</p>
          </div>
        )}

        {state === "hidden" && (
          <div className="px-6">
            {isLast ? (
              <p className="text-xl">
                All players have seen their word.
                <br />
                Start discussion.
              </p>
            ) : (
              <p className="text-xl">
                Pass to{" "}
                <span className="font-bold">{nextPlayer?.name ?? "next"}</span>.
              </p>
            )}
          </div>
        )}
      </div>

      {state === "hidden" && (
        <button
          onClick={handleNext}
          className="w-full py-4 bg-blue-600 text-white rounded-lg text-lg font-medium active:scale-[0.98] transition"
        >
          {isLast ? "Start voting" : "Next"}
        </button>
      )}

      <SettingsModal
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        showRestart={true}
      />
    </div>
  );
}