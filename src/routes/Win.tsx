import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useGameStore } from "../store/gameStore";

export default function Win() {
  const navigate = useNavigate();
  const winner = useGameStore((s) => s.winner);
  const pair = useGameStore((s) => s.pair);
  const phase = useGameStore((s) => s.phase);
  const resetGame = useGameStore((s) => s.resetGame);
  const setCurrentRoute = useGameStore((s) => s.setCurrentRoute);

  // Update resume snapshot route on mount (purely for consistency; the
  // gameInProgress flag was already cleared when the win fired, so this
  // does nothing harmful — setCurrentRoute on phase="won" doesn't snapshot).
  useEffect(() => {
    setCurrentRoute("/win");
  }, [setCurrentRoute]);

  // Defensive: arriving at /win with no winner means a refresh-after-win
  // (gameInProgress was cleared, so gameStore is empty) or URL typing.
  // Either way, send to Home.
  useEffect(() => {
    if (!winner || !pair || phase !== "won") {
      navigate("/", { replace: true });
    }
  }, [winner, pair, phase, navigate]);

  if (!winner || !pair) return null;

  // Spec §7: both buttons reset the active game and return to Category Select.
  // Persisted names (lastPlayerNames) stay intact in settingsStore — they were
  // saved at Name Entry and are not cleared here, so they pre-fill the next
  // game's Name Entry screen.
  const handlePlayAgain = () => {
    resetGame();
    navigate("/");
  };

  const handleDone = () => {
    resetGame();
    navigate("/");
  };

  const isCivilianWin = winner === "civilians";

  return (
    <div className="min-h-screen flex flex-col px-4 py-6 max-w-md mx-auto">
      <div className="flex-1 flex flex-col items-center justify-center text-center">
        {/* Headline. Color differentiation by side per spec §7. */}
        <h1
          className={
            "text-4xl font-bold mb-12 " +
            (isCivilianWin ? "text-blue-600" : "text-red-600")
          }
        >
          {isCivilianWin ? "Civilians Win" : "Imposters Win"}
        </h1>

        {/* Both words from the pair. Civilian word first, regardless of
            who won. Spec §7 example shows this ordering. */}
        <div className="text-lg space-y-2">
          <p>
            <span className="text-gray-500">Civilians' word:</span>{" "}
            <span className="font-bold">{pair.civilianWord}</span>
          </p>
          <p>
            <span className="text-gray-500">Imposters' word:</span>{" "}
            <span className="font-bold">{pair.imposterWord}</span>
          </p>
        </div>

        {/* Deliberately NOT shown: which players were imposters. Spec §7:
            "This keeps the mystery alive after the game ends — friends can
            choose whether to confess or not." */}
      </div>

      <div className="flex flex-col gap-3">
        <button
          onClick={handlePlayAgain}
          className="w-full py-4 bg-blue-600 text-white rounded-lg text-lg font-medium active:scale-[0.98] transition"
        >
          Play Again
        </button>
        <button
          onClick={handleDone}
          className="w-full py-4 bg-gray-100 text-gray-700 rounded-lg text-lg font-medium active:scale-[0.98] transition"
        >
          Done
        </button>
      </div>
    </div>
  );
}