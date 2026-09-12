import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./style.css";
import Header from "./components/Header";
import { Analytics } from "@vercel/analytics/next"

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
  description:
    "Osobní stránka - František Novák. Propojuji software s hardwarem.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="cs" suppressHydrationWarning className={`${geistSans.variable} ${geistMono.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{
          __html: `(function(){try{var t=localStorage.getItem("tema");if(t==="light"){document.documentElement.dataset.theme="light";}}catch(e){}})();`,
        }}/>
      </head>
      <body>
        <Header jmeno="František Novák" />
        {children}
      </body>
    </html>
  );
}
