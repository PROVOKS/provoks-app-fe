import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { closingCtaContent } from "@/lib/landing-content";

export function ClosingCtaSection() {
  return (
    <section id="join" className="scroll-mt-24 bg-black">
      <div className="mx-auto w-full max-w-[1290px] px-6 pb-20 sm:px-10 lg:pb-28">
        <div
          data-reveal
          className="relative overflow-hidden rounded-3xl px-6 py-16 text-center sm:px-10 lg:py-20"
        >
          <Image
            data-parallax
            src="/images/kelas-mobile.jpeg"
            alt="Kelas mobile Provoks"
            fill
            sizes="(max-width: 1290px) 100vw, 1290px"
            className="object-cover"
          />
          <div
            aria-hidden
            className="absolute inset-0 bg-black/65 backdrop-blur-sm"
          />
          <div
            aria-hidden
            className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30"
          />

          <div className="relative mx-auto flex max-w-2xl flex-col items-center gap-6 text-white">
            <h2 className="text-balance font-heading text-3xl font-bold sm:text-4xl lg:text-5xl">
              {closingCtaContent.title}
            </h2>
            <p className="text-base/7 font-medium text-white/85 sm:text-lg/8">
              {closingCtaContent.description}
            </p>

            <div className="flex w-full flex-col items-center gap-3 sm:w-auto sm:flex-row">
              <Button
                asChild
                className="h-12 w-full gap-2 rounded-full bg-black px-7 text-sm font-semibold text-white transition-colors hover:bg-[#F77229] hover:text-black sm:w-auto"
              >
                <Link href={closingCtaContent.primaryCta.href}>
                  {closingCtaContent.primaryCta.label}
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button
                asChild
                className="h-12 w-full rounded-full border-white/40 bg-white/5 px-7 text-sm font-semibold text-white transition-colors hover:border-[#F77229] hover:bg-[#F77229] hover:text-black sm:w-auto"
              >
                <a href={closingCtaContent.secondaryCta.href}>
                  {closingCtaContent.secondaryCta.label}
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
