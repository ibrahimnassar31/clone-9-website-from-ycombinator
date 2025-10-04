"use client";

import { useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface Stage {
  id: string;
  name: string;
  size: string;
}

const stagesData: Stage[] = [
  { id: "stage-01", name: "Stage 01", size: "10,930" },
  { id: "stage-02", name: "Stage 02", size: "10,486" },
  { id: "stage-03", name: "Stage 03", size: "21,918" },
];

const LeftArrow = () => (
    <svg width="24" height="8" viewBox="0 0 24 8" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M8 0.5L0 4L8 7.5V0.5Z" fill="currentColor" fillOpacity="0.7"/>
        <path d="M24 4L8 4" stroke="currentColor" strokeOpacity="0.7" strokeWidth="0.5"/>
    </svg>
);

const RightArrow = () => (
    <svg width="24" height="8" viewBox="0 0 24 8" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M16 7.5L24 4L16 0.5V7.5Z" fill="currentColor" fillOpacity="0.7"/>
        <path d="M0 4H16" stroke="currentColor" strokeOpacity="0.7" strokeWidth="0.5"/>
    </svg>
);


const StagesDiagram = () => {
  const [activeStageId, setActiveStageId] = useState<string>(stagesData[0].id);
  const [zoomLevel, setZoomLevel] = useState<number>(1);

  return (
    <section className="bg-black text-white py-24 sm:py-32 relative overflow-hidden">
      <div className="container mx-auto px-4 relative">
        <Link 
          href="/request-a-studio" 
          className="absolute top-1/2 -right-2 s:right-4 md:right-8 lg:right-16 transform -translate-y-1/2 z-20 p-6 md:p-8 border border-medium-gray/50 rounded-[2.5rem] text-center transition-colors hover:bg-white/5 w-[140px] s:w-[180px] md:w-auto"
        >
          <h3 className="font-display text-xl s:text-2xl md:text-3xl lg:text-4xl tracking-wider mb-4">Request A Studio</h3>
          <span className="inline-block bg-light-gray text-black font-navigation py-2 px-4 md:py-3 md:px-8 rounded-full text-[10px] s:text-xs md:text-sm tracking-widest whitespace-nowrap">GET IN TOUCH</span>
        </Link>

        <div className="flex flex-col items-center gap-12 md:gap-16">
          
          <ul className="flex flex-col sm:flex-row items-baseline justify-center gap-8 md:gap-16">
            {stagesData.map((stage) => (
              <li
                key={stage.id}
                onClick={() => setActiveStageId(stage.id)}
                className={cn(
                  "cursor-pointer text-center transition-opacity duration-300",
                  activeStageId === stage.id ? "opacity-100" : "opacity-30 hover:opacity-70"
                )}
              >
                <h2 className="font-display text-5xl md:text-7xl tracking-wider whitespace-nowrap">{stage.name}</h2>
                <p className="flex items-center justify-center gap-2 text-xs text-medium-gray mt-2 font-body uppercase tracking-widest">
                  <span className="w-4 h-px bg-medium-gray"></span>
                  <span>{stage.size}</span>
                  <span>Square Feet</span>
                </p>
              </li>
            ))}
          </ul>
          
          <div className="w-full max-w-6xl mx-auto relative lg:aspect-[16/7] aspect-[16/9]">
            <div className="w-full h-full pr-10 s:pr-16 md:pr-24">
              <div className="w-full h-full relative">
                <svg width="100%" height="100%" viewBox="0 0 800 450" preserveAspectRatio="xMidYMid meet" className="absolute inset-0">
                  <defs>
                    <filter id="wireframe-glow" x="-50%" y="-50%" width="200%" height="200%">
                      <feGaussianBlur stdDeviation="2.5" result="coloredBlur"/>
                      <feMerge>
                        <feMergeNode in="coloredBlur"/>
                        <feMergeNode in="SourceGraphic"/>
                      </feMerge>
                    </filter>
                  </defs>
                  <g stroke="var(--color-wireframe-lines)" strokeWidth="0.75" fill="none" style={{ filter: 'url(#wireframe-glow)', opacity: 0.6 }}>
                    <path d="M50 350 L 200 250 L 600 250 L 750 350 Z" />
                    <path d="M50 350 L 50 150 L 200 50 L 600 50 L 750 150 L 750 350" />
                    <line x1="200" y1="250" x2="200" y2="50" />
                    <line x1="600" y1="250" x2="600" y2="50" />
                    <line x1="50" y1="150" x2="200" y2="50" />
                    <line x1="750" y1="150" x2="600" y2="50" />
                    <line x1="300" y1="250" x2="300" y2="50" />
                    <line x1="400" y1="250" x2="400" y2="50" />
                    <line x1="500" y1="250" x2="500" y2="50" />
                  </g>
                </svg>
              </div>
            </div>

            <div className="absolute top-1/2 right-0 transform -translate-y-1/2 flex items-center gap-2 s:gap-4 z-10">
              <div className="flex flex-col items-center gap-2 text-white">
                  <button aria-label="Zoom out" className="text-4xl opacity-70 hover:opacity-100 transition-opacity p-2">-</button>
                  <div className="relative flex flex-col items-center gap-4 py-4 my-2">
                      <div className="absolute top-0 bottom-0 w-px bg-white/30 h-full"></div>
                      {[1, 2, 3, 4].map((level) => (
                          <button
                              key={level}
                              aria-label={`Zoom level ${level}`}
                              onClick={() => setZoomLevel(level)}
                              className={cn(
                                "relative w-2 h-2 rounded-full transition-all duration-300",
                                zoomLevel === level ? "bg-white scale-150 ring-1 ring-white/50 ring-offset-2 ring-offset-black" : "bg-white/50 hover:bg-white"
                              )}
                          />
                      ))}
                  </div>
                  <button aria-label="Zoom in" className="text-3xl opacity-70 hover:opacity-100 transition-opacity p-2">+</button>
              </div>
              <span className="font-navigation text-[10px] tracking-[0.3em] -rotate-90 origin-center whitespace-nowrap text-white/50 uppercase">Zoom</span>
            </div>

            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/70 text-[10px] font-navigation tracking-wider flex items-center gap-4 uppercase whitespace-nowrap">
              <LeftArrow />
              <span>Hold CTRL/CMD + DRAG to Pan</span>
              <RightArrow />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StagesDiagram;