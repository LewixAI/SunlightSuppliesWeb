import Image from "next/image";

/**
 * The scattered objects either side of the hero copy.
 *
 * Straight out of the family.co playbook: the centre column is narrow, so
 * without something in the margins the hero reads as a headline stranded in
 * white. These are generated soft-clay renders of things the company actually
 * handles - a loaded pallet, a bay of their own blue and orange racking, a
 * sack truck - so the decoration is still about the business.
 *
 * Every object is `pointer-events-none` and `aria-hidden`; none of them carry
 * meaning that is not already in the copy.
 *
 * They only appear from `lg` up. The copy column is 44rem wide, so below that
 * breakpoint there is no margin for them to sit in and they land straight on
 * top of the headline.
 */

type Obj = {
  src: string;
  /** position + size, applied as-is so each one can be placed by hand */
  className: string;
  tilt: number;
  dur: number;
  delay: number;
};

const OBJECTS: Obj[] = [
  // left column
  {
    src: "/objects/pallet-load.png",
    className: "left-[1%] top-[2%] w-32",
    tilt: -6,
    dur: 7.5,
    delay: 0,
  },
  {
    src: "/objects/hand-truck.png",
    className: "left-[7%] top-[46%] w-24",
    tilt: 7,
    dur: 8.5,
    delay: 0.7,
  },
  {
    src: "/objects/tape-measure.png",
    className: "left-[0%] top-[76%] w-20",
    tilt: -10,
    dur: 6.5,
    delay: 1.4,
  },
  // right column
  {
    src: "/objects/rack-bay.png",
    className: "right-[1%] top-[0%] w-36",
    tilt: 5,
    dur: 8,
    delay: 0.35,
  },
  {
    src: "/objects/carton.png",
    className: "right-[8%] top-[44%] w-20",
    tilt: -8,
    dur: 7,
    delay: 1.1,
  },
  {
    src: "/objects/hard-hat.png",
    className: "right-[0%] top-[74%] w-24",
    tilt: 9,
    dur: 9,
    delay: 0.2,
  },
];

export default function HeroObjects() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 hidden lg:block"
    >
      {OBJECTS.map((o) => (
        <div
          key={o.src}
          className={`drift absolute ${o.className}`}
          style={
            {
              "--tilt": `${o.tilt}deg`,
              "--dur": `${o.dur}s`,
              "--delay": `${o.delay}s`,
            } as React.CSSProperties
          }
        >
          <Image
            src={o.src}
            alt=""
            width={320}
            height={320}
            className="h-auto w-full select-none"
            priority
          />
        </div>
      ))}
    </div>
  );
}
