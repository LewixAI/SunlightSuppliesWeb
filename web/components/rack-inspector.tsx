"use client";

/**
 * Development harness. Four orthographic views of the rack at once, because a
 * three-quarter perspective hides exactly the faults that matter: a part that
 * floats a few centimetres, or sits on the wrong face, looks fine at an angle
 * and is obvious in elevation.
 *
 * Not linked from anywhere and not part of the site.
 */

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { STAGES, buildRack, type PartKind } from "@/lib/rack";
import { buildRackObject } from "@/lib/rack-three";

/**
 * World-space extents per component type, in millimetres.
 *
 * Eyeballing a render tells you something looks wrong; it does not tell you a
 * pallet sits 70 mm above the deck it is supposed to rest on. Numbers do.
 */
function measure(rack: ReturnType<typeof buildRackObject>) {
  const rows: string[] = [];
  const m = new THREE.Matrix4();
  const box = new THREE.Box3();
  const acc = new Map<string, THREE.Box3>();

  rack.group.updateWorldMatrix(true, true);
  rack.group.traverse((o) => {
    const mesh = o as THREE.InstancedMesh;
    if (!mesh.isInstancedMesh) return;
    const geo = mesh.geometry;
    geo.computeBoundingBox();
    const gb = geo.boundingBox!;
    for (let i = 0; i < mesh.count; i++) {
      mesh.getMatrixAt(i, m);
      m.premultiply(mesh.matrixWorld);
      box.copy(gb).applyMatrix4(m);
      // bucket by the level the part belongs to, to a centimetre
      const key = `${mesh.name}@${Math.round(box.min.y * 100) / 100}`;
      const prev = acc.get(key);
      if (prev) prev.union(box);
      else acc.set(key, box.clone());
    }
  });

  const sorted = [...acc.entries()].sort(
    (a, b) => a[1].min.y - b[1].min.y || a[0].localeCompare(b[0]),
  );
  for (const [key, b] of sorted) {
    const name = key.split("@")[0];
    rows.push(
      [
        name.padEnd(10),
        `y ${(b.min.y * 1000).toFixed(0).padStart(5)} .. ${(b.max.y * 1000).toFixed(0).padStart(5)}`,
        `x ${(b.min.x * 1000).toFixed(0).padStart(5)} .. ${(b.max.x * 1000).toFixed(0).padStart(5)}`,
        `z ${(b.min.z * 1000).toFixed(0).padStart(6)} .. ${(b.max.z * 1000).toFixed(0).padStart(6)}`,
      ].join("   "),
    );
  }
  return rows;
}

type View = {
  label: string;
  /** direction the camera sits in, from the model centre */
  dir: [number, number, number];
  up?: [number, number, number];
};

const VIEWS: View[] = [
  { label: "Elevation - along the run", dir: [1, 0, 0] },
  { label: "Section - across the depth", dir: [0, 0, 1] },
  { label: "Plan", dir: [0, 1, 0], up: [0, 0, -1] },
  { label: "Iso", dir: [0.7, 0.5, 0.7] },
];

function Panel({ view, bays }: { view: View; bays: number }) {
  const host = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = host.current;
    if (!el) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xffffff);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    el.appendChild(renderer.domElement);
    renderer.domElement.style.cssText = "display:block;width:100%;height:100%";

    const model = buildRack({ rows: 1, bays, load: 1 });
    const rack = buildRackObject(model);
    scene.add(rack.group);

    scene.add(new THREE.HemisphereLight(0xffffff, 0xbbbbbb, 2.2));
    const key = new THREE.DirectionalLight(0xffffff, 1.6);
    key.position.set(6, 10, 8);
    scene.add(key);
    const back = new THREE.DirectionalLight(0xffffff, 0.8);
    back.position.set(-6, 4, -8);
    scene.add(back);

    const box = new THREE.Box3().setFromObject(rack.group);
    const centre = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());

    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 500);
    const dir = new THREE.Vector3(...view.dir).normalize();
    if (view.up) camera.up.set(...view.up);

    // a grid on the floor gives an absolute reference for anything that floats
    const grid = new THREE.GridHelper(24, 24, 0xcccccc, 0xeeeeee);
    grid.position.y = 0;
    scene.add(grid);

    function fit() {
      const w = el!.clientWidth;
      const h = el!.clientHeight;
      if (!w || !h) return;
      renderer.setSize(w, h, false);

      // widest span the view could need, plus a margin
      const span = Math.max(size.x, size.y, size.z) * 0.56;
      const aspect = w / h;
      camera.left = -span * aspect;
      camera.right = span * aspect;
      camera.top = span;
      camera.bottom = -span;
      camera.near = 0.1;
      camera.far = 500;
      camera.position.copy(centre).addScaledVector(dir, 60);
      camera.lookAt(centre);
      camera.updateProjectionMatrix();
      renderer.render(scene, camera);
    }
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(el);

    return () => {
      ro.disconnect();
      rack.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, [view, bays]);

  return (
    <figure className="m-0">
      <figcaption className="mb-1 font-mono text-[11px] text-neutral-600">
        {view.label}
      </figcaption>
      <div
        ref={host}
        className="h-[46vh] w-full rounded border border-neutral-300 bg-white"
      />
    </figure>
  );
}

/**
 * Regression guard for the drop-in animation.
 *
 * The measurement table below is blind to this: it reads a rack that has had
 * revealAll() called on it, which rewrites every matrix from base and so
 * erases exactly the corruption worth hunting. This instead scrubs the build
 * back and forth the way a fast scroll does, then reveals everything and
 * checks each instance is back on its base matrix. Any drift means a part is
 * left shrunken and floating.
 */
function scrubCheck() {
  const model = buildRack({ rows: 1, bays: 3, load: 1 });
  const rack = buildRackObject(model);
  const order = STAGES.map((s) => s.key as PartKind);
  const totals = order.map((k) => model.counts[k]);

  const apply = (p: number) => {
    const span = 1 / STAGES.length;
    order.forEach((kind, i) => {
      const local = Math.max(0, Math.min(1, (p - i * span) / span));
      const n = local * totals[i];
      rack.reveal(kind, n, n - Math.floor(n));
    });
  };

  // deliberately jumpy, plus a fine sweep, then settle fully revealed
  for (const p of [0.9, 0.17, 0.62, 0.31, 0.99, 0.05, 0.44, 0.78]) apply(p);
  for (let i = 0; i <= 240; i++) apply(i / 240);
  order.forEach((kind, i) => rack.reveal(kind, totals[i], 0));

  let worst = 0;
  let offenders = 0;
  const a = new THREE.Matrix4();
  rack.group.traverse((o) => {
    const mesh = o as THREE.InstancedMesh & { userData: { base?: unknown } };
    if (!mesh.isInstancedMesh) return;
    const base = rack.baseMatrices(mesh);
    if (!base) return;
    for (let i = 0; i < mesh.count; i++) {
      mesh.getMatrixAt(i, a);
      let d = 0;
      for (let k = 0; k < 16; k++)
        d = Math.max(d, Math.abs(a.elements[k] - base[i].elements[k]));
      if (d > 1e-6) offenders++;
      worst = Math.max(worst, d);
    }
  });
  rack.dispose();
  return { offenders, worst };
}

function ScrubCheck() {
  const [result, setResult] = useState<string>("running");
  useEffect(() => {
    const r = scrubCheck();
    setResult(
      r.offenders === 0
        ? `PASS - every instance back on its base matrix after scrubbing (worst drift ${r.worst.toExponential(1)})`
        : `FAIL - ${r.offenders} instances left off their base matrix, worst drift ${r.worst.toFixed(4)}`,
    );
  }, []);
  return (
    <pre
      className={`rounded border p-3 font-mono text-[11px] ${
        result.startsWith("FAIL")
          ? "border-red-400 bg-red-50 text-red-800"
          : "border-neutral-300 bg-white text-neutral-800"
      }`}
    >
      {result}
    </pre>
  );
}

function Measurements() {
  const [rows, setRows] = useState<string[]>([]);
  useEffect(() => {
    const model = buildRack({ rows: 1, bays: 1, load: 1 });
    const rack = buildRackObject(model);
    setRows(measure(rack));
    rack.dispose();
  }, []);
  return (
    <pre className="overflow-x-auto rounded border border-neutral-300 bg-white p-3 font-mono text-[11px] leading-5 text-neutral-800">
      {rows.join("\n")}
    </pre>
  );
}

export default function RackInspector() {
  return (
    <main className="min-h-screen bg-neutral-100 p-4">
      <h1 className="mb-3 font-mono text-sm text-neutral-700">
        rack inspector - 2 bays, fully loaded
      </h1>
      <div className="mb-4">
        <p className="mb-1 font-mono text-[11px] text-neutral-600">
          Drop-in animation, scrubbed
        </p>
        <ScrubCheck />
      </div>
      <div className="mb-4">
        <p className="mb-1 font-mono text-[11px] text-neutral-600">
          Extents, millimetres - one bay, every part
        </p>
        <Measurements />
      </div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {VIEWS.map((v) => (
          <Panel key={v.label} view={v} bays={2} />
        ))}
      </div>
    </main>
  );
}
