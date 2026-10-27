import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

// Default social-sharing image, generated at build time with the brand logo.
export const alt = "OmniGroup HR — virtual assistant, HR and staffing services";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Read at module level so the image is prerendered at build time (the Worker has no filesystem).
const logo = await readFile(join(process.cwd(), "public/brand/omnigroup-hr-logo.png"), "base64");

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background: "#22274f",
          color: "#ffffff",
          fontFamily: "sans-serif",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- ImageResponse renders plain <img> */}
        <img src={`data:image/png;base64,${logo}`} width={408} height={92} alt="" />
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div style={{ fontSize: 68, fontWeight: 700, lineHeight: 1.1, maxWidth: 980 }}>
            Virtual assistants, HR support and specialist recruitment.
          </div>
          <div style={{ fontSize: 28, color: "#c3c9e4" }}>Connecting talent. Empowering success.</div>
        </div>
        <div style={{ display: "flex", height: 6, width: 160, background: "#9bbdff" }} />
      </div>
    ),
    size,
  );
}
