"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMutation, useQuery } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
import type { Course, Paginated, Path } from "@/types";

const schema = z.object({
  title: z.string().min(3, "Nama course wajib diisi (min. 3 karakter)"),
  pathId: z.string().min(1, "Path wajib dipilih"),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]),
  description: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

export default function NewCoursePage() {
  const router = useRouter();

  // Path diambil dari data asli (bukan daftar statis)
  const { data: paths, isLoading: pathsLoading } = useQuery({
    queryKey: ["paths", "options"],
    queryFn: async () => {
      const { data } = await api.get<ApiEnvelope<Paginated<Path>>>("/paths", {
        params: { perPage: 100 },
      });
      return data.data.items;
    },
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { title: "", pathId: "", status: "DRAFT", description: "" },
  });

  const create = useMutation({
    mutationFn: async (values: FormValues) => {
      const { data } = await api.post<ApiEnvelope<Course>>("/courses", values);
      return data.data;
    },
    onSuccess: (course) => {
      toast.success("Course dibuat. Lanjut menyusun struktur konten.");
      router.push(`/dashboard/courses/${course.id}`);
    },
    onError: (error: Error) => toast.error(error.message),
  });

  return (
    <div className="flex flex-col gap-4">
      <div className="flex h-16 items-center gap-3.5">
        <span className="grid size-14 place-items-center rounded-2xl border border-border bg-muted">
          <span className="text-lg text-muted-foreground">+</span>
        </span>
        <h1 className="font-heading text-2xl font-bold text-muted-foreground">
          Course Baru
        </h1>
      </div>

      <div className="grid grid-cols-[420px_1fr] items-start gap-[18px]">
        <Card className="rounded-[20px] p-5">
          <CardContent className="flex flex-col gap-3.5 p-0">
            <div className="flex items-center justify-between">
              <p className="font-heading text-[15px] font-semibold">
                Struktur Konten
              </p>
              <span className="text-[11px] text-muted-foreground">Opsional</span>
            </div>
            <div className="h-px bg-border" />
            <div className="flex flex-col items-center justify-center gap-2.5 rounded-2xl bg-muted py-10 text-center">
              <span className="grid size-12 place-items-center rounded-full bg-card">
                <span className="text-muted-foreground">▦</span>
              </span>
              <p className="text-sm font-semibold">Belum ada silabus part</p>
              <p className="max-w-[280px] text-xs text-muted-foreground">
                Course part bersifat opsional. Tambah part dulu, lalu isi
                silabus part di dalamnya.
              </p>
              <Button variant="outline" size="sm" disabled>
                Tambah Part
              </Button>
            </div>
          </CardContent>
        </Card>

        <form onSubmit={form.handleSubmit((values) => create.mutate(values))}>
          <Card className="rounded-[20px] p-6">
            <CardContent className="flex flex-col gap-5 p-0">
              <div className="flex flex-col gap-1">
                <p className="font-heading text-base font-semibold">
                  Detail Course
                </p>
                <p className="text-[13px] text-muted-foreground">
                  Isi field wajib dulu. Struktur konten bisa ditambah nanti.
                </p>
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="title">
                  Nama Course <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="title"
                  placeholder="Masukkan nama course..."
                  {...form.register("title")}
                />
                {form.formState.errors.title ? (
                  <p className="text-xs text-destructive">
                    {form.formState.errors.title.message}
                  </p>
                ) : null}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <Label>
                    Path <span className="text-destructive">*</span>
                  </Label>
                  <Select
                    value={form.watch("pathId")}
                    disabled={pathsLoading}
                    onValueChange={(value) =>
                      form.setValue("pathId", value, { shouldValidate: true })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue
                        placeholder={pathsLoading ? "Memuat path..." : "Pilih path..."}
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {(paths ?? []).map((path) => (
                        <SelectItem key={path.id} value={path.id}>
                          {path.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {!pathsLoading && (paths?.length ?? 0) === 0 ? (
                    <p className="text-xs text-muted-foreground">
                      Belum ada path.{" "}
                      <Link
                        href="/dashboard/paths"
                        className="font-semibold text-primary hover:underline"
                      >
                        Tambah path dulu
                      </Link>
                      .
                    </p>
                  ) : null}
                  {form.formState.errors.pathId ? (
                    <p className="text-xs text-destructive">
                      {form.formState.errors.pathId.message}
                    </p>
                  ) : null}
                </div>
                <div className="flex flex-col gap-2">
                  <Label>Status</Label>
                  <Select
                    value={form.watch("status")}
                    onValueChange={(value) =>
                      form.setValue("status", value as FormValues["status"])
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
                <Label htmlFor="description">Deskripsi</Label>
                <Textarea
                  id="description"
                  rows={3}
                  placeholder="Tulis deskripsi singkat course..."
                  {...form.register("description")}
                />
              </div>

              <div className="h-px bg-border" />

              <div className="flex items-center justify-end gap-2.5">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push("/dashboard/courses")}
                >
                  Batal
                </Button>
                <Button type="submit" disabled={create.isPending}>
                  {create.isPending ? "Menyimpan..." : "Simpan & Lanjut"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      </div>
    </div>
  );
}
