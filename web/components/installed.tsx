import Image from "next/image";
import { PROJECTS } from "@/lib/data";
import { Reveal } from "./reveal";

/** Deliberately uneven, so the grid reads as a record of ten different jobs
 *  rather than ten identical cards. Ten cells for ten projects, no fillers. */
const SPAN = [
  "md:col-span-8 aspect-16/10",
  "md:col-span-4 aspect-3/4",
  "md:col-span-4 aspect-4/5",
  "md:col-span-4 aspect-4/5",
  "md:col-span-4 aspect-4/5",
  "md:col-span-7 aspect-16/10",
  "md:col-span-5 aspect-4/3",
  "md:col-span-4 aspect-4/5",
  "md:col-span-4 aspect-4/5",
  "md:col-span-4 aspect-4/5",
];

export default function Installed() {
  return (
    <section id="installed" className="py-24 lg:py-32">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        <Reveal>
          <h2 className="t-h2 max-w-[16ch] text-balance">
            Racking that is already standing in Johor.
          </h2>
          <p className="t-body mt-5">
            Ten sites, photographed on handover between 2021 and 2022. Every
            caption is the customer and the system that went in.
          </p>
        </Reveal>

        <div className="mt-14 grid grid-cols-1 gap-x-4 gap-y-10 md:grid-cols-12">
          {PROJECTS.map((p, i) => (
            <Reveal
              key={p.slug}
              delay={(i % 3) * 0.07}
              className={SPAN[i].split(" ")[0]}
            >
              <figure>
                <div
                  className={`relative overflow-hidden rounded-[4px] border border-line ${
                    SPAN[i].split(" ")[1]
                  }`}
                >
                  <Image
                    src={`/projects/${p.slug}/${p.photos[0]}`}
                    alt={`${p.system} installed for ${p.client}, Johor Bahru`}
                    fill
                    sizes="(max-width: 768px) 100vw, 45vw"
                    className="object-cover"
                  />
                </div>
                <figcaption className="mt-4 flex items-baseline justify-between gap-4 border-t border-line pt-3">
                  <span className="text-[0.95rem] text-text">{p.client}</span>
                  <span className="t-num text-[0.75rem] text-text-3">
                    {p.year}
                  </span>
                </figcaption>
                <p className="mt-1 text-[0.85rem] text-text-2">{p.system}</p>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
