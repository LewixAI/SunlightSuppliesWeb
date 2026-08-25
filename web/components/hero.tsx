import dynamic from "next/dynamic";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";

const RackHeroCanvas = dynamic(() => import("./rack-hero-canvas"));

export default function Hero() {
  return (
    <section id="top" className="px-4 pt-28 pb-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1180px]">
        <div className="mx-auto max-w-[46rem] text-center">
          <h1 className="t-display rise text-balance">
            Racking, from the site survey up.
          </h1>
          <p
            className="t-body rise mx-auto mt-6 text-[1.15rem]"
            style={{ animationDelay: "90ms" }}
          >
            Heavy duty pallet racking and retail display fixtures, measured,
            drawn and installed across Johor since 2014.
          </p>
          <div
            className="rise mt-9 flex flex-wrap items-center justify-center gap-3"
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

        {/* the rack gets its own soft stage rather than bleeding off the page */}
        <div
          className="rise surface mt-14 overflow-hidden shadow-[var(--shadow-soft)]"
          style={{ animationDelay: "260ms" }}
        >
          <RackHeroCanvas className="h-[52vh] min-h-[340px] w-full sm:h-[58vh] lg:h-[62vh]" />
        </div>
      </div>
    </section>
  );
}
