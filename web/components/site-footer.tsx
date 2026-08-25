import Image from "next/image";
import { COMPANY, NAV } from "@/lib/data";

export default function SiteFooter() {
  return (
    <footer className="px-4 pb-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1180px]">
        <div className="surface px-8 py-12 lg:px-12">
          <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
            <div>
              <div className="flex items-center gap-2.5">
                <Image
                  src="/brand/mark.png"
                  alt=""
                  width={32}
                  height={32}
                  className="h-8 w-8"
                />
                <span className="text-[1rem] font-medium tracking-tight text-ink">
                  {COMPANY.short}
                </span>
              </div>
              <p className="mt-4 max-w-[30ch] text-[0.98rem] leading-relaxed text-body">
                {COMPANY.tagline}
              </p>
              <p className="mt-1 text-[0.98rem] text-muted">
                {COMPANY.taglineZh}
              </p>
            </div>

            <div className="flex flex-wrap gap-x-14 gap-y-8">
              <nav className="flex flex-col gap-3">
                {NAV.map((n) => (
                  <a
                    key={n.href}
                    href={n.href}
                    className="text-[0.95rem] text-body transition-colors hover:text-ink"
                  >
                    {n.label}
                  </a>
                ))}
              </nav>
              <div className="flex flex-col gap-3">
                <a
                  href={COMPANY.facebook}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[0.95rem] text-body transition-colors hover:text-ink"
                >
                  Facebook
                </a>
                <a
                  href={COMPANY.youtube}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[0.95rem] text-body transition-colors hover:text-ink"
                >
                  YouTube
                </a>
                <a
                  href={`mailto:${COMPANY.email}`}
                  className="text-[0.95rem] text-body transition-colors hover:text-ink"
                >
                  {COMPANY.email}
                </a>
              </div>
            </div>
          </div>

          <div className="mt-12 flex flex-col gap-2 text-[0.85rem] text-faint sm:flex-row sm:items-center sm:justify-between">
            <p>
              {COMPANY.name} ({COMPANY.reg})
            </p>
            <p className="t-num">
              Johor Bahru, Malaysia. Founded {COMPANY.founded}.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
