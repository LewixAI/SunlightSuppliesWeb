"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { List, X } from "@phosphor-icons/react";
import { COMPANY, NAV } from "@/lib/data";

export default function SiteHeader() {
  const [floating, setFloating] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // IntersectionObserver on a sentinel rather than a scroll listener
    const sentinel = document.createElement("div");
    sentinel.style.cssText =
      "position:absolute;top:0;left:0;width:1px;height:64px;pointer-events:none";
    document.body.appendChild(sentinel);
    const io = new IntersectionObserver(([e]) => setFloating(!e.isIntersecting), {
      threshold: 0,
    });
    io.observe(sentinel);
    return () => {
      io.disconnect();
      sentinel.remove();
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-4 pt-3 sm:px-6 lg:px-8">
      <div
        className={`mx-auto flex h-[60px] max-w-[1180px] items-center gap-8 rounded-full px-4 transition-all duration-300 sm:px-5 ${
          floating || open
            ? "bg-paper/85 shadow-[var(--shadow-soft)] backdrop-blur-xl"
            : ""
        }`}
      >
        <a
          href="#top"
          className="flex shrink-0 items-center gap-2.5"
          aria-label={COMPANY.name}
        >
          <Image
            src="/brand/mark.png"
            alt=""
            width={30}
            height={30}
            priority
            className="h-[30px] w-[30px]"
          />
          <span className="text-[1rem] font-medium tracking-tight text-ink">
            Sunlight
          </span>
        </a>

        <nav className="ml-auto hidden items-center gap-1 lg:flex">
          {NAV.map((n) => (
            <a
              key={n.href}
              href={n.href}
              className="rounded-full px-3.5 py-2 text-[0.95rem] text-body transition-colors hover:bg-surface hover:text-ink"
            >
              {n.label}
            </a>
          ))}
        </nav>

        <a
          href="#contact"
          className="btn btn-primary ml-auto hidden !px-5 !py-2.5 !text-[0.95rem] lg:ml-2 lg:flex"
        >
          Get a free layout
        </a>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="ml-auto grid h-10 w-10 place-items-center rounded-full bg-surface text-ink lg:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
        >
          {open ? <X size={20} /> : <List size={20} />}
        </button>
      </div>

      {open && (
        <div className="mx-auto mt-2 max-w-[1180px] rounded-[28px] bg-paper p-3 shadow-[var(--shadow-lift)] lg:hidden">
          <nav className="flex flex-col">
            {NAV.map((n) => (
              <a
                key={n.href}
                href={n.href}
                onClick={() => setOpen(false)}
                className="rounded-2xl px-4 py-3.5 text-[1.05rem] text-body transition-colors hover:bg-surface"
              >
                {n.label}
              </a>
            ))}
            <a
              href="#contact"
              onClick={() => setOpen(false)}
              className="btn btn-primary mt-2 justify-center"
            >
              Get a free layout
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
