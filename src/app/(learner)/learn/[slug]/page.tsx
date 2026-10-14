import Link from "next/link";
import {
  Check,
  ChevronDown,
  ChevronRight,
  Clock,
  FileText,
  Lock,
  Play,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export const metadata = { title: "Course Player" };
export const instant = false;

type SilabusState = "completed" | "active" | "default" | "locked";

type Item = { title: string; minutes: string; state: SilabusState };

const GROUPS: { name: string; items: Item[] }[] = [
  {
    name: "Getting Started",
    items: [
      { title: "Pengenalan Kursus", minutes: "8 mnt", state: "completed" },
      { title: "Setup Environment", minutes: "12 mnt", state: "completed" },
      { title: "Dasar Terminal & Git", minutes: "15 mnt", state: "completed" },
    ],
  },
  {
    name: "React Fundamentals",
    items: [
      { title: "Komponen & JSX", minutes: "18 mnt", state: "active" },
      { title: "Props & State", minutes: "16 mnt", state: "default" },
      { title: "Event Handling", minutes: "14 mnt", state: "default" },
      { title: "List & Keys", minutes: "13 mnt", state: "locked" },
    ],
  },
  {
    name: "State & Hooks",
    items: [
      { title: "useState", minutes: "17 mnt", state: "locked" },
      { title: "useEffect", minutes: "19 mnt", state: "locked" },
    ],
  },
];

function SilabusItem({ item }: { item: Item }) {
  const active = item.state === "active";
  const dim = item.state === "default" || item.state === "locked";

  const Icon =
    item.state === "completed"
      ? Check
      : item.state === "active"
        ? Play
        : item.state === "locked"
          ? Lock
          : FileText;

  const iconBox =
    item.state === "completed"
      ? "bg-primary text-primary-foreground"
      : item.state === "active"
        ? "bg-primary/10 text-primary"
        : "bg-muted text-muted-foreground";

  return (
    <div
      className={`flex h-11 items-center justify-between rounded-[10px] px-2.5 ${
        active ? "bg-primary/10" : ""
      }`}
    >
      <span className="flex items-center gap-2.5">
        <span className={`grid size-5.5 place-items-center rounded-full ${iconBox}`}>
          <Icon className="size-3" />
        </span>
        <span
          className={`text-[13px] ${
            active
              ? "font-semibold text-primary"
              : dim
                ? "text-muted-foreground"
                : ""
          }`}
        >
          {item.title}
        </span>
      </span>
      <span className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
        <Clock className="size-3" />
        {item.minutes}
      </span>
    </div>
  );
}

export default async function CoursePlayerPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return (
    <div className="grid grid-cols-[320px_1fr] items-start gap-[18px]">
      <Card className="rounded-2xl p-4">
        <CardContent className="flex flex-col gap-3.5 p-0">
          <div className="flex flex-col gap-1">
            <p className="font-heading text-[15px] font-semibold">Silabus</p>
            <p className="text-xs text-muted-foreground">Course {slug}</p>
          </div>
          <div className="h-px bg-border" />

          <div className="flex flex-col gap-3">
            {GROUPS.map((group) => (
              <div key={group.name} className="flex flex-col gap-1.5">
                <div className="flex h-10 items-center gap-2 rounded-[10px] bg-muted px-2.5">
                  <ChevronDown className="size-4 text-muted-foreground" />
                  <span className="text-[13px] font-semibold">{group.name}</span>
                  <span className="text-[11px] text-muted-foreground">
                    {group.items.length} silabus
                  </span>
                </div>
                <div className="flex flex-col gap-0.5">
                  {group.items.map((item) => (
                    <SilabusItem key={item.title} item={item} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-2xl p-7">
        <CardContent className="flex flex-col gap-4 p-0">
          <nav className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>React Fundamentals</span>
            <ChevronRight className="size-3" />
            <span className="font-semibold text-foreground">Komponen & JSX</span>
          </nav>

          <h1 className="font-heading text-[26px] font-bold">Komponen & JSX</h1>

          <div className="flex items-center gap-2.5">
            <Badge variant="secondary" className="gap-1.5">
              <Play className="size-3" />
              Video
            </Badge>
            <Badge variant="secondary" className="gap-1.5">
              <Clock className="size-3" />
              18 menit
            </Badge>
          </div>

          <div className="h-px bg-border" />

          <p className="text-sm/6 text-muted-foreground">
            JSX adalah sintaks ekstensi JavaScript yang memungkinkan kita menulis
            markup mirip HTML langsung di dalam kode React.
          </p>

          <h2 className="font-heading text-[17px] font-semibold">Apa itu JSX?</h2>

          <div className="grid h-[210px] place-items-center gap-2.5 rounded-2xl bg-secondary/20">
            <span className="grid size-13 place-items-center rounded-full bg-card">
              <Play className="size-5 text-primary" />
            </span>
            <span className="text-[13px] font-semibold text-muted-foreground">
              Pengenalan JSX (04:32)
            </span>
          </div>

          <div className="flex items-center justify-between gap-3 rounded-xl bg-primary/10 p-3.5 px-4">
            <div className="flex items-center gap-2.5">
              <span className="grid size-8.5 place-items-center rounded-[10px] bg-card">
                <Check className="size-4 text-primary" />
              </span>
              <div className="flex flex-col">
                <span className="text-[13px] font-semibold">Kuis: Dasar JSX</span>
                <span className="text-xs text-muted-foreground">
                  5 soal · nilai minimum lulus 70
                </span>
              </div>
            </div>
            <Button asChild>
              <Link href="/quiz/1">Mulai Quiz</Link>
            </Button>
          </div>

          <div className="h-px bg-border" />

          <div className="flex items-center justify-between">
            <Button variant="outline">Sebelumnya</Button>
            <div className="flex items-center gap-2.5">
              <Button variant="outline">Tandai selesai</Button>
              <Button>Berikutnya</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
