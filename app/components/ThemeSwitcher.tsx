"use client";

import { useState, useEffect } from "react";

export default function ThemeSwitcher() {
  const [tema, setTema] = useState(() => {
    if (typeof window === "undefined") return "dark";
    return localStorage.getItem("tema") === "light" ? "light" : "dark";
  });

  function prepni() {
    const noveTema = tema === "light" ? "dark" : "light";
    setTema(noveTema);

    if (noveTema === "light") {
      document.documentElement.dataset.theme = "light";
    } else {
      document.documentElement.removeAttribute("data-theme");
    }

    localStorage.setItem("tema", noveTema);
  }

  return <button onClick={prepni}>Přepnout režim</button>;
}
