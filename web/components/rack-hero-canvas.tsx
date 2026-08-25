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
import { buildRackObject, fitDistance, stage } from "@/lib/rack-three";

const DIR = new THREE.Vector3(0.62, 0.28, 0.73).normalize();

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

    // two runs with a gangway: the hero card is panoramic, and a single run
    // leaves most of that width empty
    const model = buildRack({ rows: 2, bays: 5, aisle: 2600, load: 0.6 });
    const rack = buildRackObject(model);
    scene.add(rack.group);
    stage(renderer, scene, 9, 1.0, 0xf8f7f5);

    const target = new THREE.Vector3();
    let dist = 20;

    function fit() {
      const w = el!.clientWidth;
      const h = el!.clientHeight;
      if (!w || !h) return;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      // 0.6 lets the ends of the run and the near baseplates crop, which is
      // what makes it fill a panoramic card instead of sitting in the middle
      const f = fitDistance(rack.group, camera, DIR, 0.72);
      dist = f.distance;
      target.copy(f.centre);
      camera.position.copy(DIR).multiplyScalar(dist).add(target);
      camera.lookAt(target);
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
    /* The listener is on the window but the reading is normalised against the
       CARD, so a cursor sitting well above or below it produces values far
       outside -1..1 - scroll the card toward the bottom of the viewport with
       the pointer up by the nav and it reaches -8 or worse. Clamping is what
       keeps the camera from being flung into a top-down view. */
    const clamp = (v: number) => Math.max(-1, Math.min(1, v));
    const pointer = { x: 0, y: 0 };
    const eased = { x: 0, y: 0 };
    function onPointer(e: PointerEvent) {
      const r = el!.getBoundingClientRect();
      if (!r.height || !r.width) return;
      pointer.x = clamp(((e.clientX - r.left) / r.width - 0.5) * 2);
      pointer.y = clamp(((e.clientY - r.top) / r.height - 0.5) * 2);
    }
    if (!reduce)
      window.addEventListener("pointermove", onPointer, { passive: true });

    /* --- loop ------------------------------------------------------------ */
    let raf = 0;
    let visible = true;
    let t0 = 0;
    let last = 0;
    const up = new THREE.Vector3(0, 1, 0);
    const pitchAxis = new THREE.Vector3().crossVectors(DIR, up).normalize();

    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (visible && !raf) {
          // the clock is paused while the card is off screen, so carry the
          // elapsed time across the gap rather than letting the drift jump
          t0 += performance.now() - last;
          raf = requestAnimationFrame(tick);
        }
      },
      { threshold: 0 },
    );
    io.observe(el);

    function tick(now: number) {
      raf = visible ? requestAnimationFrame(tick) : 0;
      if (!t0) t0 = now;
      last = now;
      const t = now - t0;

      if (!reduce) {
        const p = Math.min(1, t / BUILD_MS);
        applyBuild(p * p * (3 - 2 * p));

        eased.x += (pointer.x - eased.x) * 0.04;
        eased.y += (pointer.y - eased.y) * 0.04;

        const swing = Math.sin(t * 0.00013) * 0.16 + eased.x * 0.1;
        // vertical parallax as a small tilt about the view's own horizontal
        // axis, so the framing distance is preserved. Raising camera.position.y
        // directly moved the camera further away as well as higher.
        const pitch = eased.y * -0.05;
        camera.position
          .copy(DIR)
          .applyAxisAngle(up, swing)
          .applyAxisAngle(pitchAxis, pitch)
          .multiplyScalar(dist)
          .add(target);
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
