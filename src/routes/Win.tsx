import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGameStore } from "../store/gameStore";

// Beat timings (ms). Tuned for a blank-screen opening, then a paced reveal.
// Tweak these values to taste — they're independent except that each beat
// should fire after the previous fade completes (500-1000ms fades work well).
const BEAT_INTRO = 400;     // when "Game over..." fades in from blank
const BEAT_FLOOD = 1000;    // when the background color flood begins
const BEAT_HEADLINE = 1500; // when "Civilians/Imposters Win" appears
const BEAT_WORDS = 2100;    // when the word pair fades in
const BEAT_BUTTONS = 2600;  // when the action buttons appear

type AnimationPhase = "blank" | "intro" | "flood" | "headline" | "words" | "buttons";

export default function Win() {
  const navigate = useNavigate();
  const winner = useGameStore((s) => s.winner);
  const pair = useGameStore((s) => s.pair);
  const phase = useGameStore((s) => s.phase);
  const resetGame = useGameStore((s) => s.resetGame);
  const setCurrentRoute = useGameStore((s) => s.setCurrentRoute);

  // Animation state machine. Starts blank (nothing visible), then advances
  // through beats via setTimeout. Component remount (e.g. after Play Again
  // → new game → new win) naturally resets this to "blank" — exactly what
  // we want.
  const [animPhase, setAnimPhase] = useState<AnimationPhase>("blank");

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

  // Schedule the animation beats. Each timeout advances the phase.
  // Timeouts are cleaned up on unmount (rapid navigation away).
  useEffect(() => {
    if (!winner || !pair) return;
    const timers: ReturnType<typeof setTimeout>[] = [
      setTimeout(() => setAnimPhase("intro"), BEAT_INTRO),
      setTimeout(() => setAnimPhase("flood"), BEAT_FLOOD),
      setTimeout(() => setAnimPhase("headline"), BEAT_HEADLINE),
      setTimeout(() => setAnimPhase("words"), BEAT_WORDS),
      setTimeout(() => setAnimPhase("buttons"), BEAT_BUTTONS),
    ];
    return () => timers.forEach(clearTimeout);
  }, [winner, pair]);

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

  // The background color flood. Blank/intro beats keep the screen white,
  // then the winning side's color floods in. The transition handles the
  // actual fade between the two over 1000ms (see duration-1000 below).
  const backgroundClass =
    animPhase === "blank" || animPhase === "intro"
      ? "bg-white"
      : isCivilianWin
        ? "bg-blue-600"
        : "bg-red-600";

  // Text color flips once the background floods. Blank/intro beats show
  // dark text on white; after the flood, white text on color.
  const textColorClass =
    animPhase === "blank" || animPhase === "intro"
      ? "text-gray-900"
      : "text-white";

  // Helper: returns Tailwind opacity-transition classes for whether a beat
  // is "visible yet." Each element fades in over 500ms when its phase
  // unlocks.
  const fadeIn = (visible: boolean) =>
    `transition-opacity duration-500 ${visible ? "opacity-100" : "opacity-0"}`;

  // "blank" phase: nothing visible. introTextVisible stays false during
  // blank, so "Game over..." fades in from opacity-0 once BEAT_INTRO fires.
  const introTextVisible = animPhase === "intro" || animPhase === "flood";
  const headlineVisible =
    animPhase === "headline" ||
    animPhase === "words" ||
    animPhase === "buttons";
  const wordsVisible = animPhase === "words" || animPhase === "buttons";
  const buttonsVisible = animPhase === "buttons";

  // Border color for the fixed bottom bar. White before the flood, then
  // a translucent overlay once the background is colored — keeps it
  // visible as a separator without breaking the flood color.
  const bottomBarBorder =
    animPhase === "blank" || animPhase === "intro"
      ? "border-gray-100"
      : "border-white/20";

  return (
    <div
      className={`min-h-screen flex flex-col px-4 py-6 pb-28 max-w-md mx-auto transition-colors duration-1000 ${backgroundClass} ${textColorClass}`}
    >
      <div className="flex-1 flex flex-col items-center justify-center text-center relative">
        {/* "Game over..." intro text. Visible during intro and flood beats,
            then fades as the headline takes its place. Absolutely positioned
            so it occupies the same screen position as the headline —
            they're a crossfade, not stacked content. */}
        <p
          className={`absolute text-3xl font-medium ${fadeIn(introTextVisible)}`}
        >
          Game over...
        </p>

        {/* The winning side. Crossfades in as "Game over..." fades out. */}
        <h1
          className={`absolute text-5xl font-bold ${fadeIn(headlineVisible)}`}
        >
          {isCivilianWin ? "Civilians Win" : "Imposters Win"}
        </h1>

        {/* The word pair. Sits below the headline, fades in after it.
            Pushed down enough that the headline has room to breathe. */}
        <div className={`absolute mt-32 text-lg space-y-2 ${fadeIn(wordsVisible)}`}>
          <p>
            <span className="opacity-70">Civilians' word:</span>{" "}
            <span className="font-bold">{pair.civilianWord}</span>
          </p>
          <p>
            <span className="opacity-70">Imposters' word:</span>{" "}
            <span className="font-bold">{pair.imposterWord}</span>
          </p>
        </div>

        {/* Deliberately NOT shown: which players were imposters. Spec §7:
            "This keeps the mystery alive after the game ends — friends can
            choose whether to confess or not." */}
      </div>

      {/* Fixed bottom button bar. Same pattern as GameSetup / NameEntry /
          Reorder / Reveal — anchored to viewport, immune to scroll.
          Background matches the screen flood so it doesn't feel like a
          separate panel; border is the only separation, and that border
          recolors with the flood (see bottomBarBorder above). */}
      <div
        className={`fixed bottom-0 left-0 right-0 px-4 pt-3 pb-6 transition-colors duration-1000 ${backgroundClass} border-t ${bottomBarBorder} ${fadeIn(buttonsVisible)}`}
        style={{ paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 1.5rem)" }}
      >
        <div className="max-w-md mx-auto flex flex-col gap-3">
          <button
            onClick={handlePlayAgain}
            disabled={!buttonsVisible}
            className="w-full py-4 bg-white text-gray-900 rounded-lg text-lg font-medium active:scale-[0.98] transition"
          >
            Play Again
          </button>
          <button
            onClick={handleDone}
            disabled={!buttonsVisible}
            className="w-full py-4 bg-white/20 text-white border border-white/40 rounded-lg text-lg font-medium active:scale-[0.98] transition"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}