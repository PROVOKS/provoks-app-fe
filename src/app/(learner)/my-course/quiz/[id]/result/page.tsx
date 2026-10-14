import { Check, CheckCircle2, Clock, X } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export const metadata = { title: "Hasil Quiz" };

const REVIEW = [
  { q: "Apa kepanjangan dari JSX?", ok: true, yours: "JavaScript XML" },
  { q: "Atribut class pada JSX adalah...", ok: true, yours: "className" },
  { q: "Hook untuk menyimpan state adalah...", ok: false, yours: "useEffect", correct: "useState" },
  { q: "Bagaimana menulis ekspresi di JSX?", ok: true, yours: "Kurung kurawal { }" },
  { q: "Komponen harus diawali huruf...", ok: true, yours: "Kapital" },
];

export default function QuizResultPage() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex h-15 items-center justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="font-heading text-2xl font-bold">Hasil Quiz</h1>
          <p className="text-[13px] text-muted-foreground">
            Kuis: Dasar JSX - React Fundamentals
          </p>
        </div>
        <Badge variant="secondary" className="gap-1.5">
          <Clock className="size-3" />
          Waktu 06:12
        </Badge>
      </div>

      <div className="grid grid-cols-[420px_1fr] items-start gap-[18px]">
        <Card className="rounded-2xl p-6">
          <CardContent className="flex flex-col items-center gap-5 p-0">
            <span className="grid size-[140px] place-items-center rounded-full bg-success/10">
              <span className="flex flex-col items-center">
                <span className="font-heading text-[44px] leading-none font-bold text-success">
                  80
                </span>
                <span className="text-xs text-muted-foreground">/ 100</span>
              </span>
            </span>

            <Badge className="gap-1.5 bg-success/10 text-success">
              <CheckCircle2 className="size-3.5" />
              Lulus
            </Badge>
            <p className="text-center text-[13px] text-muted-foreground">
              Nilai minimum lulus course ini adalah 70.
            </p>

            <div className="h-px w-full bg-border" />

            <div className="flex w-full items-center justify-between">
              <div className="flex flex-col">
                <span className="font-heading text-xl font-bold">4</span>
                <span className="text-xs text-muted-foreground">
                  Jawaban benar
                </span>
              </div>
              <div className="flex flex-col">
                <span className="font-heading text-xl font-bold">1</span>
                <span className="text-xs text-muted-foreground">
                  Jawaban salah
                </span>
              </div>
            </div>

            <div className="h-px w-full bg-border" />

            <div className="flex w-full flex-col gap-2.5">
              <Button className="w-full">Lanjut ke silabus berikutnya</Button>
              <Button variant="outline" className="w-full">
                Ulangi Quiz
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
                4 benar, 1 salah
              </span>
            </div>
            <div className="h-px bg-border" />

            <div className="flex flex-col gap-3">
              {REVIEW.map((item, i) => (
                <div
                  key={item.q}
                  className="flex items-start gap-3 rounded-xl border border-border bg-card p-3.5 px-4"
                >
                  <span
                    className={`grid size-6.5 shrink-0 place-items-center rounded-full ${
                      item.ok
                        ? "bg-success/10 text-success"
                        : "bg-destructive/10 text-destructive"
                    }`}
                  >
                    {item.ok ? (
                      <Check className="size-3.5" />
                    ) : (
                      <X className="size-3.5" />
                    )}
                  </span>
                  <div className="flex flex-col gap-1">
                    <p className="text-[13px] font-medium">
                      {i + 1}. {item.q}
                    </p>
                    <p
                      className={`text-xs ${
                        item.ok ? "text-muted-foreground" : "text-destructive"
                      }`}
                    >
                      Jawabanmu: {item.yours}
                      {item.correct ? ` — Seharusnya: ${item.correct}` : ""}
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
