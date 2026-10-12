import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="hero" id="domu">
      <div className="container hero-inner">
        <div className="hero-text">
          <h1 className="hero-name">František Novák</h1>
          <p className="hero-role">Junior Developer &amp; Student PEF ČZU</p>
          <p className="hero-sub">
            Propojuji software s hardwarem. Vyvíjím desktopové aplikace a
            custom herní tooling.
          </p>
          <div className="hero-ctas">
            <a
              className="btn btn-outline"
              href="https://github.com/FudgeCZ"
              target="_blank"
              rel="noreferrer"
            >
              GitHub
            </a>
            <a
              className="btn btn-outline"
              href="https://www.linkedin.com/in/frantisek-novak-fudge/"
              target="_blank"
              rel="noreferrer"
            >
              LinkedIn
            </a>
            <a
              className="btn btn-primary"
              href="https://www.linkedin.com/in/frantisek-novak-fudge/"
              target="_blank"
              rel="noreferrer"
            >
              Napište mi
            </a>
          </div>
        </div>

        <div className="hero-shot">
          <Link
            href="/chocomodrinth"
            className="shot-card shot-back"
            aria-hidden="true"
            tabIndex={-1}
          >
            <Image
              src="/assets/ServerDasboard.png"
              alt=""
              width={1915}
              height={1153}
              sizes="(max-width: 900px) 90vw, 460px"
            />
          </Link>
          <Link href="/chocomodrinth" className="shot-card shot-front">
            <Image
              src="/assets/MainMenu.png"
              alt="Náhled ChocoModrinthu, hlavní menu launcheru"
              width={1917}
              height={1150}
              sizes="(max-width: 900px) 90vw, 500px"
              priority
            />
          </Link>
        </div>
      </div>
    </section>
  );
}
