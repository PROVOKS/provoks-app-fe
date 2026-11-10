import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { closingCtaContent } from "@/lib/landing-content";

export function ClosingCtaSection() {
  return (
    <section id="join" className="scroll-mt-24 bg-black">
      <div className="mx-auto w-full max-w-[1290px] px-6 pb-20 sm:px-10 lg:pb-28">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#F77229] to-[#C23C11] px-6 py-16 text-center sm:px-10 lg:py-20">
          <div
            aria-hidden
            className="absolute -top-24 -right-16 size-72 rounded-full bg-white/15 blur-3xl"
          />
          <div
            aria-hidden
            className="absolute -bottom-28 -left-20 size-80 rounded-full bg-black/20 blur-3xl"
          />

          <div className="relative mx-auto flex max-w-2xl flex-col items-center gap-6 text-black">
            <h2 className="text-balance font-heading text-3xl font-bold sm:text-4xl lg:text-5xl">
              {closingCtaContent.title}
            </h2>
            <p className="text-base/7 font-medium text-black/80 sm:text-lg/8">
              {closingCtaContent.description}
            </p>

            <div className="flex w-full flex-col items-center gap-3 sm:w-auto sm:flex-row">
              <Button
                asChild
                className="h-12 w-full gap-2 rounded-full bg-black px-7 text-sm font-semibold text-white hover:bg-black/85 sm:w-auto"
              >
                <Link href={closingCtaContent.primaryCta.href}>
                  {closingCtaContent.primaryCta.label}
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="h-12 w-full rounded-full border-black/30 bg-transparent px-7 text-sm font-semibold text-black hover:bg-black/5 hover:text-black sm:w-auto"
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
