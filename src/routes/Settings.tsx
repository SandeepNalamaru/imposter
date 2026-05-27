import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSettingsStore } from "../store/settingsStore";
import { useGameStore } from "../store/gameStore";

// SettingsContent is the body. SettingsRoute below wraps it in the full-screen
// layout used when accessed from Home. The modal-sheet version (used from
// Reveal/Kick) lives in a separate file and shares this same content body.

interface SettingsContentProps {
  // When true, also renders the "Restart game" row in a separate destructive
  // group. The route version (from Home) never has a game in progress, so this
  // defaults to false there. The modal version sets it to true.
  showRestart?: boolean;
  // Called after a destructive action that should close the surface. The route
  // version navigates home; the modal version dismisses itself.
  onDestructiveComplete?: () => void;
}

export function SettingsContent({
  showRestart = false,
  onDestructiveComplete,
}: SettingsContentProps) {
  const navigate = useNavigate();

  const impostersKnowEachOther = useSettingsStore(
    (s) => s.toggleImpostersKnowEachOther,
  );
  const setImpostersKnowEachOther = useSettingsStore(
    (s) => s.setToggleImpostersKnowEachOther,
  );
  const lastPlayerNames = useSettingsStore((s) => s.lastPlayerNames);
  const clearSavedNames = useSettingsStore((s) => s.clearSavedNames);
  const resetGame = useGameStore((s) => s.resetGame);

  // Confirm-dialog state. Two destructive actions, one dialog at a time.
  const [pendingAction, setPendingAction] = useState<
    "clearNames" | "restart" | null
  >(null);

  const handleConfirm = () => {
    if (pendingAction === "clearNames") {
      clearSavedNames();
    } else if (pendingAction === "restart") {
      resetGame();
      // Restart always navigates home, regardless of which surface we're on.
      navigate("/");
    }
    setPendingAction(null);
    onDestructiveComplete?.();
  };

  const handleCancel = () => setPendingAction(null);

  const hasSavedNames = lastPlayerNames.length > 0;

  return (
    <div className="flex flex-col gap-8">
      {/* Gameplay group */}
      <section>
        <h2 className="text-xs uppercase tracking-wide text-gray-500 mb-2 px-1">
          Gameplay
        </h2>
        <div className="bg-white border border-gray-200 rounded-lg p-4 flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="font-medium">Imposters know each other</div>
            <div className="text-sm text-gray-500 mt-1">
              When on, imposters see each other's names on their reveal screen.
              Applies to the next game.
            </div>
          </div>
          <ToggleSwitch
            checked={impostersKnowEachOther}
            onChange={setImpostersKnowEachOther}
            label="Imposters know each other"
          />
        </div>
      </section>

      {/* Data group */}
      <section>
        <h2 className="text-xs uppercase tracking-wide text-gray-500 mb-2 px-1">
          Data
        </h2>
        <div className="bg-white border border-gray-200 rounded-lg">
          <button
            onClick={() => setPendingAction("clearNames")}
            disabled={!hasSavedNames}
            className="w-full text-left p-4 text-red-600 disabled:text-gray-400 disabled:cursor-not-allowed active:scale-[0.99] transition"
          >
            Clear saved player names
            {!hasSavedNames && (
              <span className="text-sm text-gray-400 ml-2">(no names saved)</span>
            )}
          </button>
        </div>
      </section>

      {/* Game-in-progress group — only shown when accessed mid-game */}
      {showRestart && (
        <section>
          <h2 className="text-xs uppercase tracking-wide text-gray-500 mb-2 px-1">
            Game in progress
          </h2>
          <div className="bg-white border border-gray-200 rounded-lg">
            <button
              onClick={() => setPendingAction("restart")}
              className="w-full text-left p-4 text-red-600 active:scale-[0.99] transition"
            >
              Restart game
            </button>
          </div>
        </section>
      )}

      {/* Confirmation dialog (shared by both destructive actions) */}
      {pendingAction && (
        <div
          className="fixed inset-0 flex items-end justify-center bg-black/40 sm:items-center z-50"
          onClick={handleCancel}
        >
          <div
            className="w-full max-w-md rounded-t-3xl bg-white p-6 sm:rounded-3xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-6 text-center text-lg font-semibold">
              {pendingAction === "clearNames"
                ? "Clear all saved player names?"
                : "Restart this game? Current progress will be lost."}
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleCancel}
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

// Pure UI toggle. Roll-our-own rather than depend on a UI lib for one switch.
interface ToggleSwitchProps {
  checked: boolean;
  onChange: (next: boolean) => void;
  label: string;
}

function ToggleSwitch({ checked, onChange, label }: ToggleSwitchProps) {
  return (
    <button
      onClick={() => onChange(!checked)}
      role="switch"
      aria-checked={checked}
      aria-label={label}
      className={
        "relative w-12 h-7 rounded-full transition-colors flex-shrink-0 " +
        (checked ? "bg-blue-600" : "bg-gray-300")
      }
    >
      <span
        className={
          "absolute top-1 w-5 h-5 bg-white rounded-full transition-all shadow " +
          (checked ? "left-6" : "left-1")
        }
      />
    </button>
  );
}

// Default export: the /settings route, full-screen layout.
export default function Settings() {
  return (
    <div className="min-h-screen flex flex-col px-4 py-6 max-w-md mx-auto">
      <div className="flex items-center mb-6">
        <Link to="/" className="text-blue-600">
          ← Back
        </Link>
        <h1 className="ml-auto mr-auto text-xl font-bold -translate-x-3">
          Settings
        </h1>
      </div>

      <SettingsContent showRestart={false} />
    </div>
  );
}