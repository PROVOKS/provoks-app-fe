"use client";

import { useState } from "react";
import { CheckCircle2, Loader2, Pencil, Plus, Trash2, Upload } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import type { ContentBlock, QuizQuestion } from "@/types";

type QuestionDraft = {
  question: string;
  options: string[];
  answerIndex: number;
  points: number;
};

const EMPTY_DRAFT: QuestionDraft = {
  question: "",
  options: ["", "", "", ""],
  answerIndex: 0,
  points: 1,
};

function QuestionForm({
  initial,
  submitLabel,
  isPending,
  onCancel,
  onSubmit,
}: {
  initial: QuestionDraft;
  submitLabel: string;
  isPending?: boolean;
  onCancel: () => void;
  onSubmit: (draft: QuestionDraft) => void;
}) {
  const [draft, setDraft] = useState<QuestionDraft>(initial);

  function setOption(index: number, value: string) {
    setDraft((prev) => {
      const options = [...prev.options];
      options[index] = value;
      return { ...prev, options };
    });
  }

  const canSubmit =
    draft.question.trim().length > 0 &&
    draft.options.filter((option) => option.trim()).length >= 2;

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-border bg-muted/40 p-4">
      <div className="flex flex-col gap-2">
        <Label>Pertanyaan</Label>
        <Input
          value={draft.question}
          placeholder="Apa kepanjangan dari JSX?"
          onChange={(event) =>
            setDraft((prev) => ({ ...prev, question: event.target.value }))
          }
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label>Opsi Jawaban (pilih yang benar)</Label>
        {draft.options.map((option, index) => (
          <div key={index} className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setDraft((prev) => ({ ...prev, answerIndex: index }))}
              className={`grid size-6 shrink-0 place-items-center rounded-full border ${
                draft.answerIndex === index
                  ? "border-success bg-success text-success-foreground"
                  : "border-border"
              }`}
              aria-label={`Tandai opsi ${index + 1} sebagai jawaban benar`}
            >
              {draft.answerIndex === index ? (
                <CheckCircle2 className="size-3.5" />
              ) : null}
            </button>
            <Input
              value={option}
              placeholder={`Opsi ${index + 1}`}
              onChange={(event) => setOption(index, event.target.value)}
            />
          </div>
        ))}
      </div>

      <div className="flex items-end justify-between gap-4">
        <div className="flex flex-col gap-2">
          <Label>Poin</Label>
          <Input
            type="number"
            min={1}
            className="w-28"
            value={draft.points}
            onChange={(event) =>
              setDraft((prev) => ({
                ...prev,
                points: Number(event.target.value) || 1,
              }))
            }
          />
        </div>
        <div className="flex items-center gap-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Batal
          </Button>
          <Button
            type="button"
            disabled={!canSubmit || isPending}
            onClick={() =>
              onSubmit({
                ...draft,
                options: draft.options.map((option) => option.trim()).filter(Boolean),
              })
            }
          >
            {isPending ? <Loader2 className="size-4 animate-spin" /> : null}
            {submitLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}

export function QuizBuilderDialog({
  open,
  onOpenChange,
  block,
  onCreateQuestion,
  onUpdateQuestion,
  onDeleteQuestion,
  onImport,
  isPending,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  block: ContentBlock | null;
  onCreateQuestion: (payload: Record<string, unknown>) => void;
  onUpdateQuestion: (payload: { id: string } & Record<string, unknown>) => void;
  onDeleteQuestion: (id: string) => void;
  onImport: (payload: {
    questions: { q: string; options: string[]; answer: number }[];
  }) => void;
  isPending?: boolean;
}) {
  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [json, setJson] = useState("");
  const [jsonError, setJsonError] = useState<string | null>(null);
  const [preview, setPreview] = useState<
    { q: string; options: string[]; answer: number }[] | null
  >(null);

  const questions: QuizQuestion[] = block?.questions ?? [];

  function parseJson(value: string) {
    setJson(value);
    setJsonError(null);
    setPreview(null);
    if (!value.trim()) return;
    try {
      const parsed = JSON.parse(value) as {
        questions?: { q: string; options: string[]; answer: number }[];
      };
      const list = Array.isArray(parsed) ? parsed : parsed.questions;
      if (!Array.isArray(list) || list.length === 0) {
        setJsonError("JSON harus berisi array 'questions'.");
        return;
      }
      setPreview(list);
    } catch {
      setJsonError("JSON tidak valid.");
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[680px]">
        <DialogHeader>
          <DialogTitle className="font-heading text-lg">
            Quiz Builder
          </DialogTitle>
          <DialogDescription>
            Susun soal secara manual atau import dari JSON.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="manual">
          <TabsList className="w-full">
            <TabsTrigger value="manual" className="flex-1 gap-2">
              <Pencil className="size-4" />
              Buat Sendiri
            </TabsTrigger>
            <TabsTrigger value="import" className="flex-1 gap-2">
              <Upload className="size-4" />
              Import JSON
            </TabsTrigger>
          </TabsList>

          <TabsContent value="manual" className="mt-4 flex flex-col gap-3">
            {questions.length === 0 && !adding ? (
              <p className="py-8 text-center text-sm text-muted-foreground">
                Belum ada soal.
              </p>
            ) : null}

            {questions.map((question, index) =>
              editingId === question.id ? (
                <QuestionForm
                  key={question.id}
                  initial={{
                    question: question.question,
                    options:
                      question.options.length >= 2
                        ? question.options
                        : [...question.options, "", ""].slice(0, 4),
                    answerIndex: question.answerIndex,
                    points: question.points,
                  }}
                  submitLabel="Simpan Soal"
                  isPending={isPending}
                  onCancel={() => setEditingId(null)}
                  onSubmit={(draft) => {
                    onUpdateQuestion({ id: question.id, ...draft });
                    setEditingId(null);
                  }}
                />
              ) : (
                <div
                  key={question.id}
                  className="flex items-start justify-between gap-3 rounded-xl border border-border p-3.5"
                >
                  <div className="flex flex-col gap-1">
                    <p className="text-[13px] font-medium">
                      {index + 1}. {question.question}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {question.options.length} opsi · jawaban:{" "}
                      <span className="font-semibold text-success">
                        {question.options[question.answerIndex]}
                      </span>{" "}
                      · {question.points} poin
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      size="icon"
                      variant="ghost"
                      className="size-8"
                      onClick={() => setEditingId(question.id)}
                      aria-label="Edit soal"
                    >
                      <Pencil className="size-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="size-8 text-destructive"
                      onClick={() => onDeleteQuestion(question.id)}
                      aria-label="Hapus soal"
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                </div>
              ),
            )}

            {adding ? (
              <QuestionForm
                initial={EMPTY_DRAFT}
                submitLabel="Tambah Soal"
                isPending={isPending}
                onCancel={() => setAdding(false)}
                onSubmit={(draft) => {
                  if (!block) return;
                  onCreateQuestion({ contentBlockId: block.id, ...draft });
                  setAdding(false);
                }}
              />
            ) : (
              <Button
                variant="outline"
                onClick={() => setAdding(true)}
                disabled={!block}
              >
                <Plus className="size-4" />
                Tambah soal
              </Button>
            )}
          </TabsContent>

          <TabsContent value="import" className="mt-4 flex flex-col gap-3">
            <div className="flex flex-col gap-2">
              <Label htmlFor="quiz-json">JSON</Label>
              <Textarea
                id="quiz-json"
                rows={9}
                className="font-mono text-[12px]"
                placeholder={`{
  "questions": [
    { "q": "Apa kepanjangan dari JSX?", "options": ["JavaScript XML", "Java Syntax"], "answer": 0 }
  ]
}`}
                value={json}
                onChange={(event) => parseJson(event.target.value)}
              />
              {jsonError ? (
                <p className="text-xs text-destructive">{jsonError}</p>
              ) : null}
            </div>

            {preview ? (
              <div className="flex flex-col gap-2 rounded-xl bg-muted/40 p-3.5">
                <p className="flex items-center gap-2 text-xs font-semibold text-success">
                  <CheckCircle2 className="size-3.5" />
                  Valid — {preview.length} soal
                </p>
                {preview.slice(0, 5).map((item, index) => (
                  <p key={index} className="text-xs text-muted-foreground">
                    {index + 1}. {item.q} — jawaban:{" "}
                    {item.options[item.answer] ?? "-"}
                  </p>
                ))}
                {preview.length > 5 ? (
                  <p className="text-xs text-muted-foreground">
                    {preview.length - 5} soal lainnya disembunyikan.
                  </p>
                ) : null}
              </div>
            ) : null}

            <Button
              disabled={!preview || isPending}
              onClick={() => preview && onImport({ questions: preview })}
            >
              {isPending ? <Loader2 className="size-4 animate-spin" /> : null}
              Import Quiz
            </Button>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Tutup
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
