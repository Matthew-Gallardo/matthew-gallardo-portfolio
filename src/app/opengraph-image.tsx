import { ImageResponse } from "next/og";

export const alt = "Matthew Gallardo — Backend Software Engineer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const dynamic = "force-static";

export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        padding: "76px",
        background: "#0C0E13",
        color: "#F2F4F8",
        fontFamily: "sans-serif",
      }}
    >
      <div
        style={{
          display: "flex",
          color: "#93C5FD",
          fontSize: 22,
          letterSpacing: 4,
        }}
      >
        BACKEND SOFTWARE ENGINEER
      </div>
      <div
        style={{
          display: "flex",
          fontSize: 74,
          marginTop: 42,
          letterSpacing: -3,
        }}
      >
        Matthew Gallardo<span style={{ color: "#93C5FD" }}>.</span>
      </div>
      <div
        style={{
          display: "flex",
          fontSize: 32,
          color: "#A5ADBD",
          marginTop: 24,
        }}
      >
        Building reliable digital payment services.
      </div>
      <div
        style={{
          display: "flex",
          borderTop: "1px solid #303847",
          marginTop: "auto",
          paddingTop: 24,
          justifyContent: "space-between",
          fontSize: 19,
          color: "#A5ADBD",
        }}
      >
        <span>Java / Spring Boot / Digital payments</span>
        <span>Quezon City, Philippines</span>
      </div>
    </div>,
    size,
  );
}
