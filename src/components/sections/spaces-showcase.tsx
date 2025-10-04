"use client";

import Link from "next/link";
import React from "react";
import Marquee from "react-fast-marquee";

const MarqueeItem = ({ text }: { text: string }) => {
  return (
    <li className="flex items-center font-display text-4xl md:text-6xl text-white uppercase mx-10">
      {text}
    </li>
  );
};

const SpacesShowcase = () => {
  const marqueeItems = [
    "prop room",
    "led wall", 
    "mill work",
    "wardrobe",
    "genie",
  ];

  return (
    <>
      <section className="bg-black text-foreground relative overflow-hidden py-24 sm:py-32">
        <div className="container mx-auto px-4 sm:px-8 text-center flex flex-col items-center">
          <h2 className="font-display text-white-800 text-[clamp(2.5rem,9vw,6rem)] lg:text-[100px] leading-none tracking-tight">
            More <span>Spaces.</span>
            <br className="sm:hidden" /> Bigger <span>Stories.</span>
          </h2>

          <Link
            href="/facilities"
            className="block relative w-full max-w-5xl aspect-[16/7] mx-auto my-16 md:my-24 group"
            aria-label="Learn more about our facilities"
          >
            <div className="absolute inset-0 overflow-hidden">
              <video
                src="https://sss.matchboxstudio.com/wp-content/uploads/2024/11/Mobile-Dissolve_D1293_237_003_960wpx_h264_01_anubis.mp4"
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover scale-110"
              />
            </div>
            <div className="absolute inset-0 bg-black/20 [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_100%)]"></div>
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 backdrop-blur-sm [mask-image:radial-gradient(ellipse_at_center,black_60%,transparent_100%)]">
              <div className="w-32 h-32 border border-white/50 rounded-full flex items-center justify-center">
                <span className="font-navigation text-sm text-white text-center">
                  Learn More
                </span>
              </div>
            </div>
          </Link>

          <div className="w-full relative overflow-hidden py-4">
            <Marquee speed={30} gradient gradientColor="#000000" pauseOnHover>
              <ul className="flex items-center">
                {marqueeItems.map((item, index) => (
                  <MarqueeItem key={`m-${index}`} text={item} />
                ))}
                {marqueeItems.map((item, index) => (
                  <MarqueeItem key={`m2-${index}`} text={item} />
                ))}
              </ul>
            </Marquee>
          </div>

          <div className="mt-16 sm:mt-24 px-4">
            <p className="max-w-xl mx-auto text-lg text-light-gray leading-relaxed">
              We have everything you need to bring your vision to life — from
              behind the scenes to in front of the camera.
            </p>
            <Link
              href="/facilities"
              className="inline-block sm:hidden mt-8 border border-white rounded-full py-3 px-8 text-sm font-navigation tracking-wider hover:bg-white hover:text-black transition-colors"
            >
              Discover the Facilites
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};

export default SpacesShowcase;