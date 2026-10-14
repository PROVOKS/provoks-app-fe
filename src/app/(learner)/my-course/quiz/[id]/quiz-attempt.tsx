"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Check,
  ChevronRight,
  Clock,
  List,
  Loader2,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuiz, useSubmitQuiz } from "@/hooks/use-learning";
import { cn } from "@/lib/utils";

export function QuizAttempt({ blockId }: { blockId: string }) {
  const router = useRouter();
  const { data: quiz, isLoading, isError, error } = useQuiz(blockId);
  const submit = useSubmitQuiz(blockId);

  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});

  if (isLoading) {
    return <Skeleton className="h-[520px] w-full rounded-2xl" />;
  }

  if (isError || !quiz) {
    return (
      <p className="py-24 text-center text-sm text-muted-foreground">
        {(error as Error)?.message ?? "Kuis tidak ditemukan"}
      </p>
    );
  }

  const total = quiz.questions.length;
  const question = quiz.questions[index];
  const answeredCount = Object.keys(answers).length;

  async function handleSubmit() {
    const result = await submit.mutateAsync(answers);
    router.push(`/my-course/quiz/${blockId}/result?attempt=${result.attemptId}`);
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex h-15 items-center justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="font-heading text-2xl font-bold">{quiz.title}</h1>
          <p className="text-[13px] text-muted-foreground">
            Nilai minimum lulus {quiz.passingGrade}
            {quiz.lastAttempt
              ? ` · skor terakhir ${quiz.lastAttempt.score}`
              : ""}
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <Badge variant="secondary" className="gap-1.5">
            <List className="size-3" />
            Soal {index + 1} dari {total}
          </Badge>
          <Badge variant="secondary" className="gap-1.5">
            <Clock className="size-3" />
            {answeredCount}/{total} dijawab
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-[1fr_320px] items-start gap-[18px]">
        <Card className="rounded-2xl p-7">
          <CardContent className="flex flex-col gap-5 p-0">
            <div className="flex items-center gap-2.5">
              <Badge variant="secondary">Soal {index + 1}</Badge>
              <Badge variant="secondary">Pilihan Ganda</Badge>
              <Badge variant="secondary">{question.points} poin</Badge>
            </div>

            <h2 className="font-heading text-[18px] font-semibold">
              {question.question}
            </h2>
            <div className="h-px bg-border" />

            <div className="flex flex-col gap-2.5">
              {question.options.map((option, optionIndex) => {
                const selected = answers[question.id] === optionIndex;
                return (
                  <button
                    key={optionIndex}
                    type="button"
                    onClick={() =>
                      setAnswers((prev) => ({ ...prev, [question.id]: optionIndex }))
                    }
                    className={cn(
                      "flex min-h-[68px] items-center gap-3 rounded-xl border px-4 py-3 text-left text-sm transition-colors",
                      selected
                        ? "border-primary bg-primary/5 font-semibold"
                        : "border-border bg-card hover:bg-muted",
                    )}
                  >
                    <span
                      className={cn(
                        "grid size-5.5 shrink-0 place-items-center rounded-full border",
                        selected
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border",
                      )}
                    >
                      {selected ? <Check className="size-3" /> : null}
                    </span>
                    {option}
                  </button>
                );
              })}
            </div>

            <div className="h-px bg-border" />

            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                onClick={() => setIndex((value) => Math.max(0, value - 1))}
                disabled={index === 0}
              >
                <ArrowLeft className="size-4" />
                Sebelumnya
              </Button>
              <Button
                onClick={() => setIndex((value) => Math.min(total - 1, value + 1))}
                disabled={index === total - 1}
              >
                Berikutnya
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl p-5">
          <CardContent className="flex flex-col gap-3.5 p-0">
            <p className="font-heading text-[15px] font-semibold">
              Navigasi Soal
            </p>
            <div className="flex flex-wrap gap-2.5">
              {quiz.questions.map((item, questionIndex) => {
                const answered = answers[item.id] !== undefined;
                const active = questionIndex === index;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setIndex(questionIndex)}
                    className={cn(
                      "grid size-11 place-items-center rounded-[10px] border font-heading text-sm font-semibold",
                      active
                        ? "border-primary bg-card text-primary"
                        : answered
                          ? "border-transparent bg-primary text-primary-foreground"
                          : "border-border bg-muted text-muted-foreground",
                    )}
                  >
                    {questionIndex + 1}
                  </button>
                );
              })}
            </div>
            <div className="h-px bg-border" />
            <Button
              className="w-full"
              onClick={handleSubmit}
              disabled={submit.isPending || answeredCount === 0}
            >
              {submit.isPending ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <ChevronRight className="size-4" />
              )}
              Submit Quiz
            </Button>
            <p className="text-xs text-muted-foreground">
              Pastikan semua soal sudah dijawab sebelum submit.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
