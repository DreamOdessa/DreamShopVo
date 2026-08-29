import { ImageResponse } from "next/og";

export const alt = "DreamShop — натуральні фруктові чипси та смаколики";

export const contentType = "image/png";

export const size = {
  height: 630,
  width: 1200,
};

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          alignItems: "stretch",
          background:
            "radial-gradient(circle at 88% 10%, #dff5f1 0 12%, transparent 12.5%), radial-gradient(circle at 12% 90%, #c7ebe7 0 19%, transparent 19.5%), linear-gradient(135deg, #effaf7 0%, #d8f0ed 45%, #b6e1df 100%)",
          color: "#134952",
          display: "flex",
          flexDirection: "column",
          height: "100%",
          justifyContent: "space-between",
          padding: "62px 72px",
          width: "100%",
        }}
      >
        <div
          style={{
            color: "#0e6974",
            display: "flex",
            fontSize: 28,
            fontWeight: 700,
            letterSpacing: 4,
          }}
        >
          DREAMSHOP
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
          <div
            style={{
              color: "#a66a25",
              display: "flex",
              fontSize: 22,
              fontWeight: 700,
              letterSpacing: 2,
            }}
          >
            НАТУРАЛЬНІ СМАКИ
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 78,
              fontWeight: 800,
              letterSpacing: -2,
              lineHeight: 1,
            }}
          >
            Фруктові чипси
          </div>
          <div
            style={{
              color: "#376b72",
              display: "flex",
              fontSize: 32,
              lineHeight: 1.25,
              maxWidth: 760,
            }}
          >
            Натуральні смаколики для легких перекусів і красивих моментів.
          </div>
        </div>
        <div
          style={{
            borderTop: "2px solid rgba(19, 73, 82, 0.25)",
            color: "#2d6970",
            display: "flex",
            fontSize: 23,
            fontWeight: 600,
            paddingTop: 24,
          }}
        >
          ОДЕСА · УКРАЇНА
        </div>
      </div>
    ),
    size,
  );
}
