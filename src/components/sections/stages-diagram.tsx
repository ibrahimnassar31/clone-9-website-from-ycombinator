"use client";

import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";

interface Stage { id: string; name: string; size: string; }
const stagesData: Stage[] = [
  { id: "stage-01", name: "Stage 01", size: "10,930" },
  { id: "stage-02", name: "Stage 02", size: "10,486" },
  { id: "stage-03", name: "Stage 03", size: "21,918" },
];

const VIEW_W = 800, VIEW_H = 450;

export default function StagesDiagram() {
  const [activeStageId, setActiveStageId] = useState<string>(stagesData[0].id);
  const [zoomLevel, setZoomLevel] = useState<number>(1); // 1..4

  const sectionRef = useRef<HTMLElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const camRef = useRef<SVGGElement>(null);
  const bulletsWrapRef = useRef<HTMLDivElement>(null);
  const diagramWrapRef = useRef<HTMLDivElement>(null);

  const qx = useRef<((v: number) => void) | null>(null);
  const qy = useRef<((v: number) => void) | null>(null);
  const qs = useRef<((v: number) => void) | null>(null);

  const t = useRef({ x: 0, y: 0, s: 1 });

  const levelToScale = useMemo(() => ({ 1: 1, 2: 1.25, 3: 1.55, 4: 1.9 } as Record<number, number>), []);
  const stageTargets = useMemo(() => ({
    "stage-01": { x: 90,  y: 70, width: 220, height: 160 },
    "stage-02": { x: 305, y: 70, width: 190, height: 160 },
    "stage-03": { x: 510, y: 70, width: 220, height: 160 },
    __full__:   { x: 50,  y: 50, width: 700, height: 300 },
  }), []);

  const clampToBounds = (x: number, y: number, s: number) => {
    const world = stageTargets.__full__;
    const contentW = world.width * s;
    const contentH = world.height * s;
    const minX = VIEW_W - (world.x + world.width) * s + 40; // 40px padding
    const maxX = -world.x * s - 40;
    const minY = VIEW_H - (world.y + world.height) * s + 40;
    const maxY = -world.y * s - 40;
    return { x: gsap.utils.clamp(minX, maxX, x), y: gsap.utils.clamp(minY, maxY, y) };
  };

  const screenToWorld = (sx: number, sy: number, x: number, y: number, s: number) => ({
    wx: (sx - x) / s, wy: (sy - y) / s
  });

  const applyView = (centerWorld: { cx: number; cy: number }, s: number, opts?: { instant?: boolean }) => {
    const x = VIEW_W / 2 - centerWorld.cx * s;
    const y = VIEW_H / 2 - centerWorld.cy * s;
    const clamped = clampToBounds(x, y, s);
    t.current = { x: clamped.x, y: clamped.y, s };
    if (opts?.instant) gsap.set(camRef.current, { x: clamped.x, y: clamped.y, scale: s });
    else {
      qx.current?.(clamped.x);
      qy.current?.(clamped.y);
      qs.current?.(s);
    }
  };

  const fitFull = (opts?: { instant?: boolean }) => {
    const world = stageTargets.__full__;
    applyView({ cx: world.x + world.width / 2, cy: world.y + world.height / 2 }, levelToScale[1], opts);
  };

  const focusBBox = (bbox: { x: number; y: number; width: number; height: number }, s?: number) => {
    const cx = bbox.x + bbox.width / 2;
    const cy = bbox.y + bbox.height / 2;
    applyView({ cx, cy }, s ?? t.current.s);
  };

  const focusStage = (id: string, s?: number) => focusBBox(stageTargets[id as keyof typeof stageTargets], s);

  const nearestStageId = () => {
    const { x, y, s } = t.current;
    const center = { sx: VIEW_W / 2, sy: VIEW_H / 2 };
    let best = Infinity, id = activeStageId;
    (Object.keys(stageTargets) as Array<keyof typeof stageTargets>)
      .filter((k) => k !== "__full__")
      .forEach((k) => {
        const b = stageTargets[k];
        const cx = b.x + b.width / 2, cy = b.y + b.height / 2;
        const sx = cx * s + x, sy = cy * s + y;
        const d = Math.hypot(sx - center.sx, sy - center.sy);
        if (d < best) { best = d; id = k as string; }
      });
    return id;
  };

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      qx.current = gsap.quickTo(camRef.current, "x", { duration: 0.28, ease: "power2.out" });
      qy.current = gsap.quickTo(camRef.current, "y", { duration: 0.28, ease: "power2.out" });
      qs.current = gsap.quickTo(camRef.current, "scale", { duration: 0.32, ease: "power2.out" });

      const lines = svgRef.current?.querySelectorAll("path,line") ?? [];
      lines.forEach((el) => {
        const len =
          (el as SVGPathElement).getTotalLength?.() ??
          Math.hypot(
            Number((el as SVGLineElement).x2.baseVal.value) - Number((el as SVGLineElement).x1.baseVal.value),
            Number((el as SVGLineElement).y2.baseVal.value) - Number((el as SVGLineElement).y1.baseVal.value)
          );
        gsap.set(el, { strokeDasharray: len, strokeDashoffset: len, opacity: 0.9 });
      });
      gsap.timeline()
        .to(lines, { strokeDashoffset: 0, duration: 1.0, stagger: 0.03, ease: "power3.out" })
        .to(lines, { opacity: 1, duration: 0.4 }, "<");

      fitFull({ instant: true });
    }, sectionRef);
    return () => ctx.revert();
  }, [levelToScale, stageTargets]);

  useEffect(() => {
    const next = zoomLevel === 1 ? levelToScale[2] : t.current.s;
    setZoomLevel((z) => (z === 1 ? 2 : z));
    focusStage(activeStageId, next);
  }, [activeStageId]);

  const lastPointer = useRef<{ sx: number; sy: number } | null>(null);

  const snapZoomToLevel = (level: number) => {
    const targetScale = levelToScale[level];
    const { x, y, s } = t.current;
    const sx = lastPointer.current?.sx ?? VIEW_W / 2;
    const sy = lastPointer.current?.sy ?? VIEW_H / 2;

    const { wx, wy } = screenToWorld(sx, sy, x, y, s);
    if (level === 1) {
      fitFull();
      return;
    }
    const nx = sx - wx * targetScale;
    const ny = sy - wy * targetScale;
    const clamped = clampToBounds(nx, ny, targetScale);
    t.current = { x: clamped.x, y: clamped.y, s: targetScale };
    qx.current?.(clamped.x); qy.current?.(clamped.y); qs.current?.(targetScale);

    const id = nearestStageId();
    setActiveStageId(id);
  };

  useEffect(() => { snapZoomToLevel(zoomLevel);  }, [zoomLevel]);

  useEffect(() => {
    const wrap = diagramWrapRef.current;
    const bullets = bulletsWrapRef.current;
    if (!wrap && !bullets) return;

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const dir = e.deltaY > 0 ? 1 : -1;
      const rect = (svgRef.current as SVGSVGElement).getBoundingClientRect();
      lastPointer.current = { sx: e.clientX - rect.left, sy: e.clientY - rect.top };
      setZoomLevel((z) => gsap.utils.clamp(1, 4, z + dir));
    };

    wrap?.addEventListener("wheel", onWheel, { passive: false });
    bullets?.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      wrap?.removeEventListener("wheel", onWheel);
      bullets?.removeEventListener("wheel", onWheel);
    };
  }, []);


  useEffect(() => {
    const el = diagramWrapRef.current;
    if (!el) return;
    let dragging = false;
    let vx = 0, vy = 0;
    let px = 0, py = 0;

    const onPointerDown = (e: PointerEvent) => {
      if (!(e.ctrlKey || e.metaKey)) return;
      dragging = true;
      px = e.clientX; py = e.clientY;
      (e.target as Element).setPointerCapture?.(e.pointerId);
    };
    const onPointerMove = (e: PointerEvent) => {
      if (!dragging) return;
      const dx = e.clientX - px, dy = e.clientY - py;
      px = e.clientX; py = e.clientY;
      const nx = t.current.x + dx;
      const ny = t.current.y + dy;
      const clamped = clampToBounds(nx, ny, t.current.s);
      t.current.x = clamped.x; t.current.y = clamped.y;
      qx.current?.(clamped.x); qy.current?.(clamped.y);
      vx = dx; vy = dy;
    };
    const onPointerUp = (e: PointerEvent) => {
      if (!dragging) return;
      dragging = false;
      (e.target as Element).releasePointerCapture?.(e.pointerId);
      gsap.to(t.current, {
        x: t.current.x + vx * 10,
        y: t.current.y + vy * 10,
        duration: 0.8,
        ease: "power3.out",
        onUpdate: () => {
          const c = clampToBounds(t.current.x, t.current.y, t.current.s);
          t.current.x = c.x; t.current.y = c.y;
          gsap.set(camRef.current, { x: c.x, y: c.y });
        }
      });
    };

    el.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
    return () => {
      el.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
    };
  }, []);

  useEffect(() => {
    const el = diagramWrapRef.current;
    if (!el) return;
    const onDbl = (e: MouseEvent) => {
      const rect = (svgRef.current as SVGSVGElement).getBoundingClientRect();
      lastPointer.current = { sx: e.clientX - rect.left, sy: e.clientY - rect.top };
      setZoomLevel((z) => (z < 4 ? z + 1 : 4));
      const id = nearestStageId();
      setActiveStageId(id);
    };
    el.addEventListener("dblclick", onDbl);
    return () => el.removeEventListener("dblclick", onDbl);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "+" || e.key === "=") { e.preventDefault(); setZoomLevel((z) => Math.min(4, z + 1)); }
      if (e.key === "-" || e.key === "_") { e.preventDefault(); setZoomLevel((z) => Math.max(1, z - 1)); }
      if (e.key === "0") { e.preventDefault(); fitFull(); setZoomLevel(1); }
      if (["ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].includes(e.key)) {
        e.preventDefault();
        const delta = e.shiftKey ? 40 : 20;
        const dx = e.key === "ArrowLeft" ? delta : e.key === "ArrowRight" ? -delta : 0;
        const dy = e.key === "ArrowUp" ? delta : e.key === "ArrowDown" ? -delta : 0;
        const c = clampToBounds(t.current.x + dx, t.current.y + dy, t.current.s);
        t.current.x = c.x; t.current.y = c.y; qx.current?.(c.x); qy.current?.(c.y);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    const onResize = () => {
      const cx = (VIEW_W / 2 - t.current.x) / t.current.s;
      const cy = (VIEW_H / 2 - t.current.y) / t.current.s;
      applyView({ cx, cy }, t.current.s, { instant: true });
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const stepZoom = (dir: 1 | -1) => setZoomLevel((z) => gsap.utils.clamp(1, 4, z + dir));
  const handleDotClick = (level: number) => setZoomLevel(level);

  return (
    <section ref={sectionRef} className="bg-black text-white py-24 sm:py-32 relative overflow-hidden">
      <div className="container mx-auto px-4 relative">
        <div className="flex flex-col items-center gap-12 md:gap-16">
          <ul className="flex flex-col sm:flex-row items-baseline justify-center gap-8 md:gap-16">
            {stagesData.map((stage) => (
              <li
                key={stage.id}
                onClick={() => setActiveStageId(stage.id)}
                className={`cursor-pointer text-center transition-opacity duration-300 ${activeStageId === stage.id ? "opacity-100" : "opacity-30 hover:opacity-70"}`}
              >
                <h2 className="font-display text-5xl md:text-7xl tracking-wider whitespace-nowrap">{stage.name}</h2>
                <p className="flex items-center justify-center gap-2 text-xs text-gray-400 mt-2 uppercase tracking-widest">
                  <span className="w-4 h-px bg-gray-400" />
                  <span>{stage.size}</span>
                  <span>Square Feet</span>
                </p>
              </li>
            ))}
          </ul>

          <div className="w-full max-w-6xl mx-auto relative lg:aspect-[16/7] aspect-[16/9]">
            <div
              ref={diagramWrapRef}
              className="w-full h-full pr-10 sm:pr-16 md:pr-24 relative select-none"
              style={{ touchAction: "none" }}
              title="Ctrl/Cmd + drag to pan. Double-click to focus."
            >
              <div className="w-full h-full relative">
                <svg
                  ref={svgRef}
                  width="100%"
                  height="100%"
                  viewBox={`${0} ${0} ${VIEW_W} ${VIEW_H}`}
                  preserveAspectRatio="xMidYMid meet"
                  className="absolute inset-0 will-change-transform"
                >
                  <defs>
                    <filter id="wireframe-glow" x="-50%" y="-50%" width="200%" height="200%">
                      <feGaussianBlur stdDeviation="2.5" result="blur" />
                      <feMerge>
                        <feMergeNode in="blur" />
                        <feMergeNode in="SourceGraphic" />
                      </feMerge>
                    </filter>
                  </defs>

                  <g ref={camRef}>
                    <g stroke="rgba(255,255,255,0.95)" strokeWidth="0.75" fill="none" style={{ filter: "url(#wireframe-glow)" }}>
                      <path d="M50 350 L 200 250 L 600 250 L 750 350 Z" />
                      <path d="M50 350 L 50 150 L 200 50 L 600 50 L 750 150 L 750 350" />
                      <line x1="200" y1="250" x2="200" y2="50" />
                      <line x1="600" y1="250" x2="600" y2="50" />
                      <line x1="50"  y1="150" x2="200" y2="50" />
                      <line x1="750" y1="150" x2="600" y2="50" />
                      <line x1="300" y1="250" x2="300" y2="50" />
                      <line x1="400" y1="250" x2="400" y2="50" />
                      <line x1="500" y1="250" x2="500" y2="50" />
                    </g>
                  </g>
                </svg>
              </div>
            </div>

            <div className="absolute top-1/2 right-0 -translate-y-1/2 flex items-center gap-3 z-10">
              <div ref={bulletsWrapRef} className="flex flex-col items-center gap-2 text-white" title="Scroll to zoom">
                <button aria-label="Zoom out" className="text-4xl opacity-70 hover:opacity-100 transition p-2" onClick={() => stepZoom(-1)}>-</button>
                <div className="relative flex flex-col items-center gap-4 py-4 my-2">
                  <div className="absolute top-0 bottom-0 w-px bg-white/30 h-full" />
                  {[1,2,3,4].map((lvl) => (
                    <button
                      key={lvl}
                      aria-label={`Zoom level ${lvl}`}
                      onClick={() => handleDotClick(lvl)}
                      className={`relative w-2 h-2 rounded-full transition ${zoomLevel===lvl ? "bg-white scale-150 ring-1 ring-white/50" : "bg-white/50 hover:bg-white"}`}
                    />
                  ))}
                </div>
                <button aria-label="Zoom in" className="text-3xl opacity-70 hover:opacity-100 transition p-2" onClick={() => stepZoom(1)}>+</button>
                <button aria-label="Reset" className="mt-3 text-[10px] tracking-[0.2em] opacity-70 hover:opacity-100" onClick={() => { fitFull(); setZoomLevel(1); }}>
                  RESET
                </button>
              </div>
              <span className="text-[10px] tracking-[0.3em] -rotate-90 origin-center whitespace-nowrap text-white/50 uppercase">Zoom</span>
            </div>

            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/70 text-[10px] tracking-wider flex items-center gap-4 uppercase whitespace-nowrap">
              <svg width="24" height="8" viewBox="0 0 24 8" fill="none"><path d="M8 0.5L0 4L8 7.5V0.5Z" fill="currentColor" fillOpacity="0.7"/><path d="M24 4L8 4" stroke="currentColor" strokeOpacity="0.7" strokeWidth="0.5"/></svg>
              <span>Scroll to zoom • Ctrl/Cmd + drag to pan • 0 to reset</span>
              <svg width="24" height="8" viewBox="0 0 24 8" fill="none"><path d="M16 7.5L24 4L16 0.5V7.5Z" fill="currentColor" fillOpacity="0.7"/><path d="M0 4H16" stroke="currentColor" strokeOpacity="0.7" strokeWidth="0.5"/></svg>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
