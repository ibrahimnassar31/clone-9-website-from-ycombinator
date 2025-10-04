"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import type { MotionValue, Variants } from "framer-motion";

const stats = [
  "70,000 SQ FT OF STATE OF THE ART STUDIO FACILITIES",
  "50,000 SQ FT OF<br>SUPPORT SPACE",
  "36 FT BY 18 FT<br>LED WALL",
  "THREE SOUND STAGES",
];

const listVariants: Variants = {
  visible: {
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring" as const, stiffness: 100, damping: 20 },
  },
};

const AnimatedFrame = ({
  scrollYProgress,
}: {
  scrollYProgress: MotionValue<number>;
}) => {
  const pathLength = useTransform(scrollYProgress, [0.15, 0.5], [0, 1]);

  return (
    <>
      <div className="absolute inset-0 rounded-[2.5rem] border border-white/20" />
      <svg
        className="absolute inset-0 h-full w-full"
        fill="none"
        preserveAspectRatio="none"
        stroke="white"
        strokeWidth="1"
        viewBox="0 0 100 100"
      >
        <motion.path
          d="M 10,1 H 90 A 9,9 0 0 1 99,10 V 90 A 9,9 0 0 1 90,99 H 10 A 9,9 0 0 1 1,90 V 10 A 9,9 0 0 1 10,1"
          style={{ pathLength }}
        />
      </svg>
    </>
  );
};

const FacilitiesStats = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  return (
    <section
      ref={sectionRef}
      className="bg-primary-black py-20 text-foreground lg:py-40"
    >
      <div className="container mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-32">
          <div className="mb-16 lg:mb-0 lg:pr-8">
            <motion.ul
              className="space-y-20 lg:space-y-32"
              variants={listVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
            >
              {stats.map((stat, index) => (
                <motion.li
                  key={index}
                  className="font-display text-5xl leading-[1.05] tracking-wide md:text-6xl lg:text-[5.5rem]"
                  variants={itemVariants}
                  dangerouslySetInnerHTML={{ __html: stat }}
                />
              ))}
            </motion.ul>
          </div>

          <div className="h-[60vh] lg:sticky lg:top-24 lg:h-[calc(100vh-12rem)]">
            <div className="relative mx-auto h-full w-full max-w-lg lg:max-w-none">
              <div className="relative h-full w-full overflow-hidden rounded-[2.5rem]">
                <video
                  className="h-full w-full object-cover"
                  src="https://sss.matchboxstudio.com/wp-content/uploads/2024/11/Mobile-Dissolve_D4078_15_033_960wpx_h264_01_anubis.mp4"
                  autoPlay
                  loop
                  muted
                  playsInline
                />
              </div>
              <AnimatedFrame scrollYProgress={scrollYProgress} />
              <time className="absolute top-1/2 right-[-1.5rem] -translate-y-1/2 rotate-90 transform-gpu font-mono text-sm tracking-widest text-white/80">
                00:00:00
              </time>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FacilitiesStats;