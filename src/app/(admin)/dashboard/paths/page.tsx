"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Download, Plus, Search } from "lucide-react";
import { toast } from "sonner";

import { ConfirmDeleteDialog } from "@/components/admin/confirm-delete-dialog";
import { PathFormDialog } from "@/components/admin/path-form-dialog";
import { RowActions } from "@/components/admin/row-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import type { Paginated, Path } from "@/types";

const STATUS_LABEL: Record<Path["status"], string> = {
  DRAFT: "Draft",
  PUBLISHED: "Published",
  ARCHIVED: "Archived",
};

function TrackBadge({ isFastTrack }: { isFastTrack: boolean }) {
  return (
    <span
      className={
        isFastTrack
          ? "rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary"
          : "rounded-full bg-muted px-2.5 py-1 text-xs font-semibold text-muted-foreground"
      }
    >
      {isFastTrack ? "Fast Track" : "Reguler"}
    </span>
  );
}

export default function PathsPage() {
  const queryClient = useQueryClient();
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Path | null>(null);
  const [deleting, setDeleting] = useState<Path | null>(null);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["paths"],
    queryFn: async () => {
      const { data } = await api.get<ApiEnvelope<Paginated<Path>>>("/paths");
      return data.data;
    },
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/paths/${id}`);
    },
    onSuccess: () => {
      toast.success("Path dihapus");
      void queryClient.invalidateQueries({ queryKey: ["paths"] });
      setDeleting(null);
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const paths = data?.items ?? [];

  function openCreate() {
    setEditing(null);
    setFormOpen(true);
  }

  function openEdit(path: Path) {
    setEditing(path);
    setFormOpen(true);
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex h-12 items-center">
        <div className="flex flex-col gap-0.5">
          <h1 className="font-heading text-[26px] font-bold">Manajemen Path</h1>
          <p className="text-[13px] text-muted-foreground">
            Kelola learning path dan urutan course di dalamnya.
          </p>
        </div>
      </div>

      <div className="rounded-[20px] border border-border bg-card p-6">
        <div className="flex items-center justify-between">
          <div className="relative w-80">
            <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Cari path..." className="h-9 pl-10" />
          </div>
          <div className="flex items-center gap-2.5">
            <Button variant="outline" size="sm">
              <Download className="size-4" />
              Export
            </Button>
            <Button size="sm" onClick={openCreate}>
              <Plus className="size-4" />
              Tambah Path
            </Button>
          </div>
        </div>

        <div className="mt-4">
          {isLoading ? (
            <Skeleton className="h-40 w-full" />
          ) : isError ? (
            <p className="py-16 text-center text-sm text-muted-foreground">
              Gagal memuat data path.
            </p>
          ) : paths.length === 0 ? (
            <p className="py-16 text-center text-sm text-muted-foreground">
              Belum ada path.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  {["PATH", "TIPE", "COURSE", "STATUS"].map((head) => (
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
                {paths.map((path) => (
                  <TableRow key={path.id}>
                    <TableCell className="text-[13px] font-medium">
                      {path.name}
                    </TableCell>
                    <TableCell>
                      <TrackBadge isFastTrack={path.isFastTrack} />
                    </TableCell>
                    <TableCell className="text-[13px] text-muted-foreground">
                      {path.courseCount ?? 0} course
                    </TableCell>
                    <TableCell className="text-[13px] text-muted-foreground">
                      {STATUS_LABEL[path.status]}
                    </TableCell>
                    <TableCell>
                      <RowActions
                        label={`Aksi ${path.name}`}
                        onEdit={() => openEdit(path)}
                        onDelete={() => setDeleting(path)}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </div>

      <PathFormDialog open={formOpen} onOpenChange={setFormOpen} path={editing} />

      <ConfirmDeleteDialog
        open={Boolean(deleting)}
        onOpenChange={(open) => {
          if (!open) setDeleting(null);
        }}
        title={`Hapus path "${deleting?.name ?? ""}"?`}
        description="Path beserta relasinya akan dihapus permanen. Tindakan ini tidak bisa dibatalkan."
        isPending={remove.isPending}
        onConfirm={() => deleting && remove.mutate(deleting.id)}
      />
    </div>
  );
}
