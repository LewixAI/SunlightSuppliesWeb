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

/**
 * A block pallet, merged into one geometry.
 *
 * Modelled with its origin at the UNDERSIDE, so an instance placed at deck
 * height rests on the deck. Total height is SECTION.palletH exactly - board,
 * block, board - because the load sits on top of it by that number.
 */
function palletGeometry() {
  const w = SECTION.palletW * MM; // along the run
  const d = SECTION.palletD * MM; // across the depth
  const board = SECTION.palletBoard * MM;
  const block = SECTION.palletBlock * MM;
  const geos: THREE.BufferGeometry[] = [];

  // three bottom boards, the outer two flush with the ends
  const bw = w / 8;
  for (let i = 0; i < 3; i++) {
    const g = new THREE.BoxGeometry(d, board, bw);
    g.translate(0, board / 2, (w / 2 - bw / 2) * (i - 1));
    geos.push(g);
  }

  // three blocks running the full length
  for (let i = 0; i < 3; i++) {
    const g = new THREE.BoxGeometry(d * 0.14, block, w);
    g.translate((d / 2 - d * 0.07) * (i - 1), board + block / 2, 0);
    geos.push(g);
  }

  // six top boards, spread so the outer two finish flush with the ends
  const tw = w / 9;
  const step = (w - tw) / 5;
  for (let i = 0; i < 6; i++) {
    const g = new THREE.BoxGeometry(d, board, tw);
    g.translate(0, board + block + board / 2, -w / 2 + tw / 2 + step * i);
    geos.push(g);
  }
  return mergeGeometries(geos, false)!;
}

/** Stretch-wrapped load, sitting on the pallet deck rather than inside it. */
function loadGeometry() {
  const h = SECTION.loadH * MM;
  const g = new THREE.BoxGeometry(
    SECTION.palletD * MM * 0.92,
    h,
    SECTION.palletW * MM * 0.94,
  );
  g.translate(0, SECTION.palletH * MM + h / 2, 0);
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
  /** the untouched matrices for a mesh, so a test can check nothing drifted */
  baseMatrices(mesh: THREE.Object3D): THREE.Matrix4[] | null;
}

type Bucket = {
  mesh: THREE.InstancedMesh;
  base: THREE.Matrix4[];
  total: number;
  /** index currently carrying the drop-in transform, -1 when none */
  animating: number;
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
    mesh.name = geoKey;
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
    arr.push({ mesh, base, total: list.length, animating: -1 });
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

  /**
   * Show `shown` parts, with the one being placed dropping into position.
   *
   * The drop-in writes a raised, shrunken matrix over the frontier instance,
   * so that instance MUST be put back before the frontier moves on. Skipping
   * the restore leaves every index the frontier ever passed through stuck at
   * whatever partial transform it last held - which is what put half-size
   * decking panels floating between the levels. A scroll that jumps skips
   * indices outright, so restoring only "the previous one" is not enough
   * either; the stale index is tracked explicitly.
   */
  function reveal(kind: PartKind, shown: number, frontier: number) {
    for (const b of buckets.get(kind) ?? []) {
      const full = Math.max(0, Math.min(b.total, Math.floor(shown)));
      const hasFrontier = frontier > 0.001 && full < b.total;

      if (b.animating >= 0 && b.animating !== full) {
        b.mesh.setMatrixAt(b.animating, b.base[b.animating]);
        b.mesh.instanceMatrix.needsUpdate = true;
        b.animating = -1;
      }

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
        b.animating = full;
      } else if (b.animating === full) {
        b.mesh.setMatrixAt(full, b.base[full]);
        b.mesh.instanceMatrix.needsUpdate = true;
        b.animating = -1;
      }
    }
  }

  function revealAll() {
    for (const arr of buckets.values())
      for (const b of arr) {
        b.mesh.count = b.total;
        b.base.forEach((m, i) => b.mesh.setMatrixAt(i, m));
        b.mesh.instanceMatrix.needsUpdate = true;
        b.animating = -1;
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

  function baseMatrices(mesh: THREE.Object3D) {
    for (const arr of buckets.values())
      for (const b of arr) if (b.mesh === mesh) return b.base;
    return null;
  }

  revealAll();

  return {
    group,
    reveal,
    revealAll,
    dispose,
    counts: model.counts,
    baseMatrices,
  };
}

/**
 * Distance along `dir` at which the whole object fits the frustum.
 *
 * Binary search over the projected corners rather than a hand-tuned radius:
 * a bounding SPHERE massively over-estimates a rack, which is long and thin,
 * and leaves it marooned in the middle of a wide card. Runs once per resize.
 *
 * `fill` shrinks the box before fitting. Framing the WHOLE box is dominated by
 * one worst-case corner - the near bottom one, which is closest to the camera
 * and so subtends the widest angle - and that corner alone pushes the subject
 * down to about 40% of the frame. Shrinking lets the extremities crop, which
 * for a long run reads as it continuing past the edge.
 */
export function fitDistance(
  object: THREE.Object3D,
  camera: THREE.PerspectiveCamera,
  dir: THREE.Vector3,
  /** one factor, or one per axis when a run should be cropped along its length */
  fill: number | THREE.Vector3 = 1,
  margin = 1.04,
) {
  const box = new THREE.Box3().setFromObject(object);
  const centre = box.getCenter(new THREE.Vector3());
  const f =
    typeof fill === "number" ? new THREE.Vector3(fill, fill, fill) : fill;
  if (f.x !== 1 || f.y !== 1 || f.z !== 1) {
    const half = box.getSize(new THREE.Vector3()).multiply(f).multiplyScalar(0.5);
    box.set(centre.clone().sub(half), centre.clone().add(half));
  }
  const corners: THREE.Vector3[] = [];
  for (const x of [box.min.x, box.max.x])
    for (const y of [box.min.y, box.max.y])
      for (const z of [box.min.z, box.max.z])
        corners.push(new THREE.Vector3(x, y, z));

  const tanV = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
  const tanH = tanV * camera.aspect;

  const forward = dir.clone().normalize().negate(); // camera looks back along dir
  const right = new THREE.Vector3()
    .crossVectors(forward, new THREE.Vector3(0, 1, 0))
    .normalize();
  const up = new THREE.Vector3().crossVectors(right, forward).normalize();

  const fits = (d: number) => {
    const pos = centre.clone().addScaledVector(dir, d);
    for (const c of corners) {
      const v = c.clone().sub(pos);
      const depth = v.dot(forward);
      if (depth <= 0.01) return false;
      if (Math.abs(v.dot(right)) > tanH * depth) return false;
      if (Math.abs(v.dot(up)) > tanV * depth) return false;
    }
    return true;
  };

  let lo = 0.1;
  let hi = 400;
  for (let i = 0; i < 40; i++) {
    const mid = (lo + hi) / 2;
    if (fits(mid)) hi = mid;
    else lo = mid;
  }
  return { distance: hi * margin, centre };
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

  /* Fog exists only to fade the floor off toward the horizon, never to touch
     the subject - so its range has to follow the CAMERA DISTANCE, not the size
     of the model. Fixed from `extent` it looks right on a wide card, where the
     fit puts the camera about 24 m out, and washes the rack three-quarters
     into the page colour on a narrow one, where fitting the same run needs
     nearly 70 m. Call setFogRange() after every fit. */
  const fog = new THREE.Fog(paper, 1e6, 2e6);
  scene.fog = fog;

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

  /** push the fog out beyond the subject, given how far back the camera sits */
  function setFogRange(distance: number) {
    fog.near = distance * 1.7;
    fog.far = distance * 4.5;
  }

  return { key, fillWarm, fillCool, hemi, ground, fog, setFogRange };
}
