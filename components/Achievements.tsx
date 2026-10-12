import Reveal from "@/components/Reveal";

const RESULTS = [
  {
    year: "2023",
    rank: "9. místo",
    detail: "Finále Robosoutěže FEL ČVUT",
    team: "tým Nalezeni v lese",
  },
  {
    year: "2022",
    rank: "17. místo",
    detail: "Finále Robosoutěže FEL ČVUT",
    team: "tým Ztraceni v lese",
  },
];

export default function Achievements() {
  return (
    <section className="section" id="souteze">
      <div className="container">
        <h2 className="section-title">Robosoutěž FEL ČVUT</h2>
        <Reveal className="ach-grid">
          {RESULTS.map((r) => (
            <article className="ach-card card" key={r.year}>
              <span className="ach-year">{r.year}</span>
              <span className="ach-rank">{r.rank}</span>
              <p className="ach-detail">{r.detail}</p>
              <p className="ach-team">{r.team}</p>
            </article>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
