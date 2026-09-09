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

Web má **4 kompletní designy** — liší se paletou, písmy i rozložením. Přepínač je fixní tlačítko vpravo dole (🎨). Zvolený design se ukládá do `localStorage` a přežije reload.

| Design     | Charakter                                  |
| ---------- | ------------------------------------------ |
| **Aurora** | Tmavá, gradienty, skleněné karty (výchozí) |
| **Čokoláda** | Teplé barvy v brandu ChocoModrinth       |
| **Minimal**  | Světlý editorial se serifovými nadpisy   |
| **Terminál** | Neonová zelená, monospace, scanlines     |

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

## Nasazení na Vercel

Staticky prerenderovaný Next.js projekt — stačí v [Vercelu](https://vercel.com) importovat tento repozitář (Vercel sám detekuje Next.js, bez konfigurace).
