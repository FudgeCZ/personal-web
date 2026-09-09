import Image from "next/image";

const FEATURES = [
  {
    icon: "🗜️",
    title: "Komprese profilů (7z)",
    text: "Celý profil zkomprimujete na jeden klik do archivu 7z s maximální kompresí. Při spuštění hry se profil sám rozbalí a po ukončení zase zabalí — snímky obrazovky a přehled modů zůstávají funkční i v komprimovaném stavu.",
  },
  {
    icon: "🛠️",
    title: "Tvorba serverů",
    text: "Lokální Minecraft server na pár kliknutí: loader (Vanilla, Fabric, Forge, NeoForge, Quilt, Paper, Purpur), verze, RAM, port, MOTD i herní pravidla. Spouštěč sám stáhne a ověří server jar a nainstaluje správnou Javu.",
  },
  {
    icon: "📊",
    title: "Server dashboard",
    text: "Živé grafy RAM a CPU, konzole s příkazy, správa hráčů (OP, whitelist, ban, kick) včetně dat ze světa — zdraví, hlad, souřadnice postele i kompletní inventář. Plus editor server.properties a správce obsahu.",
  },
  {
    icon: "🌍",
    title: "Server z profilu",
    text: "Server vytvořený z existujícího profilu převezme loader a verzi, zkopíruje singleplayer svět jako world a synchronizuje mody — client-only mody automaticky vyřadí podle metadat prostředí z Modrinthu.",
  },
  {
    icon: "📥",
    title: "Import z Modrinth App",
    text: "Existující profily lze přímo importovat z oficiální Modrinth App, takže přechod na ChocoModrinth je otázka pár minut.",
  },
  {
    icon: "🎨",
    title: "Vlastní akcentní barvy",
    text: "Čokoládový vzhled není nutností — akcentní barvu aplikace změníte v Nastavení → Vzhled.",
  },
];

const TECH = [
  "Tauri v2 (Rust)",
  "Vue 3",
  "TypeScript",
  "Tailwind CSS",
  "SQLite",
  "7z / LZMA2",
  "Auto-instalace Java (Zulu)",
  "Git",
];

export default function Projects() {
  return (
    <section className="section" id="projekt">
      <div className="container">
        <p className="kicker">Aktuální projekty</p>
        <h2 className="section-title">ChocoModrinth — Custom Minecraft Launcher</h2>

        <div className="project-card card">
          <div className="project-head">
            <Image
              src="/assets/logo.png"
              alt="ChocoModrinth logo"
              width={96}
              height={96}
              className="project-logo"
            />
            <div>
              <h3 className="project-name">ChocoModrinth</h3>
              <p className="project-context">
                Vlastní aktivní fork oficiální open-source aplikace Modrinth
                (v0.20.0) s čokoládově-karamelovým rebrandem a sadou funkcí,
                které originál nemá.
              </p>
            </div>
          </div>

          <div className="features">
            {FEATURES.map((f) => (
              <article className="feature-card" key={f.title}>
                <span className="feature-icon" aria-hidden="true">
                  {f.icon}
                </span>
                <h4>{f.title}</h4>
                <p>{f.text}</p>
              </article>
            ))}
          </div>

          <div className="chips" aria-label="Použité technologie">
            {TECH.map((t) => (
              <span className="chip" key={t}>
                {t}
              </span>
            ))}
          </div>

          <div className="project-foot">
            <p className="project-meta">
              Platforma: Windows 10/11 (x64) &nbsp;·&nbsp; Licence: GPL-3.0
            </p>
            <a
              className="btn btn-primary"
              href="https://github.com/FudgeCZ/choco-modrinth-app"
              target="_blank"
              rel="noreferrer"
            >
              Zobrazit na GitHubu
            </a>
          </div>

          <p className="disclaimer">
            ChocoModrinth je neoficiální fanouškovský fork a není spojen s
            Modrinth.
          </p>
        </div>
      </div>
    </section>
  );
}
