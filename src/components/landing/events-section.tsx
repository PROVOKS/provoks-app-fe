import Image from "next/image";

import { SplitHeading } from "@/components/landing/split-heading";
import { eventsContent } from "@/lib/landing-content";
import { cn } from "@/lib/utils";

function Polaroid({
  src,
  alt,
  rotate = 0,
  translateY = 0,
  portrait = true,
  className,
  imageClassName,
  sizes = "(max-width: 768px) 45vw, 220px",
}: {
  src: string;
  alt: string;
  rotate?: number;
  translateY?: number;
  portrait?: boolean;
  className?: string;
  imageClassName?: string;
  sizes?: string;
}) {
  return (
    <div
      className={cn(
        "shrink-0 bg-white p-2.5 pb-7 shadow-[0_20px_45px_-15px_rgba(0,0,0,0.75)] ring-1 ring-black/10",
        className,
      )}
      style={{ transform: `translateY(${translateY}px) rotate(${rotate}deg)` }}
    >
      <div
        className={cn(
          "relative w-full overflow-hidden bg-neutral-200",
          portrait ? "aspect-[3/4]" : "aspect-[4/3]",
        )}
      >
        <Image
          src={src}
          alt={alt}
          fill
          unoptimized
          sizes={sizes}
          className={cn("object-cover", imageClassName)}
        />
      </div>
    </div>
  );
}

function EventPhotos({ images, title }: { images: string[]; title: string }) {
  if (images.length === 1) {
    return (
      <div className="flex justify-start">
        <Polaroid
          src={images[0]}
          alt={title}
          portrait={false}
          rotate={-3}
          className="w-full max-w-[520px]"
          imageClassName="object-[center_68%]"
          sizes="(max-width: 768px) 95vw, 520px"
        />
      </div>
    );
  }

  if (images.length === 2) {
    return (
      <div className="flex items-end justify-start">
        <Polaroid
          src={images[0]}
          alt={`${title} 1`}
          rotate={-6}
          translateY={8}
          className="w-[54%] max-w-[260px]"
        />
        <Polaroid
          src={images[1]}
          alt={`${title} 2`}
          rotate={5}
          translateY={-12}
          className="-ml-6 w-[46%] max-w-[220px]"
        />
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center">
      <Polaroid
        src={images[0]}
        alt={`${title} 1`}
        rotate={-8}
        translateY={8}
        className="w-[34%] max-w-[190px]"
      />
      <Polaroid
        src={images[1]}
        alt={`${title} 2`}
        rotate={2}
        translateY={-16}
        className="z-10 -mx-5 w-[38%] max-w-[210px]"
      />
      <Polaroid
        src={images[2]}
        alt={`${title} 3`}
        rotate={8}
        translateY={10}
        className="w-[34%] max-w-[190px]"
      />
    </div>
  );
}

export function EventsSection() {
  return (
    <section id="event" className="scroll-mt-24 bg-black">
      <div className="mx-auto w-full max-w-[1290px] px-6 py-20 sm:px-10 lg:py-28">
        <div className="mx-auto flex max-w-2xl flex-col items-center gap-3 text-center">
          <h2 className="text-3xl font-bold text-[#F77229] sm:text-4xl">
            <SplitHeading text="EVENT" />
          </h2>
        </div>

        <div className="mt-20 flex flex-col gap-16 lg:mt-24 lg:gap-24">
          {eventsContent.map((event) => (
            <article
              key={event.title}
              className="grid items-center gap-10 md:grid-cols-2 md:gap-14"
            >
              <EventPhotos images={event.images} title={event.title} />

              <div className="flex flex-col gap-3">
                <h3 className="font-heading text-2xl font-bold text-white sm:text-3xl">
                  {event.title}
                </h3>
                <p className="max-w-[528px] text-base/7 text-white sm:text-lg/8">
                  {event.description}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
