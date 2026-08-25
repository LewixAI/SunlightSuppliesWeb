import Image from "next/image";
import { RETAIL } from "@/lib/data";
import { Reveal } from "./reveal";

export default function Retail() {
  return (
    <section id="retail" className="border-t border-line bg-ink-2/40 py-24 lg:py-32">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        <Reveal>
          <h2 className="t-h2 max-w-[17ch] text-balance">
            The other half of the business is shop floors.
          </h2>
          <p className="t-body mt-5">
            Gondolas, oppa racks, counters, trolleys, mannequins and the wire
            and hook work that goes with them. Same three counters, same stock,
            different buyer.
          </p>
        </Reveal>

        <ul className="mt-14 grid grid-cols-2 gap-px overflow-hidden rounded-[4px] border border-line bg-line md:grid-cols-3 lg:grid-cols-4">
          {RETAIL.map((r, i) => (
            <li key={r.name} className="bg-ink">
              <Reveal delay={(i % 4) * 0.05} y={14}>
                <article className="group flex h-full flex-col p-5">
                  <div className="relative mb-5 aspect-square overflow-hidden rounded-[4px] bg-white">
                    <Image
                      src={r.file}
                      alt={r.name}
                      fill
                      sizes="(max-width: 768px) 45vw, 22vw"
                      className="object-contain p-4 transition-transform duration-500 ease-out group-hover:scale-105"
                    />
                  </div>
                  <h3 className="text-[0.98rem] font-medium">{r.name}</h3>
                  <p className="mt-0.5 text-[0.8rem] text-text-3">{r.zh}</p>
                  <p className="mt-3 text-[0.85rem] leading-relaxed text-text-2">
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
