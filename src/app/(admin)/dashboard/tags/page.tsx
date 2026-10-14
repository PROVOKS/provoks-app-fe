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
import type { Paginated, Tag } from "@/types";

export default function TagsPage() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["tags"],
    queryFn: async () => {
      const { data } = await api.get<ApiEnvelope<Paginated<Tag>>>("/tags");
      return data.data;
    },
  });

  const tags = data?.items ?? [];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex h-12 items-center">
        <div className="flex flex-col gap-0.5">
          <h1 className="font-heading text-[26px] font-bold">Manajemen Tag</h1>
          <p className="text-[13px] text-muted-foreground">
            Kelola tag untuk menandai course (React, Next.js, Figma, dll).
          </p>
        </div>
      </div>

      <div className="rounded-[20px] border border-border bg-card p-6">
        <div className="flex items-center justify-between">
          <div className="relative w-80">
            <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Cari tag..." className="h-9 pl-10" />
          </div>
          <div className="flex items-center gap-2.5">
            <Button variant="outline" size="sm">
              <Download className="size-4" />
              Export
            </Button>
            <Button size="sm">
              <Plus className="size-4" />
              Tambah Tag
            </Button>
          </div>
        </div>

        <div className="mt-4">
          {isLoading ? (
            <Skeleton className="h-40 w-full" />
          ) : isError ? (
            <p className="py-16 text-center text-sm text-muted-foreground">
              Gagal memuat data tag.
            </p>
          ) : tags.length === 0 ? (
            <p className="py-16 text-center text-sm text-muted-foreground">
              Belum ada tag.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
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
                  <TableRow key={tag.id}>
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
