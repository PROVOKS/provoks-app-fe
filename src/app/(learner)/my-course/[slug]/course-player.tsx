"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  BookOpen,
  Check,
  ChevronDown,
  ChevronRight,
  Clock,
  FileText,
  HelpCircle,
  Lock,
  Play,
  Sparkles,
} from "lucide-react";

import { BlockRenderer } from "@/components/learner/block-renderer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useLearningCourse,
  useUpdateProgress,
  type LearningSilabusPart,
} from "@/hooks/use-learning";
import { cn } from "@/lib/utils";

export function CoursePlayer({ slug }: { slug: string }) {
  const { data, isLoading, isError, error } = useLearningCourse(slug);
  const updateProgress = useUpdateProgress(slug);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

  const course = data?.course;
  const summary = data?.summary;

  const flat = useMemo<LearningSilabusPart[]>(
    () => (course?.parts ?? []).flatMap((part) => part.silabusParts),
    [course],
  );

  // auto pilih materi pertama yang terbuka & belum selesai
  useEffect(() => {
    if (activeId || flat.length === 0) return;
    const target =
      flat.find((item) => item.unlocked && !item.completed) ??
      flat.find((item) => item.unlocked) ??
      flat[0];
    setActiveId(target.id);
  }, [flat, activeId]);

  const active = flat.find((item) => item.id === activeId) ?? null;
  const index = active ? flat.findIndex((item) => item.id === active.id) : -1;
  const prev = index > 0 ? flat[index - 1] : null;
  const next = index >= 0 && index < flat.length - 1 ? flat[index + 1] : null;
  const nextLocked = Boolean(next && !next.unlocked);

  if (isLoading) {
    return (
      <div className="grid grid-cols-[320px_1fr] gap-[18px]">
        <Skeleton className="h-[600px]" />
        <Skeleton className="h-[600px]" />
      </div>
    );
  }

  if (isError || !course) {
    const message = (error as Error)?.message ?? "Course tidak ditemukan";
    const locked = message.toLowerCase().includes("terkunci");

    return (
      <div className="flex flex-col items-center gap-3 rounded-2xl border border-border bg-card px-6 py-20 text-center">
        <span className="grid size-12 place-items-center rounded-full bg-muted">
          {locked ? (
            <Lock className="size-5 text-muted-foreground" />
          ) : (
            <BookOpen className="size-5 text-muted-foreground" />
          )}
        </span>
        <p className="font-heading text-[17px] font-semibold">
          {locked ? "Course masih terkunci" : "Course tidak bisa dibuka"}
        </p>
        <p className="max-w-[380px] text-[13px] text-muted-foreground">{message}</p>
        <Button asChild size="sm" variant="outline" className="mt-1">
          <Link href="/my-course">Kembali ke My Learning</Link>
        </Button>
      </div>
    );
  }

  const quizBlock = active?.blocks.find((block) => block.type === "QUIZ") ?? null;
  const quizPassed = active?.quizPassed ?? false;

  return (
    <div className="flex flex-col gap-4">
      {/* Progress course */}
      <div className="flex items-center gap-4 rounded-2xl border border-border bg-card p-4">
        <div className="flex min-w-0 flex-col gap-1">
          <span className="truncate font-heading text-[15px] font-semibold">
            {course.title}
          </span>
          <span className="text-xs text-muted-foreground">
            {summary?.done ?? 0} dari {summary?.total ?? 0} materi selesai
          </span>
        </div>
        <div className="flex flex-1 items-center gap-3">
          <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
            <div
              style={{ width: `${summary?.progressPercent ?? 0}%` }}
              className="h-full rounded-full bg-primary transition-all"
            />
          </div>
          <span className="w-10 shrink-0 text-right text-xs font-semibold text-primary">
            {summary?.progressPercent ?? 0}%
          </span>
        </div>
      </div>

      <div className="grid grid-cols-[320px_1fr] items-start gap-[18px]">
        {/* Silabus */}
        <div className="sticky top-0 flex max-h-[calc(100vh-180px)] flex-col gap-3.5 overflow-y-auto rounded-2xl border border-border bg-card p-4">
          <div className="flex flex-col gap-0.5">
            <p className="font-heading text-[15px] font-semibold">Silabus</p>
            <p className="text-xs text-muted-foreground">{course.title}</p>
          </div>
          <div className="h-px bg-border" />

          <div className="flex flex-col gap-3">
            {course.parts.map((part) => {
              const isCollapsed = collapsed[part.id];
              const items = part.silabusParts;
              return (
                <div key={part.id} className="flex flex-col gap-1.5">
                  <button
                    type="button"
                    onClick={() =>
                      setCollapsed((prevState) => ({
                        ...prevState,
                        [part.id]: !prevState[part.id],
                      }))
                    }
                    className="flex h-10 items-center gap-2 rounded-[10px] bg-muted px-2.5 text-left"
                  >
                    {isCollapsed ? (
                      <ChevronRight className="size-4 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="size-4 text-muted-foreground" />
                    )}
                    <span className="truncate text-[13px] font-semibold">
                      {part.name}
                    </span>
                    <span className="shrink-0 text-[11px] text-muted-foreground">
                      {items.length} silabus
                    </span>
                  </button>

                  {!isCollapsed ? (
                    <div className="flex flex-col gap-0.5">
                      {items.map((item) => {
                        const isActive = item.id === activeId;
                        return (
                          <button
                            key={item.id}
                            type="button"
                            disabled={!item.unlocked}
                            title={item.lockedReason ?? undefined}
                            onClick={() => item.unlocked && setActiveId(item.id)}
                            className={cn(
                              "flex h-11 items-center justify-between rounded-[10px] px-2.5 text-left transition-colors",
                              isActive
                                ? "bg-primary/10"
                                : item.unlocked
                                  ? "hover:bg-muted/60"
                                  : "cursor-not-allowed opacity-55",
                            )}
                          >
                            <span className="flex min-w-0 items-center gap-2.5">
                              <span
                                className={cn(
                                  "grid size-5 shrink-0 place-items-center rounded-full",
                                  item.completed
                                    ? "bg-primary text-primary-foreground"
                                    : isActive
                                      ? "bg-primary/15 text-primary"
                                      : "bg-muted text-muted-foreground",
                                )}
                              >
                                {!item.unlocked ? (
                                  <Lock className="size-3" />
                                ) : item.completed ? (
                                  <Check className="size-3" />
                                ) : item.type === "VIDEO" ? (
                                  <Play className="size-3" />
                                ) : (
                                  <FileText className="size-3" />
                                )}
                              </span>
                              <span
                                className={cn(
                                  "truncate text-[13px]",
                                  isActive && "font-semibold text-primary",
                                )}
                              >
                                {item.title}
                              </span>
                            </span>
                            <span className="flex shrink-0 items-center gap-1 text-[11px] text-muted-foreground">
                              <Clock className="size-3" />
                              {item.durationMinutes} mnt
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>
        </div>

        {/* Materi */}
        <div className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-7">
          {!active ? (
            <div className="flex flex-col items-center gap-2.5 py-24 text-center">
              <span className="grid size-12 place-items-center rounded-full bg-muted">
                <FileText className="size-5 text-muted-foreground" />
              </span>
              <p className="text-sm font-semibold">Belum ada materi</p>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-2 text-[13px] text-muted-foreground">
                <span>{course.title}</span>
                <ChevronRight className="size-3.5" />
                <span className="font-semibold text-foreground">
                  {active.title}
                </span>
              </div>

              <h1 className="font-heading text-[26px] font-bold">
                {active.title}
              </h1>

              <div className="flex flex-wrap items-center gap-2.5">
                <Badge variant="secondary" className="gap-1.5">
                  {active.type === "VIDEO" ? (
                    <Play className="size-3" />
                  ) : (
                    <FileText className="size-3" />
                  )}
                  {active.type}
                </Badge>
                <Badge variant="secondary" className="gap-1.5">
                  <Clock className="size-3" />
                  {active.durationMinutes} menit
                </Badge>
                {active.completed ? (
                  <Badge className="gap-1.5 bg-primary/10 text-primary">
                    <Check className="size-3" />
                    Selesai
                  </Badge>
                ) : null}
              </div>

              <div className="h-px bg-border" />

              {active.blocks.length === 0 ? (
                <p className="py-12 text-center text-sm text-muted-foreground">
                  Materi ini belum punya blok konten.
                </p>
              ) : (
                <div className="flex flex-col gap-6">
                  {active.blocks.map((block) =>
                    block.type === "QUIZ" ? (
                      <div
                        key={block.id}
                        className="flex items-center justify-between gap-3 rounded-xl bg-primary/10 p-3.5 px-4"
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="grid size-8.5 place-items-center rounded-[10px] bg-card">
                            <HelpCircle className="size-4 text-primary" />
                          </span>
                          <div className="flex flex-col">
                            <span className="text-[13px] font-semibold">
                              {String(block.content?.title ?? "Kuis")}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {block.questions?.length ?? 0} soal
                              {block.attempt
                                ? ` · skor terakhir ${block.attempt.score}`
                                : ""}
                            </span>
                          </div>
                        </div>
                        <Button asChild variant={quizPassed ? "outline" : "default"}>
                          <Link href={`/my-course/quiz/${block.id}`}>
                            {quizPassed ? "Lihat / Ulangi Quiz" : "Mulai Quiz"}
                          </Link>
                        </Button>
                      </div>
                    ) : (
                      <BlockRenderer key={block.id} block={block} />
                    ),
                  )}
                </div>
              )}

              <div className="h-px bg-border" />

              <div className="flex items-center justify-between">
                <Button
                  variant="outline"
                  disabled={!prev || !prev.unlocked}
                  onClick={() => prev?.unlocked && setActiveId(prev.id)}
                >
                  <ArrowLeft className="size-4" />
                  Sebelumnya
                </Button>

                <div className="flex items-center gap-2.5">
                  {active.hasQuiz ? (
                    quizPassed ? (
                      <Button
                        variant="outline"
                        onClick={() =>
                          updateProgress.mutate({
                            silabusPartId: active.id,
                            completed: !active.completed,
                          })
                        }
                        disabled={updateProgress.isPending}
                      >
                        <Check className="size-4" />
                        {active.completed ? "Tandai belum selesai" : "Tandai selesai"}
                      </Button>
                    ) : (
                      <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Sparkles className="size-3.5" />
                        Lulus kuis untuk membuka materi berikutnya
                      </span>
                    )
                  ) : (
                    <Button
                      variant="outline"
                      onClick={() =>
                        updateProgress.mutate({
                          silabusPartId: active.id,
                          completed: !active.completed,
                        })
                      }
                      disabled={updateProgress.isPending}
                    >
                      <Check className="size-4" />
                      {active.completed ? "Tandai belum selesai" : "Tandai selesai"}
                    </Button>
                  )}

                  <Button
                    disabled={!next || nextLocked}
                    onClick={() => next?.unlocked && setActiveId(next.id)}
                  >
                    Berikutnya
                  </Button>
                </div>
              </div>

              {nextLocked ? (
                <p className="text-center text-xs text-muted-foreground">
                  Selesaikan materi ini dulu untuk membuka &ldquo;{next?.title}
                  &rdquo;
                </p>
              ) : null}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
