import Image from "next/image";
import { Briefcase, FolderGit2, Users, type LucideIcon } from "lucide-react";

import { SplitHeading } from "@/components/landing/split-heading";
import { aboutContent } from "@/lib/landing-content";

const PILLAR_ICONS: LucideIcon[] = [FolderGit2, Users, Briefcase];

export function AboutSection() {
  return (
    <section id="about" className="scroll-mt-24 bg-black">
      <div className="mx-auto grid w-full max-w-[1290px] items-center gap-12 px-6 py-20 sm:px-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-16 lg:py-28">
        <div data-reveal className="flex flex-col gap-6">
          <h2 className="text-balance text-3xl font-bold text-[#F77229] sm:text-4xl lg:text-[44px] lg:leading-[1.1]">
            <SplitHeading text={aboutContent.title} />
          </h2>

          <p className="font-heading text-2xl leading-tight font-bold text-white sm:text-3xl">
            {aboutContent.definition}
          </p>

          {aboutContent.description.map((paragraph) => (
            <p key={paragraph} className="text-lg/8 text-white/75">
              {paragraph}
            </p>
          ))}

          <ul className="mt-2 grid gap-5 sm:grid-cols-3">
            {aboutContent.pillars.map((pillar, index) => {
              const Icon = PILLAR_ICONS[index] ?? FolderGit2;

              return (
                <li
                  key={pillar.title}
                  className="flex flex-col gap-2 border-t border-white/10 pt-4"
                >
                  {/* <Icon className="size-5 text-[#F77229]" /> */}
                  <h3 className="font-heading text-base font-bold text-[#F77229]">
                    {pillar.title}
                  </h3>
                  <p className="text-sm/6 text-white/70">
                    {pillar.description}
                  </p>
                </li>
              );
            })}
          </ul>
        </div>

        <div
          data-reveal
          className="relative mx-auto aspect-[2/3] w-full max-w-[340px] overflow-hidden rounded-3xl border border-white/10 bg-white/5 sm:max-w-[380px] lg:ml-auto lg:mr-0"
        >
          <Image
            src={aboutContent.image}
            alt="Foto panitia Provoks"
            fill
            sizes="(max-width: 640px) 90vw, (max-width: 1024px) 380px, 380px"
            className="object-contain object-center"
          />
        </div>
      </div>
    </section>
  );
}
