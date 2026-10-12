import { NextResponse } from "next/server";

export const runtime = "nodejs";

/**
 * Předkontrola PINu před uploadem. Vrací čitelnou chybu, kterou
 * klient zobrazí přímo (samotný handleUpload totiž hlášky zahodí).
 * Skutečná brána je znovu v /api/pano/upload.
 */
export async function POST(request: Request) {
  let pin = "";
  try {
    const body = (await request.json()) as { pin?: string };
    pin = (body.pin ?? "").trim();
  } catch {
    return NextResponse.json({ error: "Neplatný požadavek." }, { status: 400 });
  }

  const expected = process.env.PANO_PIN;
  if (!expected) {
    return NextResponse.json(
      { error: "Server nemá nastavený PIN (proměnná PANO_PIN), nahrávání je vypnuté." },
      { status: 503 }
    );
  }

  if (pin !== expected) {
    // malé zpomalení proti zkoušení PINů
    await new Promise((resolve) => setTimeout(resolve, 800));
    return NextResponse.json({ error: "Nesprávný PIN." }, { status: 401 });
  }

  return NextResponse.json({ ok: true });
}
