"use client";

import { useState } from "react";
import {
  DndContext,
  DragOverlay,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  arrayMove,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Lock, Eye, EyeOff, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePortfolioStore } from "@/lib/store";

// ── Constants ─────────────────────────────────────────────────────────────────

export const DEFAULT_SECTION_ORDER = [
  "home",
  "about",
  "education",
  "skills",
  "projects",
  "experience",
  "contact",
];

const SECTION_LABELS: Record<string, string> = {
  home: "Home",
  about: "About",
  education: "Education",
  skills: "Skills",
  projects: "Projects",
  experience: "Experience",
  contact: "Get in Touch",
};

// ── Sortable item (used inside DndContext) ────────────────────────────────────

function SortableItem({
  id,
  locked,
  visible,
  onToggleVisibility,
}: {
  id: string;
  locked: boolean;
  visible: boolean;
  onToggleVisibility: () => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id, disabled: locked });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0 : 1, // hide original while overlay renders
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2"
    >
      {/* Drag handle or lock */}
      {locked ? (
        <Lock className="size-3.5 shrink-0 text-muted-foreground/50" />
      ) : (
        <button
          {...listeners}
          {...attributes}
          className="cursor-grab touch-none text-muted-foreground/60 hover:text-foreground active:cursor-grabbing"
          aria-label="Drag to reorder"
        >
          <GripVertical className="size-4 shrink-0" />
        </button>
      )}

      {/* Label */}
      <span className="flex-1 text-sm font-medium">{SECTION_LABELS[id] ?? id}</span>

      {/* Visibility toggle — not available for locked sections */}
      {!locked && (
        <button
          onClick={onToggleVisibility}
          className="text-muted-foreground/60 hover:text-foreground transition-colors"
          aria-label={visible ? "Hide section" : "Show section"}
        >
          {visible ? (
            <Eye className="size-3.5" />
          ) : (
            <EyeOff className="size-3.5" />
          )}
        </button>
      )}
    </div>
  );
}

// ── Drag overlay item (rendered while dragging) ───────────────────────────────

function DragItem({ id }: { id: string }) {
  return (
    <div className="flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 shadow-lg scale-[1.02] cursor-grabbing ring-1 ring-primary/30">
      <GripVertical className="size-4 shrink-0 text-muted-foreground" />
      <span className="flex-1 text-sm font-medium">{SECTION_LABELS[id] ?? id}</span>
      <Eye className="size-3.5 text-muted-foreground/60" />
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export default function SectionOrderManager() {
  const { sectionOrder, setSectionOrder } = usePortfolioStore();
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  // Visible sections = those present in sectionOrder
  // Hidden sections  = those from DEFAULT list NOT in sectionOrder
  const hiddenIds = DEFAULT_SECTION_ORDER.filter((id) => !sectionOrder.includes(id));

  function handleDragStart(event: DragStartEvent) {
    setActiveId(event.active.id as string);
  }

  function handleDragEnd(event: DragEndEvent) {
    setActiveId(null);
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = sectionOrder.indexOf(active.id as string);
    const newIndex = sectionOrder.indexOf(over.id as string);
    if (oldIndex === -1 || newIndex === -1) return;

    let newOrder = arrayMove(sectionOrder, oldIndex, newIndex);
    // Enforce home always first
    const homeIdx = newOrder.indexOf("home");
    if (homeIdx > 0) {
      newOrder.splice(homeIdx, 1);
      newOrder.unshift("home");
    }
    setSectionOrder(newOrder);
  }

  function hideSection(id: string) {
    setSectionOrder(sectionOrder.filter((s) => s !== id));
  }

  function showSection(id: string) {
    // Add back to the end of visible list
    setSectionOrder([...sectionOrder, id]);
  }

  function handleReset() {
    setSectionOrder(DEFAULT_SECTION_ORDER);
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold">Section Order</p>
        <Button
          variant="ghost"
          size="sm"
          className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground"
          onClick={handleReset}
        >
          <RotateCcw className="mr-1 size-3" />
          Reset
        </Button>
      </div>

      {/* Draggable list */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={sectionOrder} strategy={verticalListSortingStrategy}>
          <div className="flex flex-col gap-1.5">
            {sectionOrder.map((id) => (
              <SortableItem
                key={id}
                id={id}
                locked={id === "home"}
                visible
                onToggleVisibility={() => hideSection(id)}
              />
            ))}
          </div>
        </SortableContext>

        <DragOverlay dropAnimation={{ duration: 150, easing: "ease" }}>
          {activeId ? <DragItem id={activeId} /> : null}
        </DragOverlay>
      </DndContext>

      {/* Hidden sections */}
      {hiddenIds.length > 0 && (
        <div className="flex flex-col gap-1.5">
          <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground/60">
            Hidden
          </p>
          {hiddenIds.map((id) => (
            <div
              key={id}
              className="flex items-center gap-2 rounded-lg border border-dashed border-border/60 bg-muted/30 px-3 py-2 opacity-60"
            >
              <GripVertical className="size-4 shrink-0 text-muted-foreground/40" />
              <span className="flex-1 text-sm font-medium text-muted-foreground line-through">
                {SECTION_LABELS[id] ?? id}
              </span>
              <button
                onClick={() => showSection(id)}
                className="text-muted-foreground/60 hover:text-foreground transition-colors"
                aria-label="Show section"
              >
                <EyeOff className="size-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}

      <p className="text-[11px] text-muted-foreground/60">
        Drag to reorder · toggle eye to hide
      </p>
    </div>
  );
}
