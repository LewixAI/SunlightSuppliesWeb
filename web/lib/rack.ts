/**
 * Selective pallet racking — geometry as pure data.
 *
 * Same idea as RackForge's `shared/assemble.ts`: data in, data out, no three.js
 * import. The scene draws from this and the spec readout counts from this, so
 * the picture and the numbers cannot drift apart.
 *
 * Millimetres throughout, converted to metres at the three.js boundary.
 * Axes match RackForge: +X across the rack depth, +Y up, +Z along the run.
 */

export type PartKind =
  | "baseplate"
  | "upright"
  | "brace"
  | "beam"
  | "deck"
  | "pallet";

export interface Placement {
  /** centre position in millimetres */
  x: number;
  y: number;
  z: number;
  /** rotation about Y, radians. Only braces and beams ever use it. */
  ry?: number;
  /** brace diagonals need a length + tilt that varies with the panel */
  len?: number;
  rx?: number;
}

export interface RackSpec {
  rows: number;
  bays: number;
  /** clear span between uprights, mm */
  bay: number;
  /** frame depth, mm */
  depth: number;
  /** frame height, mm */
  height: number;
  /** beam bottom heights above floor, mm */
  levels: number[];
  /** gangway between rows, mm */
  aisle: number;
  /** how much of the rack carries pallets, 0..1 */
  load: number;
}

export const DEFAULT_SPEC: RackSpec = {
  rows: 1,
  bays: 5,
  bay: 2700,
  depth: 1100,
  height: 6000,
  /* Four beam levels at a 1 200 pitch. Three levels left the top 1.6 m of a
     6 m frame completely bare, which reads as a modelling mistake even though
     the geometry was right. The top level is set so a loaded pallet finishes
     just under the frame top: 4 900 + 120 beam + 25 deck + 144 pallet + 760
     load = 5 949, against a frame top of 6 012. */
  levels: [1350, 2550, 3750, 4900],
  aisle: 3000,
  load: 0.72,
};

/* Component cross-sections, mm. Taken from the proportions in their own
   installation photos: 90 mm column faces, ~120 mm box beams, chipboard deck. */
export const SECTION = {
  colW: 70, // across the depth (X)
  colD: 90, // along the run (Z)
  baseW: 160,
  baseD: 130,
  baseH: 12,
  beamH: 120,
  beamW: 50,
  braceW: 45,
  braceT: 25,
  bracePitch: 850,
  deckT: 25,
  decksPerBay: 3,
  palletW: 1200, // along the run
  palletD: 1000, // across the depth
  /* Real height of the built pallet: 22 board + 100 block + 22 board. The
     geometry has to agree with this or the load floats. */
  palletBoard: 22,
  palletBlock: 100,
  palletH: 144,
  loadH: 760,
};

export interface RackModel {
  spec: RackSpec;
  parts: Record<PartKind, Placement[]>;
  counts: Record<PartKind, number>;
  /** overall bounding size in mm */
  size: { x: number; y: number; z: number };
  /** derived commercial figures, the same ones a quotation would carry */
  stats: {
    frames: number;
    beams: number;
    positions: number;
    /** rated capacity, tonnes, at 1 000 kg a pallet position */
    tonnes: number;
    runLength: number;
  };
}

/** Small avalanche hash, so thinned pallet positions scatter rather than
 *  line up into columns. Deterministic across reloads. */
function hash(a: number, b: number, c: number, d: number) {
  let h = (a * 0x27d4eb2d + b * 0x165667b1 + c * 0x9e3779b1 + d * 0x85ebca6b) >>> 0;
  h = Math.imul(h ^ (h >>> 15), 0x2545f491) >>> 0;
  h = Math.imul(h ^ (h >>> 13), 0x27d4eb2d) >>> 0;
  return (h ^ (h >>> 16)) >>> 0;
}

/**
 * Build the part list.
 *
 * Order matters: every array is emitted in erection sequence (bottom up, then
 * along the run) so the build animation can simply raise a draw count and the
 * rack assembles the way a real crew would put it up.
 */
export function buildRack(input: Partial<RackSpec> = {}): RackModel {
  const spec: RackSpec = { ...DEFAULT_SPEC, ...input };
  const { rows, bays, bay, depth, height, levels, aisle } = spec;
  const S = SECTION;

  const pitch = bay + S.colD;
  const runLength = bays * pitch + S.colD;
  const rowPitch = depth + aisle;

  const parts: Record<PartKind, Placement[]> = {
    baseplate: [],
    upright: [],
    brace: [],
    beam: [],
    deck: [],
    pallet: [],
  };

  /* Column centres across the depth, and frame centres along the run. */
  const colX = [S.colW / 2, depth - S.colW / 2];
  const frameZ: number[] = [];
  for (let f = 0; f <= bays; f++) frameZ.push(f * pitch + S.colD / 2);

  for (let r = 0; r < rows; r++) {
    const x0 = r * rowPitch;

    // 1. baseplates, then 2. uprights — one pass so both stay in frame order
    for (const fz of frameZ) {
      for (const cx of colX) {
        parts.baseplate.push({ x: x0 + cx, y: S.baseH / 2, z: fz });
      }
    }
    for (const fz of frameZ) {
      for (const cx of colX) {
        parts.upright.push({ x: x0 + cx, y: S.baseH + height / 2, z: fz });
      }
    }

    // 3. bracing — a zigzag between the two columns of every frame
    const span = depth - S.colW; // centre to centre
    const panels = Math.max(2, Math.round((height - 400) / S.bracePitch));
    const rise = (height - 400) / panels;
    const diag = Math.hypot(span, rise);
    const tilt = Math.atan2(rise, span);
    for (const fz of frameZ) {
      for (let p = 0; p < panels; p++) {
        parts.brace.push({
          x: x0 + depth / 2,
          y: S.baseH + 250 + rise * (p + 0.5),
          z: fz,
          len: diag,
          rx: p % 2 === 0 ? tilt : -tilt,
        });
      }
      // horizontal ties top and bottom
      for (const y of [S.baseH + 250, S.baseH + 250 + rise * panels]) {
        parts.brace.push({ x: x0 + depth / 2, y, z: fz, len: span, rx: 0 });
      }
    }

    // 4. beams — level by level, front and back face of every bay
    const beamX = [S.beamW / 2, depth - S.beamW / 2];
    for (const ly of levels) {
      for (let b = 0; b < bays; b++) {
        const bz = frameZ[b] + S.colD / 2 + bay / 2;
        for (const bx of beamX) {
          // the step ledge faces into the rack, so the back face turns around
          parts.beam.push({
            x: x0 + bx,
            y: ly + S.beamH / 2,
            z: bz,
            ry: bx < depth / 2 ? 0 : Math.PI,
          });
        }
      }
    }

    // 5. decking — panels dropped between each beam pair
    const deckW = bay / S.decksPerBay;
    for (const ly of levels) {
      for (let b = 0; b < bays; b++) {
        const z0 = frameZ[b] + S.colD / 2;
        for (let d = 0; d < S.decksPerBay; d++) {
          parts.deck.push({
            x: x0 + depth / 2,
            y: ly + S.beamH + S.deckT / 2,
            z: z0 + deckW * (d + 0.5),
          });
        }
      }
    }

    // 6. pallets — loaded from the bottom up, thinning out toward the top
    const storeys = [0, ...levels];
    storeys.forEach((ly, li) => {
      const deckTop = li === 0 ? 0 : ly + S.beamH + S.deckT;
      for (let b = 0; b < bays; b++) {
        const z0 = frameZ[b] + S.colD / 2;
        for (let p = 0; p < 2; p++) {
          /* Deterministic thinning, so the same rack always renders the same.
             A plain weighted sum of the indices leaves visible columns and
             stripes of empty positions; this mixes properly. */
          const keep = spec.load * 100 * (1 - li * 0.13);
          if (hash(r, li, b, p) % 100 >= keep) continue;
          /* The pallet geometry is modelled with its origin at the underside,
             so it is placed AT the deck, not half its height above it. */
          parts.pallet.push({
            x: x0 + depth / 2,
            y: deckTop,
            z: z0 + bay * (p === 0 ? 0.25 : 0.75),
          });
        }
      }
    });
  }

  const counts = Object.fromEntries(
    Object.entries(parts).map(([k, v]) => [k, v.length]),
  ) as Record<PartKind, number>;

  const frames = (bays + 1) * rows;
  const positions = bays * (levels.length + 1) * 2 * rows;

  return {
    spec,
    parts,
    counts,
    size: {
      x: rows * depth + (rows - 1) * aisle,
      y: height + SECTION.baseH,
      z: runLength,
    },
    stats: {
      frames,
      beams: counts.beam,
      positions,
      tonnes: positions, // 1 000 kg a position
      runLength,
    },
  };
}

/** Erection stages, in the order a crew actually works. */
export const STAGES: {
  key: PartKind;
  title: string;
  note: string;
  spec: string;
}[] = [
  {
    key: "baseplate",
    title: "Set out and anchor",
    note: "Baseplates are shot into the slab on the surveyed grid. Everything above is only as square as this.",
    spec: "160 × 130 × 12 mm plate",
  },
  {
    key: "upright",
    title: "Stand the frames",
    note: "Cold-rolled columns, 70 × 90 mm, perforated on a 50 mm pitch so beam levels can be reset later.",
    spec: "6 000 mm frame height",
  },
  {
    key: "brace",
    title: "Brace the frames",
    note: "Diagonal and horizontal lacing ties the two columns into one frame and carries the down-aisle load.",
    spec: "850 mm bracing pitch",
  },
  {
    key: "beam",
    title: "Hang the beams",
    note: "Box beams drop into the column slots and lock with a safety clip. No bolts, no welding on site.",
    spec: "2 700 mm clear span",
  },
  {
    key: "deck",
    title: "Lay the decking",
    note: "Chipboard panels across the beam pair, so cartons and part-pallets can sit anywhere on the level.",
    spec: "25 mm panel, 3 a bay",
  },
  {
    key: "pallet",
    title: "Load out",
    note: "Two pallet positions a bay a level, rated at one tonne each. The rack is handed over loaded.",
    spec: "1 000 kg a position",
  },
];
