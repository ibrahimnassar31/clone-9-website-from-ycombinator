"use client";

import * as React from "react";
import Image from "next/image";
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
  {
    title: "Queen of the South",
    years: "2016 - 2018",
    imageSrc:
      "https://sss.matchboxstudio.com/wp-content/uploads/2024/10/Queen-of-the-South-1000x667.webp",
  },
  {
    title: "Cruel Summer",
    years: "2021",
    imageSrc:
      "https://sss.matchboxstudio.com/wp-content/uploads/2024/10/Cruel-Summer-1000x667.webp",
  },
  {
    title: "The Chosen S02",
    years: "2017",
    imageSrc:
      "https://sss.matchboxstudio.com/wp-content/uploads/2024/10/The-Chosen-S02-copy-1000x667.webp",
  },
  {
    title: "The Gifted S02",
    years: "2017",
    imageSrc:
      "https://sss.matchboxstudio.com/wp-content/uploads/2024/10/The-Gifted-S01-1000x667.webp",
  },
];

export default function ProjectsCarousel() {
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);

  React.useEffect(() => {
    if (!api) {
      return;
    }
    setCurrent(api.selectedScrollSnap());
    const handleSelect = () => {
      setCurrent(api.selectedScrollSnap());
    };
    api.on("select", handleSelect);
    return () => {
      api.off("select", handleSelect);
    };
  }, [api]);

  const scrollPrev = React.useCallback(() => api?.scrollPrev(), [api]);
  const scrollNext = React.useCallback(() => api?.scrollNext(), [api]);

  const currentProject = projects[current] ?? projects[0];

  return (
    <section className="bg-[#f5f1eb] text-black py-20 md:py-24 lg:py-32 overflow-hidden">
      <div className="flex items-center justify-center w-full">
        <div className="font-display text-[15vw] lg:text-[200px] leading-[0.8] font-normal tracking-wider shrink-0 pr-4 sm:pr-6 md:pr-8">
          SHOT
        </div>

        <div className="w-full max-w-[35vw] md:max-w-[400px] lg:max-w-xl xl:max-w-2xl min-w-0">
          <Carousel setApi={setApi} opts={{ loop: true }} className="w-full">
            <CarouselContent>
              {projects.map((project, index) => (
                <CarouselItem key={index}>
                  <div className="aspect-[1.5/1] bg-black/10">
                    <Image
                      src={project.imageSrc}
                      alt={`Production still for ${project.title}`}
                      width={1000}
                      height={667}
                      className="w-full h-full object-cover"
                      unoptimized
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>

          <div className="mt-4 md:mt-6 px-1 flex justify-between items-center text-black">
            <p className="font-navigation w-1/3 text-left truncate pr-2">
              {currentProject.title}
            </p>
            <div className="font-navigation w-1/3 text-center">
              <button
                onClick={scrollPrev}
                className="hover:opacity-75 transition-opacity"
              >
                Prev
              </button>
              <span className="mx-1 md:mx-2">/</span>
              <button
                onClick={scrollNext}
                className="hover:opacity-75 transition-opacity"
              >
                Next
              </button>
            </div>
            <p className="font-navigation w-1/3 text-right">
              {currentProject.years}
            </p>
          </div>
        </div>

        <div className="font-display text-[15vw] lg:text-[200px] leading-[0.8] font-normal tracking-wider shrink-0 pl-4 sm:pl-6 md:pl-8">
          HERE
        </div>
      </div>
    </section>
  );
}