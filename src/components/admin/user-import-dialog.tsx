"use client";

import { useRef, useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  FileSpreadsheet,
  Loader2,
  Upload,
  X,
} from "lucide-react";

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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  useImportStudents,
  usePreviewImportStudents,
  type ImportPreview,
} from "@/hooks/use-users";
import { cn } from "@/lib/utils";

const COLUMNS = "nama, nim, email, prodi, path, path_slug, perlu_review, catatan";

function StatusChip({ row }: { row: ImportPreview["rows"][number] }) {
  if (row.status === "error") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-destructive/10 px-2 py-0.5 text-[11px] font-semibold text-destructive">
        <AlertTriangle className="size-3" />
        Error
      </span>
    );
  }

  if (row.status === "warning") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-[11px] font-semibold text-muted-foreground">
        <AlertTriangle className="size-3" />
        Perlu review
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-semibold text-primary">
      <CheckCircle2 className="size-3" />
      {row.action === "update" ? "Update" : "Baru"}
    </span>
  );
}

export function UserImportDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState("");
  const [csv, setCsv] = useState("");
  const [preview, setPreview] = useState<ImportPreview | null>(null);

  const previewMutation = usePreviewImportStudents();
  const importMutation = useImportStudents();

  function reset() {
    setFileName("");
    setCsv("");
    setPreview(null);
    previewMutation.reset();
    importMutation.reset();
    if (inputRef.current) inputRef.current.value = "";
  }

  async function handleFile(file: File) {
    const text = await file.text();
    setFileName(file.name);
    setCsv(text);
    const result = await previewMutation.mutateAsync(text);
    setPreview(result);
  }

  async function handleImport() {
    const result = await importMutation.mutateAsync(csv);
    if (result.errors.length === 0) {
      onOpenChange(false);
      reset();
    }
  }

  const summary = preview?.summary;

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) reset();
        onOpenChange(next);
      }}
    >
      <DialogContent className="grid-rows-[auto_minmax(0,1fr)_auto] sm:max-w-[860px]">
        <DialogHeader>
          <DialogTitle className="font-heading text-lg">Import Siswa (CSV)</DialogTitle>
          <DialogDescription>
            Unggah file CSV berisi data siswa. Setiap siswa otomatis dibuatkan akun dan
            didaftarkan ke path-nya.
          </DialogDescription>
        </DialogHeader>

        <div className="flex min-h-0 flex-col gap-4 overflow-y-auto pr-1">
          {!preview ? (
            <div className="flex flex-col gap-3">
              <input
                ref={inputRef}
                type="file"
                accept=".csv,text/csv"
                className="hidden"
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  if (file) void handleFile(file);
                }}
              />
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                disabled={previewMutation.isPending}
                className={cn(
                  "flex flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-border py-12 transition-colors",
                  "hover:border-primary/50 hover:bg-muted/40",
                  previewMutation.isPending && "opacity-60",
                )}
              >
                {previewMutation.isPending ? (
                  <Loader2 className="size-6 animate-spin text-muted-foreground" />
                ) : (
                  <FileSpreadsheet className="size-6 text-muted-foreground" />
                )}
                <span className="text-[13px] font-medium">
                  {previewMutation.isPending
                    ? "Membaca file..."
                    : "Klik untuk pilih file CSV"}
                </span>
                <span className="text-xs text-muted-foreground">
                  Kolom: {COLUMNS}
                </span>
              </button>

              {previewMutation.isError ? (
                <p className="rounded-xl border border-destructive/40 bg-destructive/5 px-3.5 py-2.5 text-[13px] text-destructive">
                  {(previewMutation.error as Error).message}
                </p>
              ) : null}
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between gap-3 rounded-xl border border-border bg-muted/40 px-3.5 py-2.5">
                <span className="flex items-center gap-2 text-[13px] font-medium">
                  <FileSpreadsheet className="size-4 text-muted-foreground" />
                  {fileName}
                </span>
                <Button variant="ghost" size="sm" onClick={reset}>
                  <X className="size-4" />
                  Ganti file
                </Button>
              </div>

              {summary ? (
                <div className="grid grid-cols-4 gap-2.5">
                  {[
                    { label: "Total baris", value: summary.total },
                    { label: "Siap import", value: summary.ok + summary.warning },
                    { label: "Perlu review", value: summary.warning },
                    { label: "Error (dilewati)", value: summary.error },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="rounded-xl border border-border bg-card px-3.5 py-2.5"
                    >
                      <p className="text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">
                        {item.label}
                      </p>
                      <p className="font-heading text-xl font-bold">{item.value}</p>
                    </div>
                  ))}
                </div>
              ) : null}

              {summary?.paths?.length ? (
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-semibold text-muted-foreground">
                    Per path:
                  </span>
                  {summary.paths.map((item) => (
                    <span
                      key={item.slug}
                      className="rounded-full bg-muted px-2.5 py-1 text-xs font-semibold text-muted-foreground"
                    >
                      {item.name} · {item.count}
                    </span>
                  ))}
                </div>
              ) : null}

              <div className="rounded-xl border border-border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      {["#", "NAMA", "NIM", "PATH", "STATUS"].map((head) => (
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
                    {preview.rows.map((row) => (
                      <TableRow key={`${row.line}-${row.nim}`}>
                        <TableCell className="text-xs text-muted-foreground">
                          {row.line}
                        </TableCell>
                        <TableCell className="text-[13px] font-medium">
                          {row.nama}
                        </TableCell>
                        <TableCell className="text-[13px] text-muted-foreground">
                          {row.nim}
                        </TableCell>
                        <TableCell className="text-[13px] text-muted-foreground">
                          {row.pathName || "-"}
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col gap-1">
                            <StatusChip row={row} />
                            {row.message ? (
                              <span className="text-[11px] text-muted-foreground">
                                {row.message}
                              </span>
                            ) : null}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {importMutation.isError ? (
                <p className="rounded-xl border border-destructive/40 bg-destructive/5 px-3.5 py-2.5 text-[13px] text-destructive">
                  {(importMutation.error as Error).message}
                </p>
              ) : null}
            </>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Batal
          </Button>
          <Button
            disabled={!preview || importMutation.isPending || summary?.total === 0}
            onClick={() => void handleImport()}
          >
            {importMutation.isPending ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Upload className="size-4" />
            )}
            Import {summary ? `${summary.ok + summary.warning} Siswa` : "Siswa"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
