"use client";
import Link from "next/link";
import Reveal from "./Reveal";
import { useState } from "react";

export default function Projects() {
  const [aktivni, setAktivni] = useState(0);
  function poziceTrida(index: number) {
    const posun = (index - aktivni + 3) % 3;
    if (posun === 0) {
      return "pozice-vpredu";
    }
    if (posun === 1) {
      return "pozice-vlevo";
    }
    if (posun === 2) {
      return "pozice-vpravo";
    }
  }
  return (
    <section id="projekty">
      <Reveal>
        <h2>Projekty</h2>
      </Reveal>
      <Reveal>
        <div className="karusel">
          <div className="karty">
            <div
              className={`karta karta-choco ${poziceTrida(0)}`}
              onClick={() => setAktivni(0)}
            >
              <h3>ChocoModrinth</h3>
              <p>Fork open-source Modrinth app</p>
              <div className="karta-akce">
                <a
                  className="choco-odkaz"
                  href="https://github.com/FudgeCZ/choco-modrinth-app"
                >
                  Github
                </a>
                <Link href="/projekt">Detail projektu</Link>
              </div>
            </div>
            <div
              className={`karta karta-robo ${poziceTrida(1)}`}
              onClick={() => setAktivni(1)}
            >
              <h3>Robosoutěž</h3>
              <p>9. místo v celostátním finále (2023), 17. místo (2022)</p>
            </div>
            <div
              className={`karta karta-nic ${poziceTrida(2)}`}
              onClick={() => setAktivni(2)}
            >
              <h3>A další...</h3>
              <p>Stále dělám i více projektů</p>
              <div className="karta-akce">
                <a href="https://github.com/FudgeCZ">Další na GitHubu</a>
              </div>
            </div>
          </div>
          <div
            className="linka-pln"
            key={aktivni}
            onAnimationEnd={() => setAktivni((aktivni + 1) % 3)}
          />
        </div>
      </Reveal>
    </section>
  );
}
