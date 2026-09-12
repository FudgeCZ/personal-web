import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./style.css";
import Header from "./components/Header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "František Novák",
  description: "Osobní stránka - František Novák. Propojuji software s hardwarem.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="cs" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body>
        <Header jmeno="František Novák" />
        {children}
        
      </body>
    </html>
  );
}
