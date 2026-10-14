import Image from "next/image";

import { cn } from "@/lib/utils";

/**
 * Logo Provoks (hexagon). Ukuran diatur lewat className (mis. "h-[34px]"),
 * rasio asli dijaga oleh atribut width/height.
 */
export function BrandLogo({ className }: { className?: string }) {
  return (
    <Image
      src="/provoks_logo.png"
      alt="Logo Provoks"
      width={1486}
      height={1647}
      sizes="96px"
      className={cn("w-auto shrink-0", className)}
    />
  );
}
