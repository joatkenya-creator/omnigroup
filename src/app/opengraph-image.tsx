import { ImageResponse } from "next/og";

// Default social-sharing image, generated at build time. Uses the temporary
// wordmark — regenerate with the approved logo once it is supplied.
export const alt = "OmniGroup HR — virtual assistant, HR and staffing services";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

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
          background: "#0c1e33",
          color: "#f3f1ec",
          fontFamily: "serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <span style={{ fontSize: 44 }}>OmniGroup</span>
          <span style={{ fontSize: 22, border: "2px solid #d7b46a", color: "#d7b46a", padding: "4px 10px", borderRadius: 6, fontFamily: "sans-serif", fontWeight: 700, letterSpacing: 3 }}>
            HR
          </span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div style={{ fontSize: 72, lineHeight: 1.08, maxWidth: 940 }}>Virtual assistants, HR support and specialist recruitment.</div>
          <div style={{ fontSize: 28, color: "#b6c2d1", fontFamily: "sans-serif" }}>Connecting talent. Empowering success.</div>
        </div>
        <div style={{ display: "flex", height: 6, width: 160, background: "#0d6b66" }} />
      </div>
    ),
    size,
  );
}
