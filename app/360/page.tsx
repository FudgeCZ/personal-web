import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { list } from "@vercel/blob";
import Reveal from "@/components/Reveal";
import PanoUpload from "@/components/pano/PanoUpload";
import { formatBytes, idFromPathname, titleFromId } from "@/lib/pano";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "360° fotky | František Novák",
  description:
    "Sdílená galerie 360° panoramat — vyfoď panorama mobilem, nahraj ho a pošli odkaz. Prohlížeč funguje na mobilu i počítači.",
};

const HOW_TO = [
  {
    icon: "📱",
    title: "iPhone",
    steps: [
      "Otevři Aplikaci Fotoaparát a přejeď na režim Panorama.",
      "Pomaly a plynule toč telefonem podle šipky dokola.",
      "Fotku najdeš ve Fotkách a nahraješ ji tady.",
    ],
  },
  {
    icon: "🤖",
    title: "Android",
    steps: [
      "V aplikaci Fotoaparát (Google/Kamera) zvol režim Panorama nebo Photo Sphere.",
      "Namiř telefon na značky a obejděte celý obzor.",
      "Hotovou fotku nahraj tady přes tlačítko Vybrat fotku.",
    ],
  },
  {
    icon: "🔗",
    title: "Sdílení",
    steps: [
      "Po nahrání dostaneš odkaz ve tvaru /360/nazev-fotky.",
      "Odkaz pošli komukoli — otevře se na mobilu i na PC.",
      "Prohlížeč se ovládá tažením, na mobilu i gyroskopem.",
    ],
  },
];

type PanoItem = {
  id: string;
  title: string;
  url: string;
  size: number;
  uploadedAt: Date;
};

async function getPanos(): Promise<PanoItem[]> {
  try {
    const res = await list({ prefix: "360/", limit: 100 });
    return res.blobs
      .filter((b) => /\.(jpg|jpeg|png|webp)$/i.test(b.pathname))
      .map((b) => {
        const id = idFromPathname(b.pathname);
        return {
          id,
          title: titleFromId(id),
          url: b.url,
          size: b.size,
          uploadedAt: new Date(b.uploadedAt),
        };
      })
      .sort((a, b) => b.uploadedAt.getTime() - a.uploadedAt.getTime());
  } catch {
    return [];
  }
}

export default async function PanoPage() {
  const panos = await getPanos();
  const uploadReady = Boolean(process.env.BLOB_READ_WRITE_TOKEN);

  return (
    <main>
      <section className="hero hero-project">
        <div className="container">
          <Link className="back-link" href="/">
            ← Zpět na portfolio
          </Link>
          <Reveal>
            <p className="kicker">Galerie</p>
            <h1 className="hero-name">360° fotky</h1>
            <p className="hero-role">Panoramata k prohlížení a sdílení</p>
            <p className="hero-sub">
              Vyfoď panorama mobilem, nahraj ho tady a pošli odkaz. Každá fotka
              má vlastní adresu a dá se prohlížet na mobilu i na počítači.
            </p>
            <div className="hero-ctas">
              <Link className="btn btn-outline" href="/360/ukazka">
                Zkusit ukázku prohlížeče
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section-tight" id="nahrat">
        <div className="container">
          <Reveal>
            <PanoUpload disabled={!uploadReady} />
          </Reveal>
        </div>
      </section>

      <section className="section" id="galerie">
        <div className="container">
          <Reveal>
            <p className="kicker">Galerie</p>
            <h2 className="section-title">Sdílené panoramata</h2>
          </Reveal>
          {panos.length === 0 ? (
            <Reveal>
              <p className="pano-empty">
                Zatím tu žádná 360° fotka není — nahraj první! Nebo si nejdřív
                projdi <Link href="/360/ukazka">ukázku prohlížeče</Link>.
              </p>
            </Reveal>
          ) : (
            <Reveal className="pano-grid">
              {panos.map((p) => (
                <Link
                  key={p.id}
                  href={`/360/${p.id}`}
                  className="pano-card"
                  aria-label={`Otevřít 360° fotku ${p.title}`}
                >
                  <span className="pano-thumb">
                    <Image
                      src={p.url}
                      alt={`360° panorama ${p.title}`}
                      fill
                      sizes="(max-width: 640px) 100vw, 320px"
                      className="pano-thumb-img"
                    />
                    <span className="pano-badge">360°</span>
                  </span>
                  <span className="pano-card-body">
                    <span className="pano-card-title">{p.title}</span>
                    <span className="pano-card-meta">
                      {p.uploadedAt.toLocaleDateString("cs-CZ")} ·{" "}
                      {formatBytes(p.size)}
                    </span>
                  </span>
                </Link>
              ))}
            </Reveal>
          )}
        </div>
      </section>

      <section className="section" id="jak-na-to">
        <div className="container">
          <Reveal>
            <p className="kicker">Jak na to</p>
            <h2 className="section-title">Vyfoď si vlastní 360° fotku</h2>
          </Reveal>
          <Reveal className="features">
            {HOW_TO.map((h) => (
              <article className="feature-card" key={h.title}>
                <span className="feature-icon" aria-hidden="true">
                  {h.icon}
                </span>
                <h4>{h.title}</h4>
                <ol className="pano-steps">
                  {h.steps.map((s) => (
                    <li key={s}>{s}</li>
                  ))}
                </ol>
              </article>
            ))}
          </Reveal>
        </div>
      </section>
    </main>
  );
}
