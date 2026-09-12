import Link from "next/link";
import Reveal from "./Reveal";

export default function Projects() {
  return (
    <section id="projekty">
      <Reveal>
        <h2>Projekty</h2>
      </Reveal>
      <Reveal>
        <div className="karty">
          <div className="karta karta-choco">
            <h3>ChocoModrinth</h3>
            <p>Fork open-source Modrinth app</p>
            <a
              className="choco-odkaz"
              href="https://github.com/FudgeCZ/choco-modrinth-app"
            >
              Github
            </a>
            <Link href="/projekt"> Detail projektu</Link>
          </div>
          <div className="karta karta-nic">
            <h3>A další...</h3>
            <p>Stále dělám i více projektů</p>
            <a>Nic</a>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
