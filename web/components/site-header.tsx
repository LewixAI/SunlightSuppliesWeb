"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { List, X } from "@phosphor-icons/react";
import { COMPANY, NAV } from "@/lib/data";

export default function SiteHeader() {
  const [floating, setFloating] = useState(false);
  const [open, setOpen] = useState(false);
  const reduce = useReducedMotion();

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

  // Escape closes it, which a menu that traps the page scroll really needs
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  /* Easings and timings kept short: this is a five-item menu, not a reveal.
     Under reduced motion everything collapses to an instant state change. */
  const ease = [0.22, 1, 0.36, 1] as const;
  const panel = {
    hidden: { opacity: 0, y: -10, scale: 0.97 },
    shown: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: reduce
        ? { duration: 0 }
        : { duration: 0.28, ease, staggerChildren: 0.035, delayChildren: 0.04 },
    },
    out: {
      opacity: 0,
      y: -8,
      scale: 0.98,
      transition: reduce ? { duration: 0 } : { duration: 0.18, ease },
    },
  };
  const item = {
    hidden: { opacity: 0, y: -6 },
    shown: { opacity: 1, y: 0 },
    out: { opacity: 0 },
  };

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-4 pt-3 sm:px-6 lg:px-8">
      {/* scrim sits first so the bar and the panel paint over it */}
      <AnimatePresence>
        {open && (
          <motion.button
            key="scrim"
            type="button"
            aria-label="Close menu"
            onClick={() => setOpen(false)}
            className="fixed inset-0 cursor-default bg-ink/15 backdrop-blur-[3px] lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduce ? 0 : 0.22, ease }}
          />
        )}
      </AnimatePresence>

      <div
        className={`relative mx-auto flex h-[60px] max-w-[1180px] items-center gap-8 rounded-full px-4 transition-all duration-300 sm:px-5 ${
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
          className="ml-auto grid h-10 w-10 place-items-center overflow-hidden rounded-full bg-surface text-ink lg:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
        >
          {/* the glyphs cross-fade and turn rather than swapping outright */}
          <AnimatePresence initial={false} mode="wait">
            <motion.span
              key={open ? "close" : "open"}
              className="grid place-items-center"
              initial={reduce ? false : { opacity: 0, rotate: -70, scale: 0.7 }}
              animate={{ opacity: 1, rotate: 0, scale: 1 }}
              exit={reduce ? { opacity: 1 } : { opacity: 0, rotate: 70, scale: 0.7 }}
              transition={{ duration: reduce ? 0 : 0.18, ease }}
            >
              {open ? <X size={20} /> : <List size={20} />}
            </motion.span>
          </AnimatePresence>
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            key="panel"
            variants={panel}
            initial="hidden"
            animate="shown"
            exit="out"
            style={{ transformOrigin: "top right" }}
            className="relative mx-auto mt-2 max-w-[1180px] rounded-[28px] bg-paper p-3 shadow-[var(--shadow-lift)] lg:hidden"
          >
            <nav className="flex flex-col">
              {NAV.map((n) => (
                <motion.a
                  key={n.href}
                  variants={item}
                  href={n.href}
                  onClick={() => setOpen(false)}
                  className="rounded-2xl px-4 py-3.5 text-[1.05rem] text-body transition-colors hover:bg-surface"
                >
                  {n.label}
                </motion.a>
              ))}
              <motion.a
                variants={item}
                href="#contact"
                onClick={() => setOpen(false)}
                className="btn btn-primary mt-2 justify-center"
              >
                Get a free layout
              </motion.a>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
