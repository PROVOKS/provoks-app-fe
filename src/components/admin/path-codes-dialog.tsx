"use client";

import { useEffect, useState } from "react";
import { Copy, KeyRound, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useGeneratePathCode,
  usePathCodes,
  useRevokePathCode,
  type PathJoinCode,
} from "@/hooks/use-path-codes";
import { cn } from "@/lib/utils";
import type { Path } from "@/types";

const DURATION_OPTIONS = [
  { value: "7", label: "7 hari" },
  { value: "30", label: "30 hari" },
  { value: "90", label: "90 hari" },
  { value: "permanent", label: "Permanen" },
] as const;

const STATUS_STYLE: Record<PathJoinCode["status"], string> = {
  ACTIVE: "bg-success/10 text-success",
  EXPIRED: "bg-warning/10 text-warning",
  REVOKED: "bg-destructive/10 text-destructive",
};

const STATUS_LABEL: Record<PathJoinCode["status"], string> = {
  ACTIVE: "Aktif",
  EXPIRED: "Kedaluwarsa",
  REVOKED: "Dicabut",
};

function formatDate(value: string | null) {
  if (!value) return "-";
  return new Date(value).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function PathCodesDialog({
  open,
  onOpenChange,
  path,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  path: Path | null;
}) {
  const [duration, setDuration] = useState<string>("30");
  const { data, isLoading } = usePathCodes(open && path ? path.id : null);
  const generate = useGeneratePathCode(path?.id ?? "");
  const revoke = useRevokePathCode(path?.id ?? "");

  useEffect(() => {
    if (open) setDuration("30");
  }, [open]);

  function handleGenerate() {
    const expiresAt =
      duration === "permanent"
        ? null
        : new Date(Date.now() + Number(duration) * 24 * 60 * 60 * 1000).toISOString();
    generate.mutate(expiresAt);
  }

  async function copyCode(code: string) {
    try {
      await navigator.clipboard.writeText(code);
      toast.success("Kode disalin");
    } catch {
      toast.error("Gagal menyalin kode");
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="grid-rows-[auto_minmax(0,1fr)_auto] sm:max-w-[620px]">
        <DialogHeader>
          <DialogTitle className="font-heading text-lg">
            Kode Akses {path ? `— ${path.name}` : ""}
          </DialogTitle>
          <DialogDescription>
            Bagikan kode ini ke siswa. Kode bisa kedaluwarsa otomatis atau dicabut
            kapan saja.
          </DialogDescription>
        </DialogHeader>

        <div className="flex min-h-0 flex-col gap-4 overflow-y-auto pr-1">
          <div className="flex flex-wrap items-end gap-2.5 rounded-xl border border-border p-3">
            <div className="flex min-w-[150px] flex-1 flex-col gap-1.5">
              <span className="text-[13px] font-medium">Masa berlaku</span>
              <Select value={duration} onValueChange={setDuration}>
                <SelectTrigger className="h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {DURATION_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button size="sm" disabled={generate.isPending || !path} onClick={handleGenerate}>
              {generate.isPending ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <KeyRound className="size-4" />
              )}
              Generate kode
            </Button>
          </div>

          {isLoading ? (
            <Skeleton className="h-32 w-full" />
          ) : (data?.length ?? 0) === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              Belum ada kode. Generate kode pertama di atas.
            </p>
          ) : (
            <div className="flex flex-col gap-2">
              {data?.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border px-3 py-2.5"
                >
                  <div className="flex min-w-0 flex-col gap-0.5">
                    <span className="flex items-center gap-2">
                      <code className="font-mono text-[13px] font-semibold tracking-wider">
                        {item.code}
                      </code>
                      <span
                        className={cn(
                          "rounded-full px-2 py-0.5 text-[11px] font-semibold",
                          STATUS_STYLE[item.status],
                        )}
                      >
                        {STATUS_LABEL[item.status]}
                      </span>
                    </span>
                    <span className="text-[11px] text-muted-foreground">
                      {item.expiresAt
                        ? `Kedaluwarsa ${formatDate(item.expiresAt)}`
                        : "Permanen"}
                      {" · "}
                      {item.usedCount} pemakai
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <Button
                      size="icon"
                      variant="outline"
                      className="size-8"
                      aria-label={`Salin ${item.code}`}
                      onClick={() => void copyCode(item.code)}
                    >
                      <Copy className="size-3.5" />
                    </Button>
                    {item.status === "ACTIVE" ? (
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={revoke.isPending}
                        onClick={() => revoke.mutate(item.id)}
                      >
                        Cabut
                      </Button>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Tutup
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
