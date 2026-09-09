export default function SiteHeader() {
  return (
    <header className="nav">
      <div className="container nav-inner">
        <a href="#domu" className="brand">
          František Novák
        </a>
        <nav className="nav-links" aria-label="Hlavní navigace">
          <a href="#o-mne">O mně</a>
          <a href="#projekt">Projekt</a>
          <a href="#galerie">Galerie</a>
          <a href="#souteze">Soutěže</a>
          <a href="#stack">Stack</a>
        </nav>
        <a href="#kontakt" className="btn btn-outline nav-cta">
          Kontakt
        </a>
      </div>
    </header>
  );
}
