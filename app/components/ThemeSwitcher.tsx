"use client";

import { useState, useEffect } from "react";

function Slunce({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="21"
      height="21"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    >
      <circle cx="12" cy="12" r="5" />
      <line x1="12" y1="1" x2="12" y2="3" />
      <line x1="12" y1="21" x2="12" y2="23" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="1" y1="12" x2="3" y2="12" />
      <line x1="21" y1="12" x2="23" y2="12" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
  );
}

function Mesic({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="21"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    >
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}

export default function ThemeSwitcher() {
  const [tema, setTema] = useState(() => {
    if (typeof window === "undefined") return "dark";
    return localStorage.getItem("tema") === "light" ? "light" : "dark";
  });

  useEffect(() => {
    if (tema === "light") {
      document.documentElement.dataset.theme = "light";
    } else {
      document.documentElement.removeAttribute("data-theme");
    }
  }, [tema]); // spustí se po načtení A při každé změně tématu

  function prepni() {
    const noveTema = tema === "light" ? "dark" : "light";
    setTema(noveTema);
    localStorage.setItem("tema", noveTema);
  }

  return (
    <button onClick={prepni} aria-label="Přepnout světlý/tmavý režim">
      <Slunce className="ikona-slunce" />
      <Mesic className="ikona-mesic" />
    </button>
  );
}
