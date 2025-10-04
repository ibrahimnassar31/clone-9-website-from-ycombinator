import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

const DallasLocationSection = () => {
  return (
    <section className="bg-[#181712] py-24 sm:py-32 text-white">
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid grid-cols-12 gap-x-8">
          <div className="col-span-12 text-center mb-16">
            <p className="font-body uppercase text-sm tracking-[0.08em] text-[#999999] flex justify-center items-center gap-2">
              <span>Filming In</span>
              <ChevronRight className="w-4 h-4" />
              <span>Dallas</span>
            </p>
            <h2 className="font-display text-6xl md:text-7xl lg:text-[100px] leading-none mt-4 tracking-[0.03em]">
              MEET IN THE MIDDLE
            </h2>
          </div>

          <div className="col-span-12 lg:col-start-2 lg:col-span-10">
            <Link href="https://sss.matchboxstudio.com/location/">
              <figure className="relative border border-[#e8e8e8]/30 p-1">
                <Image
                  src="https://sss.matchboxstudio.com/wp-content/uploads/2024/10/dallas-1.webp"
                  alt="Dallas cityscape at twilight"
                  width={1920}
                  height={1080}
                  className="w-full h-auto"
                />
                <figcaption className="absolute bottom-3 left-4 text-[10px] text-[#999999] uppercase tracking-[0.2em] font-body">
                  Credit: Visit Dallas
                </figcaption>
              </figure>
            </Link>
          </div>

          <div className="col-span-12 lg:col-start-8 lg:col-span-4 mt-12">
            <p className="text-lg text-[#e8e8e8] leading-relaxed">
              Dallas is an emerging global city known for its dynamic economy and
              robust financial services industry, positioning it as a key
              player in international commerce and innovation. From easy access
              to versatile locations to tax incentives and more, come see why
              more and more creatives are choosing Dallas for their productions.
            </p>
            <Link
              href="https://sss.matchboxstudio.com/location/"
              className="font-body uppercase text-sm tracking-[0.08em] mt-8 inline-block text-white"
            >
              Learn More
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DallasLocationSection;