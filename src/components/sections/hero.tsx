"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

const videoSources = [
  "https://sss.matchboxstudio.com/wp-content/uploads/2024/11/Home-hero_01.mp4",
  "https://sss.matchboxstudio.com/wp-content/uploads/2024/11/Home-hero_02.mp4",
];

export default function HeroSection() {
  const [idx, setIdx] = useState(0);

  const sectionRef = useRef<HTMLElement>(null);
  const videoRefs = useRef<HTMLVideoElement[]>([]);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const rightInfoRef = useRef<HTMLDivElement>(null);
  const linesWrapRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  const setVideoRef = (el: HTMLVideoElement | null, i: number) => {
    if (el) videoRefs.current[i] = el;
  };

  useEffect(() => {
    videoRefs.current.forEach((v, i) => {
      if (!v) return;
      if (i === idx) {
        v.currentTime = 0;
        v.play().catch(() => void 0);
      } else {
        v.pause();
      }
    });
  }, [idx]);

  useLayoutEffect(() => {
    const mm = window.matchMedia("(prefers-reduced-motion: reduce)");
    const reduced = mm.matches;

    const ctx = gsap.context(() => {
      gsap.set(titleRef.current, { yPercent: 120, opacity: 0, skewY: 6 });
      gsap.set(rightInfoRef.current, { y: 24, opacity: 0 });
      gsap.set(overlayRef.current, { opacity: 0 });
      const lines = linesWrapRef.current?.querySelectorAll("hr") || [];
      gsap.set(lines, { scaleX: 0, transformOrigin: "0% 50%" });

      videoRefs.current.forEach((v, i) => {
        gsap.set(v, { opacity: i === 0 ? 0.4 : 0, filter: "brightness(0.7)" });
      });

      const intro = gsap.timeline({ defaults: { ease: "power3.out" } });
      intro
        .to(overlayRef.current, { opacity: 1, duration: 0.5 }) // dark tint fade
        .to(titleRef.current, { yPercent: 0, opacity: 1, skewY: 0, duration: 0.9 }, "-=0.1")
        .to(rightInfoRef.current, { y: 0, opacity: 1, duration: 0.6 }, "-=0.55")
        .to(lines, { scaleX: 1, duration: 0.7, stagger: 0.08, ease: "power2.out" }, "-=0.3");

      if (reduced) return;

      const loop = gsap.timeline({ repeat: -1, repeatDelay: 0 });
      videoSources.forEach((_, i) => {
        loop
          .call(() => setIdx(i))
          .to(
            videoRefs.current.map((v, vi) => v),
            {
              opacity: (vi) => (vi === i ? 0.4 : 0),
              duration: 1.0,
              ease: "power2.out",
            },
            0
          )
          .fromTo(
            titleRef.current,
            { yPercent: 0, opacity: 1 },
            { yPercent: -1.5, duration: 1.6, ease: "sine.inOut" },
            0.1
          )
          .to({}, { duration: 2.8 });
      });

      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top top",
        end: "bottom top",
        onUpdate: (self) => {
          const p = self.progress;
          gsap.to(titleRef.current, { y: p * -20, duration: 0.2, ease: "linear" });
          gsap.to(rightInfoRef.current, { y: p * -10, duration: 0.2, ease: "linear" });
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const mm = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mm.matches) {
      const id = setInterval(
        () => setIdx((p) => (p + 1) % videoSources.length),
        5000
      );
      return () => clearInterval(id);
    }
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative h-screen bg-black text-foreground overflow-hidden font-body"
      aria-label="South Side Studios hero"
    >
      <div className="absolute inset-0 z-0">
        {videoSources.map((src, i) => (
          <video
            key={src}
            ref={(el) => setVideoRef(el, i)}
            src={src}
            muted
            playsInline
            loop
            preload="auto"
            className="absolute inset-0 w-full h-full object-cover opacity-0 will-change-transform will-change-opacity"
            aria-hidden="true"
          />
        ))}
        <div ref={overlayRef} className="absolute inset-0 bg-black/60" aria-hidden="true" />
      </div>

      <div className="relative z-10 h-full flex flex-col justify-between p-8 md:p-16">
        <div />

        <div className="relative w-full -mt-16 md:-mt-24">
          <h1
            ref={titleRef}
            className="font-display uppercase text-white tracking-widest text-[clamp(2.5rem,13vw,11rem)] xl:text-[12.5rem] leading-[0.85] will-change-transform will-change-opacity"
          >
            <span>South Side</span>
            <br />
            <span>Studios</span>
          </h1>

          <div
            ref={rightInfoRef}
            className="absolute top-1/2 -translate-y-1/2 right-0 lg:right-4 xl:right-8 flex items-start text-[10px] sm:text-xs 2xl:text-sm uppercase tracking-[0.15em] font-body space-x-4 text-white/70"
          >
            <div className="mt-1.5 w-6 h-[1px] bg-white/60" aria-hidden="true" />
            <div className="space-y-8">
              <p className="whitespace-nowrap">
                Production facilities in
                <br />
                Dallas, Texas.
              </p>
              <p className="whitespace-nowrap">
                Scroll to
                <br />
                learn more.
              </p>
            </div>
          </div>
        </div>

        <div className="w-full pb-4">
          <div ref={linesWrapRef} className="max-w-xs mx-auto flex flex-col space-y-1.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <hr key={i} className="border-t border-white/90" aria-hidden="true" />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
