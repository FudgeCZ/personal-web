"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { upload } from "@vercel/blob/client";
import PanoCapture from "@/components/pano/PanoCapture";
import { randomSuffix, slugifyTitle } from "@/lib/pano";

type Status = "idle" | "checking" | "uploading" | "error";

const EXT_BY_TYPE: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

export default function PanoUpload({ disabled }: { disabled?: boolean }) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState("");
  const [pin, setPin] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [ratio, setRatio] = useState<number | null>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  // PIN si pamatujeme v rámci prohlížeče, stačí zadat jednou
  useEffect(() => {
    const saved = sessionStorage.getItem("pano-pin");
    if (saved) setPin(saved);
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function pickFile(f: File | null) {
    if (preview) URL.revokeObjectURL(preview);
    setFile(f);
    setError(null);
    if (!f) {
      setPreview(null);
      setRatio(null);
      return;
    }
    const url = URL.createObjectURL(f);
    setPreview(url);
    const img = new Image();
    img.onload = () => setRatio(img.naturalWidth / img.naturalHeight);
    img.src = url;
  }

  function ratioHint(r: number | null): { text: string; ok: boolean } | null {
    if (r === null) return null;
    if (r >= 1.9 && r <= 2.15)
      return { text: "Equirektangulární 360° panorama — ideální ✓", ok: true };
    if (r > 2.15)
      return { text: "Cylindrické panorama (např. Panorama na iPhonu) — zobrazí se svisle oříznuté, funguje.", ok: true };
    if (r >= 1.4)
      return { text: "Širší fotka — zobrazitelné, ale nebude to vypadat jako plná 360°.", ok: false };
    return { text: "Pozor: tohle nevypadá jako panorama. Prohlížeč to zobrazí, ale zkresleně.", ok: false };
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (disabled || status === "checking" || status === "uploading") return;
    if (!file) {
      setError("Nejdřív vyber fotku.");
      return;
    }
    setError(null);
    setStatus("checking");

    // 1) předkontrola PINu — samotný upload helper totiž zahodí detailní chybu
    try {
      sessionStorage.setItem("pano-pin", pin);
      const check = await fetch("/api/pano/pin", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ pin }),
      });
      if (!check.ok) {
        const data = (await check.json().catch(() => null)) as { error?: string } | null;
        setStatus("idle");
        setError(data?.error ?? "Nesprávný PIN.");
        return;
      }
    } catch {
      setStatus("idle");
      setError("Nepodařilo se spojit se serverem.");
      return;
    }

    // 2) upload přímo z prohlížeče do Blobu
    const ext = EXT_BY_TYPE[file.type];
    if (!ext) {
      setStatus("idle");
      setError("Podporované formáty: JPG, PNG, WebP.");
      return;
    }
    const pathname = `360/${randomSuffix()}-${slugifyTitle(title)}.${ext}`;

    setStatus("uploading");
    setProgress(0);
    try {
      const blob = await upload(pathname, file, {
        access: "public",
        handleUploadUrl: "/api/pano/upload",
        clientPayload: JSON.stringify({ pin }),
        onUploadProgress: (p) => {
          if (p.total > 0) setProgress(p.loaded / p.total);
        },
      });
      const id = blob.pathname.replace(/^360\//, "").replace(/\.[^.]+$/, "");
      router.push(`/360/${id}`);
    } catch {
      setStatus("idle");
      setError(
        "Nahrání se nezdařilo. Zkontroluj připojení a velikost souboru a zkus to znovu."
      );
    }
  }

  const hint = ratioHint(ratio);

  return (
    <form className="pano-upload" onSubmit={handleSubmit}>
      <h3>Nahrát novou 360° fotku</h3>
      <p className="pano-upload-sub">
        Vyfoď panorama mobilem (iPhone: <strong>Panorama</strong>, Android:{" "}
        <strong>Photo Sphere</strong> / <strong>360 Panorama</strong>), pak ho
        vyber tady.
      </p>

      <div className="pano-fields">
        <label className="pano-field">
          <span>Titulek</span>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="např. Pokoj v bytě"
            maxLength={60}
            disabled={disabled}
          />
        </label>

        <label className="pano-field">
          <span>PIN</span>
          <input
            type="password"
            inputMode="numeric"
            autoComplete="off"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            placeholder="PIN na nahrávání"
            disabled={disabled}
          />
        </label>
      </div>

      <div className="pano-file-row">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="pano-file-input"
          onChange={(e) => pickFile(e.target.files?.[0] ?? null)}
          disabled={disabled}
        />
        <button
          type="button"
          className="btn btn-outline"
          onClick={() => fileInputRef.current?.click()}
          disabled={disabled}
        >
          {file ? "Změnit fotku" : "Vybrat fotku"}
        </button>
        <span className="pano-file-name">
          {file ? `${file.name} (${(file.size / (1024 * 1024)).toFixed(1)} MB)` : "Žádný soubor"}
        </span>
      </div>

      <div className="pano-capture-row">
        <PanoCapture onFileReady={pickFile} />
      </div>

      {preview && (
        <div className="pano-preview">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={preview} alt="Náhled vybraného panoramatu" />
        </div>
      )}
      {hint && (
        <p className={`pano-hint ${hint.ok ? "is-ok" : "is-warn"}`}>{hint.text}</p>
      )}

      {status === "uploading" && (
        <div className="pano-progress" role="progressbar" aria-valuenow={Math.round(progress * 100)}>
          <div className="pano-progress-bar" style={{ width: `${Math.round(progress * 100)}%` }} />
          <span className="pano-progress-label">
            Nahrávám… {Math.round(progress * 100)} %
          </span>
        </div>
      )}

      {error && (
        <p className="pano-error" role="alert">
          {error}
        </p>
      )}

      <button
        type="submit"
        className="btn btn-primary"
        disabled={disabled || !file || status === "checking" || status === "uploading"}
      >
        {status === "uploading" ? "Nahrávám…" : "Nahrát na web"}
      </button>

      {disabled && (
        <p className="pano-hint is-warn">
          Nahrávání není aktivní — chybí propojení s Vercel Blob storage. Galerie
          i prohlížeč ale fungují, jakmile budou fotky existovat.
        </p>
      )}
    </form>
  );
}
