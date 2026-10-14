import Link from "next/link";
import { BookOpen, CheckCircle2, Clock, Flame } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export const metadata = { title: "My Learning" };

const STATS = [
  { label: "Course Aktif", value: "3", sub: "dari 12 course tersedia", icon: BookOpen },
  { label: "Jam Belajar", value: "42 jam", sub: "+6 jam minggu ini", icon: Clock },
  { label: "Silabus Selesai", value: "28", sub: "dari 96 silabus", icon: CheckCircle2 },
];

const COURSES = [
  { title: "Full-Stack Web Development", done: 5, total: 12, pct: 42 },
  { title: "React for Beginners", done: 7, total: 10, pct: 68 },
  { title: "Node.js & REST API", done: 2, total: 9, pct: 20 },
];

export default function MyLearningPage() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex h-15 items-center justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="font-heading text-2xl font-bold">Halo, Andi</h1>
          <p className="text-[13px] text-muted-foreground">
            Semangat, lanjutkan progres belajarmu hari ini.
          </p>
        </div>
        <span className="flex items-center gap-1.5 rounded-full bg-muted px-2.5 py-1 text-xs font-semibold text-muted-foreground">
          <Flame className="size-3.5" />5 hari beruntun
        </span>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {STATS.map((stat) => (
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

      <Card className="rounded-2xl p-5">
        <CardContent className="flex items-center gap-5 p-0">
          <span className="size-[100px] shrink-0 rounded-2xl bg-secondary/25" />
          <div className="flex flex-1 flex-col gap-2.5">
            <p className="font-heading text-[17px] font-semibold">
              Full-Stack Web Development
            </p>
            <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
              <div className="h-full w-[42%] rounded-full bg-primary" />
            </div>
            <p className="text-[13px] text-muted-foreground">
              5 dari 12 silabus selesai ·{" "}
              <span className="font-semibold text-primary">42%</span>
            </p>
          </div>
          <Button asChild>
            <Link href="/my-course/full-stack-web-development">Lanjutkan belajar</Link>
          </Button>
        </CardContent>
      </Card>

      <div className="grid grid-cols-3 gap-[18px]">
        {COURSES.map((course) => (
          <Link key={course.title} href={`/my-course/${course.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}>
          <Card className="gap-3.5 rounded-2xl p-4">
            <CardContent className="flex flex-col gap-3.5 p-0">
              <span className="h-[258px] w-full rounded-xl bg-secondary/25" />
              <p className="font-heading text-[15px] font-semibold">
                {course.title}
              </p>
              <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                <div
                  style={{ width: `${course.pct}%` }}
                  className="h-full rounded-full bg-primary"
                />
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">
                  {course.done} dari {course.total} silabus
                </span>
                <span className="font-semibold text-primary">{course.pct}%</span>
              </div>
            </CardContent>
          </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
