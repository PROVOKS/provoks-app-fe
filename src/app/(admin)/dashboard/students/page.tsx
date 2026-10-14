"use client";

import { useState } from "react";
import { Download, Search, Upload } from "lucide-react";

import { StudentImportDialog } from "@/components/admin/student-import-dialog";
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
import { useStudents } from "@/hooks/use-students";
import { cn } from "@/lib/utils";
import type { PathEnrollmentStatus } from "@/types";

const PATH_STATUS_LABEL: Record<PathEnrollmentStatus, string> = {
  APPROVED: "Aktif",
  PENDING: "Menunggu",
  REJECTED: "Ditolak",
};

function PathChip({ name, status }: { name: string; status: PathEnrollmentStatus }) {
  return (
    <span
      className={cn(
        "rounded-full px-2.5 py-1 text-[11px] font-semibold",
        status === "APPROVED" && "bg-primary/10 text-primary",
        status === "PENDING" && "bg-muted text-muted-foreground",
        status === "REJECTED" && "bg-destructive/10 text-destructive",
      )}
    >
      {name} · {PATH_STATUS_LABEL[status]}
    </span>
  );
}

export default function StudentsPage() {
  const [search, setSearch] = useState("");
  const [importOpen, setImportOpen] = useState(false);

  const { data, isLoading, isError } = useStudents({ search: search || undefined });
  const students = data?.items ?? [];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex h-12 items-center">
        <div className="flex flex-col gap-0.5">
          <h1 className="font-heading text-[26px] font-bold">Manajemen Siswa</h1>
          <p className="text-[13px] text-muted-foreground">
            Data siswa, NIM, dan path yang sedang diikuti.
          </p>
        </div>
      </div>

      <div className="rounded-[20px] border border-border bg-card p-6">
        <div className="flex items-center justify-between">
          <div className="relative w-80">
            <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Cari nama, NIM, atau email..."
              className="h-9 pl-10"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>
          <div className="flex items-center gap-2.5">
            <Button variant="outline" size="sm" disabled>
              <Download className="size-4" />
              Export
            </Button>
            <Button size="sm" onClick={() => setImportOpen(true)}>
              <Upload className="size-4" />
              Import CSV
            </Button>
          </div>
        </div>

        <p className="mt-3 text-xs text-muted-foreground">
          Total {data?.meta.total ?? 0} siswa
        </p>

        <div className="mt-2">
          {isLoading ? (
            <Skeleton className="h-40 w-full" />
          ) : isError ? (
            <p className="py-16 text-center text-sm text-muted-foreground">
              Gagal memuat data siswa.
            </p>
          ) : students.length === 0 ? (
            <p className="py-16 text-center text-sm text-muted-foreground">
              Belum ada siswa. Import file CSV untuk menambahkan.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  {["NAMA", "NIM", "PRODI", "PATH", "EMAIL"].map((head) => (
                    <TableHead
                      key={head}
                      className="text-[11px] font-semibold tracking-wider text-muted-foreground"
                    >
                      {head}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {students.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell className="text-[13px] font-medium">
                      {student.name}
                    </TableCell>
                    <TableCell className="text-[13px] text-muted-foreground">
                      {student.nim ?? "-"}
                    </TableCell>
                    <TableCell className="text-[13px] text-muted-foreground">
                      {student.prodi ?? "-"}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1.5">
                        {student.paths.length === 0 ? (
                          <span className="text-[13px] text-muted-foreground">-</span>
                        ) : (
                          student.paths.map((path) => (
                            <PathChip
                              key={path.enrollmentId}
                              name={path.name}
                              status={path.status}
                            />
                          ))
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-[13px] text-muted-foreground">
                      {student.email}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </div>

      <StudentImportDialog open={importOpen} onOpenChange={setImportOpen} />
    </div>
  );
}
