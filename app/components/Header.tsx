import ThemeSwitcher from "./ThemeSwitcher";   // nahoru k importům

export default function Header({ jmeno }: { jmeno: string }) {
  return (
    <header>
      <a href="#domu" className="logo">
        {jmeno}
      </a>
      <nav>
        <a href="#o-mne">O mně</a>
        <a href="#projekty">Projekty</a>
        <a href="#kontakt">Kontakt</a>
      </nav>
      <ThemeSwitcher />
    </header>
  );
}
