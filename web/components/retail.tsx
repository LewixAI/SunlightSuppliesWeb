import Image from "next/image";
import { RETAIL } from "@/lib/data";
import { Reveal } from "./reveal";

export default function Retail() {
  return (
    <section id="retail" className="py-14 lg:py-28">
      <div className="mx-auto max-w-[1180px] px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="flex items-center justify-between gap-8">
            <div>
              <h2 className="t-h2 max-w-[18ch] text-balance">
                The other half of the business is shop floors.
              </h2>
              <p className="t-body mt-5">
                Gondolas, oppa racks, counters, trolleys, mannequins and the
                wire and hook work that goes with them. Same three counters,
                same stock, different buyer.
              </p>
            </div>
            <div aria-hidden="true" className="hidden shrink-0 items-end gap-3 lg:flex">
              <Image
                src="/objects/shopping-basket.png"
                alt=""
                width={200}
                height={200}
                className="drift w-24"
                style={{ "--tilt": "-7deg", "--dur": "7.5s" } as React.CSSProperties}
              />
              <Image
                src="/objects/gondola.png"
                alt=""
                width={200}
                height={200}
                className="drift w-28"
                style={{ "--tilt": "5deg", "--dur": "8.5s", "--delay": "0.8s" } as React.CSSProperties}
              />
            </div>
          </div>
        </Reveal>

        <ul className="mt-14 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {RETAIL.map((r, i) => (
            <li key={r.name} className="h-full">
              {/* Each item is a card of its own so a two-line name cannot
                  shove its neighbour's text out of line. Grid rows stretch, so
                  the cards in a row finish level however long the copy runs. */}
              <Reveal delay={(i % 4) * 0.05} y={14} className="h-full">
                <article className="group flex h-full flex-col rounded-[24px] bg-surface p-3">
                  <div className="relative aspect-square overflow-hidden rounded-[18px] bg-paper">
                    <Image
                      src={r.file}
                      alt={r.name}
                      fill
                      sizes="(max-width: 768px) 45vw, 22vw"
                      className="object-contain p-5 transition-transform duration-500 ease-out group-hover:scale-105"
                    />
                  </div>
                  <div className="px-2 pt-4 pb-1">
                    {/* reserves two lines, so the name never shifts what is
                        under it between a short label and a long one */}
                    <h3 className="min-h-[2.6rem] text-[1rem] leading-snug font-medium text-ink">
                      {r.name}
                    </h3>
                    <p className="mt-0.5 text-[0.85rem] text-faint">{r.zh}</p>
                    <p className="mt-2 text-[0.9rem] leading-relaxed text-body">
                      {r.note}
                    </p>
                  </div>
                </article>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
