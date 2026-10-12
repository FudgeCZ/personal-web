"use client";

import { useEffect, useRef, useState } from "react";
import type { Viewer } from "@photo-sphere-viewer/core";
import "@photo-sphere-viewer/core/index.css";
import { createDemoPanoDataUrl } from "@/lib/pano";

type Props = {
  title: string;
  /** URL fotky (Vercel Blob); vynech a nastav demo pro ukázkové panorama */
  src?: string;
  demo?: boolean;
};

/**
 * Výpočet oříznutí panoramata podle poměru stran:
 *  - cca 2:1 → klasické equirektangulární 360° (celá koule)
 *  - širší než 2:1 → cylindrické panorama (např. iPhone Panorama),
 *    zobrazí se jako svisle vycentrovaný pás koule
 *  - užší → vodorovně vycentrovaný výřez
 */
function computePanoData(img: HTMLImageElement) {
  const r = img.width / img.height;
  if (r >= 2) {
    const fullWidth = img.width;
    const fullHeight = img.width / 2;
    return {
      fullWidth,
      fullHeight,
      croppedWidth: img.width,
      croppedHeight: img.height,
      croppedX: 0,
      croppedY: Math.round((fullHeight - img.height) / 2),
    };
  }
  const fullHeight = img.height;
  const fullWidth = img.height * 2;
  return {
    fullWidth,
    fullHeight,
    croppedWidth: img.width,
    croppedHeight: img.height,
    croppedX: Math.round((fullWidth - img.width) / 2),
    croppedY: 0,
  };
}

export default function PanoViewer({ title, src, demo = false }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");

  useEffect(() => {
    let viewer: Viewer | null = null;
    let cancelled = false;

    async function init() {
      const panorama = demo ? createDemoPanoDataUrl() : src;
      if (!containerRef.current || !panorama) return;

      try {
        const [{ Viewer: PSVViewer }, { GyroscopePlugin: Gyro }, { AutorotatePlugin: Rotate }] =
          await Promise.all([
            import("@photo-sphere-viewer/core"),
            import("@photo-sphere-viewer/gyroscope-plugin"),
            import("@photo-sphere-viewer/autorotate-plugin"),
          ]);
        if (cancelled) return;

        // gyroskop dává smysl jen na dotykových zařízeních
        const coarse = window.matchMedia("(pointer: coarse)").matches;

        viewer = new PSVViewer({
          container: containerRef.current!,
          panorama,
          caption: title,
          panoData: computePanoData,
          mousewheel: true,
          touchmoveTwoFingers: true,
          navbar: ["zoom", "move", ...(coarse ? (["gyroscope"] as const) : []), "fullscreen", "caption"],
          plugins: [
            [Rotate, { autostartDelay: 2000, autostartOnIdle: true }],
            ...(coarse
              ? ([[Gyro, { touchmoveTwoFingers: true }]] as [
                  [typeof Gyro, { touchmoveTwoFingers: boolean }],
                ])
              : []),
          ],
        });

        viewer.addEventListener("ready", () => {
          if (!cancelled) setStatus("ready");
        });
        viewer.addEventListener("panorama-error", () => {
          if (!cancelled) setStatus("error");
        });
      } catch {
        if (!cancelled) setStatus("error");
      }
    }

    init();
    return () => {
      cancelled = true;
      viewer?.destroy();
      viewer = null;
    };
  }, [src, title, demo]);

  return (
    <div className="pano-viewer-wrap">
      <div
        ref={containerRef}
        className="pano-viewer"
        aria-label={`360° prohlížeč: ${title}`}
      />
      {status === "loading" && (
        <div className="pano-overlay">Načítám 360° fotku…</div>
      )}
      {status === "error" && (
        <div className="pano-overlay is-error">
          Fotku se nepodařilo načíst.{" "}
          {!demo && (
            <a href="/360" className="back-link">
              Zpět na galerii
            </a>
          )}
        </div>
      )}
      {status === "ready" && (
        <p className="pano-help">
          {demo ? "Ukázkové panorama — " : ""}Tažením se rozhlížíš, kolečkem /
          dvěma prsty přiblížíš.
        </p>
      )}
    </div>
  );
}
