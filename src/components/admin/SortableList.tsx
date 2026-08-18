import { ReactNode } from "react";
import {
  DndContext, closestCenter, PointerSensor, KeyboardSensor,
  useSensor, useSensors, type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy,
  useSortable, arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";

interface RowProps { id: string; children: ReactNode }

const SortableRow = ({ id, children }: RowProps) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={`flex items-start gap-2 ${isDragging ? "opacity-60 z-50 relative" : ""}`}
    >
      <button
        type="button"
        {...attributes}
        {...listeners}
        aria-label="Reordenar"
        className="mt-2 cursor-grab active:cursor-grabbing text-muted-foreground hover:text-primary touch-none flex-shrink-0"
      >
        <GripVertical className="w-4 h-4" />
      </button>
      <div className="flex-1 min-w-0">{children}</div>
    </div>
  );
};

interface Props<T> {
  items: T[];
  onReorder: (items: T[]) => void;
  getId?: (item: T, index: number) => string;
  renderItem: (item: T, index: number) => ReactNode;
  className?: string;
}

function SortableList<T>({ items, onReorder, getId, renderItem, className = "space-y-2" }: Props<T>) {
  const ids = items.map((it, i) => (getId ? getId(it, i) : `row-${i}`));
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (e: DragEndEvent) => {
    const { active, over } = e;
    if (!over || active.id === over.id) return;
    const from = ids.indexOf(String(active.id));
    const to = ids.indexOf(String(over.id));
    if (from < 0 || to < 0) return;
    onReorder(arrayMove(items, from, to));
  };

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={ids} strategy={verticalListSortingStrategy}>
        <div className={className}>
          {items.map((item, i) => (
            <SortableRow key={ids[i]} id={ids[i]}>{renderItem(item, i)}</SortableRow>
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}

export default SortableList;
