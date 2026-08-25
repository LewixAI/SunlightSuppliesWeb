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
import { buildRackObject, fitDistance, stage } from "@/lib/rack-three";

/* The camera swings from a low near-elevation over the baseplates round to a
   three-quarter as the rack gains height. Distance is not on this path: it is
   measured from whatever has actually been placed, so stage one frames six
   baseplates rather than leaving them as specks in the middle of an empty
   card. */
const DIR_START = new THREE.Vector3(0.86, 0.16, 0.48).normalize();
const DIR_END = new THREE.Vector3(0.66, 0.3, 0.69).normalize();

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
    const camera = new THREE.PerspectiveCamera(34, 1, 0.4, 300);
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
    const staged = stage(renderer, scene, 8, 1.0, 0xf8f7f5);

    const order = STAGES.map((s) => s.key as PartKind);
    const totals = order.map((k) => model.counts[k]);
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

    /* Stages get equal shares of the scroll, which reads as steady work rather
       than a rush through the parts with many instances. */
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

    const dir = new THREE.Vector3();
    const fill = new THREE.Vector3();
    let dist = 12;
    let framed = false;

    /** Fit to the parts placed so far, not to the finished rack. */
    function placeCamera(p: number, dt: number) {
      const e = Math.max(0, Math.min(1, p));
      dir.copy(DIR_START).lerp(DIR_END, e * e * (3 - 2 * e)).normalize();

      // instanced bounds cache against the draw count, so clear it or the
      // measurement is of the whole rack from the first frame
      rack.group.traverse((o) => {
        const mesh = o as THREE.InstancedMesh;
        if (mesh.isInstancedMesh) mesh.boundingBox = null;
      });
      /* Crop along the run early on. Framing the whole 11 m footprint while
         only the baseplates are down makes them ten pixels wide; opening the
         crop as the rack grows keeps every stage readable at its own scale. */
      fill.set(0.97, 0.99, Math.min(1, 0.3 + e * 1.15));
      const f = fitDistance(rack.group, camera, dir, fill, 1.12);

      if (Number.isFinite(f.distance) && f.distance > 0.5) {
        /* Damped so the frame eases open as the rack grows rather than
           snapping. Rate is per second, so it behaves the same at any frame
           rate; the first fit snaps so nothing starts off screen. */
        const k = framed ? smooth(dt, 7) : 1;
        dist += (f.distance - dist) * k;
        staged.setFogRange(dist);
        target.lerp(f.centre, k);
        framed = true;
      }
      camera.position.copy(dir).multiplyScalar(dist).add(target);
      camera.lookAt(target);
    }

    /* Same reasoning as the hero: with the document hidden nothing ticks, so
       show the finished rack rather than an empty card. */
    if (reduce || document.hidden) {
      rack.revealAll();
      placeCamera(1, 1);
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
    let lastT = 0;

    /* Exponential smoothing per SECOND, not per frame. A fixed per-frame
       fraction converges twice as fast on a 120 Hz display and crawls when the
       tab is throttled in the background. */
    const smooth = (dt: number, rate: number) => 1 - Math.exp(-dt * rate);

    function tick(now: number) {
      raf = visible ? requestAnimationFrame(tick) : 0;
      const dt = lastT ? Math.min(0.1, (now - lastT) / 1000) : 1 / 60;
      lastT = now;

      /* Scroll progress straight off the section's rect. One layout read a
         frame inside a loop that is already running, and no scroll listener. */
      const rect = section!.getBoundingClientRect();
      const travel = rect.height - window.innerHeight;
      progress.current =
        travel > 0 ? Math.max(0, Math.min(1, -rect.top / travel)) : 0;

      shown += (progress.current - shown) * smooth(dt, 9);
      const counts = applyStages(shown);
      placeCamera(shown, dt);

      const idx = Math.min(STAGES.length - 1, Math.floor(shown * STAGES.length));
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
      <div className="sticky top-0 flex h-[100dvh] items-center overflow-hidden pt-[76px]">
        <div className="mx-auto grid w-full max-w-[1180px] grid-cols-1 items-center gap-6 px-4 sm:px-6 lg:grid-cols-12 lg:gap-10 lg:px-8">
          {/* the rack keeps its own soft stage; the copy sits beside it rather
              than on top, so nothing needs a scrim to stay readable */}
          <div className="surface overflow-hidden lg:col-span-7 lg:col-start-6 lg:row-start-1">
            <div
              ref={host}
              className="h-[26dvh] w-full lg:h-[68dvh]"
              aria-hidden="true"
            />
          </div>

          <div className="lg:col-span-5 lg:col-start-1 lg:row-start-1">
            <h2 className="t-h2 mb-5 max-w-[16ch] text-balance">
              Six stages, one component count.
            </h2>

            <ol className="mb-6">
              {STAGES.map((s, i) => {
                const on = i === stageIndex;
                const done = i < stageIndex;
                return (
                  <li
                    key={s.key}
                    className={`flex items-baseline gap-4 rounded-2xl px-4 py-2 transition-colors duration-300 lg:py-2.5 ${
                      on ? "bg-tint-warm" : ""
                    }`}
                  >
                    <span
                      className={`t-num w-5 text-[0.8rem] ${
                        on ? "font-semibold text-ink" : "text-faint"
                      }`}
                    >
                      {i + 1}
                    </span>
                    <span
                      className={`flex-1 text-[1rem] transition-colors duration-300 ${
                        on
                          ? "font-medium text-ink"
                          : done
                            ? "text-body"
                            : "text-faint"
                      }`}
                    >
                      {s.title}
                    </span>
                    <span
                      className={`t-num text-[0.9rem] ${on ? "text-ink" : "text-faint"}`}
                    >
                      {placed[i] ?? 0}
                    </span>
                  </li>
                );
              })}
            </ol>

            <div key={current.key} className="rise px-4">
              <p className="t-body text-[1rem]">{current.note}</p>
              <div className="mt-5 flex flex-wrap items-center gap-2.5">
                <span className="t-num rounded-full bg-surface px-3.5 py-1.5 text-[0.85rem] font-medium text-ink">
                  {current.spec}
                </span>
                <span className="t-num text-[0.85rem] text-muted">
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
