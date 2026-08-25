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

/* Shallow three-quarter, close to an elevation. A steep 3/4 throws the run
   away into depth, so its 22 m maps to only a third of a panoramic card; from
   nearly side-on the length maps to the width, which is what fills it. */
/* Enough elevation that an empty deck reads as a surface. Seen edge-on from a
   level camera a 25 mm panel is a hairline floating in the bay, which looks
   exactly like a modelling fault even though the geometry is right. */
const DIR = new THREE.Vector3(0.93, 0.24, 0.27).normalize();

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
        /* A very long lens, standing well back. Any wider and one end of a 22 m
       run is visibly larger than the other, so the whole thing reads as a
       trapezoid rather than a straight run of racking. At 12 degrees the
       projection is close enough to orthographic that the bays stay even, and
       there is still enough perspective to see it is a solid object. */
    const camera = new THREE.PerspectiveCamera(12, 1, 0.4, 600);
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    el.appendChild(renderer.domElement);
    renderer.domElement.style.cssText = "display:block;width:100%;height:100%";

    /* One long run rather than two. The card is roughly 4.4:1, so the run has
       to be long enough to match those proportions; and at this shallow an
       angle a second row would simply hide behind the first. */
    const model = buildRack({ rows: 1, bays: 8, load: 0.88 });
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
      /* Nearly the whole box. The aggressive fill factor was only needed for a
         steep three-quarter, where the near bottom corner dominates; from close
         to level that corner is unremarkable and cropping just loses the top
         beam level. */
      const f = fitDistance(rack.group, camera, DIR, 0.97);
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

    /* The erection runs once. Without this, scrolling away and back restarts
       it and the card sits empty for a moment before anything appears. */
    let built = false;
    /* Nothing animates while the document is hidden, because rAF does not
       fire. Mounting in a background tab, an embedded preview or a throttled
       pane would otherwise leave the card empty until something happened to
       wake it, so in that case the rack simply starts finished. */
    if (reduce || document.hidden) {
      rack.revealAll();
      built = true;
    } else {
      applyBuild(0);
    }

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
    let lastT = 0;
    /* per second, not per frame, so the parallax feels the same at any rate */
    const smooth = (dt: number, rate: number) => 1 - Math.exp(-dt * rate);
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
      const dt = lastT ? Math.min(0.1, (now - lastT) / 1000) : 1 / 60;
      lastT = now;
      last = now;
      const t = now - t0;

      if (!reduce) {
        if (!built) {
          const p = Math.min(1, t / BUILD_MS);
          applyBuild(p * p * (3 - 2 * p));
          if (p >= 1) built = true;
        }

        const k = smooth(dt, 2.6);
        eased.x += (pointer.x - eased.x) * k;
        eased.y += (pointer.y - eased.y) * k;

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
    // paint once up front so the card is never an empty rectangle
    renderer.render(scene, camera);
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
