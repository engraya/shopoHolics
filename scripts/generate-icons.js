/**
 * Generates the binary brand icons that SVG can't cover (favicon.ico, the iOS
 * touch icon, the PWA manifest icons) by rasterising the mark from its own
 * geometry — no image tooling or design-file round trip required.
 *
 *   node scripts/generate-icons.js
 *
 * The geometry below is the same as `src/app/icon.svg` and the `LogoMark`
 * component in `src/components/ui/Logo.tsx`. Change all three together, then
 * re-run this script.
 */
const fs = require("fs");
const path = require("path");
const zlib = require("zlib");

// ---------------------------------------------------------------- geometry
// Coordinates live in the same 64x64 space as the SVG viewBox.
const G = {
  tile: { x: 0, y: 0, w: 64, h: 64, r: 15 },
  grad: {
    from: [2, 0],
    to: [62, 64],
    stops: [
      [0, 0x02, 0x84, 0xc7],
      [0.5, 0x08, 0x91, 0xb2],
      [1, 0x0d, 0x94, 0x88],
    ],
  },
  body: { x: 14, y: 25, w: 36, h: 28, r: 5.5 },
  // Wide shallow arc with its ends tucked under the body — a bag handle.
  handle: { cx: 32, cy: 30.5, r: 11.5, a0: 195, span: 150, dir: 1, w: 3.4 },
  // The "S" is one open cubic path, stroked with round caps.
  s: {
    w: 3.4,
    d: [
      ["M", 38.1, 32.2],
      ["C", 37.0, 30.3, 34.6, 29.6, 32.0, 29.6],
      ["C", 28.7, 29.6, 25.9, 31.9, 25.9, 34.6],
      ["C", 25.9, 37.2, 28.2, 38.4, 32.0, 39.0],
      ["C", 35.8, 39.6, 38.1, 40.8, 38.1, 43.4],
      ["C", 38.1, 46.1, 35.3, 48.4, 32.0, 48.4],
      ["C", 29.4, 48.4, 27.0, 47.7, 25.9, 45.8],
    ],
  },
};

const clamp01 = (v) => (v < 0 ? 0 : v > 1 ? 1 : v);

function sdRoundRect(px, py, b) {
  const qx = Math.abs(px - (b.x + b.w / 2)) - (b.w / 2 - b.r);
  const qy = Math.abs(py - (b.y + b.h / 2)) - (b.h / 2 - b.r);
  return Math.hypot(Math.max(qx, 0), Math.max(qy, 0)) + Math.min(Math.max(qx, qy), 0) - b.r;
}

function sdArcStroke(px, py, a) {
  const dx = px - a.cx;
  const dy = py - a.cy;
  const theta = (Math.atan2(dy, dx) * 180) / Math.PI;
  const swept = (((a.dir * (theta - a.a0)) % 360) + 360) % 360;
  if (swept <= a.span) return Math.abs(Math.hypot(dx, dy) - a.r) - a.w / 2;

  const at = (deg) => [a.cx + a.r * Math.cos((deg * Math.PI) / 180), a.cy + a.r * Math.sin((deg * Math.PI) / 180)];
  const [p0, p1] = [at(a.a0), at(a.a0 + a.dir * a.span)];
  return Math.min(Math.hypot(px - p0[0], py - p0[1]), Math.hypot(px - p1[0], py - p1[1])) - a.w / 2;
}

/** Flattens the cubic path once so stroking reduces to distance-to-polyline. */
function flatten(d, steps = 32) {
  const pts = [];
  let cur = null;
  for (const seg of d) {
    if (seg[0] === "M") {
      cur = [seg[1], seg[2]];
      pts.push(cur);
      continue;
    }
    const [, x1, y1, x2, y2, x3, y3] = seg;
    const [x0, y0] = cur;
    for (let i = 1; i <= steps; i++) {
      const t = i / steps;
      const u = 1 - t;
      pts.push([
        u * u * u * x0 + 3 * u * u * t * x1 + 3 * u * t * t * x2 + t * t * t * x3,
        u * u * u * y0 + 3 * u * u * t * y1 + 3 * u * t * t * y2 + t * t * t * y3,
      ]);
    }
    cur = [x3, y3];
  }
  return pts;
}

const S_POLY = flatten(G.s.d);

function sdPolyStroke(px, py, poly, w) {
  let best = Infinity;
  for (let i = 1; i < poly.length; i++) {
    const [ax, ay] = poly[i - 1];
    const [bx, by] = poly[i];
    const vx = bx - ax;
    const vy = by - ay;
    const len2 = vx * vx + vy * vy;
    const t = len2 === 0 ? 0 : clamp01(((px - ax) * vx + (py - ay) * vy) / len2);
    const d = Math.hypot(px - ax - t * vx, py - ay - t * vy);
    if (d < best) best = d;
  }
  return best - w / 2;
}

function gradientAt(px, py) {
  const [ax, ay] = G.grad.from;
  const [bx, by] = G.grad.to;
  const vx = bx - ax;
  const vy = by - ay;
  const t = clamp01(((px - ax) * vx + (py - ay) * vy) / (vx * vx + vy * vy));
  const stops = G.grad.stops;
  for (let i = 1; i < stops.length; i++) {
    if (t <= stops[i][0] || i === stops.length - 1) {
      const lo = stops[i - 1];
      const hi = stops[i];
      const k = clamp01((t - lo[0]) / (hi[0] - lo[0]));
      return [1, 2, 3].map((c) => lo[c] + (hi[c] - lo[c]) * k);
    }
  }
}

/**
 * Renders an RGBA buffer at `size` px.
 * `radius` overrides the tile corner (0 = full bleed, for icons the platform
 * masks itself). `contentScale` shrinks the bag to leave a maskable safe zone.
 */
function render(size, { radius = G.tile.r, contentScale = 1 } = {}) {
  const scale = size / 64;
  const aa = 0.5 / scale; // one device pixel, in 64-space units
  const buf = Buffer.alloc(size * size * 4);
  const cov = (d) => clamp01(0.5 - d / aa);

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const px = (x + 0.5) / scale;
      const py = (y + 0.5) / scale;

      const tile = radius === 0 ? 1 : cov(sdRoundRect(px, py, { ...G.tile, r: radius }));
      if (tile <= 0) continue;

      // Sample the bag in un-scaled space, then convert the distance back.
      const bx = 32 + (px - 32) / contentScale;
      const by = 32 + (py - 32) / contentScale;
      const bagD = Math.min(sdRoundRect(bx, by, G.body), sdArcStroke(bx, by, G.handle)) * contentScale;
      const sD = sdPolyStroke(bx, by, S_POLY, G.s.w) * contentScale;
      const white = cov(bagD) * (1 - cov(sD));

      const g = gradientAt(px, py);
      const o = (y * size + x) * 4;
      for (let c = 0; c < 3; c++) buf[o + c] = Math.round(g[c] + (255 - g[c]) * white);
      buf[o + 3] = Math.round(tile * 255);
    }
  }
  return buf;
}

// ---------------------------------------------------------------- png / ico
const CRC_TABLE = (() => {
  const t = new Int32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c;
  }
  return t;
})();

function crc32(buf) {
  let c = -1;
  for (let i = 0; i < buf.length; i++) c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ -1) >>> 0;
}

function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const body = Buffer.concat([Buffer.from(type, "ascii"), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(body));
  return Buffer.concat([len, body, crc]);
}

function toPng(rgba, size) {
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0);
  ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // truecolour + alpha
  const stride = size * 4 + 1;
  const raw = Buffer.alloc(size * stride);
  for (let y = 0; y < size; y++) {
    raw[y * stride] = 0; // filter: none
    rgba.copy(raw, y * stride + 1, y * size * 4, (y + 1) * size * 4);
  }
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk("IHDR", ihdr),
    chunk("IDAT", zlib.deflateSync(raw, { level: 9 })),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}

/** ICO container holding PNG-compressed frames (supported since IE11). */
function toIco(frames) {
  const dir = Buffer.alloc(6 + 16 * frames.length);
  dir.writeUInt16LE(1, 2); // type: icon
  dir.writeUInt16LE(frames.length, 4);
  let offset = dir.length;
  frames.forEach(({ size, data }, i) => {
    const e = 6 + 16 * i;
    dir[e] = size >= 256 ? 0 : size; // 0 means 256
    dir[e + 1] = size >= 256 ? 0 : size;
    dir.writeUInt16LE(1, e + 4); // colour planes
    dir.writeUInt16LE(32, e + 6); // bits per pixel
    dir.writeUInt32LE(data.length, e + 8);
    dir.writeUInt32LE(offset, e + 12);
    offset += data.length;
  });
  return Buffer.concat([dir, ...frames.map((f) => f.data)]);
}

// ---------------------------------------------------------------- output
const root = path.resolve(__dirname, "..");

function write(rel, data) {
  const file = path.join(root, rel);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, data);
  console.log(`  ${rel.padEnd(34)} ${(data.length / 1024).toFixed(1)} kB`);
}

const frame = (size) => ({ size, data: toPng(render(size), size) });

console.log("Generating brand icons…");
write("src/app/favicon.ico", toIco([frame(16), frame(32), frame(48)]));
// iOS rounds the touch icon itself, so ship it square and opaque.
write("src/app/apple-icon.png", toPng(render(180, { radius: 0 }), 180));
write("public/icon-192.png", toPng(render(192), 192));
write("public/icon-512.png", toPng(render(512), 512));
// Maskable: full bleed with the mark inside the 80% safe zone.
write("public/icon-maskable-512.png", toPng(render(512, { radius: 0, contentScale: 0.72 }), 512));
