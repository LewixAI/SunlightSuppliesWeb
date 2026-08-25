import Image from "next/image";
import { RETAIL } from "@/lib/data";
import { Reveal } from "./reveal";

export default function Retail() {
  return (
    <section id="retail" className="py-20 lg:py-28">
      <div className="mx-auto max-w-[1180px] px-4 sm:px-6 lg:px-8">
        <Reveal>
          <h2 className="t-h2 max-w-[18ch] text-balance">
            The other half of the business is shop floors.
          </h2>
          <p className="t-body mt-5">
            Gondolas, oppa racks, counters, trolleys, mannequins and the wire
            and hook work that goes with them. Same three counters, same stock,
            different buyer.
          </p>
        </Reveal>

        <ul className="mt-14 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {RETAIL.map((r, i) => (
            <li key={r.name}>
              <Reveal delay={(i % 4) * 0.05} y={14}>
                <article className="group flex h-full flex-col">
                  <div className="relative aspect-square overflow-hidden rounded-[24px] bg-paper shadow-[var(--shadow-soft)]">
                    <Image
                      src={r.file}
                      alt={r.name}
                      fill
                      sizes="(max-width: 768px) 45vw, 22vw"
                      className="object-contain p-6 transition-transform duration-500 ease-out group-hover:scale-105"
                    />
                  </div>
                  <h3 className="mt-4 text-[1rem] font-medium text-ink">
                    {r.name}
                  </h3>
                  <p className="mt-0.5 text-[0.85rem] text-faint">{r.zh}</p>
                  <p className="mt-2 text-[0.9rem] leading-relaxed text-body">
                    {r.note}
                  </p>
                </article>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
