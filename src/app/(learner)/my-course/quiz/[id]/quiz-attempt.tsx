"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Bookmark, Clock, List } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const QUESTIONS = [
  { id: 1, question: "Apa kepanjangan dari JSX?", options: ["JavaScript XML", "JavaScript Extension", "Java Syntax Extension", "JSON XML Syntax"] },
  { id: 2, question: "Atribut class pada JSX adalah...", options: ["class", "className", "cssClass", "styleName"] },
  { id: 3, question: "Hook untuk menyimpan state adalah...", options: ["useEffect", "useState", "useMemo", "useRef"] },
  { id: 4, question: "Bagaimana menulis ekspresi di JSX?", options: ["Kurung kurawal { }", "Kurung biasa ( )", "Tanpa tanda", "Tag <expr>"] },
  { id: 5, question: "Komponen harus diawali huruf...", options: ["Kapital", "Kecil", "Angka", "Simbol"] },
];

export function QuizAttempt({ id }: { id: string }) {
  const [index, setIndex] = useState(2);
  const [answers, setAnswers] = useState<Record<number, number>>({ 1: 0, 2: 1 });

  const question = QUESTIONS[index];
  const total = QUESTIONS.length;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex h-15 items-center justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="font-heading text-2xl font-bold">Kuis: Dasar JSX</h1>
          <p className="text-[13px] text-muted-foreground">Quiz #{id}</p>
        </div>
        <div className="flex items-center gap-2.5">
          <Badge variant="secondary" className="gap-1.5">
            <Clock className="size-3" />
            12:45 tersisa
          </Badge>
          <Badge variant="secondary" className="gap-1.5">
            <List className="size-3" />
            Soal {index + 1} dari {total}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-[1fr_320px] items-start gap-[18px]">
        <Card className="rounded-2xl p-7">
          <CardContent className="flex flex-col gap-5 p-0">
            <div className="flex items-center gap-2.5">
              <Badge variant="secondary">Soal {index + 1}</Badge>
              <Badge variant="secondary">Pilihan Ganda</Badge>
              <Badge variant="secondary">1 poin</Badge>
            </div>

            <h2 className="font-heading text-[18px] font-semibold">
              {question.question}
            </h2>
            <div className="h-px bg-border" />

            <div className="flex flex-col gap-2.5">
              {question.options.map((option, i) => {
                const selected = answers[question.id] === i;
                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() =>
                      setAnswers((prev) => ({ ...prev, [question.id]: i }))
                    }
                    className={`flex h-[76px] items-center gap-3 rounded-xl border px-4 text-left text-sm transition-colors ${
                      selected
                        ? "border-primary bg-primary/5 font-semibold"
                        : "border-border bg-card hover:bg-muted"
                    }`}
                  >
                    <span
                      className={`grid size-5.5 place-items-center rounded-full border ${
                        selected
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border"
                      }`}
                    >
                      {selected ? "✓" : ""}
                    </span>
                    {option}
                  </button>
                );
              })}
            </div>

            <div className="h-px bg-border" />

            <div className="flex items-center justify-between">
              <Button variant="secondary" size="sm">
                <Bookmark className="size-4" />
                Tandai ragu-ragu
              </Button>
              <div className="flex items-center gap-2.5">
                <Button
                  variant="outline"
                  onClick={() => setIndex((i) => Math.max(0, i - 1))}
                  disabled={index === 0}
                >
                  <ArrowLeft className="size-4" />
                  Sebelumnya
                </Button>
                <Button
                  onClick={() => setIndex((i) => Math.min(total - 1, i + 1))}
                  disabled={index === total - 1}
                >
                  Berikutnya
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-col gap-[18px]">
          <Card className="items-center gap-2 rounded-2xl p-5">
            <CardContent className="flex flex-col items-center gap-2 p-0">
              <p className="text-[13px] font-medium text-muted-foreground">
                Sisa waktu
              </p>
              <p className="font-heading text-[38px] leading-none font-bold text-secondary">
                12:45
              </p>
              <p className="text-xs text-muted-foreground">dari 15 menit</p>
            </CardContent>
          </Card>

          <Card className="rounded-2xl p-5">
            <CardContent className="flex flex-col gap-3.5 p-0">
              <p className="font-heading text-[15px] font-semibold">
                Navigasi Soal
              </p>
              <div className="flex flex-wrap gap-2.5">
                {QUESTIONS.map((q, i) => {
                  const answered = answers[q.id] !== undefined;
                  const active = i === index;
                  return (
                    <button
                      key={q.id}
                      type="button"
                      onClick={() => setIndex(i)}
                      className={`grid size-11 place-items-center rounded-[10px] border font-heading text-sm font-semibold ${
                        active
                          ? "border-primary bg-card text-primary"
                          : answered
                            ? "border-transparent bg-primary text-primary-foreground"
                            : "border-border bg-muted text-muted-foreground"
                      }`}
                    >
                      {i + 1}
                    </button>
                  );
                })}
              </div>
              <div className="h-px bg-border" />
              <Button className="w-full" asChild>
                <Link href={`/my-course/quiz/${id}/result`}>Submit Quiz</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
