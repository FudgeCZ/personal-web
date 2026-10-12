/**
 * Experimentální slepovač horizontálních panoramat (rotace kolem svislé osy).
 *
 * Postup: u sousedních snímků najdu vodorovný/svislý posun porovnáním
 * jasu (SAD, coarse-to-fine), odhadu ohnisko kamery z úhlového kroku,
 * snímky přewarpuju na válec a slepím s lineárním překryvem.
 * Kvalita odpovídá "experimentu" — u dobře vyfocené série (pevná ruka,
 * dostatek textury) je výsledek použitelný.
 */

export type StitchProgress = (label: string, done: number, total: number) => void;

type Shift = { dx: number; dy: number; score: number };

function drawScaled(source: CanvasImageSource, w: number, h: number): ImageData {
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  const ctx = c.getContext("2d", { willReadFrequently: true })!;
  ctx.drawImage(source, 0, 0, w, h);
  return ctx.getImageData(0, 0, w, h);
}

function toGray(img: ImageData): Float32Array {
  const { data, width, height } = img;
  const gray = new Float32Array(width * height);
  for (let i = 0, p = 0; i < gray.length; i++, p += 4) {
    gray[i] = 0.299 * data[p] + 0.587 * data[p + 1] + 0.114 * data[p + 2];
  }
  return gray;
}

/** Najde posun, kde obsah snímku b pokračuje v snímku a. */
function sadSearch(
  a: Float32Array,
  b: Float32Array,
  w: number,
  h: number,
  minDx: number,
  maxDx: number,
  maxDy: number,
  step: number
): Shift {
  let best: Shift = { dx: Math.round((minDx + maxDx) / 2), dy: 0, score: Infinity };
  for (let dx = minDx; dx <= maxDx; dx += step) {
    const overlap = w - dx;
    if (overlap < w * 0.1) break;
    for (let dy = -maxDy; dy <= maxDy; dy += step) {
      let sum = 0;
      let n = 0;
      for (let y = 0; y < h; y += 2) {
        const ya = y + dy;
        if (ya < 0 || ya >= h) continue;
        const rowB = y * w;
        const rowA = ya * w;
        for (let x = 0; x < overlap; x += 2) {
          sum += Math.abs(a[rowA + x + dx] - b[rowB + x]);
          n++;
        }
      }
      if (n < 100) continue;
      const score = sum / n;
      if (score < best.score) best = { dx, dy, score };
    }
  }
  return best;
}

function findShift(
  prevSource: CanvasImageSource,
  nextSource: CanvasImageSource,
  fullW: number,
  fullH: number
): Shift {
  // hrubé hledání na malém náhledu
  const smallW = 320;
  const smallH = Math.max(60, Math.round((smallW * fullH) / fullW));
  const aS = toGray(drawScaled(prevSource, smallW, smallH));
  const bS = toGray(drawScaled(nextSource, smallW, smallH));
  const coarse = sadSearch(
    aS,
    bS,
    smallW,
    smallH,
    Math.round(smallW * 0.2),
    Math.round(smallW * 0.85),
    Math.round(smallH * 0.08),
    2
  );

  // dolaďení na středním náhledu
  const midW = 800;
  const midH = Math.round((midW * fullH) / fullW);
  const scale = midW / smallW;
  const aM = toGray(drawScaled(prevSource, midW, midH));
  const bM = toGray(drawScaled(nextSource, midW, midH));
  const fine = sadSearch(
    aM,
    bM,
    midW,
    midH,
    Math.max(1, Math.round(coarse.dx * scale) - 12),
    Math.min(midW - Math.round(midW * 0.1), Math.round(coarse.dx * scale) + 12),
    Math.max(1, Math.round(Math.abs(coarse.dy) * scale) + 6),
    1
  );

  return {
    dx: (fine.dx / midW) * fullW,
    dy: (fine.dy / midW) * fullW,
    score: fine.score,
  };
}

/** Přewarpuje snímek na válec s daným ohniskem (v pixelech). */
function warpToCylinder(source: CanvasImageSource, w: number, h: number, f: number): HTMLCanvasElement {
  const outW = Math.max(8, Math.round(2 * f * Math.atan(w / 2 / f)));
  const out = document.createElement("canvas");
  out.width = outW;
  out.height = h;
  const octx = out.getContext("2d")!;
  const outData = octx.createImageData(outW, h);

  const src = drawScaled(source, w, h);
  const sd = src.data;
  const dd = outData.data;

  for (let oy = 0; oy < h; oy++) {
    for (let ox = 0; ox < outW; ox++) {
      const theta = (ox - outW / 2) / f;
      const sx = w / 2 + f * Math.tan(theta);
      if (sx < 0 || sx > w - 1) continue;
      const r = Math.sqrt(f * f + (sx - w / 2) * (sx - w / 2));
      const sy = h / 2 + ((oy - h / 2) * r) / f;
      if (sy < 0 || sy > h - 1) continue;

      const x0 = Math.floor(sx);
      const y0 = Math.floor(sy);
      const fx = sx - x0;
      const fy = sy - y0;
      const x1 = Math.min(w - 1, x0 + 1);
      const y1 = Math.min(h - 1, y0 + 1);

      const d00 = (y0 * w + x0) * 4;
      const d10 = (y0 * w + x1) * 4;
      const d01 = (y1 * w + x0) * 4;
      const d11 = (y1 * w + x1) * 4;
      const o = (oy * outW + ox) * 4;

      for (let ch = 0; ch < 3; ch++) {
        const top = sd[d00 + ch] * (1 - fx) + sd[d10 + ch] * fx;
        const bot = sd[d01 + ch] * (1 - fx) + sd[d11 + ch] * fx;
        dd[o + ch] = top * (1 - fy) + bot * fy;
      }
      dd[o + 3] = 255;
    }
  }

  octx.putImageData(outData, 0, 0);
  return out;
}

export async function stitchPanorama(
  frames: HTMLCanvasElement[],
  onProgress: StitchProgress
): Promise<HTMLCanvasElement> {
  const n = frames.length;
  if (n < 2) throw new Error("Potřebuji alespoň 2 snímky.");

  const fullW = frames[0].width;
  const fullH = frames[0].height;

  onProgress("Hledám překryvy…", 0, n);
  const shifts: Shift[] = [];
  for (let i = 1; i < n; i++) {
    shifts.push(findShift(frames[i - 1], frames[i], fullW, fullH));
    onProgress("Hledám překryvy…", i, n - 1);
  }

  // ohnisko z průměrného posunu (úhlový krok = 360°/počet snímků)
  const meanDx = shifts.reduce((s, x) => s + x.dx, 0) / shifts.length;
  const stepRad = (2 * Math.PI) / n;
  const f = Math.max(fullW, meanDx / stepRad);

  onProgress("Warp na válec…", 0, n);
  const warped: HTMLCanvasElement[] = [];
  for (let i = 0; i < n; i++) {
    warped.push(warpToCylinder(frames[i], fullW, fullH, f));
    onProgress("Warp na válec…", i + 1, n);
  }

  // posuny mezi warpnutými snímky (už téměř stejnoměrné)
  const wW = warped[0].width;
  const wShifts: number[] = [];
  for (let i = 1; i < n; i++) {
    const s = findShift(warped[i - 1], warped[i], wW, fullH);
    // posun mimo rozumný rozsah → použij průměr dosavadních
    const fallback = wShifts.length ? wShifts.reduce((a, b) => a + b, 0) / wShifts.length : meanDx / stepRad;
    wShifts.push(s.dx > 4 && s.dx < wW * 0.9 ? s.dx : fallback);
  }

  const offsets: number[] = [0];
  for (let i = 1; i < n; i++) offsets.push(offsets[i - 1] + wShifts[i - 1]);
  const totalW = Math.round(offsets[n - 1] + wW);
  if (totalW < fullW * 1.5) throw new Error("Snímky se nepodařilo slepit — málo překryvu.");

  const scale = totalW > 12000 ? 12000 / totalW : 1;
  const pano = document.createElement("canvas");
  pano.width = Math.round(totalW * scale);
  pano.height = fullH;
  const pctx = pano.getContext("2d")!;

  onProgress("Slepuji…", 0, n);
  for (let i = 0; i < n; i++) {
    const x = Math.round(offsets[i] * scale);
    const wI = Math.round(wW * scale);
    const tmp = document.createElement("canvas");
    tmp.width = wI;
    tmp.height = fullH;
    const tctx = tmp.getContext("2d")!;
    tctx.drawImage(warped[i], 0, 0, wI, fullH);

    // lineární překryv: nový snímek se plynule zapracuje přes svůj levý okraj
    const blend = i === 0 ? 0 : Math.min(wI - 2, Math.round(wI - wShifts[i - 1] * scale));
    if (blend > 0) {
      const grad = tctx.createLinearGradient(0, 0, wI, 0);
      grad.addColorStop(0, "rgba(0,0,0,0)");
      grad.addColorStop(Math.min(0.95, blend / wI), "rgba(0,0,0,1)");
      grad.addColorStop(1, "rgba(0,0,0,1)");
      tctx.globalCompositeOperation = "destination-in";
      tctx.fillStyle = grad;
      tctx.fillRect(0, 0, wI, fullH);
      tctx.globalCompositeOperation = "source-over";
    }
    pctx.drawImage(tmp, x, 0);
    onProgress("Slepuji…", i + 1, n);
  }

  return pano;
}
