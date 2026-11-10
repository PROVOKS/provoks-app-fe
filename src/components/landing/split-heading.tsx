import { cn } from "@/lib/utils";

/**
 * Menampilkan huruf pertama dengan font Rafaella dan sisanya dengan Nexa.
 */
export function SplitHeading({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  const first = text.slice(0, 1);
  const rest = text.slice(1);

  return (
    <span className={cn(className)}>
      <span className="font-rafaella font-normal">{first}</span>
      <span className="font-nexa font-semibold">{rest}</span>
    </span>
  );
}
