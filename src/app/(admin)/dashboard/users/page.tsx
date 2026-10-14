"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Plus, Search, Upload } from "lucide-react";

import { ConfirmDeleteDialog } from "@/components/admin/confirm-delete-dialog";
import { RowActions } from "@/components/admin/row-actions";
import { UserFormDialog } from "@/components/admin/user-form-dialog";
import { UserImportDialog } from "@/components/admin/user-import-dialog";
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
import { useDeleteUser, useUsers } from "@/hooks/use-users";
import { api, type ApiEnvelope } from "@/lib/api-client";
import { cn } from "@/lib/utils";
import type { ManagedUser, Paginated, Path, Role } from "@/types";

const ROLE_LABEL: Record<Role, string> = {
  ADMIN: "Admin",
  INSTRUCTOR: "Instruktur",
  STUDENT: "Siswa",
};

const ROLE_CHIP: Record<Role, string> = {
  ADMIN: "bg-primary/10 text-primary",
  INSTRUCTOR: "bg-secondary/25 text-secondary-foreground",
  STUDENT: "bg-muted text-muted-foreground",
};

export default function UsersPage() {
  const { user: currentUser } = useAuth();
  const [search, setSearch] = useState("");
  const [role, setRole] = useState<Role | "ALL">("ALL");
  const [pathId, setPathId] = useState<string>("ALL");
  const [importOpen, setImportOpen] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<ManagedUser | null>(null);
  const [deleting, setDeleting] = useState<ManagedUser | null>(null);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(20);

  const { data, isLoading, isError } = useUsers({
    search: search || undefined,
    role,
    pathId: pathId === "ALL" ? undefined : pathId,
    page,
    perPage,
  });

  // filter berubah -> kembali ke halaman pertama
  function changeSearch(value: string) {
    setSearch(value);
    setPage(1);
  }

  function changeRole(value: Role | "ALL") {
    setRole(value);
    setPage(1);
  }

  function changePath(value: string) {
    setPathId(value);
    setPage(1);
  }
  const { data: pathData } = useQuery({
    queryKey: ["paths", "options"],
    queryFn: async () => {
      const { data } = await api.get<ApiEnvelope<Paginated<Path>>>("/paths", {
        params: { perPage: 100 },
      });
      return data.data.items;
    },
  });

  const remove = useDeleteUser();
  const users = data?.items ?? [];
  const canDelete = currentUser?.role === "ADMIN";

  return (
    <div className="flex flex-col gap-4">
      <div className="flex h-12 items-center">
        <div className="flex flex-col gap-0.5">
          <h1 className="font-heading text-[26px] font-bold">Manajemen User</h1>
          <p className="text-[13px] text-muted-foreground">
            Kelola akun admin, instruktur, dan siswa.
          </p>
        </div>
      </div>

      <div className="rounded-[20px] border border-border bg-card p-6">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="relative w-72">
              <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Cari nama, NIM, atau email..."
                className="h-9 pl-10"
                value={search}
                onChange={(event) => changeSearch(event.target.value)}
              />
            </div>

            <Select value={role} onValueChange={(value) => changeRole(value as Role | "ALL")}>
              <SelectTrigger className="h-9 w-[150px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">Semua role</SelectItem>
                <SelectItem value="ADMIN">Admin</SelectItem>
                <SelectItem value="INSTRUCTOR">Instruktur</SelectItem>
                <SelectItem value="STUDENT">Siswa</SelectItem>
              </SelectContent>
            </Select>

            <Select value={pathId} onValueChange={changePath}>
              <SelectTrigger className="h-9 w-[190px]">
                <SelectValue placeholder="Semua path" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">Semua path</SelectItem>
                {(pathData ?? []).map((path) => (
                  <SelectItem key={path.id} value={path.id}>
                    {path.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2.5">
            <Button variant="outline" size="sm" onClick={() => setImportOpen(true)}>
              <Upload className="size-4" />
              Import CSV
            </Button>
            <Button
              size="sm"
              onClick={() => {
                setEditing(null);
                setFormOpen(true);
              }}
            >
              <Plus className="size-4" />
              Tambah User
            </Button>
          </div>
        </div>

        <div className="mt-4">
          {isLoading ? (
            <Skeleton className="h-40 w-full" />
          ) : isError ? (
            <p className="py-16 text-center text-sm text-muted-foreground">
              Gagal memuat data user.
            </p>
          ) : users.length === 0 ? (
            <p className="py-16 text-center text-sm text-muted-foreground">
              Tidak ada user yang cocok dengan filter ini.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  {["NAMA", "ROLE", "NIM", "PRODI", "PATH"].map((head) => (
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
                {users.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="text-[13px] font-medium">
                      {item.name}
                      <span className="block text-xs font-normal text-muted-foreground">
                        {item.email}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span
                        className={cn(
                          "rounded-full px-2.5 py-1 text-[11px] font-semibold",
                          ROLE_CHIP[item.role],
                        )}
                      >
                        {ROLE_LABEL[item.role]}
                      </span>
                    </TableCell>
                    <TableCell className="text-[13px] text-muted-foreground">
                      {item.nim ?? "-"}
                    </TableCell>
                    <TableCell className="text-[13px] text-muted-foreground">
                      {item.prodi ?? "-"}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1.5">
                        {item.paths.length === 0 ? (
                          <span className="text-[13px] text-muted-foreground">-</span>
                        ) : (
                          item.paths.map((path) => (
                            <span
                              key={path.enrollmentId}
                              className="rounded-full bg-muted px-2.5 py-1 text-[11px] font-semibold text-muted-foreground"
                            >
                              {path.name}
                            </span>
                          ))
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <RowActions
                        label={`Aksi ${item.name}`}
                        onEdit={() => {
                          setEditing(item);
                          setFormOpen(true);
                        }}
                        onDelete={canDelete ? () => setDeleting(item) : undefined}
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
            itemLabel="user"
            onPageChange={setPage}
            onPerPageChange={(value) => {
              setPerPage(value);
              setPage(1);
            }}
          />
        ) : null}
      </div>

      <UserFormDialog
        open={formOpen}
        onOpenChange={(open) => {
          setFormOpen(open);
          if (!open) setEditing(null);
        }}
        user={editing}
        paths={pathData ?? []}
      />

      <UserImportDialog open={importOpen} onOpenChange={setImportOpen} />

      <ConfirmDeleteDialog
        open={Boolean(deleting)}
        onOpenChange={(open) => {
          if (!open) setDeleting(null);
        }}
        title={`Hapus user "${deleting?.name ?? ""}"?`}
        description="Akun beserta enrollment dan progresnya akan dihapus permanen."
        isPending={remove.isPending}
        onConfirm={() => {
          if (!deleting) return;
          remove.mutate(deleting.id, { onSuccess: () => setDeleting(null) });
        }}
      />
    </div>
  );
}
