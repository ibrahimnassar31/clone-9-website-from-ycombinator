"use client";

import { useState, useEffect } from "react";

const videoSources = [
  "https://sss.matchboxstudio.com/wp-content/uploads/2024/11/Home-hero_01.mp4",
  "https://sss.matchboxstudio.com/wp-content/uploads/2024/11/Home-hero_02.mp4",
];

export default function HeroSection() {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);

  useEffect(() => {
    const videoInterval = setInterval(() => {
      setCurrentVideoIndex((prevIndex) => (prevIndex + 1) % videoSources.length);
    }, 5000); // Change video every 5 seconds

    return () => clearInterval(videoInterval);
  }, []);

  return (
    <section className="relative h-screen bg-black text-foreground overflow-hidden font-body">
      {/* Background Videos with Overlay */}
      <div className="absolute inset-0 z-0">
        {videoSources.map((src, index) => (
          <video
            key={src}
            src={src}
            autoPlay
            loop
            muted
            playsInline
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${
              currentVideoIndex === index ? "opacity-30" : "opacity-0"
            }`}
          />
        ))}
        {/* Adds a dark tint over the video for better text readability */}
        <div className="absolute inset-0 bg-black/60" />
      </div>

      {/* Content Layer */}
      <div className="relative z-10 h-full flex flex-col justify-between p-8 md:p-16">
        {/* Top spacer for justify-between */}
        <div />

        {/* Main Content Block (Centered) */}
        <div className="relative w-full -mt-16 md:-mt-24">
          {/* Main Title */}
          <h1 className="font-display uppercase text-white tracking-widest text-[clamp(2.5rem,13vw,11rem)] xl:text-[12.5rem] leading-[0.85]">
            <span>South Side</span>
            <br />
            <span>Studios</span>
          </h1>
          
          {/* Subtitle Information (Right aligned) */}
          <div className="absolute top-1/2 -translate-y-1/2 right-0 lg:right-4 xl:right-8 flex items-start text-[10px] sm:text-xs 2xl:text-sm uppercase tracking-[0.15em] font-body space-x-4 text-muted-foreground">
            <div className="mt-1.5 w-6 h-[1px] bg-muted-foreground" aria-hidden="true" />
            <div className="space-y-8">
              <p className="whitespace-nowrap">Production facilities in<br />Dallas, Texas.</p>
              <p className="whitespace-nowrap">Scroll to<br />learn more.</p>
            </div>
          </div>
        </div>
        
        {/* Decorative Horizontal Lines (Bottom) */}
        <div className="w-full pb-4">
          <div className="max-w-xs mx-auto flex flex-col space-y-1.5">
            {Array(5).fill(0).map((_, i) => (
              <hr key={i} className="border-t border-white/90" />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}