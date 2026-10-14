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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { CoursePart, SilabusPart } from "@/types";

const schema = z.object({
  coursePartId: z.string().min(1, "Course part wajib dipilih"),
  title: z.string().min(1, "Judul silabus part wajib diisi"),
  slug: z.string().optional(),
  type: z.enum(["VIDEO", "ARTICLE", "QUIZ"]),
  durationMinutes: z.number().min(0, "Tidak boleh negatif"),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]),
});

export type SilabusPartValues = z.infer<typeof schema>;

const EMPTY: SilabusPartValues = {
  coursePartId: "",
  title: "",
  slug: "",
  type: "VIDEO",
  durationMinutes: 0,
  status: "DRAFT",
};

export function SilabusPartDialog({
  open,
  onOpenChange,
  silabusPart,
  courseParts,
  defaultCoursePartId,
  onSubmit,
  isPending,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  silabusPart?: SilabusPart | null;
  courseParts: CoursePart[];
  defaultCoursePartId?: string;
  onSubmit: (values: SilabusPartValues) => void;
  isPending?: boolean;
}) {
  const isEdit = Boolean(silabusPart);

  const form = useForm<SilabusPartValues>({
    resolver: zodResolver(schema),
    defaultValues: EMPTY,
  });

  useEffect(() => {
    if (!open) return;
    form.reset(
      silabusPart
        ? {
            coursePartId: silabusPart.coursePartId,
            title: silabusPart.title,
            slug: silabusPart.slug,
            type: silabusPart.type,
            durationMinutes: silabusPart.durationMinutes,
            status: silabusPart.status,
          }
        : { ...EMPTY, coursePartId: defaultCoursePartId ?? courseParts[0]?.id ?? "" },
    );
  }, [open, silabusPart, defaultCoursePartId, courseParts, form]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[560px]">
        <DialogHeader>
          <DialogTitle className="font-heading text-lg">
            {isEdit ? "Edit Silabus Part" : "Tambah Silabus Part"}
          </DialogTitle>
          <DialogDescription>
            Item silabus di dalam course part. Bisa berisi blok konten.
          </DialogDescription>
        </DialogHeader>

        <form
          id="silabus-part-form"
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-4"
        >
          <div className="flex flex-col gap-2">
            <Label>
              Course Part <span className="text-destructive">*</span>
            </Label>
            <Select
              value={form.watch("coursePartId")}
              onValueChange={(value) =>
                form.setValue("coursePartId", value, { shouldValidate: true })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Pilih part" />
              </SelectTrigger>
              <SelectContent>
                {courseParts.map((part) => (
                  <SelectItem key={part.id} value={part.id}>
                    {part.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {form.formState.errors.coursePartId ? (
              <p className="text-xs text-destructive">
                {form.formState.errors.coursePartId.message}
              </p>
            ) : null}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="silabus-title">
              Judul <span className="text-destructive">*</span>
            </Label>
            <Input
              id="silabus-title"
              placeholder="Contoh: Komponen & JSX"
              {...form.register("title")}
            />
            {form.formState.errors.title ? (
              <p className="text-xs text-destructive">
                {form.formState.errors.title.message}
              </p>
            ) : null}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="silabus-slug">Slug</Label>
            <Input
              id="silabus-slug"
              placeholder="otomatis dari judul"
              className="font-mono text-[13px]"
              {...form.register("slug")}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <Label>Tipe</Label>
              <Select
                value={form.watch("type")}
                onValueChange={(value) =>
                  form.setValue("type", value as SilabusPartValues["type"])
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="VIDEO">Video</SelectItem>
                  <SelectItem value="ARTICLE">Artikel</SelectItem>
                  <SelectItem value="QUIZ">Kuis</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-2">
              <Label>Status</Label>
              <Select
                value={form.watch("status")}
                onValueChange={(value) =>
                  form.setValue("status", value as SilabusPartValues["status"])
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="DRAFT">Draft</SelectItem>
                  <SelectItem value="PUBLISHED">Published</SelectItem>
                  <SelectItem value="ARCHIVED">Archived</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="silabus-duration">Durasi (menit)</Label>
            <Input
              id="silabus-duration"
              type="number"
              min={0}
              className="w-40"
              {...form.register("durationMinutes", { valueAsNumber: true })}
            />
          </div>
        </form>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Batal
          </Button>
          <Button type="submit" form="silabus-part-form" disabled={isPending}>
            {isPending ? <Loader2 className="size-4 animate-spin" /> : null}
            {isEdit ? "Simpan Perubahan" : "Simpan Silabus Part"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
