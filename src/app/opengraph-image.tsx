import { ImageResponse } from "next/og";
import { SITE_CONFIG } from "@/lib/constants";

export const alt = `${SITE_CONFIG.name} — office & commercial furniture, Sri Lanka`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: 72,
        background: "#0F2235",
        color: "#F4F1EB",
        fontFamily: "Georgia, serif",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 18, fontSize: 28, letterSpacing: 6 }}>
        <div
          style={{
            width: 44,
            height: 44,
            background: "#02437B",
            borderRadius: 8,
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "flex-end",
          }}
        >
          <div style={{ width: 14, height: 14, background: "#F05A28", borderRadius: 3 }} />
        </div>
        RIALTO FURNITURE
      </div>
      <div
        style={{ display: "flex", flexDirection: "column", fontSize: 96, lineHeight: 1, letterSpacing: -3 }}
      >
        <span>Furniture for</span>
        <span style={{ display: "flex" }}>
          the way you<span style={{ color: "#F05A28", fontStyle: "italic", marginLeft: 24 }}>work.</span>
        </span>
      </div>
      <div style={{ display: "flex", fontSize: 24, opacity: 0.6, fontFamily: "sans-serif" }}>
        Office · Commercial · Education — delivered across Sri Lanka
      </div>
    </div>,
    size,
  );
}
