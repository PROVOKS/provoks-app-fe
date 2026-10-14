"use client";

import Link from "next/link";
import { Check, CheckCircle2, Clock, Loader2, RotateCcw, X } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuizAttempt } from "@/hooks/use-learning";
import { cn } from "@/lib/utils";

export function QuizResult({
  blockId,
  attemptId,
}: {
  blockId: string;
  attemptId: string | null;
}) {
  const { data: result, isLoading, isError, error } = useQuizAttempt(
    attemptId ?? "",
  );

  if (!attemptId) {
    return (
      <div className="flex flex-col items-center gap-3 py-24 text-center">
        <p className="text-sm font-semibold">Belum ada hasil kuis</p>
        <p className="text-xs text-muted-foreground">
          Kerjakan kuis terlebih dahulu untuk melihat hasilnya.
        </p>
        <Button asChild>
          <Link href={`/my-course/quiz/${blockId}`}>Kerjakan Quiz</Link>
        </Button>
      </div>
    );
  }

  if (isLoading) {
    return <Skeleton className="h-[520px] w-full rounded-2xl" />;
  }

  if (isError || !result) {
    return (
      <p className="py-24 text-center text-sm text-muted-foreground">
        {(error as Error)?.message ?? "Hasil kuis tidak ditemukan"}
      </p>
    );
  }

  const correct = result.review.filter((item) => item.correct).length;
  const wrong = result.review.length - correct;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex h-15 items-center justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="font-heading text-2xl font-bold">Hasil Quiz</h1>
          <p className="text-[13px] text-muted-foreground">
            {result.quizTitle} - {result.courseTitle}
          </p>
        </div>
        <Badge variant="secondary" className="gap-1.5">
          <Clock className="size-3" />
          {new Date(result.submittedAt).toLocaleString("id-ID")}
        </Badge>
      </div>

      <div className="grid grid-cols-[420px_1fr] items-start gap-[18px]">
        <Card className="rounded-2xl p-6">
          <CardContent className="flex flex-col items-center gap-5 p-0">
            <span
              className={cn(
                "grid size-[140px] place-items-center rounded-full",
                result.passed ? "bg-success/10" : "bg-destructive/10",
              )}
            >
              <span className="flex flex-col items-center">
                <span
                  className={cn(
                    "font-heading text-[44px] leading-none font-bold",
                    result.passed ? "text-success" : "text-destructive",
                  )}
                >
                  {result.score}
                </span>
                <span className="text-xs text-muted-foreground">/ 100</span>
              </span>
            </span>

            <Badge
              className={cn(
                "gap-1.5",
                result.passed
                  ? "bg-success/10 text-success"
                  : "bg-destructive/10 text-destructive",
              )}
            >
              {result.passed ? (
                <CheckCircle2 className="size-3.5" />
              ) : (
                <X className="size-3.5" />
              )}
              {result.passed ? "Lulus" : "Belum lulus"}
            </Badge>

            <p className="text-center text-[13px] text-muted-foreground">
              Nilai minimum lulus course ini adalah {result.passingGrade}.
            </p>

            <div className="h-px w-full bg-border" />

            <div className="flex w-full items-center justify-between">
              <div className="flex flex-col">
                <span className="font-heading text-xl font-bold">{correct}</span>
                <span className="text-xs text-muted-foreground">
                  Jawaban benar
                </span>
              </div>
              <div className="flex flex-col">
                <span className="font-heading text-xl font-bold">{wrong}</span>
                <span className="text-xs text-muted-foreground">
                  Jawaban salah
                </span>
              </div>
            </div>

            <div className="h-px w-full bg-border" />

            <div className="flex w-full flex-col gap-2.5">
              <Button className="w-full" asChild>
                <Link href={`/my-course/${result.courseTitle ? "" : ""}`}>
                  Lanjut belajar
                </Link>
              </Button>
              <Button variant="outline" className="w-full" asChild>
                <Link href={`/my-course/quiz/${blockId}`}>
                  <RotateCcw className="size-4" />
                  Ulangi Quiz
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl p-6">
          <CardContent className="flex flex-col gap-3.5 p-0">
            <div className="flex items-center justify-between">
              <p className="font-heading text-[15px] font-semibold">
                Review Jawaban
              </p>
              <span className="text-[13px] text-muted-foreground">
                {correct} benar, {wrong} salah
              </span>
            </div>
            <div className="h-px bg-border" />

            <div className="flex flex-col gap-3">
              {result.review.map((item, index) => (
                <div
                  key={item.questionId}
                  className="flex items-start gap-3 rounded-xl border border-border bg-card p-3.5 px-4"
                >
                  <span
                    className={cn(
                      "grid size-6.5 shrink-0 place-items-center rounded-full",
                      item.correct
                        ? "bg-success/10 text-success"
                        : "bg-destructive/10 text-destructive",
                    )}
                  >
                    {item.correct ? (
                      <Check className="size-3.5" />
                    ) : (
                      <X className="size-3.5" />
                    )}
                  </span>
                  <div className="flex flex-col gap-1">
                    <p className="text-[13px] font-medium">
                      {index + 1}. {item.question}
                    </p>
                    <p
                      className={cn(
                        "text-xs",
                        item.correct ? "text-muted-foreground" : "text-destructive",
                      )}
                    >
                      Jawabanmu:{" "}
                      {item.chosenIndex !== null
                        ? item.options[item.chosenIndex]
                        : "tidak dijawab"}
                      {!item.correct
                        ? ` — Seharusnya: ${item.options[item.answerIndex]}`
                        : ""}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
