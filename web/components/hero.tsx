import dynamic from "next/dynamic";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import HeroObjects from "./hero-objects";

const RackHeroCanvas = dynamic(() => import("./rack-hero-canvas"));

export default function Hero() {
  return (
    <section
      id="top"
      className="relative flex min-h-[100dvh] flex-col justify-center overflow-hidden px-4 pt-20 pb-5 sm:px-6 lg:px-8"
    >
      <div className="mx-auto w-full max-w-[1180px]">
        {/* copy and the scattered objects share a stacking context so the
            objects can sit in the margins the centred column leaves behind */}
        <div className="relative py-4 lg:py-7">
          <HeroObjects />

          <div className="relative mx-auto max-w-[44rem] text-center">
            <h1 className="t-display rise text-balance">
              Racking, from the site survey up.
            </h1>
            <p
              className="t-body rise mx-auto mt-5 text-[1.1rem]"
              style={{ animationDelay: "90ms" }}
            >
              Heavy duty pallet racking and retail display fixtures, measured,
              drawn and installed across Johor since 2014.
            </p>
            <div
              className="rise mt-7 flex flex-wrap items-center justify-center gap-3"
              style={{ animationDelay: "180ms" }}
            >
              <a href="#contact" className="btn btn-primary group">
                Get a free layout
                <ArrowRight
                  size={17}
                  weight="bold"
                  className="transition-transform duration-200 group-hover:translate-x-0.5"
                />
              </a>
              <a href="#installed" className="btn btn-quiet">
                See installed work
              </a>
            </div>
          </div>
        </div>

        {/* the rack gets its own soft stage, sized to land inside the first
            screen rather than being cut in half by the fold */}
        <div
          className="rise surface mt-5 overflow-hidden shadow-[var(--shadow-soft)] lg:mt-7"
          style={{ animationDelay: "260ms" }}
        >
          <RackHeroCanvas className="h-[26vh] min-h-[210px] w-full sm:h-[30vh] lg:h-[33vh]" />
        </div>
      </div>
    </section>
  );
}
