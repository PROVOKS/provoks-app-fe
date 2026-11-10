import Image from "next/image";

import { aboutContent } from "@/lib/landing-content";
import { SplitHeading } from "@/components/landing/split-heading";

export function AboutSection() {
  return (
    <section id="about" className="scroll-mt-24 bg-black">
      <div className="mx-auto grid w-full max-w-[1290px] items-start gap-12 px-6 py-20 sm:px-10 lg:max-w-none lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:gap-16 lg:py-28 lg:pr-4 lg:pl-[max(2.5rem,calc((100vw_-_1290px)/2_+_2.5rem))]">
        <div className="flex flex-col gap-6 lg:-ml-6 lg:max-w-[560px]">
          <h2 className="text-3xl font-bold text-[#F77229] sm:text-4xl lg:text-[44px] lg:leading-[1.1]">
            <SplitHeading text={aboutContent.title} />
          </h2>

          <div className="flex flex-col gap-4">
            {aboutContent.description.map((paragraph) => (
              <p
                key={paragraph}
                className="text-lg/8 text-white sm:text-xl/8"
              >
                {paragraph}
              </p>
            ))}
          </div>
        </div>

        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-white/10 bg-white/5 lg:-mt-20">
          <Image
            src={aboutContent.image}
            alt="Foto pengurus Provoks"
            fill
            unoptimized
            sizes="(max-width: 1024px) 100vw, 55vw"
            className="object-cover"
          />
        </div>
      </div>
    </section>
  );
}
