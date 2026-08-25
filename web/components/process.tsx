import Image from "next/image";
import { PROCESS } from "@/lib/data";
import { Reveal } from "./reveal";

export default function Process() {
  return (
    <section id="process" className="py-20 lg:py-28">
      <div className="mx-auto grid max-w-[1180px] grid-cols-1 gap-10 px-4 sm:px-6 lg:grid-cols-12 lg:gap-14 lg:px-8">
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-28">
            <Reveal>
              <h2 className="t-h2 max-w-[14ch] text-balance">
                Nothing gets quoted before it gets drawn.
              </h2>
              <p className="t-body mt-5">
                The measurement and the CAD layout are free and they come first.
                By the time there is a price, both sides are looking at the same
                drawing.
              </p>
            </Reveal>
          </div>
        </div>

        <ol className="flex flex-col gap-4 lg:col-span-7">
          {PROCESS.map((s, i) => (
            <Reveal key={s.title} delay={i * 0.06}>
              <li className="surface flex items-start gap-5 p-6 sm:gap-7 sm:p-8">
                <div className="grid size-16 shrink-0 place-items-center rounded-full bg-paper sm:size-20">
                  <Image
                    src={s.icon}
                    alt=""
                    width={160}
                    height={160}
                    className="size-11 sm:size-14"
                  />
                </div>
                <div>
                  <h3 className="t-h3">{s.title}</h3>
                  <p className="t-body mt-2 text-[0.98rem]">{s.body}</p>
                </div>
              </li>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
