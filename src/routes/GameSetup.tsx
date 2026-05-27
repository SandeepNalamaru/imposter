import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useGameStore } from "../store/gameStore";
import { useSettingsStore } from "../store/settingsStore";

const MIN_PLAYERS = 3;
const MAX_PLAYERS = 12;
const MIN_IMPOSTERS = 1;

// Cap from spec §5: floor((n - 1) / 2). Ensures civilian majority at start.
function maxImposters(playerCount: number): number {
  return Math.floor((playerCount - 1) / 2);
}

export default function GameSetup() {
  const navigate = useNavigate();
  const category = useGameStore((s) => s.category);

  // Persisted last-used values are the source of truth between screens.
  // Spec §13.2: "Stepper values persist across back trips."
  const playerCount = useSettingsStore((s) => s.lastPlayerCount);
  const imposterCount = useSettingsStore((s) => s.lastImposterCount);
  const setPlayerCount = useSettingsStore((s) => s.setLastPlayerCount);
  const setImposterCount = useSettingsStore((s) => s.setLastImposterCount);

  // Edge case from spec §5: if category is null (e.g. user typed /setup
  // directly into the URL bar), kick them back to Home. No deep-linking
  // to mid-flow routes is supported.
  useEffect(() => {
    if (!category) navigate("/", { replace: true });
  }, [category, navigate]);

  const cap = maxImposters(playerCount);

  const handlePlayerCountChange = (delta: number) => {
    const next = playerCount + delta;
    if (next < MIN_PLAYERS || next > MAX_PLAYERS) return;
    setPlayerCount(next);
    // Spec §5: if imposter count exceeds new cap, silently snap down.
    const newCap = maxImposters(next);
    if (imposterCount > newCap) setImposterCount(newCap);
  };

  const handleImposterCountChange = (delta: number) => {
    const next = imposterCount + delta;
    if (next < MIN_IMPOSTERS || next > cap) return;
    setImposterCount(next);
  };

  if (!category) return null;

  return (
    <div className="min-h-screen flex flex-col px-4 py-6 max-w-md mx-auto">
      <div className="flex items-center mb-6">
        <Link to="/" className="text-blue-600">
          ← Back
        </Link>
        <span className="ml-auto px-3 py-1 rounded-full bg-gray-100 text-sm">
          {category === "random" ? "Random" : category}
        </span>
      </div>

      <div className="flex flex-col gap-8 mt-4">
        <Stepper
          label="Players"
          value={playerCount}
          onIncrement={() => handlePlayerCountChange(1)}
          onDecrement={() => handlePlayerCountChange(-1)}
          canIncrement={playerCount < MAX_PLAYERS}
          canDecrement={playerCount > MIN_PLAYERS}
        />

        <div>
          <Stepper
            label="Imposters"
            value={imposterCount}
            onIncrement={() => handleImposterCountChange(1)}
            onDecrement={() => handleImposterCountChange(-1)}
            canIncrement={imposterCount < cap}
            canDecrement={imposterCount > MIN_IMPOSTERS}
          />
          <p className="text-sm text-gray-500 mt-2 text-center">
            Max {cap} for {playerCount} players
          </p>
        </div>
      </div>

      <button
        onClick={() => navigate("/names")}
        className="mt-auto w-full py-4 bg-blue-600 text-white rounded-lg text-lg font-medium active:scale-[0.98] transition"
      >
        Next
      </button>
    </div>
  );
}

interface StepperProps {
  label: string;
  value: number;
  onIncrement: () => void;
  onDecrement: () => void;
  canIncrement: boolean;
  canDecrement: boolean;
}

function Stepper({
  label,
  value,
  onIncrement,
  onDecrement,
  canIncrement,
  canDecrement,
}: StepperProps) {
  return (
    <div>
      <div className="text-center text-gray-600 mb-3">{label}</div>
      <div className="flex items-center justify-center gap-6">
        <button
          onClick={onDecrement}
          disabled={!canDecrement}
          className="w-12 h-12 rounded-full bg-gray-200 text-2xl disabled:opacity-30 active:scale-95 transition"
        >
          −
        </button>
        <span className="text-4xl font-bold w-12 text-center tabular-nums">
          {value}
        </span>
        <button
          onClick={onIncrement}
          disabled={!canIncrement}
          className="w-12 h-12 rounded-full bg-gray-200 text-2xl disabled:opacity-30 active:scale-95 transition"
        >
          +
        </button>
      </div>
    </div>
  );
}