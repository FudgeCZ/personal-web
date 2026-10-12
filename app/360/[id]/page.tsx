import type { Metadata } from "next";
import Link from "next/link";
import { list } from "@vercel/blob";
import { notFound } from "next/navigation";
import PanoViewer from "@/components/pano/PanoViewer";
import { titleFromId } from "@/lib/pano";

export const dynamic = "force-dynamic";

type Params = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { id } = await params;
  const title = id === "ukazka" ? "Ukázka" : titleFromId(id);
  return {
    title: `${title} — 360° fotka | František Novák`,
    description: `Interaktivní 360° prohlížeč fotky „${title}".`,
  };
}

export default async function PanoViewPage({ params }: Params) {
  const { id } = await params;
  const title = id === "ukazka" ? "Ukázka" : titleFromId(id);

  let src: string | undefined;
  if (id !== "ukazka") {
    try {
      const res = await list({ prefix: `360/${id}.`, limit: 5 });
      const match = res.blobs.find((b) => b.pathname === `360/${id}.jpg`)
        ?? res.blobs.find((b) => b.pathname === `360/${id}.jpeg`)
        ?? res.blobs.find((b) => b.pathname === `360/${id}.png`)
        ?? res.blobs.find((b) => b.pathname === `360/${id}.webp`);
      src = match?.url;
    } catch {
      src = undefined;
    }
    if (!src) notFound();
  }

  return (
    <main>
      <section className="hero hero-project">
        <div className="container">
          <Link className="back-link" href="/360">
            ← Zpět na 360° galerii
          </Link>
          <p className="kicker">360° fotka</p>
          <h1 className="hero-name pano-title">{title}</h1>
        </div>
      </section>

      <section className="section-tight pano-view-section">
        <div className="container">
          <PanoViewer title={title} src={src} demo={id === "ukazka"} />
        </div>
      </section>
    </main>
  );
}
