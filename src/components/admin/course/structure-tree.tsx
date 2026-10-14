"use client";

import { useState, type ReactNode } from "react";
import {
  DndContext,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  ChevronDown,
  ChevronRight,
  FileText,
  GripVertical,
  Pencil,
  Plus,
  Trash2,
  Video,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import type { CoursePart, SilabusPart } from "@/types";

type ReorderItem = { id: string; order: number };

function DragHandle({ listeners, attributes }: { listeners?: Record<string, unknown>; attributes?: Record<string, unknown> }) {
  return (
    <button
      type="button"
      {...attributes}
      {...listeners}
      className="grid size-5 shrink-0 cursor-grab place-items-center rounded text-muted-foreground active:cursor-grabbing"
      aria-label="Ubah urutan"
    >
      <GripVertical className="size-3.5" />
    </button>
  );
}

export function SortableItem({
  id,
  children,
}: {
  id: string;
  children: (handle: { listeners?: Record<string, unknown>; attributes?: Record<string, unknown> }) => ReactNode;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id });

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={cn(isDragging && "opacity-60")}
    >
      {children({
        listeners: listeners as unknown as Record<string, unknown>,
        attributes: attributes as unknown as Record<string, unknown>,
      })}
    </div>
  );
}

function SilabusIcon({ type }: { type: SilabusPart["type"] }) {
  if (type === "VIDEO") return <Video className="size-3.5" />;
  return <FileText className="size-3.5" />;
}

export function StructureTree({
  parts,
  activeSilabusId,
  onSelectSilabus,
  onReorderParts,
  onReorderSilabus,
  onAddPart,
  onEditPart,
  onDeletePart,
  onAddSilabus,
  onEditSilabus,
  onDeleteSilabus,
}: {
  parts: CoursePart[];
  activeSilabusId: string | null;
  onSelectSilabus: (silabusPart: SilabusPart) => void;
  onReorderParts: (items: ReorderItem[]) => void;
  onReorderSilabus: (items: ReorderItem[]) => void;
  onAddPart: () => void;
  onEditPart: (part: CoursePart) => void;
  onDeletePart: (part: CoursePart) => void;
  onAddSilabus: (part: CoursePart) => void;
  onEditSilabus: (silabusPart: SilabusPart) => void;
  onDeleteSilabus: (silabusPart: SilabusPart) => void;
}) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
  );
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

  function handlePartDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = parts.findIndex((part) => part.id === active.id);
    const newIndex = parts.findIndex((part) => part.id === over.id);
    if (oldIndex < 0 || newIndex < 0) return;
    const next = arrayMove(parts, oldIndex, newIndex);
    onReorderParts(next.map((part, index) => ({ id: part.id, order: index })));
  }

  function handleSilabusDragEnd(part: CoursePart, event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const items = part.silabusParts ?? [];
    const oldIndex = items.findIndex((item) => item.id === active.id);
    const newIndex = items.findIndex((item) => item.id === over.id);
    if (oldIndex < 0 || newIndex < 0) return;
    const next = arrayMove(items, oldIndex, newIndex);
    onReorderSilabus(next.map((item, index) => ({ id: item.id, order: index })));
  }

  return (
    <div className="flex flex-col gap-3">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handlePartDragEnd}
      >
        <SortableContext
          items={parts.map((part) => part.id)}
          strategy={verticalListSortingStrategy}
        >
          {parts.map((part) => {
            const items = part.silabusParts ?? [];
            const isCollapsed = collapsed[part.id];
            const totalMinutes = items.reduce(
              (total, item) => total + item.durationMinutes,
              0,
            );

            return (
              <SortableItem key={part.id} id={part.id}>
                {({ listeners, attributes }) => (
                  <div className="flex flex-col gap-1.5">
                    <div className="flex h-11 items-center justify-between rounded-[10px] bg-muted px-2.5">
                      <div className="flex min-w-0 items-center gap-2">
                        <DragHandle listeners={listeners} attributes={attributes} />
                        <button
                          type="button"
                          onClick={() =>
                            setCollapsed((prev) => ({
                              ...prev,
                              [part.id]: !prev[part.id],
                            }))
                          }
                          className="grid size-5 place-items-center text-muted-foreground"
                          aria-label="Buka/tutup part"
                        >
                          {isCollapsed ? (
                            <ChevronRight className="size-4" />
                          ) : (
                            <ChevronDown className="size-4" />
                          )}
                        </button>
                        <span className="truncate text-[13px] font-semibold">
                          {part.name}
                        </span>
                        <span className="shrink-0 text-[11px] text-muted-foreground">
                          {items.length} silabus
                        </span>
                      </div>

                      <div className="flex shrink-0 items-center gap-2">
                        <span className="text-[11px] font-semibold text-muted-foreground">
                          {totalMinutes} mnt
                        </span>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button
                              type="button"
                              aria-label={`Aksi ${part.name}`}
                              className="grid size-7 place-items-center rounded-lg text-muted-foreground hover:bg-card"
                            >
                              <Pencil className="size-3.5" />
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuItem onClick={() => onEditPart(part)}>
                              <Pencil />
                              Edit part
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => onAddSilabus(part)}>
                              <Plus />
                              Tambah silabus part
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              variant="destructive"
                              onClick={() => onDeletePart(part)}
                            >
                              <Trash2 />
                              Hapus part
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>

                    {!isCollapsed ? (
                      <DndContext
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragEnd={(event) => handleSilabusDragEnd(part, event)}
                      >
                        <SortableContext
                          items={items.map((item) => item.id)}
                          strategy={verticalListSortingStrategy}
                        >
                          <div className="flex flex-col gap-0.5">
                            {items.map((item) => {
                              const active = item.id === activeSilabusId;
                              return (
                                <SortableItem key={item.id} id={item.id}>
                                  {({ listeners: itemListeners, attributes: itemAttributes }) => (
                                    <div
                                      className={cn(
                                        "flex h-11 items-center justify-between rounded-[10px] px-2.5",
                                        active ? "bg-primary/10" : "hover:bg-muted/60",
                                      )}
                                    >
                                      <div className="flex min-w-0 items-center gap-2">
                                        <DragHandle
                                          listeners={itemListeners}
                                          attributes={itemAttributes}
                                        />
                                        <span
                                          className={cn(
                                            "grid size-5 shrink-0 place-items-center rounded-full",
                                            active
                                              ? "bg-primary/15 text-primary"
                                              : "bg-muted text-muted-foreground",
                                          )}
                                        >
                                          <SilabusIcon type={item.type} />
                                        </span>
                                        <button
                                          type="button"
                                          onClick={() => onSelectSilabus(item)}
                                          className={cn(
                                            "truncate text-[13px] text-left",
                                            active
                                              ? "font-semibold text-primary"
                                              : "text-foreground",
                                          )}
                                        >
                                          {item.title}
                                        </button>
                                      </div>

                                      <div className="flex shrink-0 items-center gap-2">
                                        <span className="text-[11px] text-muted-foreground">
                                          {item.durationMinutes} mnt
                                        </span>
                                        <DropdownMenu>
                                          <DropdownMenuTrigger asChild>
                                            <button
                                              type="button"
                                              aria-label={`Aksi ${item.title}`}
                                              className="grid size-7 place-items-center rounded-lg text-muted-foreground hover:bg-card"
                                            >
                                              <Pencil className="size-3.5" />
                                            </button>
                                          </DropdownMenuTrigger>
                                          <DropdownMenuContent align="end" className="w-40">
                                            <DropdownMenuItem
                                              onClick={() => onEditSilabus(item)}
                                            >
                                              <Pencil />
                                              Edit
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem
                                              variant="destructive"
                                              onClick={() => onDeleteSilabus(item)}
                                            >
                                              <Trash2 />
                                              Hapus
                                            </DropdownMenuItem>
                                          </DropdownMenuContent>
                                        </DropdownMenu>
                                      </div>
                                    </div>
                                  )}
                                </SortableItem>
                              );
                            })}

                            <button
                              type="button"
                              onClick={() => onAddSilabus(part)}
                              className="flex h-9 items-center gap-2 rounded-[10px] px-2.5 pl-9 text-xs text-muted-foreground hover:bg-muted/60"
                            >
                              <Plus className="size-3.5" />
                              Tambah silabus part
                            </button>
                          </div>
                        </SortableContext>
                      </DndContext>
                    ) : null}
                  </div>
                )}
              </SortableItem>
            );
          })}
        </SortableContext>
      </DndContext>

      <button
        type="button"
        onClick={onAddPart}
        className="flex h-10 items-center justify-center gap-2 rounded-[10px] border border-border text-[13px] font-semibold hover:bg-muted/60"
      >
        <Plus className="size-4" />
        Tambah Part
      </button>
    </div>
  );
}
