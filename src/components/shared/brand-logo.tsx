import Image from "next/image";

import { cn } from "@/lib/utils";

/**
 * Logo Provoks (hexagon). Ukuran diatur lewat className (mis. "h-[34px]"),
 * rasio asli dijaga oleh atribut width/height.
 */
export function BrandLogo({ className }: { className?: string }) {
  return (
    <Image
      src="/images/logo-provoks.png"
      alt="Logo Provoks"
      width={500}
      height={500}
      sizes="96px"
      className={cn("w-auto shrink-0", className)}
    />
  );
}
