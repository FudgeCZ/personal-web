import Link from "next/link";

export default function Home() {
  return (
    <main>
      <h1>ChocoModrinth</h1>
      <Link href="/#projekty">← Zpět</Link>
    </main>
  );
}
export const metadata: Metadata = {
  title: "ChocoModrinth | František Novák",
};
