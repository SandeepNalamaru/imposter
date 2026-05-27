import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useGameStore } from "../store/gameStore";
import { useSettingsStore } from "../store/settingsStore";

export default function Reorder() {
  const navigate = useNavigate();
  const category = useGameStore((s) => s.category);
  const players = useGameStore((s) => s.players);
  const setPlayerOrder = useGameStore((s) => s.setPlayerOrder);
  const startGame = useGameStore((s) => s.startGame);
  const imposterCount = useSettingsStore((s) => s.lastImposterCount);

  // Defensive redirect: typing /reorder in the URL bar with no setup.
  useEffect(() => {
    if (!category || players.length === 0) {
      navigate("/", { replace: true });
    }
  }, [category, players.length, navigate]);

  // Local order, mirrored to gameStore on Start. We don't push every drag
  // to the store — only the final order matters.
  const [orderedIds, setOrderedIds] = useState<string[]>(() =>
    players.map((p) => p.id),
  );

  // Keep local order in sync if players change underneath us (e.g. user
  // navigates back to Names and changes the count). Spec §13.4: name edits
  // preserve order, add/remove resets to entry order. The id-stability
  // logic in NameEntry handles the "preserves" case for us — same IDs come
  // back, same order survives. For add/remove, the id set changes, and we
  // reset here.
  useEffect(() => {
    const playerIds = players.map((p) => p.id);
    const sameSet =
      playerIds.length === orderedIds.length &&
      playerIds.every((id) => orderedIds.includes(id));
    if (!sameSet) {
      setOrderedIds(playerIds);
    }
  }, [players, orderedIds]);

  // Sensor setup. TouchSensor with delay = long-press to drag on mobile,
  // which doesn't fight page scrolling. PointerSensor handles mouse/stylus.
  // KeyboardSensor is accessibility-free with the sortable preset.
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 200, tolerance: 5 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    setOrderedIds((items) => {
      const oldIndex = items.indexOf(String(active.id));
      const newIndex = items.indexOf(String(over.id));
      return arrayMove(items, oldIndex, newIndex);
    });
  };

  const handleStartGame = () => {
    // Commit final order to the store, then start the game. startGame()
    // picks the pair (with soft-bias), randomizes sides, assigns imposters,
    // sets phase to "reveal", and snapshots to settingsStore.gameInProgress.
    setPlayerOrder(orderedIds);
    startGame(imposterCount);
    navigate("/reveal/0");
  };

  // Look up player names by id, preserving the drag order.
  const orderedPlayers = orderedIds
    .map((id) => players.find((p) => p.id === id))
    .filter((p): p is NonNullable<typeof p> => !!p);

  if (!category || players.length === 0) return null;

  return (
    <div className="min-h-screen flex flex-col px-4 py-6 max-w-md mx-auto">
      <div className="flex items-center mb-6">
        <Link to="/names" className="text-blue-600">
          ← Back
        </Link>
      </div>

      <h2 className="text-xl font-bold mb-1">Pass order</h2>
      <p className="text-sm text-gray-500 mb-4">
        Drag to change. This is the order you'll pass the phone.
      </p>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={orderedIds}
          strategy={verticalListSortingStrategy}
        >
          <div className="flex flex-col gap-2">
            {orderedPlayers.map((player, i) => (
              <SortableRow
                key={player.id}
                id={player.id}
                position={i + 1}
                name={player.name}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      <button
        onClick={handleStartGame}
        className="mt-auto w-full py-4 bg-blue-600 text-white rounded-lg text-lg font-medium active:scale-[0.98] transition"
      >
        Start game
      </button>
    </div>
  );
}

interface SortableRowProps {
  id: string;
  position: number;
  name: string;
}

function SortableRow({ id, position, name }: SortableRowProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    // Visual feedback during drag: lift effect.
    boxShadow: isDragging ? "0 8px 16px rgba(0,0,0,0.15)" : undefined,
    opacity: isDragging ? 0.9 : 1,
    zIndex: isDragging ? 10 : "auto",
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-3 px-4 py-3 bg-white border border-gray-300 rounded-lg"
    >
      <span className="text-gray-400 font-medium w-6 tabular-nums">
        {position}
      </span>
      <span className="flex-1 font-medium">{name}</span>
      {/* Drag handle. touchAction: none here, not on the whole row, so
          tapping elsewhere on the row still allows page scroll. */}
      <button
        {...attributes}
        {...listeners}
        style={{ touchAction: "none", cursor: "grab" }}
        className="text-gray-400 px-2 py-1 text-xl select-none"
        aria-label={`Reorder ${name}`}
      >
        ⋮⋮
      </button>
    </div>
  );
}