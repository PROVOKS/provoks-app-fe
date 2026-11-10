import Image from "next/image";

import { visionMissionContent } from "@/lib/landing-content";
import { SplitHeading } from "@/components/landing/split-heading";

export function VisionMissionSection() {
  return (
    <section id="visi-misi" className="scroll-mt-24 bg-black">
      <div className="mx-auto w-full max-w-[1290px] px-6 py-20 sm:px-10 lg:py-28">
        <div className="flex flex-col items-center gap-4 text-center">
          <h2 className="text-3xl font-bold text-[#F77229] sm:text-4xl">
            <SplitHeading text="Vision" />
          </h2>
          <p className="text-balance font-heading text-xl leading-relaxed font-semibold text-white sm:text-2xl">
            {visionMissionContent.vision}
          </p>
        </div>

        <div className="mt-20 flex flex-col items-center gap-10 lg:mt-24">
          <h2 className="text-3xl font-bold text-[#F77229] sm:text-4xl">
            <SplitHeading text="Missions" />
          </h2>

          <div className="grid w-full gap-6 transition-opacity duration-300 hover:[&>*:not(:hover)]:opacity-40 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
            {visionMissionContent.mission.map((item) => (
              <div
                key={item.title}
                className="group/card flex h-full flex-col items-center gap-4 rounded-2xl border border-white/15 bg-gradient-to-b from-white/[0.05] to-transparent p-6 text-center transition-all duration-300 ease-out hover:z-10 hover:scale-105 hover:border-[#F77229]/60 motion-reduce:transition-none motion-reduce:hover:scale-100 sm:p-8"
              >
                <Image
                  src={visionMissionContent.image}
                  alt={item.title}
                  width={500}
                  height={500}
                  unoptimized
                  className="size-32 object-contain transition-transform duration-300 group-hover/card:scale-110 motion-reduce:transition-none motion-reduce:group-hover/card:scale-100 sm:size-40"
                />
                <h3 className="text-balance font-heading text-2xl font-bold text-[#F77229] sm:text-3xl">
                  <SplitHeading text={item.title} />
                </h3>
                <p className="max-w-[380px] text-balance text-xl/8 font-normal tracking-tight text-white">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
