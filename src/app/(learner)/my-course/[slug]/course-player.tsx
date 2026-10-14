"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowLeft,
  Check,
  ChevronDown,
  ChevronRight,
  Clock,
  FileText,
  HelpCircle,
  Play,
} from "lucide-react";

import { BlockRenderer } from "@/components/learner/block-renderer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { api, type ApiEnvelope } from "@/lib/api-client";
import { cn } from "@/lib/utils";
import type { ContentBlock, Course, CoursePart, SilabusPart } from "@/types";

type CourseWithParts = Course & { parts: CoursePart[] };

export function CoursePlayer({ slug }: { slug: string }) {
  const { data: course, isLoading, isError } = useQuery({
    queryKey: ["course-by-slug", slug],
    queryFn: async () => {
      const { data } = await api.get<ApiEnvelope<CourseWithParts>>(
        `/courses/slug/${slug}`,
      );
      return data.data;
    },
  });

  const [activeId, setActiveId] = useState<string | null>(null);
  const [completed, setCompleted] = useState<Record<string, boolean>>({});
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

  const flat = useMemo<SilabusPart[]>(
    () => (course?.parts ?? []).flatMap((part) => part.silabusParts ?? []),
    [course],
  );

  useEffect(() => {
    if (!activeId && flat.length > 0) setActiveId(flat[0].id);
  }, [flat, activeId]);

  const active = flat.find((item) => item.id === activeId) ?? null;
  const index = active ? flat.findIndex((item) => item.id === active.id) : -1;
  const prev = index > 0 ? flat[index - 1] : null;
  const next = index >= 0 && index < flat.length - 1 ? flat[index + 1] : null;

  const doneCount = Object.values(completed).filter(Boolean).length;
  const progress = flat.length ? Math.round((doneCount / flat.length) * 100) : 0;

  if (isLoading) {
    return (
      <div className="grid grid-cols-[320px_1fr] gap-[18px]">
        <Skeleton className="h-[600px]" />
        <Skeleton className="h-[600px]" />
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

  const quizBlock = active?.blocks?.find(
    (block: ContentBlock) => block.type === "QUIZ",
  );

  return (
    <div className="flex flex-col gap-4">
      {/* Progress course */}
      <div className="flex items-center gap-4 rounded-2xl border border-border bg-card p-4">
        <div className="flex min-w-0 flex-col gap-1">
          <span className="truncate font-heading text-[15px] font-semibold">
            {course.title}
          </span>
          <span className="text-xs text-muted-foreground">
            {doneCount} dari {flat.length} silabus selesai
          </span>
        </div>
        <div className="flex flex-1 items-center gap-3">
          <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
            <div
              style={{ width: `${progress}%` }}
              className="h-full rounded-full bg-primary transition-all"
            />
          </div>
          <span className="w-10 shrink-0 text-right text-xs font-semibold text-primary">
            {progress}%
          </span>
        </div>
      </div>

      <div className="grid grid-cols-[320px_1fr] items-start gap-[18px]">
        {/* Silabus */}
        <div className="flex flex-col gap-3.5 rounded-2xl border border-border bg-card p-4">
          <div className="flex flex-col gap-0.5">
            <p className="font-heading text-[15px] font-semibold">Silabus</p>
            <p className="text-xs text-muted-foreground">{course.title}</p>
          </div>
          <div className="h-px bg-border" />

          <div className="flex flex-col gap-3">
            {(course.parts ?? []).map((part) => {
              const items = part.silabusParts ?? [];
              const isCollapsed = collapsed[part.id];
              return (
                <div key={part.id} className="flex flex-col gap-1.5">
                  <button
                    type="button"
                    onClick={() =>
                      setCollapsed((prev) => ({
                        ...prev,
                        [part.id]: !prev[part.id],
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
                        const isDone = completed[item.id];
                        return (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => setActiveId(item.id)}
                            className={cn(
                              "flex h-11 items-center justify-between rounded-[10px] px-2.5 text-left transition-colors",
                              isActive ? "bg-primary/10" : "hover:bg-muted/60",
                            )}
                          >
                            <span className="flex min-w-0 items-center gap-2.5">
                              <span
                                className={cn(
                                  "grid size-5 shrink-0 place-items-center rounded-full",
                                  isDone
                                    ? "bg-primary text-primary-foreground"
                                    : isActive
                                      ? "bg-primary/15 text-primary"
                                      : "bg-muted text-muted-foreground",
                                )}
                              >
                                {isDone ? (
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
              <p className="max-w-[320px] text-xs text-muted-foreground">
                Course ini belum punya silabus part yang dipublikasikan.
              </p>
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
              </div>

              <div className="h-px bg-border" />

              {(active.blocks?.length ?? 0) === 0 ? (
                <p className="py-12 text-center text-sm text-muted-foreground">
                  Materi ini belum punya blok konten.
                </p>
              ) : (
                <div className="flex flex-col gap-6">
                  {active.blocks?.map((block) =>
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
                            </span>
                          </div>
                        </div>
                        <Button asChild>
                          <Link href={`/my-course/quiz/${block.id}`}>
                            Mulai Quiz
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
                  disabled={!prev}
                  onClick={() => prev && setActiveId(prev.id)}
                >
                  <ArrowLeft className="size-4" />
                  Sebelumnya
                </Button>
                <div className="flex items-center gap-2.5">
                  <Button
                    variant="outline"
                    onClick={() =>
                      active &&
                      setCompleted((prevState) => ({
                        ...prevState,
                        [active.id]: !prevState[active.id],
                      }))
                    }
                  >
                    <Check className="size-4" />
                    {completed[active.id]
                      ? "Tandai belum selesai"
                      : "Tandai selesai"}
                  </Button>
                  <Button
                    disabled={!next}
                    onClick={() => next && setActiveId(next.id)}
                  >
                    Berikutnya
                  </Button>
                </div>
              </div>

              {quizBlock ? (
                <p className="text-center text-xs text-muted-foreground">
                  Materi ini punya kuis — selesaikan untuk melanjutkan.
                </p>
              ) : null}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
