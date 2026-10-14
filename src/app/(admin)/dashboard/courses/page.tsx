"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ChevronsUpDown, Download, Plus, Search } from "lucide-react";
import { toast } from "sonner";

import { ConfirmDeleteDialog } from "@/components/admin/confirm-delete-dialog";
import { RowActions } from "@/components/admin/row-actions";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { api, type ApiEnvelope } from "@/lib/api-client";
import type { Course, Paginated } from "@/types";

const STATUS_STYLE: Record<Course["status"], string> = {
  PUBLISHED: "bg-success/10 text-success",
  DRAFT: "bg-muted text-muted-foreground",
  ARCHIVED: "bg-warning/10 text-warning",
};

const STATUS_LABEL: Record<Course["status"], string> = {
  PUBLISHED: "Published",
  DRAFT: "Draft",
  ARCHIVED: "Archived",
};

function StatusBadge({ status }: { status: Course["status"] }) {
  return (
    <span
      className={`rounded-full px-2.5 py-1 text-xs font-semibold ${STATUS_STYLE[status]}`}
    >
      {STATUS_LABEL[status]}
    </span>
  );
}

export default function CoursesPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [deleting, setDeleting] = useState<Course | null>(null);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["courses"],
    queryFn: async () => {
      const { data } = await api.get<ApiEnvelope<Paginated<Course>>>(
        "/courses",
        { params: { page: 1, perPage: 20 } },
      );
      return data.data;
    },
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/courses/${id}`);
    },
    onSuccess: () => {
      toast.success("Course dihapus");
      void queryClient.invalidateQueries({ queryKey: ["courses"] });
      setDeleting(null);
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const courses = data?.items ?? [];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex h-12 items-center justify-between">
        <div className="flex flex-col gap-0.5">
          <h1 className="font-heading text-[26px] font-bold">Manajemen Kursus</h1>
          <p className="text-[13px] text-muted-foreground">
            Kelola kelas, path, dan status publikasinya.
          </p>
        </div>
      </div>

      <div className="rounded-[20px] border border-border bg-card p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="relative w-80">
              <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Cari course..." className="h-9 pl-10" />
            </div>
            {["Semua Path", "Semua Tag", "Semua Status"].map((label) => (
              <Select key={label}>
                <SelectTrigger className="h-9 w-auto gap-2">
                  <SelectValue placeholder={label} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{label}</SelectItem>
                </SelectContent>
              </Select>
            ))}
          </div>
          <div className="flex items-center gap-2.5">
            <Button variant="outline" size="sm">
              <Download className="size-4" />
              Export
            </Button>
            <Button size="sm" asChild>
              <Link href="/dashboard/courses/new">
                <Plus className="size-4" />
                Tambah Course
              </Link>
            </Button>
          </div>
        </div>

        <div className="mt-4">
          {isLoading ? (
            <div className="flex flex-col gap-3 py-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : isError ? (
            <p className="py-16 text-center text-sm text-muted-foreground">
              Gagal memuat data. Pastikan backend berjalan di{" "}
              <code className="font-mono">NEXT_PUBLIC_API_URL</code>.
            </p>
          ) : courses.length === 0 ? (
            <p className="py-16 text-center text-sm text-muted-foreground">
              Belum ada course. Mulai dengan menambah course baru.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-10">
                    <Checkbox aria-label="Pilih semua" />
                  </TableHead>
                  {["COURSE", "PATH", "TAG", "SISWA", "STATUS"].map((head) => (
                    <TableHead key={head}>
                      <span className="flex items-center gap-1.5 text-[11px] font-semibold tracking-wider text-muted-foreground">
                        {head}
                        <ChevronsUpDown className="size-3" />
                      </span>
                    </TableHead>
                  ))}
                  <TableHead className="w-16 text-[11px] font-semibold tracking-wider text-muted-foreground">
                    AKSI
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {courses.map((course) => (
                  <TableRow key={course.id}>
                    <TableCell>
                      <Checkbox aria-label={`Pilih ${course.title}`} />
                    </TableCell>
                    <TableCell>
                      <Link
                        href={`/dashboard/courses/${course.id}`}
                        className="flex items-center gap-2.5"
                      >
                        <span className="size-8 shrink-0 rounded-lg bg-secondary/25" />
                        <span className="text-[13px] font-medium">
                          {course.title}
                        </span>
                      </Link>
                    </TableCell>
                    <TableCell className="text-[13px] text-muted-foreground">
                      {course.path?.name ?? "-"}
                    </TableCell>
                    <TableCell>
                      <span className="rounded-full bg-muted px-2.5 py-1 text-xs font-semibold text-muted-foreground">
                        {course.tags?.[0]?.name ?? "-"}
                      </span>
                    </TableCell>
                    <TableCell className="text-[13px] text-muted-foreground">
                      {course.studentCount ?? 0}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={course.status} />
                    </TableCell>
                    <TableCell>
                      <RowActions
                        label={`Aksi ${course.title}`}
                        onEdit={() => router.push(`/dashboard/courses/${course.id}`)}
                        onDelete={() => setDeleting(course)}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </div>

      <ConfirmDeleteDialog
        open={Boolean(deleting)}
        onOpenChange={(open) => {
          if (!open) setDeleting(null);
        }}
        title={`Hapus course "${deleting?.title ?? ""}"?`}
        description="Course beserta silabus dan progres siswa akan dihapus permanen."
        isPending={remove.isPending}
        onConfirm={() => deleting && remove.mutate(deleting.id)}
      />
    </div>
  );
}
