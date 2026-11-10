import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Cpu,
  Gamepad2,
  Globe,
  PenTool,
  Smartphone,
  type LucideIcon,
} from "lucide-react";

import { SplitHeading } from "@/components/landing/split-heading";
import { Button } from "@/components/ui/button";
import { pathsContent, type LandingPathKey } from "@/lib/landing-content";

const PATH_ICONS: Record<LandingPathKey, LucideIcon> = {
  web: Globe,
  mobile: Smartphone,
  iot: Cpu,
  uiux: PenTool,
  game: Gamepad2,
};

export function PathsSection() {
  return (
    <section id="path" className="scroll-mt-24 bg-black">
      <div className="mx-auto w-full max-w-[1290px] px-6 py-20 sm:px-10 lg:py-28">
        <div className="mx-auto flex max-w-xl flex-col items-center gap-3 text-center">
          <h2 className="text-balance text-3xl font-bold text-[#F77229] sm:text-4xl">
            <SplitHeading text="Path PROVOKS" />
          </h2>
          <p className="text-sm/7 text-white/70 sm:text-base/8">
            Lima jalur belajar, satu tujuan: siap berkarya di industri
            teknologi.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-5 lg:gap-10">
          {pathsContent.map((path) => {
            const Icon = PATH_ICONS[path.key];

            return (
              <div
                key={path.key}
                className="flex flex-col items-center gap-3 text-center"
              >
                <div className="group relative flex aspect-square w-full items-center justify-center text-[#F77229]">
                  {path.image ? (
                    <Image
                      src={path.image}
                      alt={path.name}
                      fill
                      sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 200px"
                      className="scale-110 object-contain transition-transform duration-300 group-hover:scale-125 motion-reduce:transition-none motion-reduce:group-hover:scale-110"
                    />
                  ) : (
                    <Icon className="size-12 transition-transform duration-300 group-hover:scale-110 motion-reduce:transition-none motion-reduce:group-hover:scale-100 lg:size-14" />
                  )}
                </div>
                <div>
                  <h3 className="font-heading text-sm font-bold text-white sm:text-base">
                    {path.name}
                  </h3>
                  <p className="mt-1 text-xs text-white/60">{path.tagline}</p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-16 flex justify-center">
          <Button
            asChild
            className="h-11 gap-2 rounded-full bg-[#F77229] px-6 text-sm font-semibold text-white hover:bg-[#F77229]/90"
          >
            <Link href="/login">
              Mulai Belajar
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
