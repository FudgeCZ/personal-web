import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

const MAX_SIZE = 120 * 1024 * 1024; // 120 MB na jednu 360° fotku
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

/**
 * Serverová brána pro přímý upload z prohlížeče do Vercel Blob.
 * Ověří PIN a omezí typ i velikost souboru; samotná fotka pak teče
 * z prohlížeče přímo do Blobu (obejde limit request body funkcí).
 */
export async function POST(request: Request): Promise<NextResponse> {
  const body = (await request.json()) as HandleUploadBody;

  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname, clientPayload) => {
        let pin = "";
        try {
          const payload = clientPayload ? (JSON.parse(clientPayload) as { pin?: string }) : {};
          pin = (payload.pin ?? "").trim();
        } catch {
          // ignoruj, pin zůstane prázdný a ověření selže
        }

        const expected = process.env.PANO_PIN;
        if (!expected) throw new Error("Nahrávání není na serveru nakonfigurované.");
        if (pin !== expected) throw new Error("Nesprávný PIN.");

        const ext = pathname.split(".").pop()?.toLowerCase() ?? "";
        if (!pathname.startsWith("360/") || !["jpg", "jpeg", "png", "webp"].includes(ext)) {
          throw new Error("Nepodporovaný soubor.");
        }

        return {
          allowedContentTypes: ALLOWED_TYPES,
          maximumSizeInBytes: MAX_SIZE,
          addRandomSuffix: false,
        };
      },
      onUploadCompleted: async ({ blob }) => {
        console.log(`[pano] Nahráno: ${blob.pathname}`);
      },
    });

    return NextResponse.json(jsonResponse);
  } catch (error) {
    const message =
      error instanceof Error && error.message
        ? error.message
        : "Nahrání se nezdařilo.";
    const status = message.includes("PIN") || message.includes("PIN.") ? 401 : 400;
    return NextResponse.json({ error: message }, { status });
  }
}
