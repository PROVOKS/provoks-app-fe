"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Search, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { BulkActionBar } from "@/components/admin/bulk-action-bar";
import { ConfirmDeleteDialog } from "@/components/admin/confirm-delete-dialog";
import { RowActions } from "@/components/admin/row-actions";
import { TagFormDialog } from "@/components/admin/tag-form-dialog";
import { useAuth } from "@/components/providers/auth-provider";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { DataTablePagination } from "@/components/ui/pagination";
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
import type { Paginated, Tag } from "@/types";

export default function TagsPage() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const isAdmin = user?.role === "ADMIN";

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Tag | null>(null);
  const [deleting, setDeleting] = useState<Tag | null>(null);
  const [bulkDeleting, setBulkDeleting] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(20);

  const { selected, toggle, toggleAll, clear } = useRowSelection();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["tags", page, perPage, search],
    queryFn: async () => {
      const { data } = await api.get<ApiEnvelope<Paginated<Tag>>>("/tags", {
        params: { page, perPage, search: search || undefined },
      });
      return data.data;
    },
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/tags/${id}`);
    },
    onSuccess: () => {
      toast.success("Tag dihapus");
      void queryClient.invalidateQueries({ queryKey: ["tags"] });
      void queryClient.invalidateQueries({ queryKey: ["stats"] });
      setDeleting(null);
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const bulk = useBulkAction("/tags/bulk", [["tags"], ["stats"]]);

  const tags = data?.items ?? [];
  const ids = tags.map((tag) => tag.id);
  const allChecked = ids.length > 0 && ids.every((id) => selected.has(id));
  const someChecked = ids.some((id) => selected.has(id));

  function resetPage() {
    setPage(1);
    clear();
  }

  function openCreate() {
    setEditing(null);
    setFormOpen(true);
  }

  function openEdit(tag: Tag) {
    setEditing(tag);
    setFormOpen(true);
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-col gap-0.5">
          <h1 className="font-heading text-[26px] font-bold">Manajemen Tag</h1>
          <p className="text-[13px] text-muted-foreground">
            Kelola tag untuk menandai course (React, Next.js, Figma, dll).
          </p>
        </div>
        <Button size="sm" onClick={openCreate}>
          <Plus className="size-4" />
          Tambah Tag
        </Button>
      </div>

      <div className="rounded-[20px] border border-border bg-card p-4 sm:p-6">
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="relative w-full sm:w-72">
            <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Cari tag..."
              className="h-9 pl-10"
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                resetPage();
              }}
            />
          </div>
        </div>

        <BulkActionBar count={selected.size} onClear={clear}>
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
            <Skeleton className="h-40 w-full" />
          ) : isError ? (
            <p className="py-16 text-center text-sm text-muted-foreground">
              Gagal memuat data tag.
            </p>
          ) : tags.length === 0 ? (
            <p className="py-16 text-center text-sm text-muted-foreground">
              Tidak ada tag yang cocok dengan filter ini.
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
                  {["TAG", "SLUG", "KATEGORI", "COURSE"].map((head) => (
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
                {tags.map((tag) => (
                  <TableRow
                    key={tag.id}
                    data-state={selected.has(tag.id) ? "selected" : undefined}
                  >
                    <TableCell>
                      <Checkbox
                        aria-label={`Pilih ${tag.name}`}
                        checked={selected.has(tag.id)}
                        onCheckedChange={() => toggle(tag.id)}
                      />
                    </TableCell>
                    <TableCell>
                      <span className="rounded-full bg-muted px-2.5 py-1 text-xs font-semibold text-muted-foreground">
                        {tag.name}
                      </span>
                    </TableCell>
                    <TableCell className="font-mono text-[13px] text-muted-foreground">
                      {tag.slug}
                    </TableCell>
                    <TableCell className="text-[13px] text-muted-foreground">
                      {tag.category ?? "-"}
                    </TableCell>
                    <TableCell className="text-[13px] text-muted-foreground">
                      {tag.courseCount ?? 0} course
                    </TableCell>
                    <TableCell>
                      <RowActions
                        label={`Aksi ${tag.name}`}
                        onEdit={() => openEdit(tag)}
                        onDelete={isAdmin ? () => setDeleting(tag) : undefined}
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
            itemLabel="tag"
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

      <TagFormDialog open={formOpen} onOpenChange={setFormOpen} tag={editing} />

      <ConfirmDeleteDialog
        open={Boolean(deleting)}
        onOpenChange={(open) => {
          if (!open) setDeleting(null);
        }}
        title={`Hapus tag "${deleting?.name ?? ""}"?`}
        description="Tag akan dilepas dari semua course yang memakainya. Tindakan ini tidak bisa dibatalkan."
        isPending={remove.isPending}
        onConfirm={() => deleting && remove.mutate(deleting.id)}
      />

      <ConfirmDeleteDialog
        open={bulkDeleting}
        onOpenChange={setBulkDeleting}
        title={`Hapus ${selected.size} tag?`}
        description="Tag terpilih akan dilepas dari semua course yang memakainya."
        isPending={bulk.isPending}
        onConfirm={() =>
          bulk.mutate(
            { action: "delete", ids: [...selected] },
            {
              onSuccess: () => {
                clear();
                setBulkDeleting(false);
              },
            },
          )
        }
      />
    </div>
  );
}
