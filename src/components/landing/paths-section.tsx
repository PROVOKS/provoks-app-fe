import {
  Cpu,
  Gamepad2,
  Globe,
  PenTool,
  Smartphone,
  type LucideIcon,
} from "lucide-react";

import { pathsContent, type LandingPathKey } from "@/lib/landing-content";
import { SplitHeading } from "@/components/landing/split-heading";

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
          <h2 className="text-3xl font-bold text-[#F77229] sm:text-4xl">
            <SplitHeading text="Path PROVOKS" />
          </h2>
        </div>

        <div className="mt-12 grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-5 lg:gap-10">
          {pathsContent.map((path) => {
            const Icon = PATH_ICONS[path.key];

            return (
              <div
                key={path.key}
                className="flex flex-col items-center gap-3 text-center"
              >
                <div className="group flex aspect-square w-full items-center justify-center rounded-2xl bg-[#F77229]/15 text-[#F77229] transition-colors hover:bg-[#F77229] hover:text-white">
                  <Icon className="size-9 lg:size-10" />
                </div>
                <h3 className="font-heading text-sm font-bold text-white sm:text-base">
                  {path.name}
                </h3>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
