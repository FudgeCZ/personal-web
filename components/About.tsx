import Reveal from "@/components/Reveal";

export default function About() {
  return (
    <section className="section" id="o-mne">
      <div className="container">
        <Reveal>
          <p className="kicker">O mně</p>
          <h2 className="section-title">Kdo jsem</h2>
          <p className="about-text">
            Jsem student informatiky na PEF ČZU s maturitním základem v
            elektrotechnice a automatizaci. Baví mě řešit věci od
            nízkoúrovňového kódu až po desktopové utility a integraci AI.
            Hledám juniorské vývojářské příležitosti, stáže nebo zapojení do
            technických projektů, kde mohu stavět funkční řešení.
          </p>
          <ul className="about-facts">
            <li>🎓 Informatika — PEF ČZU (1. ročník)</li>
            <li>⚡ Mechanik-elektrotechnik — SOU a SOŠ Kladno Dubská</li>
            <li>📍 Rakovník, Středočeský kraj</li>
            <li>🔎 Hledám: junior pozice, stáže, technické projekty</li>
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
