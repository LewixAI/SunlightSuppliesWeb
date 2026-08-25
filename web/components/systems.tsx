import Image from "next/image";
import { SYSTEMS, SYSTEMS_MORE } from "@/lib/data";
import { Reveal } from "./reveal";

export default function Systems() {
  return (
    <section id="systems" className="py-24 lg:py-32">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        <Reveal>
          <h2 className="t-h2 max-w-[18ch] text-balance">
            Eighteen systems, rated one to three tonnes.
          </h2>
          <p className="t-body mt-5">
            Which one fits comes out of the site survey, not a catalogue. Aisle
            width, truck reach, ceiling height and how often you touch each
            pallet decide it.
          </p>
        </Reveal>
      </div>

      {/* horizontal rail: the range is wide, so let it run off the edge rather
          than compress six systems into a grid of thumbnails */}
      <div className="mt-12 overflow-x-auto pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <ul className="flex w-max snap-x snap-mandatory gap-4 px-6 lg:px-10">
          {SYSTEMS.map((s) => (
            <li
              key={s.slug}
              className="group w-[78vw] shrink-0 snap-start sm:w-[58vw] lg:w-[30rem]"
            >
              <figure className="overflow-hidden rounded-[4px] border border-line bg-ink-2">
                <div className="relative aspect-4/3 overflow-hidden">
                  <Image
                    src={s.image}
                    alt={`${s.name} installed by Sunlight Supplies`}
                    fill
                    sizes="(max-width: 640px) 78vw, (max-width: 1024px) 58vw, 30rem"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                  />
                </div>
                <figcaption className="p-6">
                  <h3 className="t-h3 flex flex-wrap items-baseline gap-x-3">
                    {s.name}
                    <span className="text-sm font-normal text-text-3">
                      {s.zh}
                    </span>
                  </h3>
                  <p className="t-body mt-3 text-[0.95rem]">{s.blurb}</p>
                  <p className="t-num mt-5 text-[0.8rem] text-accent">
                    {s.load}
                  </p>
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </div>

      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        <Reveal className="mt-10">
          <ul className="flex flex-wrap gap-2">
            {SYSTEMS_MORE.map((s) => (
              <li
                key={s}
                className="rounded-[4px] border border-line px-3 py-1.5 text-[0.85rem] text-text-2"
              >
                {s}
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
