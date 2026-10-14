import {
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  Info,
  XCircle,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { CodeBlock } from "@/components/shared/code-block";
import { PdfViewer, SlidesViewer } from "@/components/shared/file-viewer";
import type { ContentBlock } from "@/types";

function str(content: Record<string, unknown>, key: string) {
  return String(content[key] ?? "");
}

/** Ubah URL YouTube/Vimeo biasa menjadi URL embed. */
export function toEmbedUrl(url: string) {
  if (!url) return null;
  try {
    const parsed = new URL(url);
    const host = parsed.hostname.replace("www.", "");

    if (host === "youtu.be") {
      return `https://www.youtube.com/embed${parsed.pathname}`;
    }
    if (host.endsWith("youtube.com")) {
      const id = parsed.searchParams.get("v");
      if (id) return `https://www.youtube.com/embed/${id}`;
      if (parsed.pathname.startsWith("/embed/")) return url;
    }
    if (host.endsWith("vimeo.com")) {
      const id = parsed.pathname.split("/").filter(Boolean)[0];
      if (id) return `https://player.vimeo.com/video/${id}`;
    }
  } catch {
    return null;
  }
  return null;
}

const CALLOUT_STYLE: Record<string, { className: string; Icon: typeof Info }> = {
  info: { className: "bg-info/10 text-info", Icon: Info },
  success: { className: "bg-success/10 text-success", Icon: CheckCircle2 },
  warning: { className: "bg-warning/10 text-warning", Icon: AlertTriangle },
  danger: { className: "bg-destructive/10 text-destructive", Icon: XCircle },
};

export function BlockRenderer({ block }: { block: ContentBlock }) {
  const content = block.content ?? {};

  switch (block.type) {
    case "HEADING": {
      const level = Number(content.level ?? 2);
      const text = str(content, "text");
      const Tag = (level === 1 ? "h1" : level === 3 ? "h3" : "h2") as
        | "h1"
        | "h2"
        | "h3";
      return (
        <Tag
          className={cn(
            "font-heading font-bold",
            level === 1 ? "text-2xl" : level === 3 ? "text-base" : "text-xl",
          )}
        >
          {text || "Judul bagian"}
        </Tag>
      );
    }

    case "PARAGRAPH": {
      const html = str(content, "html");
      const text = str(content, "text");
      if (html) {
        return (
          <div
            className="rich-text"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        );
      }
      return (
        <p className="text-sm/6 whitespace-pre-line text-muted-foreground">
          {text}
        </p>
      );
    }

    case "IMAGE": {
      const url = str(content, "url");
      const alt = str(content, "alt");
      const caption = str(content, "caption");
      return (
        <figure className="flex flex-col gap-2">
          {url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={url}
              alt={alt}
              className="w-full rounded-2xl border border-border object-cover"
            />
          ) : (
            <div className="grid h-56 place-items-center rounded-2xl border border-border bg-muted text-sm text-muted-foreground">
              Gambar belum diisi
            </div>
          )}
          {caption ? (
            <figcaption className="text-center text-xs text-muted-foreground">
              {caption}
            </figcaption>
          ) : null}
        </figure>
      );
    }

    case "DIVIDER":
      return (
        <hr
          className={cn(
            "border-border",
            str(content, "style") === "dashed" && "border-dashed",
          )}
        />
      );

    case "VIDEO": {
      const url = str(content, "url");
      const title = str(content, "title");
      const embed = toEmbedUrl(url);
      const isFile =
        /\.(mp4|webm|ogg|mov|m4v)(\?|$)/i.test(url) ||
        url.includes("/video/upload/");

      return (
        <div className="flex flex-col gap-2">
          {embed ? (
            <div className="aspect-video w-full overflow-hidden rounded-2xl border border-border">
              <iframe
                src={embed}
                title={title || "Video materi"}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="size-full"
              />
            </div>
          ) : isFile ? (
            <video
              src={url}
              controls
              className="w-full rounded-2xl border border-border bg-black"
            />
          ) : (
            <div className="grid aspect-video place-items-center rounded-2xl border border-border bg-muted text-sm text-muted-foreground">
              {url ? "URL video tidak dikenali" : "Video belum diisi"}
            </div>
          )}
          {title ? (
            <p className="text-[13px] font-semibold">{title}</p>
          ) : null}
        </div>
      );
    }

    case "CODE":
      return (
        <CodeBlock
          code={str(content, "code")}
          language={str(content, "language")}
        />
      );

    case "CALLOUT": {
      const variant = str(content, "variant") || "info";
      const style = CALLOUT_STYLE[variant] ?? CALLOUT_STYLE.info;
      return (
        <div
          className={cn(
            "flex items-start gap-3 rounded-xl p-4 text-sm",
            style.className,
          )}
        >
          <style.Icon className="mt-0.5 size-4 shrink-0" />
          <p className="text-foreground">{str(content, "text")}</p>
        </div>
      );
    }

    case "QUIZ": {
      const questions = block.questions ?? [];
      return (
        <div className="flex flex-col gap-3 rounded-2xl border border-border bg-muted/40 p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="grid size-9 place-items-center rounded-[10px] bg-card">
                <HelpCircle className="size-4 text-primary" />
              </span>
              <div className="flex flex-col">
                <span className="text-[13px] font-semibold">
                  {str(content, "title") || "Kuis"}
                </span>
                <span className="text-xs text-muted-foreground">
                  {questions.length} soal
                </span>
              </div>
            </div>
            <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              Preview soal
            </span>
          </div>

          {questions.length > 0 ? (
            <div className="flex flex-col gap-3">
              {questions.map((question, index) => (
                <div
                  key={question.id}
                  className="flex flex-col gap-1.5 rounded-xl bg-card p-3.5"
                >
                  <p className="text-[13px] font-medium">
                    {index + 1}. {question.question}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Jawaban benar:{" "}
                    <span className="font-semibold text-success">
                      {question.options[question.answerIndex]}
                    </span>
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-muted-foreground">Belum ada soal.</p>
          )}
        </div>
      );
    }

    case "PDF":
      return (
        <PdfViewer url={str(content, "url")} title={str(content, "title")} />
      );

    case "SLIDES":
      return (
        <SlidesViewer url={str(content, "url")} title={str(content, "title")} />
      );

    default:
      return null;
  }
}
