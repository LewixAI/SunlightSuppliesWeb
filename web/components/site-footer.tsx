import Image from "next/image";
import { COMPANY, NAV } from "@/lib/data";

export default function SiteFooter() {
  return (
    <footer className="border-t border-line bg-ink-2/40">
      <div className="mx-auto max-w-[1400px] px-6 py-14 lg:px-10">
        <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
          <div>
            <div className="flex items-center gap-2.5">
              <Image
                src="/brand/mark.png"
                alt=""
                width={30}
                height={30}
                className="h-[30px] w-[30px]"
              />
              <span className="text-[0.95rem] font-medium tracking-tight">
                {COMPANY.short}
              </span>
            </div>
            <p className="mt-4 max-w-[30ch] text-[0.92rem] leading-relaxed text-text-2">
              {COMPANY.tagline}
            </p>
            <p className="mt-1 text-[0.92rem] text-text-3">
              {COMPANY.taglineZh}
            </p>
          </div>

          <div className="flex flex-wrap gap-x-12 gap-y-8">
            <nav className="flex flex-col gap-2.5">
              {NAV.map((n) => (
                <a
                  key={n.href}
                  href={n.href}
                  className="text-[0.9rem] text-text-2 transition-colors hover:text-text"
                >
                  {n.label}
                </a>
              ))}
            </nav>
            <div className="flex flex-col gap-2.5">
              <a
                href={COMPANY.facebook}
                target="_blank"
                rel="noreferrer"
                className="text-[0.9rem] text-text-2 transition-colors hover:text-text"
              >
                Facebook
              </a>
              <a
                href={COMPANY.youtube}
                target="_blank"
                rel="noreferrer"
                className="text-[0.9rem] text-text-2 transition-colors hover:text-text"
              >
                YouTube
              </a>
              <a
                href={`mailto:${COMPANY.email}`}
                className="text-[0.9rem] text-text-2 transition-colors hover:text-text"
              >
                {COMPANY.email}
              </a>
            </div>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-2 border-t border-line pt-6 text-[0.8rem] text-text-3 sm:flex-row sm:items-center sm:justify-between">
          <p>
            {COMPANY.name} ({COMPANY.reg})
          </p>
          <p className="t-num">
            Johor Bahru, Malaysia. Founded {COMPANY.founded}.
          </p>
        </div>
      </div>
    </footer>
  );
}
