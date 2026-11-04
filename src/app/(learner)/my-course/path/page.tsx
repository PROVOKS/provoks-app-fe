"use client";

import Link from "next/link";
import { ArrowUpRight, CheckCircle2, Route } from "lucide-react";

import { Skeleton } from "@/components/ui/skeleton";
import { useMyPaths } from "@/hooks/use-learning";
import { cn } from "@/lib/utils";

export default function PathListPage() {
  const { data, isLoading, isError } = useMyPaths();
  const paths = data ?? [];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <h1 className="font-heading text-2xl font-bold">Path Belajar</h1>
        <p className="text-[13px] text-muted-foreground">
          Pilih path untuk melihat daftar course dan melanjutkan belajar.
        </p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-44 w-full rounded-2xl" />
          ))}
        </div>
      ) : isError ? (
        <p className="py-16 text-center text-sm text-muted-foreground">
          Gagal memuat daftar path.
        </p>
      ) : paths.length === 0 ? (
        <p className="py-16 text-center text-sm text-muted-foreground">
          Belum ada path yang dipublikasikan.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {paths.map((path) => (
            <Link
              key={path.id}
              href={`/my-course/path/${path.slug}`}
              className="group flex flex-col gap-3 rounded-2xl border border-border bg-card p-5 transition-colors hover:border-primary/40 hover:bg-primary/[0.02]"
            >
              <div className="flex items-start justify-between gap-3">
                <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
                  <Route className="size-5" />
                </span>

                <span
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold",
                    path.joined
                      ? "bg-primary/10 text-primary"
                      : "bg-muted text-muted-foreground",
                  )}
                >
                  {path.joined ? (
                    <>
                      <CheckCircle2 className="size-3" />
                      Diikuti
                    </>
                  ) : (
                    "Belum bergabung"
                  )}
                </span>
              </div>

              <div className="flex flex-col gap-1">
                <h2 className="font-heading text-[16px] font-semibold">
                  {path.name}
                </h2>
                <p className="line-clamp-2 text-[13px] leading-relaxed text-muted-foreground">
                  {path.description || "Path belajar terstruktur dari dasar sampai mahir."}
                </p>
              </div>

              <div className="mt-auto flex items-center justify-between pt-1 text-xs">
                <span className="text-muted-foreground">
                  {path.courseCount} course
                </span>
                <span className="inline-flex items-center gap-1 font-semibold text-primary">
                  Lihat path
                  <ArrowUpRight className="size-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
