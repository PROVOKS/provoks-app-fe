"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  BookOpen,
  CheckCircle2,
  Clock,
  Flame,
  Lock,
  Play,
} from "lucide-react";

import { JoinPathDialog } from "@/components/learner/join-path-dialog";
import { useAuth } from "@/components/providers/auth-provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useMyCourses, useMyPaths } from "@/hooks/use-learning";
import { cn } from "@/lib/utils";

export default function MyLearningPage() {
  const { user } = useAuth();

  const coursesQuery = useMyCourses();
  const pathsQuery = useMyPaths();

  const [joinOpen, setJoinOpen] = useState(false);
  const [joinPathName, setJoinPathName] = useState<string | undefined>();

  const courses = coursesQuery.data ?? [];
  const paths = pathsQuery.data ?? [];
  const joinedPaths = paths.filter((path) => path.joined);

  const totalMenit = courses.reduce((sum, course) => sum + course.durationMinutes, 0);
  const totalSilabusCount = courses.reduce((sum, course) => sum + course.silabusCount, 0);
  const continueCourse =
    courses.find((course) => !course.locked && course.progressPercent < 100) ??
    courses.find((course) => !course.locked) ??
    null;

  const stats = [
    {
      label: "Course Aktif",
      value: String(courses.length),
      sub: "dari path yang kamu ikuti",
      icon: BookOpen,
    },
    {
      label: "Jam Belajar",
      value: `${Math.round(totalMenit / 60)} jam`,
      sub: "total durasi materi",
      icon: Clock,
    },
    {
      label: "Silabus",
      value: String(totalSilabusCount),
      sub: "silabus part",
      icon: CheckCircle2,
    },
  ];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-col gap-1">
          <h1 className="font-heading text-2xl font-bold">
            Halo, {user?.name?.split(" ")[0] ?? "Siswa"}
          </h1>
          <p className="text-[13px] text-muted-foreground">
            Semangat, lanjutkan progres belajarmu hari ini.
          </p>
        </div>
        <span className="hidden items-center gap-1.5 rounded-full bg-muted px-2.5 py-1 text-xs font-semibold text-muted-foreground sm:flex">
          <Flame className="size-3.5" />5 hari beruntun
        </span>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {stats.map((stat) => (
          <Card key={stat.label} className="gap-2.5 rounded-2xl p-4.5">
            <CardContent className="flex flex-col gap-2.5 p-0">
              <div className="flex items-center justify-between">
                <span className="text-[13px] font-medium text-muted-foreground">
                  {stat.label}
                </span>
                <span className="grid size-8 place-items-center rounded-[10px] bg-muted">
                  <stat.icon className="size-4 text-muted-foreground" />
                </span>
              </div>
              <p className="font-heading text-[28px] leading-none font-bold">
                {stat.value}
              </p>
              <p className="text-xs text-muted-foreground">{stat.sub}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {coursesQuery.isLoading ? (
        <Skeleton className="h-32 w-full rounded-2xl" />
      ) : coursesQuery.isError ? (
        <p className="rounded-2xl border border-border bg-card py-12 text-center text-sm text-muted-foreground">
          Gagal memuat course. Pastikan backend berjalan.
        </p>
      ) : continueCourse ? (
        <Card className="rounded-2xl p-5">
          <CardContent className="flex flex-col gap-5 p-0 sm:flex-row sm:items-center">
            <span className="grid size-[100px] shrink-0 place-items-center rounded-2xl bg-secondary/25">
              <Play className="size-6 text-secondary" />
            </span>
            <div className="flex flex-1 flex-col gap-2.5">
              <p className="font-heading text-[17px] font-semibold">
                {continueCourse.title}
              </p>
              <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-primary"
                  style={{ width: `${continueCourse.progressPercent}%` }}
                />
              </div>
              <p className="text-[13px] text-muted-foreground">
                {continueCourse.silabusCount} silabus ·{" "}
                {Math.round(continueCourse.durationMinutes / 60)} jam materi ·{" "}
                <span className="font-semibold text-primary">
                  {continueCourse.progressPercent > 0
                    ? `${continueCourse.progressPercent}% selesai`
                    : "Belum dimulai"}
                </span>
              </p>
            </div>
            <Button asChild className="w-full sm:w-auto">
              <Link href={`/my-course/${continueCourse.slug}`}>Lanjutkan belajar</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <p className="rounded-2xl border border-border bg-card px-5 py-12 text-center text-sm text-muted-foreground">
          {joinedPaths.length === 0
            ? "Kamu belum mengikuti path apa pun. Pilih path di bawah, lalu masukkan kode akses dari admin atau instruktur."
            : "Belum ada course di path yang kamu ikuti."}
        </p>
      )}

      {courses.length > 0 ? (
        <div className="grid grid-cols-1 gap-[18px] sm:grid-cols-2 xl:grid-cols-3">
          {courses.map((course) => {
            const locked = Boolean(course.locked);
            const card = (
              <Card
                className={cn(
                  "h-full gap-3.5 rounded-2xl p-4 transition-colors",
                  locked ? "opacity-70" : "hover:border-primary/40",
                )}
              >
                <CardContent className="flex flex-col gap-3.5 p-0">
                  <span className="relative grid h-[180px] w-full place-items-center rounded-xl bg-secondary/25">
                    {locked ? (
                      <Lock className="size-6 text-secondary" />
                    ) : (
                      <Play className="size-6 text-secondary" />
                    )}
                    {locked ? (
                      <span className="absolute top-2 right-2 flex items-center gap-1 rounded-full bg-card px-2 py-1 text-[11px] font-semibold text-muted-foreground">
                        <Lock className="size-3" />
                        Terkunci
                      </span>
                    ) : null}
                  </span>
                  <p className="font-heading text-[15px] font-semibold">
                    {course.title}
                  </p>
                  {course.path ? (
                    <span className="w-fit rounded-full bg-muted px-2.5 py-1 text-[11px] font-semibold text-muted-foreground">
                      {course.path.name}
                    </span>
                  ) : null}

                  {locked && course.blockedBy ? (
                    <p className="text-xs text-muted-foreground">
                      Selesaikan{" "}
                      <span className="font-semibold text-foreground">
                        {course.blockedBy.title}
                      </span>{" "}
                      dulu ({course.blockedBy.progressPercent}%).
                    </p>
                  ) : (
                    <>
                      <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                        <div
                          className="h-full rounded-full bg-primary"
                          style={{ width: `${course.progressPercent}%` }}
                        />
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">
                          {course.silabusCount} silabus
                        </span>
                        <span className="font-semibold text-muted-foreground">
                          {course.progressPercent > 0
                            ? `${course.progressPercent}% selesai`
                            : "Belum dimulai"}
                        </span>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            );

            return locked ? (
              <div key={course.id} aria-disabled className="cursor-not-allowed">
                {card}
              </div>
            ) : (
              <Link key={course.id} href={`/my-course/${course.slug}`}>
                {card}
              </Link>
            );
          })}
        </div>
      ) : null}

      <div className="rounded-2xl border border-border bg-card p-5">
        <div className="flex flex-col gap-0.5">
          <h2 className="font-heading text-[17px] font-bold">Path Belajar</h2>
          <p className="text-[13px] text-muted-foreground">
            Masuk ke path baru dengan kode akses dari admin atau instruktur.
          </p>
        </div>

        {pathsQuery.isLoading ? (
          <Skeleton className="mt-4 h-24 w-full" />
        ) : paths.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">
            Belum ada path yang dipublikasikan.
          </p>
        ) : (
          <div className="mt-4 grid grid-cols-1 gap-3.5 sm:grid-cols-2">
            {paths.map((path) => {
              const firstCourse = courses.find(
                (course) => course.path?.id === path.id && !course.locked,
              );

              return (
                <div
                  key={path.id}
                  className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-border p-4"
                >
                  <div className="flex min-w-0 flex-col gap-1">
                    <span className="flex flex-wrap items-center gap-2 text-[14px] font-semibold">
                      {path.name}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {path.courseCount} course
                    </span>
                  </div>

                  {path.joined && firstCourse ? (
                    <Button size="sm" variant="outline" asChild>
                      <Link href={`/my-course/${firstCourse.slug}`}>
                        Pelajari
                        <ArrowUpRight className="size-3.5" />
                      </Link>
                    </Button>
                  ) : path.joined ? (
                    <span className="flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
                      <CheckCircle2 className="size-3.5" />
                      Diikuti
                    </span>
                  ) : (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setJoinPathName(path.name);
                        setJoinOpen(true);
                      }}
                    >
                      Pelajari
                      <ArrowUpRight className="size-3.5" />
                    </Button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      <JoinPathDialog
        open={joinOpen}
        onOpenChange={setJoinOpen}
        pathName={joinPathName}
      />
    </div>
  );
}
