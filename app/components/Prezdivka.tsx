"use client";
import { useEffect, useState } from "react";

const prezdivky = ["Fudge", "Fandova_susenka"];

export default function Prezdivka() {
  const [text, setText] = useState("");
  const [cislo, setCislo] = useState(0);
  const [mazu, setMazu] = useState(false);

  useEffect(() => {
    const cil = prezdivky[cislo];
    let casovac: number;

    if (mazu && text === "") {
      casovac = window.setTimeout(() => {
        setCislo((cislo + 1) % prezdivky.length);
        setMazu(false);
      }, 250);
    } else if (mazu) {
      casovac = window.setTimeout(() => {
        setText(cil.slice(0, text.length - 1));
      }, 40);
    } else if (text.length < cil.length) {
      casovac = window.setTimeout(() => {
        setText(cil.slice(0, text.length + 1));
      }, 90);
    } else {
      window.setTimeout(() => setMazu(true), 3000);
    }

    return () => window.clearTimeout(casovac);
  }, [text, mazu, cislo]);

  return (
    <p className="prezdivka">
      {text}
      <span className="kurzor">▌</span>
    </p>
  );
}
