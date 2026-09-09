import Image from "next/image";

export default function Hero() {
  return (
    <section className="hero" id="domu">
      <div className="container hero-inner">
        <div className="hero-text">
          <p className="kicker">Portfolio</p>
          <h1 className="hero-name">František Novák</h1>
          <p className="hero-role">Junior Developer &amp; Student PEF ČZU</p>
          <p className="hero-sub">
            Propojuji software s hardwarem. Vyvíjím desktopové aplikace a custom
            herní tooling.
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
        <div className="hero-visual" aria-hidden="true">
          <Image
            src="/assets/logo.png"
            alt=""
            width={512}
            height={512}
            className="hero-logo"
            priority
          />
        </div>
      </div>
    </section>
  );
}
