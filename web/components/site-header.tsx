"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { List, X } from "@phosphor-icons/react";
import { COMPANY, NAV } from "@/lib/data";

export default function SiteHeader() {
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // IntersectionObserver on a sentinel rather than a scroll listener
    const sentinel = document.createElement("div");
    sentinel.style.cssText =
      "position:absolute;top:0;left:0;width:1px;height:88px;pointer-events:none";
    document.body.appendChild(sentinel);
    const io = new IntersectionObserver(([e]) => setSolid(!e.isIntersecting), {
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
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        solid ? "border-b border-line bg-ink/85 backdrop-blur-xl" : ""
      }`}
    >
      {/* over the hero the nav sits on live 3D, so it carries its own scrim */}
      {!solid && (
        <div className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-ink/90 to-transparent" />
      )}
      <div className="relative mx-auto flex h-[68px] max-w-[1400px] items-center gap-8 px-6 lg:px-10">
        <a
          href="#top"
          className="flex shrink-0 items-center gap-2.5"
          aria-label={COMPANY.name}
        >
          <Image
            src="/brand/mark.png"
            alt=""
            width={28}
            height={28}
            priority
            className="h-7 w-7"
          />
          <span className="text-[0.95rem] font-medium tracking-tight">
            Sunlight
          </span>
        </a>

        <nav className="ml-auto hidden items-center gap-7 lg:flex">
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

        <a
          href="#contact"
          className="ml-auto hidden rounded-[4px] bg-accent px-4 py-2 text-[0.9rem] font-medium whitespace-nowrap text-on-accent transition-transform duration-150 hover:bg-accent-dim active:translate-y-px lg:ml-0 lg:block"
        >
          Get a free layout
        </a>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="ml-auto grid h-10 w-10 place-items-center rounded-[4px] text-text lg:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
        >
          {open ? <X size={20} /> : <List size={20} />}
        </button>
      </div>

      {open && (
        <div className="border-t border-line bg-ink lg:hidden">
          <nav className="mx-auto flex max-w-[1400px] flex-col px-6 py-4">
            {NAV.map((n) => (
              <a
                key={n.href}
                href={n.href}
                onClick={() => setOpen(false)}
                className="border-b border-line py-3.5 text-[1.05rem] text-text-2"
              >
                {n.label}
              </a>
            ))}
            <a
              href="#contact"
              onClick={() => setOpen(false)}
              className="mt-5 rounded-[4px] bg-accent px-4 py-3 text-center text-[0.95rem] font-medium text-on-accent"
            >
              Get a free layout
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
