"use client";

import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

export type PaginationMeta = {
  page: number;
  perPage: number;
  total: number;
  totalPages: number;
};

/** Deret nomor halaman: 1 … (n-1) n (n+1) … akhir */
function buildPages(page: number, totalPages: number): (number | "ellipsis")[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const start = Math.max(2, page - 1);
  const end = Math.min(totalPages - 1, page + 1);
  const pages: (number | "ellipsis")[] = [1];

  if (start > 2) pages.push("ellipsis");
  for (let i = start; i <= end; i += 1) pages.push(i);
  if (end < totalPages - 1) pages.push("ellipsis");
  pages.push(totalPages);

  return pages;
}

function PageButton({
  children,
  className,
  ...props
}: React.ComponentProps<"button">) {
  return (
    <button
      type="button"
      className={cn(
        "grid size-9 place-items-center rounded-[10px] text-foreground transition-colors",
        "hover:bg-muted disabled:pointer-events-none disabled:opacity-40",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}

/**
 * Pagination untuk datatable: info jumlah data + pilihan jumlah baris +
 * navigasi halaman. Dipakai bersama oleh tabel admin.
 */
export function DataTablePagination({
  meta,
  onPageChange,
  onPerPageChange,
  perPageOptions = [10, 20, 50],
  itemLabel = "data",
  className,
}: {
  meta: PaginationMeta;
  onPageChange: (page: number) => void;
  onPerPageChange?: (perPage: number) => void;
  perPageOptions?: number[];
  itemLabel?: string;
  className?: string;
}) {
  const { page, perPage, total, totalPages } = meta;
  const from = total === 0 ? 0 : (page - 1) * perPage + 1;
  const to = Math.min(page * perPage, total);
  const pages = buildPages(page, totalPages);

  return (
    <div
      className={cn(
        "flex flex-wrap items-center justify-between gap-3 pt-4",
        className,
      )}
    >
      <p className="text-[13px] text-muted-foreground">
        Menampilkan{" "}
        <span className="font-semibold text-foreground">
          {from}–{to}
        </span>{" "}
        dari <span className="font-semibold text-foreground">{total}</span>{" "}
        {itemLabel}
      </p>

      <div className="flex flex-wrap items-center gap-3">
        {onPerPageChange ? (
          <div className="flex items-center gap-2">
            <span className="text-[13px] text-muted-foreground">Baris</span>
            <Select
              value={String(perPage)}
              onValueChange={(value) => onPerPageChange(Number(value))}
            >
              <SelectTrigger className="h-9 w-[76px] text-[13px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {perPageOptions.map((option) => (
                  <SelectItem key={option} value={String(option)}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        ) : null}

        <nav className="flex items-center gap-1" aria-label="Navigasi halaman">
          <PageButton
            aria-label="Halaman sebelumnya"
            disabled={page <= 1}
            onClick={() => onPageChange(page - 1)}
          >
            <ChevronLeft className="size-4" />
          </PageButton>

          {pages.map((item, index) =>
            item === "ellipsis" ? (
              <span
                key={`ellipsis-${index}`}
                className="grid size-9 place-items-center text-muted-foreground"
              >
                <MoreHorizontal className="size-4" />
              </span>
            ) : (
              <button
                key={item}
                type="button"
                aria-current={item === page ? "page" : undefined}
                onClick={() => onPageChange(item)}
                className={cn(
                  "grid size-9 place-items-center rounded-[10px] text-[13px] font-medium transition-colors",
                  item === page
                    ? "bg-primary font-semibold text-primary-foreground"
                    : "text-foreground hover:bg-muted",
                )}
              >
                {item}
              </button>
            ),
          )}

          <PageButton
            aria-label="Halaman berikutnya"
            disabled={page >= totalPages}
            onClick={() => onPageChange(page + 1)}
          >
            <ChevronRight className="size-4" />
          </PageButton>
        </nav>
      </div>
    </div>
  );
}
