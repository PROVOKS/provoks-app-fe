"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Copy } from "lucide-react";

import { highlightCode, languageLabel } from "@/lib/highlight";
import { cn } from "@/lib/utils";

/**
 * Code block bergaya VS Code Dark+ — selalu gelap agar konsisten
 * dengan editor yang dipakai siswa. Dilengkapi tombol salin kode.
 */
export function CodeBlock({
  code,
  language,
  className,
}: {
  code: string;
  language?: string;
  className?: string;
}) {
  const html = highlightCode(code, language);
  const [copied, setCopied] = useState(false);
  const timer = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timer.current) window.clearTimeout(timer.current);
    };
  }, []);

  async function handleCopy() {
    try {
      let ok = false;

      if (navigator.clipboard?.writeText) {
        try {
          await navigator.clipboard.writeText(code);
          ok = true;
        } catch {
          // Clipboard API bisa ditolak (halaman tidak fokus / bukan HTTPS).
          // Lanjut ke fallback di bawah.
        }
      }

      if (!ok) {
        // fallback: textarea sementara + execCommand
        const textarea = document.createElement("textarea");
        textarea.value = code;
        textarea.setAttribute("readonly", "");
        textarea.style.position = "fixed";
        textarea.style.top = "-1000px";
        textarea.style.opacity = "0";
        document.body.appendChild(textarea);
        textarea.select();
        ok = document.execCommand("copy");
        document.body.removeChild(textarea);
      }

      if (!ok) return;

      setCopied(true);
      if (timer.current) window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // diamkan saja: clipboard bisa diblokir browser tanpa HTTPS
    }
  }

  return (
    <div
      className={cn(
        "code-block overflow-hidden rounded-xl border",
        className,
      )}
    >
      <div className="code-head flex items-center justify-between gap-3 border-b px-4 py-2">
        <div className="flex items-center gap-1.5">
          <span className="size-2.5 rounded-full bg-[#ff5f57]" />
          <span className="size-2.5 rounded-full bg-[#febc2e]" />
          <span className="size-2.5 rounded-full bg-[#28c840]" />
        </div>

        <div className="flex items-center gap-2.5">
          <span className="hidden text-[11px] italic text-[#858585] sm:inline">
            Cobain sendiri, yuk!
          </span>
          <span className="font-mono text-[11px] text-[#9cdcfe]">
            {languageLabel(language ?? "")}
          </span>
          <button
            type="button"
            onClick={handleCopy}
            aria-label={copied ? "Kode tersalin" : "Salin kode"}
            className="inline-flex items-center gap-1.5 rounded-md border border-white/10 bg-white/5 px-2 py-1 text-[11px] font-medium text-[#d4d4d4] outline-none transition-colors hover:bg-white/10 hover:text-white focus-visible:ring-2 focus-visible:ring-[#007acc] data-[copied=true]:text-[#28c840]"
            data-copied={copied}
          >
            {copied ? (
              <Check className="size-3.5" />
            ) : (
              <Copy className="size-3.5" />
            )}
            {copied ? "Tersalin" : "Salin"}
          </button>
        </div>
      </div>

      <pre className="overflow-x-auto p-4 font-mono text-[13px] leading-5">
        <code className="hljs" dangerouslySetInnerHTML={{ __html: html }} />
      </pre>
    </div>
  );
}
