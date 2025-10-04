"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

const stats = [
  { value: 70000, html: "SQ FT OF STATE OF THE ART STUDIO FACILITIES" },
  { value: 50000, html: "SQ FT OF<br>SUPPORT SPACE" },
  { value: 36,    html: "FT BY 18 FT<br>LED WALL" },
  { value: 3,     html: "SOUND STAGES" },
];

export default function FacilitiesStatsGSAP() {
  const sectionRef = useRef<HTMLElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const itemsRef = useRef<HTMLLIElement[]>([]);
  const videoRef = useRef<HTMLVideoElement>(null);
  const frameSvgRef = useRef<SVGSVGElement>(null);
  const timeRef = useRef<HTMLTimeElement>(null);

  const setItem = (el: HTMLLIElement | null, i: number) => {
    if (el) itemsRef.current[i] = el;
  };

  useLayoutEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      gsap.set(itemsRef.current, {
        opacity: 0,
        y: 30,
        filter: "blur(6px)",
        clipPath: "inset(0 0 100% 0)",
      });

      const path = frameSvgRef.current?.querySelector("path") as SVGPathElement | null;
      if (path) {
        const len = path.getTotalLength();
        gsap.set(path, { strokeDasharray: len, strokeDashoffset: len, opacity: 0.9 });
      }

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "+=200%",  
          pin: true,
          scrub: 1,
        },
      });

      if (path) {
        tl.to(path, { strokeDashoffset: 0, duration: 0.6, ease: "power2.out" });
      }

      itemsRef.current.forEach((item, i) => {
        const numEl = item.querySelector("[data-count]") as HTMLElement | null;
        const value = Number(numEl?.dataset.count || 0);
        if (numEl && value) {
          gsap.set(numEl, { textContent: 0 });
          tl.to(
            {},
            {
              duration: 0.6,
              onUpdate: function () {
                const p = this.progress();
                const v = Math.floor(gsap.utils.interpolate(0, value, p));
                numEl.textContent = v.toLocaleString();
              },
              ease: "power1.out",
            },
            ">-=0.3"
          );
        }

        tl.to(
          item,
          {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            clipPath: "inset(0 0 0% 0)",
            duration: reduced ? 0.3 : 0.9,
            ease: "power3.out",
          },
          "<"
        )
          .to(
            item,
            {
              opacity: i === itemsRef.current.length - 1 ? 1 : 0.22,
              filter: i === itemsRef.current.length - 1 ? "blur(0px)" : "blur(1px)",
              duration: 0.6,
              ease: "power1.inOut",
            },
            "+=0.6"
          );
      });

      tl.to(
        videoRef.current,
        { yPercent: -6, duration: 1.2, ease: "none" },
        0.1
      );

      const updateTC = () => {
        if (!videoRef.current || !timeRef.current) return;
        const t = videoRef.current.currentTime || 0;
        const h = String(Math.floor(t / 3600)).padStart(2, "0");
        const m = String(Math.floor((t % 3600) / 60)).padStart(2, "0");
        const s = String(Math.floor(t % 60)).padStart(2, "0");
        timeRef.current.textContent = `${h}:${m}:${s}`;
      };
      const ticker = gsap.ticker.add(updateTC);

      videoRef.current?.play().catch(() => void 0);

      return () => {
        gsap.ticker.remove(updateTC);
        gsap.killTweensOf("*");
        ScrollTrigger.getAll().forEach((st) => st.kill());
      };
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="bg-black py-20 text-white lg:py-40">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-32">
          <div className="mb-16 lg:mb-0 lg:pr-8">
            <ul ref={listRef} className="space-y-16 lg:space-y-24">
              {stats.map((s, i) => (
                <li
                  key={i}
                  ref={(el) => setItem(el, i)}
                  className="font-display tracking-wide leading-[1.05]"
                >
                  <div className="text-[clamp(2.25rem,6vw,5rem)]">
                    {s.value ? (
                      <span className="inline-block">
                        <span data-count={s.value} className="tabular-nums font-bold" />{" "}
                        <span
                          className="align-baseline"
                          dangerouslySetInnerHTML={{ __html: s.html }}
                        />
                      </span>
                    ) : (
                      <span dangerouslySetInnerHTML={{ __html: s.html }} />
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="h-[60vh] lg:sticky lg:top-24 lg:h-[calc(100vh-12rem)]">
            <div className="relative mx-auto h-full w-full max-w-lg lg:max-w-none">
              <div className="relative h-full w-full overflow-hidden rounded-[2.5rem]">
                <video
                  ref={videoRef}
                  className="h-full w-full object-cover"
                  src="https://sss.matchboxstudio.com/wp-content/uploads/2024/11/Mobile-Dissolve_D4078_15_033_960wpx_h264_01_anubis.mp4"
                  autoPlay
                  loop
                  muted
                  playsInline
                  preload="auto"
                />
              </div>

              <svg
                ref={frameSvgRef}
                className="pointer-events-none absolute inset-0 h-full w-full"
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
                fill="none"
                stroke="white"
                strokeWidth="1"
              >
                <path d="M 10,1 H 90 A 9,9 0 0 1 99,10 V 90 A 9,9 0 0 1 90,99 H 10 A 9,9 0 0 1 1,90 V 10 A 9,9 0 0 1 10,1" />
              </svg>

              <time
                ref={timeRef}
                className="absolute top-1/2 right-[-1.5rem] -translate-y-1/2 rotate-90 transform-gpu font-mono text-sm tracking-widest text-white/80"
              >
                00:00:00
              </time>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
