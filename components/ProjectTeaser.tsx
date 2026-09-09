import Image from "next/image";
import Link from "next/link";
import Reveal from "@/components/Reveal";

export default function ProjectTeaser() {
  return (
    <section className="section" id="projekt">
      <div className="container">
        <Reveal>
          <p className="kicker">Aktuální projekty</p>
          <h2 className="section-title">Co stavím</h2>
        </Reveal>
        <Reveal>
          <article className="teaser-card card">
            <div className="teaser-head">
              <Image
                src="/assets/logo.png"
                alt="ChocoModrinth logo"
                width={72}
                height={72}
                className="teaser-logo"
              />
              <div>
                <h3 className="teaser-title">ChocoModrinth</h3>
                <p className="teaser-tag">
                  Custom Minecraft Launcher · září 2026 – současnost
                </p>
              </div>
            </div>
            <p className="teaser-text">
              Vlastní aktivní fork oficiální open-source aplikace Modrinth s
              čokoládovým rebrandem: komprese profilů do 7z, tvorba lokálních
              serverů s plnohodnotným dashboardem, správa hráčů, import profilů
              z Modrinth App a vlastní akcentní barvy.
            </p>
            <div className="chip-row">
              <span className="chip">Tauri v2 (Rust)</span>
              <span className="chip">Vue 3</span>
              <span className="chip">TypeScript</span>
              <span className="chip">SQLite</span>
              <span className="chip">7z / LZMA2</span>
            </div>
            <div className="teaser-cta">
              <Link className="btn btn-primary btn-sm" href="/chocomodrinth">
                Detail projektu
              </Link>
              <a
                className="btn btn-outline btn-sm"
                href="https://github.com/FudgeCZ/choco-modrinth-app"
                target="_blank"
                rel="noreferrer"
              >
                GitHub
              </a>
            </div>
          </article>
        </Reveal>
      </div>
    </section>
  );
}
