import Image from "next/image";
import { CLIENTS } from "@/lib/data";
import { Reveal } from "./reveal";

/**
 * Their own customer artwork, in its own colours.
 *
 * The set is mixed polarity - most are dark marks on white, Hershey's and
 * Al-Ikhsan are light marks on a dark plate - so no single filter can flatten
 * them all. On a white page they need no plate at all; a light greyscale is
 * enough to stop the wall competing with the rest of the section.
 */
export default function ClientWall() {
  return (
    <section className="px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
      <div className="mx-auto max-w-[1180px]">
        <Reveal>
          <p className="mb-9 text-center text-[0.95rem] text-muted">
            Trusted by
          </p>
          <ul className="grid grid-cols-3 items-center gap-x-6 gap-y-10 sm:grid-cols-4 lg:grid-cols-8">
            {CLIENTS.map((c) => (
              <li key={c.name} className="flex items-center justify-center">
                <Image
                  src={c.file}
                  alt={c.name}
                  width={160}
                  height={54}
                  className="h-8 w-auto max-w-full object-contain opacity-45 grayscale transition-all duration-300 hover:opacity-90 hover:grayscale-0"
                />
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
