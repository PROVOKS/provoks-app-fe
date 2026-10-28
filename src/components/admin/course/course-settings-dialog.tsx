"use client";

import { memo, useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";

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
import { Textarea } from "@/components/ui/textarea";
import { api, type ApiEnvelope } from "@/lib/api-client";
import type { Course, Paginated, Path, Tag } from "@/types";

export type CourseSettingsValues = {
  title: string;
  description: string;
  status: Course["status"];
  passingGrade: number;
  pathId: string;
  blockedByCourseId: string;
  tagIds: string[];
};

export const CourseSettingsDialog = memo(function CourseSettingsDialog({
  open,
  onOpenChange,
  course,
  paths,
  tags,
  onSubmit,
  isPending,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  course: Course;
  paths: Path[];
  tags: Tag[];
  onSubmit: (values: CourseSettingsValues) => void;
  isPending?: boolean;
}) {
  const [values, setValues] = useState<CourseSettingsValues>({
    title: course.title,
    description: course.description ?? "",
    status: course.status,
    passingGrade: course.passingGrade,
    pathId: course.pathId ?? "",
    blockedByCourseId: course.blockedByCourseId ?? "",
    tagIds: (course.tags ?? []).map((tag) => tag.id),
  });

  const { data: courseOptions } = useQuery({
    queryKey: ["courses", "options", course.pathId ?? "none"],
    queryFn: async () => {
      const { data } = await api.get<ApiEnvelope<Paginated<Course>>>("/courses", {
        params: { perPage: 100, pathId: course.pathId ?? undefined },
      });
      return data.data.items.filter((item) => item.id !== course.id);
    },
    enabled: open,
  });

  useEffect(() => {
    if (!open) return;
    setValues({
      title: course.title,
      description: course.description ?? "",
      status: course.status,
      passingGrade: course.passingGrade,
      pathId: course.pathId ?? "",
      blockedByCourseId: course.blockedByCourseId ?? "",
      tagIds: (course.tags ?? []).map((tag) => tag.id),
    });
  }, [open, course]);

  function toggleTag(tagId: string) {
    setValues((prev) => ({
      ...prev,
      tagIds: prev.tagIds.includes(tagId)
        ? prev.tagIds.filter((id) => id !== tagId)
        : [...prev.tagIds, tagId],
    }));
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] grid-rows-[auto_minmax(0,1fr)_auto] gap-4 sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="font-heading text-lg">
            Pengaturan Kursus
          </DialogTitle>
          <DialogDescription>
            Konfigurasi umum course. Nilai minimum lulus mengikuti course, bukan
            silabus part.
          </DialogDescription>
        </DialogHeader>

        <div className="-mx-1 min-h-0 overflow-y-auto px-1">
        <form
          id="course-settings-form"
          onSubmit={(event) => {
            event.preventDefault();
            onSubmit({
              ...values,
              pathId: values.pathId || "",
            });
          }}
          className="flex flex-col gap-4"
        >
          <div className="flex flex-col gap-2">
            <Label>Prasyarat (Blocked by)</Label>
            <Select
              value={values.blockedByCourseId || "NONE"}
              onValueChange={(value) =>
                setValues((prev) => ({
                  ...prev,
                  blockedByCourseId: value === "NONE" ? "" : value,
                }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Tidak ada prasyarat" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="NONE">Tidak ada prasyarat</SelectItem>
                {(courseOptions ?? []).map((item) => (
                  <SelectItem key={item.id} value={item.id}>
                    {item.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              Course ini baru terbuka setelah course prasyarat selesai 100%.
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="course-title">
              Nama Course <span className="text-destructive">*</span>
            </Label>
            <Input
              id="course-title"
              value={values.title}
              onChange={(event) =>
                setValues((prev) => ({ ...prev, title: event.target.value }))
              }
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label>Path</Label>
              <Select
                value={values.pathId || "none"}
                onValueChange={(value) =>
                  setValues((prev) => ({
                    ...prev,
                    pathId: value === "none" ? "" : value,
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih path" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Tanpa path</SelectItem>
                  {paths.map((path) => (
                    <SelectItem key={path.id} value={path.id}>
                      {path.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-2">
              <Label>Status</Label>
              <Select
                value={values.status}
                onValueChange={(value) =>
                  setValues((prev) => ({
                    ...prev,
                    status: value as Course["status"],
                  }))
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
            <Label htmlFor="course-description">Deskripsi</Label>
            <Textarea
              id="course-description"
              rows={3}
              value={values.description}
              onChange={(event) =>
                setValues((prev) => ({
                  ...prev,
                  description: event.target.value,
                }))
              }
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label>Tags</Label>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => {
                const active = values.tagIds.includes(tag.id);
                return (
                  <button
                    key={tag.id}
                    type="button"
                    onClick={() => toggleTag(tag.id)}
                    className={`rounded-full border px-3 py-1 text-xs font-semibold transition-colors ${
                      active
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border bg-muted text-muted-foreground hover:bg-muted/70"
                    }`}
                  >
                    {tag.name}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="h-px bg-border" />

          <div className="flex flex-col gap-2">
            <Label htmlFor="course-passing">Nilai minimum lulus</Label>
            <div className="flex items-center gap-2">
              <Input
                id="course-passing"
                type="number"
                min={0}
                max={100}
                className="w-28"
                value={values.passingGrade}
                onChange={(event) =>
                  setValues((prev) => ({
                    ...prev,
                    passingGrade: Number(event.target.value) || 0,
                  }))
                }
              />
              <span className="text-sm text-muted-foreground">dari 100</span>
            </div>
          </div>
        </form>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Batal
          </Button>
          <Button type="submit" form="course-settings-form" disabled={isPending}>
            {isPending ? <Loader2 className="size-4 animate-spin" /> : null}
            Simpan Pengaturan
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
});
