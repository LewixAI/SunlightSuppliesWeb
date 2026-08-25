import Image from "next/image";
import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import { COMPANY, LOCATIONS } from "@/lib/data";
import { Reveal } from "./reveal";

export default function Contact() {
  return (
    <section id="contact" className="py-20 lg:py-28">
      <div className="mx-auto max-w-[1180px] px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="overflow-hidden rounded-[28px] bg-tint-warm">
            <div className="grid grid-cols-1 items-center gap-8 p-8 sm:p-12 lg:grid-cols-2 lg:gap-12">
              <div>
                <h2 className="t-h2 max-w-[15ch] text-balance">
                  Three counters in Johor Bahru.
                </h2>
                <p className="t-body mt-5 text-ink/70">
                  Tell us the building and roughly what goes in it. The
                  measurement and the layout drawing cost nothing, and you keep
                  the drawing either way.
                </p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <a
                    href={`https://wa.me/${COMPANY.whatsapp}?text=${encodeURIComponent(
                      "Hi Sunlight, I would like a free layout for my warehouse.",
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-primary"
                  >
                    Get a free layout
                    <ArrowUpRight size={17} weight="bold" />
                  </a>
                  <a
                    href={`mailto:${COMPANY.email}`}
                    className="btn bg-paper text-ink hover:bg-paper/70"
                  >
                    {COMPANY.email}
                  </a>
                </div>
              </div>

              <div className="relative aspect-[600/289] overflow-hidden rounded-[24px]">
                <Image
                  src="/site/hq-building.jpg"
                  alt="Sunlight Supplies head office at Setia Business Park, Johor Bahru"
                  fill
                  sizes="(max-width: 1024px) 100vw, 45vw"
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </Reveal>

        <ul className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
          {LOCATIONS.map((l, i) => (
            <li key={l.name}>
              <Reveal delay={i * 0.06} y={14}>
                <div className="surface flex h-full flex-col p-7">
                  <h3 className="t-h3">{l.name}</h3>
                  <p className="mt-1 text-[0.85rem] text-faint">{l.role}</p>
                  <p className="mt-5 text-[0.95rem] leading-relaxed text-body">
                    {l.address}
                  </p>
                  <dl className="mt-6 space-y-1.5 text-[0.9rem]">
                    <div className="flex gap-3">
                      <dt className="w-14 text-faint">Tel</dt>
                      <dd className="t-num text-body">{l.tel}</dd>
                    </div>
                    <div className="flex gap-3">
                      <dt className="w-14 text-faint">Mobile</dt>
                      <dd className="t-num text-body">{l.mobile}</dd>
                    </div>
                    <div className="flex gap-3">
                      <dt className="w-14 text-faint">Fax</dt>
                      <dd className="t-num text-body">{l.fax}</dd>
                    </div>
                  </dl>
                  <a
                    href={l.maps}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-7 inline-flex items-center gap-1.5 self-start rounded-full bg-paper px-4 py-2 text-[0.9rem] font-medium text-ink transition-opacity hover:opacity-75"
                  >
                    Open in Maps
                    <ArrowUpRight size={14} weight="bold" />
                  </a>
                </div>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
