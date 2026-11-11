"use client";

import { useEffect, useRef } from "react";

import { gsap, ScrollTrigger } from "@/lib/gsap";

export function LandingMotion({ children }: { children: React.ReactNode }) {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scope = root.current;
    if (!scope) return;

    let context: ReturnType<typeof gsap.context> | undefined;
    let cancelled = false;
    let timer: number | undefined;

    const start = () => {
      if (cancelled) return;

      context = gsap.context(() => {
        const media = gsap.matchMedia();

        media.add("(prefers-reduced-motion: no-preference)", () => {
          const heroItems = gsap.utils.toArray<HTMLElement>(
            "[data-hero-item]",
            scope,
          );

          if (heroItems.length) {
            gsap.from(heroItems, {
              opacity: 0,
              y: 28,
              duration: 0.8,
              stagger: 0.08,
              ease: "power3.out",
              delay: 0.1,
            });
          }

          gsap.utils
            .toArray<HTMLElement>("[data-reveal]", scope)
            .forEach((element) => {
              gsap.from(element, {
                opacity: 0,
                y: 32,
                duration: 0.7,
                ease: "power3.out",
                scrollTrigger: {
                  trigger: element,
                  start: "top 85%",
                  once: true,
                },
              });
            });

          gsap.utils
            .toArray<HTMLElement>("[data-reveal-stagger]", scope)
            .forEach((group) => {
              const items = gsap.utils.toArray<HTMLElement>(
                ":scope > *",
                group,
              );

              gsap.from(items, {
                opacity: 0,
                y: 28,
                duration: 0.6,
                stagger: 0.08,
                ease: "power3.out",
                scrollTrigger: {
                  trigger: group,
                  start: "top 85%",
                  once: true,
                },
              });
            });

          gsap.utils
            .toArray<HTMLElement>("[data-parallax]", scope)
            .forEach((element) => {
              gsap.fromTo(
                element,
                { yPercent: -5, scale: 1.12 },
                {
                  yPercent: 5,
                  scale: 1.12,
                  ease: "none",
                  scrollTrigger: {
                    trigger: element.parentElement ?? element,
                    start: "top bottom",
                    end: "bottom top",
                    scrub: true,
                  },
                },
              );
            });
        });

        return () => media.revert();
      }, scope);

      ScrollTrigger.refresh();

      if (document.fonts) {
        document.fonts.ready.then(() => ScrollTrigger.refresh()).catch(() => undefined);
      }
    };

    const sentinel = scope.lastElementChild ?? scope;
    const isHydrated = () =>
      Object.keys(sentinel).some((key) => key.startsWith("__reactFiber$"));

    const waitForHydration = (attempt = 0) => {
      if (cancelled) return;

      if (isHydrated() || attempt >= 100) {
        start();
        return;
      }

      timer = window.setTimeout(() => waitForHydration(attempt + 1), 50);
    };

    waitForHydration();

    return () => {
      cancelled = true;
      if (timer) window.clearTimeout(timer);
      context?.revert();
    };
  }, []);

  return (
    <div
      ref={root}
      className="landing-theme flex min-h-dvh flex-col bg-black text-white"
    >
      {children}
    </div>
  );
}
