"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowUpRight,
  BookOpen,
  CheckCircle2,
  Clock,
  KeyRound,
  Lock,
  Route,
} from "lucide-react";

import { JoinPathDialog } from "@/components/learner/join-path-dialog";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { usePathDetail } from "@/hooks/use-learning";
import { cn } from "@/lib/utils";

export function PathDetail({ slug }: { slug: string }) {
  const { data: path, isLoading, isError, error } = usePathDetail(slug);
  const [joinOpen, setJoinOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4">
        <Skeleton className="h-36 w-full rounded-2xl" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-40 w-full rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  if (isError || !path) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-2xl border border-border bg-card px-6 py-20 text-center">
        <span className="grid size-12 place-items-center rounded-full bg-muted">
          <Route className="size-5 text-muted-foreground" />
        </span>
        <p className="font-heading text-[17px] font-semibold">
          Path tidak bisa dibuka
        </p>
        <p className="max-w-[380px] text-[13px] text-muted-foreground">
          {(error as Error)?.message ?? "Path tidak ditemukan."}
        </p>
        <Button asChild size="sm" variant="outline" className="mt-1">
          <Link href="/my-course/path">Kembali ke daftar path</Link>
        </Button>
      </div>
    );
  }

  const totalMinutes = path.courses.reduce(
    (total, course) => total + course.durationMinutes,
    0,
  );

  return (
    <div className="flex flex-col gap-4">
      <Link
        href="/my-course/path"
        className="inline-flex w-fit items-center gap-1.5 text-[13px] font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Semua Path
      </Link>

      <header className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-start gap-3.5">
          <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
            <Route className="size-5" />
          </span>
          <div className="flex min-w-0 flex-col gap-1">
            <h1 className="font-heading text-xl font-bold sm:text-2xl">
              {path.name}
            </h1>
            <p className="text-[13px] leading-relaxed text-muted-foreground">
              {path.description || "Path belajar terstruktur."}
            </p>
            <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1">
                <BookOpen className="size-3.5" />
                {path.courseCount} course
              </span>
              <span className="inline-flex items-center gap-1">
                <Clock className="size-3.5" />
                {Math.round(totalMinutes / 60)} jam materi
              </span>
              {path.joined ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 font-semibold text-primary">
                  <CheckCircle2 className="size-3" />
                  Diikuti
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-1 font-semibold">
                  Belum bergabung
                </span>
              )}
            </div>
          </div>
        </div>

        {!path.joined ? (
          <Button
            size="sm"
            className="shrink-0"
            onClick={() => setJoinOpen(true)}
          >
            <KeyRound className="size-4" />
            Masukkan Kode Akses
          </Button>
        ) : null}
      </header>

      {!path.joined ? (
        <div className="flex items-start gap-3 rounded-2xl border border-primary/25 bg-primary/5 p-4">
          <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-card text-primary">
            <Lock className="size-4" />
          </span>
          <div className="flex flex-col gap-1">
            <p className="text-[13px] font-semibold">
              Kamu belum bergabung ke path ini
            </p>
            <p className="text-[13px] text-muted-foreground">
              Masukkan kode akses dari admin atau instruktur untuk membuka
              seluruh course di path ini.
            </p>
          </div>
        </div>
      ) : null}

      <div className="flex flex-col gap-3">
        <h2 className="font-heading text-[17px] font-bold">
          Daftar Course
        </h2>

        {path.courses.length === 0 ? (
          <p className="rounded-2xl border border-border bg-card py-12 text-center text-sm text-muted-foreground">
            Belum ada course di path ini.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
            {path.courses.map((course) => {
              const locked = course.locked || !path.joined;
              const done = course.progressPercent >= 100;
              const started = course.progressPercent > 0 && !done;

              return (
                <article
                  key={course.id}
                  className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex min-w-0 flex-col gap-1">
                      <h3 className="text-[14px] font-semibold">
                        {course.title}
                      </h3>
                      <span className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                        <span className="inline-flex items-center gap-1">
                          <BookOpen className="size-3" />
                          {course.silabusCount} silabus
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <Clock className="size-3" />
                          {course.durationMinutes} menit
                        </span>
                      </span>
                    </div>

                    <span
                      className={cn(
                        "shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold",
                        locked
                          ? "bg-muted text-muted-foreground"
                          : done
                            ? "bg-success/10 text-success"
                            : started
                              ? "bg-primary/10 text-primary"
                              : "bg-muted text-muted-foreground",
                      )}
                    >
                      {locked
                        ? "Terkunci"
                        : done
                          ? "Selesai"
                          : started
                            ? `${course.progressPercent}%`
                            : "Belum mulai"}
                    </span>
                  </div>

                  {!locked ? (
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                        <div
                          className="h-full rounded-full bg-primary transition-all"
                          style={{ width: `${course.progressPercent}%` }}
                        />
                      </div>
                      <span className="w-9 shrink-0 text-right text-[11px] font-semibold text-muted-foreground">
                        {course.progressPercent}%
                      </span>
                    </div>
                  ) : (
                    <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Lock className="size-3" />
                      {!path.joined
                        ? "Butuh kode akses path"
                        : `Selesaikan "${course.blockedBy?.title ?? "course prasyarat"}" dulu`}
                    </p>
                  )}

                  <div className="mt-auto flex items-center justify-end">
                    {locked ? (
                      <Button size="sm" variant="outline" disabled>
                        <Lock className="size-3.5" />
                        Terkunci
                      </Button>
                    ) : (
                      <Button size="sm" variant={done ? "outline" : "default"} asChild>
                        <Link href={`/my-course/${course.slug}`}>
                          {done ? "Ulangi" : started ? "Lanjutkan" : "Mulai"}
                          <ArrowUpRight className="size-3.5" />
                        </Link>
                      </Button>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>

      <JoinPathDialog
        open={joinOpen}
        onOpenChange={setJoinOpen}
        pathName={path.name}
      />
    </div>
  );
}
