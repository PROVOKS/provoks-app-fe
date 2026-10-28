"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
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
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import {
  ChevronRight,
  Eye,
  GripVertical,
  HelpCircle,
  List,
  Loader2,
  Minus,
  Paperclip,
  Pencil,
  Play,
  Plus,
  Presentation,
  Settings2,
  Trash2,
  Upload,
  Code2,
  FileText,
  Grid2x2,
  CheckCircle2,
} from "lucide-react";

import { ConfirmDeleteDialog } from "@/components/admin/confirm-delete-dialog";
import { BlockDialog, BLOCK_TYPES } from "@/components/admin/course/block-dialog";
import {
  CoursePartDialog,
  type CoursePartValues,
} from "@/components/admin/course/course-part-dialog";
import {
  CourseSettingsDialog,
  type CourseSettingsValues,
} from "@/components/admin/course/course-settings-dialog";
import { QuizBuilderDialog } from "@/components/admin/course/quiz-builder-dialog";
import {
  SilabusPartDialog,
  type SilabusPartValues,
} from "@/components/admin/course/silabus-part-dialog";
import { SortableItem, StructureTree } from "@/components/admin/course/structure-tree";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { useCourseDetail, useCourseMutations } from "@/hooks/use-course-detail";
import { api, type ApiEnvelope } from "@/lib/api-client";
import type { BlockType, ContentBlock, CoursePart, Paginated, Path, SilabusPart, Tag } from "@/types";

const BLOCK_ICON: Record<BlockType, React.ComponentType<{ className?: string }>> = {
  HEADING: List,
  PARAGRAPH: FileText,
  IMAGE: Grid2x2,
  DIVIDER: Minus,
  VIDEO: Play,
  CODE: Code2,
  CALLOUT: HelpCircle,
  QUIZ: CheckCircle2,
  PDF: FileText,
  SLIDES: Presentation,
  FILE: Paperclip,
};

const BLOCK_LABEL: Record<BlockType, string> = Object.fromEntries(
  BLOCK_TYPES.map((item) => [item.value, item.label]),
) as Record<BlockType, string>;

function blockPreview(block: ContentBlock) {
  const content = block.content ?? {};
  const text = (key: string) => String(content[key] ?? "");
  const fallback = (label: string) => text("title") || label;

  switch (block.type) {
    case "HEADING":
      return text("text") || "Judul bagian";
    case "PARAGRAPH": {
      const html = String(content.html ?? "");
      const plain = html
        ? html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim()
        : String(content.text ?? "");
      return plain.slice(0, 90) || "Paragraf materi";
    }
    case "IMAGE":
      return text("caption") || text("alt") || "Gambar pendukung";
    case "DIVIDER":
      return "Garis pemisah";
    case "VIDEO":
      return fallback("Video");
    case "CODE":
      return text("code").slice(0, 70) || "Code block";
    case "CALLOUT":
      return text("text").slice(0, 90) || "Catatan penting";
    case "QUIZ":
      return `${block.questions?.length ?? 0} soal`;
    case "PDF":
      return fallback("Dokumen PDF");
    case "SLIDES":
      return fallback("Slide presentasi");
    case "FILE":
      return fallback("Lampiran");
    default:
      return "";
  }
}

type ConfirmState = {
  title: string;
  description: string;
  onConfirm: () => void;
} | null;

export function CourseDetail({ courseId }: { courseId: string }) {
  const { data: course, isLoading, isError } = useCourseDetail(courseId);
  const mutations = useCourseMutations(courseId);

  const { data: paths } = useQuery({
    queryKey: ["paths", "options"],
    queryFn: async () => {
      const { data } = await api.get<ApiEnvelope<Paginated<Path>>>("/paths", {
        params: { perPage: 100 },
      });
      return data.data.items;
    },
  });

  const { data: tags } = useQuery({
    queryKey: ["tags", "options"],
    queryFn: async () => {
      const { data } = await api.get<ApiEnvelope<Paginated<Tag>>>("/tags", {
        params: { perPage: 100 },
      });
      return data.data.items;
    },
  });

  const [activeId, setActiveId] = useState<string | null>(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [partOpen, setPartOpen] = useState(false);
  const [editingPart, setEditingPart] = useState<CoursePart | null>(null);
  const [silabusOpen, setSilabusOpen] = useState(false);
  const [editingSilabus, setEditingSilabus] = useState<SilabusPart | null>(null);
  const [silabusPartId, setSilabusPartId] = useState<string | undefined>();
  const [blockOpen, setBlockOpen] = useState(false);
  const [editingBlock, setEditingBlock] = useState<ContentBlock | null>(null);
  const [quizOpen, setQuizOpen] = useState(false);
  const [confirm, setConfirm] = useState<ConfirmState>(null);

  const [draftTitle, setDraftTitle] = useState("");
  const [draftSlug, setDraftSlug] = useState("");

  const parts = useMemo(() => course?.parts ?? [], [course]);

  const activeSilabus = useMemo(() => {
    for (const part of parts) {
      const found = (part.silabusParts ?? []).find((item) => item.id === activeId);
      if (found) return found;
    }
    return null;
  }, [parts, activeId]);

  useEffect(() => {
    if (activeSilabus) {
      setDraftTitle(activeSilabus.title);
      setDraftSlug(activeSilabus.slug);
    }
  }, [activeSilabus]);

  const blocks = useMemo(() => activeSilabus?.blocks ?? [], [activeSilabus]);

  // Nilai terbaru dibaca lewat ref supaya callback di bawah tidak berubah
  // identitasnya setiap kali silabus part dipilih (dialog jadi tidak re-render).
  const latest = useRef({ activeSilabus, blocks });
  latest.current = { activeSilabus, blocks };

  const updateCourseMutate = mutations.updateCourse.mutate;
  const createPartMutate = mutations.createPart.mutate;
  const updatePartMutate = mutations.updatePart.mutate;
  const createSilabusMutate = mutations.createSilabus.mutate;
  const updateSilabusMutate = mutations.updateSilabus.mutate;
  const createBlockMutate = mutations.createBlock.mutate;
  const updateBlockMutate = mutations.updateBlock.mutate;
  const createQuestionMutate = mutations.createQuestion.mutate;
  const updateQuestionMutate = mutations.updateQuestion.mutate;
  const deleteQuestionMutate = mutations.deleteQuestion.mutate;
  const importQuizMutate = mutations.importQuiz.mutate;

  const handleSettingsSubmit = useCallback(
    (values: CourseSettingsValues) => {
      updateCourseMutate(
        {
          title: values.title,
          description: values.description,
          status: values.status,
          passingGrade: values.passingGrade,
          pathId: values.pathId || null,
          blockedByCourseId: values.blockedByCourseId || null,
          tagIds: values.tagIds,
        },
        { onSuccess: () => setSettingsOpen(false) },
      );
    },
    [updateCourseMutate],
  );

  const handlePartSubmit = useCallback(
    (values: CoursePartValues) => {
      if (editingPart) {
        updatePartMutate(
          { id: editingPart.id, ...values },
          { onSuccess: () => setPartOpen(false) },
        );
      } else {
        createPartMutate(values, { onSuccess: () => setPartOpen(false) });
      }
    },
    [editingPart, createPartMutate, updatePartMutate],
  );

  const handleSilabusSubmit = useCallback(
    (values: SilabusPartValues) => {
      if (editingSilabus) {
        updateSilabusMutate(
          { id: editingSilabus.id, ...values },
          { onSuccess: () => setSilabusOpen(false) },
        );
      } else {
        createSilabusMutate(values, { onSuccess: () => setSilabusOpen(false) });
      }
    },
    [editingSilabus, createSilabusMutate, updateSilabusMutate],
  );

  const handleBlockSubmit = useCallback(
    ({ type, content }: { type: BlockType; content: Record<string, unknown> }) => {
      const current = latest.current.activeSilabus;
      if (editingBlock) {
        updateBlockMutate(
          { id: editingBlock.id, type, content },
          { onSuccess: () => setBlockOpen(false) },
        );
      } else if (current) {
        createBlockMutate(
          {
            silabusPartId: current.id,
            type,
            content,
            order: latest.current.blocks.length,
          },
          { onSuccess: () => setBlockOpen(false) },
        );
      }
    },
    [editingBlock, createBlockMutate, updateBlockMutate],
  );

  const handleCreateQuestion = useCallback(
    (payload: Record<string, unknown>) => createQuestionMutate(payload),
    [createQuestionMutate],
  );

  const handleUpdateQuestion = useCallback(
    (payload: { id: string } & Record<string, unknown>) =>
      updateQuestionMutate(payload),
    [updateQuestionMutate],
  );

  const handleDeleteQuestion = useCallback(
    (id: string) => deleteQuestionMutate(id),
    [deleteQuestionMutate],
  );

  const handleImportQuiz = useCallback(
    (payload: { questions: { q: string; options: string[]; answer: number }[] }) => {
      const quizBlock = latest.current.blocks.find((block) => block.type === "QUIZ");
      if (quizBlock) importQuizMutate({ blockId: quizBlock.id, payload });
    },
    [importQuizMutate],
  );

  const handleConfirmOpenChange = useCallback((open: boolean) => {
    if (!open) setConfirm(null);
  }, []);

  const handleConfirm = useCallback(() => confirm?.onConfirm(), [confirm]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
  );

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4">
        <Skeleton className="h-16 w-full" />
        <div className="grid grid-cols-1 gap-[18px] lg:grid-cols-[380px_minmax(0,1fr)]">
          <Skeleton className="h-[600px]" />
          <Skeleton className="h-[600px]" />
        </div>
      </div>
    );
  }

  if (isError || !course) {
    return (
      <p className="py-24 text-center text-sm text-muted-foreground">
        Course tidak ditemukan.
      </p>
    );
  }

  function handleBlockDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = blocks.findIndex((block) => block.id === active.id);
    const newIndex = blocks.findIndex((block) => block.id === over.id);
    if (oldIndex < 0 || newIndex < 0) return;
    const next = arrayMove(blocks, oldIndex, newIndex);
    mutations.reorderBlocks.mutate(
      next.map((block, index) => ({ id: block.id, order: index })),
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <nav className="flex items-center gap-2 text-[13px] text-muted-foreground">
          <Link href="/dashboard/courses" className="hover:text-foreground">
            Manajemen Kursus
          </Link>
          <ChevronRight className="size-3.5" />
          <span className="font-semibold text-foreground">{course.title}</span>
        </nav>

        <div className="flex h-16 items-center justify-between">
          <div className="flex min-w-0 items-center gap-3.5">
            <span className="size-14 shrink-0 rounded-2xl border border-border bg-secondary/25" />
            <h1 className="truncate font-heading text-2xl font-bold">
              {course.title}
            </h1>
          </div>
          <div className="flex shrink-0 items-center gap-2.5">
            <Button variant="outline" asChild>
              <Link href={`/dashboard/courses/${courseId}/preview`}>
                <Eye className="size-4" />
                Preview
              </Link>
            </Button>
            <Button variant="outline" onClick={() => setSettingsOpen(true)}>
              <Settings2 className="size-4" />
              Pengaturan Kursus
            </Button>
            <Button
              onClick={() =>
                mutations.updateCourse.mutate({
                  status: course.status === "PUBLISHED" ? "DRAFT" : "PUBLISHED",
                })
              }
              disabled={mutations.updateCourse.isPending}
            >
              {mutations.updateCourse.isPending ? (
                <Loader2 className="size-4 animate-spin" />
              ) : null}
              {course.status === "PUBLISHED" ? "Jadikan Draft" : "Publikasikan"}
            </Button>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="grid grid-cols-1 items-start gap-[18px] lg:grid-cols-[380px_minmax(0,1fr)]">
        {/* Struktur konten */}
        <div className="flex flex-col gap-3.5 rounded-[20px] border border-border bg-card p-5">
          <div className="flex items-center justify-between">
            <p className="font-heading text-[15px] font-semibold">
              Struktur Konten
            </p>
            <span className="text-[11px] text-muted-foreground">
              {parts.length} part
            </span>
          </div>
          <div className="h-px bg-border" />

          {parts.length === 0 ? (
            <div className="flex flex-col items-center gap-2.5 rounded-2xl bg-muted py-10 text-center">
              <span className="grid size-12 place-items-center rounded-full bg-card">
                <Grid2x2 className="size-5 text-muted-foreground" />
              </span>
              <p className="text-sm font-semibold">Belum ada course part</p>
              <p className="max-w-[280px] text-xs text-muted-foreground">
                Tambah part dulu, lalu isi silabus part di dalamnya.
              </p>
              <Button variant="outline" size="sm" onClick={() => { setEditingPart(null); setPartOpen(true); }}>
                <Plus className="size-4" />
                Tambah Part
              </Button>
            </div>
          ) : (
            <StructureTree
              parts={parts}
              activeSilabusId={activeId}
              onSelectSilabus={(item) => setActiveId(item.id)}
              onReorderParts={(items) => mutations.reorderParts.mutate(items)}
              onReorderSilabus={(items) => mutations.reorderSilabus.mutate(items)}
              onAddPart={() => {
                setEditingPart(null);
                setPartOpen(true);
              }}
              onEditPart={(part) => {
                setEditingPart(part);
                setPartOpen(true);
              }}
              onDeletePart={(part) =>
                setConfirm({
                  title: `Hapus part "${part.name}"?`,
                  description:
                    "Semua silabus part dan blok konten di dalamnya akan ikut terhapus.",
                  onConfirm: () => {
                    mutations.deletePart.mutate(part.id);
                    if (part.silabusParts?.some((item) => item.id === activeId)) {
                      setActiveId(null);
                    }
                    setConfirm(null);
                  },
                })
              }
              onAddSilabus={(part) => {
                setEditingSilabus(null);
                setSilabusPartId(part.id);
                setSilabusOpen(true);
              }}
              onEditSilabus={(item) => {
                setEditingSilabus(item);
                setSilabusOpen(true);
              }}
              onDeleteSilabus={(item) =>
                setConfirm({
                  title: `Hapus silabus part "${item.title}"?`,
                  description: "Blok konten di dalamnya akan ikut terhapus.",
                  onConfirm: () => {
                    mutations.deleteSilabus.mutate(item.id);
                    if (item.id === activeId) setActiveId(null);
                    setConfirm(null);
                  },
                })
              }
            />
          )}
        </div>

        {/* Editor */}
        <div className="flex flex-col gap-4 rounded-[20px] border border-border bg-card p-6">
          {!activeSilabus ? (
            <div className="flex flex-col items-center gap-2.5 py-20 text-center">
              <span className="grid size-12 place-items-center rounded-full bg-muted">
                <FileText className="size-5 text-muted-foreground" />
              </span>
              <p className="text-sm font-semibold">Belum ada silabus part dipilih</p>
              <p className="max-w-[320px] text-xs text-muted-foreground">
                Pilih silabus part di kiri, atau tambah course part terlebih
                dahulu.
              </p>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-[13px] text-muted-foreground">
                  <span>{course.title}</span>
                  <ChevronRight className="size-3.5" />
                  <span className="font-semibold text-foreground">
                    {activeSilabus.title}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setEditingSilabus(activeSilabus);
                      setSilabusOpen(true);
                    }}
                  >
                    <Settings2 className="size-4" />
                    Konfigurasi
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="silabus-title-field">Judul Silabus Part</Label>
                  <Input
                    id="silabus-title-field"
                    value={draftTitle}
                    onChange={(event) => setDraftTitle(event.target.value)}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="silabus-slug-field">Slug</Label>
                  <Input
                    id="silabus-slug-field"
                    className="font-mono text-[13px]"
                    value={draftSlug}
                    onChange={(event) => setDraftSlug(event.target.value)}
                  />
                </div>
              </div>

              {(draftTitle !== activeSilabus.title ||
                draftSlug !== activeSilabus.slug) && (
                <div className="flex justify-end">
                  <Button
                    size="sm"
                    disabled={mutations.updateSilabus.isPending}
                    onClick={() =>
                      mutations.updateSilabus.mutate({
                        id: activeSilabus.id,
                        title: draftTitle,
                        slug: draftSlug,
                      })
                    }
                  >
                    {mutations.updateSilabus.isPending ? (
                      <Loader2 className="size-4 animate-spin" />
                    ) : null}
                    Simpan Perubahan
                  </Button>
                </div>
              )}

              <div className="h-px bg-border" />

              <div className="flex items-center justify-between">
                <p className="font-heading text-[15px] font-semibold">
                  Content Blocks
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setEditingBlock(null);
                    setBlockOpen(true);
                  }}
                >
                  <Plus className="size-4" />
                  Tambah block
                </Button>
              </div>

              {blocks.length === 0 ? (
                <p className="py-10 text-center text-sm text-muted-foreground">
                  Belum ada block konten.
                </p>
              ) : (
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={handleBlockDragEnd}
                >
                  <SortableContext
                    items={blocks.map((block) => block.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    <div className="flex flex-col gap-2.5">
                      {blocks.map((block) => {
                        const Icon = BLOCK_ICON[block.type];
                        return (
                          <SortableItem key={block.id} id={block.id}>
                            {({ listeners, attributes }) => (
                              <div className="flex min-w-0 items-center justify-between gap-3 rounded-xl border border-border p-3 px-3.5">
                                <div className="flex min-w-0 items-center gap-3">
                                  <button
                                    type="button"
                                    {...attributes}
                                    {...listeners}
                                    className="grid size-5 shrink-0 cursor-grab place-items-center rounded text-muted-foreground active:cursor-grabbing"
                                    aria-label="Ubah urutan block"
                                  >
                                    <GripVertical className="size-3.5" />
                                  </button>
                                  <span className="grid size-8 shrink-0 place-items-center rounded-[10px] bg-muted">
                                    <Icon className="size-4 text-muted-foreground" />
                                  </span>
                                  <div className="flex min-w-0 flex-col">
                                    <span className="truncate text-[13px] font-medium">
                                      {blockPreview(block)}
                                    </span>
                                    <span className="text-xs text-muted-foreground">
                                      {BLOCK_LABEL[block.type]}
                                    </span>
                                  </div>
                                </div>

                                <div className="flex shrink-0 items-center gap-2">
                                  <Badge variant="secondary">
                                    {BLOCK_LABEL[block.type]}
                                  </Badge>
                                  <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                      <button
                                        type="button"
                                        aria-label="Aksi block"
                                        className="grid size-7 place-items-center rounded-lg text-muted-foreground hover:bg-muted"
                                      >
                                        <Pencil className="size-3.5" />
                                      </button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="w-44">
                                      <DropdownMenuItem
                                        onClick={() => {
                                          setEditingBlock(block);
                                          setBlockOpen(true);
                                        }}
                                      >
                                        <Pencil />
                                        Edit block
                                      </DropdownMenuItem>
                                      {block.type === "QUIZ" ? (
                                        <DropdownMenuItem onClick={() => setQuizOpen(true)}>
                                          <List />
                                          Kelola soal
                                        </DropdownMenuItem>
                                      ) : null}
                                      <DropdownMenuSeparator />
                                      <DropdownMenuItem
                                        variant="destructive"
                                        onClick={() =>
                                          setConfirm({
                                            title: "Hapus block ini?",
                                            description:
                                              "Block beserta soal kuis di dalamnya akan dihapus.",
                                            onConfirm: () => {
                                              mutations.deleteBlock.mutate(block.id);
                                              setConfirm(null);
                                            },
                                          })
                                        }
                                      >
                                        <Trash2 />
                                        Hapus block
                                      </DropdownMenuItem>
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                </div>
                              </div>
                            )}
                          </SortableItem>
                        );
                      })}
                    </div>
                  </SortableContext>
                </DndContext>
              )}
            </>
          )}
        </div>
      </div>

      {/* Dialogs */}
      <CourseSettingsDialog
        open={settingsOpen}
        onOpenChange={setSettingsOpen}
        course={course}
        paths={paths ?? []}
        tags={tags ?? []}
        isPending={mutations.updateCourse.isPending}
        onSubmit={handleSettingsSubmit}
      />

      <CoursePartDialog
        open={partOpen}
        onOpenChange={setPartOpen}
        part={editingPart}
        isPending={mutations.createPart.isPending || mutations.updatePart.isPending}
        onSubmit={handlePartSubmit}
      />

      <SilabusPartDialog
        open={silabusOpen}
        onOpenChange={setSilabusOpen}
        silabusPart={editingSilabus}
        courseParts={parts}
        defaultCoursePartId={silabusPartId}
        isPending={mutations.createSilabus.isPending || mutations.updateSilabus.isPending}
        onSubmit={handleSilabusSubmit}
      />

      <BlockDialog
        open={blockOpen}
        onOpenChange={setBlockOpen}
        block={editingBlock}
        isPending={mutations.createBlock.isPending || mutations.updateBlock.isPending}
        onSubmit={handleBlockSubmit}
      />

      <QuizBuilderDialog
        open={quizOpen}
        onOpenChange={setQuizOpen}
        block={blocks.find((block) => block.type === "QUIZ") ?? null}
        isPending={
          mutations.createQuestion.isPending ||
          mutations.updateQuestion.isPending ||
          mutations.importQuiz.isPending
        }
        onCreateQuestion={handleCreateQuestion}
        onUpdateQuestion={handleUpdateQuestion}
        onDeleteQuestion={handleDeleteQuestion}
        onImport={handleImportQuiz}
      />

      <ConfirmDeleteDialog
        open={Boolean(confirm)}
        onOpenChange={handleConfirmOpenChange}
        title={confirm?.title}
        description={confirm?.description}
        isPending={
          mutations.deletePart.isPending ||
          mutations.deleteSilabus.isPending ||
          mutations.deleteBlock.isPending
        }
        onConfirm={handleConfirm}
      />
    </div>
  );
}
