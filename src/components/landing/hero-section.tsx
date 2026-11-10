import Image from "next/image";

import { heroContent } from "@/lib/landing-content";

export function HeroSection() {
  return (
    <section
      id="beranda"
      className="relative flex min-h-[100svh] w-full scroll-mt-24 items-center justify-center overflow-hidden bg-black"
    >
      <Image
        src="/images/pengurus-provoks.jpeg"
        alt="Foto pengurus Provoks"
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/55 to-black/80"
      />

      <div className="relative z-10 mx-auto flex w-full max-w-[1290px] flex-col items-center gap-6 px-6 pt-24 pb-16 text-center text-white lg:px-10 lg:pt-28">
        <h1 className="max-w-5xl font-heading text-4xl leading-[1.05] font-bold text-[#F77229] sm:text-6xl lg:text-7xl">
          {heroContent.title}
        </h1>
        <p className="max-w-2xl text-lg/8 text-white sm:text-xl/8">
          {heroContent.subtitle}
        </p>
      </div>
    </section>
  );
}
