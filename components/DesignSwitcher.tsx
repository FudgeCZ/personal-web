"use client";

import { useEffect, useRef, useState } from "react";
import { Palette } from "@phosphor-icons/react";

const DESIGNS = [
  {
    id: "mocha",
    name: "Mokka",
    desc: "Tmavý mix Aurory a Čokolády",
    dots: ["#ec9d4e", "#7a4a26", "#130c06"],
  },
  {
    id: "aurora",
    name: "Aurora",
    desc: "Tmavá, gradienty a sklo",
    dots: ["#8b5cf6", "#22d3ee", "#0a0c12"],
  },
  {
    id: "choco",
    name: "Čokoláda",
    desc: "Teplá, v brandu ChocoModrinth",
    dots: ["#6f4518", "#d99a3d", "#f6eee1"],
  },
  {
    id: "minimal",
    name: "Minimal",
    desc: "Světlá, čistá, serifová",
    dots: ["#17181a", "#8a8f98", "#fdfdfb"],
  },
  {
    id: "terminal",
    name: "Terminál",
    desc: "Neonová zelená, monospace",
    dots: ["#3dff6e", "#ff4fd8", "#060906"],
  },
] as const;

export default function DesignSwitcher() {
  const [current, setCurrent] = useState<string>("aurora");
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setCurrent(document.documentElement.dataset.design || "aurora");
  }, []);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const pick = (id: string) => {
    document.documentElement.dataset.design = id;
    try {
      localStorage.setItem("design", id);
    } catch {}
    setCurrent(id);
    setOpen(false);
  };

  const active = DESIGNS.find((d) => d.id === current) ?? DESIGNS[0];

  return (
    <div className="design-switcher" ref={rootRef}>
      {open && (
        <div className="switcher-panel card" role="listbox" aria-label="Vzhled webu">
          <p className="switcher-title">Vzhled webu</p>
          {DESIGNS.map((d) => (
            <button
              key={d.id}
              type="button"
              role="option"
              aria-selected={d.id === current}
              className={`switcher-option${d.id === current ? " is-active" : ""}`}
              onClick={() => pick(d.id)}
            >
              <span className="switcher-dots" aria-hidden="true">
                {d.dots.map((c) => (
                  <i key={c} style={{ background: c }} />
                ))}
              </span>
              <span className="switcher-names">
                <strong>{d.name}</strong>
                <small>{d.desc}</small>
              </span>
              {d.id === current && <span className="switcher-check">✓</span>}
            </button>
          ))}
        </div>
      )}
      <button
        type="button"
        className="switcher-button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label="Změnit vzhled webu"
      >
        <Palette size={15} aria-hidden /> {active.name}
      </button>
    </div>
  );
}
