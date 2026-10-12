"use client";

import { useEffect, useRef, useState } from "react";
import { stitchPanorama } from "@/lib/pano-stitch";

const SHOTS = 8;

type Phase = "idle" | "live" | "stitching" | "done" | "error";

/**
 * Experimentální focení panoramata přímo na stránce: kamera + 8 snímků
 * otáčením telefonem, slepení proběhne v prohlížeči (lib/pano-stitch).
 * Výsledek předá rodiči jako soubor k běžnému nahrání.
 */
export default function PanoCapture({ onFileReady }: { onFileReady: (file: File) => void }) {
  const [open, setOpen] = useState(false);
  const [phase, setPhase] = useState<Phase>("idle");
  const [shots, setShots] = useState(0);
  const [progress, setProgress] = useState("");
  const [error, setError] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const framesRef = useRef<HTMLCanvasElement[]>([]);

  function stopStream() {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
  }

  useEffect(() => {
    return () => stopStream();
  }, []);

  async function openCamera() {
    setError(null);
    setShots(0);
    framesRef.current = [];
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: "environment" },
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        },
        audio: false,
      });
      streamRef.current = stream;
      setOpen(true);
      setPhase("live");
      // video element se vykreslí až po setOpen — připoj stream poté
      requestAnimationFrame(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play().catch(() => {});
        }
      });
    } catch {
      setError(
        "Kameru se nepodařilo zapnout. Focení na stránce vyžaduje oprávnění ke kameře a HTTPS."
      );
      setPhase("error");
      setOpen(true);
    }
  }

  function captureShot() {
    const video = videoRef.current;
    if (!video || !video.videoWidth || phase !== "live") return;
    const c = document.createElement("canvas");
    c.width = video.videoWidth;
    c.height = video.videoHeight;
    c.getContext("2d")!.drawImage(video, 0, 0);
    framesRef.current.push(c);
    setShots(framesRef.current.length);
    if (framesRef.current.length >= SHOTS) void finish();
  }

  async function finish() {
    stopStream();
    setPhase("stitching");
    setProgress("Připravuji…");
    await new Promise((r) => setTimeout(r, 60));
    try {
      const pano = await stitchPanorama(framesRef.current, (label, done, total) => {
        setProgress(`${label} ${done}/${total}`);
      });
      const blob = await new Promise<Blob | null>((res) => pano.toBlob(res, "image/jpeg", 0.92));
      if (!blob) throw new Error("Panorama se nepodařilo vyexportovat.");
      onFileReady(new File([blob], "panorama-z-stranky.jpg", { type: "image/jpeg" }));
      setPhase("done");
    } catch (e) {
      setError(
        e instanceof Error && e.message
          ? e.message
          : "Slepování selhalo. Zkus to znovu s pomalejším otáčením."
      );
      setPhase("error");
    }
  }

  function close() {
    stopStream();
    setOpen(false);
    setPhase("idle");
    setShots(0);
    setError(null);
  }

  return (
    <div className="pano-capture">
      <button
        type="button"
        className="btn btn-outline pano-capture-toggle"
        onClick={() => (open ? close() : void openCamera())}
      >
        {open ? "Zavřít focení" : "📷 Nebo vyfotit přímo na stránce (experiment)"}
      </button>

      {open && phase === "live" && (
        <div className="pano-capture-body">
          <div className="pano-cam-wrap">
            <video ref={videoRef} autoPlay playsInline muted className="pano-cam" />
            <div className="pano-cam-guide" aria-hidden="true">
              <span className="pano-cam-reticle" />
              <span className="pano-cam-marker" />
              <span className="pano-cam-arrow">→ toč doprava</span>
            </div>
          </div>
          <div className="pano-cam-bar">
            <span className="pano-cam-count">
              {shots}/{SHOTS} snímků · drž telefon rovně, namiř značku do středu a vyfoď
            </span>
            <button type="button" className="btn btn-primary" onClick={captureShot}>
              Vyfotit
            </button>
          </div>
        </div>
      )}

      {open && phase === "stitching" && (
        <p className="pano-hint is-ok">Slepím panoramatum… {progress}</p>
      )}

      {open && phase === "done" && (
        <p className="pano-hint is-ok">
          Hotovo! Panorama je připravené dole v náhledu — doplň titulek a nahraj.
        </p>
      )}

      {(error || phase === "error") && (
        <p className="pano-error" role="alert">
          {error ?? "Něco se pokazilo."}
        </p>
      )}
    </div>
  );
}
