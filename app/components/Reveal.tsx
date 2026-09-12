"use client";

import { useEffect, useRef, useState } from "react";

export default function Reveal({ children }: { children: React.ReactNode }) {
  const [viditelna, setViditelna] = useState(false);
  const ref = useRef<HTMLDivElement>(null);   // jmenovka na náš <div>

  useEffect(() => {
  const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {        // pro každé hlášení z pole
      if (entry.isIntersecting) {         // je ten prvek právě vidět?
        setViditelna(true);               // → řekni Reactu: odhal to
        observer.disconnect();            // → a přestaň hlídat (odhalujeme jen jednou)
      }
    }
  });
  if (ref.current) {
    observer.observe(ref.current);        // start hlídání našeho divu
  }
  return () => observer.disconnect();     // úklid
}, []);

  return (
    <div ref={ref} className={`reveal ${viditelna ? "viditelna" : ""}`}>
      {children}
    </div>
  );
}