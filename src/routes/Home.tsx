import { useNavigate } from "react-router-dom";
import { useGameStore } from "../store/gameStore";
import type { CategoryName, CategorySelection } from "../types";

// Category list rendered on Home. Spicy and Random are visually differentiated.
// "Random" is not a stored category — it's a runtime selector.
interface CategoryCard {
  key: CategorySelection;
  label: string;
  variant: "default" | "spicy" | "random";
}

const CATEGORY_CARDS: CategoryCard[] = [
  { key: "Generic", label: "Generic", variant: "default" },
  { key: "Animals", label: "Animals", variant: "default" },
  { key: "Food & Drink", label: "Food & Drink", variant: "default" },
  { key: "History & Famous People", label: "History & Famous People", variant: "default" },
  { key: "Places & Travel", label: "Places & Travel", variant: "default" },
  { key: "Spicy", label: "Spicy 🌶️", variant: "spicy" },
  { key: "random", label: "Random", variant: "random" },
];

export default function Home() {
  const navigate = useNavigate();
  const setCategory = useGameStore((s) => s.setCategory);
  const resetGame = useGameStore((s) => s.resetGame);

  // Defensive: if user lands on Home with stale game state, clear it.
  // This is the "Done" path and also catches edge cases where navigation
  // bypassed Win. Phase 3 will add the "Resume game?" prompt that runs
  // BEFORE this clear, so resume still wins when there's a real game.
  // For now, a fresh Home = a fresh game.

  const handlePick = (key: CategorySelection) => {
    resetGame();
    setCategory(key);
    navigate("/setup");
  };

  return (
    <div className="min-h-screen flex flex-col px-4 py-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-center">Imposter</h1>

      <div className="flex flex-col gap-3">
        {CATEGORY_CARDS.map((card) => (
          <button
            key={card.key}
            onClick={() => handlePick(card.key)}
            className={
              "w-full py-4 px-4 rounded-lg text-lg font-medium text-left transition active:scale-[0.98] " +
              cardClasses(card.variant)
            }
          >
            {card.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function cardClasses(variant: CategoryCard["variant"]): string {
  switch (variant) {
    case "spicy":
      return "bg-red-50 border border-red-300 text-red-900 hover:bg-red-100";
    case "random":
      return "bg-gray-50 border-2 border-dashed border-gray-400 text-gray-700 hover:bg-gray-100";
    default:
      return "bg-white border border-gray-300 hover:bg-gray-50";
  }
}