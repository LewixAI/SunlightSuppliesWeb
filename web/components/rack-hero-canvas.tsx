"use client";

/**
 * Hero scene: two runs of selective pallet racking with a gangway between
 * them, erected once on load and then left to drift.
 *
 * Shot from the mouth of the aisle rather than side-on, because a single run
 * floating in space reads as a shelving unit. Standing in the gangway is what
 * gives the frames their six metres.
 *
 * The build-on-load is the point of the section, not decoration - it shows in
 * four seconds what the company actually does. Under reduced motion the rack
 * is simply there, fully built, and nothing moves.
 */

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { buildRack, STAGES } from "@/lib/rack";
import { buildRackObject, stage } from "@/lib/rack-three";

export default function RackHeroCanvas({
  className = "",
}: {
  className?: string;
}) {
  const host = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = host.current;
    if (!el) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(44, 1, 0.4, 400);
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    el.appendChild(renderer.domElement);
    renderer.domElement.style.cssText = "display:block;width:100%;height:100%";

    const model = buildRack({ rows: 2, bays: 6, aisle: 2900, load: 0.58 });
    const rack = buildRackObject(model);
    scene.add(rack.group);
    stage(renderer, scene, 11);

    /* The group is centred, so the gangway runs along x = 0 and the racking
       along z. Stand at the near mouth of it, a little off the centre line. */
    const halfRun = model.size.z * 0.0005;
    const eye = new THREE.Vector3(0.15, 2.05, halfRun + 6.2);
    const look = new THREE.Vector3(0.1, 2.45, -halfRun * 0.5);

    /** narrow viewports see less of the aisle, so step back out of it */
    const backOff = () => Math.max(0, 1.5 - camera.aspect) * 5;

    function fit() {
      const w = el!.clientWidth;
      const h = el!.clientHeight;
      if (!w || !h) return;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.position.copy(eye);
      camera.position.z += backOff();
      camera.lookAt(look);
      camera.updateProjectionMatrix();
    }
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(el);

    /* --- build-in ------------------------------------------------------- */
    const order = STAGES.map((s) => s.key);
    const totals = order.map((k) => model.counts[k]);
    const grand = totals.reduce((a, b) => a + b, 0);
    const BUILD_MS = 4200;

    function applyBuild(p: number) {
      let placed = p * grand;
      order.forEach((kind, i) => {
        const n = totals[i];
        const shown = Math.max(0, Math.min(n, placed));
        rack.reveal(kind, shown, shown - Math.floor(shown));
        placed -= n;
      });
    }

    if (reduce) rack.revealAll();
    else applyBuild(0);

    /* --- pointer parallax ----------------------------------------------- */
    const pointer = { x: 0, y: 0 };
    const eased = { x: 0, y: 0 };
    function onPointer(e: PointerEvent) {
      const r = el!.getBoundingClientRect();
      pointer.x = ((e.clientX - r.left) / r.width - 0.5) * 2;
      pointer.y = ((e.clientY - r.top) / r.height - 0.5) * 2;
    }
    if (!reduce)
      window.addEventListener("pointermove", onPointer, { passive: true });

    /* --- loop ------------------------------------------------------------ */
    let raf = 0;
    let visible = true;
    let t0 = 0;
    const at = new THREE.Vector3();

    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (visible && !raf) raf = requestAnimationFrame(tick);
      },
      { threshold: 0 },
    );
    io.observe(el);

    function tick(now: number) {
      raf = visible ? requestAnimationFrame(tick) : 0;
      if (!t0) t0 = now;
      const t = now - t0;

      if (!reduce) {
        const p = Math.min(1, t / BUILD_MS);
        applyBuild(p * p * (3 - 2 * p));

        eased.x += (pointer.x - eased.x) * 0.04;
        eased.y += (pointer.y - eased.y) * 0.04;

        // a slow creep down the gangway, plus the pointer nudging the look-at
        const creep = (1 - Math.cos(t * 0.00011)) * 1.35;
        camera.position.set(
          eye.x + eased.x * 0.42,
          eye.y - eased.y * 0.28,
          eye.z + backOff() - creep,
        );
        at.set(look.x - eased.x * 0.75, look.y - eased.y * 0.65, look.z - creep);
        camera.lookAt(at);
      }

      renderer.render(scene, camera);
    }
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      window.removeEventListener("pointermove", onPointer);
      rack.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  return <div ref={host} className={className} aria-hidden="true" />;
}
