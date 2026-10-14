"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { BookOpen, CheckCircle2, Clock, Flame, Play } from "lucide-react";

import { useAuth } from "@/components/providers/auth-provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { api, type ApiEnvelope } from "@/lib/api-client";
import type { Course, Paginated } from "@/types";

function totalSilabus(course: Course) {
  return (course.parts ?? []).reduce(
    (total, part) => total + (part.silabusParts?.length ?? 0),
    0,
  );
}

function totalMinutes(course: Course) {
  return (course.parts ?? []).reduce(
    (total, part) =>
      total +
      (part.silabusParts ?? []).reduce(
        (sum, item) => sum + item.durationMinutes,
        0,
      ),
    0,
  );
}

export default function MyLearningPage() {
  const { user } = useAuth();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["my-courses"],
    queryFn: async () => {
      const { data } = await api.get<ApiEnvelope<Paginated<Course>>>(
        "/courses",
        { params: { status: "PUBLISHED", perPage: 50 } },
      );
      return data.data.items;
    },
  });

  const courses = data ?? [];
  const totalMenit = courses.reduce((sum, course) => sum + totalMinutes(course), 0);
  const totalSilabusCount = courses.reduce(
    (sum, course) => sum + totalSilabus(course),
    0,
  );
  const continueCourse = courses[0];

  const stats = [
    {
      label: "Course Aktif",
      value: String(courses.length),
      sub: "course yang tersedia",
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
      <div className="flex h-15 items-center justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="font-heading text-2xl font-bold">
            Halo, {user?.name?.split(" ")[0] ?? "Siswa"}
          </h1>
          <p className="text-[13px] text-muted-foreground">
            Semangat, lanjutkan progres belajarmu hari ini.
          </p>
        </div>
        <span className="flex items-center gap-1.5 rounded-full bg-muted px-2.5 py-1 text-xs font-semibold text-muted-foreground">
          <Flame className="size-3.5" />5 hari beruntun
        </span>
      </div>

      <div className="grid grid-cols-3 gap-4">
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

      {isLoading ? (
        <Skeleton className="h-32 w-full rounded-2xl" />
      ) : isError ? (
        <p className="rounded-2xl border border-border bg-card py-12 text-center text-sm text-muted-foreground">
          Gagal memuat course. Pastikan backend berjalan.
        </p>
      ) : continueCourse ? (
        <Card className="rounded-2xl p-5">
          <CardContent className="flex items-center gap-5 p-0">
            <span className="grid size-[100px] shrink-0 place-items-center rounded-2xl bg-secondary/25">
              <Play className="size-6 text-secondary" />
            </span>
            <div className="flex flex-1 flex-col gap-2.5">
              <p className="font-heading text-[17px] font-semibold">
                {continueCourse.title}
              </p>
              <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                <div className="h-full w-0 rounded-full bg-primary" />
              </div>
              <p className="text-[13px] text-muted-foreground">
                {totalSilabus(continueCourse)} silabus ·{" "}
                {Math.round(totalMinutes(continueCourse) / 60)} jam materi ·{" "}
                <span className="font-semibold text-primary">Belum dimulai</span>
              </p>
            </div>
            <Button asChild>
              <Link href={`/my-course/${continueCourse.slug}`}>
                Lanjutkan belajar
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <p className="rounded-2xl border border-border bg-card py-12 text-center text-sm text-muted-foreground">
          Belum ada course yang dipublikasikan.
        </p>
      )}

      {courses.length > 0 ? (
        <div className="grid grid-cols-3 gap-[18px]">
          {courses.map((course) => (
            <Link key={course.id} href={`/my-course/${course.slug}`}>
              <Card className="gap-3.5 rounded-2xl p-4 transition-colors hover:border-primary/40">
                <CardContent className="flex flex-col gap-3.5 p-0">
                  <span className="grid h-[180px] w-full place-items-center rounded-xl bg-secondary/25">
                    <Play className="size-6 text-secondary" />
                  </span>
                  <p className="font-heading text-[15px] font-semibold">
                    {course.title}
                  </p>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                    <div className="h-full w-0 rounded-full bg-primary" />
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">
                      {totalSilabus(course)} silabus
                    </span>
                    <span className="font-semibold text-muted-foreground">
                      Belum dimulai
                    </span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      ) : null}
    </div>
  );
}
