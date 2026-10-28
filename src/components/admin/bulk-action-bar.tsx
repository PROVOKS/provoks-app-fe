"use client";

import { Button } from "@/components/ui/button";

/**
 * Bar aksi massal. Muncul hanya kalau ada baris yang dipilih.
 * Anak-anaknya adalah tombol aksi (hapus, ubah status, dst).
 */
export function BulkActionBar({
  count,
  onClear,
  children,
}: {
  count: number;
  onClear: () => void;
  children: React.ReactNode;
}) {
  if (count === 0) return null;

  return (
    <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-primary/30 bg-primary/5 px-3 py-2">
      <p className="text-[13px] font-semibold text-primary">
        {count} dipilih
      </p>
      <div className="flex flex-wrap items-center gap-2">
        {children}
        <Button variant="ghost" size="sm" onClick={onClear}>
          Batal pilih
        </Button>
      </div>
    </div>
  );
}
