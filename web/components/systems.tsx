import Image from "next/image";
import { SYSTEMS, SYSTEMS_MORE } from "@/lib/data";
import { Reveal } from "./reveal";

export default function Systems() {
  return (
    <section id="systems" className="py-20 lg:py-28">
      <div className="mx-auto max-w-[1180px] px-4 sm:px-6 lg:px-8">
        <Reveal>
          <h2 className="t-h2 max-w-[17ch] text-balance">
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
        <ul className="mx-auto flex w-max snap-x snap-mandatory gap-5 px-4 sm:px-6 lg:px-8">
          {SYSTEMS.map((s) => (
            <li
              key={s.slug}
              className="group w-[80vw] shrink-0 snap-start sm:w-[58vw] lg:w-[28rem]"
            >
              <figure className="surface h-full overflow-hidden">
                <div className="relative aspect-4/3 overflow-hidden rounded-t-[28px]">
                  <Image
                    src={s.image}
                    alt={`${s.name} installed by Sunlight Supplies`}
                    fill
                    sizes="(max-width: 640px) 80vw, (max-width: 1024px) 58vw, 28rem"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                  />
                </div>
                <figcaption className="p-7">
                  <h3 className="t-h3 flex flex-wrap items-baseline gap-x-3">
                    {s.name}
                    <span className="text-[0.9rem] font-normal text-muted">
                      {s.zh}
                    </span>
                  </h3>
                  <p className="t-body mt-3 text-[0.98rem]">{s.blurb}</p>
                  <p className="t-num mt-5 inline-flex rounded-full bg-tint-warm px-3.5 py-1.5 text-[0.85rem] font-medium text-ink">
                    {s.load}
                  </p>
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </div>

      <div className="mx-auto max-w-[1180px] px-4 sm:px-6 lg:px-8">
        <Reveal className="mt-10">
          <ul className="flex flex-wrap gap-2.5">
            {SYSTEMS_MORE.map((s) => (
              <li
                key={s}
                className="rounded-full bg-surface px-4 py-2 text-[0.9rem] text-body"
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
