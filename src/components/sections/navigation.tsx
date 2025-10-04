"use client";

import React, { useLayoutEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const NAV_ITEMS = [
  { name: "STAGES", href: "https://sss.matchboxstudio.com/stages/" },
  { name: "FACILITIES", href: "https://sss.matchboxstudio.com/facilities/" },
  { name: "EQUIPMENT", href: "https://sss.matchboxstudio.com/equipment/" },
  { name: "LOCATION", href: "https://sss.matchboxstudio.com/location/" },
  { name: "CONTACT", href: "https://sss.matchboxstudio.com/contact/" },
];

export default function Navigation() {
  const headerRef = useRef(null);
  const logoRef = useRef(null);
  const progressRef = useRef(null);
  const listRef = useRef(null);
  const linksRef = useRef<HTMLAnchorElement[]>([]);
  const underlinesRef = useRef<HTMLSpanElement[]>([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);
  const mobileListRef = useRef<HTMLUListElement>(null);

  const setLinkRef = (el: HTMLAnchorElement | null, i: number) => {
    if (el) linksRef.current[i] = el;
  };
  const setUnderlineRef = (el: HTMLSpanElement | null, i: number) => {
    if (el) underlinesRef.current[i] = el;
  };

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(headerRef.current, {
        y: -24,
        autoAlpha: 0,
        ease: "power3.out",
        duration: 0.7,
      });

      const tl = gsap.timeline({ delay: 0.1 });
      tl.from(logoRef.current, { y: 20, autoAlpha: 0, duration: 0.5, ease: "power3.out" })
        .from(
          linksRef.current,
          {
            y: 16,
            autoAlpha: 0,
            stagger: 0.06,
            duration: 0.5,
            ease: "power3.out",
          },
          "-=0.2"
        );

      gsap.set(progressRef.current, { scaleX: 0, transformOrigin: "0% 50%" });
      ScrollTrigger.create({
        start: 0,
        end: "max",
        onUpdate: (self) => {
          gsap.to(progressRef.current, {
            scaleX: self.progress,
            duration: 0.15,
            ease: "power1.out",
          });
        },
      });

      let lastY = window.scrollY;
      const show = () =>
        gsap.to(headerRef.current, { y: 0, duration: 0.35, ease: "power3.out" });
      const hide = () =>
        gsap.to(headerRef.current, { y: -96, duration: 0.35, ease: "power3.out" });

      ScrollTrigger.create({
        start: "top top",
        end: "max",
        onUpdate: () => {
          const y = window.scrollY;
          if (y < 24 || y < lastY) show();
          else hide();
          lastY = y;
        },
      });

      linksRef.current.forEach((el, i) => {
        const ul = underlinesRef.current[i];
        const enter = () => {
          gsap.to(el, { y: -2, duration: 0.2, ease: "power3.out" });
          gsap.fromTo(
            ul,
            { scaleX: 0, transformOrigin: "0% 50%" },
            { scaleX: 1, duration: 0.35, ease: "power2.out" }
          );
        };
        const leave = () => {
          gsap.to(el, { y: 0, duration: 0.25, ease: "power3.out" });
          gsap.to(ul, {
            scaleX: 0,
            transformOrigin: "100% 50%",
            duration: 0.35,
            ease: "power2.in",
          });
        };
        el.addEventListener("mouseenter", enter);
        el.addEventListener("mouseleave", leave);
      });

      const strength = 10;
      linksRef.current.forEach((el) => {
        const move = (e: MouseEvent) => {
          const r = el.getBoundingClientRect();
          const x = e.clientX - (r.left + r.width / 2);
          const y = e.clientY - (r.top + r.height / 2);
          gsap.to(el, {
            x: (x / r.width) * strength,
            y: (y / r.height) * strength,
            duration: 0.25,
            ease: "power2.out",
          });
        };
        const reset = () =>
          gsap.to(el, { x: 0, y: 0, duration: 0.35, ease: "power3.out" });
        el.addEventListener("mousemove", move);
        el.addEventListener("mouseleave", reset);
      });
    });

    return () => ctx.revert();
  }, []);

  useLayoutEffect(() => {
    if (!overlayRef.current) return;
    const radius = Math.hypot(window.innerWidth, window.innerHeight);
    if (menuOpen) {
      gsap.set(overlayRef.current, { display: "block" });
      gsap.fromTo(
        overlayRef.current,
        { clipPath: `circle(0px at 92% 32px)` },
        { clipPath: `circle(${radius}px at 92% 32px)`, duration: 0.5, ease: "power3.out" }
      );
      gsap.fromTo(
        mobileListRef.current?.children || [],
        { y: 24, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, stagger: 0.06, duration: 0.4, ease: "power3.out", delay: 0.05 }
      );
    } else {
      const tl = gsap.timeline({
        onComplete: () => { gsap.set(overlayRef.current, { display: "none" }); },
      });
      tl.to(mobileListRef.current?.children || [], {
        y: 8,
        autoAlpha: 0,
        duration: 0.25,
        stagger: { each: 0.04, from: "end" },
        ease: "power2.inOut",
      }).to(overlayRef.current, {
        clipPath: `circle(0px at 92% 32px)`,
        duration: 0.4,
        ease: "power3.in",
      }, "<");
    }
  }, [menuOpen]);

  return (
    <header
      ref={headerRef}
      className="fixed top-0 left-0 w-full z-50 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border"
      role="banner"
    >
      {/* top progress bar */}
      <div
        ref={progressRef}
        className="absolute top-0 left-0 h-[3px] w-full bg-foreground/80 origin-left pointer-events-none"
        aria-hidden="true"
      />

      <div className="container flex h-[88px] items-center justify-between">
        <a
          ref={logoRef}
          href="https://sss.matchboxstudio.com/"
          className="font-display text-xl md:text-2xl tracking-[0.05em] text-foreground whitespace-nowrap"
        >
          South Side Studios
        </a>

        <nav className="hidden lg:block" role="navigation" aria-label="Primary">
          <ul ref={listRef} className="flex items-center space-x-10">
            {NAV_ITEMS.map((item, i) => (
              <li key={item.name} className="relative group">
                <a
                  ref={(el) => setLinkRef(el, i)}
                  href={item.href}
                  className="font-navigation text-foreground/90 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/30 px-1 py-1 inline-block"
                >
                  {item.name}
                </a>
                <span
                  ref={(el) => setUnderlineRef(el, i)}
                  aria-hidden="true"
                  className="absolute left-0 -bottom-1 h-[2px] w-full bg-foreground scale-x-0 origin-left"
                />
              </li>
            ))}
          </ul>
        </nav>

        <button
          onClick={() => setMenuOpen((s) => !s)}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          className="lg:hidden font-navigation text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/30"
        >
          {menuOpen ? "CLOSE" : "MENU"}
        </button>
      </div>

      <div
        ref={overlayRef}
        id="mobile-menu"
        className="fixed inset-0 z-40 hidden bg-background/95 backdrop-blur-sm"
        style={{ clipPath: "circle(0px at 92% 32px)" }}
      >
        <div className="container pt-[120px] pb-10">
          <ul ref={mobileListRef} className="space-y-6">
            {NAV_ITEMS.map((item) => (
              <li key={`m-${item.name}`}>
                <a
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className="block font-display text-2xl tracking-[0.06em] text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/30"
                >
                  {item.name}
                </a>
              </li>
            ))}
          </ul>
          <div className="mt-10 text-sm text-foreground/60">
            © {new Date().getFullYear()} South Side Studios
          </div>
        </div>
      </div>
    </header>
  );
}
