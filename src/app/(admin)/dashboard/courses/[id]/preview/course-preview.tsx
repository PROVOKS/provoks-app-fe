"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ChevronDown,
  ChevronRight,
  Clock,
  FileText,
  Play,
  Undo2,
} from "lucide-react";

import { BlockRenderer } from "@/components/learner/block-renderer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useCourseDetail } from "@/hooks/use-course-detail";
import { cn } from "@/lib/utils";
import type { SilabusPart } from "@/types";

export function CoursePreview({ courseId }: { courseId: string }) {
  const { data: course, isLoading, isError } = useCourseDetail(courseId);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

  const flat = useMemo<SilabusPart[]>(
    () =>
      (course?.parts ?? []).flatMap((part) => part.silabusParts ?? []),
    [course],
  );

  useEffect(() => {
    if (!activeId && flat.length > 0) setActiveId(flat[0].id);
  }, [flat, activeId]);

  const active = flat.find((item) => item.id === activeId) ?? null;
  const index = active ? flat.findIndex((item) => item.id === active.id) : -1;
  const prev = index > 0 ? flat[index - 1] : null;
  const next = index >= 0 && index < flat.length - 1 ? flat[index + 1] : null;

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-[18px] lg:grid-cols-[280px_minmax(0,1fr)]">
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

  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          <Button variant="outline" size="sm" asChild>
            <Link href={`/dashboard/courses/${courseId}`}>
              <ArrowLeft className="size-4" />
              Kembali ke editor
            </Link>
          </Button>
          <div className="flex min-w-0 flex-col">
            <span className="truncate font-heading text-lg font-bold">
              {course.title}
            </span>
            <span className="text-xs text-muted-foreground">
              Pratinjau tampilan siswa
            </span>
          </div>
        </div>
        <Badge variant="secondary" className="shrink-0">
          Preview mode
        </Badge>
      </div>

      {/* Body */}
      <div className="grid grid-cols-1 items-start gap-[18px] lg:grid-cols-[280px_minmax(0,1fr)]">
        {/* Silabus */}
        <div className="sticky top-0 flex max-h-[calc(100vh-120px)] flex-col gap-3.5 overflow-y-auto rounded-2xl border border-border bg-card p-4">
          <div className="flex flex-col gap-0.5">
            <p className="font-heading text-[15px] font-semibold">Silabus</p>
            <p className="text-xs text-muted-foreground">{course.title}</p>
          </div>
          <div className="h-px bg-border" />

          {course.parts?.length ? (
            <div className="flex flex-col gap-3">
              {course.parts.map((part) => {
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
                                    isActive
                                      ? "bg-primary/15 text-primary"
                                      : "bg-muted text-muted-foreground",
                                  )}
                                >
                                  {item.type === "VIDEO" ? (
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
          ) : (
            <p className="py-8 text-center text-xs text-muted-foreground">
              Belum ada silabus part.
            </p>
          )}
        </div>

        {/* Konten */}
        <div className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-7">
          {!active ? (
            <div className="flex flex-col items-center gap-2.5 py-24 text-center">
              <span className="grid size-12 place-items-center rounded-full bg-muted">
                <FileText className="size-5 text-muted-foreground" />
              </span>
              <p className="text-sm font-semibold">Belum ada materi</p>
              <p className="max-w-[320px] text-xs text-muted-foreground">
                Tambah course part dan silabus part di editor untuk melihat
                pratinjaunya di sini.
              </p>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-[13px] text-muted-foreground">
                  <span>{course.title}</span>
                  <ChevronRight className="size-3.5" />
                  <span className="font-semibold text-foreground">
                    {active.title}
                  </span>
                </div>
                <span className="font-mono text-xs text-muted-foreground">
                  /{active.slug}
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
                <Badge variant="secondary">
                  {active.blocks?.length ?? 0} block
                </Badge>
              </div>

              <div className="h-px bg-border" />

              {(active.blocks?.length ?? 0) === 0 ? (
                <p className="py-12 text-center text-sm text-muted-foreground">
                  Silabus part ini belum punya blok konten.
                </p>
              ) : (
                <div className="flex flex-col gap-6">
                  {active.blocks?.map((block) => (
                    <BlockRenderer key={block.id} block={block} />
                  ))}
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
                <div className="flex flex-wrap items-center gap-2.5">
                  <Button variant="outline" asChild>
                    <Link href={`/dashboard/courses/${courseId}`}>
                      <Undo2 className="size-4" />
                      Edit materi
                    </Link>
                  </Button>
                  <Button
                    disabled={!next}
                    onClick={() => next && setActiveId(next.id)}
                  >
                    Berikutnya
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
