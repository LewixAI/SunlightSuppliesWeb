import Image from "next/image";
import { CLIENTS } from "@/lib/data";
import { Reveal } from "./reveal";

/**
 * Their own customer artwork, in its own colours.
 *
 * A monochrome knockout would be tidier, but the set is mixed polarity - most
 * are dark marks on white, Hershey's and Al-Ikhsan are light marks on a dark
 * plate - so no single filter serves them all. White chips keep every logo
 * correct and the wall consistent.
 */
export default function ClientWall() {
  return (
    <section className="border-y border-line bg-ink-2/40">
      <div className="mx-auto max-w-[1400px] px-6 py-14 lg:px-10">
        <Reveal>
          <p className="mb-8 text-sm text-text-3">Trusted by</p>
          <ul className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-8">
            {CLIENTS.map((c) => (
              <li key={c.name}>
                <div className="flex h-16 items-center justify-center rounded-[4px] bg-white px-4 opacity-80 transition-opacity duration-300 hover:opacity-100">
                  <Image
                    src={c.file}
                    alt={c.name}
                    width={160}
                    height={54}
                    className="max-h-9 w-auto object-contain"
                  />
                </div>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
