"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  AlertCircle,
  ArrowLeft,
  Check,
  ChevronRight,
  Clock,
  History,
  List,
  Loader2,
  Timer,
} from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useQuiz,
  useStartQuiz,
  useSubmitQuiz,
  type QuizStartResult,
} from "@/hooks/use-learning";
import { cn } from "@/lib/utils";

function formatCountdown(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function formatDuration(seconds?: number | null) {
  if (seconds === null || seconds === undefined) return "-";
  const minutes = Math.floor(seconds / 60);
  const rest = seconds % 60;
  if (minutes === 0) return `${rest} detik`;
  return `${minutes} menit ${rest} detik`;
}

function formatDate(value: string | null) {
  if (!value) return "-";
  return new Date(value).toLocaleString("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export function QuizAttempt({
  slug,
  blockId,
}: {
  slug: string;
  blockId: string;
}) {
  const router = useRouter();
  const { data: quiz, isLoading, isError, error } = useQuiz(blockId);
  const start = useStartQuiz(blockId);
  const submit = useSubmitQuiz(blockId);

  const [attempt, setAttempt] = useState<QuizStartResult | null>(null);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [showUnanswered, setShowUnanswered] = useState(false);
  const [remaining, setRemaining] = useState<number | null>(null);

  const startedRef = useRef(false);
  const submittedRef = useRef(false);
  const attemptRef = useRef<QuizStartResult | null>(null);
  const answersRef = useRef<Record<string, number>>({});
  const totalQuestionsRef = useRef(0);

  attemptRef.current = attempt;
  answersRef.current = answers;
  totalQuestionsRef.current = quiz?.questions.length ?? 0;

  const exhausted = Boolean(quiz) && !quiz?.canAttempt && !quiz?.activeAttempt;

  // mulai / lanjutkan percobaan sekali setelah data kuis siap
  useEffect(() => {
    if (!quiz || startedRef.current || exhausted) return;
    startedRef.current = true;
    start.mutate(undefined, {
      onSuccess: (data) => {
        setAttempt(data);
        if (data.resumed) {
          toast.info(`Melanjutkan percobaan ke-${data.attemptNumber}`);
        }
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quiz, exhausted]);

  // kirim jawaban (dipakai tombol submit & auto-submit saat waktu habis)
  const submitRef = useRef<(timeout?: boolean) => void>(() => {});
  submitRef.current = (timeout = false) => {
    const current = attemptRef.current;
    if (!current || submittedRef.current) return;

    submittedRef.current = true;
    submit.mutate(
      { attemptId: current.attemptId, answers: answersRef.current },
      {
        onSuccess: (result) => {
          router.push(
            `/my-course/${slug}/quiz/${blockId}/result?attempt=${result.attemptId}`,
          );
        },
        onError: () => {
          submittedRef.current = false;
        },
      },
    );

    if (timeout) {
      toast.warning("Waktu habis", {
        description: "Jawaban yang sudah diisi otomatis dikumpulkan.",
      });
    }
  };

  // hitung mundur berbasis expiresAt dari server (tahan refresh)
  useEffect(() => {
    if (!attempt?.expiresAt) {
      setRemaining(null);
      return;
    }

    const end = new Date(attempt.expiresAt).getTime();
    const tick = () => {
      const left = Math.max(0, Math.ceil((end - Date.now()) / 1000));
      setRemaining(left);
      if (left <= 0) submitRef.current(true);
    };

    tick();
    const timer = window.setInterval(tick, 1000);
    return () => window.clearInterval(timer);
  }, [attempt?.expiresAt]);

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
  const unansweredCount = total - answeredCount;
  const allAnswered = unansweredCount === 0;
  const finishedAttempts = quiz.attempts.filter(
    (item) => item.status !== "IN_PROGRESS",
  );

  function handleSubmit() {
    if (!allAnswered) {
      const firstUnanswered = quiz!.questions.findIndex(
        (item) => answers[item.id] === undefined,
      );

      setShowUnanswered(true);
      if (firstUnanswered >= 0) setIndex(firstUnanswered);

      toast.error("Jawaban belum terjawab semua", {
        description: `${unansweredCount} dari ${total} soal masih kosong. Lengkapi dulu sebelum submit.`,
      });
      return;
    }

    setShowUnanswered(false);
    submitRef.current(false);
  }

  // kesempatan habis & tidak ada percobaan berjalan
  if (exhausted) {
    const last = quiz.lastAttempt;
    return (
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="font-heading text-2xl font-bold">{quiz.title}</h1>
          <p className="text-[13px] text-muted-foreground">
            Kesempatan mengerjakan sudah habis ({quiz.attemptsUsed}
            {quiz.maxAttempts !== null ? `/${quiz.maxAttempts}` : ""} percobaan).
          </p>
        </div>

        <Card className="rounded-2xl p-6">
          <CardContent className="flex flex-col gap-4 p-0">
            <div className="flex items-start gap-3">
              <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-warning/10 text-warning">
                <AlertCircle className="size-5" />
              </span>
              <div className="flex flex-col gap-1">
                <p className="text-sm font-semibold">
                  Kamu tidak bisa memulai percobaan baru
                </p>
                <p className="text-[13px] text-muted-foreground">
                  Semua kesempatan sudah terpakai. Kamu masih bisa melihat
                  jawaban dari percobaan sebelumnya.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {last ? (
                <Button asChild>
                  <Link
                    href={`/my-course/${slug}/quiz/${blockId}/result?attempt=${last.id}`}
                  >
                    Lihat Jawaban Terakhir
                  </Link>
                </Button>
              ) : null}
              <Button variant="outline" asChild>
                <Link href={`/my-course/${slug}`}>Kembali ke Course</Link>
              </Button>
            </div>

            {quiz.attempts.length > 0 ? (
              <>
                <div className="h-px bg-border" />
                <p className="font-heading text-[15px] font-semibold">
                  Riwayat Percobaan
                </p>
                <div className="flex flex-col gap-2">
                  {quiz.attempts.map((item) => (
                    <div
                      key={item.id}
                      className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-border px-3.5 py-2.5"
                    >
                      <div className="flex flex-col">
                        <span className="text-[13px] font-semibold">
                          Percobaan {item.attemptNumber}
                          {item.timedOut ? " · waktu habis" : ""}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {formatDate(item.submittedAt ?? item.startedAt)} ·{" "}
                          {formatDuration(item.durationSeconds)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[13px] font-semibold">
                          {item.score ?? 0}
                        </span>
                        <Button size="sm" variant="outline" asChild>
                          <Link
                            href={`/my-course/${slug}/quiz/${blockId}/result?attempt=${item.id}`}
                          >
                            Lihat
                          </Link>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : null}
          </CardContent>
        </Card>
      </div>
    );
  }

  // percobaan belum siap (menunggu /start)
  if (!attempt) {
    if (start.isError) {
      return (
        <p className="py-24 text-center text-sm text-muted-foreground">
          {(start.error as Error)?.message ?? "Gagal memulai kuis"}
        </p>
      );
    }
    return <Skeleton className="h-[520px] w-full rounded-2xl" />;
  }

  const lowTime = remaining !== null && remaining <= 60;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-col gap-1">
          <h1 className="font-heading text-2xl font-bold">{quiz.title}</h1>
          <p className="text-[13px] text-muted-foreground">
            Nilai minimum lulus {quiz.passingGrade}
            {quiz.maxAttempts !== null
              ? ` · percobaan ${attempt.attemptNumber}/${quiz.maxAttempts}`
              : ` · percobaan ke-${attempt.attemptNumber}`}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
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

      <div className="grid grid-cols-1 items-start gap-[18px] lg:grid-cols-[1fr_340px]">
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
                const missing = showUnanswered && !answered;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setIndex(questionIndex)}
                    aria-label={`Soal ${questionIndex + 1}${answered ? "" : " belum dijawab"}`}
                    className={cn(
                      "grid size-11 place-items-center rounded-[10px] border font-heading text-sm font-semibold",
                      active
                        ? "border-primary bg-card text-primary"
                        : answered
                          ? "border-transparent bg-primary text-primary-foreground"
                          : missing
                            ? "border-destructive bg-destructive/10 text-destructive"
                            : "border-border bg-muted text-muted-foreground",
                    )}
                  >
                    {questionIndex + 1}
                  </button>
                );
              })}
            </div>

            {showUnanswered && !allAnswered ? (
              <div className="flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2 text-xs text-destructive">
                <AlertCircle className="mt-0.5 size-3.5 shrink-0" />
                <span>
                  {unansweredCount} soal belum dijawab. Soal yang kosong ditandai
                  merah.
                </span>
              </div>
            ) : null}

            <div className="h-px bg-border" />

            <div
              className={cn(
                "flex items-center justify-between rounded-xl border px-3.5 py-2.5",
                lowTime
                  ? "border-destructive/40 bg-destructive/5"
                  : "border-border bg-muted/40",
              )}
            >
              <span className="flex items-center gap-2 text-[13px] font-medium">
                <Timer
                  className={cn(
                    "size-4",
                    lowTime ? "text-destructive" : "text-muted-foreground",
                  )}
                />
                Sisa waktu
              </span>
              <span
                className={cn(
                  "font-mono text-[15px] font-semibold",
                  lowTime ? "text-destructive" : "text-foreground",
                )}
              >
                {remaining === null
                  ? "Tanpa batas"
                  : formatCountdown(remaining)}
              </span>
            </div>

            <Button
              className="w-full"
              onClick={handleSubmit}
              disabled={submit.isPending}
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

            {finishedAttempts.length > 0 ? (
              <>
                <div className="h-px bg-border" />
                <p className="flex items-center gap-1.5 font-heading text-[13px] font-semibold">
                  <History className="size-3.5" />
                  Riwayat Percobaan
                </p>
                <div className="flex flex-col gap-2">
                  {finishedAttempts.map((item) => (
                    <div
                      key={item.id}
                      className="rounded-lg border border-border px-3 py-2"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-semibold">
                          Percobaan {item.attemptNumber}
                        </span>
                        <span
                          className={cn(
                            "text-xs font-semibold",
                            item.passed ? "text-success" : "text-muted-foreground",
                          )}
                        >
                          {item.score ?? 0}
                          {item.timedOut ? " · waktu habis" : ""}
                        </span>
                      </div>
                      <div className="mt-1 flex items-center justify-between gap-2">
                        <span className="text-[11px] text-muted-foreground">
                          {formatDate(item.submittedAt)} ·{" "}
                          {formatDuration(item.durationSeconds)}
                        </span>
                        <Link
                          href={`/my-course/${slug}/quiz/${blockId}/result?attempt=${item.id}`}
                          className="text-[11px] font-semibold text-primary hover:underline"
                        >
                          Lihat jawaban
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : null}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
