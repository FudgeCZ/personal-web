/**
 * Sdílené pomocníky pro podstránku /360 (nahrávání, galerie i prohlížeč).
 * Titulek fotky se ukládá přímo do názvu souboru v Blobu:
 *   pathname = "360/<nahodny-suffix>-<slug-titulku>.<ext>"
 *   id v URL = název souboru bez přípony, např. "a3f9-muj-pokoj"
 */

const CZ_MAP: Record<string, string> = {
  á: "a", ä: "a", à: "a", â: "a", č: "c", ć: "c", ď: "d", é: "e", ě: "e",
  è: "e", ê: "e", í: "i", ï: "i", î: "i", ľ: "l", ĺ: "l", ň: "n", ó: "o",
  ö: "o", ô: "o", ő: "o", ř: "r", ŕ: "r", š: "s", ś: "s", ť: "t", ú: "u",
  ů: "u", ü: "u", ű: "u", ý: "y", ž: "z", ź: "z",
};

/** Titulek převede na URL-safe slug (bez diakritiky), max ~40 znaků. */
export function slugifyTitle(title: string): string {
  const translit = title
    .toLowerCase()
    .replace(/[áäàâčćďéěèêíïîľĺňóöôőŕřšśťúůüűýžź]/g, (c) => CZ_MAP[c] ?? c);
  const slug = translit
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40)
    .replace(/-+$/g, "");
  return slug || "panorama";
}

/** Ze seznamu existujících slugs odvodí volný náhodný suffix (4 znaky). */
export function randomSuffix(): string {
  return Math.random().toString(36).slice(2, 6);
}

/** Z pathname blobu ("360/xxx.jpg") udělá id pro URL ("xxx"). */
export function idFromPathname(pathname: string): string {
  return pathname.replace(/^360\//, "").replace(/\.[^.]+$/, "");
}

/** Z id ("a3f9-muj-pokoj") udělá čitelný titulek ("Muj pokoj"). */
export function titleFromId(id: string): string {
  const slug = id.replace(/^[a-z0-9]{4}-/, "");
  const text = slug.replace(/-/g, " ").trim() || "Panorama";
  return text.charAt(0).toUpperCase() + text.slice(1);
}

export function formatBytes(bytes: number): string {
  if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${Math.max(1, Math.round(bytes / 1024))} kB`;
}

/** Nakreslí ukázkové equirektangulární panorama na canvas a vrátí data URL. */
export function createDemoPanoDataUrl(): string {
  const w = 2048;
  const h = 1024;
  const horizon = Math.round(h * 0.62);
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) return "";

  // obloha
  const sky = ctx.createLinearGradient(0, 0, 0, horizon);
  sky.addColorStop(0, "#0a0c14");
  sky.addColorStop(0.65, "#3c2a1c");
  sky.addColorStop(1, "#ec9d4e");
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, w, horizon);

  // hvězdy
  let seed = 42;
  const rnd = () => {
    seed = (seed * 16807) % 2147483647;
    return seed / 2147483647;
  };
  ctx.fillStyle = "rgba(255,255,255,0.8)";
  for (let i = 0; i < 220; i++) {
    const x = rnd() * w;
    const y = rnd() * horizon * 0.7;
    const s = rnd() * 2 + 0.5;
    ctx.globalAlpha = 0.25 + rnd() * 0.75;
    ctx.fillRect(x, y, s, s);
  }
  ctx.globalAlpha = 1;

  // slunce
  const sunX = w * 0.22;
  const sunY = horizon - 110;
  const glow = ctx.createRadialGradient(sunX, sunY, 8, sunX, sunY, 180);
  glow.addColorStop(0, "rgba(255,224,170,1)");
  glow.addColorStop(0.25, "rgba(236,157,78,0.75)");
  glow.addColorStop(1, "rgba(236,157,78,0)");
  ctx.fillStyle = glow;
  ctx.beginPath();
  ctx.arc(sunX, sunY, 180, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#ffe0aa";
  ctx.beginPath();
  ctx.arc(sunX, sunY, 52, 0, Math.PI * 2);
  ctx.fill();

  // silueta hor
  ctx.fillStyle = "#14100b";
  ctx.beginPath();
  ctx.moveTo(0, horizon);
  for (let x = 0; x <= w; x += 32) {
    const y =
      horizon -
      60 -
      46 * Math.sin(x / 210) -
      30 * Math.sin(x / 71 + 2) -
      18 * Math.sin(x / 29 + 5);
    ctx.lineTo(x, y);
  }
  ctx.lineTo(w, horizon);
  ctx.closePath();
  ctx.fill();

  // země
  const ground = ctx.createLinearGradient(0, horizon, 0, h);
  ground.addColorStop(0, "#241708");
  ground.addColorStop(1, "#0c0804");
  ctx.fillStyle = ground;
  ctx.fillRect(0, horizon, w, h - horizon);

  // sloupy dokola
  for (let i = 0; i < 12; i++) {
    const cx = (i * w) / 12 + w / 24;
    const colW = 26;
    const colH = 210;
    ctx.fillStyle = i % 2 ? "#1d1409" : "#241a0d";
    ctx.fillRect(cx - colW / 2, horizon - colH, colW, colH);
    ctx.fillStyle = "rgba(236,157,78,0.5)";
    ctx.fillRect(cx - colW / 2, horizon - colH, 4, colH);
  }

  // světové strany
  ctx.font = "bold 84px sans-serif";
  ctx.textAlign = "center";
  ctx.fillStyle = "rgba(243,233,220,0.92)";
  const dirs = ["S", "V", "J", "Z"];
  dirs.forEach((d, i) => {
    ctx.fillText(d, (i * w) / 4 + w / 8, horizon - 300);
  });

  // horizont
  ctx.fillStyle = "#ec9d4e";
  ctx.fillRect(0, horizon - 2, w, 3);

  return canvas.toDataURL("image/jpeg", 0.92);
}
