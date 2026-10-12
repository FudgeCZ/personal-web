# Osobní web — František Novák

Osobní portfolio postavené v **Next.js** (App Router, TypeScript). Celý web je v češtině a obsahuje projekt [ChocoModrinth](https://github.com/FudgeCZ/choco-modrinth-app), soutěžní výsledky, technický stack a kontakty.

## Spuštění

```bash
npm install
npm run dev      # vývoj na http://localhost:3000
npm run build    # produkční build
npm run start    # serving produkčního buildu
```

Požadavky: Node.js (doporučena aktuální LTS/novější).

## Přepínač designů

Web má **5 kompletních designů** — liší se paletou, písmy i rozložením. Přepínač je fixní tlačítko vpravo dole (🎨). Zvolený design se ukládá do `localStorage` a přežije reload.

| Design     | Charakter                                            |
| ---------- | ---------------------------------------------------- |
| **Mokka**  | Tmavý mix Aurory a Čokolády — karamel & gradienty (výchozí) |
| **Aurora** | Tmavá, violet-cyan gradienty, skleněné karty         |
| **Čokoláda** | Teplé světlé barvy v brandu ChocoModrinthu         |
| **Minimal**  | Světlý editorial se serifovými nadpisy             |
| **Terminál** | Neonová zelená, monospace, scanlines               |

### Jak zafixovat finální design

1. V `app/layout.tsx` změň výchozí `data-design="aurora"` na vybraný design.
2. V `app/globals.css` přeneseš výchozí proměnné z bloku `:root` (Aurora) do požadovaného designu — nebo prostě nastav `data-design` a proměnné nech, atribut má přednost.
3. Přepínač odstraníš vynecháním `<DesignSwitcher />` v `app/page.tsx`.

## Struktura

```
app/
  layout.tsx     # fonty (next/font), metadata, proti-bliknutí skript
  page.tsx       # složení sekcí
  globals.css    # 4 témata přes [data-design] + responzivita
components/
  SiteHeader, Hero, About, Projects, Gallery (lightbox),
  Achievements, TechStack, Contact, Footer, DesignSwitcher
public/assets/   # logo + screenshoty ChocoModrinthu
```

Texty se upravují přímo v jednotlivých komponentách v `components/`.

## Podstránka 360° fotky

`/360` — galerie a sdílení 360° panoramat. Fotka se vyfotí panoramatickým režimem telefonu (iPhone: *Panorama*, Android: *Photo Sphere*), nahraje na stránku a dostane vlastní odkaz `/360/<nazev>`, který se dá sdílet. Prohlížeč (photo-sphere-viewer) funguje na mobilu i PC, na mobilu umí i gyroskop. Nahrávání chrání PIN, experimentálně umí stránka i vyfotit sérii snímků kamerou a slepit je v prohlížeči.

### Nasazení 360° (jednorázové nastavení)

1. **Vercel Blob** — v dashboardu projektu: *Storage → Create Database → Blob* a připojit k projektu. Tím se automaticky nastaví proměnná `BLOB_READ_WRITE_TOKEN` (aktivní po dalším deployi). Bez toho funguje prohlížeč a galerie, ale ne nahrávání.
2. **PIN na nahrávání** — v dashboardu: *Settings → Environment Variables* přidat `PANO_PIN` s vlastním tajným kódem.
3. **Lokálně** — `vercel link` a pak `vercel env pull .env.local` stáhne token; PIN doplň do `.env.local` (soubor je v `.gitignore`, necomituje se).

## Nasazení na Vercel

Staticky prerenderovaný Next.js projekt — stačí v [Vercelu](https://vercel.com) importovat tento repozitář (Vercel sám detekuje Next.js, bez konfigurace). Stránka `/360` se renderuje dynamicky (výpis galerie z Blobu).
