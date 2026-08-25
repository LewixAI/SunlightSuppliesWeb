"use client";

/**
 * Hero scene: one run of selective pallet racking, erected on load and then
 * left turning gently.
 *
 * Presented as an object on a soft light ground rather than an environment you
 * stand inside. The dark aisle version read as industrial plant; this reads as
 * something on a table, which is the tone the rest of the page is in.
 *
 * The build-on-load is the point, not decoration - it shows in four seconds
 * what the company actually does. Under reduced motion the rack is simply
 * there, fully built, and nothing moves.
 */

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { buildRack, STAGES } from "@/lib/rack";
import { buildRackObject, stage } from "@/lib/rack-three";

const DIR = new THREE.Vector3(0.62, 0.26, 0.74).normalize();
/** bounding radius of the run, metres, used to frame at any aspect */
const R = 4.85;

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
    const camera = new THREE.PerspectiveCamera(32, 1, 0.4, 300);
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    el.appendChild(renderer.domElement);
    renderer.domElement.style.cssText = "display:block;width:100%;height:100%";

    const model = buildRack({ rows: 1, bays: 4, load: 0.55 });
    const rack = buildRackObject(model);
    scene.add(rack.group);
    stage(renderer, scene, 9, 1.0, 0xf8f7f5);

    const target = new THREE.Vector3(0, 2.75, 0);

    /** distance that fits the run whichever way the card is shaped */
    function distance() {
      const vHalf = THREE.MathUtils.degToRad(camera.fov / 2);
      const hHalf = Math.atan(Math.tan(vHalf) * camera.aspect);
      return (R / Math.sin(Math.min(vHalf, hHalf))) * 1.02;
    }

    function fit() {
      const w = el!.clientWidth;
      const h = el!.clientHeight;
      if (!w || !h) return;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.position.copy(DIR).multiplyScalar(distance()).add(target);
      camera.lookAt(target);
      camera.updateProjectionMatrix();
    }
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(el);

    /* --- build-in ------------------------------------------------------- */
    const order = STAGES.map((s) => s.key);
    const totals = order.map((k) => model.counts[k]);
    const grand = totals.reduce((a, b) => a + b, 0);
    const BUILD_MS = 4000;

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
    const up = new THREE.Vector3(0, 1, 0);

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

        const swing = Math.sin(t * 0.00013) * 0.16 + eased.x * 0.1;
        camera.position
          .copy(DIR)
          .applyAxisAngle(up, swing)
          .multiplyScalar(distance())
          .add(target);
        camera.position.y += eased.y * -0.9;
        camera.lookAt(target);
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
