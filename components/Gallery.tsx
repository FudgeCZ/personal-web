"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";

const SHOTS = [
  {
    src: "/assets/MainMenu.png",
    caption: "Hlavní menu a knihovna profilů",
    width: 1917,
    height: 1150,
  },
  {
    src: "/assets/ServersTab.png",
    caption: "Přehled lokálních serverů",
    width: 1917,
    height: 1153,
  },
  {
    src: "/assets/ServerDasboard.png",
    caption: "Server dashboard — živé statistiky, konzole a hráči",
    width: 1915,
    height: 1153,
  },
  {
    src: "/assets/ProfileSettings.png",
    caption: "Nastavení profilu s vlastními akcentními barvami",
    width: 1915,
    height: 1149,
  },
];

export default function Gallery() {
  const [selected, setSelected] = useState<number | null>(null);

  const close = useCallback(() => setSelected(null), []);

  useEffect(() => {
    if (selected === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [selected, close]);

  return (
    <section className="section" id="galerie">
      <div className="container">
        <p className="kicker">Galerie</p>
        <h2 className="section-title">ChocoModrinth v akci</h2>
        <div className="gallery">
          {SHOTS.map((shot, i) => (
            <figure className="gallery-item" key={shot.src}>
              <button
                type="button"
                className="gallery-thumb"
                onClick={() => setSelected(i)}
                aria-label={`Zvětšit: ${shot.caption}`}
              >
                <Image
                  src={shot.src}
                  alt={shot.caption}
                  width={shot.width}
                  height={shot.height}
                  sizes="(max-width: 860px) 100vw, 50vw"
                />
              </button>
              <figcaption>{shot.caption}</figcaption>
            </figure>
          ))}
        </div>
      </div>

      {selected !== null && (
        <div
          className="lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={SHOTS[selected].caption}
          onClick={close}
        >
          <button
            type="button"
            className="lightbox-close"
            onClick={close}
            aria-label="Zavřít"
          >
            ✕
          </button>
          <figure className="lightbox-body" onClick={(e) => e.stopPropagation()}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={SHOTS[selected].src}
              alt={SHOTS[selected].caption}
            />
            <figcaption>{SHOTS[selected].caption}</figcaption>
          </figure>
        </div>
      )}
    </section>
  );
}
