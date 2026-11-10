import Image from "next/image";
import Link from "next/link";

import { SplitHeading } from "@/components/landing/split-heading";
import { Button } from "@/components/ui/button";
import { heroContent } from "@/lib/landing-content";

export function HeroSection() {
  return (
    <section
      id="beranda"
      className="relative flex min-h-[100svh] w-full scroll-mt-24 items-center justify-center overflow-hidden bg-black"
    >
      <Image
        src={heroContent.image}
        alt="Foto pengurus Provoks"
        fill
        priority
        sizes="100vw"
        className="object-cover object-[center_35%]"
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-black/90"
      />
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black to-transparent"
      />

      <div className="relative z-10 mx-auto flex w-full max-w-[1290px] flex-col items-center gap-8 px-6 pt-28 pb-20 text-center text-white lg:px-10 lg:pt-32">
        <div className="flex flex-col items-center gap-4 motion-safe:animate-in motion-safe:fade-in-0 motion-safe:slide-in-from-bottom-4 motion-safe:duration-700">
          <h1 className="max-w-5xl text-balance font-heading text-5xl leading-[1.02] font-bold text-white sm:text-6xl lg:text-7xl">
            <SplitHeading text={heroContent.title} />
          </h1>
          <p className="rounded-full border border-white/15 bg-white/5 px-4 py-1.5 font-heading text-[11px] font-semibold tracking-[2px] text-white/90 uppercase backdrop-blur-sm sm:text-xs">
            {heroContent.tagline}
          </p>
          <p className="max-w-2xl font-semibold text-white/85 sm:text-lg/8">
            {heroContent.subtitle}
          </p>
        </div>

        <div className="flex w-full flex-col items-center justify-center gap-3 motion-safe:animate-in motion-safe:fade-in-0 motion-safe:slide-in-from-bottom-4 motion-safe:duration-700 sm:w-auto sm:flex-row">
          <Button
            asChild
            className="h-12 w-full gap-2 rounded-lg bg-[#F77229] px-7 text-sm font-semibold text-white hover:bg-[#F77229]/90 sm:w-auto"
          >
            <Link href={heroContent.primaryCta.href}>
              {heroContent.primaryCta.label}
            </Link>
          </Button>
        </div>

        <ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-white/60">
          {heroContent.proofs.map((proof) => (
            <li key={proof} className="flex items-center gap-2">
              <span className="size-1.5 rounded-full bg-[#F77229]" />
              {proof}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
