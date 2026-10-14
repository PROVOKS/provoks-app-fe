"use client";

import { useQuery } from "@tanstack/react-query";
import { Download, Ellipsis, Plus, Search } from "lucide-react";

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

const LEVEL_COLOR: Record<Path["level"], string> = {
  BEGINNER: "text-success",
  INTERMEDIATE: "text-info",
  ADVANCED: "text-primary",
};

export default function PathsPage() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["paths"],
    queryFn: async () => {
      const { data } = await api.get<ApiEnvelope<Paginated<Path>>>("/paths");
      return data.data;
    },
  });

  const paths = data?.items ?? [];

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
          <div className="flex items-center gap-2.5">
            <div className="relative w-80">
              <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Cari path..." className="h-9 pl-10" />
            </div>
          </div>
          <div className="flex items-center gap-2.5">
            <Button variant="outline" size="sm">
              <Download className="size-4" />
              Export
            </Button>
            <Button size="sm">
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
                  <TableHead className="text-[11px] font-semibold tracking-wider text-muted-foreground">
                    PATH
                  </TableHead>
                  <TableHead className="text-[11px] font-semibold tracking-wider text-muted-foreground">
                    LEVEL
                  </TableHead>
                  <TableHead className="text-[11px] font-semibold tracking-wider text-muted-foreground">
                    COURSE
                  </TableHead>
                  <TableHead className="text-[11px] font-semibold tracking-wider text-muted-foreground">
                    STATUS
                  </TableHead>
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
                    <TableCell
                      className={`text-[13px] font-medium ${LEVEL_COLOR[path.level]}`}
                    >
                      {path.level}
                    </TableCell>
                    <TableCell className="text-[13px] text-muted-foreground">
                      {path.courseCount ?? 0} course
                    </TableCell>
                    <TableCell className="text-[13px] text-muted-foreground">
                      {path.status}
                    </TableCell>
                    <TableCell>
                      <Ellipsis className="size-4 text-muted-foreground" />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </div>
    </div>
  );
}
