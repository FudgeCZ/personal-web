import SiteHeader from "@/components/SiteHeader";
import Hero from "@/components/Hero";
import About from "@/components/About";
import ProjectTeaser from "@/components/ProjectTeaser";
import Achievements from "@/components/Achievements";
import TechStack from "@/components/TechStack";
import Contact from "@/components/Contact";

export default function Home() {
  return (
    <main>
      <Hero />
      <About />
      <ProjectTeaser />
      <Achievements />
      <TechStack />
      <Contact />
    </main>
  );
}
