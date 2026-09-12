import Link from "next/link";
import type { Metadata } from "next";

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
