"use client";

import { Download, ExternalLink, FileText, Paperclip, Presentation } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

function Header({
  icon: Icon,
  label,
  title,
  url,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  title?: string;
  url: string;
}) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-2.5">
      <div className="flex min-w-0 items-center gap-2.5">
        <span className="grid size-7 shrink-0 place-items-center rounded-lg bg-muted">
          <Icon className="size-3.5 text-muted-foreground" />
        </span>
        <div className="flex min-w-0 flex-col">
          <span className="truncate text-[13px] font-semibold">
            {title || label}
          </span>
          <span className="truncate text-[11px] text-muted-foreground">{label}</span>
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        <Button variant="outline" size="sm" asChild>
          <a href={url} target="_blank" rel="noreferrer">
            <ExternalLink className="size-3.5" />
            Buka
          </a>
        </Button>
        <Button variant="outline" size="sm" asChild>
          <a href={url} download>
            <Download className="size-3.5" />
            Unduh
          </a>
        </Button>
      </div>
    </div>
  );
}

function EmptyState({ label }: { label: string }) {
  return (
    <div className="grid h-64 place-items-center rounded-xl border border-border bg-muted text-sm text-muted-foreground">
      {label} belum diisi
    </div>
  );
}

function isPublicUrl(url: string) {
  try {
    const parsed = new URL(url);
    return !["localhost", "127.0.0.1", "0.0.0.0"].includes(parsed.hostname);
  } catch {
    return false;
  }
}

/** Kartu lampiran generik (unduh) */
export function FileCard({
  url,
  title,
  className,
}: {
  url: string;
  title?: string;
  className?: string;
}) {
  if (!url) return <EmptyState label="Lampiran" />;

  return (
    <a
      href={url}
      target="_blank"
      rel="noreferrer"
      className={cn(
        "flex items-center justify-between gap-3 rounded-xl border border-border bg-card p-4 transition-colors hover:border-primary/40",
        className,
      )}
    >
      <span className="flex min-w-0 items-center gap-3">
        <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-muted">
          <Paperclip className="size-4 text-muted-foreground" />
        </span>
        <span className="flex min-w-0 flex-col">
          <span className="truncate text-[13px] font-semibold">
            {title || "Lampiran"}
          </span>
          <span className="text-xs text-muted-foreground">
            Klik untuk membuka / mengunduh
          </span>
        </span>
      </span>
      <Download className="size-4 shrink-0 text-muted-foreground" />
    </a>
  );
}

/** PDF viewer (viewer bawaan browser) */
export function PdfViewer({
  url,
  title,
  className,
  height = 520,
}: {
  url: string;
  title?: string;
  className?: string;
  height?: number;
}) {
  if (!url) return <EmptyState label="PDF" />;

  return (
    <div className={cn("overflow-hidden rounded-xl border border-border", className)}>
      <Header icon={FileText} label="PDF" title={title} url={url} />
      <iframe
        src={url}
        title={title || "Dokumen PDF"}
        style={{ height }}
        className="w-full bg-muted"
      />
    </div>
  );
}

/** PowerPoint / slide viewer via Microsoft Office Online */
export function SlidesViewer({
  url,
  title,
  className,
  height = 520,
}: {
  url: string;
  title?: string;
  className?: string;
  height?: number;
}) {
  if (!url) return <EmptyState label="Presentasi" />;

  const publicUrl = isPublicUrl(url);
  const officeUrl = `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(
    url,
  )}`;

  return (
    <div className={cn("overflow-hidden rounded-xl border border-border", className)}>
      <Header icon={Presentation} label="PowerPoint" title={title} url={url} />

      {publicUrl ? (
        <iframe
          src={officeUrl}
          title={title || "Slide presentasi"}
          style={{ height }}
          className="w-full bg-muted"
          allowFullScreen
        />
      ) : (
        <div
          style={{ height }}
          className="flex flex-col items-center justify-center gap-2 bg-muted text-center"
        >
          <Presentation className="size-6 text-muted-foreground" />
          <p className="text-sm font-semibold">
            Preview slide butuh URL publik
          </p>
          <p className="max-w-[320px] text-xs text-muted-foreground">
            Office Online viewer tidak bisa membuka alamat lokal. Pakai URL yang
            bisa diakses internet, atau unduh filenya.
          </p>
          <Button variant="outline" size="sm" asChild>
            <a href={url} download>
              <Download className="size-3.5" />
              Unduh presentasi
            </a>
          </Button>
        </div>
      )}
    </div>
  );
}
