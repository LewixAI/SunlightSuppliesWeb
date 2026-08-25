import dynamic from "next/dynamic";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";

const RackHeroCanvas = dynamic(() => import("./rack-hero-canvas"));

export default function Hero() {
  return (
    <section
      id="top"
      className="relative isolate min-h-[100dvh] overflow-hidden"
    >
      <RackHeroCanvas className="absolute inset-0 lg:left-[24%]" />

      {/* scrim, so the headline holds contrast wherever the rack drifts */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink via-ink/70 to-ink/20 lg:bg-gradient-to-r lg:from-ink lg:via-ink/80 lg:to-transparent" />

      <div className="relative mx-auto flex min-h-[100dvh] max-w-[1400px] flex-col justify-end px-6 pt-24 pb-20 lg:justify-center lg:px-10 lg:pb-24">
        <h1 className="t-display max-w-[13ch] text-balance rise">
          Racking, from the site survey up.
        </h1>

        <p
          className="t-body mt-6 max-w-[46ch] rise"
          style={{ animationDelay: "90ms" }}
        >
          Heavy duty pallet racking and retail display fixtures, measured, drawn
          and installed across Johor since 2014.
        </p>

        <div
          className="mt-9 flex flex-wrap items-center gap-3 rise"
          style={{ animationDelay: "180ms" }}
        >
          <a
            href="#contact"
            className="group inline-flex items-center gap-2 rounded-[4px] bg-accent px-5 py-3 text-[0.95rem] font-medium whitespace-nowrap text-on-accent transition-colors duration-150 hover:bg-accent-dim active:translate-y-px"
          >
            Get a free layout
            <ArrowRight
              size={16}
              weight="bold"
              className="transition-transform duration-200 group-hover:translate-x-0.5"
            />
          </a>
          <a
            href="#installed"
            className="inline-flex items-center rounded-[4px] border border-line-strong px-5 py-3 text-[0.95rem] whitespace-nowrap text-text transition-colors duration-150 hover:border-text-3 hover:bg-ink-2 active:translate-y-px"
          >
            See installed work
          </a>
        </div>
      </div>
    </section>
  );
}
