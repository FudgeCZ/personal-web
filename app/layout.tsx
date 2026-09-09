import type { Metadata } from "next";
import {
  Inter,
  Space_Grotesk,
  Nunito,
  Playfair_Display,
  JetBrains_Mono,
} from "next/font/google";
import "./globals.css";
import SiteHeader from "@/components/SiteHeader";
import Footer from "@/components/Footer";
import DesignSwitcher from "@/components/DesignSwitcher";

const inter = Inter({ subsets: ["latin", "latin-ext"], variable: "--font-inter" });
const grotesk = Space_Grotesk({ subsets: ["latin", "latin-ext"], variable: "--font-grotesk" });
const nunito = Nunito({ subsets: ["latin", "latin-ext"], variable: "--font-nunito" });
const playfair = Playfair_Display({ subsets: ["latin", "latin-ext"], variable: "--font-playfair" });
const jetbrains = JetBrains_Mono({ subsets: ["latin", "latin-ext"], variable: "--font-jetbrains" });

export const metadata: Metadata = {
  title: "František Novák — Junior Developer & Student PEF ČZU",
  description:
    "Propojuji software s hardwarem. Vyvíjím desktopové aplikace a custom herní tooling. Portfolio, projekt ChocoModrinth a kontakty.",
};

const noFlashScript = `(function(){try{var d=localStorage.getItem("design");if(d){document.documentElement.dataset.design=d;}}catch(e){}})();`;

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="cs"
      data-design="aurora"
      className={`${inter.variable} ${grotesk.variable} ${nunito.variable} ${playfair.variable} ${jetbrains.variable}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: noFlashScript }} />
      </head>
      <body>
        <SiteHeader />
        {children}
        <Footer />
        <DesignSwitcher />
      </body>
    </html>
  );
}
