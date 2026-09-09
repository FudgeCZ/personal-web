export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <p>
          © {new Date().getFullYear()} František Novák · Postaveno v Next.js
        </p>
        <p className="footer-disclaimer">
          ChocoModrinth je neoficiální fork Modrinth App (GPL-3.0) a není
          spojen s Modrinth.
        </p>
      </div>
    </footer>
  );
}
