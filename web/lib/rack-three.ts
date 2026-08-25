/**
 * The rack, in three.js.
 *
 * Consumes `buildRack()` and returns one InstancedMesh per component type,
 * every instance emitted in erection order. Revealing the rack is therefore
 * just a draw count, which is why the build animation costs nothing per frame.
 *
 * Colours are taken from their own installation photography: cobalt uprights,
 * safety-orange beams, chipboard decking, galvanised baseplates.
 */

import * as THREE from "three";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import { SECTION, type PartKind, type RackModel } from "./rack";

const MM = 0.001; // millimetres to metres

export const COLOURS = {
  /* Softened a step from the harsh industrial livery in their photos: same
     cobalt and safety orange, a little lighter and much less metallic, so the
     rack reads as a friendly object in a bright room rather than plant. */
  upright: 0x3565cf,
  brace: 0x2f5cc4,
  beam: 0xf2870f,
  baseplate: 0xb9bec4,
  deck: 0xd7b078,
  pallet: 0xbe8f58,
  load: 0xe4ddd2,
  ground: 0xf0ede8,
};

/* --- geometry ------------------------------------------------------------ */

/** Rounded rectangle cross-section, extruded. Reads as cold-rolled steel. */
function profile(w: number, d: number, r: number) {
  const s = new THREE.Shape();
  const x = -w / 2;
  const y = -d / 2;
  s.moveTo(x + r, y);
  s.lineTo(x + w - r, y);
  s.quadraticCurveTo(x + w, y, x + w, y + r);
  s.lineTo(x + w, y + d - r);
  s.quadraticCurveTo(x + w, y + d, x + w - r, y + d);
  s.lineTo(x + r, y + d);
  s.quadraticCurveTo(x, y + d, x, y + d - r);
  s.lineTo(x, y + r);
  s.quadraticCurveTo(x, y, x + r, y);
  return s;
}

function uprightGeometry(height: number) {
  const g = new THREE.ExtrudeGeometry(
    profile(SECTION.colW * MM, SECTION.colD * MM, 0.008),
    { depth: height * MM, bevelEnabled: false, curveSegments: 3 },
  );
  // Extrude runs 0..depth along local +Z, and rotateX(-90) maps local +Z onto
  // world +Y. So after standing it up the column spans y 0..height and has to
  // come DOWN half its height to sit on its own centre, which is where the
  // instance matrix expects it.
  g.rotateX(-Math.PI / 2);
  g.translate(0, (-height * MM) / 2, 0);
  g.computeVertexNormals();
  return g;
}

/** Box beam with the step ledge that carries the decking. */
function beamGeometry(len: number) {
  const w = SECTION.beamW * MM;
  const h = SECTION.beamH * MM;
  const lip = 0.028;
  const s = new THREE.Shape();
  s.moveTo(-w / 2, -h / 2);
  s.lineTo(w / 2, -h / 2);
  s.lineTo(w / 2, h / 2 - lip);
  s.lineTo(w / 2 + lip, h / 2 - lip);
  s.lineTo(w / 2 + lip, h / 2);
  s.lineTo(-w / 2, h / 2);
  s.closePath();
  const g = new THREE.ExtrudeGeometry(s, {
    depth: len * MM,
    bevelEnabled: false,
  });
  g.translate(0, 0, (-len * MM) / 2);
  g.computeVertexNormals();
  return g;
}

/** A stringer pallet, merged into one geometry. */
function palletGeometry() {
  const w = SECTION.palletW * MM;
  const d = SECTION.palletD * MM;
  const boardT = 0.018;
  const stringerH = 0.09;
  const geos: THREE.BufferGeometry[] = [];

  for (let i = 0; i < 6; i++) {
    const g = new THREE.BoxGeometry(d, boardT, w / 7.2);
    g.translate(0, stringerH + boardT / 2, -w / 2 + (w / 5.6) * i + w / 14);
    geos.push(g);
  }
  for (let i = 0; i < 3; i++) {
    const g = new THREE.BoxGeometry(d * 0.14, stringerH, w);
    g.translate((d / 2 - d * 0.07) * (i - 1), stringerH / 2, 0);
    geos.push(g);
  }
  for (let i = 0; i < 3; i++) {
    const g = new THREE.BoxGeometry(d, boardT, w / 8);
    g.translate(0, boardT / 2, (w / 2 - w / 16) * (i - 1));
    geos.push(g);
  }
  return mergeGeometries(geos, false)!;
}

/** Stretch-wrapped load block sitting on the pallet. */
function loadGeometry() {
  const h = 0.66;
  const g = new THREE.BoxGeometry(
    SECTION.palletD * MM * 0.9,
    h,
    SECTION.palletW * MM * 0.86,
  );
  g.translate(0, SECTION.palletH * MM * 0.5 + h / 2, 0);
  return g;
}

/* --- textures ------------------------------------------------------------ */

/** Column slot perforations, drawn once into a canvas and tiled up the height. */
function slotTexture(base: string) {
  if (typeof document === "undefined") return null;
  const c = document.createElement("canvas");
  c.width = 32;
  c.height = 64;
  const ctx = c.getContext("2d")!;
  ctx.fillStyle = base;
  ctx.fillRect(0, 0, 32, 64);
  ctx.fillStyle = "rgba(0,0,0,0.3)";
  ctx.fillRect(11, 8, 10, 20);
  ctx.fillRect(11, 40, 10, 16);
  const t = new THREE.CanvasTexture(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(1, 26);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 4;
  return t;
}

/* --- assembly ------------------------------------------------------------ */

export interface RackParts {
  group: THREE.Group;
  /** draw-count control, per component type */
  reveal(kind: PartKind, shown: number, frontier: number): void;
  revealAll(): void;
  dispose(): void;
  counts: Record<PartKind, number>;
}

type Bucket = {
  mesh: THREE.InstancedMesh;
  base: THREE.Matrix4[];
  total: number;
};

export function buildRackObject(model: RackModel): RackParts {
  const group = new THREE.Group();
  const S = SECTION;
  const { depth, height, bay } = model.spec;

  const steel = (color: number, map: THREE.Texture | null = null) =>
    new THREE.MeshStandardMaterial({
      color,
      map,
      metalness: 0.22,
      roughness: 0.5,
    });

  const geo: Record<string, THREE.BufferGeometry> = {
    baseplate: new THREE.BoxGeometry(S.baseW * MM, S.baseH * MM, S.baseD * MM),
    upright: uprightGeometry(height),
    brace: new THREE.BoxGeometry(1, S.braceT * MM, S.braceW * MM),
    beam: beamGeometry(bay),
    deck: new THREE.BoxGeometry(
      depth * MM * 0.98,
      S.deckT * MM,
      (bay / S.decksPerBay) * MM * 0.97,
    ),
    pallet: palletGeometry(),
    load: loadGeometry(),
  };

  const mat: Record<string, THREE.Material> = {
    baseplate: new THREE.MeshStandardMaterial({
      color: COLOURS.baseplate,
      metalness: 0.3,
      roughness: 0.55,
    }),
    upright: steel(COLOURS.upright, slotTexture("#3565cf")),
    brace: steel(COLOURS.brace),
    beam: steel(COLOURS.beam),
    deck: new THREE.MeshStandardMaterial({
      color: COLOURS.deck,
      metalness: 0,
      roughness: 0.94,
    }),
    pallet: new THREE.MeshStandardMaterial({
      color: COLOURS.pallet,
      metalness: 0,
      roughness: 0.88,
    }),
    load: new THREE.MeshStandardMaterial({
      color: COLOURS.load,
      metalness: 0,
      roughness: 0.82,
    }),
  };

  const buckets = new Map<PartKind, Bucket[]>();
  const dummy = new THREE.Object3D();

  const add = (kind: PartKind, geoKey: string, matKey: string) => {
    const list = model.parts[kind];
    const mesh = new THREE.InstancedMesh(geo[geoKey], mat[matKey], list.length);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    mesh.frustumCulled = false;
    const base: THREE.Matrix4[] = [];

    list.forEach((p, i) => {
      dummy.position.set(p.x * MM, p.y * MM, p.z * MM);
      dummy.rotation.set(0, p.ry ?? 0, 0);
      dummy.scale.set(1, 1, 1);
      if (kind === "brace") {
        dummy.rotation.set(0, 0, p.rx ?? 0);
        dummy.scale.set((p.len ?? 1) * MM, 1, 1);
      }
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
      base.push(dummy.matrix.clone());
    });
    mesh.instanceMatrix.needsUpdate = true;
    group.add(mesh);

    const arr = buckets.get(kind) ?? [];
    arr.push({ mesh, base, total: list.length });
    buckets.set(kind, arr);
  };

  add("baseplate", "baseplate", "baseplate");
  add("upright", "upright", "upright");
  add("brace", "brace", "brace");
  add("beam", "beam", "beam");
  add("deck", "deck", "deck");
  add("pallet", "pallet", "pallet");
  add("pallet", "load", "load"); // second bucket, same placements

  // centre the whole run on the origin so the camera can orbit it cleanly
  group.position.set(
    (-model.size.x * MM) / 2,
    0,
    (-model.size.z * MM) / 2,
  );

  const tmp = new THREE.Matrix4();
  const pos = new THREE.Vector3();
  const quat = new THREE.Quaternion();
  const scl = new THREE.Vector3();

  function reveal(kind: PartKind, shown: number, frontier: number) {
    for (const b of buckets.get(kind) ?? []) {
      const full = Math.max(0, Math.min(b.total, Math.floor(shown)));
      const hasFrontier = frontier > 0.001 && full < b.total;
      b.mesh.count = full + (hasFrontier ? 1 : 0);
      if (hasFrontier) {
        // the piece being placed drops the last few centimetres into position
        const t = Math.min(1, frontier);
        const e = 1 - Math.pow(1 - t, 3);
        b.base[full].decompose(pos, quat, scl);
        tmp.compose(
          pos.clone().setY(pos.y + (1 - e) * 0.55),
          quat,
          scl.clone().multiplyScalar(0.55 + 0.45 * e),
        );
        b.mesh.setMatrixAt(full, tmp);
        b.mesh.instanceMatrix.needsUpdate = true;
      }
    }
  }

  function revealAll() {
    for (const arr of buckets.values())
      for (const b of arr) {
        b.mesh.count = b.total;
        b.base.forEach((m, i) => b.mesh.setMatrixAt(i, m));
        b.mesh.instanceMatrix.needsUpdate = true;
      }
  }

  function dispose() {
    Object.values(geo).forEach((g) => g.dispose());
    Object.values(mat).forEach((m) => {
      const std = m as THREE.MeshStandardMaterial;
      std.map?.dispose();
      m.dispose();
    });
    for (const arr of buckets.values()) for (const b of arr) b.mesh.dispose();
  }

  revealAll();

  return { group, reveal, revealAll, dispose, counts: model.counts };
}

/* --- staging ------------------------------------------------------------- */

/**
 * Lights, ground and tone mapping shared by both scenes.
 *
 * A bright, soft room rather than a warehouse at night: high fill, one gentle
 * key with a wide soft shadow, and fog that dissolves the ground into the page
 * colour instead of into black. `paper` is the surface the canvas sits on, so
 * the scene never shows an edge where the floor stops.
 */
export function stage(
  renderer: THREE.WebGLRenderer,
  scene: THREE.Scene,
  extent: number,
  exposure = 1.0,
  paper = 0xf8f7f5,
) {
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = exposure;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFShadowMap;

  // Far enough back that it only ever eats the floor running off to the
  // horizon. Pulled in close it washes the whole subject toward the page
  // colour, which is what a soft palette makes hard to notice.
  scene.fog = new THREE.Fog(paper, extent * 3.2, extent * 9);

  // sky above, warm bounce off the floor. Most of the light in the scene.
  const hemi = new THREE.HemisphereLight(0xf4f8ff, 0xe8dfd2, 1.45);
  scene.add(hemi);

  const key = new THREE.DirectionalLight(0xfff6ea, 3.1);
  key.position.set(extent * 0.6, extent * 1.25, extent * 0.75);
  key.castShadow = true;
  key.shadow.mapSize.set(2048, 2048);
  key.shadow.bias = -0.0009;
  key.shadow.normalBias = 0.025;
  key.shadow.radius = 3;
  const d = extent * 0.95;
  Object.assign(key.shadow.camera, {
    left: -d,
    right: d,
    top: d,
    bottom: -d,
    near: 0.5,
    far: extent * 4,
  });
  key.shadow.camera.updateProjectionMatrix();
  scene.add(key);

  // two soft fills so nothing goes muddy on the shadow side
  const fillWarm = new THREE.DirectionalLight(0xffe6c8, 0.6);
  fillWarm.position.set(-extent, extent * 0.55, -extent * 0.6);
  scene.add(fillWarm);

  const fillCool = new THREE.DirectionalLight(0xdfe9ff, 0.5);
  fillCool.position.set(-extent * 0.5, extent * 0.3, extent);
  scene.add(fillCool);

  const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(extent * 26, extent * 26),
    new THREE.MeshStandardMaterial({
      color: paper,
      roughness: 0.96,
      metalness: 0,
    }),
  );
  ground.rotation.x = -Math.PI / 2;
  ground.receiveShadow = true;
  scene.add(ground);

  return { key, fillWarm, fillCool, hemi, ground };
}
