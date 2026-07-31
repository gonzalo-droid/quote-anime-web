import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const runtime = "nodejs";
export const alt = "Quote Anime — Frases del universo anime";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OgImage() {
  const logoData = await readFile(
    join(process.cwd(), "public/images/logo_white.png")
  );
  const logoSrc = `data:image/png;base64,${logoData.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundImage:
            "linear-gradient(135deg, #0C0C1E 0%, #0F0A2E 50%, #1A0A2E 100%)",
        }}
      >
        <img src={logoSrc} width={140} height={140} alt="" />
        <div
          style={{
            marginTop: 32,
            fontSize: 72,
            fontWeight: 700,
            color: "#F0EAFF",
            display: "flex",
          }}
        >
          Quote Anime
        </div>
        <div
          style={{
            marginTop: 16,
            fontSize: 32,
            color: "#A78BFA",
            display: "flex",
          }}
        >
          Frases del universo anime, en tu pantalla cada día
        </div>
      </div>
    ),
    { ...size }
  );
}
