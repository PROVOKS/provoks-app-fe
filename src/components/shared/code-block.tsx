import { highlightCode, languageLabel } from "@/lib/highlight";
import { cn } from "@/lib/utils";

/**
 * Code block bergaya VS Code Dark+ — selalu gelap agar konsisten
 * dengan editor yang dipakai siswa.
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

  return (
    <div
      className={cn(
        "code-block overflow-hidden rounded-xl border",
        className,
      )}
    >
      <div className="code-head flex items-center justify-between border-b px-4 py-2">
        <div className="flex items-center gap-1.5">
          <span className="size-2.5 rounded-full bg-[#ff5f57]" />
          <span className="size-2.5 rounded-full bg-[#febc2e]" />
          <span className="size-2.5 rounded-full bg-[#28c840]" />
        </div>
        <span className="font-mono text-[11px] text-[#9cdcfe]">
          {languageLabel(language ?? "")}
        </span>
      </div>

      <pre className="overflow-x-auto p-4 font-mono text-[13px] leading-5">
        <code className="hljs" dangerouslySetInnerHTML={{ __html: html }} />
      </pre>
    </div>
  );
}
