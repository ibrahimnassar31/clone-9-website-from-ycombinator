"use client";

import * as React from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";

interface Project {
  readonly title: string;
  readonly years: string;
  readonly imageSrc: string;
}

const projects: readonly Project[] = [
  { title: "Queen of the South", years: "2016 - 2018", imageSrc: "https://sss.matchboxstudio.com/wp-content/uploads/2024/10/Queen-of-the-South-1000x667.webp" },
  { title: "Cruel Summer", years: "2021", imageSrc: "https://images.unsplash.com/photo-1522712004038-9005ebdcddfb?q=80&w=1332&auto=format&fit=crop" },
  { title: "The Chosen S02", years: "2017", imageSrc: "https://images.unsplash.com/photo-1709832279012-293766967250?q=80&w=1200&auto=format&fit=crop" },
  { title: "The Gifted S02", years: "2017", imageSrc: "https://sss.matchboxstudio.com/wp-content/uploads/2024/10/The-Gifted-S01-1000x667.webp" },
];

export default function ProjectsInsaneScroller() {
  const sectionRef = React.useRef<HTMLElement>(null);
  const stackRef = React.useRef<HTMLDivElement>(null);
  const progressRef = React.useRef<HTMLDivElement>(null);
  const shotRef = React.useRef<HTMLDivElement>(null);
  const hereRef = React.useRef<HTMLDivElement>(null);

  const [api, setApi] = React.useState<CarouselApi>();
  const [isDesktop, setIsDesktop] = React.useState(true);

  React.useEffect(() => {
    const mm = window.matchMedia("(min-width: 1024px)");
    const apply = () => setIsDesktop(mm.matches);
    apply();
    mm.addEventListener("change", apply);
    return () => mm.removeEventListener("change", apply);
  }, []);

  React.useLayoutEffect(() => {
    if (!isDesktop || !sectionRef.current || !stackRef.current) return;

    const ctx = gsap.context(() => {
      const frames = gsap.utils.toArray<HTMLDivElement>(".frame");
      const metas = gsap.utils.toArray<HTMLDivElement>(".meta");
      const tl = gsap.timeline({
        defaults: { ease: "power3.out" },
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: () => `+=${window.innerHeight * (frames.length + 0.5)}`,
          pin: true,
          scrub: 0.6,
          anticipatePin: 1,
        },
      });

      tl.fromTo(
        shotRef.current,
        { xPercent: -12, opacity: 0, filter: "blur(6px)" },
        { xPercent: 0, opacity: 1, filter: "blur(0px)", duration: 0.8 },
        0
      ).fromTo(
        hereRef.current,
        { xPercent: 12, opacity: 0, filter: "blur(6px)" },
        { xPercent: 0, opacity: 1, filter: "blur(0px)", duration: 0.8 },
        0
      );

      frames.forEach((el, i) => {
        gsap.set(el, {
          zIndex: frames.length - i,
          scale: 1.18,
          opacity: i === 0 ? 1 : 0,
          clipPath: "inset(22% round 28px)", 
          filter: "saturate(0.9) contrast(1.05)",
        });
        gsap.set(metas[i], { opacity: i === 0 ? 1 : 0, y: i === 0 ? 0 : 16 });
      });

      frames.forEach((el, i) => {
        const meta = metas[i];
        const next = frames[i + 1];

        tl.to(
          el,
          {
            clipPath: "inset(0% round 0px)",
            scale: 1,
            opacity: 1,
            duration: 0.9,
          },
          `>+${i === 0 ? 0.1 : 0.2}`
        );

        tl.to(
          meta,
          { opacity: 1, y: 0, duration: 0.4 },
          "<+=0.1"
        );

        if (next) {
          const nextMeta = metas[i + 1];
          tl.to(
            el,
            { opacity: 0.0, duration: 0.6 },
            ">+0.25"
          )
            .fromTo(
              next,
              { opacity: 0.2, scale: 1.12, clipPath: "inset(18% round 20px)" },
              { opacity: 1, duration: 0.6 },
              "<"
            )
            .to(nextMeta, { opacity: 1, y: 0, duration: 0.35 }, "<+=0.05")
            .to(meta, { opacity: 0, y: -12, duration: 0.35 }, "<");
        }
      });

      if (progressRef.current) {
        gsap.set(progressRef.current, { scaleX: 0, transformOrigin: "0% 50%" });
        ScrollTrigger.create({
          trigger: sectionRef.current,
          start: "top top",
          end: () => `+=${window.innerHeight * (frames.length + 0.5)}`,
          onUpdate: (st) => {
            gsap.to(progressRef.current!, { scaleX: st.progress, duration: 0.2, ease: "power1.out" });
          },
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [isDesktop]);

  return (
    <section
      ref={sectionRef}
      className="bg-[#f5f1eb] text-black py-16 md:py-24 lg:py-0 overflow-hidden"
    >
      {isDesktop ? (
        <div className="relative h-screen w-full flex items-center justify-center">
          <div
            ref={shotRef}
            className="font-display text-[10vw] xl:text-[160px] leading-[0.8] tracking-wider absolute left-4 top-6 opacity-0 select-none"
          >
            SHOT
          </div>

          <div
            ref={hereRef}
            className="font-display text-[10vw] xl:text-[160px] leading-[0.8] tracking-wider absolute right-4 bottom-6 opacity-0 select-none"
          >
            HERE
          </div>

          <div ref={stackRef} className="relative w-[62vw] max-w-[980px] aspect-[3/2]">
            {projects.map((p, i) => (
              <div key={i} className="frame absolute inset-0 rounded-[24px] overflow-hidden shadow-[0_8px_40px_rgba(0,0,0,0.25)] will-change-transform">
                <Image
                  src={p.imageSrc}
                  alt={p.title}
                  fill
                  sizes="(min-width: 1024px) 62vw, 100vw"
                  className="object-cover"
                  unoptimized
                  priority={i === 0}
                />
                <div className="pointer-events-none absolute inset-0 mix-blend-multiply opacity-40 bg-[radial-gradient(120%_100%_at_50%_0%,rgba(0,0,0,0)_0%,rgba(0,0,0,0.35)_60%,rgba(0,0,0,0.6)_100%)]" />
                <div className="pointer-events-none absolute inset-0 opacity-10"
                     style={{ background:
                       "radial-gradient(120% 90% at 50% 50%, rgba(255,40,100,.25), transparent 60%), radial-gradient(100% 80% at 55% 45%, rgba(0,170,255,.18), transparent 60%)" }} />
              </div>
            ))}

            <div className="absolute -bottom-14 left-0 right-0 flex items-end justify-between">
              {projects.map((p, i) => (
                <div key={i} className="meta absolute left-0 right-0 flex items-end justify-between opacity-0">
                  <p className="font-navigation text-base tracking-wider">{p.title}</p>
                  <p className="font-navigation text-base">{p.years}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[62vw] max-w-[980px] h-1 bg-black/10 rounded">
            <div ref={progressRef} className="h-full w-full bg-black rounded origin-left" />
          </div>
        </div>
      ) : (
        <div className="py-10">
          <div className="font-display text-[22vw] leading-[0.8] font-normal tracking-wider text-center">
            SHOT HERE
          </div>
          <Carousel setApi={setApi} opts={{ loop: true }} className="w-full mt-8">
            <CarouselContent>
              {projects.map((p, i) => (
                <CarouselItem key={i}>
                  <div className="mx-auto w-[90%] max-w-md aspect-[3/2] overflow-hidden rounded-2xl shadow-lg">
                    <Image src={p.imageSrc} alt={p.title} fill className="object-cover" unoptimized priority={i === 0} />
                  </div>
                  <div className="mt-4 px-6 flex items-center justify-between">
                    <p className="font-navigation">{p.title}</p>
                    <p className="font-navigation">{p.years}</p>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>
      )}
    </section>
  );
}
