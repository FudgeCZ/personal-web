import Reveal from "@/components/Reveal";

const LINKS = [
  {
    icon: "🐙",
    label: "GitHub",
    value: "github.com/FudgeCZ",
    href: "https://github.com/FudgeCZ",
  },
  {
    icon: "💼",
    label: "LinkedIn",
    value: "linkedin.com/in/frantisek-novak-fudge",
    href: "https://www.linkedin.com/in/frantisek-novak-fudge/",
  },
  {
    icon: "✉️",
    label: "Napište mi",
    value: "Přes LinkedIn zprávu",
    href: "https://www.linkedin.com/in/frantisek-novak-fudge/",
  },
];

export default function Contact() {
  return (
    <section className="section" id="kontakt">
      <div className="container">
        <p className="kicker">Kontakt</p>
        <h2 className="section-title">Ozvěte se</h2>
        <Reveal className="contact-grid">
          {LINKS.map((l) => (
            <a
              className="contact-card card"
              key={l.label}
              href={l.href}
              target="_blank"
              rel="noreferrer"
            >
              <span className="contact-icon" aria-hidden="true">
                {l.icon}
              </span>
              <span className="contact-label">{l.label}</span>
              <span className="contact-value">{l.value}</span>
              <span className="contact-arrow" aria-hidden="true">
                →
              </span>
            </a>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
