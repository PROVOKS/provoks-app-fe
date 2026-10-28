"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Archive, FilePen, Plus, Search, Send, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { BulkActionBar } from "@/components/admin/bulk-action-bar";
import { ConfirmDeleteDialog } from "@/components/admin/confirm-delete-dialog";
import { RowActions } from "@/components/admin/row-actions";
import { useAuth } from "@/components/providers/auth-provider";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { DataTablePagination } from "@/components/ui/pagination";
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
import { useBulkAction, useRowSelection } from "@/hooks/use-bulk";
import { api, type ApiEnvelope } from "@/lib/api-client";
import type { Course, Paginated, Path, Tag } from "@/types";

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
  const { user } = useAuth();
  const isAdmin = user?.role === "ADMIN";

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<Course["status"] | "ALL">("ALL");
  const [pathId, setPathId] = useState("ALL");
  const [tagId, setTagId] = useState("ALL");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(20);
  const [deleting, setDeleting] = useState<Course | null>(null);
  const [bulkDeleting, setBulkDeleting] = useState(false);

  const { selected, toggle, toggleAll, clear } = useRowSelection();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["courses", page, perPage, search, status, pathId, tagId],
    queryFn: async () => {
      const { data } = await api.get<ApiEnvelope<Paginated<Course>>>("/courses", {
        params: {
          page,
          perPage,
          search: search || undefined,
          status: status === "ALL" ? undefined : status,
          pathId: pathId === "ALL" ? undefined : pathId,
          tagId: tagId === "ALL" ? undefined : tagId,
        },
      });
      return data.data;
    },
  });

  const { data: pathOptions } = useQuery({
    queryKey: ["paths", "options"],
    queryFn: async () => {
      const { data } = await api.get<ApiEnvelope<Paginated<Path>>>("/paths", {
        params: { perPage: 100 },
      });
      return data.data.items;
    },
  });

  const { data: tagOptions } = useQuery({
    queryKey: ["tags", "options"],
    queryFn: async () => {
      const { data } = await api.get<ApiEnvelope<Paginated<Tag>>>("/tags", {
        params: { perPage: 100 },
      });
      return data.data.items;
    },
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/courses/${id}`);
    },
    onSuccess: () => {
      toast.success("Course dihapus");
      void queryClient.invalidateQueries({ queryKey: ["courses"] });
      void queryClient.invalidateQueries({ queryKey: ["stats"] });
      setDeleting(null);
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const bulk = useBulkAction("/courses/bulk", [["courses"], ["stats"]]);

  const courses = data?.items ?? [];
  const ids = courses.map((course) => course.id);
  const allChecked = ids.length > 0 && ids.every((id) => selected.has(id));
  const someChecked = ids.some((id) => selected.has(id));

  function resetPage() {
    setPage(1);
    clear();
  }

  function runBulk(action: "status" | "delete", nextStatus?: Course["status"]) {
    bulk.mutate(
      {
        action,
        ids: [...selected],
        ...(nextStatus ? { status: nextStatus } : {}),
      },
      {
        onSuccess: () => {
          clear();
          setBulkDeleting(false);
        },
      },
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-col gap-0.5">
          <h1 className="font-heading text-[26px] font-bold">Manajemen Kursus</h1>
          <p className="text-[13px] text-muted-foreground">
            Kelola kelas, path, dan status publikasinya.
          </p>
        </div>
        <Button size="sm" asChild>
          <Link href="/dashboard/courses/new">
            <Plus className="size-4" />
            Tambah Course
          </Link>
        </Button>
      </div>

      <div className="rounded-[20px] border border-border bg-card p-4 sm:p-6">
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="relative w-full sm:w-72">
            <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Cari course..."
              className="h-9 pl-10"
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                resetPage();
              }}
            />
          </div>

          <Select
            value={pathId}
            onValueChange={(value) => {
              setPathId(value);
              resetPage();
            }}
          >
            <SelectTrigger className="h-9 w-full sm:w-[170px]">
              <SelectValue placeholder="Semua path" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Semua path</SelectItem>
              {(pathOptions ?? []).map((path) => (
                <SelectItem key={path.id} value={path.id}>
                  {path.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={tagId}
            onValueChange={(value) => {
              setTagId(value);
              resetPage();
            }}
          >
            <SelectTrigger className="h-9 w-full sm:w-[150px]">
              <SelectValue placeholder="Semua tag" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Semua tag</SelectItem>
              {(tagOptions ?? []).map((tag) => (
                <SelectItem key={tag.id} value={tag.id}>
                  {tag.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={status}
            onValueChange={(value) => {
              setStatus(value as Course["status"] | "ALL");
              resetPage();
            }}
          >
            <SelectTrigger className="h-9 w-full sm:w-[150px]">
              <SelectValue placeholder="Semua status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Semua status</SelectItem>
              <SelectItem value="PUBLISHED">Published</SelectItem>
              <SelectItem value="DRAFT">Draft</SelectItem>
              <SelectItem value="ARCHIVED">Archived</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <BulkActionBar count={selected.size} onClear={clear}>
          <Button
            size="sm"
            variant="outline"
            disabled={bulk.isPending}
            onClick={() => runBulk("status", "PUBLISHED")}
          >
            <Send className="size-3.5" />
            Publikasikan
          </Button>
          <Button
            size="sm"
            variant="outline"
            disabled={bulk.isPending}
            onClick={() => runBulk("status", "DRAFT")}
          >
            <FilePen className="size-3.5" />
            Draft
          </Button>
          <Button
            size="sm"
            variant="outline"
            disabled={bulk.isPending}
            onClick={() => runBulk("status", "ARCHIVED")}
          >
            <Archive className="size-3.5" />
            Arsipkan
          </Button>
          {isAdmin ? (
            <Button
              size="sm"
              variant="destructive"
              disabled={bulk.isPending}
              onClick={() => setBulkDeleting(true)}
            >
              <Trash2 className="size-3.5" />
              Hapus
            </Button>
          ) : null}
        </BulkActionBar>

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
              Tidak ada course yang cocok dengan filter ini.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-10">
                    <Checkbox
                      aria-label="Pilih semua"
                      checked={allChecked ? true : someChecked ? "indeterminate" : false}
                      onCheckedChange={() => toggleAll(ids)}
                    />
                  </TableHead>
                  {["COURSE", "PATH", "TAG", "SISWA", "STATUS"].map((head) => (
                    <TableHead
                      key={head}
                      className="text-[11px] font-semibold tracking-wider text-muted-foreground"
                    >
                      {head}
                    </TableHead>
                  ))}
                  <TableHead className="w-16 text-[11px] font-semibold tracking-wider text-muted-foreground">
                    AKSI
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {courses.map((course) => (
                  <TableRow
                    key={course.id}
                    data-state={selected.has(course.id) ? "selected" : undefined}
                  >
                    <TableCell>
                      <Checkbox
                        aria-label={`Pilih ${course.title}`}
                        checked={selected.has(course.id)}
                        onCheckedChange={() => toggle(course.id)}
                      />
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
                        onDelete={
                          isAdmin ? () => setDeleting(course) : undefined
                        }
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>

        {!isLoading && !isError && data ? (
          <DataTablePagination
            meta={data.meta}
            itemLabel="course"
            onPageChange={(next) => {
              setPage(next);
              clear();
            }}
            onPerPageChange={(value) => {
              setPerPage(value);
              setPage(1);
              clear();
            }}
          />
        ) : null}
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

      <ConfirmDeleteDialog
        open={bulkDeleting}
        onOpenChange={setBulkDeleting}
        title={`Hapus ${selected.size} course?`}
        description="Semua course terpilih beserta silabus dan progres siswa akan dihapus permanen."
        isPending={bulk.isPending}
        onConfirm={() => runBulk("delete")}
      />
    </div>
  );
}
