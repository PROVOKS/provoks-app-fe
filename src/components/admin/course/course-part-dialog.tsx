"use client";

import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

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
import { Textarea } from "@/components/ui/textarea";
import type { CoursePart } from "@/types";

const schema = z.object({
  name: z.string().min(1, "Nama part wajib diisi"),
  description: z.string().optional(),
  durationMinutes: z.number().min(0, "Tidak boleh negatif"),
});

export type CoursePartValues = z.infer<typeof schema>;

const EMPTY: CoursePartValues = { name: "", description: "", durationMinutes: 0 };

export function CoursePartDialog({
  open,
  onOpenChange,
  part,
  onSubmit,
  isPending,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  part?: CoursePart | null;
  onSubmit: (values: CoursePartValues) => void;
  isPending?: boolean;
}) {
  const isEdit = Boolean(part);

  const form = useForm<CoursePartValues>({
    resolver: zodResolver(schema),
    defaultValues: EMPTY,
  });

  useEffect(() => {
    if (!open) return;
    form.reset(
      part
        ? {
            name: part.name,
            description: part.description ?? "",
            durationMinutes: part.durationMinutes,
          }
        : EMPTY,
    );
  }, [open, part, form]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] grid-rows-[auto_minmax(0,1fr)_auto] gap-4 sm:max-w-[560px]">
        <DialogHeader>
          <DialogTitle className="font-heading text-lg">
            {isEdit ? "Edit Course Part" : "Tambah Course Part"}
          </DialogTitle>
          <DialogDescription>
            Course part adalah kelompok besar (modul) di dalam course. Urutan
            diatur dengan drag &amp; drop di struktur konten.
          </DialogDescription>
        </DialogHeader>

        <div className="-mx-1 min-h-0 overflow-y-auto px-1">
        <form
          id="course-part-form"
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-4"
        >
          <div className="flex flex-col gap-2">
            <Label htmlFor="part-name">
              Nama Part <span className="text-destructive">*</span>
            </Label>
            <Input
              id="part-name"
              placeholder="Contoh: React Fundamentals"
              {...form.register("name")}
            />
            {form.formState.errors.name ? (
              <p className="text-xs text-destructive">
                {form.formState.errors.name.message}
              </p>
            ) : null}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="part-description">Deskripsi</Label>
            <Textarea
              id="part-description"
              rows={3}
              placeholder="Jelaskan isi part ini..."
              {...form.register("description")}
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="part-duration">Durasi (menit)</Label>
            <Input
              id="part-duration"
              type="number"
              min={0}
              className="w-40"
              {...form.register("durationMinutes", { valueAsNumber: true })}
            />
          </div>
        </form>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Batal
          </Button>
          <Button type="submit" form="course-part-form" disabled={isPending}>
            {isPending ? <Loader2 className="size-4 animate-spin" /> : null}
            {isEdit ? "Simpan Perubahan" : "Simpan Part"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
