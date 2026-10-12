import {
  GithubLogo,
  LinkedinLogo,
  EnvelopeSimple,
  ArrowRight,
} from "@phosphor-icons/react/dist/ssr";
import Reveal from "@/components/Reveal";

const LINKS = [
  {
    icon: GithubLogo,
    label: "GitHub",
    value: "github.com/FudgeCZ",
    href: "https://github.com/FudgeCZ",
  },
  {
    icon: LinkedinLogo,
    label: "LinkedIn",
    value: "linkedin.com/in/frantisek-novak-fudge",
    href: "https://www.linkedin.com/in/frantisek-novak-fudge/",
  },
  {
    icon: EnvelopeSimple,
    label: "Napište mi",
    value: "Přes LinkedIn zprávu",
    href: "https://www.linkedin.com/in/frantisek-novak-fudge/",
  },
];

export default function Contact() {
  return (
    <section className="section" id="kontakt">
      <div className="container">
        <Reveal>
          <h2 className="section-title">Ozvěte se</h2>
          <div className="contact-panel card">
            {LINKS.map((l) => (
              <a
                className="contact-cell"
                key={l.label}
                href={l.href}
                target="_blank"
                rel="noreferrer"
              >
                <l.icon className="contact-icon" size={26} weight="duotone" aria-hidden />
                <span className="contact-label">{l.label}</span>
                <span className="contact-value">{l.value}</span>
                <ArrowRight className="contact-arrow" size={17} aria-hidden />
              </a>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
