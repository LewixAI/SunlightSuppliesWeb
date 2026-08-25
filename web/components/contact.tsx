import Image from "next/image";
import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import { COMPANY, LOCATIONS } from "@/lib/data";
import { Reveal } from "./reveal";

export default function Contact() {
  return (
    <section id="contact" className="border-t border-line py-24 lg:py-32">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-16">
          <Reveal className="lg:col-span-7">
            <h2 className="t-h2 max-w-[15ch] text-balance">
              Three counters in Johor Bahru.
            </h2>
            <p className="t-body mt-5">
              Tell us the building and roughly what goes in it. The measurement
              and the layout drawing cost nothing, and you keep the drawing
              either way.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href={`https://wa.me/${COMPANY.whatsapp}?text=${encodeURIComponent(
                  "Hi Sunlight, I would like a free layout for my warehouse.",
                )}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-[4px] bg-accent px-5 py-3 text-[0.95rem] font-medium whitespace-nowrap text-on-accent transition-colors duration-150 hover:bg-accent-dim active:translate-y-px"
              >
                Get a free layout
                <ArrowUpRight size={16} weight="bold" />
              </a>
              <a
                href={`mailto:${COMPANY.email}`}
                className="inline-flex items-center rounded-[4px] border border-line-strong px-5 py-3 text-[0.95rem] whitespace-nowrap text-text transition-colors duration-150 hover:border-text-3 hover:bg-ink-2 active:translate-y-px"
              >
                {COMPANY.email}
              </a>
            </div>
          </Reveal>

          <Reveal className="lg:col-span-5" delay={0.08}>
            <div className="relative aspect-[600/289] overflow-hidden rounded-[4px] border border-line">
              <Image
                src="/site/hq-building.jpg"
                alt="Sunlight Supplies head office at Setia Business Park, Johor Bahru"
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover"
              />
            </div>
          </Reveal>
        </div>

        <ul className="mt-16 grid grid-cols-1 gap-px overflow-hidden rounded-[4px] border border-line bg-line md:grid-cols-3">
          {LOCATIONS.map((l, i) => (
            <li key={l.name} className="bg-ink">
              <Reveal delay={i * 0.06} y={14}>
                <div className="flex h-full flex-col p-7">
                  <h3 className="t-h3">{l.name}</h3>
                  <p className="mt-1 text-[0.8rem] text-text-3">{l.role}</p>
                  <p className="mt-5 text-[0.92rem] leading-relaxed text-text-2">
                    {l.address}
                  </p>
                  <dl className="mt-6 space-y-1.5 text-[0.85rem]">
                    <div className="flex gap-3">
                      <dt className="w-14 text-text-3">Tel</dt>
                      <dd className="t-num text-text-2">{l.tel}</dd>
                    </div>
                    <div className="flex gap-3">
                      <dt className="w-14 text-text-3">Mobile</dt>
                      <dd className="t-num text-text-2">{l.mobile}</dd>
                    </div>
                    <div className="flex gap-3">
                      <dt className="w-14 text-text-3">Fax</dt>
                      <dd className="t-num text-text-2">{l.fax}</dd>
                    </div>
                  </dl>
                  <a
                    href={l.maps}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-7 inline-flex items-center gap-1.5 self-start text-[0.88rem] text-accent transition-opacity hover:opacity-80"
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
