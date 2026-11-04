"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { KeyRound, Plus, Search } from "lucide-react";
import { toast } from "sonner";

import { ConfirmDeleteDialog } from "@/components/admin/confirm-delete-dialog";
import { PathCodesDialog } from "@/components/admin/path-codes-dialog";
import { PathFormDialog } from "@/components/admin/path-form-dialog";
import { RowActions } from "@/components/admin/row-actions";
import { buildStatusActions } from "@/components/admin/row-status-actions";
import { useAuth } from "@/components/providers/auth-provider";
import { Button } from "@/components/ui/button";
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
import { api, type ApiEnvelope } from "@/lib/api-client";
import type { Paginated, Path } from "@/types";

const STATUS_LABEL: Record<Path["status"], string> = {
  DRAFT: "Draft",
  PUBLISHED: "Published",
  ARCHIVED: "Archived",
};

export default function PathsPage() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const isAdmin = user?.role === "ADMIN";

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Path | null>(null);
  const [deleting, setDeleting] = useState<Path | null>(null);
  const [codesPath, setCodesPath] = useState<Path | null>(null);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<Path["status"] | "ALL">("ALL");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(20);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["paths", page, perPage, search, status],
    queryFn: async () => {
      const { data } = await api.get<ApiEnvelope<Paginated<Path>>>("/paths", {
        params: {
          page,
          perPage,
          search: search || undefined,
          status: status === "ALL" ? undefined : status,
        },
      });
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
      void queryClient.invalidateQueries({ queryKey: ["stats"] });
      setDeleting(null);
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const changeStatus = useMutation({
    mutationFn: async ({
      id,
      status,
    }: {
      id: string;
      status: Path["status"];
    }) => {
      await api.put(`/paths/${id}`, { status });
    },
    onSuccess: () => {
      toast.success("Status path diperbarui");
      void queryClient.invalidateQueries({ queryKey: ["paths"] });
      void queryClient.invalidateQueries({ queryKey: ["stats"] });
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const paths = data?.items ?? [];

  function resetPage() {
    setPage(1);
  }

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
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-col gap-0.5">
          <h1 className="font-heading text-[26px] font-bold">Manajemen Path</h1>
          <p className="text-[13px] text-muted-foreground">
            Kelola learning path dan urutan course di dalamnya.
          </p>
        </div>
        <Button size="sm" onClick={openCreate}>
          <Plus className="size-4" />
          Tambah Path
        </Button>
      </div>

      <div className="rounded-[20px] border border-border bg-card p-4 sm:p-6">
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="relative w-full sm:w-72">
            <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Cari path..."
              className="h-9 pl-10"
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                resetPage();
              }}
            />
          </div>

          <Select
            value={status}
            onValueChange={(value) => {
              setStatus(value as Path["status"] | "ALL");
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

        <div className="mt-4">
          {isLoading ? (
            <Skeleton className="h-40 w-full" />
          ) : isError ? (
            <p className="py-16 text-center text-sm text-muted-foreground">
              Gagal memuat data path.
            </p>
          ) : paths.length === 0 ? (
            <p className="py-16 text-center text-sm text-muted-foreground">
              Tidak ada path yang cocok dengan filter ini.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  {["PATH", "COURSE", "STATUS"].map((head) => (
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
                    <TableCell className="text-[13px] text-muted-foreground">
                      {path.courseCount ?? 0} course
                    </TableCell>
                    <TableCell className="text-[13px] text-muted-foreground">
                      {STATUS_LABEL[path.status]}
                    </TableCell>
                    <TableCell>
                      <RowActions
                        label={`Aksi ${path.name}`}
                        actions={[
                          {
                            label: "Kode akses",
                            icon: <KeyRound />,
                            onSelect: () => setCodesPath(path),
                          },
                          ...buildStatusActions(path.status, (next) =>
                            changeStatus.mutate({ id: path.id, status: next }),
                          ),
                        ]}
                        onEdit={() => openEdit(path)}
                        onDelete={isAdmin ? () => setDeleting(path) : undefined}
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
            itemLabel="path"
            onPageChange={setPage}
            onPerPageChange={(value) => {
              setPerPage(value);
              setPage(1);
            }}
          />
        ) : null}
      </div>

      <PathFormDialog open={formOpen} onOpenChange={setFormOpen} path={editing} />

      <PathCodesDialog
        open={Boolean(codesPath)}
        onOpenChange={(next) => {
          if (!next) setCodesPath(null);
        }}
        path={codesPath}
      />

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
