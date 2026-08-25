"use client";

/**
 * The rack going up, tied to the scrollbar.
 *
 * Motivation, not decoration: a racking quotation is a component count, and
 * most buyers have never seen what that count is made of. Scrolling walks the
 * six stages a crew actually works through, and the readout counts the parts
 * as they land - the same numbers that would appear on the quotation.
 *
 * Scroll progress drives a ref, never React state. The only re-render is when
 * the stage index changes, six times over the whole section.
 */

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { buildRack, STAGES, type PartKind } from "@/lib/rack";
import { buildRackObject, stage } from "@/lib/rack-three";

type Key = { dir: THREE.Vector3; radius: number; y: number };

const PATH: Key[] = [
  { dir: new THREE.Vector3(0.8, 0.08, 0.6), radius: 5.0, y: 0.3 },
  { dir: new THREE.Vector3(0.72, 0.13, 0.68), radius: 8.6, y: 1.7 },
  { dir: new THREE.Vector3(0.52, 0.16, 0.84), radius: 10.4, y: 2.4 },
  { dir: new THREE.Vector3(0.68, 0.19, 0.7), radius: 11.4, y: 2.7 },
  { dir: new THREE.Vector3(0.82, 0.17, 0.55), radius: 11.0, y: 2.8 },
  { dir: new THREE.Vector3(0.62, 0.22, 0.75), radius: 13.0, y: 2.9 },
];
PATH.forEach((k) => k.dir.normalize());

export default function BuildSequence() {
  const wrap = useRef<HTMLDivElement>(null);
  const host = useRef<HTMLDivElement>(null);
  const progress = useRef(0);
  const [stageIndex, setStageIndex] = useState(0);
  const [placed, setPlaced] = useState<number[]>(() => STAGES.map(() => 0));
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const el = host.current;
    const section = wrap.current;
    if (!el || !section) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setReduced(reduce);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(36, 1, 0.4, 400);
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    el.appendChild(renderer.domElement);
    renderer.domElement.style.cssText = "display:block;width:100%;height:100%";

    const model = buildRack({ rows: 1, bays: 4, load: 0.8 });
    const rack = buildRackObject(model);
    scene.add(rack.group);
    stage(renderer, scene, 8, 1.02);

    const order = STAGES.map((s) => s.key as PartKind);
    const totals = order.map((k) => model.counts[k]);
    const grand = totals.reduce((a, b) => a + b, 0);
    const target = new THREE.Vector3(0, 1.6, 0);

    function fit() {
      const w = el!.clientWidth;
      const h = el!.clientHeight;
      if (!w || !h) return;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    }
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(el);

    /* Stages get equal shares of the scroll, which reads as steady work
       rather than a rush through the parts with many instances. */
    function applyStages(p: number) {
      const span = 1 / STAGES.length;
      const counts: number[] = [];
      order.forEach((kind, i) => {
        const local = Math.max(0, Math.min(1, (p - i * span) / span));
        const shown = local * totals[i];
        rack.reveal(kind, shown, shown - Math.floor(shown));
        counts.push(Math.floor(shown));
      });
      return counts;
    }

    function placeCamera(p: number) {
      const f = Math.max(0, Math.min(0.9999, p)) * (PATH.length - 1);
      const i = Math.floor(f);
      const t = f - i;
      const e = t * t * (3 - 2 * t);
      const a = PATH[i];
      const b = PATH[Math.min(PATH.length - 1, i + 1)];
      const dir = a.dir.clone().lerp(b.dir, e).normalize();
      const radius = a.radius + (b.radius - a.radius) * e;
      const spread = 5.6 / Math.min(1.5, camera.aspect);
      target.set(0, a.y + (b.y - a.y) * e, 0);
      camera.position
        .copy(dir)
        .multiplyScalar(radius + spread)
        .add(target);
      camera.lookAt(target);
    }

    if (reduce) {
      rack.revealAll();
      placeCamera(1);
      setPlaced(totals);
      setStageIndex(STAGES.length - 1);
      renderer.render(scene, camera);
      return () => {
        ro.disconnect();
        rack.dispose();
        renderer.dispose();
        renderer.domElement.remove();
      };
    }

    let raf = 0;
    let visible = false;
    let lastStage = -1;
    let lastCounts = "";
    let shown = 0;

    function tick() {
      raf = visible ? requestAnimationFrame(tick) : 0;

      /* Scroll progress straight off the section's rect. One layout read a
         frame inside a loop that is already running, and no scroll listener. */
      const rect = section!.getBoundingClientRect();
      const travel = rect.height - window.innerHeight;
      progress.current =
        travel > 0 ? Math.max(0, Math.min(1, -rect.top / travel)) : 0;

      const p = progress.current;
      shown += (p - shown) * 0.14;
      const counts = applyStages(shown);
      placeCamera(shown);

      const idx = Math.min(
        STAGES.length - 1,
        Math.floor(shown * STAGES.length),
      );
      if (idx !== lastStage) {
        lastStage = idx;
        setStageIndex(idx);
      }
      const key = counts.join(",");
      if (key !== lastCounts) {
        lastCounts = key;
        setPlaced(counts);
      }
      renderer.render(scene, camera);
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (visible && !raf) raf = requestAnimationFrame(tick);
      },
      { threshold: 0 },
    );
    io.observe(section);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      rack.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  const current = STAGES[stageIndex];
  const total = placed.reduce((a, b) => a + b, 0);

  return (
    <section
      id="build"
      ref={wrap}
      className="relative"
      style={{ height: reduced ? "auto" : "600vh" }}
    >
      <div className="sticky top-0 flex h-[100dvh] flex-col overflow-hidden">
        {/* Narrow screens split the section rather than overlaying it: steel is
            busy, and six lines of small type will not hold on top of it. */}
        <div
          ref={host}
          className="h-[34dvh] shrink-0 md:absolute md:inset-0 md:h-auto"
          aria-hidden="true"
        />

        <div className="pointer-events-none absolute inset-x-0 top-[22dvh] h-[12dvh] bg-gradient-to-b from-transparent to-ink md:inset-0 md:top-0 md:h-full md:w-[50rem] md:bg-gradient-to-r md:from-ink md:from-45% md:via-ink/92 md:via-72% md:to-transparent" />

        <div className="relative mx-auto flex w-full max-w-[1400px] flex-1 flex-col justify-center px-6 pb-10 md:pb-0 lg:px-10">
          <div className="max-w-[27rem]">
            <h2 className="t-h2 mb-4 max-w-[16ch] text-balance md:mb-5">
              Six stages, one component count.
            </h2>

            <ol className="mb-6 space-y-px md:mb-8">
              {STAGES.map((s, i) => {
                const on = i === stageIndex;
                const done = i < stageIndex;
                return (
                  <li
                    key={s.key}
                    className={`flex items-baseline gap-4 border-l-2 py-1.5 pl-4 transition-colors duration-300 md:py-2 ${
                      on
                        ? "border-accent"
                        : done
                          ? "border-line-strong"
                          : "border-line"
                    }`}
                  >
                    <span
                      className={`t-num text-xs ${on ? "text-accent" : done ? "text-text-2" : "text-text-3"}`}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span
                      className={`flex-1 text-[0.95rem] transition-colors duration-300 ${
                        on
                          ? "text-text"
                          : done
                            ? "text-text-2"
                            : "text-text-3"
                      }`}
                    >
                      {s.title}
                    </span>
                    <span className="t-num text-xs text-text-3">
                      {placed[i] ?? 0}
                    </span>
                  </li>
                );
              })}
            </ol>

            <div key={current.key} className="rise">
              <p className="t-body text-[0.98rem]">{current.note}</p>
              <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-2">
                <span className="t-num text-sm text-accent">{current.spec}</span>
                <span className="t-num text-sm text-text-3">
                  {total} parts placed
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
