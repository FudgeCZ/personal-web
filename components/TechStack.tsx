const STACK: { category: string; tech: string }[] = [
  { category: "Jazyky", tech: "Python, C/C++, Java" },
  {
    category: "Hardware & IoT",
    tech: "Elektrotechnika, automatizační technika, práce s roboty",
  },
  {
    category: "Nástroje & Workflow",
    tech: "Git, GitHub, VS Code, IntelliJ IDEA, Google Antigravity, ZCode",
  },
  {
    category: "Specializace",
    tech: "Desktopové aplikace, modding tooling, práce s AI",
  },
];

export default function TechStack() {
  return (
    <section className="section" id="stack">
      <div className="container">
        <p className="kicker">Technický stack</p>
        <h2 className="section-title">S čím pracuji</h2>
        <div className="table-wrap card">
          <table className="stack-table">
            <tbody>
              {STACK.map((row) => (
                <tr key={row.category}>
                  <th scope="row">{row.category}</th>
                  <td>{row.tech}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
